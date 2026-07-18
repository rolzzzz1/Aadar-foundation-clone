/**
 * Create a Razorpay recurring membership Subscription (Supporter/Sustainer/Patron ×
 * Monthly/Yearly). Mirrors api/razorpay-order.js but returns a `subscription_id` for
 * Razorpay Standard Checkout instead of an `order_id` — see src/utils/razorpayCheckout.js
 * (`buildRazorpaySubscriptionCheckoutOptions`) and api/membership-subscription-verify.js.
 */
const { createPlan, createSubscription } = require("../server/_lib/razorpaySubscriptions");
const { getCachedPlanId, cachePlanId } = require("../server/_lib/membershipPlanStore");
const { insertSubscriptionRecord } = require("../server/_lib/membershipRecord");
const { resolveMembershipAmount } = require("../server/_lib/membershipPlans");
const {
  applySecurityHeaders,
  getJsonBody,
  isProduction,
  originIsAllowed,
  paymentsAreEnabled,
  paymentsDisabledResponse,
  validateOrderNotes,
  formatRazorpayError,
} = require("../server/_lib/donation");
const { applyRateLimit, LIMITS } = require("../server/_lib/rateLimit");

const MAX_BODY_BYTES = 4 * 1024;

/** Ensures the (tierKey, frequencyKey) Plan exists on Razorpay, creating + caching it on first use. */
async function getOrCreatePlanId({
  tierKey,
  frequencyKey,
  amountInr,
  amountPaise,
  tierLabel,
  frequencyConfig,
}) {
  const cached = await getCachedPlanId(tierKey, frequencyKey);
  if (cached) return cached;

  const plan = await createPlan({
    period: frequencyConfig.period,
    interval: frequencyConfig.interval,
    item: {
      name: `${tierLabel} Membership — ₹${amountInr.toLocaleString("en-IN")}/${
        frequencyKey === "yearly" ? "year" : "month"
      }`,
      amount: amountPaise,
      currency: "INR",
    },
  });

  await cachePlanId({ tierKey, frequencyKey, planId: plan.id, amountPaise, currency: "INR" });
  return plan.id;
}

module.exports = async function handler(req, res) {
  applySecurityHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!originIsAllowed(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (!applyRateLimit(req, res, LIMITS.membershipCreate)) return;

  if (!paymentsAreEnabled()) {
    return res.status(503).json(paymentsDisabledResponse());
  }

  const contentLength = Number(
    (req.headers && (req.headers["content-length"] || req.headers["Content-Length"])) || 0
  );
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Payload too large" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const keyMode =
    keyId && keyId.startsWith("rzp_test_")
      ? "test"
      : keyId && keyId.startsWith("rzp_live_")
      ? "live"
      : "unknown";

  if (!isProduction() && keyMode === "live") {
    return res.status(400).json({
      error:
        "Live Razorpay keys cannot be used in local development. Switch Dashboard to Test Mode and use rzp_test_ keys in .env.",
    });
  }

  if (!keyId || !keySecret) {
    if (!isProduction()) {
      return res.status(500).json({
        error: "Missing Razorpay server environment variables",
        details: {
          hasKeyId: !!keyId,
          hasKeySecret: !!keySecret,
          hint: "Add RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and REACT_APP_RAZORPAY_KEY_ID to .env.local in the project root, then restart npm start.",
        },
      });
    }
    return res.status(500).json({ error: "Payments are not configured." });
  }

  const body = getJsonBody(req);
  if (body == null || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const tierKey = String(body.tierKey || "");
  const frequencyKey = String(body.frequency || "");

  const resolved = resolveMembershipAmount(tierKey, frequencyKey);
  if (!resolved.ok) {
    return res.status(400).json({ error: resolved.error });
  }
  const { amountInr, tier, frequency: frequencyConfig } = resolved;
  const amountPaise = amountInr * 100;

  const notesResult = validateOrderNotes(body.notes);
  if (!notesResult.ok) {
    return res.status(400).json({ error: notesResult.error });
  }
  const donorNotes = notesResult.notes;
  // Surfaced on receipts/emails via buildRecordFromRazorpay's `program_label` field.
  donorNotes.purpose = `${tier.label} Membership (${frequencyConfig.label})`;

  try {
    const planId = await getOrCreatePlanId({
      tierKey,
      frequencyKey,
      amountInr,
      amountPaise,
      tierLabel: tier.label,
      frequencyConfig,
    });

    const subscription = await createSubscription({
      plan_id: planId,
      total_count: frequencyConfig.totalCount,
      customer_notify: true,
      notes: {
        ...donorNotes,
        tier_key: tierKey,
        frequency: frequencyKey,
      },
    });

    const saved = await insertSubscriptionRecord({
      subscription_id: subscription.id,
      plan_id: planId,
      tier_key: tierKey,
      frequency: frequencyKey,
      amount_paise: amountPaise,
      currency: "INR",
      status: subscription.status || "created",
      donor_name: donorNotes.donor_name,
      donor_father_or_husband: donorNotes.donor_father_or_husband,
      donor_email: donorNotes.donor_email,
      donor_contact: donorNotes.donor_contact,
      donor_pan: donorNotes.donor_pan,
      donor_address: donorNotes.donor_address,
      donor_state: donorNotes.donor_state,
      donor_city: donorNotes.donor_city,
      donor_pin: donorNotes.donor_pin,
      fcra_declaration: donorNotes.fcra_declaration,
      total_count: frequencyConfig.totalCount,
      source: "create",
    });
    if (!saved.saved && saved.reason !== "not_configured" && !isProduction()) {
      // eslint-disable-next-line no-console
      console.warn("[membership-subscription-create] record not saved", saved.reason);
    }

    return res.status(200).json({
      subscription_id: subscription.id,
      plan_id: planId,
      amount_paise: amountPaise,
      currency: "INR",
      tier_key: tierKey,
      tier_label: tier.label,
      frequency: frequencyKey,
      frequency_label: frequencyConfig.label,
      key_mode: keyMode,
    });
  } catch (err) {
    if (!isProduction()) {
      // eslint-disable-next-line no-console
      console.error("membership-subscription-create error:", err);
      return res.status(502).json({
        error: "Failed to create subscription",
        details: formatRazorpayError(err),
      });
    }
    return res.status(502).json({ error: "Failed to create subscription." });
  }
};
