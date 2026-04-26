const crypto = require("crypto");

function getJsonBody(req) {
  if (req?.body && typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req?.body || "{}");
  } catch {
    return {};
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(500).json({ error: "Missing RAZORPAY_KEY_SECRET" });
  }

  const body = getJsonBody(req);
  const orderId = body.razorpay_order_id;
  const paymentId = body.razorpay_payment_id;
  const signature = body.razorpay_signature;

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const verified = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  return res.status(200).json({ verified });
};

