/**
 * Shared donation validation, sanitization and program metadata for API
 * routes. Server-side mirror of `src/utils/donation.js` — keep limits and
 * the PROGRAMS map in sync.
 *
 * SECURITY: This file is the source of truth for the order/verify endpoints.
 * Never trust client-supplied amounts blindly — always run them through
 * `validateAmountPaise` (or override via `purpose` -> PROGRAMS) before
 * forwarding to Razorpay.
 */

const MIN_AMOUNT_INR = 1;
const MAX_AMOUNT_INR = 500000;
const MIN_AMOUNT_PAISE = MIN_AMOUNT_INR * 100;
const MAX_AMOUNT_PAISE = MAX_AMOUNT_INR * 100;

const NAME_MAX = 80;
const ADDRESS_MAX = 200;
const EMAIL_MAX = 254;
const NOTE_MAX = 240;

/** Server-enforced canonical prices. Keep in sync with src/utils/donation.js. */
const PROGRAMS = Object.freeze({
  "donate-501": {
    label: "Membership — ₹501",
    amountInr: 501,
  },
  "donate-1001": {
    label: "Donation — ₹1,001",
    amountInr: 1001,
  },
  "meal-sponsorship": {
    label: "Meal Sponsorship — ₹1,501",
    amountInr: 1501,
  },
  "sponsor-prabhuji-month": {
    label: "Sponsor a Prabhuji (1 month)",
    amountInr: 3001,
  },
  "sponsor-prabhuji-year": {
    label: "Sponsor a Prabhuji (1 year)",
    amountInr: 30001,
  },
});

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
// eslint-disable-next-line no-misleading-character-class
const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g;

function sanitizeText(v, maxLen) {
  if (v == null) return "";
  const s = String(v).replace(CONTROL_CHARS, "").replace(ZERO_WIDTH, "").trim();
  return s.slice(0, Math.max(0, maxLen));
}

function isPlainObject(v) {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

function validateAmountPaise(input) {
  const n = Number(input);
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    return { ok: false, error: "Amount must be an integer (in paise)." };
  }
  if (n < MIN_AMOUNT_PAISE) {
    return { ok: false, error: `Amount below the minimum of ${MIN_AMOUNT_PAISE} paise.` };
  }
  if (n > MAX_AMOUNT_PAISE) {
    return { ok: false, error: `Amount above the maximum of ${MAX_AMOUNT_PAISE} paise.` };
  }
  return { ok: true, value: n };
}

function sanitizeReceipt(input) {
  const s = String(input || "")
    .replace(/[^A-Za-z0-9_-]/g, "")
    .slice(0, 40);
  return s || `rcpt_${Date.now()}`;
}

function sanitizeNotes(input) {
  if (!isPlainObject(input)) return {};
  const out = {};
  const keys = Object.keys(input).slice(0, 8);
  for (const k of keys) {
    const key = sanitizeText(k, 32);
    if (!key) continue;
    out[key] = sanitizeText(input[k], 256);
  }
  return out;
}

function normalizeOrigin(value) {
  const trimmed = String(value || "")
    .trim()
    .replace(/\/$/, "");
  if (!trimmed) return "";
  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed;
  }
}

/** Canonical site origins — used when ALLOWED_ORIGINS is unset on Vercel. */
const DEFAULT_PRODUCTION_ORIGINS = Object.freeze([
  "https://www.aadarfoundation.org",
  "https://aadarfoundation.org",
]);

function getAllowedOrigins() {
  const fromEnv = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

  const extra = [];
  if (process.env.VERCEL_URL) {
    extra.push(normalizeOrigin(`https://${process.env.VERCEL_URL}`));
  }

  const defaults =
    isProduction() && fromEnv.length === 0
      ? DEFAULT_PRODUCTION_ORIGINS.map(normalizeOrigin).filter(Boolean)
      : [];

  return [...new Set([...fromEnv, ...defaults, ...extra])];
}

function getRequestOrigin(req) {
  const origin = (req.headers && (req.headers.origin || req.headers.Origin)) || "";
  if (origin) return origin;

  const referer = (req.headers && (req.headers.referer || req.headers.Referer)) || "";
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      return "";
    }
  }

  const host = (req.headers && req.headers.host) || "";
  if (!host) return "";

  const protoHeader = req.headers["x-forwarded-proto"] || req.headers["X-Forwarded-Proto"];
  const proto = String(protoHeader || "https")
    .split(",")[0]
    .trim();
  return `${proto}://${host}`;
}

/** True when the browser origin matches the host serving this API (same deployment). */
function isSameDeploymentHost(req, requestOrigin) {
  const host = (req.headers && req.headers.host) || "";
  if (!host || !requestOrigin) return false;
  try {
    return new URL(requestOrigin).host === host.split(":")[0];
  } catch {
    return false;
  }
}

/**
 * Reject cross-origin POSTs. Production allows DEFAULT_PRODUCTION_ORIGINS when
 * ALLOWED_ORIGINS is unset, plus same-host requests to the current deployment.
 */
function originIsAllowed(req) {
  const requestOrigin = getRequestOrigin(req);
  if (!requestOrigin) {
    return !isProduction();
  }

  if (isSameDeploymentHost(req, requestOrigin)) {
    return true;
  }

  const allowList = getAllowedOrigins();
  if (allowList.length === 0) {
    return !isProduction();
  }

  try {
    const url = new URL(requestOrigin);
    return allowList.includes(url.origin);
  } catch {
    return false;
  }
}

function isProduction() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

const HEX_SIGNATURE = /^[a-f0-9]{64}$/i;
const RZP_ID = /^[A-Za-z0-9_-]{1,64}$/;

function validateRzpId(v) {
  return typeof v === "string" && RZP_ID.test(v);
}

function validateSignatureHex(v) {
  return typeof v === "string" && HEX_SIGNATURE.test(v);
}

function getJsonBody(req) {
  if (req && req.body && typeof req.body === "object") return req.body;
  try {
    return JSON.parse((req && req.body) || "{}");
  } catch {
    return {};
  }
}

function applySecurityHeaders(res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
}

/** Human-readable message from Razorpay Node SDK errors. */
function formatRazorpayError(err) {
  if (!err) return "Unknown Razorpay error";
  if (typeof err === "string") return err;
  if (err.error && typeof err.error === "object") {
    const desc = err.error.description || err.error.reason;
    const code = err.error.code;
    if (desc && code) return `${desc} (${code})`;
    if (desc) return String(desc);
    if (code) return String(code);
  }
  if (typeof err.message === "string" && err.message && err.message !== "[object Object]") {
    return err.message;
  }
  if (err.statusCode) return `Razorpay request failed (HTTP ${err.statusCode})`;
  try {
    return JSON.stringify(err.error || err);
  } catch {
    return String(err);
  }
}

module.exports = {
  MIN_AMOUNT_INR,
  MAX_AMOUNT_INR,
  MIN_AMOUNT_PAISE,
  MAX_AMOUNT_PAISE,
  NAME_MAX,
  EMAIL_MAX,
  NOTE_MAX,
  PROGRAMS,
  sanitizeText,
  sanitizeReceipt,
  sanitizeNotes,
  isPlainObject,
  validateAmountPaise,
  validateRzpId,
  validateSignatureHex,
  getAllowedOrigins,
  originIsAllowed,
  isProduction,
  getJsonBody,
  applySecurityHeaders,
  formatRazorpayError,
};
