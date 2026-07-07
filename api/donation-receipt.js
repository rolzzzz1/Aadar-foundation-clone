const {
  applySecurityHeaders,
  getJsonBody,
  isProduction,
  originIsAllowed,
  validateRzpId,
} = require("../server/_lib/donation");
const { isStoreConfigured } = require("../server/_lib/donationRecord");
const { donationRowToReceiptRecord } = require("../server/_lib/receiptRecord");
const { applyRateLimit, LIMITS } = require("../server/_lib/rateLimit");
const {
  parseContactLookup,
  contactMatchesRow,
  normalizePan,
} = require("../server/_lib/receiptContact");

const MAX_BODY_BYTES = 2 * 1024;

const NOT_FOUND = {
  error: "Receipt not found. Please check your details or contact us with your payment ID.",
};

function normalizeDonorPan(value) {
  return normalizePan(value);
}

function panMatchesRow(row, pan) {
  return normalizeDonorPan(row.donor_pan) === normalizeDonorPan(pan);
}

module.exports = async function handler(req, res) {
  applySecurityHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!originIsAllowed(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (!applyRateLimit(req, res, LIMITS.receipt)) return;

  const contentLength = Number(
    (req.headers && (req.headers["content-length"] || req.headers["Content-Length"])) || 0
  );
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Payload too large" });
  }

  if (!isStoreConfigured()) {
    return res.status(503).json({
      error: "Receipt lookup is not available yet. Please contact us with your payment ID.",
    });
  }

  const body = getJsonBody(req);
  if (body == null || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const paymentId = String(body.payment_id || body.paymentId || "").trim();
  const contact = parseContactLookup(body);
  const donorPan = normalizeDonorPan(body.donor_pan || body.pan);

  if (!validateRzpId(paymentId)) {
    return res.status(400).json({ error: "Invalid lookup payload." });
  }

  const hasContact = contact.ok;
  const hasPan = donorPan.length === 10;
  if (!hasContact && !hasPan) {
    return res.status(400).json({ error: "Invalid lookup payload." });
  }

  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const url = `${base}/rest/v1/donations?payment_id=eq.${encodeURIComponent(
    paymentId
  )}&select=payment_id,order_id,receipt_no,amount_paise,currency,status,donor_name,donor_father_or_husband,donor_email,donor_contact,donor_pan,donor_address,donor_state,donor_city,donor_pin,program_label,purpose,created_at`;

  try {
    const r = await fetch(url, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        Accept: "application/json",
      },
    });

    if (!r.ok) {
      if (!isProduction()) {
        const text = await r.text().catch(() => "");
        return res
          .status(502)
          .json({ error: "Receipt lookup failed", details: text.slice(0, 200) });
      }
      return res.status(502).json({ error: "Receipt lookup failed" });
    }

    const rows = await r.json().catch(() => []);
    const row = Array.isArray(rows) ? rows[0] : null;

    if (!row) {
      return res.status(404).json(NOT_FOUND);
    }

    const matchContact = hasContact && contactMatchesRow(row, contact);
    const matchPan = hasPan && panMatchesRow(row, donorPan);
    if (!matchContact && !matchPan) {
      return res.status(404).json(NOT_FOUND);
    }

    const locale = body.locale === "hi" ? "hi" : "en";
    const record = donationRowToReceiptRecord(row, { locale });

    return res.status(200).json({
      ok: true,
      record,
    });
  } catch (err) {
    if (!isProduction()) {
      return res.status(502).json({ error: "Receipt lookup failed", details: err.message });
    }
    return res.status(502).json({ error: "Receipt lookup failed" });
  }
};
