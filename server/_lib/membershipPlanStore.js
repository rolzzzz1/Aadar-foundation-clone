/**
 * Cache of Razorpay Plan IDs keyed by (tier_key, frequency) so we create each Plan on
 * Razorpay exactly once instead of a new duplicate Plan on every checkout. Backed by
 * Supabase `membership_plans` (optional — see supabase/membership.sql). Without Supabase
 * configured, a new Plan is created on every subscription checkout (still functional,
 * just noisier in the Razorpay Dashboard).
 */

function isStoreConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function storeHeaders(extraPrefer) {
  return {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    Prefer: extraPrefer || "return=minimal",
  };
}

function logFailure(message, details) {
  // eslint-disable-next-line no-console
  console.warn("[membership-plan-store]", message, details);
}

/**
 * @returns {Promise<string|null>} cached Razorpay plan_id, or null if not cached / not configured.
 */
async function getCachedPlanId(tierKey, frequencyKey) {
  if (!isStoreConfigured()) return null;

  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const url =
    `${base}/rest/v1/membership_plans?tier_key=eq.${encodeURIComponent(tierKey)}` +
    `&frequency=eq.${encodeURIComponent(frequencyKey)}&select=razorpay_plan_id&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      logFailure("fetch failed", { status: res.status, tierKey, frequencyKey });
      return null;
    }
    const rows = await res.json().catch(() => []);
    return Array.isArray(rows) && rows[0] ? rows[0].razorpay_plan_id : null;
  } catch (err) {
    logFailure("fetch error", { message: err && err.message, tierKey, frequencyKey });
    return null;
  }
}

/**
 * Persist a newly-created Razorpay plan_id. Best-effort — a race where two requests both
 * create a Plan is tolerated (unique constraint on razorpay_plan_id keeps the cache sane;
 * a losing insert here just means that plan_id was not cached for reuse).
 */
async function cachePlanId({ tierKey, frequencyKey, planId, amountPaise, currency = "INR" }) {
  if (!isStoreConfigured()) return { saved: false, reason: "not_configured" };

  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const url = `${base}/rest/v1/membership_plans?on_conflict=tier_key,frequency`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: storeHeaders("resolution=ignore-duplicates,return=minimal"),
      body: JSON.stringify({
        tier_key: tierKey,
        frequency: frequencyKey,
        razorpay_plan_id: planId,
        amount_paise: amountPaise,
        currency,
      }),
    });
    if (res.ok) return { saved: true };
    const text = await res.text().catch(() => "");
    logFailure("insert failed", { status: res.status, detail: text.slice(0, 200) });
    return { saved: false, reason: `store_error_${res.status}` };
  } catch (err) {
    logFailure("insert error", { message: err && err.message });
    return { saved: false, reason: "store_error" };
  }
}

module.exports = {
  isStoreConfigured,
  getCachedPlanId,
  cachePlanId,
};
