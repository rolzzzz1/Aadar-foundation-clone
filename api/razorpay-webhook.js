const crypto = require("crypto");
const { applySecurityHeaders, isProduction, paymentsAreEnabled } = require("../server/_lib/donation");
const { getWebhookRawBody } = require("../server/_lib/rawBody");
const { fetchOrder, validateCapturedPayment } = require("../server/_lib/razorpay");
const { updateDonationRecordStatus } = require("../server/_lib/donationRecord");
const {
  persistCapturedDonation,
  persistRazorpayQrDonation,
} = require("../server/_lib/donationPersist");
const { updateSubscriptionRecord } = require("../server/_lib/membershipRecord");

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
  if (!paymentEntity || !paymentEntity.id) {
    logWebhookSkip("payment.captured", "missing_payment", {});
    return;
  }

  // Static QR / order-less UPI: no Razorpay order — still log to Supabase.
  if (!paymentEntity.order_id) {
    const status = String(paymentEntity.status || "").toLowerCase();
    if (status !== "captured") {
      logWebhookSkip("payment.captured", "qr_not_captured", {
        payment_id: paymentEntity.id,
        payment_status: status,
      });
      return;
    }

    const persisted = await persistRazorpayQrDonation({
      payment: paymentEntity,
      source: "razorpay_qr",
    });
    if (!persisted.saved) {
      // eslint-disable-next-line no-console
      console.warn("[razorpay-webhook] QR payment.captured but donation not saved", {
        payment_id: paymentEntity.id,
        reason: persisted.reason,
      });
    }
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

function unixToIso(seconds) {
  if (!Number.isFinite(Number(seconds))) return null;
  return new Date(Number(seconds) * 1000).toISOString();
}

function subscriptionCyclePatch(subscriptionEntity, source) {
  return {
    status: subscriptionEntity.status,
    current_start: unixToIso(subscriptionEntity.current_start),
    current_end: unixToIso(subscriptionEntity.current_end),
    charge_at: unixToIso(subscriptionEntity.charge_at),
    paid_count: subscriptionEntity.paid_count,
    source,
  };
}

/**
 * Each successful recurring charge (including the first, authorising one) fires
 * `subscription.charged` with both the subscription and payment entities inline —
 * persisted as a `donations` row so it appears in receipts/admin tools like any other gift.
 */
async function handleSubscriptionCharged(subscriptionEntity, paymentEntity) {
  if (!subscriptionEntity || !subscriptionEntity.id || !paymentEntity || !paymentEntity.id) {
    logWebhookSkip("subscription.charged", "missing_subscription_or_payment", {
      subscription_id: subscriptionEntity && subscriptionEntity.id,
      payment_id: paymentEntity && paymentEntity.id,
    });
    return;
  }

  const status = String(paymentEntity.status || "").toLowerCase();
  if (status !== "captured") {
    logWebhookSkip("subscription.charged", "not_captured", {
      subscription_id: subscriptionEntity.id,
      payment_id: paymentEntity.id,
      payment_status: status,
    });
    return;
  }

  const subsNotes = subscriptionEntity.notes || {};
  const persisted = await persistCapturedDonation({
    payment: paymentEntity,
    order: { notes: subsNotes, receipt: subscriptionEntity.id },
    source: "subscription_webhook",
    subscriptionId: subscriptionEntity.id,
    frequency: subsNotes.frequency || null,
  });
  if (!persisted.saved) {
    // eslint-disable-next-line no-console
    console.warn("[razorpay-webhook] subscription.charged but donation not saved", {
      subscription_id: subscriptionEntity.id,
      payment_id: paymentEntity.id,
      reason: persisted.reason,
    });
  }

  const saved = await updateSubscriptionRecord(
    subscriptionEntity.id,
    subscriptionCyclePatch(subscriptionEntity, "webhook")
  );
  if (!saved.saved && saved.reason !== "not_configured") {
    // eslint-disable-next-line no-console
    console.warn("[razorpay-webhook] subscription.charged record not updated", {
      subscription_id: subscriptionEntity.id,
      reason: saved.reason,
    });
  }
}

/** Lifecycle-only events (no payment attached) — just sync status/cycle dates. */
async function handleSubscriptionStatusEvent(subscriptionEntity, event) {
  if (!subscriptionEntity || !subscriptionEntity.id) {
    logWebhookSkip(event, "missing_subscription", {});
    return;
  }
  const saved = await updateSubscriptionRecord(
    subscriptionEntity.id,
    subscriptionCyclePatch(subscriptionEntity, "webhook")
  );
  if (!saved.saved && saved.reason !== "not_configured") {
    // eslint-disable-next-line no-console
    console.warn(`[razorpay-webhook] ${event} record not updated`, {
      subscription_id: subscriptionEntity.id,
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
  const subscriptionEntity =
    payload &&
    payload.payload &&
    payload.payload.subscription &&
    payload.payload.subscription.entity;

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
    } else if (event === "subscription.charged") {
      await handleSubscriptionCharged(subscriptionEntity, paymentEntity);
    } else if (
      event === "subscription.activated" ||
      event === "subscription.completed" ||
      event === "subscription.cancelled" ||
      event === "subscription.halted" ||
      event === "subscription.paused" ||
      event === "subscription.resumed" ||
      event === "subscription.pending"
    ) {
      await handleSubscriptionStatusEvent(subscriptionEntity, event);
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
