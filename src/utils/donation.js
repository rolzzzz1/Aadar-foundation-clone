/**
 * Shared donation validation, sanitization and program metadata for the
 * frontend. The server mirror lives in `api/_lib/donation.js` — keep the
 * numeric limits and PROGRAMS map in sync between them.
 *
 * Security notes:
 * - Treat every value from the URL, form fields and `localStorage` as
 *   untrusted; always run it through one of these validators before sending
 *   to the API or constructing markup.
 * - The server is the source of truth for amounts. These helpers exist to
 *   give immediate UX feedback and reduce obviously bad payloads, NOT to
 *   replace server validation.
 */

/** Public React Router path for the Razorpay donation checkout form. */
export const DONATION_CHECKOUT_PATH = "/donate/checkout";

/** Public donate page (Donate2). */
export const DONATE_PAGE_PATH = "/donate";
export const DONATE_WIDGET_HASH = "donate-widget";

export const MIN_AMOUNT_INR = 1;
export const MAX_AMOUNT_INR = 500000;
export const MIN_AMOUNT_PAISE = MIN_AMOUNT_INR * 100;
export const MAX_AMOUNT_PAISE = MAX_AMOUNT_INR * 100;

export const NAME_MAX = 80;
export const ADDRESS_MAX = 200;
export const EMAIL_MAX = 254;
export const NOTE_MAX = 240;
export const PHONE_LEN = 10;
export const PAN_LEN = 10;

/**
 * Programs whose price is enforced server-side. When the donate flow knows
 * the program (e.g. "Sponsor a Prabhuji for a month"), pass `purpose` to
 * the order API so the server picks the canonical amount instead of trusting
 * a URL/form value. Keep this in sync with api/_lib/donation.js.
 */
export const PROGRAMS = Object.freeze({
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

/** Make a Difference widget presets → server `purpose` keys (amount locked on API). */
export const DONATE_WIDGET_PRESET_PURPOSE = Object.freeze({
  501: "donate-501",
  1001: "donate-1001",
  3001: "sponsor-prabhuji-month",
});

/** Quick-give summary cards above the widget → checkout `purpose` keys. */
export const QUICK_GIVE_CARD_PURPOSE = Object.freeze({
  membership: "donate-501",
  mealSponsorship: "meal-sponsorship",
  monthlyCare: "sponsor-prabhuji-month",
});

/**
 * React Router navigation target for Donate2 → checkout (amount/purpose in state, not the URL).
 * @param {{ purpose?: string | null, amountInr?: number, useFreeAmount?: boolean }} opts
 * @returns {{ pathname: string, state: { purpose?: string, amountInr?: number } }}
 */
export function getDonationCheckoutNavigation({ purpose, amountInr, useFreeAmount }) {
  const state = {};
  if (!useFreeAmount && purpose && Object.prototype.hasOwnProperty.call(PROGRAMS, purpose)) {
    state.purpose = purpose;
  } else if (amountInr != null && amountInr > 0) {
    state.amountInr = amountInr;
  }
  return { pathname: DONATION_CHECKOUT_PATH, state };
}

/**
 * Checkout link with query params (for shareable deep links, e.g. sponsor cards).
 * @param {{ purpose?: string | null, amountInr?: number, useFreeAmount?: boolean }} opts
 */
export function buildDonationCheckoutHref({ purpose, amountInr, useFreeAmount }) {
  if (!useFreeAmount && purpose && Object.prototype.hasOwnProperty.call(PROGRAMS, purpose)) {
    return `${DONATION_CHECKOUT_PATH}?purpose=${encodeURIComponent(purpose)}`;
  }
  if (amountInr != null && amountInr > 0) {
    return `${DONATION_CHECKOUT_PATH}?amount=${encodeURIComponent(amountInr)}`;
  }
  return "#";
}

/**
 * Resolve checkout prefill from router state (Donate2) then URL query (legacy / external links).
 * @param {{ search?: string, state?: unknown }} location
 * @param {number} [defaultInr]
 */
/** True when checkout was opened with a valid amount or program (state or URL). */
export function hasCheckoutEntrySource(location) {
  const navState =
    location && location.state && typeof location.state === "object" ? location.state : {};

  if (navState.purpose && Object.prototype.hasOwnProperty.call(PROGRAMS, navState.purpose)) {
    return true;
  }
  if (navState.amountInr != null && navState.amountInr !== "") {
    if (validateAmountInr(navState.amountInr).ok) return true;
  }
  if (pickQueryPurpose(location?.search)) return true;

  try {
    const raw = new URLSearchParams(location?.search || "").get("amount");
    if (raw != null && raw !== "" && validateAmountInr(raw).ok) return true;
  } catch {
    /* ignore */
  }
  return false;
}

export function resolveCheckoutEntry(location, defaultInr = 1001) {
  const navState =
    location && location.state && typeof location.state === "object" ? location.state : {};

  const purposeFromState = navState.purpose;
  const purposeKey =
    purposeFromState && Object.prototype.hasOwnProperty.call(PROGRAMS, purposeFromState)
      ? purposeFromState
      : pickQueryPurpose(location?.search);

  const programFromEntry = purposeKey ? PROGRAMS[purposeKey] : null;

  if (programFromEntry) {
    return {
      purposeKey,
      programFromEntry,
      amountInr: programFromEntry.amountInr,
      amountClamped: false,
      fromRouterState: !!purposeFromState,
    };
  }

  if (navState.amountInr != null && navState.amountInr !== "") {
    const validated = validateAmountInr(navState.amountInr);
    if (validated.ok) {
      return {
        purposeKey: null,
        programFromEntry: null,
        amountInr: validated.valueInr,
        amountClamped: false,
        fromRouterState: true,
      };
    }
  }

  const picked = pickQueryAmount(location?.search, defaultInr);
  return {
    purposeKey: null,
    programFromEntry: null,
    amountInr: picked.valueInr,
    amountClamped: picked.clamped,
    fromRouterState: false,
  };
}

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g;

export function sanitizeText(input, maxLen = 256) {
  if (input == null) return "";
  const s = String(input).replace(CONTROL_CHARS, "").replace(ZERO_WIDTH, "").trim();
  return s.slice(0, Math.max(0, maxLen));
}

/** Strip non-digits, drop leading zeros, cap to the digit-length of MAX_AMOUNT_INR. */
export function sanitizeAmountInput(raw) {
  if (raw == null) return "";
  const digits = String(raw)
    .replace(/\D/g, "")
    .replace(/^0+(?=\d)/, "");
  return digits.slice(0, String(MAX_AMOUNT_INR).length);
}

/**
 * Validate an INR amount entered by the user.
 * @returns {{ ok: boolean, valueInr: number, error?: string }}
 */
export function validateAmountInr(input) {
  const cleaned = sanitizeAmountInput(input);
  if (!cleaned) return { ok: false, valueInr: 0, error: "Enter an amount." };

  const n = Number(cleaned);
  if (!Number.isInteger(n) || n <= 0) {
    return { ok: false, valueInr: 0, error: "Amount must be a positive whole number." };
  }
  if (n < MIN_AMOUNT_INR) {
    return { ok: false, valueInr: n, error: `Minimum donation is ₹${MIN_AMOUNT_INR}.` };
  }
  if (n > MAX_AMOUNT_INR) {
    return {
      ok: false,
      valueInr: n,
      error: `Maximum online donation is ₹${MAX_AMOUNT_INR.toLocaleString(
        "en-IN"
      )}. For larger amounts please contact us.`,
    };
  }
  return { ok: true, valueInr: n };
}

export function toPaise(inrInteger) {
  const n = Number(inrInteger);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

const NAME_REGEX = /^[\p{L}\p{M}\s'.-]{2,}$/u;
export function validateName(input) {
  const s = sanitizeText(input, NAME_MAX);
  if (!s) return { ok: false, value: "", error: "Name is required." };
  if (s.length < 2) return { ok: false, value: s, error: "Name is too short." };
  if (!NAME_REGEX.test(s)) {
    return { ok: false, value: s, error: "Use letters, spaces, hyphens, apostrophes, periods." };
  }
  return { ok: true, value: s };
}

/** Father's or husband's name (required on donation / 80G forms). */
export function validateFatherOrHusbandName(input) {
  const s = sanitizeText(input, NAME_MAX);
  if (!s) {
    return { ok: false, value: "", error: "Father's / husband's name is required." };
  }
  if (s.length < 2) return { ok: false, value: s, error: "Name is too short." };
  if (!NAME_REGEX.test(s)) {
    return { ok: false, value: s, error: "Use letters, spaces, hyphens, apostrophes, periods." };
  }
  return { ok: true, value: s };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function validateEmail(input) {
  const s = sanitizeText(input, EMAIL_MAX).toLowerCase();
  if (!s) return { ok: false, value: "", error: "Email is required." };
  if (!EMAIL_REGEX.test(s)) {
    return { ok: false, value: s, error: "Enter a valid email address." };
  }
  return { ok: true, value: s };
}

const PHONE_REGEX_IN = /^[6-9]\d{9}$/;
export function validateContactIN(input) {
  const digits = String(input ?? "")
    .replace(/\D/g, "")
    .slice(-PHONE_LEN);
  if (!digits) return { ok: false, value: "", error: "Phone number is required." };
  if (!PHONE_REGEX_IN.test(digits)) {
    return { ok: false, value: digits, error: "Enter a valid 10-digit Indian mobile number." };
  }
  return { ok: true, value: digits };
}

export function validateAddressLine(input) {
  const s = sanitizeText(input, ADDRESS_MAX);
  if (!s) return { ok: false, value: "", error: "Address is required." };
  if (s.length < 5) {
    return { ok: false, value: s, error: "Enter house no., street, locality, or landmark." };
  }
  return { ok: true, value: s };
}

export function validateRequiredSelection(input, fieldLabel) {
  const s = sanitizeText(input, 80);
  if (!s) return { ok: false, value: "", error: `${fieldLabel} is required.` };
  return { ok: true, value: s };
}

export function validatePinIn(input) {
  const d = String(input ?? "")
    .replace(/\D/g, "")
    .slice(0, 6);
  if (!d) return { ok: false, value: "", error: "PIN code is required." };
  if (d.length !== 6) return { ok: false, value: d, error: "PIN must be 6 digits." };
  return { ok: true, value: d };
}

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
/** Indian income-tax PAN (10 chars). */
export function validatePan(input) {
  const raw = String(input ?? "")
    .replace(/\s/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  const s = raw.slice(0, PAN_LEN);
  if (!s) return { ok: false, value: "", error: "PAN is required." };
  if (s.length !== PAN_LEN) {
    return { ok: false, value: s, error: "PAN must be 10 characters." };
  }
  if (!PAN_REGEX.test(s)) {
    return { ok: false, value: s, error: "Enter a valid PAN (e.g. ABCDE1234F)." };
  }
  return { ok: true, value: s };
}

export function validateNote(input) {
  const s = sanitizeText(input, NOTE_MAX);
  return { ok: true, value: s };
}

/**
 * Read & validate the `amount` query param (in INR).
 * - Missing / non-numeric → falls back to `defaultInr` (source: "default").
 * - Out of range → clamps to MIN/MAX (clamped: true).
 * Never throws.
 */
export function pickQueryAmount(search, defaultInr = MIN_AMOUNT_INR) {
  try {
    const params =
      typeof search === "string" || search == null ? new URLSearchParams(search || "") : search;
    const raw = params.get("amount");
    if (raw == null || raw === "") {
      return { valueInr: defaultInr, source: "default", clamped: false };
    }
    const cleaned = sanitizeAmountInput(raw);
    const n = Number(cleaned);
    if (!Number.isFinite(n) || n <= 0) {
      return { valueInr: defaultInr, source: "default", clamped: true };
    }
    if (n < MIN_AMOUNT_INR) return { valueInr: MIN_AMOUNT_INR, source: "query", clamped: true };
    if (n > MAX_AMOUNT_INR) return { valueInr: MAX_AMOUNT_INR, source: "query", clamped: true };
    return { valueInr: n, source: "query", clamped: false };
  } catch {
    return { valueInr: defaultInr, source: "default", clamped: false };
  }
}

/** Reads `purpose` from the query and returns the whitelisted key (or null). */
export function pickQueryPurpose(search) {
  try {
    const params =
      typeof search === "string" || search == null ? new URLSearchParams(search || "") : search;
    const raw = params.get("purpose");
    if (!raw) return null;
    return Object.prototype.hasOwnProperty.call(PROGRAMS, raw) ? raw : null;
  } catch {
    return null;
  }
}
