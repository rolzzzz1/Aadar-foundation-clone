/** @returns {'test' | 'live' | 'unknown'} */
export function getRazorpayKeyMode(keyId) {
  const k = String(keyId || "");
  if (k.startsWith("rzp_test_")) return "test";
  if (k.startsWith("rzp_live_")) return "live";
  return "unknown";
}

export function isRazorpayTestKey(keyId) {
  return getRazorpayKeyMode(keyId) === "test";
}

/**
 * Standard Checkout options for domestic INR donations (India-focused methods).
 * Reduces international-card / live-compliance prompts when testing locally.
 */
export function buildRazorpayCheckoutOptions({
  keyId,
  order,
  program,
  name,
  email,
  contact,
  note,
  onSuccess,
  onDismiss,
}) {
  const testMode = isRazorpayTestKey(keyId);
  const orgName = testMode ? "Aadar Foundation (Test)" : "Aadar Foundation";

  return {
    key: keyId,
    amount: order.amount,
    currency: order.currency || "INR",
    name: orgName,
    description: program
      ? program.label
      : testMode
      ? "Donation — test mode (India only, no real money)"
      : "Donation — Aadar Foundation (India only, INR)",
    order_id: order.id,
    prefill: {
      name,
      email,
      contact,
    },
    notes: { note },
    theme: { color: "#4FA953" },
    // INR domestic methods only; avoids optional intl / EMI / pay-later flows
    method: {
      upi: true,
      card: true,
      netbanking: true,
      // Real wallet / GPay tokens fail in test mode with "Invalid Token"
      wallet: !testMode,
      emi: false,
      paylater: false,
    },
    config: {
      display: {
        preferences: {
          show_default_blocks: true,
        },
      },
    },
    retry: { enabled: false },
    handler: onSuccess,
    modal: { ondismiss: onDismiss },
  };
}

/** User-facing message from Razorpay `payment.failed` payload. */
export function formatRazorpayPaymentFailedError(err, { testMode = false } = {}) {
  const description = (err && (err.description || err.reason)) || "";
  const reason = (err && err.reason) || "";
  const isTokenError =
    /invalid\s*token/i.test(description) ||
    reason === "authentication_failed" ||
    (err && err.code) === "INVALID_TOKEN";

  if (isTokenError) {
    if (testMode) {
      return (
        "Payment could not be completed (Invalid Token). In Razorpay test mode, use a test card " +
        "(e.g. 4111 1111 1111 1111, any future expiry/CVV) or test UPI success@razorpay — " +
        "not a real card, Google Pay, or PhonePe. After changing .env keys, stop and run npm start again."
      );
    }
    return (
      "Payment authentication failed. Ensure live Razorpay keys match on the server and checkout, " +
      "then try again or use another payment method."
    );
  }

  return description || "Payment failed at the bank or wallet.";
}
