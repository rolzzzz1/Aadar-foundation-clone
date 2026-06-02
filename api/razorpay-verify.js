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
} = require("./_lib/donation");
const { fetchPaymentUntilCaptured, fetchOrder } = require("./_lib/razorpay");
const {
  buildRecordFromRazorpay,
  saveDonationRecord,
} = require("./_lib/donationRecord");
const { applyRateLimit, LIMITS } = require("./_lib/rateLimit");

const MAX_BODY_BYTES = 2 * 1024;

function verifyCheckoutSignature(orderId, paymentId, signature, keySecret) {
  const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const givenBuf = Buffer.from(signature, "utf8");

  if (expectedBuf.length !== givenBuf.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(expectedBuf, givenBuf);
  } catch {
    return false;
  }
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

  if (!applyRateLimit(req, res, LIMITS.verify)) return;

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

  const orderId = body.razorpay_order_id;
  const paymentId = body.razorpay_payment_id;
  const signature = body.razorpay_signature;

  if (!validateRzpId(orderId) || !validateRzpId(paymentId) || !validateSignatureHex(signature)) {
    return res.status(400).json({ error: "Invalid payment payload." });
  }

  const signatureValid = verifyCheckoutSignature(orderId, paymentId, signature, keySecret);

  if (!signatureValid) {
    return res.status(200).json({
      verified: false,
      signature_valid: false,
      captured: false,
      reason: "invalid_signature",
    });
  }

  let order = null;
  try {
    order = await fetchOrder(orderId);
  } catch {
    order = null;
  }

  if (!order) {
    return res.status(200).json({
      verified: false,
      signature_valid: true,
      captured: false,
      reason: "order_fetch_failed",
    });
  }

  let payment;
  let captureCheck;
  try {
    const result = await fetchPaymentUntilCaptured(paymentId, orderId, { order });
    payment = result.payment;
    captureCheck = result.check;
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

  if (!captureCheck.ok) {
    if (!isProduction()) {
      // eslint-disable-next-line no-console
      console.warn("[razorpay-verify] capture check failed", {
        reason: captureCheck.reason,
        payment_status: captureCheck.payment_status,
        payment_id: paymentId,
        order_id: orderId,
      });
    }
    return res.status(200).json({
      verified: false,
      signature_valid: true,
      captured: false,
      reason: captureCheck.reason,
      payment_status: captureCheck.payment_status,
    });
  }

  const record = buildRecordFromRazorpay({ payment, order, source: "verify" });
  const saved = await saveDonationRecord(record);

  if (!saved.saved) {
    // eslint-disable-next-line no-console
    console.warn("[razorpay-verify] payment verified but donation not saved", {
      payment_id: paymentId,
      reason: saved.reason,
    });
  }

  return res.status(200).json({
    verified: true,
    signature_valid: true,
    captured: true,
    payment_status: captureCheck.payment_status,
    amount_paise: captureCheck.amount_paise,
    currency: captureCheck.currency,
    record_saved: saved.saved,
    record_save_reason: saved.saved ? undefined : saved.reason,
  });
};
