/**
 * Shared Razorpay server client — order create, payment fetch, capture checks.
 */

const Razorpay = require("razorpay");
const { formatRazorpayError } = require("./donation");

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

async function fetchPayment(paymentId) {
  const client = getRazorpayClient();
  if (!client) {
    const err = new Error("Razorpay is not configured");
    err.code = "not_configured";
    throw err;
  }
  try {
    return await client.payments.fetch(paymentId);
  } catch (err) {
    const wrapped = new Error(formatRazorpayError(err));
    wrapped.code = "fetch_failed";
    wrapped.cause = err;
    throw wrapped;
  }
}

async function fetchOrder(orderId) {
  const client = getRazorpayClient();
  if (!client) {
    const err = new Error("Razorpay is not configured");
    err.code = "not_configured";
    throw err;
  }
  try {
    return await client.orders.fetch(orderId);
  } catch (err) {
    const wrapped = new Error(formatRazorpayError(err));
    wrapped.code = "fetch_failed";
    wrapped.cause = err;
    throw wrapped;
  }
}

/**
 * Confirm payment belongs to order and money was captured (not just authorized/failed).
 * @returns {{ ok: boolean, reason?: string, payment_status?: string }}
 */
function validateCapturedPayment(payment, expectedOrderId) {
  if (!payment || typeof payment !== "object") {
    return { ok: false, reason: "payment_not_found" };
  }

  if (payment.order_id !== expectedOrderId) {
    return { ok: false, reason: "order_mismatch", payment_status: payment.status };
  }

  const status = String(payment.status || "").toLowerCase();
  if (status !== "captured") {
    return { ok: false, reason: "not_captured", payment_status: status || "unknown" };
  }

  const amount = Number(payment.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, reason: "invalid_amount", payment_status: status };
  }

  return { ok: true, payment_status: status, amount_paise: amount, currency: payment.currency || "INR" };
}

const CAPTURE_RETRY_STATUSES = new Set(["authorized", "created", "pending", "processing"]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Razorpay may still return `authorized` for a moment after Checkout success.
 * Poll briefly before treating verification as failed.
 */
async function fetchPaymentUntilCaptured(paymentId, orderId, options = {}) {
  const maxAttempts = options.maxAttempts ?? 6;
  const delayMs = options.delayMs ?? 500;

  let payment = null;
  let check = { ok: false, reason: "payment_not_found" };

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    payment = await fetchPayment(paymentId);
    check = validateCapturedPayment(payment, orderId);
    if (check.ok) {
      return { payment, check };
    }

    const status = String(payment.status || "").toLowerCase();
    const shouldRetry = CAPTURE_RETRY_STATUSES.has(status) && attempt < maxAttempts - 1;
    if (!shouldRetry) {
      break;
    }
    await sleep(delayMs);
  }

  return { payment, check };
}

module.exports = {
  getRazorpayClient,
  fetchPayment,
  fetchOrder,
  fetchPaymentUntilCaptured,
  validateCapturedPayment,
  formatRazorpayError,
};
