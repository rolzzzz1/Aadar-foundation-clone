/**
 * Optional permanent donation log (Supabase). When env vars are unset, records stay
 * in Razorpay Dashboard + donor sessionStorage only (MVP).
 *
 * Table `donations` (create in Supabase SQL editor):
 *
 * create table donations (
 *   id bigint generated always as identity primary key,
 *   payment_id text unique not null,
 *   order_id text not null,
 *   amount_paise integer not null,
 *   currency text not null default 'INR',
 *   status text not null,
 *   donor_name text,
 *   donor_email text,
 *   donor_contact text,
 *   donor_pan text,
 *   program_label text,
 *   purpose text,
 *   source text not null,
 *   created_at timestamptz not null default now()
 * );
 */

const { isProduction } = require("./donation");

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
    amount_paise: Number(payment.amount),
    currency: payment.currency || "INR",
    status: payment.status,
    donor_name: pickNote(notes, "donor_name"),
    donor_email: pickNote(notes, "donor_email"),
    donor_contact: pickNote(notes, "donor_contact"),
    donor_pan: pickNote(notes, "donor_pan"),
    program_label: pickNote(notes, "purpose"),
    purpose: pickNote(notes, "note"),
    source: source || "webhook",
  };
}

/**
 * Insert donation row (idempotent on payment_id via Prefer header).
 * @returns {Promise<{ saved: boolean, reason?: string }>}
 */
async function saveDonationRecord(record) {
  if (!isStoreConfigured()) {
    if (!isProduction()) {
      // eslint-disable-next-line no-console
      console.log("[donation] store not configured — skipping save", record.payment_id);
    }
    return { saved: false, reason: "not_configured" };
  }

  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const url = `${base}/rest/v1/donations`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(record),
    });

    if (res.ok || res.status === 409) {
      return { saved: true };
    }

    const text = await res.text().catch(() => "");
    if (!isProduction()) {
      // eslint-disable-next-line no-console
      console.error("[donation] Supabase insert failed", res.status, text);
    }
    return { saved: false, reason: "store_error" };
  } catch (err) {
    if (!isProduction()) {
      // eslint-disable-next-line no-console
      console.error("[donation] Supabase insert error", err);
    }
    return { saved: false, reason: "store_error" };
  }
}

module.exports = {
  isStoreConfigured,
  buildRecordFromRazorpay,
  saveDonationRecord,
};
