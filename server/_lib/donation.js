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
const PHONE_LEN = 10;
const PAN_LEN = 10;

/** Whitelisted Razorpay order note keys (keep in sync with checkout). */
const ALLOWED_NOTE_KEYS = Object.freeze([
  "note",
  "donor_name",
  "donor_father_or_husband",
  "donor_email",
  "donor_contact",
  "donor_pan",
  "donor_address",
  "donor_state",
  "donor_city",
  "donor_pin",
  "fcra_declaration",
  "privacy_consent",
  "purpose",
]);

/** Server-enforced canonical prices. Keep in sync with src/utils/donation.js. */
const PROGRAMS = Object.freeze({
  "donate-501": {
    label: "Membership Support — ₹501",
    amountInr: 501,
  },
  "donate-1001": {
    label: "General Donation — ₹1,001",
    amountInr: 1001,
  },
  "meal-sponsorship": {
    label: "Meal Sponsorship — ₹1,501",
    amountInr: 1501,
  },
  "sponsor-prabhuji-month": {
    label: "Sponsor a Prabhuji (1 month) — ₹3,001",
    amountInr: 3001,
  },
  "sponsor-prabhuji-year": {
    label: "Sponsor a Prabhuji (1 year) — ₹30,001",
    amountInr: 30001,
  },
});

/** Label used when checkout has a free/custom amount (no PROGRAMS purpose key). */
function formatGeneralDonationLabel(amountInr) {
  const n = Number(amountInr);
  if (!Number.isFinite(n) || n <= 0) return "General Donation";
  // ASCII-only so Razorpay notes / DB never drop the value due to locale separators.
  const formatted = Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `General Donation - Rs ${formatted}`;
}

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
  for (const k of ALLOWED_NOTE_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(input, k)) continue;
    const key = sanitizeText(k, 32);
    if (!key) continue;
    out[key] = sanitizeText(input[k], 256);
  }
  return out;
}

const NAME_REGEX = /^[\p{L}\p{M}\s'.-]{2,}$/u;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX_IN = /^[6-9]\d{9}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

function validateName(input) {
  const s = sanitizeText(input, NAME_MAX);
  if (!s) return { ok: false, value: "", error: "Name is required." };
  if (s.length < 2) return { ok: false, value: s, error: "Name is too short." };
  if (!NAME_REGEX.test(s)) {
    return { ok: false, value: s, error: "Invalid donor name." };
  }
  return { ok: true, value: s };
}

function validateFatherOrHusbandName(input) {
  const s = sanitizeText(input, NAME_MAX);
  if (!s) return { ok: false, value: "", error: "Father's / husband's name is required." };
  if (s.length < 2) return { ok: false, value: s, error: "Name is too short." };
  if (!NAME_REGEX.test(s)) {
    return { ok: false, value: s, error: "Invalid father / husband name." };
  }
  return { ok: true, value: s };
}

function validateEmail(input) {
  const s = sanitizeText(input, EMAIL_MAX).toLowerCase();
  if (!s) return { ok: false, value: "", error: "Email is required." };
  if (!EMAIL_REGEX.test(s)) {
    return { ok: false, value: s, error: "Invalid email address." };
  }
  return { ok: true, value: s };
}

function validateContactIN(input) {
  const digits = String(input ?? "")
    .replace(/\D/g, "")
    .slice(-PHONE_LEN);
  if (!digits) return { ok: false, value: "", error: "Phone number is required." };
  if (!PHONE_REGEX_IN.test(digits)) {
    return { ok: false, value: digits, error: "Invalid Indian mobile number." };
  }
  return { ok: true, value: digits };
}

function validateAddressLine(input) {
  const s = sanitizeText(input, ADDRESS_MAX);
  if (!s) return { ok: false, value: "", error: "Address is required." };
  if (s.length < 5) return { ok: false, value: s, error: "Address is too short." };
  return { ok: true, value: s };
}

function validateRequiredSelection(input, fieldLabel) {
  const s = sanitizeText(input, 80);
  if (!s) return { ok: false, value: "", error: `${fieldLabel} is required.` };
  return { ok: true, value: s };
}

function validatePinIn(input) {
  const d = String(input ?? "")
    .replace(/\D/g, "")
    .slice(0, 6);
  if (!d) return { ok: false, value: "", error: "PIN code is required." };
  if (d.length !== 6) return { ok: false, value: d, error: "PIN must be 6 digits." };
  return { ok: true, value: d };
}

function validatePan(input) {
  const s = String(input ?? "")
    .replace(/\s/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, PAN_LEN);
  if (!s) return { ok: true, value: "" };
  if (s.length !== PAN_LEN) return { ok: false, value: s, error: "PAN must be 10 characters." };
  if (!PAN_REGEX.test(s)) return { ok: false, value: s, error: "Invalid PAN." };
  return { ok: true, value: s };
}

function validateNote(input) {
  return { ok: true, value: sanitizeText(input, NOTE_MAX) };
}

/**
 * Validate and normalize donor fields before Razorpay order create.
 * @returns {{ ok: boolean, notes?: object, error?: string }}
 */
function validateOrderNotes(rawNotes) {
  const incoming = sanitizeNotes(rawNotes);

  const name = validateName(incoming.donor_name);
  if (!name.ok) return { ok: false, error: name.error };

  const father = validateFatherOrHusbandName(incoming.donor_father_or_husband);
  if (!father.ok) return { ok: false, error: father.error };

  const email = validateEmail(incoming.donor_email);
  if (!email.ok) return { ok: false, error: email.error };

  const contact = validateContactIN(incoming.donor_contact);
  if (!contact.ok) return { ok: false, error: contact.error };

  const pan = validatePan(incoming.donor_pan);
  if (!pan.ok) return { ok: false, error: pan.error };

  const address = validateAddressLine(incoming.donor_address);
  if (!address.ok) return { ok: false, error: address.error };

  const state = validateRequiredSelection(incoming.donor_state, "State");
  if (!state.ok) return { ok: false, error: state.error };

  const city = validateRequiredSelection(incoming.donor_city, "City");
  if (!city.ok) return { ok: false, error: city.error };

  const pin = validatePinIn(incoming.donor_pin);
  if (!pin.ok) return { ok: false, error: pin.error };

  if (incoming.fcra_declaration !== "accepted") {
    return { ok: false, error: "Domestic donation declaration is required before payment." };
  }

  if (incoming.privacy_consent !== "accepted") {
    return { ok: false, error: "Privacy and terms consent is required before payment." };
  }

  const purpose = validateNote(incoming.note);

  return {
    ok: true,
    notes: {
      donor_name: name.value,
      donor_father_or_husband: father.value,
      donor_email: email.value,
      donor_contact: contact.value,
      donor_pan: pan.value,
      donor_address: address.value,
      donor_state: state.value,
      donor_city: city.value,
      donor_pin: pin.value,
      fcra_declaration: "accepted",
      privacy_consent: "accepted",
      note: purpose.value,
    },
  };
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

/**
 * Server-side payments gate — keep in sync with src/utils/paymentsFeature.js.
 * Production (Vercel): off unless PAYMENTS_ENABLED=true.
 * Local api:dev: on unless PAYMENTS_ENABLED=false.
 */
function paymentsAreEnabled() {
  const flag = process.env.PAYMENTS_ENABLED;
  if (flag === "true") return true;
  if (flag === "false") return false;
  return !isProduction();
}

function paymentsDisabledResponse() {
  return { error: "Online donations are not available yet." };
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

/** Human-readable message from Razorpay Node SDK / transport errors. */
function formatRazorpayError(err) {
  if (!err) return "Unknown Razorpay error";
  if (typeof err === "string") return err;
  if (err.code === "transport_failed" && typeof err.message === "string") {
    return err.message;
  }
  if (
    typeof err.message === "string" &&
    /reading 'status'/.test(err.message)
  ) {
    return (
      "Cannot reach Razorpay API (network or SSL error). " +
      "If your keys are correct, set RAZORPAY_INSECURE_TLS=true in .env for local dev only, or NODE_EXTRA_CA_CERTS for a corporate CA bundle, then restart npm start."
    );
  }
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
  ADDRESS_MAX,
  EMAIL_MAX,
  NOTE_MAX,
  PROGRAMS,
  formatGeneralDonationLabel,
  sanitizeText,
  sanitizeReceipt,
  sanitizeNotes,
  validateOrderNotes,
  isPlainObject,
  validateAmountPaise,
  validateRzpId,
  validateSignatureHex,
  getAllowedOrigins,
  originIsAllowed,
  isProduction,
  paymentsAreEnabled,
  paymentsDisabledResponse,
  getJsonBody,
  applySecurityHeaders,
  formatRazorpayError,
};
