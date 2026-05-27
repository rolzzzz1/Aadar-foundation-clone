const crypto = require("crypto");
const { applySecurityHeaders, isProduction } = require("./_lib/donation");
const { getWebhookRawBody } = require("./_lib/rawBody");
const { fetchOrder } = require("./_lib/razorpay");
const {
  buildRecordFromRazorpay,
  saveDonationRecord,
} = require("./_lib/donationRecord");

const MAX_BODY_BYTES = 64 * 1024;

function verifyWebhookSignature(rawBody, signature, secret) {
  if (!signature || !secret || !rawBody) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  const givenBuf = Buffer.from(String(signature), "utf8");
  if (expectedBuf.length !== givenBuf.length) return false;
  try {
    return crypto.timingSafeEqual(expectedBuf, givenBuf);
  } catch {
    return false;
  }
}

function debugSnippet(value, maxLen = 140) {
  if (!value) return "";
  return String(value).replace(/\s+/g, " ").slice(0, maxLen);
}

module.exports = async function handler(req, res) {
  applySecurityHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    if (!isProduction()) {
      return res.status(500).json({ error: "Missing RAZORPAY_WEBHOOK_SECRET" });
    }
    return res.status(500).json({ error: "Webhook not configured." });
  }

  const contentLength = Number(
    (req.headers && (req.headers["content-length"] || req.headers["Content-Length"])) || 0
  );
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Payload too large" });
  }

  const rawBody = await getWebhookRawBody(req);
  const signature =
    (req.headers && (req.headers["x-razorpay-signature"] || req.headers["X-Razorpay-Signature"])) ||
    "";

  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    // Debugging help (safe): log what we received without leaking secrets.
    // This is intentionally logged in production because webhook issues are
    // operational and otherwise hard to diagnose.
    // eslint-disable-next-line no-console
    console.warn("[razorpay-webhook] invalid signature", {
      has_signature_header: !!signature,
      signature_len: signature ? String(signature).length : 0,
      raw_len: rawBody ? String(rawBody).length : 0,
      content_type:
        (req.headers && (req.headers["content-type"] || req.headers["Content-Type"])) || "",
      ua: (req.headers && (req.headers["user-agent"] || req.headers["User-Agent"])) || "",
      raw_snippet: debugSnippet(rawBody),
    });
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    // eslint-disable-next-line no-console
    console.warn("[razorpay-webhook] invalid JSON", {
      raw_len: rawBody ? String(rawBody).length : 0,
      raw_snippet: debugSnippet(rawBody),
    });
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const event = payload && payload.event;
  const paymentEntity =
    payload &&
    payload.payload &&
    payload.payload.payment &&
    payload.payload.payment.entity;

  if (event === "payment.captured" && paymentEntity && paymentEntity.id) {
    let order = null;
    if (paymentEntity.order_id) {
      try {
        order = await fetchOrder(paymentEntity.order_id);
      } catch {
        order = null;
      }
    }

    const record = buildRecordFromRazorpay({
      payment: paymentEntity,
      order,
      source: "webhook",
    });
    const saved = await saveDonationRecord(record);
    if (!saved.saved) {
      // eslint-disable-next-line no-console
      console.warn("[razorpay-webhook] payment.captured but donation not saved", {
        payment_id: paymentEntity.id,
        reason: saved.reason,
      });
    }
  }

  return res.status(200).json({ ok: true });
};

// Vercel: keep the request body raw so X-Razorpay-Signature verification succeeds.
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
