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
  fetchDonationsByQrUtr,
  normalizeReceiptNo,
  upsertDonationRecord,
  updateManualDonationRecord,
  updateDonorDetails,
} = require("../_lib/donationRecord");
const { donationRowToReceiptRecord } = require("../_lib/receiptRecord");
const { applyRateLimit, LIMITS } = require("../_lib/rateLimit");
const {
  buildManualDonationRecord,
  buildDonorDetailUpdate,
  isAdminEditableReceipt,
  isRazorpayStaticQrRow,
  extractUtrFromPurpose,
  mergeQrPurpose,
} = require("../_lib/manualReceipt");

const MAX_BODY_BYTES = 8 * 1024;

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
      return { ok: false, status: 503, error: "Admin receipt issuing is not enabled." };
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

function qrDonorPatch(existing, donorUpdate) {
  const utr = extractUtrFromPurpose(existing.purpose);
  const patch = { ...donorUpdate.patch };
  patch.purpose = mergeQrPurpose(existing.purpose, patch.purpose, utr);
  if (!String(patch.program_label || "").trim()) {
    patch.program_label = existing.program_label || "";
  }
  return patch;
}

async function saveQrDonorDetails(res, body, existing) {
  const status = String(existing.status || "").toLowerCase();
  if (status !== "captured") {
    return res.status(400).json({ error: "Only captured donations can be updated." });
  }

  const donorUpdate = buildDonorDetailUpdate(body);
  if (!donorUpdate.ok) {
    return res.status(400).json({ error: donorUpdate.error });
  }

  const saved = await updateDonorDetails(existing.payment_id, qrDonorPatch(existing, donorUpdate));
  if (!saved.saved || !saved.row) {
    return res.status(502).json({ error: "Could not update donation record." });
  }

  const updated = saved.row;
  return res.status(200).json({
    ok: true,
    created: false,
    updated: true,
    linked_qr: true,
    receipt_email_sent: false,
    payment_id: updated.payment_id,
    receipt_no: updated.receipt_no,
    donor_email: updated.donor_email,
    record: donationRowToReceiptRecord(updated, { locale: body.locale === "hi" ? "hi" : "en" }),
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
      error: "Donation store is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    });
  }

  if (body.update === true && body.donor_only === true) {
    const paymentId = String(body.payment_id || body.paymentId || "").trim();
    const receiptNo = normalizeReceiptNo(body.receipt_no || body.receiptNo || "");
    let existing = null;
    if (paymentId) existing = await fetchDonationByPaymentId(paymentId);
    else if (receiptNo) existing = await fetchDonationByReceiptNo(receiptNo);
    else {
      return res.status(400).json({ error: "payment_id or receipt_no is required." });
    }

    if (!existing) {
      return res.status(404).json({ error: "Receipt not found." });
    }
    if (isAdminEditableReceipt(existing) && !isRazorpayStaticQrRow(existing)) {
      return res.status(400).json({
        error: "This receipt was issued for a UPI or bank transfer. Update it from that tab.",
      });
    }
    if (String(existing.status || "").toLowerCase() !== "captured") {
      return res.status(400).json({ error: "Only captured donations can be updated." });
    }

    const donorUpdate = buildDonorDetailUpdate(body);
    if (!donorUpdate.ok) {
      return res.status(400).json({ error: donorUpdate.error });
    }

    const donorPatch = isRazorpayStaticQrRow(existing)
      ? qrDonorPatch(existing, donorUpdate)
      : donorUpdate.patch;
    const savedDonor = await updateDonorDetails(existing.payment_id, donorPatch);
    if (!savedDonor.saved || !savedDonor.row) {
      return res.status(502).json({ error: "Could not update donation record." });
    }

    const updatedDonor = savedDonor.row;
    return res.status(200).json({
      ok: true,
      created: false,
      updated: true,
      donor_only: true,
      receipt_email_sent: false,
      payment_id: updatedDonor.payment_id,
      receipt_no: updatedDonor.receipt_no,
      donor_email: updatedDonor.donor_email,
      record: donationRowToReceiptRecord(updatedDonor, {
        locale: body.locale === "hi" ? "hi" : "en",
      }),
    });
  }

  const built = buildManualDonationRecord(body);
  if (!built.ok) {
    return res.status(400).json({ error: built.error });
  }

  const updating = body.update === true;
  const isBank = built.record.payment_method === "bank_transfer";
  let qrMatch = null;
  if (!isBank) {
    const found = await fetchDonationsByQrUtr(built.refValue);
    if (!found.ok) {
      return res.status(502).json({ error: "Could not check the existing QR payment." });
    }
    if (found.rows.length > 1) {
      return res.status(409).json({
        error: "More than one Razorpay QR payment has this UTR. Update the payment ID directly.",
      });
    }
    qrMatch = found.rows[0] || null;
  }

  if (qrMatch) {
    const submittedInr = Math.round(Number(built.record.amount_paise) / 100);
    const storedInr = Math.round((Number(qrMatch.amount_paise) || 0) / 100);
    if (!updating && submittedInr !== storedInr) {
      return res.status(409).json({
        error: `This UTR belongs to Razorpay QR payment ${qrMatch.payment_id} for ₹${storedInr}. Enter that amount so the existing record is updated.`,
        payment_id: qrMatch.payment_id,
        receipt_no: qrMatch.receipt_no || null,
      });
    }
    if (!updating && String(qrMatch.donor_name || "").trim()) {
      return res.status(409).json({
        error: "This QR payment already has donor details. Update that receipt instead of creating a new one.",
        payment_id: qrMatch.payment_id,
        receipt_no: qrMatch.receipt_no || null,
      });
    }
    return saveQrDonorDetails(res, body, qrMatch);
  }

  const existing = await fetchDonationByPaymentId(built.paymentId);

  if (updating) {
    if (!existing || !isAdminEditableReceipt(existing)) {
      return res.status(404).json({
        error: "No UPI or bank transfer receipt was found for this reference.",
      });
    }

    const savedUpdate = await updateManualDonationRecord(built.paymentId, built.record);
    if (!savedUpdate.saved || !savedUpdate.row) {
      return res.status(502).json({ error: "Could not update donation record." });
    }

    const updated = savedUpdate.row;
    return res.status(200).json({
      ok: true,
      created: false,
      updated: true,
      receipt_email_sent: false,
      payment_id: updated.payment_id,
      receipt_no: updated.receipt_no,
      donor_email: updated.donor_email,
      record: donationRowToReceiptRecord(updated, { locale: body.locale === "hi" ? "hi" : "en" }),
    });
  }

  if (existing && String(existing.status || "").toLowerCase() === "captured") {
    return res.status(409).json({
      error: "A receipt was already issued for this transaction reference.",
      payment_id: built.paymentId,
      receipt_no: existing.receipt_no || null,
      receipt_email_sent: !!existing.receipt_email_sent_at,
    });
  }

  const saved = await upsertDonationRecord(built.record);
  if (!saved.saved) {
    if (!isProduction()) {
      return res.status(502).json({
        error: "Could not save donation record.",
        reason: saved.reason,
      });
    }
    return res.status(502).json({ error: "Could not save donation record." });
  }

  const row = saved.row || (await fetchDonationByPaymentId(built.paymentId));
  if (!row) {
    return res.status(502).json({ error: "Could not save donation record." });
  }

  const locale = body.locale === "hi" ? "hi" : "en";

  return res.status(200).json({
    ok: true,
    created: !!saved.created,
    receipt_email_sent: false,
    payment_id: row.payment_id,
    receipt_no: row.receipt_no,
    donor_email: row.donor_email,
    record: donationRowToReceiptRecord(row, { locale }),
  });
};
