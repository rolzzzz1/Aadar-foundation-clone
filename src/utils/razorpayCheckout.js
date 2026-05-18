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
      ? "Donation — test mode (no real money)"
      : "Donation — Aadar Foundation",
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
      wallet: true,
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
