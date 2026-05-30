const {
  applySecurityHeaders,
  getJsonBody,
  isProduction,
  originIsAllowed,
  paymentsAreEnabled,
  paymentsDisabledResponse,
  sanitizeText,
  validateRzpId,
  EMAIL_MAX,
  NAME_MAX,
} = require("./_lib/donation");
const { isStoreConfigured } = require("./_lib/donationRecord");

const MAX_BODY_BYTES = 2 * 1024;

function normalizeEmail(v) {
  return String(v || "")
    .trim()
    .toLowerCase()
    .slice(0, EMAIL_MAX);
}

function normalizePan(v) {
  return String(v || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
}

/**
 * Donor receipt lookup.
 *
 * SECURITY MODEL:
 * - Requires a payment id (Razorpay id format)
 * - Requires donor PAN to match what was saved in Razorpay order notes
 * - Donor email is optional (PAN is currently mandatory in the checkout UI)
 *   (and persisted to Supabase via verify/webhook)
 * - Returns a minimal, sanitized record suitable for building the PDF client-side
 *
 * NOTE: This is intentionally a POST (not GET) to avoid leaking identifiers
 * in URLs/referrers and to make it easier to rate-limit later if needed.
 */
module.exports = async function handler(req, res) {
  applySecurityHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!originIsAllowed(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (!paymentsAreEnabled()) {
    return res.status(503).json(paymentsDisabledResponse());
  }

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
  const donorEmail = normalizeEmail(body.donor_email || body.email);
  const donorPan = normalizePan(body.donor_pan || body.pan);

  if (!validateRzpId(paymentId) || donorPan.length !== 10) {
    return res.status(400).json({ error: "Invalid lookup payload." });
  }

  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const url = `${base}/rest/v1/donations?payment_id=eq.${encodeURIComponent(
    paymentId
  )}&select=payment_id,order_id,receipt_no,amount_paise,currency,status,donor_name,donor_father_or_husband,donor_email,donor_contact,donor_pan,program_label,purpose,created_at`;

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

    // Always return a generic message on mismatch to avoid confirming if a payment id exists.
    if (!row) {
      return res.status(404).json({
        error: "Receipt not found. Please check your details or contact us with your payment ID.",
      });
    }

    const matchPan = normalizePan(row.donor_pan) === donorPan;
    const emailProvided = !!donorEmail && donorEmail.length >= 5;
    const matchEmail = !emailProvided || normalizeEmail(row.donor_email) === donorEmail;
    if (!matchPan || !matchEmail) {
      return res.status(404).json({
        error: "Receipt not found. Please check your details or contact us with your payment ID.",
      });
    }

    // Minimal + sanitized payload for client-side receipt generation.
    return res.status(200).json({
      ok: true,
      record: {
        status: String(row.status || "").toLowerCase() === "captured" ? "success" : "unverified",
        amountInr: Math.round((Number(row.amount_paise) || 0) / 100),
        currency: row.currency || "INR",
        donor: {
          name: sanitizeText(row.donor_name || "", NAME_MAX),
          fatherOrHusbandName: sanitizeText(row.donor_father_or_husband || "", NAME_MAX),
          email: emailProvided ? donorEmail : normalizeEmail(row.donor_email),
          contact: sanitizeText(row.donor_contact || "", 20),
          pan: donorPan,
        },
        paymentId: row.payment_id || paymentId,
        orderId: row.order_id || "",
        receiptNo: row.receipt_no || "",
        purpose: row.purpose || "",
        programLabel: row.program_label || "",
        paidAt: row.created_at || new Date().toISOString(),
        verified: String(row.status || "").toLowerCase() === "captured",
        testMode: undefined,
        locale: "en",
      },
    });
  } catch (err) {
    if (!isProduction()) {
      return res.status(502).json({ error: "Receipt lookup failed", details: err.message });
    }
    return res.status(502).json({ error: "Receipt lookup failed" });
  }
};
