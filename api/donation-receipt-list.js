const {
  applySecurityHeaders,
  getJsonBody,
  isProduction,
  originIsAllowed,
} = require("./_lib/donation");
const { isStoreConfigured, fetchDonationsByContact } = require("./_lib/donationRecord");
const { applyRateLimit, LIMITS } = require("./_lib/rateLimit");
const { parseContactLookup } = require("./_lib/receiptContact");

const MAX_BODY_BYTES = 1024;

const NOT_FOUND = {
  error: "No donations found. Please check your email or mobile number.",
};

function summarizeRow(row) {
  return {
    paymentId: row.payment_id || "",
    receiptNo: row.receipt_no || "",
    amountInr: Math.round((Number(row.amount_paise) || 0) / 100),
    currency: row.currency || "INR",
    paidAt: row.created_at || "",
    programLabel: row.program_label || "",
    purpose: row.purpose || "",
    source: row.source || "",
  };
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

  if (!applyRateLimit(req, res, LIMITS.receiptList)) return;

  const contentLength = Number(
    (req.headers && (req.headers["content-length"] || req.headers["Content-Length"])) || 0
  );
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Payload too large" });
  }

  if (!isStoreConfigured()) {
    return res.status(503).json({
      error: "Receipt lookup is not available yet. Please contact us.",
    });
  }

  const body = getJsonBody(req);
  const contact = parseContactLookup(body);
  if (!contact.ok) {
    return res.status(400).json({ error: "Please enter a valid email or mobile number." });
  }

  try {
    const rows = await fetchDonationsByContact(contact);
    if (!rows.length) {
      return res.status(404).json(NOT_FOUND);
    }

    return res.status(200).json({
      ok: true,
      contact_type: contact.type,
      donations: rows.map(summarizeRow),
    });
  } catch (err) {
    if (!isProduction()) {
      return res.status(502).json({ error: "Could not fetch donations.", details: err.message });
    }
    return res.status(502).json({ error: "Could not fetch donations." });
  }
};
