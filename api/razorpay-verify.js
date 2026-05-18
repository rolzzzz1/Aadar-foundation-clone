const crypto = require("crypto");
const {
  applySecurityHeaders,
  getJsonBody,
  isProduction,
  originIsAllowed,
  validateRzpId,
  validateSignatureHex,
} = require("./_lib/donation");

const MAX_BODY_BYTES = 2 * 1024;

module.exports = async function handler(req, res) {
  applySecurityHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!originIsAllowed(req)) {
    return res.status(403).json({ error: "Forbidden" });
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

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const givenBuf = Buffer.from(signature, "utf8");

  if (expectedBuf.length !== givenBuf.length) {
    return res.status(200).json({ verified: false });
  }

  let verified = false;
  try {
    verified = crypto.timingSafeEqual(expectedBuf, givenBuf);
  } catch {
    verified = false;
  }

  return res.status(200).json({ verified });
};
