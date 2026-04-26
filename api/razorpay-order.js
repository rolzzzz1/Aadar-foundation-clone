const Razorpay = require("razorpay");

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

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({
      error: "Missing Razorpay server environment variables",
      details: {
        hasKeyId: !!keyId,
        hasKeySecret: !!keySecret,
      },
    });
  }

  const body = getJsonBody(req);
  const amount = Number(body.amount);
  const currency = body.currency || "INR";
  const receipt = body.receipt || `rcpt_${Date.now()}`;
  const notes = body.notes || {};

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount (in paise)" });
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      notes,
    });

    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({
      error: "Failed to create order",
      details: err?.message || String(err),
    });
  }
};

