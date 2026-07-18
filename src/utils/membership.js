/**
 * Recurring membership tiers & billing frequencies (Razorpay Subscriptions) — client mirror
 * of `server/_lib/membershipPlans.js`. Amounts here are for display only; the server is the
 * source of truth and re-validates tierKey/frequency on every subscription create.
 */

import { DONATION_CHECKOUT_PATH } from "./paths";

export const MEMBERSHIP_TIERS = Object.freeze({
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

export const MEMBERSHIP_TIER_ORDER = Object.freeze(["supporter", "sustainer", "patron"]);

export const MEMBERSHIP_FREQUENCIES = Object.freeze({
  monthly: { label: "Monthly", suffix: "/month" },
  yearly: { label: "Yearly", suffix: "/year" },
});

export function isValidMembershipTier(key) {
  return typeof key === "string" && Object.prototype.hasOwnProperty.call(MEMBERSHIP_TIERS, key);
}

export function isValidMembershipFrequency(key) {
  return (
    typeof key === "string" && Object.prototype.hasOwnProperty.call(MEMBERSHIP_FREQUENCIES, key)
  );
}

/** @returns {number} 0 when the tier/frequency pair is invalid. */
export function getMembershipAmountInr(tierKey, frequencyKey) {
  if (!isValidMembershipTier(tierKey) || !isValidMembershipFrequency(frequencyKey)) return 0;
  return MEMBERSHIP_TIERS[tierKey].amountInr[frequencyKey] || 0;
}

/**
 * React Router navigation target for Donate2 → checkout, recurring membership mode.
 * @param {{ tierKey: string, frequency: string }} opts
 * @returns {{ pathname: string, state: { membership: { tierKey: string, frequency: string } } }}
 */
export function getMembershipCheckoutNavigation({ tierKey, frequency }) {
  return {
    pathname: DONATION_CHECKOUT_PATH,
    state: { membership: { tierKey, frequency } },
  };
}

/** True when checkout was opened in recurring-membership mode via router state. */
export function resolveMembershipEntry(location) {
  const navState =
    location && location.state && typeof location.state === "object" ? location.state : {};
  const membership = navState.membership;
  if (
    membership &&
    isValidMembershipTier(membership.tierKey) &&
    isValidMembershipFrequency(membership.frequency)
  ) {
    return { tierKey: membership.tierKey, frequency: membership.frequency };
  }
  return null;
}
