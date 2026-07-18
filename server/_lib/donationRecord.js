/**
 * Optional permanent donation log (Supabase). When env vars are unset, records stay
 * in Razorpay Dashboard + donor sessionStorage only (MVP).
 */

const { isProduction } = require("./donation");

const DONATION_SELECT_FIELDS =
  "payment_id,order_id,receipt_no,amount_paise,currency,status,donor_name,donor_father_or_husband,donor_email,donor_contact,donor_pan,donor_address,donor_state,donor_city,donor_pin,program_label,purpose,fcra_declaration,payment_method,source,subscription_id,is_recurring,frequency,created_at,receipt_email_sent_at";

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

/**
 * Build a row from Razorpay payment + order notes.
 * `subscriptionId`/`frequency` are passed explicitly (not read from notes) for recurring
 * membership charges — see api/membership-subscription-verify.js and the webhook handler.
 */
function buildRecordFromRazorpay({ payment, order, source, subscriptionId, frequency }) {
  const notes = {
    ...(order && order.notes),
    ...(payment && payment.notes),
  };

  const paymentMethod = payment && payment.method ? String(payment.method).toLowerCase() : "";

  return {
    payment_id: payment.id,
    order_id: payment.order_id,
    receipt_no: (order && order.receipt) || "",
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
    program_label: pickNote(notes, "purpose"),
    purpose: pickNote(notes, "note"),
    fcra_declaration: pickNote(notes, "fcra_declaration"),
    payment_method: paymentMethod,
    source: source || "webhook",
    subscription_id: subscriptionId || null,
    is_recurring: !!subscriptionId,
    frequency: frequency || null,
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
    receipt_no: pick("receipt_no") || incoming.receipt_no,
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
    subscription_id: incoming.subscription_id || existing.subscription_id || null,
    is_recurring: incoming.is_recurring || existing.is_recurring || false,
    frequency: incoming.frequency || existing.frequency || null,
    updated_at: new Date().toISOString(),
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
    const url = `${base}/rest/v1/donations?on_conflict=payment_id`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: storeHeaders("resolution=ignore-duplicates,return=representation"),
        body: JSON.stringify(record),
      });

      if (res.ok) {
        const rows = await res.json().catch(() => []);
        const row = Array.isArray(rows) ? rows[0] : null;
        return { saved: true, created: true, row: row || record };
      }

      if (res.status === 409) {
        const raced = await fetchDonationByPaymentId(record.payment_id);
        if (raced) {
          const merged = mergeDonationRows(raced, record);
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
      }

      const text = await res.text().catch(() => "");
      logSaveFailure("Supabase insert failed", {
        status: res.status,
        payment_id: record.payment_id,
        detail: text.slice(0, 200),
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

  const merged = mergeDonationRows(existing, record);
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
  fetchDonationByPaymentId,
  fetchDonationsByContact,
  upsertDonationRecord,
  saveDonationRecord,
  markReceiptEmailSent,
  updateDonationRecordStatus,
};
