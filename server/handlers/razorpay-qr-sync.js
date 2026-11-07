const { applySecurityHeaders, getJsonBody, isProduction } = require("../_lib/donation");
const { syncMissingCapturedPayments } = require("../_lib/donationPersist");
const { applyRateLimit, LIMITS } = require("../_lib/rateLimit");

function header(req, name) {
  if (!req.headers) return "";
  return String(req.headers[name] || req.headers[name.toLowerCase()] || "").trim();
}

function authorized(req) {
  const cronSecret = String(process.env.CRON_SECRET || "").trim();
  const authorization = header(req, "authorization");
  if (cronSecret && authorization === `Bearer ${cronSecret}`) return true;

  const bootstrap = String(process.env.QR_SYNC_BOOTSTRAP || "").trim();
  const providedBootstrap = header(req, "x-qr-sync-bootstrap");
  if (bootstrap && providedBootstrap && providedBootstrap === bootstrap) return true;

  const configuredSecret = String(process.env.ADMIN_RECEIPT_SECRET || "").trim();
  const configuredUsername = String(process.env.ADMIN_RECEIPT_USERNAME || "").trim();
  if (!configuredSecret) return !isProduction();

  const providedUser = header(req, "x-admin-receipt-username");
  const providedSecret = header(req, "x-admin-receipt-secret");
  if (configuredUsername && providedUser !== configuredUsername) return false;
  return providedSecret === configuredSecret;
}

module.exports = async function handler(req, res) {
  applySecurityHeaders(res);

  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!authorized(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (!applyRateLimit(req, res, LIMITS.qrSync)) return;

  const body = getJsonBody(req);
  const paymentId = body && typeof body.payment_id === "string" ? body.payment_id.trim() : "";

  try {
    const summary = await syncMissingCapturedPayments({
      count: 100,
      pages: 2,
      paymentIds: paymentId ? [paymentId] : [],
    });
    return res.status(200).json({ ok: true, ...summary });
  } catch (err) {
    const message = err && err.message ? err.message : "Could not sync Razorpay payments.";
    if (!isProduction()) {
      return res.status(502).json({ error: message });
    }
    return res.status(502).json({ error: "Could not sync Razorpay payments." });
  }
};
