const { sanitizeText, NAME_MAX, EMAIL_MAX } = require("./donation");

const UTR_MIN = 10;
const UTR_MAX = 22;
const UTR_REGEX = /^[A-Z0-9]{10,22}$/;

function normalizeUtr(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, UTR_MAX);
}

function validateUtr(value) {
  const normalized = normalizeUtr(value);
  if (normalized.length < UTR_MIN || !UTR_REGEX.test(normalized)) {
    return { ok: false, value: normalized, error: "Invalid UPI transaction reference." };
  }
  return { ok: true, value: normalized };
}

function upiPaymentId(utr) {
  return `upi_${normalizeUtr(utr)}`;
}

function parsePaidAt(value) {
  if (!value) return null;
  const raw = String(value).trim();
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(raw);
  const parsed = new Date(dateOnly ? `${raw}T12:00:00.000Z` : raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function validatePaidAt(value) {
  const parsed = parsePaidAt(value);
  if (!parsed) return { ok: false, error: "Invalid payment date." };

  const now = Date.now();
  const twoYearsMs = 730 * 24 * 60 * 60 * 1000;
  if (parsed.getTime() > now + 24 * 60 * 60 * 1000) {
    return { ok: false, error: "Payment date cannot be in the future." };
  }
  if (parsed.getTime() < now - twoYearsMs) {
    return { ok: false, error: "Payment date is too old." };
  }

  return { ok: true, value: parsed.toISOString() };
}

function normalizePan(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
}

function normalizeContact(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

function buildUpiDonationRecord(body) {
  const utrCheck = validateUtr(body.utr || body.transaction_ref || body.upi_ref);
  if (!utrCheck.ok) return { ok: false, error: utrCheck.error };

  const amountInr = Math.round(Number(body.amount_inr ?? body.amountInr ?? body.amount));
  if (!Number.isFinite(amountInr) || amountInr < 1 || amountInr > 500000) {
    return { ok: false, error: "Invalid donation amount." };
  }

  const paidAtCheck = validatePaidAt(body.paid_at || body.paidAt);
  if (!paidAtCheck.ok) return { ok: false, error: paidAtCheck.error };

  const pan = normalizePan(body.donor_pan || body.pan);
  if (pan.length !== 10) return { ok: false, error: "Invalid PAN." };

  const name = sanitizeText(body.donor_name || body.name || "", NAME_MAX);
  if (!name) return { ok: false, error: "Donor name is required." };

  const contact = normalizeContact(body.donor_contact || body.contact || body.mobile);
  if (contact.length !== 10) return { ok: false, error: "Invalid mobile number." };

  const email = sanitizeText(body.donor_email || body.email || "", EMAIL_MAX).toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Valid email is required." };
  }

  const address = sanitizeText(body.donor_address || body.address || "", 200);
  const state = sanitizeText(body.donor_state || body.state || "", 80);
  const city = sanitizeText(body.donor_city || body.city || "", 80);
  const pin = sanitizeText(body.donor_pin || body.pin || "", 6);
  if (!address || !state || !city || pin.length !== 6) {
    return { ok: false, error: "Complete address is required for the receipt." };
  }

  const utr = utrCheck.value;
  const paymentId = upiPaymentId(utr);

  return {
    ok: true,
    record: {
      payment_id: paymentId,
      order_id: "upi_qr",
      // Official AADAR-YYYY-###### assigned in upsertDonationRecord
      receipt_no: "",
      amount_paise: amountInr * 100,
      currency: "INR",
      status: "captured",
      donor_name: name,
      donor_father_or_husband: sanitizeText(
        body.donor_father_or_husband || body.fatherOrHusbandName || "",
        NAME_MAX
      ),
      donor_email: email,
      donor_contact: contact,
      donor_pan: pan,
      donor_address: address,
      donor_state: state,
      donor_city: city,
      donor_pin: pin,
      program_label: sanitizeText(body.program_label || body.programLabel || "", 120),
      purpose: sanitizeText(body.purpose || body.note || "", 240),
      fcra_declaration: "",
      payment_method: "upi_qr",
      source: "upi_qr",
      created_at: paidAtCheck.value,
      updated_at: new Date().toISOString(),
    },
    utr,
    pan,
  };
}

module.exports = {
  normalizeUtr,
  validateUtr,
  upiPaymentId,
  validatePaidAt,
  normalizePan,
  normalizeContact,
  buildUpiDonationRecord,
};
