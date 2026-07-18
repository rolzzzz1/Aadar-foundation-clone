/**
 * Razorpay Subscriptions API client — plan create/fetch, subscription create/fetch/cancel.
 * Mirrors the axios-based approach in `razorpay.js` (no official SDK in production code).
 */

const { razorpayRequest, wrapRazorpayFailure } = require("./razorpay");

async function createPlan(payload) {
  try {
    const plan = await razorpayRequest("POST", "/plans", payload);
    if (!plan || !plan.id) {
      throw new Error("Razorpay returned an empty plan response");
    }
    return plan;
  } catch (err) {
    wrapRazorpayFailure(err, "plan_create_failed");
  }
}

async function fetchPlan(planId) {
  try {
    return await razorpayRequest("GET", `/plans/${planId}`);
  } catch (err) {
    wrapRazorpayFailure(err, "plan_fetch_failed");
  }
}

async function createSubscription(payload) {
  try {
    const subscription = await razorpayRequest("POST", "/subscriptions", payload);
    if (!subscription || !subscription.id) {
      throw new Error("Razorpay returned an empty subscription response");
    }
    return subscription;
  } catch (err) {
    wrapRazorpayFailure(err, "subscription_create_failed");
  }
}

async function fetchSubscription(subscriptionId) {
  try {
    return await razorpayRequest("GET", `/subscriptions/${subscriptionId}`);
  } catch (err) {
    wrapRazorpayFailure(err, "subscription_fetch_failed");
  }
}

async function cancelSubscription(subscriptionId, { cancelAtCycleEnd = false } = {}) {
  try {
    return await razorpayRequest("POST", `/subscriptions/${subscriptionId}/cancel`, {
      cancel_at_cycle_end: cancelAtCycleEnd ? 1 : 0,
    });
  } catch (err) {
    wrapRazorpayFailure(err, "subscription_cancel_failed");
  }
}

module.exports = {
  createPlan,
  fetchPlan,
  createSubscription,
  fetchSubscription,
  cancelSubscription,
};
