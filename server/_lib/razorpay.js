/**
 * Shared Razorpay server client — order create, payment fetch, capture checks.
 * Uses axios directly so network/SSL failures surface clear errors (the official
 * SDK crashes with "reading 'status'" when axios has no HTTP response).
 */

const axios = require("axios");
const { getDevHttpsAgent } = require("./httpsAgent");
const { formatRazorpayError } = require("./donation");

const RAZORPAY_API = "https://api.razorpay.com/v1";

function getCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

function getRazorpayClient() {
  return getCredentials();
}

function getHttpsAgent() {
  return getDevHttpsAgent();
}

function formatTransportError(err) {
  const code = err && err.code ? String(err.code) : "";
  const msg = err && err.message ? String(err.message) : "";

  if (
    code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
    code === "CERT_HAS_EXPIRED" ||
    /certificate/i.test(msg)
  ) {
    return (
      "Cannot reach Razorpay (SSL certificate error). Common on corporate VPN or antivirus HTTPS scanning. " +
      "Set NODE_EXTRA_CA_CERTS to your CA bundle, or for local dev only set RAZORPAY_INSECURE_TLS=true in .env and restart npm start."
    );
  }

  if (code === "ENOTFOUND" || code === "ECONNREFUSED" || code === "ETIMEDOUT") {
    return `Cannot reach Razorpay API (${code}). Check your internet connection and firewall.`;
  }

  if (/reading 'status'/.test(msg)) {
    return (
      "Cannot reach Razorpay API (network or SSL error). " +
      "If your keys are correct, set RAZORPAY_INSECURE_TLS=true in .env for local dev only, then restart npm start."
    );
  }

  return msg || code || "Network error contacting Razorpay";
}

function wrapRazorpayFailure(err, code) {
  const wrapped = new Error(formatRazorpayError(err));
  wrapped.code = code;
  wrapped.cause = err;
  throw wrapped;
}

async function razorpayRequest(method, path, data) {
  const creds = getCredentials();
  if (!creds) {
    const err = new Error("Razorpay is not configured");
    err.code = "not_configured";
    throw err;
  }

  const agent = getHttpsAgent();
  const config = {
    method,
    url: `${RAZORPAY_API}${path}`,
    auth: { username: creds.keyId, password: creds.keySecret },
    headers: { "Content-Type": "application/json", "User-Agent": "aadarfoundation-api" },
    timeout: 30000,
    ...(agent ? { httpsAgent: agent } : {}),
    ...(data !== undefined ? { data } : {}),
  };

  try {
    const res = await axios(config);
    return res.data;
  } catch (err) {
    if (err.response) {
      throw {
        statusCode: err.response.status,
        error:
          (err.response.data && err.response.data.error) ||
          { description: err.response.statusText || "Razorpay request failed" },
      };
    }

    const transport = new Error(formatTransportError(err));
    transport.code = "transport_failed";
    transport.cause = err;
    throw transport;
  }
}

async function createOrder(payload) {
  try {
    const order = await razorpayRequest("POST", "/orders", payload);
    if (!order || !order.id) {
      throw new Error("Razorpay returned an empty order response");
    }
    return order;
  } catch (err) {
    wrapRazorpayFailure(err, "create_failed");
  }
}

async function fetchPayment(paymentId) {
  try {
    return await razorpayRequest("GET", `/payments/${paymentId}`);
  } catch (err) {
    wrapRazorpayFailure(err, "fetch_failed");
  }
}

async function fetchOrder(orderId) {
  try {
    return await razorpayRequest("GET", `/orders/${orderId}`);
  } catch (err) {
    wrapRazorpayFailure(err, "fetch_failed");
  }
}

/**
 * Confirm payment belongs to order and money was captured (not just authorized/failed).
 * When `order` is provided, also asserts payment.amount === order.amount.
 * @returns {{ ok: boolean, reason?: string, payment_status?: string, amount_paise?: number, currency?: string }}
 */
function validateCapturedPayment(payment, expectedOrderId, order) {
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

  if (order && order.amount != null) {
    const orderAmount = Number(order.amount);
    if (Number.isFinite(orderAmount) && amount !== orderAmount) {
      return {
        ok: false,
        reason: "amount_mismatch",
        payment_status: status,
        amount_paise: amount,
        currency: payment.currency || "INR",
      };
    }
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
  const order = options.order || null;

  let payment = null;
  let check = { ok: false, reason: "payment_not_found" };

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    payment = await fetchPayment(paymentId);
    check = validateCapturedPayment(payment, orderId, order);
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
  getCredentials,
  razorpayRequest,
  wrapRazorpayFailure,
  createOrder,
  fetchPayment,
  fetchOrder,
  fetchPaymentUntilCaptured,
  validateCapturedPayment,
  formatRazorpayError,
};
