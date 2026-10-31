const {
  applySecurityHeaders,
  getJsonBody,
  isProduction,
  originIsAllowed,
} = require("../_lib/donation");
const {
  isStoreConfigured,
  fetchDonationByPaymentId,
  fetchDonationByReceiptNo,
  fetchDonationsByContact,
  normalizeReceiptNo,
} = require("../_lib/donationRecord");
const { donationRowToReceiptRecord } = require("../_lib/receiptRecord");
const { applyRateLimit, LIMITS } = require("../_lib/rateLimit");
const { parseContactLookup } = require("../_lib/receiptContact");

const MAX_BODY_BYTES = 2 * 1024;

function adminSecretFromRequest(req, body) {
  return String(
    (body && body.secret) ||
      (req.headers &&
        (req.headers["x-admin-receipt-secret"] || req.headers["X-Admin-Receipt-Secret"])) ||
      ""
  ).trim();
}

function adminUsernameFromRequest(req, body) {
  return String(
    (body && (body.username || body.admin_username)) ||
      (req.headers &&
        (req.headers["x-admin-receipt-username"] || req.headers["X-Admin-Receipt-Username"])) ||
      ""
  ).trim();
}

function verifyAdminSecret(req, body) {
  const configured = String(process.env.ADMIN_RECEIPT_SECRET || "").trim();
  const configuredUsername = String(process.env.ADMIN_RECEIPT_USERNAME || "").trim();
  if (!configured) {
    if (isProduction()) {
      return { ok: false, status: 503, error: "Admin receipt lookup is not enabled." };
    }
    return { ok: true };
  }

  if (configuredUsername) {
    const providedUser = adminUsernameFromRequest(req, body);
    if (providedUser !== configuredUsername) {
      return { ok: false, status: 403, error: "Invalid admin credentials." };
    }
  }

  const provided = adminSecretFromRequest(req, body);
  if (provided !== configured) {
    return { ok: false, status: 403, error: "Invalid admin credentials." };
  }
  return { ok: true };
}

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

function normalizeMobile(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
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

  if (!applyRateLimit(req, res, LIMITS.adminReceipt)) return;

  const contentLength = Number(
    (req.headers && (req.headers["content-length"] || req.headers["Content-Length"])) || 0
  );
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Payload too large" });
  }

  const body = getJsonBody(req);
  if (body == null || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const auth = verifyAdminSecret(req, body);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  if (!isStoreConfigured()) {
    return res.status(503).json({
      error: "Receipt lookup is not available yet. Please contact us.",
    });
  }

  const locale = body.locale === "hi" ? "hi" : "en";
  const mode = String(body.mode || body.lookup_type || "")
    .trim()
    .toLowerCase();

  try {
    if (mode === "mobile") {
      const contact = parseContactLookup({
        contact_type: "mobile",
        donor_contact: normalizeMobile(body.donor_contact || body.value || body.mobile),
      });
      if (!contact.ok) {
        return res.status(400).json({ error: "Please enter a valid 10-digit mobile number." });
      }

      const rows = await fetchDonationsByContact(contact);
      if (!rows.length) {
        return res.status(404).json({ error: "No donations found for this mobile number." });
      }

      return res.status(200).json({
        ok: true,
        mode: "mobile",
        donations: rows.map(summarizeRow),
      });
    }

    if (mode === "email") {
      const contact = parseContactLookup({
        contact_type: "email",
        donor_email: body.donor_email || body.value || body.email,
      });
      if (!contact.ok) {
        return res.status(400).json({ error: "Please enter a valid email address." });
      }

      const rows = await fetchDonationsByContact(contact);
      if (!rows.length) {
        return res.status(404).json({ error: "No donations found for this email address." });
      }

      return res.status(200).json({
        ok: true,
        mode: "email",
        donations: rows.map(summarizeRow),
      });
    }

    if (mode === "receipt_no" || mode === "receipt") {
      const receiptNo = normalizeReceiptNo(body.receipt_no || body.receiptNo || body.value);
      if (!receiptNo) {
        return res.status(400).json({ error: "Please enter a receipt number." });
      }

      const row = await fetchDonationByReceiptNo(receiptNo);
      if (!row) {
        return res.status(404).json({ error: "Receipt not found." });
      }

      return res.status(200).json({
        ok: true,
        mode: "receipt_no",
        donations: [summarizeRow(row)],
        record: donationRowToReceiptRecord(row, { locale }),
      });
    }

    if (mode === "payment_id" || mode === "payment") {
      const paymentId = String(body.payment_id || body.paymentId || body.value || "").trim();
      if (!paymentId) {
        return res.status(400).json({ error: "Please enter a payment ID." });
      }

      const row = await fetchDonationByPaymentId(paymentId);
      if (!row) {
        return res.status(404).json({ error: "Receipt not found." });
      }

      return res.status(200).json({
        ok: true,
        mode: "payment_id",
        record: donationRowToReceiptRecord(row, { locale }),
      });
    }

    return res.status(400).json({
      error: "Invalid lookup mode. Use mobile, email, receipt_no, or payment_id.",
    });
  } catch (err) {
    if (!isProduction()) {
      return res.status(502).json({ error: "Could not look up donations.", details: err.message });
    }
    return res.status(502).json({ error: "Could not look up donations." });
  }
};
