const {
  applySecurityHeaders,
  getJsonBody,
  isProduction,
  originIsAllowed,
} = require("../server/_lib/donation");
const { applyRateLimit, LIMITS } = require("../server/_lib/rateLimit");

const MAX_BODY_BYTES = 2 * 1024;

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

function verifyAdminCredentials(req, body) {
  const configuredSecret = String(process.env.ADMIN_RECEIPT_SECRET || "").trim();
  const configuredUsername = String(process.env.ADMIN_RECEIPT_USERNAME || "").trim();

  if (!configuredSecret) {
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

  const providedSecret = adminSecretFromRequest(req, body);
  if (providedSecret !== configuredSecret) {
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

  const auth = verifyAdminCredentials(req, body);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  return res.status(200).json({ ok: true });
};
