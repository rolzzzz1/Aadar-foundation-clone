const { sanitizeText, NAME_MAX } = require("./donation");

function isCapturedStatus(status) {
  return String(status || "").toLowerCase() === "captured";
}

function getRazorpayKeyId() {
  return process.env.RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID || "";
}

/**
 * Convert a Supabase donations row to the client receipt record shape.
 */
function donationRowToReceiptRecord(row, options = {}) {
  if (!row) return null;

  const captured = isCapturedStatus(row.status);
  const keyId = getRazorpayKeyId();

  return {
    status: captured ? "success" : "unverified",
    locale: options.locale === "hi" ? "hi" : "en",
    amountInr: Math.round((Number(row.amount_paise) || 0) / 100),
    currency: row.currency || "INR",
    donor: {
      name: sanitizeText(row.donor_name || "", NAME_MAX),
      fatherOrHusbandName: sanitizeText(row.donor_father_or_husband || "", NAME_MAX),
      email: sanitizeText(row.donor_email || "", 254),
      contact: sanitizeText(row.donor_contact || "", 20),
      pan: sanitizeText(row.donor_pan || "", 10),
      address: sanitizeText(row.donor_address || "", 200),
      state: sanitizeText(row.donor_state || "", 80),
      city: sanitizeText(row.donor_city || "", 80),
      pin: sanitizeText(row.donor_pin || "", 6),
    },
    paymentId: row.payment_id || "",
    orderId: row.order_id || "",
    receiptNo: row.receipt_no || "",
    purpose: row.purpose || "",
    programLabel: row.program_label || "",
    paidAt: row.created_at || new Date().toISOString(),
    verified: captured,
    testMode: keyId.startsWith("rzp_test_"),
  };
}

module.exports = {
  isCapturedStatus,
  donationRowToReceiptRecord,
};
