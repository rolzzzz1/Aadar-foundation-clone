/**
 * Verify a Razorpay recurring membership Subscription's authorisation payment.
 * Mirrors api/razorpay-verify.js, but the Checkout signature/handler shape for
 * Subscriptions differs from one-time Orders:
 *  - signature = hmac_sha256(razorpay_payment_id + "|" + razorpay_subscription_id, secret)
 *    (note the field order is reversed compared to the order flow's `order_id|payment_id`)
 *  - there is no client-supplied order_id to cross-check; captured status + signature are
 *    the source of truth, and the subscription's own donor notes (set at create time) are
 *    used to persist the payment as a `donations` row (see donationRecord.js).
 */
const crypto = require("crypto");
const {
  applySecurityHeaders,
  getJsonBody,
  isProduction,
  originIsAllowed,
  paymentsAreEnabled,
  paymentsDisabledResponse,
  validateRzpId,
  validateSignatureHex,
} = require("../server/_lib/donation");
const { fetchPayment } = require("../server/_lib/razorpay");
const { fetchSubscription } = require("../server/_lib/razorpaySubscriptions");
const { persistCapturedDonation } = require("../server/_lib/donationPersist");
const { updateSubscriptionRecord } = require("../server/_lib/membershipRecord");
const { applyRateLimit, LIMITS } = require("../server/_lib/rateLimit");

const MAX_BODY_BYTES = 2 * 1024;
const CAPTURE_RETRY_STATUSES = new Set(["authorized", "created", "pending", "processing"]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function verifySubscriptionSignature(paymentId, subscriptionId, signature, keySecret) {
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${paymentId}|${subscriptionId}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const givenBuf = Buffer.from(signature, "utf8");
  if (expectedBuf.length !== givenBuf.length) return false;

  try {
    return crypto.timingSafeEqual(expectedBuf, givenBuf);
  } catch {
    return false;
  }
}

async function fetchPaymentUntilCaptured(paymentId, { maxAttempts = 6, delayMs = 500 } = {}) {
  let payment = null;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    payment = await fetchPayment(paymentId);
    const status = String((payment && payment.status) || "").toLowerCase();
    if (status === "captured") return payment;
    const shouldRetry = CAPTURE_RETRY_STATUSES.has(status) && attempt < maxAttempts - 1;
    if (!shouldRetry) break;
    await sleep(delayMs);
  }
  return payment;
}

function unixToIso(seconds) {
  if (!Number.isFinite(Number(seconds))) return null;
  return new Date(Number(seconds) * 1000).toISOString();
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

  if (!applyRateLimit(req, res, LIMITS.membershipVerify)) return;

  if (!paymentsAreEnabled()) {
    return res.status(503).json(paymentsDisabledResponse());
  }

  const contentLength = Number(
    (req.headers && (req.headers["content-length"] || req.headers["Content-Length"])) || 0
  );
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Payload too large" });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    if (!isProduction()) {
      return res.status(500).json({ error: "Missing RAZORPAY_KEY_SECRET" });
    }
    return res.status(500).json({ error: "Payments are not configured." });
  }

  const body = getJsonBody(req);
  if (body == null || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const subscriptionId = body.razorpay_subscription_id;
  const paymentId = body.razorpay_payment_id;
  const signature = body.razorpay_signature;

  if (
    !validateRzpId(subscriptionId) ||
    !validateRzpId(paymentId) ||
    !validateSignatureHex(signature)
  ) {
    return res.status(400).json({ error: "Invalid payment payload." });
  }

  const signatureValid = verifySubscriptionSignature(
    paymentId,
    subscriptionId,
    signature,
    keySecret
  );
  if (!signatureValid) {
    return res.status(200).json({
      verified: false,
      signature_valid: false,
      captured: false,
      reason: "invalid_signature",
    });
  }

  let subscription = null;
  try {
    subscription = await fetchSubscription(subscriptionId);
  } catch {
    subscription = null;
  }
  if (!subscription) {
    return res.status(200).json({
      verified: false,
      signature_valid: true,
      captured: false,
      reason: "subscription_fetch_failed",
    });
  }

  let payment;
  try {
    payment = await fetchPaymentUntilCaptured(paymentId);
  } catch (err) {
    if (!isProduction()) {
      return res.status(502).json({
        verified: false,
        signature_valid: true,
        captured: false,
        reason: "payment_fetch_failed",
        details: err.message,
      });
    }
    return res.status(502).json({
      verified: false,
      signature_valid: true,
      captured: false,
      reason: "payment_fetch_failed",
    });
  }

  const paymentStatus = String((payment && payment.status) || "").toLowerCase();
  if (paymentStatus !== "captured") {
    return res.status(200).json({
      verified: false,
      signature_valid: true,
      captured: false,
      reason: "not_captured",
      payment_status: paymentStatus || "unknown",
    });
  }

  const subsNotes = subscription.notes || {};
  const frequency = subsNotes.frequency || null;
  const tierKey = subsNotes.tier_key || null;

  const persisted = await persistCapturedDonation({
    payment,
    order: { notes: subsNotes, receipt: subscriptionId },
    source: "subscription_verify",
    subscriptionId,
    frequency,
  });

  if (!persisted.saved) {
    // eslint-disable-next-line no-console
    console.warn("[membership-subscription-verify] payment verified but not saved", {
      payment_id: paymentId,
      subscription_id: subscriptionId,
      reason: persisted.reason,
    });
  }

  const subUpdate = await updateSubscriptionRecord(subscriptionId, {
    status: subscription.status,
    current_start: unixToIso(subscription.current_start),
    current_end: unixToIso(subscription.current_end),
    charge_at: unixToIso(subscription.charge_at),
    paid_count: subscription.paid_count,
    source: "verify",
  });
  if (!subUpdate.saved && subUpdate.reason !== "not_configured" && !isProduction()) {
    // eslint-disable-next-line no-console
    console.warn(
      "[membership-subscription-verify] subscription record not updated",
      subUpdate.reason
    );
  }

  return res.status(200).json({
    verified: true,
    signature_valid: true,
    captured: true,
    payment_status: paymentStatus,
    amount_paise: Number(payment.amount) || 0,
    currency: payment.currency || "INR",
    order_id: payment.order_id || "",
    tier_key: tierKey,
    frequency,
    subscription_status: subscription.status,
    record_saved: persisted.saved,
    record_save_reason: persisted.saved ? undefined : persisted.reason,
    receipt_email_sent: !!(persisted.receiptEmail && persisted.receiptEmail.sent),
    receipt_email_reason:
      persisted.receiptEmail && !persisted.receiptEmail.sent
        ? persisted.receiptEmail.reason
        : undefined,
  });
};
