/**
 * Optional permanent donation log (Supabase). When env vars are unset, records stay
 * in Razorpay Dashboard + donor sessionStorage only (MVP).
 */

function isStoreConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function pickNote(notes, key) {
  if (!notes || typeof notes !== "object") return "";
  const v = notes[key];
  return v == null ? "" : String(v).slice(0, 500);
}

/**
 * Build a row from Razorpay payment + order notes.
 */
function buildRecordFromRazorpay({ payment, order, source }) {
  const notes = {
    ...(order && order.notes),
    ...(payment && payment.notes),
  };

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
    source: source || "webhook",
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
 * Insert donation row (idempotent on payment_id).
 * @returns {Promise<{ saved: boolean, reason?: string }>}
 */
async function saveDonationRecord(record) {
  if (!isStoreConfigured()) {
    logSaveFailure("store not configured — skipping save", {
      payment_id: record && record.payment_id,
    });
    return { saved: false, reason: "not_configured" };
  }

  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const url = `${base}/rest/v1/donations?on_conflict=payment_id`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: storeHeaders("resolution=ignore-duplicates,return=minimal"),
      body: JSON.stringify(record),
    });

    if (res.ok || res.status === 409) {
      return { saved: true };
    }

    const text = await res.text().catch(() => "");
    const snippet = text.slice(0, 200);
    logSaveFailure("Supabase insert failed", {
      status: res.status,
      payment_id: record.payment_id,
      detail: snippet,
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

module.exports = {
  isStoreConfigured,
  buildRecordFromRazorpay,
  saveDonationRecord,
  updateDonationRecordStatus,
};
