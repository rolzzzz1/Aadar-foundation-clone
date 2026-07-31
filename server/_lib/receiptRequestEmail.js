/**
 * Send a donor receipt-request email (UPI QR / bank transfer) to the foundation inbox.
 * Optional payment screenshot is attached when provided as base64.
 */
const { isEmailConfigured, getReplyToEmail } = require("./receiptEmail");

const FOUNDATION_INBOX = "aadarfoundation2018@gmail.com";
const MAX_SCREENSHOT_BYTES = 3 * 1024 * 1024;

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getReceiptRequestToEmail() {
  const fromEnv = String(process.env.RECEIPT_REQUEST_TO_EMAIL || "").trim();
  if (fromEnv && fromEnv.includes("@")) return fromEnv;
  return FOUNDATION_INBOX;
}

function rowHtml(label, value) {
  const v = String(value || "").trim();
  if (!v) return "";
  return `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid #e8eee9;color:#64748b;font-size:13px;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #e8eee9;color:#1f2a44;font-size:13px;font-weight:600;vertical-align:top;word-break:break-word;">${escapeHtml(v)}</td>
  </tr>`;
}

/**
 * @param {object} payload
 * @param {{ filename?: string, contentBase64?: string, contentType?: string }|null} screenshot
 */
async function sendReceiptRequestEmail(payload, screenshot = null) {
  if (!isEmailConfigured()) {
    return { sent: false, reason: "not_configured" };
  }

  const to = getReceiptRequestToEmail();
  const replyTo = String(payload.email || "").trim() || getReplyToEmail();
  const amountLabel = `₹${Number(payload.amountInr || 0).toLocaleString("en-IN")}`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#1f2a44;">
    <h2 style="margin:0 0 8px;font-size:20px;color:#1e6b35;">New 80G receipt request</h2>
    <p style="margin:0 0 16px;font-size:14px;color:#64748b;line-height:1.5;">
      A donor submitted details for a Direct QR / Bank Transfer donation. Please verify the payment and email their 80G tax receipt.
    </p>
    <table style="width:100%;border-collapse:collapse;background:#f8faf8;border:1px solid #dce8df;border-radius:8px;overflow:hidden;">
      ${rowHtml("Full name", payload.name)}
      ${rowHtml("Father / husband name", payload.fatherOrHusbandName)}
      ${rowHtml("Mobile", payload.mobile)}
      ${rowHtml("Email", payload.email)}
      ${rowHtml("PAN", payload.pan)}
      ${rowHtml("Address", payload.address)}
      ${rowHtml("City", payload.city)}
      ${rowHtml("State", payload.state)}
      ${rowHtml("PIN", payload.pin)}
      ${rowHtml("Donation amount", amountLabel)}
      ${rowHtml("Payment date", payload.paidAt)}
      ${rowHtml("UTR / Bank reference", payload.transactionRef)}
      ${rowHtml("Payment method", payload.paymentMethodLabel || "UPI QR / Bank transfer")}
      ${rowHtml("Screenshot attached", screenshot?.contentBase64 ? "Yes" : "No")}
    </table>
    <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;">
      Submitted via aadarfoundation.org get-receipt form.
    </p>
  </div>`;

  const attachments = [];
  if (screenshot?.contentBase64) {
    const raw = Buffer.from(String(screenshot.contentBase64), "base64");
    if (raw.length > MAX_SCREENSHOT_BYTES) {
      return { sent: false, reason: "screenshot_too_large" };
    }
    if (raw.length > 0) {
      attachments.push({
        filename: screenshot.filename || "payment-screenshot.jpg",
        content: raw.toString("base64"),
        content_type: screenshot.contentType || "image/jpeg",
      });
    }
  }

  const body = {
    from: process.env.RECEIPT_FROM_EMAIL,
    to: [to],
    reply_to: replyTo,
    subject: `80G receipt request — ${payload.name || "Donor"} — ${amountLabel}`,
    html,
    tags: [
      { name: "type", value: "receipt_request" },
      { name: "channel", value: "qr_bank" },
    ],
  };
  if (attachments.length) body.attachments = attachments;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend API failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = await res.json().catch(() => ({}));
  return { sent: true, id: data.id, to };
}

module.exports = {
  FOUNDATION_INBOX,
  MAX_SCREENSHOT_BYTES,
  getReceiptRequestToEmail,
  sendReceiptRequestEmail,
  isEmailConfigured,
};
