const {
  applySecurityHeaders,
  getJsonBody,
  isProduction,
  originIsAllowed,
  paymentsAreEnabled,
  paymentsDisabledResponse,
  validateRzpId,
} = require("../server/_lib/donation");
const { fetchDonationByPaymentId } = require("../server/_lib/donationRecord");
const { trySendReceiptEmail, isEmailConfigured } = require("../server/_lib/receiptEmail");
const { applyRateLimit, LIMITS } = require("../server/_lib/rateLimit");

/**
 * Re-send donation receipt email (dev / admin).
 * POST { payment_id, force?: true }
 * In production requires RECEIPT_RESEND_SECRET header or body secret.
 */
module.exports = async function handler(req, res) {
  applySecurityHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!originIsAllowed(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (!applyRateLimit(req, res, LIMITS.confirm)) return;

  if (!paymentsAreEnabled()) {
    return res.status(503).json(paymentsDisabledResponse());
  }

  if (!isEmailConfigured()) {
    return res.status(503).json({ error: "Receipt email is not configured." });
  }

  const resendSecret = process.env.RECEIPT_RESEND_SECRET || "";
  if (isProduction() && !resendSecret) {
    return res.status(503).json({ error: "Receipt resend is not enabled." });
  }

  const body = getJsonBody(req) || {};
  const paymentId = String(body.payment_id || body.paymentId || "").trim();
  const providedSecret = String(body.secret || req.headers["x-receipt-resend-secret"] || "").trim();

  if (isProduction() && providedSecret !== resendSecret) {
    const existing = await fetchDonationByPaymentId(paymentId);
    // Allow first-time send recovery from the success page when email was never sent.
    if (!existing || existing.receipt_email_sent_at) {
      return res.status(403).json({ error: "Forbidden" });
    }
  }

  if (!validateRzpId(paymentId)) {
    return res.status(400).json({ error: "Invalid payment_id." });
  }

  const row = await fetchDonationByPaymentId(paymentId);
  if (!row) {
    return res.status(404).json({ error: "Donation not found." });
  }

  const locale = body.locale === "hi" ? "hi" : "en";
  const result = await trySendReceiptEmail(row, {
    locale,
    forceResend: body.force !== false,
  });

  if (!result.sent) {
    return res.status(200).json({
      ok: false,
      reason: result.reason || "send_failed",
    });
  }

  return res.status(200).json({
    ok: true,
    email: row.donor_email,
    resend_id: result.id,
  });
};
