const { sanitizeText, NAME_MAX, EMAIL_MAX } = require("./donation");
const {
  validateUtr,
  upiPaymentId,
  generateUpiReceiptNo,
  validatePaidAt,
  normalizePan,
  normalizeContact,
} = require("./upiReceipt");

const BANK_REF_MIN = 6;
const BANK_REF_MAX = 30;
const BANK_REF_REGEX = /^[A-Z0-9]{6,30}$/;

function normalizeBankRef(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, BANK_REF_MAX);
}

function validateBankRef(value) {
  const normalized = normalizeBankRef(value);
  if (normalized.length < BANK_REF_MIN || !BANK_REF_REGEX.test(normalized)) {
    return { ok: false, value: normalized, error: "Invalid bank transaction reference." };
  }
  return { ok: true, value: normalized };
}

function bankPaymentId(ref) {
  return `bank_${normalizeBankRef(ref)}`;
}

/**
 * Build a captured donation row for admin-issued UPI/QR or bank transfer receipts.
 */
function buildManualDonationRecord(body) {
  const method = String(body.payment_method || body.paymentMethod || "upi")
    .trim()
    .toLowerCase();
  const isBank = method === "bank_transfer" || method === "bank";

  let refValue;
  let paymentId;
  let orderId;
  let source;

  if (isBank) {
    const refCheck = validateBankRef(body.transaction_ref || body.bank_ref || body.utr);
    if (!refCheck.ok) return { ok: false, error: refCheck.error };
    refValue = refCheck.value;
    paymentId = bankPaymentId(refValue);
    orderId = "bank_transfer";
    source = "bank_transfer";
  } else {
    const utrCheck = validateUtr(body.utr || body.transaction_ref || body.upi_ref);
    if (!utrCheck.ok) return { ok: false, error: utrCheck.error };
    refValue = utrCheck.value;
    paymentId = upiPaymentId(refValue);
    orderId = "upi_qr";
    source = "upi_qr";
  }

  const amountInr = Math.round(Number(body.amount_inr ?? body.amountInr ?? body.amount));
  if (!Number.isFinite(amountInr) || amountInr < 1 || amountInr > 500000) {
    return { ok: false, error: "Invalid donation amount." };
  }

  const paidAtCheck = validatePaidAt(body.paid_at || body.paidAt);
  if (!paidAtCheck.ok) return { ok: false, error: paidAtCheck.error };

  const pan = normalizePan(body.donor_pan || body.pan);
  if (pan.length !== 10) return { ok: false, error: "Valid PAN is required for the 80G receipt." };

  const name = sanitizeText(body.donor_name || body.name || "", NAME_MAX);
  if (!name) return { ok: false, error: "Donor name is required." };

  const contact = normalizeContact(body.donor_contact || body.contact || body.mobile);
  if (contact.length !== 10)
    return { ok: false, error: "Valid 10-digit mobile number is required." };

  const email = sanitizeText(body.donor_email || body.email || "", EMAIL_MAX).toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Valid donor email is required." };
  }

  const address = sanitizeText(body.donor_address || body.address || "", 200);
  const state = sanitizeText(body.donor_state || body.state || "", 80);
  const city = sanitizeText(body.donor_city || body.city || "", 80);
  const pin = sanitizeText(body.donor_pin || body.pin || "", 6);
  if (!address || !state || !city || pin.length !== 6) {
    return { ok: false, error: "Complete donor address is required for the receipt." };
  }

  return {
    ok: true,
    record: {
      payment_id: paymentId,
      order_id: orderId,
      receipt_no: generateUpiReceiptNo(refValue, paidAtCheck.value),
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
      source,
      created_at: paidAtCheck.value,
      updated_at: new Date().toISOString(),
    },
    paymentId,
    refValue,
  };
}

module.exports = {
  normalizeBankRef,
  validateBankRef,
  bankPaymentId,
  buildManualDonationRecord,
};
