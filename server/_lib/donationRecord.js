/**
 * Optional permanent donation log (Supabase). When env vars are unset, records stay
 * in Razorpay Dashboard + donor sessionStorage only (MVP).
 */

const { isProduction, formatGeneralDonationLabel } = require("./donation");
const {
  isOfficialReceiptNo,
  allocateOfficialReceiptNo,
  resolveReceiptNo,
  parseOfficialReceiptNo,
} = require("./receiptNumber");

const DONATION_SELECT_FIELDS =
  "payment_id,order_id,receipt_no,amount_paise,currency,status,donor_name,donor_father_or_husband,donor_email,donor_contact,donor_pan,donor_address,donor_state,donor_city,donor_pin,program_label,purpose,fcra_declaration,payment_method,source,created_at,receipt_email_sent_at";

/** Extra columns from supabase/membership.sql — only written when present on the row. */
const DONATION_MEMBERSHIP_FIELDS = ["subscription_id", "is_recurring", "frequency"];

function isStoreConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function pickNote(notes, key) {
  if (!notes || typeof notes !== "object") return "";
  const v = notes[key];
  return v == null ? "" : String(v).slice(0, 500);
}

function hasText(value) {
  return value != null && String(value).trim() !== "";
}

/** Normalize Razorpay payment.method (with field fallbacks). */
function extractPaymentMethod(payment) {
  if (!payment || typeof payment !== "object") return "";
  const direct = String(payment.method || "")
    .trim()
    .toLowerCase();
  if (direct) return direct;
  if (payment.upi || payment.vpa) return "upi";
  if (payment.card) return "card";
  if (payment.wallet) return "wallet";
  if (payment.bank) return "netbanking";
  return "";
}

/** Drop membership columns so inserts work before membership.sql has been applied. */
function stripUnsetMembershipFields(record) {
  if (!record || typeof record !== "object") return record;
  const out = { ...record };
  const hasSubscription = hasText(out.subscription_id);
  if (!hasSubscription) {
    DONATION_MEMBERSHIP_FIELDS.forEach((field) => {
      delete out[field];
    });
  }
  return out;
}

/** Razorpay order notes / payment notes are objects; webhook payloads sometimes send []. */
function coerceNotes(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}

/** UTR / RRN from UPI acquirer data (Static QR / UPI). */
function extractPaymentUtr(payment) {
  if (!payment || typeof payment !== "object") return "";
  const acquirer = payment.acquirer_data;
  if (acquirer && typeof acquirer === "object") {
    const rrn = acquirer.rrn || acquirer.upi_transaction_id || acquirer.transaction_id;
    if (rrn) return String(rrn).trim();
  }
  return "";
}

/** Drop Razorpay placeholder emails that are not real donor contacts. */
function sanitizeRazorpayEmail(email) {
  const e = String(email || "")
    .trim()
    .toLowerCase();
  if (!e || !e.includes("@")) return "";
  if (e.includes("void@") || e.endsWith("@razorpay.com")) return "";
  return e.slice(0, 254);
}

function sanitizeRazorpayContact(contact) {
  const digits = String(contact || "").replace(/\D/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return "";
}

/**
 * Build a row from Razorpay payment + order notes.
 * `subscriptionId`/`frequency` are passed explicitly (not read from notes) for recurring
 * membership charges — see api/membership-subscription-verify.js and the webhook handler.
 */
function buildRecordFromRazorpay({ payment, order, source, subscriptionId, frequency }) {
  const notes = {
    ...coerceNotes(order && order.notes),
    ...coerceNotes(payment && payment.notes),
  };

  const paymentMethod = extractPaymentMethod(payment);

  const record = {
    payment_id: payment.id,
    order_id: payment.order_id,
    // Official AADAR-YYYY-###### is assigned at upsert time (not Razorpay order.receipt).
    receipt_no: "",
    amount_paise: Number(payment.amount),
    currency: payment.currency || "INR",
    status: payment.status,
    donor_name: pickNote(notes, "donor_name"),
    donor_father_or_husband: pickNote(notes, "donor_father_or_husband"),
    donor_email: pickNote(notes, "donor_email"),
    donor_contact: pickNote(notes, "donor_contact"),
    donor_pan: pickNote(notes, "donor_pan"),
    donor_address: pickNote(notes, "donor_address"),
    donor_state: pickNote(notes, "donor_state"),
    donor_city: pickNote(notes, "donor_city"),
    donor_pin: pickNote(notes, "donor_pin"),
    program_label:
      pickNote(notes, "purpose") ||
      formatGeneralDonationLabel(Math.round(Number(payment.amount) / 100)),
    purpose: pickNote(notes, "note") || pickNote(notes, "purpose") ||
      formatGeneralDonationLabel(Math.round(Number(payment.amount) / 100)),
    fcra_declaration: pickNote(notes, "fcra_declaration") || "",
    payment_method: paymentMethod,
    source: source || "webhook",
    updated_at: new Date().toISOString(),
  };

  if (subscriptionId) {
    record.subscription_id = subscriptionId;
    record.is_recurring = true;
    record.frequency = frequency || null;
  }

  return record;
}

/**
 * Build a donations row for Razorpay Static QR (and other order-less) payments.
 * Donor KYC (PAN, address, etc.) is usually missing — receipt email should not be sent
 * until an admin/donor fills those fields.
 */
function buildRecordFromRazorpayQr({ payment, source }) {
  if (!payment || !payment.id) return null;

  const amountPaise = Number(payment.amount);
  if (!Number.isFinite(amountPaise) || amountPaise <= 0) return null;

  const status = String(payment.status || "").toLowerCase();
  if (status !== "captured") return null;

  const utr = extractPaymentUtr(payment);
  const vpa = String(payment.vpa || "").trim();
  const amountInr = Math.round(amountPaise / 100);
  const label = formatGeneralDonationLabel(amountInr);
  const purposeParts = ["Razorpay Static QR donation"];
  if (utr) purposeParts.push(`UTR ${utr}`);
  if (vpa) purposeParts.push(`VPA ${vpa}`);

  const createdAt =
    payment.created_at != null && Number.isFinite(Number(payment.created_at))
      ? new Date(Number(payment.created_at) * 1000).toISOString()
      : new Date().toISOString();

  const method = extractPaymentMethod(payment);
  const paymentMethod = method === "upi" || !method ? "upi_qr" : method;

  return {
    payment_id: payment.id,
    order_id: "razorpay_qr",
    receipt_no: "",
    amount_paise: amountPaise,
    currency: payment.currency || "INR",
    status: "captured",
    donor_name: "",
    donor_father_or_husband: "",
    donor_email: sanitizeRazorpayEmail(payment.email),
    donor_contact: sanitizeRazorpayContact(payment.contact),
    donor_pan: "",
    donor_address: "",
    donor_state: "",
    donor_city: "",
    donor_pin: "",
    program_label: label,
    purpose: purposeParts.join(" · ").slice(0, 240),
    fcra_declaration: "",
    payment_method: paymentMethod,
    source: source || "razorpay_qr",
    created_at: createdAt,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Prefer incoming non-empty values; always accept captured status from Razorpay.
 */
function mergeDonationRows(existing, incoming) {
  const pick = (field) => (hasText(incoming[field]) ? incoming[field] : existing[field]);

  const existingStatus = String(existing.status || "").toLowerCase();
  const incomingStatus = String(incoming.status || "").toLowerCase();
  let status = existing.status || incoming.status;
  if (incomingStatus === "captured") status = "captured";
  else if (!existingStatus && incomingStatus) status = incoming.status;

  return {
    payment_id: incoming.payment_id,
    order_id: pick("order_id") || incoming.order_id,
    receipt_no: resolveReceiptNo(existing.receipt_no, incoming.receipt_no),
    amount_paise: Number(incoming.amount_paise) || Number(existing.amount_paise) || 0,
    currency: incoming.currency || existing.currency || "INR",
    status,
    donor_name: pick("donor_name"),
    donor_father_or_husband: pick("donor_father_or_husband"),
    donor_email: pick("donor_email"),
    donor_contact: pick("donor_contact"),
    donor_pan: pick("donor_pan"),
    donor_address: pick("donor_address"),
    donor_state: pick("donor_state"),
    donor_city: pick("donor_city"),
    donor_pin: pick("donor_pin"),
    program_label: pick("program_label"),
    purpose: pick("purpose"),
    fcra_declaration: pick("fcra_declaration"),
    payment_method: pick("payment_method"),
    source: incoming.source || existing.source,
    updated_at: new Date().toISOString(),
    ...(hasText(incoming.subscription_id) || hasText(existing.subscription_id)
      ? {
          subscription_id: incoming.subscription_id || existing.subscription_id || null,
          is_recurring: incoming.is_recurring || existing.is_recurring || false,
          frequency: incoming.frequency || existing.frequency || null,
        }
      : {}),
  };
}

function logSaveFailure(message, details) {
  // eslint-disable-next-line no-console
  console.error("[donation]", message, details);
}

function storeHeaders(extraPrefer) {
  return {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    Prefer: extraPrefer || "return=minimal",
  };
}

/**
 * Fetch one donation row by payment_id.
 * @returns {Promise<object|null>}
 */
async function fetchDonationByPaymentId(paymentId) {
  if (!isStoreConfigured() || !paymentId) return null;

  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const url = `${base}/rest/v1/donations?payment_id=eq.${encodeURIComponent(
    paymentId
  )}&select=${DONATION_SELECT_FIELDS}&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      if (!isProduction()) {
        const text = await res.text().catch(() => "");
        // eslint-disable-next-line no-console
        console.warn("[donation] Supabase fetch failed", {
          payment_id: paymentId,
          status: res.status,
          details: text.slice(0, 200),
        });
      }
      return null;
    }
    const rows = await res.json().catch(() => []);
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  } catch (err) {
    if (!isProduction()) {
      // eslint-disable-next-line no-console
      console.warn("[donation] Supabase fetch error", {
        payment_id: paymentId,
        message: err && err.message ? err.message : String(err),
      });
    }
    return null;
  }
}

/**
 * Insert or merge donation row by payment_id.
 * New rows receive an official AADAR-YYYY-###### receipt_no when missing.
 * @returns {Promise<{ saved: boolean, reason?: string, row?: object, created?: boolean }>}
 */
async function upsertDonationRecord(record) {
  if (!isStoreConfigured()) {
    logSaveFailure("store not configured — skipping save", {
      payment_id: record && record.payment_id,
    });
    return { saved: false, reason: "not_configured" };
  }
  if (!record || !record.payment_id) {
    return { saved: false, reason: "missing_payment_id" };
  }

  const existing = await fetchDonationByPaymentId(record.payment_id);
  const base = process.env.SUPABASE_URL.replace(/\/$/, "");

  if (!existing) {
    const maxAttempts = 6;
    let minSeq = 1;
    let lastStatus = 0;
    let lastDetail = "";

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const payload = stripUnsetMembershipFields({ ...record });
      if (!isOfficialReceiptNo(payload.receipt_no)) {
        payload.receipt_no = await allocateOfficialReceiptNo({
          paidAt: payload.created_at || payload.updated_at,
          minSeq,
        });
      }

      try {
        const url = `${base}/rest/v1/donations?on_conflict=payment_id`;
        const res = await fetch(url, {
          method: "POST",
          headers: storeHeaders("resolution=ignore-duplicates,return=representation"),
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const rows = await res.json().catch(() => []);
          const row = Array.isArray(rows) ? rows[0] : null;
          // ignore-duplicates can return empty representation when payment_id already exists
          if (!row) {
            const raced = await fetchDonationByPaymentId(record.payment_id);
            if (raced) {
              return { saved: true, created: false, row: raced };
            }
          }
          return { saved: true, created: true, row: row || payload };
        }

        lastStatus = res.status;
        lastDetail = await res.text().catch(() => "");

        if (res.status === 409) {
          const raced = await fetchDonationByPaymentId(record.payment_id);
          if (raced) {
            const merged = stripUnsetMembershipFields(mergeDonationRows(raced, record));
            const patchUrl = `${base}/rest/v1/donations?payment_id=eq.${encodeURIComponent(
              record.payment_id
            )}`;
            const patchRes = await fetch(patchUrl, {
              method: "PATCH",
              headers: storeHeaders("return=representation"),
              body: JSON.stringify(merged),
            });
            if (patchRes.ok) {
              const rows = await patchRes.json().catch(() => []);
              const row = Array.isArray(rows) ? rows[0] : merged;
              return { saved: true, created: false, row };
            }
          }
          // Likely receipt_no unique collision — bump sequence and retry
          const parsed = parseOfficialReceiptNo(payload.receipt_no);
          minSeq = parsed ? parsed.seq + 1 : minSeq + 1;
          continue;
        }

        logSaveFailure("Supabase insert failed", {
          status: res.status,
          payment_id: record.payment_id,
          detail: lastDetail.slice(0, 200),
        });
        return { saved: false, reason: `store_error_${res.status}` };
      } catch (err) {
        logSaveFailure("Supabase insert error", {
          payment_id: record.payment_id,
          message: err && err.message ? err.message : String(err),
        });
        return { saved: false, reason: "store_error" };
      }
    }

    logSaveFailure("Supabase insert failed after receipt_no retries", {
      status: lastStatus,
      payment_id: record.payment_id,
      detail: lastDetail.slice(0, 200),
    });
    return { saved: false, reason: `store_error_${lastStatus || "retry"}` };
  }

  const merged = stripUnsetMembershipFields(mergeDonationRows(existing, record));
  const url = `${base}/rest/v1/donations?payment_id=eq.${encodeURIComponent(record.payment_id)}`;

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: storeHeaders("return=representation"),
      body: JSON.stringify(merged),
    });

    if (res.ok) {
      const rows = await res.json().catch(() => []);
      const row = Array.isArray(rows) ? rows[0] : merged;
      return { saved: true, created: false, row };
    }

    const text = await res.text().catch(() => "");
    logSaveFailure("Supabase merge patch failed", {
      status: res.status,
      payment_id: record.payment_id,
      detail: text.slice(0, 200),
    });
    return { saved: false, reason: `store_error_${res.status}` };
  } catch (err) {
    logSaveFailure("Supabase merge patch error", {
      payment_id: record.payment_id,
      message: err && err.message ? err.message : String(err),
    });
    return { saved: false, reason: "store_error" };
  }
}

/** @deprecated Use upsertDonationRecord */
async function saveDonationRecord(record) {
  return upsertDonationRecord(record);
}

/**
 * Mark receipt email as sent (idempotent).
 * @returns {Promise<{ saved: boolean, reason?: string }>}
 */
async function markReceiptEmailSent(paymentId) {
  if (!isStoreConfigured()) {
    return { saved: false, reason: "not_configured" };
  }
  if (!paymentId) {
    return { saved: false, reason: "missing_payment_id" };
  }

  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const url = `${base}/rest/v1/donations?payment_id=eq.${encodeURIComponent(
    paymentId
  )}&receipt_email_sent_at=is.null`;

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: storeHeaders("return=representation"),
      body: JSON.stringify({
        receipt_email_sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      const rows = await res.json().catch(() => []);
      if (Array.isArray(rows) && rows.length === 0) {
        return { saved: false, reason: "already_sent" };
      }
      return { saved: true };
    }

    const text = await res.text().catch(() => "");
    logSaveFailure("Supabase receipt_email_sent_at patch failed", {
      status: res.status,
      payment_id: paymentId,
      detail: text.slice(0, 200),
    });
    return { saved: false, reason: `store_error_${res.status}` };
  } catch (err) {
    logSaveFailure("Supabase receipt_email_sent_at patch error", {
      payment_id: paymentId,
      message: err && err.message ? err.message : String(err),
    });
    return { saved: false, reason: "store_error" };
  }
}

/**
 * Patch donation row by payment_id (refunds, failures, disputes).
 * @returns {Promise<{ saved: boolean, reason?: string }>}
 */
async function updateDonationRecordStatus(paymentId, patch) {
  if (!isStoreConfigured()) {
    return { saved: false, reason: "not_configured" };
  }
  if (!paymentId) {
    return { saved: false, reason: "missing_payment_id" };
  }

  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const url = `${base}/rest/v1/donations?payment_id=eq.${encodeURIComponent(paymentId)}`;

  const body = {
    ...patch,
    updated_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: storeHeaders(),
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return { saved: true };
    }

    const text = await res.text().catch(() => "");
    logSaveFailure("Supabase patch failed", {
      status: res.status,
      payment_id: paymentId,
      detail: text.slice(0, 200),
    });
    return { saved: false, reason: `store_error_${res.status}` };
  } catch (err) {
    logSaveFailure("Supabase patch error", {
      payment_id: paymentId,
      message: err && err.message ? err.message : String(err),
    });
    return { saved: false, reason: "store_error" };
  }
}

/**
 * List captured donations for a donor email or mobile (newest first).
 * @returns {Promise<object[]>}
 */
async function fetchDonationsByContact(contact, limit = 25) {
  if (!isStoreConfigured() || !contact?.ok) return [];

  const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 25);
  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const filter =
    contact.type === "email"
      ? `donor_email=eq.${encodeURIComponent(contact.value)}`
      : `donor_contact=eq.${encodeURIComponent(contact.value)}`;

  const url = `${base}/rest/v1/donations?${filter}&status=eq.captured&select=payment_id,receipt_no,amount_paise,currency,status,program_label,purpose,source,created_at&order=created_at.desc&limit=${safeLimit}`;

  try {
    const res = await fetch(url, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      if (!isProduction()) {
        const text = await res.text().catch(() => "");
        // eslint-disable-next-line no-console
        console.warn("[donation] Supabase list by contact failed", {
          status: res.status,
          details: text.slice(0, 200),
        });
      }
      return [];
    }
    const rows = await res.json().catch(() => []);
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    if (!isProduction()) {
      // eslint-disable-next-line no-console
      console.warn("[donation] Supabase list by contact error", {
        message: err && err.message ? err.message : String(err),
      });
    }
    return [];
  }
}

module.exports = {
  isStoreConfigured,
  buildRecordFromRazorpay,
  buildRecordFromRazorpayQr,
  extractPaymentMethod,
  extractPaymentUtr,
  fetchDonationByPaymentId,
  fetchDonationsByContact,
  upsertDonationRecord,
  saveDonationRecord,
  markReceiptEmailSent,
  updateDonationRecordStatus,
};
