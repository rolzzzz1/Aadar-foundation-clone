/**
 * In-memory per-IP rate limiting for payment API routes.
 * Best-effort on serverless (each instance has its own bucket). For stricter
 * limits across instances, add Vercel KV / Upstash later.
 */

const buckets = new Map();

const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup(now) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

function getClientIp(req) {
  const forwarded =
    (req.headers &&
      (req.headers["x-forwarded-for"] || req.headers["X-Forwarded-For"])) ||
    "";
  const first = String(forwarded).split(",")[0].trim();
  if (first) return first;

  const realIp =
    (req.headers && (req.headers["x-real-ip"] || req.headers["X-Real-Ip"])) || "";
  if (realIp) return String(realIp).trim();

  return "unknown";
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {{ bucket: string, max: number, windowMs: number }} options
 * @returns {{ allowed: boolean, retryAfterSec?: number }}
 */
function checkRateLimit(req, { bucket, max, windowMs }) {
  const now = Date.now();
  cleanup(now);

  const ip = getClientIp(req);
  const key = `${bucket}:${ip}`;
  let entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    buckets.set(key, entry);
  }

  entry.count += 1;

  if (entry.count > max) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  return { allowed: true };
}

/**
 * Send 429 when over limit. Returns true if the request may proceed.
 */
function applyRateLimit(req, res, options) {
  const result = checkRateLimit(req, options);
  if (result.allowed) return true;

  res.setHeader("Retry-After", String(result.retryAfterSec));
  res.status(429).json({
    error: "Too many requests. Please wait a moment and try again.",
  });
  return false;
}

/** Presets tuned for donation flows */
const LIMITS = Object.freeze({
  order: { bucket: "razorpay-order", max: 20, windowMs: 15 * 60 * 1000 },
  verify: { bucket: "razorpay-verify", max: 40, windowMs: 15 * 60 * 1000 },
  receipt: { bucket: "donation-receipt", max: 12, windowMs: 15 * 60 * 1000 },
  confirm: { bucket: "donation-confirm", max: 20, windowMs: 15 * 60 * 1000 },
});

module.exports = {
  applyRateLimit,
  checkRateLimit,
  getClientIp,
  LIMITS,
};
