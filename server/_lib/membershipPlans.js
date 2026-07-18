/**
 * Server-enforced recurring membership tiers & billing frequencies (Razorpay Subscriptions).
 * Client mirror lives in `src/utils/membership.js` — keep amounts/labels in sync (display only,
 * the server never trusts client-supplied amounts).
 *
 * Razorpay Plans are immutable once created, so each (tier, frequency) pair maps to exactly one
 * Plan. Plan IDs are created on first use and cached in Supabase (`membership_plans`) via
 * `membershipPlanStore.js` so we don't create a new duplicate Plan on every checkout.
 */

/** Membership tiers — amountInr keyed by frequency. */
const MEMBERSHIP_TIERS = Object.freeze({
  supporter: {
    label: "Supporter",
    amountInr: { monthly: 501, yearly: 5001 },
  },
  sustainer: {
    label: "Sustainer",
    amountInr: { monthly: 1001, yearly: 11001 },
  },
  patron: {
    label: "Patron",
    amountInr: { monthly: 2501, yearly: 25001 },
  },
});

/**
 * Billing frequencies. `totalCount` is required by Razorpay's Subscription create call
 * (max number of billing cycles) — set generously (10 years) so subscriptions don't
 * silently stop; donors/admins can cancel anytime via `membership-subscription-cancel`.
 */
const MEMBERSHIP_FREQUENCIES = Object.freeze({
  monthly: { period: "monthly", interval: 1, totalCount: 120, label: "Monthly" },
  yearly: { period: "yearly", interval: 1, totalCount: 10, label: "Yearly" },
});

function isValidTierKey(key) {
  return typeof key === "string" && Object.prototype.hasOwnProperty.call(MEMBERSHIP_TIERS, key);
}

function isValidFrequency(key) {
  return (
    typeof key === "string" && Object.prototype.hasOwnProperty.call(MEMBERSHIP_FREQUENCIES, key)
  );
}

/** @returns {{ ok: true, amountInr: number, tier: object, frequency: object } | { ok: false, error: string }} */
function resolveMembershipAmount(tierKey, frequencyKey) {
  if (!isValidTierKey(tierKey)) {
    return { ok: false, error: "Unknown membership tier." };
  }
  if (!isValidFrequency(frequencyKey)) {
    return { ok: false, error: "Unknown billing frequency." };
  }
  const tier = MEMBERSHIP_TIERS[tierKey];
  const frequency = MEMBERSHIP_FREQUENCIES[frequencyKey];
  const amountInr = tier.amountInr[frequencyKey];
  if (!Number.isFinite(amountInr) || amountInr <= 0) {
    return { ok: false, error: "Membership amount is not configured for this frequency." };
  }
  return { ok: true, amountInr, tier, frequency };
}

module.exports = {
  MEMBERSHIP_TIERS,
  MEMBERSHIP_FREQUENCIES,
  isValidTierKey,
  isValidFrequency,
  resolveMembershipAmount,
};
