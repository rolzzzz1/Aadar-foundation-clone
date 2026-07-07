const {
  applySecurityHeaders,
  getJsonBody,
  isProduction,
  originIsAllowed,
  paymentsAreEnabled,
  paymentsDisabledResponse,
  validateRzpId,
} = require("../server/_lib/donation");
const {
  fetchPaymentUntilCaptured,
  fetchOrder,
  validateCapturedPayment,
} = require("../server/_lib/razorpay");
const { applyRateLimit, LIMITS } = require("../server/_lib/rateLimit");
const { normalizePan, buildClientReceiptFromRazorpay } = require("../server/_lib/receiptPayload");
const { persistCapturedDonation } = require("../server/_lib/donationPersist");

const MAX_BODY_BYTES = 2 * 1024;

/**
 * Re-confirms a donation with Razorpay before showing success / issuing a PDF.
 * Requires payment_id + order_id + donor PAN (must match order notes).
 */
module.exports = async function handler(req, res) {
  applySecurityHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!applyRateLimit(req, res, LIMITS.confirm)) return;

  if (!originIsAllowed(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (!paymentsAreEnabled()) {
    return res.status(503).json(paymentsDisabledResponse());
  }

  const contentLength = Number(
    (req.headers && (req.headers["content-length"] || req.headers["Content-Length"])) || 0
  );
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Payload too large" });
  }

  const body = getJsonBody(req);
  if (body == null || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const paymentId = String(body.payment_id || body.paymentId || "").trim();
  const orderId = String(body.order_id || body.orderId || "").trim();
  const donorPan = normalizePan(body.donor_pan || body.pan);
  const locale = body.locale === "hi" ? "hi" : "en";

  if (!validateRzpId(paymentId) || !validateRzpId(orderId) || donorPan.length !== 10) {
    return res.status(400).json({ error: "Invalid confirmation payload." });
  }

  let order = null;
  try {
    order = await fetchOrder(orderId);
  } catch {
    order = null;
  }

  if (!order) {
    return res.status(200).json({ ok: false, verified: false, reason: "order_fetch_failed" });
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
        ok: false,
        verified: false,
        reason: "payment_fetch_failed",
        details: err.message,
      });
    }
    return res.status(502).json({ ok: false, verified: false, reason: "payment_fetch_failed" });
  }

  const finalCheck = validateCapturedPayment(payment, orderId, order);
  if (!captureCheck.ok || !finalCheck.ok) {
    const reason = finalCheck.reason || captureCheck.reason || "not_captured";
    return res.status(200).json({
      ok: false,
      verified: false,
      reason,
      payment_status: finalCheck.payment_status || captureCheck.payment_status,
    });
  }

  const built = buildClientReceiptFromRazorpay({ payment, order, donorPan, locale });
  if (!built.ok) {
    return res.status(200).json({
      ok: false,
      verified: false,
      reason: built.reason,
    });
  }

  const persisted = await persistCapturedDonation({
    payment,
    order,
    source: "confirm",
    locale,
  });

  return res.status(200).json({
    ok: true,
    verified: true,
    amount_paise: finalCheck.amount_paise,
    currency: finalCheck.currency,
    record: built.record,
    record_saved: persisted.saved,
    record_save_reason: persisted.saved ? undefined : persisted.reason,
    receipt_email_sent: !!(persisted.receiptEmail && persisted.receiptEmail.sent),
    receipt_email_reason:
      persisted.receiptEmail && !persisted.receiptEmail.sent
        ? persisted.receiptEmail.reason
        : undefined,
  });
};
