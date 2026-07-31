const {
  buildRecordFromRazorpay,
  buildRecordFromRazorpayQr,
  upsertDonationRecord,
  fetchDonationByPaymentId,
} = require("./donationRecord");
const { isCapturedStatus } = require("./receiptRecord");
const { trySendReceiptEmail } = require("./receiptEmail");

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

  const record = buildRecordFromRazorpay({ payment, order, source, subscriptionId, frequency });
  const saved = await upsertDonationRecord(record);

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

  const record = buildRecordFromRazorpayQr({ payment, source });
  if (!record) {
    return { saved: false, reason: "invalid_qr_payment" };
  }

  const saved = await upsertDonationRecord(record);
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

module.exports = {
  persistCapturedDonation,
  persistRazorpayQrDonation,
};
