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

function getAllowedOrigins() {
  const env = process.env.ALLOWED_ORIGINS || "";
  return env
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Reject cross-origin POSTs in production. In dev / preview where no
 * allowlist is configured, allow everything (this avoids breaking
 * `localhost:3000` calls against `localhost:3001`).
 */
function originIsAllowed(req) {
  const allowList = getAllowedOrigins();
  if (allowList.length === 0) return true;
  const origin = (req.headers && (req.headers.origin || req.headers.Origin)) || "";
  const referer = (req.headers && (req.headers.referer || req.headers.Referer)) || "";
  const candidate = origin || referer;
  if (!candidate) return false;
  try {
    const url = new URL(candidate);
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
