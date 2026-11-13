const {
  buildRecordFromRazorpay,
  buildRecordFromRazorpayQr,
  isStaticQrPayment,
  upsertDonationRecord,
  fetchDonationByPaymentId,
} = require("./donationRecord");
const { fetchOrder, fetchPayment, razorpayRequest } = require("./razorpay");
const { isCapturedStatus } = require("./receiptRecord");
const { trySendReceiptEmail } = require("./receiptEmail");

/**
 * Razorpay payments created before this instant are the wiped test history.
 * They must not be stored, or they would take AADAR-2026-000001 again.
 * Override with DONATION_RECORD_AFTER (ISO timestamp) if the line needs to move.
 */
const DONATION_RECORD_AFTER_ISO = "2026-11-13T11:00:00.000Z";
const BEFORE_RECORD_CUTOFF = "before_record_cutoff";

function donationRecordAfterMs() {
  const fromEnv = String(process.env.DONATION_RECORD_AFTER || "").trim();
  const parsed = Date.parse(fromEnv || DONATION_RECORD_AFTER_ISO);
  return Number.isFinite(parsed) ? parsed : Date.parse(DONATION_RECORD_AFTER_ISO);
}

function paymentCreatedMs(payment) {
  const raw = payment && payment.created_at;
  if (raw == null || raw === "") return null;
  if (typeof raw === "string" && raw.includes("-")) {
    const parsed = Date.parse(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n < 1e12 ? n * 1000 : n;
}

function isBeforeDonationRecordCutoff(payment) {
  const createdMs = paymentCreatedMs(payment);
  if (createdMs == null) return false;
  return createdMs < donationRecordAfterMs();
}

/** One read so the two-hour copy still wakes Supabase without writing old payments. */
async function touchDonationStore() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  try {
    await fetch(`${base}/rest/v1/donations?select=id&limit=1`, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        Accept: "application/json",
      },
    });
  } catch {
    // Keep-alive only. A failed ping must not stop the copy.
  }
}

function resolveReceiptLocale(order, explicit) {
  if (explicit === "hi") return "hi";
  const notes = (order && order.notes) || {};
  return notes.donor_locale === "hi" ? "hi" : "en";
}

/**
 * Persist a captured Razorpay payment to Supabase and email the receipt when eligible.
 * Safe to call from verify, webhook, and confirm — merges rows and skips duplicate emails.
 *
 * @param {{ payment: object, order: object, source: string, locale?: string, sendEmail?: boolean, subscriptionId?: string, frequency?: string }} params
 * @returns {Promise<{ saved: boolean, reason?: string, row?: object, receiptEmail?: object }>}
 */
async function persistCapturedDonation({
  payment,
  order,
  source,
  locale,
  sendEmail = true,
  subscriptionId,
  frequency,
}) {
  if (!payment || !payment.id) {
    return { saved: false, reason: "missing_payment" };
  }
  if (isBeforeDonationRecordCutoff(payment)) {
    return { saved: false, reason: BEFORE_RECORD_CUTOFF };
  }

  const record = buildRecordFromRazorpay({ payment, order, source, subscriptionId, frequency });
  let saved = await upsertDonationRecord(record);
  if (!saved.saved) {
    saved = await upsertDonationRecord(record);
  }

  if (!saved.saved) {
    return saved;
  }

  let row = saved.row || (await fetchDonationByPaymentId(payment.id));
  if (!row) {
    return { saved: false, reason: "row_missing_after_save" };
  }

  let receiptEmail = { sent: false, reason: "skipped" };
  const emailLocale = resolveReceiptLocale(order, locale);
  if (sendEmail && isCapturedStatus(row.status)) {
    receiptEmail = await trySendReceiptEmail(row, { locale: emailLocale });
    if (!receiptEmail.sent) {
      // eslint-disable-next-line no-console
      console.warn("[donation-persist] receipt email not sent", {
        payment_id: payment.id,
        reason: receiptEmail.reason,
        detail: receiptEmail.detail,
      });
    } else {
      row = (await fetchDonationByPaymentId(payment.id)) || row;
    }
  }

  return {
    saved: true,
    row,
    created: saved.created,
    receiptEmail,
  };
}

/**
 * Persist a Razorpay Static QR (order-less) payment. Does not email a receipt —
 * donor PAN/address are almost never present on QR payments.
 */
async function persistRazorpayQrDonation({ payment, source = "razorpay_qr" }) {
  if (!payment || !payment.id) {
    return { saved: false, reason: "missing_payment" };
  }
  if (isBeforeDonationRecordCutoff(payment)) {
    return { saved: false, reason: BEFORE_RECORD_CUTOFF };
  }

  const record = buildRecordFromRazorpayQr({ payment, source });
  if (!record) {
    return { saved: false, reason: "invalid_qr_payment" };
  }

  let saved = await upsertDonationRecord(record);
  if (!saved.saved) {
    saved = await upsertDonationRecord(record);
  }
  if (!saved.saved) {
    return saved;
  }

  const row = saved.row || (await fetchDonationByPaymentId(payment.id));
  if (!row) {
    return { saved: false, reason: "row_missing_after_save" };
  }

  return {
    saved: true,
    row,
    created: saved.created,
    receiptEmail: { sent: false, reason: "qr_incomplete_donor" },
  };
}

/**
 * Copy captured Razorpay payments that never reached Supabase (QR has no browser return).
 * Does not email. Safe to run repeatedly.
 */
async function syncMissingCapturedPayments({ count = 100, pages = 2, paymentIds = [] } = {}) {
  const safeCount = Math.min(Math.max(Number(count) || 100, 1), 100);
  const safePages = Math.min(Math.max(Number(pages) || 1, 1), 3);
  const items = [];

  for (let pageIndex = 0; pageIndex < safePages; pageIndex += 1) {
    const skip = pageIndex * safeCount;
    const page = await razorpayRequest("GET", `/payments?count=${safeCount}&skip=${skip}`);
    const batch = Array.isArray(page && page.items) ? page.items : [];
    items.push(...batch);
    if (batch.length < safeCount) break;
  }

  const seen = new Set(items.map((payment) => payment && payment.id).filter(Boolean));
  for (const rawId of paymentIds) {
    const paymentId = String(rawId || "").trim();
    if (!/^pay_[A-Za-z0-9]+$/.test(paymentId) || seen.has(paymentId)) continue;
    seen.add(paymentId);
    try {
      const payment = await fetchPayment(paymentId);
      if (payment && payment.id) items.unshift(payment);
    } catch {
      items.unshift({ id: paymentId, status: "fetch_failed" });
    }
  }

  await touchDonationStore();

  const results = [];

  for (const payment of items) {
    if (!payment || !payment.id) continue;
    const status = String(payment.status || "").toLowerCase();
    if (status === "fetch_failed") {
      results.push({ payment_id: payment.id, action: "failed", reason: "fetch_failed" });
      continue;
    }
    if (status !== "captured") continue;
    if (isBeforeDonationRecordCutoff(payment)) {
      results.push({
        payment_id: payment.id,
        action: "skipped",
        reason: BEFORE_RECORD_CUTOFF,
      });
      continue;
    }

    const existing = await fetchDonationByPaymentId(payment.id);
    if (existing) {
      results.push({ payment_id: payment.id, action: "exists", receipt_no: existing.receipt_no || null });
      continue;
    }

    let persisted;
    if (isStaticQrPayment(payment) || !payment.order_id) {
      persisted = await persistRazorpayQrDonation({ payment, source: "razorpay_qr" });
    } else {
      try {
        const order = await fetchOrder(payment.order_id);
        persisted = await persistCapturedDonation({
          payment,
          order,
          source: "razorpay_sync",
          sendEmail: false,
        });
      } catch {
        persisted = await persistRazorpayQrDonation({ payment, source: "razorpay_qr" });
      }
    }

    results.push({
      payment_id: payment.id,
      action: persisted && persisted.saved ? "saved" : "failed",
      reason: persisted && persisted.reason ? persisted.reason : null,
      receipt_no: persisted && persisted.row ? persisted.row.receipt_no || null : null,
    });
  }

  return {
    checked: items.length,
    saved: results.filter((row) => row.action === "saved").map((row) => row.payment_id),
    skipped: results.filter((row) => row.action === "skipped").length,
    failed: results.filter((row) => row.action === "failed"),
    existing: results.filter((row) => row.action === "exists").length,
  };
}

module.exports = {
  BEFORE_RECORD_CUTOFF,
  isBeforeDonationRecordCutoff,
  persistCapturedDonation,
  persistRazorpayQrDonation,
  syncMissingCapturedPayments,
};
