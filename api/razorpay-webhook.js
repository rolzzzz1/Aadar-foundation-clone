const crypto = require("crypto");
const { applySecurityHeaders, isProduction, paymentsAreEnabled } = require("../server/_lib/donation");
const { getWebhookRawBody } = require("../server/_lib/rawBody");
const { fetchOrder, fetchPayment, validateCapturedPayment } = require("../server/_lib/razorpay");
const {
  updateDonationRecordStatus,
  fetchDonationByPaymentId,
  isStaticQrPayment,
} = require("../server/_lib/donationRecord");
const {
  BEFORE_RECORD_CUTOFF,
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

/** Razorpay's "Send test webhook" uses a sample id that is not a real payment. */
function razorpayRecordMissing(err) {
  const message = err && err.message ? String(err.message) : String(err || "");
  return /does not exist|not found/i.test(message);
}

async function saveQrPayment(payment, logEvent) {
  const persisted = await persistRazorpayQrDonation({
    payment,
    source: "razorpay_qr",
  });
  if (!persisted.saved) {
    if (persisted.reason === BEFORE_RECORD_CUTOFF) {
      logWebhookSkip(logEvent, BEFORE_RECORD_CUTOFF, {
        payment_id: payment && payment.id,
      });
      return { retry: false };
    }
    // eslint-disable-next-line no-console
    console.warn(`[razorpay-webhook] ${logEvent} but donation not saved`, {
      payment_id: payment && payment.id,
      reason: persisted.reason,
    });
    return { retry: persisted.reason !== "invalid_qr_payment" };
  }
  return { retry: false };
}

async function handlePaymentCaptured(paymentEntity) {
  if (!paymentEntity || !paymentEntity.id) {
    logWebhookSkip("payment.captured", "missing_payment", {});
    return;
  }

  // Static QR: Razorpay may attach an auto-created order whose amount does not match the gift.
  if (isStaticQrPayment(paymentEntity)) {
    const status = String(paymentEntity.status || "").toLowerCase();
    if (status !== "captured") {
      logWebhookSkip("payment.captured", "qr_not_captured", {
        payment_id: paymentEntity.id,
        payment_status: status,
      });
      return;
    }
    return saveQrPayment(paymentEntity, "QR payment.captured");
  }

  let order = null;
  try {
    order = await fetchOrder(paymentEntity.order_id);
  } catch (err) {
    if (razorpayRecordMissing(err)) {
      logWebhookSkip("payment.captured", "order_not_in_razorpay", {
        payment_id: paymentEntity.id,
        order_id: paymentEntity.order_id,
      });
      return { retry: false };
    }
    order = null;
  }

  if (!order) {
    logWebhookSkip("payment.captured", "order_fetch_failed", {
      payment_id: paymentEntity.id,
      order_id: paymentEntity.order_id,
    });
    return { retry: true };
  }

  const check = validateCapturedPayment(paymentEntity, paymentEntity.order_id, order);
  if (!check.ok) {
    if (check.reason === "amount_mismatch") {
      const persisted = await persistCapturedDonation({
        payment: paymentEntity,
        order,
        source: "webhook",
        sendEmail: false,
      });
      if (!persisted.saved) {
        if (persisted.reason === BEFORE_RECORD_CUTOFF) {
          logWebhookSkip("payment.captured", BEFORE_RECORD_CUTOFF, {
            payment_id: paymentEntity.id,
          });
          return { retry: false };
        }
        return { retry: true };
      }
      return { retry: false };
    }
    logWebhookSkip("payment.captured", check.reason, {
      payment_id: paymentEntity.id,
      order_id: paymentEntity.order_id,
      payment_status: check.payment_status,
    });
    return { retry: false };
  }

  const persisted = await persistCapturedDonation({
    payment: paymentEntity,
    order,
    source: "webhook",
  });
  if (!persisted.saved) {
    if (persisted.reason === BEFORE_RECORD_CUTOFF) {
      logWebhookSkip("payment.captured", BEFORE_RECORD_CUTOFF, {
        payment_id: paymentEntity.id,
      });
      return { retry: false };
    }
    // eslint-disable-next-line no-console
    console.warn("[razorpay-webhook] payment.captured but donation not saved", {
      payment_id: paymentEntity.id,
      reason: persisted.reason,
    });
    return { retry: true };
  }
  return { retry: false };
}

/**
 * Static QR payments are reported as `qr_code.credited`, not only `payment.captured`.
 * Save the captured payment to Supabase as soon as Razorpay sends that event.
 */
async function handleQrCodeCredited(paymentEntity, qrEntity) {
  if (!paymentEntity || !paymentEntity.id) {
    logWebhookSkip("qr_code.credited", "missing_payment", {
      qr_code_id: qrEntity && qrEntity.id,
    });
    return { retry: false };
  }

  let payment = paymentEntity;
  try {
    const fetched = await fetchPayment(paymentEntity.id);
    if (fetched && fetched.id) payment = fetched;
  } catch (err) {
    if (razorpayRecordMissing(err)) {
      logWebhookSkip("qr_code.credited", "payment_not_in_razorpay", {
        payment_id: paymentEntity.id,
        qr_code_id: qrEntity && qrEntity.id,
      });
      return { retry: false };
    }
    logWebhookSkip("qr_code.credited", "payment_fetch_failed", {
      payment_id: paymentEntity.id,
      qr_code_id: qrEntity && qrEntity.id,
    });
    return { retry: true };
  }

  const status = String((payment && payment.status) || "").toLowerCase();
  if (status !== "captured") {
    logWebhookSkip("qr_code.credited", "not_captured", {
      payment_id: paymentEntity.id,
      payment_status: status,
      qr_code_id: qrEntity && qrEntity.id,
    });
    return { retry: status === "authorized" || status === "created" || status === "pending" };
  }

  if (qrEntity && qrEntity.id && !payment.qr_code_id) {
    payment = { ...payment, qr_code_id: qrEntity.id };
  }

  return saveQrPayment(payment, "qr_code.credited");
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
  if (event !== "refund.processed") return;

  const existing = await fetchDonationByPaymentId(refundEntity.payment_id);
  const refundPaise = Number(refundEntity.amount);
  const paidPaise = existing ? Number(existing.amount_paise) : 0;
  if (existing && refundPaise > 0 && paidPaise > 0 && refundPaise < paidPaise) {
    // eslint-disable-next-line no-console
    console.warn("[razorpay-webhook] partial refund left the receipt captured", {
      payment_id: refundEntity.payment_id,
      refund_paise: refundPaise,
      paid_paise: paidPaise,
    });
    return;
  }

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
    if (persisted.reason === BEFORE_RECORD_CUTOFF) {
      logWebhookSkip("subscription.charged", BEFORE_RECORD_CUTOFF, {
        subscription_id: subscriptionEntity.id,
        payment_id: paymentEntity.id,
      });
      return { retry: false };
    }
    // eslint-disable-next-line no-console
    console.warn("[razorpay-webhook] subscription.charged but donation not saved", {
      subscription_id: subscriptionEntity.id,
      payment_id: paymentEntity.id,
      reason: persisted.reason,
    });
    return { retry: true };
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

async function handleDispute(paymentEntity, event) {
  if (!paymentEntity || !paymentEntity.id) return;

  if (event === "payment.dispute.won") {
    const existing = await fetchDonationByPaymentId(paymentEntity.id);
    if (!existing || String(existing.status || "").toLowerCase() !== "disputed") return;
    const saved = await updateDonationRecordStatus(paymentEntity.id, {
      status: "captured",
      source: "webhook",
    });
    if (!saved.saved && saved.reason !== "not_configured") {
      // eslint-disable-next-line no-console
      console.warn("[razorpay-webhook] dispute won status not restored", {
        payment_id: paymentEntity.id,
        reason: saved.reason,
      });
    }
    return;
  }

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

  let retry = false;
  try {
    if (event === "payment.captured") {
      const result = await handlePaymentCaptured(paymentEntity);
      retry = !!(result && result.retry);
    } else if (event === "qr_code.credited") {
      const qrEntity =
        payload && payload.payload && payload.payload.qr_code && payload.payload.qr_code.entity;
      const result = await handleQrCodeCredited(paymentEntity, qrEntity);
      retry = !!(result && result.retry);
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
      await handleDispute(paymentEntity, event);
    } else if (event === "subscription.charged") {
      const result = await handleSubscriptionCharged(subscriptionEntity, paymentEntity);
      retry = !!(result && result.retry);
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
    } else {
      logWebhookSkip(event || "unknown", "unhandled_event", {
        payment_id: paymentEntity && paymentEntity.id,
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[razorpay-webhook] handler error", {
      event,
      message: err && err.message ? err.message : String(err),
    });
    if (
      event === "payment.captured" ||
      event === "qr_code.credited" ||
      event === "subscription.charged"
    ) {
      retry = true;
    }
  }

  if (retry) {
    return res.status(500).json({ ok: false, retry: true });
  }

  return res.status(200).json({ ok: true });
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
