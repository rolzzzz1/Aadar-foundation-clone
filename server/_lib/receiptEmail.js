const { buildReceiptPdfBuffer } = require("./receiptPdfServer");
const { donationRowToReceiptRecord, isCapturedStatus } = require("./receiptRecord");
const { markReceiptEmailSent } = require("./donationRecord");
const { readLogoBuffer } = require("./receiptHtmlServer");
const { buildReceiptViewModel } = require("./receiptFormatServer");

const LOGO_CID = "aadar-logo";
const EMAIL_SEND_RETRY_DELAY_MS = 2500;
const EMAIL_SEND_MAX_ATTEMPTS = 2;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ORG = {
  name: "Aadar Foundation",
  subtitle: "Aashram Swarg Sadan",
  tagline: "80G Registered Non-Profit Organisation",
  address:
    "Swarg Sadan Ashram, Sarkari Malti, Behind Muktidham, Guda Gudi Ka Naka, Gwalior, MP 474001",
  email: "aadarfoundation2018@gmail.com",
  phone: "+91 9039129571",
  reg80G: "AAIAA2457N24BP01",
};

const EMAIL_COPY = {
  en: {
    receiptLabel: "Donation Receipt",
    greeting: (name) => `Dear ${name},`,
    intro:
      "Thank you for your generous support. Your contribution helps us provide care, shelter and dignity to homeless and unclaimed people.",
    amountLabel: "Donation amount received",
    pdfTitle: "Official receipt attached",
    pdfNote:
      "Your 80G donation receipt is attached to this email as a PDF. Please download and save it for your tax records.",
    detailsTitle: "Transaction summary",
    paymentId: "Payment ID",
    orderId: "Order ID",
    pan: "PAN",
    receiptNo: "Receipt No.",
    taxNotice:
      "Donations to Aadar Foundation are eligible for deduction under Section 80G of the Income Tax Act, 1961, subject to applicable limits and rules.",
    reg80g: (no) => `80G Registration No.: ${no}`,
    footerHelpLine: "If you have questions about this receipt, we're happy to help.",
    footerThanks: "With gratitude,",
    footerTeam: "Team Aadar Foundation",
    footerWebsite: "Visit our website",
  },
  hi: {
    receiptLabel: "दान रसीद",
    greeting: (name) => `प्रिय ${name},`,
    intro:
      "आपके उदार सहयोग के लिए धन्यवाद। आपका योगदान बेघर और अनाथ लोगों को देखभाल, आश्रय और गरिमा प्रदान करने में मदद करता है।",
    amountLabel: "प्राप्त दान राशि",
    pdfTitle: "आधिकारिक रसीद संलग्न",
    pdfNote:
      "आपकी 80G दान रसीद इस ईमेल में PDF के रूप में संलग्न है। कृपया इसे डाउनलोड कर अपने कर रिकॉर्ड के लिए सुरक्षित रखें।",
    detailsTitle: "लेनदेन सारांश",
    paymentId: "भुगतान आईडी",
    orderId: "ऑर्डर आईडी",
    pan: "PAN",
    receiptNo: "रसीद संख्या",
    taxNotice:
      "आदर फाउंडेशन को किए गए दान आयकर अधिनियम, 1961 की धारा 80G के अंतर्गत, लागू सीमा और नियमों के अधीन कर कटौती के लिए पात्र हैं।",
    reg80g: (no) => `80G पंजीकरण संख्या: ${no}`,
    footerHelpLine: "इस रसीद के बारे में कोई प्रश्न हो तो हम सहायता के लिए उपलब्ध हैं।",
    footerThanks: "कृतज्ञता सहित,",
    footerTeam: "टीम आदर फाउंडेशन",
    footerWebsite: "हमारी वेबसाइट देखें",
  },
};

function isEmailConfigured() {
  return !!(process.env.RESEND_API_KEY && process.env.RECEIPT_FROM_EMAIL);
}

function getSiteUrl() {
  const raw =
    process.env.RECEIPT_SITE_URL || process.env.ALLOWED_ORIGINS || "https://www.aadarfoundation.org";
  const first = String(raw).split(",")[0].trim();
  return first.replace(/\/$/, "");
}

/** Inbox for donor replies — info@ is send-only via Resend; default is public contact email. */
function getReplyToEmail() {
  const fromEnv = String(process.env.RECEIPT_REPLY_TO || "").trim();
  if (fromEnv && fromEnv.includes("@")) return fromEnv;
  return ORG.email;
}

function getContactEmail() {
  return getReplyToEmail();
}

function formatAmountInr(amountInr) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amountInr) || 0);
}

function emailCopy(record) {
  const locale = record && record.locale === "hi" ? "hi" : "en";
  return EMAIL_COPY[locale] || EMAIL_COPY.en;
}

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function logoImgHtml(logoCid, siteUrl) {
  const src = logoCid ? `cid:${logoCid}` : `${siteUrl}/assets/images/logos/logo-aadar.jpg`;
  return `<img src="${src}" alt="${escapeHtml(ORG.name)}" width="88" height="88" border="0" style="display:block;width:88px;height:88px;max-width:88px;border-radius:50%;border:3px solid #2e7d32;margin:0 auto;" />`;
}

function detailRow(label, value) {
  if (!value || value === "—") return "";
  return `
    <tr>
      <td width="38%" style="padding:11px 16px;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.45;color:#64748b;font-weight:600;border-bottom:1px solid #e8f0e8;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:11px 16px;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.45;color:#1f2a44;font-weight:700;border-bottom:1px solid #e8f0e8;text-align:right;vertical-align:top;word-break:break-word;">${escapeHtml(value)}</td>
    </tr>`;
}

/**
 * Table-based HTML email (Gmail / Outlook safe) with inline logo via CID.
 */
function buildReceiptEmailHtml(record, { logoCid, siteUrl } = {}) {
  const donor = record.donor || {};
  const copy = emailCopy(record);
  const vm = buildReceiptViewModel(record);
  const amount = formatAmountInr(record.amountInr);
  const donorName = donor.name || "Donor";
  const url = siteUrl || getSiteUrl();
  const contactEmail = getContactEmail();
  const year = new Date().getFullYear();

  const detailRows = [
    detailRow(copy.paymentId, record.paymentId),
    detailRow(copy.orderId, record.orderId),
    detailRow(copy.receiptNo, vm.receiptNo),
    detailRow(copy.pan, donor.pan),
  ].join("");

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="${record.locale === "hi" ? "hi" : "en"}">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(copy.receiptLabel)} — ${escapeHtml(ORG.name)}</title>
</head>
<body style="margin:0;padding:0;background-color:#eef4ee;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#eef4ee" style="background-color:#eef4ee;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #d5e8d5;border-radius:12px;">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#f8fcf8" style="padding:32px 32px 24px;background-color:#f8fcf8;border-bottom:1px solid #eaf3ea;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:14px;">
                    ${logoImgHtml(logoCid, url)}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:22px;line-height:1.25;font-weight:700;color:#1b5e20;padding-bottom:4px;">
                    ${escapeHtml(ORG.name)}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.35;font-weight:600;color:#1e3a5f;padding-bottom:16px;">
                    ${escapeHtml(ORG.subtitle)}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:14px;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:10px;line-height:1.35;font-weight:700;color:#1b5e20;letter-spacing:0.06em;text-transform:uppercase;border:1.5px solid #2e7d32;border-radius:20px;padding:6px 16px;">
                          ${escapeHtml(ORG.tagline)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title bar -->
          <tr>
            <td align="center" bgcolor="#1b5e20" style="background-color:#1b5e20;padding:12px 24px;">
              <span style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.3;font-weight:700;color:#ffffff;letter-spacing:0.14em;text-transform:uppercase;">
                ${escapeHtml(copy.receiptLabel)}
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;font-weight:600;color:#1f2a44;padding-bottom:10px;">
                    ${escapeHtml(copy.greeting(donorName))}
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.65;color:#475569;padding-bottom:22px;">
                    ${escapeHtml(copy.intro)}
                  </td>
                </tr>

                <!-- Amount -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f0faf0" style="background-color:#f0faf0;border:1px solid #c8e6c9;border-radius:10px;">
                      <tr>
                        <td align="center" style="padding:20px 16px;">
                          <div style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.3;font-weight:700;color:#2e7d32;letter-spacing:0.06em;text-transform:uppercase;padding-bottom:6px;">
                            ${escapeHtml(copy.amountLabel)}
                          </div>
                          <div style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:30px;line-height:1.1;font-weight:700;color:#1b5e20;">
                            ${escapeHtml(amount)}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- PDF notice -->
                <tr>
                  <td style="padding-bottom:22px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#fffbeb" style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:8px;">
                      <tr>
                        <td style="padding:14px 16px;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#78350f;">
                          <strong style="color:#92400e;">${escapeHtml(copy.pdfTitle)}</strong><br />
                          ${escapeHtml(copy.pdfNote)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Details heading -->
                <tr>
                  <td style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.3;font-weight:700;color:#1b5e20;letter-spacing:0.08em;text-transform:uppercase;padding-bottom:8px;">
                    ${escapeHtml(copy.detailsTitle)}
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:22px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #dcefdc;border-radius:8px;">
                      ${detailRows}
                    </table>
                  </td>
                </tr>

                <!-- 80G -->
                <tr>
                  <td style="padding-bottom:0;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f6faf6" style="background-color:#f6faf6;border:1px dashed #a8c9a8;border-radius:8px;">
                      <tr>
                        <td align="center" style="padding:16px 18px;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.65;color:#334155;">
                          ${escapeHtml(copy.taxNotice)}<br />
                          <strong style="color:#2e7d32;font-size:12px;line-height:1.5;">${escapeHtml(copy.reg80g(ORG.reg80G))}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer: contact details once -->
          <tr>
            <td align="center" bgcolor="#f8fcf8" style="padding:28px 32px 24px;background-color:#f8fcf8;border-top:1px solid #eaf3ea;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                  <td align="center" style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.45;font-weight:700;color:#1b5e20;padding-bottom:4px;">
                    ${escapeHtml(copy.footerThanks)}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.45;font-weight:600;color:#475569;padding-bottom:12px;">
                    ${escapeHtml(copy.footerTeam)}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.55;color:#64748b;padding-bottom:16px;">
                    ${escapeHtml(copy.footerHelpLine)}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;padding:0 10px;">
                          <a href="mailto:${escapeHtml(contactEmail)}" style="color:#1b5e20;text-decoration:none;font-weight:600;">${escapeHtml(contactEmail)}</a>
                        </td>
                        <td style="color:#cbd5c1;font-size:12px;">|</td>
                        <td style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;padding:0 10px;">
                          <a href="tel:${escapeHtml(ORG.phone.replace(/\s/g, ""))}" style="color:#1b5e20;text-decoration:none;font-weight:600;">${escapeHtml(ORG.phone)}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.55;color:#64748b;padding-bottom:10px;">
                    ${escapeHtml(ORG.address)}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;">
                    <a href="${escapeHtml(url)}" style="color:#1b5e20;font-weight:600;text-decoration:underline;">${escapeHtml(copy.footerWebsite)}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">
          <tr>
            <td align="center" style="padding:16px 8px 0;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:10px;line-height:1.4;color:#94a3b8;">
              &copy; ${year} ${escapeHtml(ORG.name)}. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Send donation receipt email with PDF attachment via Resend.
 * @returns {Promise<{ sent: boolean, reason?: string, id?: string }>}
 */
async function sendDonationReceiptEmail(row, options = {}) {
  if (!isEmailConfigured()) {
    return { sent: false, reason: "not_configured" };
  }

  const email = String((row && row.donor_email) || "").trim();
  if (!email || email.length < 5) {
    return { sent: false, reason: "no_email" };
  }
  if (!isCapturedStatus(row.status)) {
    return { sent: false, reason: "not_captured" };
  }

  const record = donationRowToReceiptRecord(row, options);
  const { buffer, filename } = await buildReceiptPdfBuffer(record);
  const siteUrl = getSiteUrl();
  const logoBuffer = readLogoBuffer();
  const logoCid = logoBuffer ? LOGO_CID : null;
  const html = buildReceiptEmailHtml(record, { logoCid, siteUrl });
  const amount = formatAmountInr(record.amountInr);
  const replyTo = getReplyToEmail();

  const attachments = [
    {
      filename,
      content: buffer.toString("base64"),
      content_type: "application/pdf",
    },
  ];

  if (logoBuffer && logoCid) {
    attachments.push({
      filename: "logo-aadar.jpg",
      content: logoBuffer.toString("base64"),
      content_type: "image/jpeg",
      content_id: logoCid,
    });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RECEIPT_FROM_EMAIL,
      to: [email],
      reply_to: replyTo,
      subject: `Your Aadar Foundation donation receipt — ${amount}`,
      html,
      attachments,
      tags: [
        { name: "type", value: "donation_receipt" },
        { name: "payment_id", value: String(record.paymentId || "unknown").slice(0, 50) },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend API failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = await res.json().catch(() => ({}));
  return { sent: true, id: data.id };
}

/**
 * Idempotent receipt email — skips if already sent or not eligible.
 */
async function trySendReceiptEmail(row, options = {}) {
  if (!row || !row.payment_id) {
    return { sent: false, reason: "missing_row" };
  }
  if (!options.forceResend && row.receipt_email_sent_at) {
    return { sent: false, reason: "already_sent" };
  }
  if (!isCapturedStatus(row.status)) {
    return { sent: false, reason: "not_captured" };
  }
  if (!String(row.donor_email || "").trim()) {
    return { sent: false, reason: "no_email" };
  }

  try {
    let lastError = null;
    for (let attempt = 0; attempt < EMAIL_SEND_MAX_ATTEMPTS; attempt += 1) {
      if (attempt > 0) {
        await sleep(EMAIL_SEND_RETRY_DELAY_MS);
      }
      try {
        const result = await sendDonationReceiptEmail(row, options);
        if (!result.sent) {
          if (attempt < EMAIL_SEND_MAX_ATTEMPTS - 1) continue;
          return result;
        }

        const marked = await markReceiptEmailSent(row.payment_id);
        if (!marked.saved && marked.reason !== "already_sent") {
          // eslint-disable-next-line no-console
          console.warn("[receipt-email] sent but failed to mark receipt_email_sent_at", {
            payment_id: row.payment_id,
            reason: marked.reason,
          });
        }
        return result;
      } catch (err) {
        lastError = err;
        if (attempt >= EMAIL_SEND_MAX_ATTEMPTS - 1) break;
      }
    }

    // eslint-disable-next-line no-console
    console.error("[receipt-email] send failed after retries", {
      payment_id: row.payment_id,
      message: lastError && lastError.message ? lastError.message : String(lastError),
    });
    return {
      sent: false,
      reason: "send_failed",
      detail: lastError && lastError.message ? lastError.message : undefined,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[receipt-email] send failed", {
      payment_id: row.payment_id,
      message: err && err.message ? err.message : String(err),
    });
    return { sent: false, reason: "send_failed" };
  }
}

module.exports = {
  isEmailConfigured,
  sendDonationReceiptEmail,
  trySendReceiptEmail,
  buildReceiptEmailHtml,
};
