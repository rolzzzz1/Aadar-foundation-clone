import { isRazorpayTestKey } from "utils/razorpayCheckout";

/**
 * Build a receipt record to store before redirecting to success/failure pages.
 */
export function buildDonationReceiptRecord({
  status,
  amountInr,
  donor,
  paymentId,
  orderId,
  receiptNo,
  purpose,
  programLabel,
  errorCode,
  errorDescription,
  keyId,
  verified,
  locale,
}) {
  return {
    status,
    locale: locale === "hi" ? "hi" : "en",
    amountInr: Number(amountInr) || 0,
    currency: "INR",
    donor: {
      name: donor.name || "",
      fatherOrHusbandName: donor.fatherOrHusbandName || "",
      email: donor.email || "",
      contact: donor.contact || "",
      pan: donor.pan || "",
    },
    paymentId: paymentId || "",
    orderId: orderId || "",
    receiptNo: receiptNo || "",
    purpose: purpose || "",
    programLabel: programLabel || "",
    paidAt: new Date().toISOString(),
    verified: !!verified,
    errorCode: errorCode || "",
    errorDescription: errorDescription || "",
    testMode: isRazorpayTestKey(keyId),
  };
}
