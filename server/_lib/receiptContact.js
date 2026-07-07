const { EMAIL_MAX } = require("./donation");

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .slice(0, EMAIL_MAX);
}

function normalizeContact(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

function isValidEmail(value) {
  const email = normalizeEmail(value);
  return email.length >= 5 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Parse email or mobile from a receipt lookup request body.
 * @returns {{ ok: true, type: 'email'|'mobile', value: string } | { ok: false }}
 */
function parseContactLookup(body) {
  if (!body || typeof body !== "object") return { ok: false };

  const explicitType = String(body.contact_type || body.contactType || "").toLowerCase();
  const rawValue = body.contact_value ?? body.contactValue ?? "";

  if (explicitType === "mobile" || body.donor_contact || body.mobile) {
    const value = normalizeContact(body.donor_contact || body.mobile || rawValue);
    if (value.length !== 10) return { ok: false };
    return { ok: true, type: "mobile", value };
  }

  if (explicitType === "email" || body.donor_email || body.email) {
    const value = normalizeEmail(body.donor_email || body.email || rawValue);
    if (!isValidEmail(value)) return { ok: false };
    return { ok: true, type: "email", value };
  }

  if (isValidEmail(rawValue)) {
    return { ok: true, type: "email", value: normalizeEmail(rawValue) };
  }

  const mobile = normalizeContact(rawValue);
  if (mobile.length === 10) {
    return { ok: true, type: "mobile", value: mobile };
  }

  return { ok: false };
}

function contactMatchesRow(row, contact) {
  if (!row || !contact?.ok) return false;
  if (contact.type === "email") {
    return normalizeEmail(row.donor_email) === contact.value;
  }
  return normalizeContact(row.donor_contact) === contact.value;
}

function contactToRequestPayload(contact) {
  if (!contact?.ok) return {};
  if (contact.type === "email") {
    return { contact_type: "email", donor_email: contact.value };
  }
  return { contact_type: "mobile", donor_contact: contact.value };
}

function normalizePan(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
}

module.exports = {
  normalizeEmail,
  normalizeContact,
  normalizePan,
  isValidEmail,
  parseContactLookup,
  contactMatchesRow,
  contactToRequestPayload,
};
