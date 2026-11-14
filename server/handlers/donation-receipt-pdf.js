const { applySecurityHeaders, getJsonBody, originIsAllowed } = require("../_lib/donation");
const { applyRateLimit, LIMITS } = require("../_lib/rateLimit");
const { buildOfficialReceiptPdf } = require("../_lib/receiptPdfServer");

const MAX_BODY_BYTES = 32 * 1024;

function safeFilename(filename) {
  const cleaned = String(filename || "aadar-donation-receipt.pdf").replace(/[^\w.\-]+/g, "_");
  return cleaned.toLowerCase().endsWith(".pdf") ? cleaned : `${cleaned}.pdf`;
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

  if (!applyRateLimit(req, res, LIMITS.receiptPdf)) return;

  const contentLength = Number(
    (req.headers && (req.headers["content-length"] || req.headers["Content-Length"])) || 0
  );
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Payload too large" });
  }

  const body = getJsonBody(req);
  const record = body && body.record;
  if (!record || typeof record !== "object" || record.verified !== true) {
    return res.status(400).json({
      error: "Receipt download is available only after payment is verified.",
    });
  }

  try {
    const { buffer, filename } = await buildOfficialReceiptPdf(record);
    const name = safeFilename(filename);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${name}"`);
    res.setHeader("Cache-Control", "no-store");
    res.status(200);
    return res.send(buffer);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      "[receipt-pdf] download failed",
      err && err.message ? err.message : err
    );
    return res.status(500).json({ error: "Could not prepare the receipt PDF." });
  }
};
