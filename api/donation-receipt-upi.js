const {
  applySecurityHeaders,
  getJsonBody,
  isProduction,
  originIsAllowed,
  sanitizeText,
} = require("./_lib/donation");
const { isStoreConfigured, fetchDonationByPaymentId, upsertDonationRecord } = require("./_lib/donationRecord");
const { donationRowToReceiptRecord } = require("./_lib/receiptRecord");
const { trySendReceiptEmail } = require("./_lib/receiptEmail");
const { applyRateLimit, LIMITS } = require("./_lib/rateLimit");
const {
  validateUtr,
  upiPaymentId,
  normalizePan,
  buildUpiDonationRecord,
} = require("./_lib/upiReceipt");
const { parseContactLookup, contactMatchesRow } = require("./_lib/receiptContact");

const MAX_BODY_BYTES = 4 * 1024;

const NOT_FOUND = {
  error: "Receipt not found. Please check your details or contact us with your transaction reference.",
};

function amountsMatch(row, amountInr) {
  if (!Number.isFinite(amountInr) || amountInr <= 0) return true;
  const stored = Math.round((Number(row.amount_paise) || 0) / 100);
  return stored === Math.round(amountInr);
}

function panMatches(row, pan) {
  return normalizePan(row.donor_pan) === normalizePan(pan);
}

function rowMatchesLookupContact(row, body) {
  const contact = parseContactLookup(body);
  if (!contact.ok) return false;
  return contactMatchesRow(row, contact);
}

async function respondWithRow(res, row, options = {}) {
  const captured = String(row.status || "").toLowerCase() === "captured";
  if (!captured) {
    return res.status(404).json(NOT_FOUND);
  }

  let receiptEmail = null;
  if (options.sendEmail && row.donor_email) {
    receiptEmail = await trySendReceiptEmail(row, { locale: options.locale || "en" });
    if (receiptEmail.sent) {
      row = (await fetchDonationByPaymentId(row.payment_id)) || row;
    }
  }

  return res.status(200).json({
    ok: true,
    created: !!options.created,
    receipt_email_sent: !!(receiptEmail && receiptEmail.sent),
    record: donationRowToReceiptRecord(row, { locale: options.locale || "en" }),
  });
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

  if (!applyRateLimit(req, res, LIMITS.receiptUpi)) return;

  const contentLength = Number(
    (req.headers && (req.headers["content-length"] || req.headers["Content-Length"])) || 0
  );
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Payload too large" });
  }

  if (!isStoreConfigured()) {
    return res.status(503).json({
      error: "Receipt lookup is not available yet. Please contact us with your transaction reference.",
    });
  }

  const body = getJsonBody(req);
  if (body == null || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const locale = body.locale === "hi" ? "hi" : "en";
  const lookupOnly = body.lookup_only === true || body.mode === "lookup";

  const utrCheck = validateUtr(body.utr || body.transaction_ref || body.upi_ref);
  if (!utrCheck.ok) {
    return res.status(400).json({ error: "Invalid lookup payload." });
  }

  const paymentId = upiPaymentId(utrCheck.value);
  const existing = await fetchDonationByPaymentId(paymentId);

  if (lookupOnly) {
    if (!existing || !rowMatchesLookupContact(existing, body)) {
      return res.status(404).json(NOT_FOUND);
    }
    const amountInr = Number(body.amount_inr ?? body.amountInr ?? body.amount);
    if (!amountsMatch(existing, amountInr)) {
      return res.status(404).json(NOT_FOUND);
    }
    return respondWithRow(res, existing, { locale });
  }

  const pan = normalizePan(body.donor_pan || body.pan);
  if (pan.length !== 10) {
    return res.status(400).json({ error: "Invalid lookup payload." });
  }

  const built = buildUpiDonationRecord(body);
  if (!built.ok) {
    return res.status(400).json({ error: built.error });
  }

  if (built.pan !== pan) {
    return res.status(400).json({ error: "Invalid lookup payload." });
  }

  if (existing) {
    if (!panMatches(existing, pan)) {
      return res.status(404).json(NOT_FOUND);
    }
    if (!amountsMatch(existing, Math.round(built.record.amount_paise / 100))) {
      return res.status(404).json(NOT_FOUND);
    }

    const saved = await upsertDonationRecord(built.record);
    if (!saved.saved) {
      if (!isProduction()) {
        return res.status(502).json({ error: "Could not save donation record.", reason: saved.reason });
      }
      return res.status(502).json({ error: "Could not save donation record." });
    }

    const row = saved.row || (await fetchDonationByPaymentId(paymentId));
    if (!row) return res.status(502).json({ error: "Could not save donation record." });
    return respondWithRow(res, row, { locale, sendEmail: !row.receipt_email_sent_at });
  }

  const saved = await upsertDonationRecord(built.record);
  if (!saved.saved) {
    if (!isProduction()) {
      return res.status(502).json({ error: "Could not save donation record.", reason: saved.reason });
    }
    return res.status(502).json({ error: "Could not save donation record." });
  }

  const row = saved.row || (await fetchDonationByPaymentId(paymentId));
  if (!row) return res.status(502).json({ error: "Could not save donation record." });

  return respondWithRow(res, row, { locale, created: true, sendEmail: true });
};
