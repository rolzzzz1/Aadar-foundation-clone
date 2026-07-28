const { sanitizeText, NAME_MAX, formatGeneralDonationLabel } = require("./donation");

function normalizePan(v) {
  return String(v || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
}

function pickNote(notes, key) {
  if (!notes || typeof notes !== "object") return "";
  const v = notes[key];
  return v == null ? "" : String(v);
}

/**
 * Build a client-safe receipt record from Razorpay payment + order (source of truth).
 * Requires donor PAN to match order notes when PAN is present on the order.
 */
function buildClientReceiptFromRazorpay({ payment, order, donorPan, locale }) {
  const notes = (order && order.notes) || {};
  const panProvided = normalizePan(donorPan);
  const panFromOrder = normalizePan(notes.donor_pan);

  if (!panProvided || panProvided.length !== 10) {
    return { ok: false, reason: "invalid_pan" };
  }

  if (!panFromOrder || panFromOrder !== panProvided) {
    return { ok: false, reason: "pan_mismatch" };
  }

  const amountPaise = Number(payment.amount);
  if (!Number.isFinite(amountPaise) || amountPaise <= 0) {
    return { ok: false, reason: "invalid_amount" };
  }

  const paidAt =
    payment.created_at != null
      ? new Date(Number(payment.created_at) * 1000).toISOString()
      : new Date().toISOString();

  const amountInr = Math.round(amountPaise / 100);
  const programLabel =
    sanitizeText(pickNote(notes, "purpose"), 120) || formatGeneralDonationLabel(amountInr);
  const purpose =
    sanitizeText(pickNote(notes, "note"), 240) || programLabel;

  return {
    ok: true,
    record: {
      status: "success",
      locale: locale === "hi" ? "hi" : "en",
      amountInr,
      currency: payment.currency || "INR",
      donor: {
        name: sanitizeText(pickNote(notes, "donor_name"), NAME_MAX),
        fatherOrHusbandName: sanitizeText(pickNote(notes, "donor_father_or_husband"), NAME_MAX),
        email: sanitizeText(pickNote(notes, "donor_email"), 254),
        contact: sanitizeText(pickNote(notes, "donor_contact"), 20),
        pan: panProvided,
      },
      paymentId: payment.id,
      orderId: payment.order_id || (order && order.id) || "",
      receiptNo: (order && order.receipt) || "",
      purpose,
      programLabel,
      paidAt,
      verified: true,
      testMode:
        String(process.env.RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID || "").startsWith(
          "rzp_test_"
        ),
    },
  };
}

module.exports = {
  normalizePan,
  buildClientReceiptFromRazorpay,
};
