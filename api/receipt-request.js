const {
  applySecurityHeaders,
  getJsonBody,
  originIsAllowed,
  sanitizeText,
} = require("../server/_lib/donation");
const { applyRateLimit, LIMITS } = require("../server/_lib/rateLimit");
const {
  MAX_SCREENSHOT_BYTES,
  sendReceiptRequestEmail,
  isEmailConfigured,
} = require("../server/_lib/receiptRequestEmail");

const MAX_BODY_BYTES = 4.5 * 1024 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const MOBILE_RE = /^[6-9]\d{9}$/;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

function normalizeMobile(value) {
  return String(value || "")
    .replace(/\D/g, "")
    .slice(-10);
}

function normalizePan(value) {
  return String(value || "")
    .replace(/\s/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
}

function stripDataUrl(base64) {
  const raw = String(base64 || "").trim();
  const comma = raw.indexOf(",");
  if (raw.startsWith("data:") && comma !== -1) return raw.slice(comma + 1);
  return raw;
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

  if (!applyRateLimit(req, res, LIMITS.receiptRequest)) return;

  const contentLength = Number(
    (req.headers && (req.headers["content-length"] || req.headers["Content-Length"])) || 0
  );
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Payload too large. Please use a smaller screenshot." });
  }

  if (!isEmailConfigured()) {
    return res.status(503).json({
      error:
        "Receipt request email is not configured right now. Please email aadarfoundation2018@gmail.com directly.",
    });
  }

  const body = getJsonBody(req);
  if (body == null || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const name = sanitizeText(body.name || body.donor_name, 120).trim();
  const fatherOrHusbandName = sanitizeText(
    body.father_or_husband_name || body.fatherOrHusbandName || "",
    120
  ).trim();
  const email = sanitizeText(body.email || body.donor_email, 120).trim().toLowerCase();
  const mobile = normalizeMobile(body.mobile || body.donor_contact);
  const pan = normalizePan(body.pan || body.donor_pan);
  const address = sanitizeText(body.address || body.donor_address, 400).trim();
  const city = sanitizeText(body.city || body.donor_city, 80).trim();
  const state = sanitizeText(body.state || body.donor_state, 80).trim();
  const pin = String(body.pin || body.donor_pin || "")
    .replace(/\D/g, "")
    .slice(0, 6);
  const transactionRef = sanitizeText(
    body.transaction_ref || body.transactionRef || body.utr,
    80
  ).trim();
  const paidAt = sanitizeText(body.paid_at || body.paidAt, 32).trim();
  const amountInr = Math.round(Number(body.amount_inr || body.amountInr));

  if (!name || name.length < 2) {
    return res.status(400).json({ error: "Full name is required." });
  }
  if (!fatherOrHusbandName) {
    return res.status(400).json({ error: "Father / husband name is required." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  if (!MOBILE_RE.test(mobile)) {
    return res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
  }
  if (!PAN_RE.test(pan)) {
    return res.status(400).json({ error: "Enter a valid PAN (required for 80G receipt)." });
  }
  if (!address || address.length < 5) {
    return res.status(400).json({ error: "Address is required." });
  }
  if (!city) {
    return res.status(400).json({ error: "City is required." });
  }
  if (!state) {
    return res.status(400).json({ error: "State is required." });
  }
  if (pin.length !== 6) {
    return res.status(400).json({ error: "Enter a valid 6-digit PIN." });
  }
  if (!Number.isFinite(amountInr) || amountInr < 1) {
    return res.status(400).json({ error: "Enter a valid donation amount." });
  }
  if (amountInr > 500000) {
    return res.status(400).json({ error: "Maximum donation amount is ₹5,00,000." });
  }
  if (!paidAt) {
    return res.status(400).json({ error: "Payment date is required." });
  }
  if (!transactionRef || transactionRef.length < 4) {
    return res.status(400).json({ error: "UTR / Bank reference is required." });
  }

  const screenshotBase64 = stripDataUrl(body.screenshot_base64 || body.screenshotBase64);
  const screenshotType = String(body.screenshot_type || body.screenshotType || "image/jpeg")
    .trim()
    .toLowerCase();
  const screenshotName = sanitizeText(
    body.screenshot_name || body.screenshotName || "payment-screenshot.jpg",
    80
  ).trim();

  if (!screenshotBase64) {
    return res.status(400).json({ error: "Payment screenshot is required." });
  }
  if (!ALLOWED_IMAGE_TYPES.has(screenshotType)) {
    return res.status(400).json({ error: "Screenshot must be a JPG, PNG, or WebP image." });
  }

  let screenshotBytes = 0;
  try {
    screenshotBytes = Buffer.from(screenshotBase64, "base64").length;
  } catch {
    return res.status(400).json({ error: "Invalid screenshot file." });
  }
  if (!screenshotBytes || screenshotBytes > MAX_SCREENSHOT_BYTES) {
    return res.status(400).json({
      error: "Screenshot is too large. Please upload an image under 3 MB.",
    });
  }

  try {
    const result = await sendReceiptRequestEmail(
      {
        name,
        fatherOrHusbandName,
        email,
        mobile,
        pan,
        address,
        city,
        state,
        pin,
        amountInr,
        paidAt,
        transactionRef,
        paymentMethodLabel: "Direct QR / Bank Transfer",
      },
      {
        filename: screenshotName || "payment-screenshot.jpg",
        contentBase64: screenshotBase64,
        contentType: screenshotType === "image/jpg" ? "image/jpeg" : screenshotType,
      }
    );

    if (!result.sent) {
      if (result.reason === "screenshot_too_large") {
        return res.status(400).json({
          error: "Screenshot is too large. Please upload an image under 3 MB.",
        });
      }
      return res.status(503).json({
        error:
          "Could not send your request right now. Please email aadarfoundation2018@gmail.com directly.",
      });
    }

    return res.status(200).json({ ok: true, emailed_to: result.to });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[receipt-request]", err && err.message ? err.message : err);
    return res.status(502).json({
      error:
        "Could not send your request right now. Please email aadarfoundation2018@gmail.com directly.",
    });
  }
};
