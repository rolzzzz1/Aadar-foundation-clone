const {
  applySecurityHeaders,
  getJsonBody,
  isProduction,
  originIsAllowed,
} = require("../server/_lib/donation");
const {
  isStoreConfigured,
  fetchDonationByPaymentId,
  upsertDonationRecord,
} = require("../server/_lib/donationRecord");
const { donationRowToReceiptRecord } = require("../server/_lib/receiptRecord");
const { trySendReceiptEmail, isEmailConfigured } = require("../server/_lib/receiptEmail");
const { applyRateLimit, LIMITS } = require("../server/_lib/rateLimit");
const { buildManualDonationRecord } = require("../server/_lib/manualReceipt");

const MAX_BODY_BYTES = 8 * 1024;

function adminSecretFromRequest(req, body) {
  return String(
    (body && body.secret) ||
      (req.headers &&
        (req.headers["x-admin-receipt-secret"] || req.headers["X-Admin-Receipt-Secret"])) ||
      ""
  ).trim();
}

function adminUsernameFromRequest(req, body) {
  return String(
    (body && (body.username || body.admin_username)) ||
      (req.headers &&
        (req.headers["x-admin-receipt-username"] || req.headers["X-Admin-Receipt-Username"])) ||
      ""
  ).trim();
}

function verifyAdminSecret(req, body) {
  const configured = String(process.env.ADMIN_RECEIPT_SECRET || "").trim();
  const configuredUsername = String(process.env.ADMIN_RECEIPT_USERNAME || "").trim();
  if (!configured) {
    if (isProduction()) {
      return { ok: false, status: 503, error: "Admin receipt issuing is not enabled." };
    }
    return { ok: true };
  }

  if (configuredUsername) {
    const providedUser = adminUsernameFromRequest(req, body);
    if (providedUser !== configuredUsername) {
      return { ok: false, status: 403, error: "Invalid admin credentials." };
    }
  }

  const provided = adminSecretFromRequest(req, body);
  if (provided !== configured) {
    return { ok: false, status: 403, error: "Invalid admin credentials." };
  }
  return { ok: true };
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

  if (!applyRateLimit(req, res, LIMITS.adminReceipt)) return;

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

  const auth = verifyAdminSecret(req, body);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  if (!isStoreConfigured()) {
    return res.status(503).json({
      error: "Donation store is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    });
  }

  if (!isEmailConfigured()) {
    return res.status(503).json({
      error: "Receipt email is not configured. Set RESEND_API_KEY and RECEIPT_FROM_EMAIL.",
    });
  }

  const built = buildManualDonationRecord(body);
  if (!built.ok) {
    return res.status(400).json({ error: built.error });
  }

  const existing = await fetchDonationByPaymentId(built.paymentId);
  if (existing && String(existing.status || "").toLowerCase() === "captured") {
    const allowResend = body.resend === true || body.force === true;
    if (!allowResend) {
      return res.status(409).json({
        error: "A receipt was already issued for this transaction reference.",
        payment_id: built.paymentId,
        receipt_no: existing.receipt_no || null,
        receipt_email_sent: !!existing.receipt_email_sent_at,
      });
    }
  }

  const saved = await upsertDonationRecord(built.record);
  if (!saved.saved) {
    if (!isProduction()) {
      return res.status(502).json({
        error: "Could not save donation record.",
        reason: saved.reason,
      });
    }
    return res.status(502).json({ error: "Could not save donation record." });
  }

  const row = saved.row || (await fetchDonationByPaymentId(built.paymentId));
  if (!row) {
    return res.status(502).json({ error: "Could not save donation record." });
  }

  const locale = body.locale === "hi" ? "hi" : "en";
  const emailResult = await trySendReceiptEmail(row, {
    locale,
    forceResend: body.resend === true || body.force === true,
  });

  const updatedRow = (await fetchDonationByPaymentId(built.paymentId)) || row;

  return res.status(200).json({
    ok: true,
    created: !!saved.created,
    receipt_email_sent: !!emailResult.sent,
    email_reason: emailResult.sent ? undefined : emailResult.reason || "send_failed",
    payment_id: updatedRow.payment_id,
    receipt_no: updatedRow.receipt_no,
    donor_email: updatedRow.donor_email,
    record: donationRowToReceiptRecord(updatedRow, { locale }),
  });
};
