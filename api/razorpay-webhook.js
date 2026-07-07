const crypto = require("crypto");
const { applySecurityHeaders, isProduction, paymentsAreEnabled } = require("../server/_lib/donation");
const { getWebhookRawBody } = require("../server/_lib/rawBody");
const { fetchOrder, validateCapturedPayment } = require("../server/_lib/razorpay");
const { updateDonationRecordStatus } = require("../server/_lib/donationRecord");
const { persistCapturedDonation } = require("../server/_lib/donationPersist");

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

function logWebhookSkip(event, reason, meta) {
  // eslint-disable-next-line no-console
  console.warn("[razorpay-webhook] skipped", { event, reason, ...meta });
}

async function handlePaymentCaptured(paymentEntity) {
  if (!paymentEntity || !paymentEntity.id || !paymentEntity.order_id) {
    logWebhookSkip("payment.captured", "missing_payment_or_order", {
      payment_id: paymentEntity && paymentEntity.id,
    });
    return;
  }

  let order = null;
  try {
    order = await fetchOrder(paymentEntity.order_id);
  } catch {
    order = null;
  }

  if (!order) {
    logWebhookSkip("payment.captured", "order_fetch_failed", {
      payment_id: paymentEntity.id,
      order_id: paymentEntity.order_id,
    });
    return;
  }

  const check = validateCapturedPayment(paymentEntity, paymentEntity.order_id, order);
  if (!check.ok) {
    logWebhookSkip("payment.captured", check.reason, {
      payment_id: paymentEntity.id,
      order_id: paymentEntity.order_id,
      payment_status: check.payment_status,
    });
    return;
  }

  const persisted = await persistCapturedDonation({
    payment: paymentEntity,
    order,
    source: "webhook",
  });
  if (!persisted.saved) {
    // eslint-disable-next-line no-console
    console.warn("[razorpay-webhook] payment.captured but donation not saved", {
      payment_id: paymentEntity.id,
      reason: persisted.reason,
    });
  }
}

async function handlePaymentFailed(paymentEntity) {
  if (!paymentEntity || !paymentEntity.id) return;

  const saved = await updateDonationRecordStatus(paymentEntity.id, {
    status: "failed",
    source: "webhook",
  });
  if (!saved.saved && saved.reason !== "not_configured") {
    // eslint-disable-next-line no-console
    console.warn("[razorpay-webhook] payment.failed status not updated", {
      payment_id: paymentEntity.id,
      reason: saved.reason,
    });
  }
}

async function handleRefund(refundEntity, event) {
  if (!refundEntity || !refundEntity.payment_id) return;

  const saved = await updateDonationRecordStatus(refundEntity.payment_id, {
    status: "refunded",
    source: "webhook",
  });
  if (!saved.saved && saved.reason !== "not_configured") {
    // eslint-disable-next-line no-console
    console.warn("[razorpay-webhook] refund status not updated", {
      event,
      payment_id: refundEntity.payment_id,
      refund_id: refundEntity.id,
      reason: saved.reason,
    });
  }
}

async function handleDispute(paymentEntity) {
  if (!paymentEntity || !paymentEntity.id) return;

  const saved = await updateDonationRecordStatus(paymentEntity.id, {
    status: "disputed",
    source: "webhook",
  });
  if (!saved.saved && saved.reason !== "not_configured") {
    // eslint-disable-next-line no-console
    console.warn("[razorpay-webhook] dispute status not updated", {
      payment_id: paymentEntity.id,
      reason: saved.reason,
    });
  }
}

module.exports = async function handler(req, res) {
  applySecurityHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!paymentsAreEnabled()) {
    return res.status(503).json({ error: "Webhook not accepting payments yet." });
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
  const refundEntity =
    payload &&
    payload.payload &&
    payload.payload.refund &&
    payload.payload.refund.entity;

  try {
    if (event === "payment.captured") {
      await handlePaymentCaptured(paymentEntity);
    } else if (event === "payment.failed") {
      await handlePaymentFailed(paymentEntity);
    } else if (
      event === "refund.created" ||
      event === "refund.processed" ||
      event === "refund.failed"
    ) {
      await handleRefund(refundEntity, event);
    } else if (
      event === "payment.dispute.created" ||
      event === "payment.dispute.won" ||
      event === "payment.dispute.lost"
    ) {
      await handleDispute(paymentEntity);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[razorpay-webhook] handler error", {
      event,
      message: err && err.message ? err.message : String(err),
    });
  }

  return res.status(200).json({ ok: true });
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
