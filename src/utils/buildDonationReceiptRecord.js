import { isRazorpayTestKey } from "utils/razorpayCheckout";
import { formatGeneralDonationLabel } from "utils/donation";

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
  paymentMethod,
  errorCode,
  errorDescription,
  keyId,
  verified,
  locale,
  receiptEmailSent,
  subscriptionId,
  frequency,
}) {
  const amount = Number(amountInr) || 0;
  return {
    status,
    locale: locale === "hi" ? "hi" : "en",
    amountInr: amount,
    currency: "INR",
    donor: {
      name: donor.name || "",
      fatherOrHusbandName: donor.fatherOrHusbandName || "",
      email: donor.email || "",
      contact: donor.contact || "",
      pan: donor.pan || "",
      address: donor.address || "",
      state: donor.state || "",
      city: donor.city || "",
      pin: donor.pin || "",
    },
    paymentId: paymentId || "",
    orderId: orderId || "",
    receiptNo: receiptNo || "",
    purpose: purpose || formatGeneralDonationLabel(amount),
    programLabel: programLabel || formatGeneralDonationLabel(amount),
    paymentMethod: String(paymentMethod || "").toLowerCase(),
    paidAt: new Date().toISOString(),
    verified: !!verified,
    receiptEmailSent: !!receiptEmailSent,
    errorCode: errorCode || "",
    errorDescription: errorDescription || "",
    testMode: isRazorpayTestKey(keyId),
    subscriptionId: subscriptionId || "",
    isRecurring: !!subscriptionId,
    frequency: frequency || "",
  };
}
