/**
 * Subscription lifecycle records (Supabase `membership_subscriptions`, optional — see
 * supabase/membership.sql). Tracks one row per donor subscription (status, billing cycle
 * dates); each individual charge is separately persisted as a `donations` row (via
 * donationRecord.js) so it shows up in receipts/admin lookup alongside one-time gifts.
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
  console.error("[membership-record]", message, details);
}

/** @returns {Promise<object|null>} */
async function fetchSubscriptionRecord(subscriptionId) {
  if (!isStoreConfigured() || !subscriptionId) return null;

  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const url = `${base}/rest/v1/membership_subscriptions?subscription_id=eq.${encodeURIComponent(
    subscriptionId
  )}&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const rows = await res.json().catch(() => []);
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  } catch {
    return null;
  }
}

/**
 * Insert a new subscription row right after `subscriptions.create` succeeds.
 * @returns {Promise<{ saved: boolean, reason?: string }>}
 */
async function insertSubscriptionRecord(record) {
  if (!isStoreConfigured()) return { saved: false, reason: "not_configured" };
  if (!record || !record.subscription_id) return { saved: false, reason: "missing_subscription_id" };

  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const url = `${base}/rest/v1/membership_subscriptions?on_conflict=subscription_id`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: storeHeaders("resolution=ignore-duplicates,return=minimal"),
      body: JSON.stringify(record),
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

/**
 * Patch an existing subscription row by subscription_id (status/cycle updates from
 * verify or webhook). No-op (not an error) if the row doesn't exist yet.
 * @returns {Promise<{ saved: boolean, reason?: string }>}
 */
async function updateSubscriptionRecord(subscriptionId, patch) {
  if (!isStoreConfigured()) return { saved: false, reason: "not_configured" };
  if (!subscriptionId) return { saved: false, reason: "missing_subscription_id" };

  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const url = `${base}/rest/v1/membership_subscriptions?subscription_id=eq.${encodeURIComponent(
    subscriptionId
  )}`;

  const body = { ...patch, updated_at: new Date().toISOString() };

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: storeHeaders(),
      body: JSON.stringify(body),
    });
    if (res.ok) return { saved: true };
    const text = await res.text().catch(() => "");
    logFailure("patch failed", { status: res.status, detail: text.slice(0, 200) });
    return { saved: false, reason: `store_error_${res.status}` };
  } catch (err) {
    logFailure("patch error", { message: err && err.message });
    return { saved: false, reason: "store_error" };
  }
}

module.exports = {
  isStoreConfigured,
  fetchSubscriptionRecord,
  insertSubscriptionRecord,
  updateSubscriptionRecord,
};
