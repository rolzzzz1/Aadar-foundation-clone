const Razorpay = require("razorpay");
const {
  MAX_AMOUNT_PAISE,
  MIN_AMOUNT_PAISE,
  PROGRAMS,
  applySecurityHeaders,
  getJsonBody,
  isProduction,
  originIsAllowed,
  paymentsAreEnabled,
  paymentsDisabledResponse,
  sanitizeReceipt,
  validateAmountPaise,
  validateOrderNotes,
  formatRazorpayError,
} = require("./_lib/donation");
const { applyRateLimit, LIMITS } = require("./_lib/rateLimit");

const MAX_BODY_BYTES = 4 * 1024;

module.exports = async function handler(req, res) {
  applySecurityHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!originIsAllowed(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (!applyRateLimit(req, res, LIMITS.order)) return;

  if (!paymentsAreEnabled()) {
    return res.status(503).json(paymentsDisabledResponse());
  }

  const contentLength = Number(
    (req.headers && (req.headers["content-length"] || req.headers["Content-Length"])) || 0
  );
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Payload too large" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const keyMode =
    keyId && keyId.startsWith("rzp_test_")
      ? "test"
      : keyId && keyId.startsWith("rzp_live_")
      ? "live"
      : "unknown";

  if (!isProduction() && keyMode === "live") {
    return res.status(400).json({
      error:
        "Live Razorpay keys cannot be used in local development. Switch Dashboard to Test Mode and use rzp_test_ keys in .env.",
    });
  }

  if (!keyId || !keySecret) {
    if (!isProduction()) {
      return res.status(500).json({
        error: "Missing Razorpay server environment variables",
        details: {
          hasKeyId: !!keyId,
          hasKeySecret: !!keySecret,
          hint: "Add RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and REACT_APP_RAZORPAY_KEY_ID to .env.local in the project root, then restart npm start.",
        },
      });
    }
    return res.status(500).json({ error: "Payments are not configured." });
  }

  const body = getJsonBody(req);
  if (body == null || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body." });
  }

  let amountPaise;
  let programLabel = null;

  if (body.purpose != null && body.purpose !== "") {
    const key = String(body.purpose);
    const program = Object.prototype.hasOwnProperty.call(PROGRAMS, key) ? PROGRAMS[key] : null;
    if (!program) {
      return res.status(400).json({ error: "Unknown program." });
    }
    amountPaise = program.amountInr * 100;
    programLabel = program.label;
  } else {
    const v = validateAmountPaise(body.amount);
    if (!v.ok) {
      return res.status(400).json({ error: v.error });
    }
    amountPaise = v.value;
  }

  if (amountPaise < MIN_AMOUNT_PAISE || amountPaise > MAX_AMOUNT_PAISE) {
    return res.status(400).json({ error: "Amount out of allowed range." });
  }

  const currency = body.currency == null ? "INR" : String(body.currency).toUpperCase();
  if (currency !== "INR") {
    return res.status(400).json({ error: "Only INR is supported." });
  }

  const receipt = sanitizeReceipt(body.receipt);
  const notesResult = validateOrderNotes(body.notes);
  if (!notesResult.ok) {
    return res.status(400).json({ error: notesResult.error });
  }
  const notes = notesResult.notes;
  if (programLabel) notes.purpose = programLabel;

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency,
      receipt,
      notes,
      payment_capture: 1,
    });

    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      key_mode: keyMode,
    });
  } catch (err) {
    if (!isProduction()) {
      // eslint-disable-next-line no-console
      console.error("razorpay-order error:", err);
      return res.status(502).json({
        error: "Failed to create order",
        details: formatRazorpayError(err),
      });
    }
    return res.status(502).json({ error: "Failed to create order." });
  }
};
