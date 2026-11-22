const { buildOfficialReceiptPdf } = require("./receiptPdfServer");
const { donationRowToReceiptRecord, isCapturedStatus } = require("./receiptRecord");
const { markReceiptEmailSent } = require("./donationRecord");
const { buildReceiptViewModel } = require("./receiptFormatServer");

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
  phones: ["+91 9630982392", "+91 9039129571"],
  phone: "+91 9630982392, +91 9039129571",
  reg80G: "AAIAA2457N24BP01",
};

const EMAIL_COPY = {
  en: {
    receiptLabel: "Donation receipt",
    greeting: (name) => `Dear ${name},`,
    intro:
      "Thank you for your donation. Your support helps us provide food, shelter and care to people who have no home.",
    amountLabel: "Amount received",
    pdfTitle: "Your receipt is attached",
    pdfNote:
      "Your official 80G receipt is attached to this email. Please save the PDF with your tax papers.",
    detailsTitle: "Your donation",
    paymentId: "Payment ID",
    orderId: "Order ID",
    pan: "PAN",
    receiptNo: "Receipt number",
    date: "Date",
    taxNotice:
      "You can claim this donation under Section 80G of the Income Tax Act, 1961, within the limits allowed by law.",
    reg80g: (no) => `80G registration number: ${no}`,
    footerHelpLine: "If you need help with this receipt, reply to this email or call us.",
    footerThanks: "With gratitude,",
    footerTeam: "Team Aadar Foundation",
    footerWebsite: "Visit our website",
    subject: (amount) => `Your Aadar Foundation donation receipt — ${amount}`,
  },
  hi: {
    receiptLabel: "दान रसीद",
    greeting: (name) => `प्रिय ${name},`,
    intro:
      "आपके दान के लिए धन्यवाद। आपका सहयोग बेघर लोगों को भोजन, आश्रय और देखभाल देने में हमारी मदद करता है।",
    amountLabel: "प्राप्त राशि",
    pdfTitle: "आपकी रसीद संलग्न है",
    pdfNote:
      "आपकी आधिकारिक 80G रसीद इस ईमेल के साथ लगी है। कृपया PDF को अपने कर कागजों के साथ सहेज लें।",
    detailsTitle: "आपका दान",
    paymentId: "भुगतान आईडी",
    orderId: "ऑर्डर आईडी",
    pan: "PAN",
    receiptNo: "रसीद संख्या",
    date: "दिनांक",
    taxNotice:
      "यह दान आयकर अधिनियम, 1961 की धारा 80G के अंतर्गत, कानून की सीमा में कर कटौती के लिए इस्तेमाल किया जा सकता है।",
    reg80g: (no) => `80G पंजीकरण संख्या: ${no}`,
    footerHelpLine: "इस रसीद में मदद चाहिए तो इस ईमेल का जवाब दें या हमें कॉल करें।",
    footerThanks: "कृतज्ञता सहित,",
    footerTeam: "टीम आदर फाउंडेशन",
    footerWebsite: "हमारी वेबसाइट देखें",
    subject: (amount) => `आदर फाउंडेशन दान रसीद — ${amount}`,
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

function displaySiteUrl(url) {
  return String(url || "")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

function phoneLinksHtml() {
  return ORG.phones
    .map((phone) => {
      const dial = phone.replace(/\s/g, "");
      return `<a href="tel:${escapeHtml(dial)}" style="color:#1b5e20;text-decoration:none;">${escapeHtml(phone)}</a>`;
    })
    .join("<br />");
}

/** Plain-text letter so inboxes still show a body when HTML is hidden. */
function buildReceiptEmailText(record) {
  const donor = record.donor || {};
  const copy = emailCopy(record);
  const vm = buildReceiptViewModel(record);
  const amount = formatAmountInr(record.amountInr);
  const donorName = donor.name || "Donor";
  const url = getSiteUrl();

  return [
    ORG.name,
    copy.receiptLabel,
    "",
    copy.greeting(donorName),
    "",
    copy.intro,
    "",
    `${copy.amountLabel}: ${amount}`,
    `${copy.receiptNo}: ${vm.receiptNo}`,
    `${copy.date}: ${vm.date}`,
    "",
    copy.pdfNote,
    "",
    copy.taxNotice,
    copy.reg80g(ORG.reg80G),
    "",
    copy.footerThanks,
    copy.footerTeam,
    "",
    copy.footerHelpLine,
    getContactEmail(),
    ...ORG.phones,
    url,
  ].join("\n");
}

/**
 * HTML letter shown above the attached receipt PDF.
 * Tables and inline styles so Gmail and Outlook keep the layout.
 */
function buildReceiptEmailHtml(record, { siteUrl } = {}) {
  const donor = record.donor || {};
  const copy = emailCopy(record);
  const vm = buildReceiptViewModel(record);
  const amount = formatAmountInr(record.amountInr);
  const donorName = donor.name || "Donor";
  const url = siteUrl || getSiteUrl();
  const contactEmail = getContactEmail();
  const siteLabel = displaySiteUrl(url);
  const lang = record.locale === "hi" ? "hi" : "en";

  return `<!DOCTYPE html>
<html lang="${lang}">
<body style="margin:0;padding:0;background:#f3f7f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f7f4;margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #d7e6da;border-radius:12px;overflow:hidden;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#1f2a44;">
          <tr>
            <td style="background:#1b5e20;padding:22px 24px;">
              <div style="font-size:12px;letter-spacing:0.04em;color:#d7f0dc;">${escapeHtml(copy.receiptLabel)}</div>
              <div style="margin-top:6px;font-size:22px;line-height:1.3;font-weight:700;color:#ffffff;">${escapeHtml(ORG.name)}</div>
              <div style="margin-top:4px;font-size:13px;line-height:1.4;color:#e7f6ea;">${escapeHtml(ORG.subtitle)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 8px;">
              <p style="margin:0 0 12px;font-size:16px;line-height:1.5;color:#1f2a44;">${escapeHtml(copy.greeting(donorName))}</p>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#3d4a63;">${escapeHtml(copy.intro)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#edf7ee;border-radius:10px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <div style="font-size:12px;line-height:1.4;color:#3d6b45;">${escapeHtml(copy.amountLabel)}</div>
                    <div style="margin-top:4px;font-size:28px;line-height:1.2;font-weight:700;color:#1b5e20;">${escapeHtml(amount)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e6efe8;border-bottom:1px solid #e6efe8;">
                <tr>
                  <td style="padding:12px 0;font-size:13px;color:#64748b;width:42%;">${escapeHtml(copy.receiptNo)}</td>
                  <td style="padding:12px 0;font-size:14px;font-weight:700;color:#1f2a44;text-align:right;">${escapeHtml(vm.receiptNo)}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px;font-size:13px;color:#64748b;">${escapeHtml(copy.date)}</td>
                  <td style="padding:0 0 12px;font-size:14px;font-weight:700;color:#1f2a44;text-align:right;">${escapeHtml(vm.date)}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 4px;">
              <p style="margin:0 0 4px;font-size:14px;line-height:1.4;font-weight:700;color:#1b5e20;">${escapeHtml(copy.pdfTitle)}</p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#3d4a63;">${escapeHtml(copy.pdfNote)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 8px;">
              <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#526074;">${escapeHtml(copy.taxNotice)}</p>
              <p style="margin:0;font-size:13px;line-height:1.5;font-weight:700;color:#1f2a44;">${escapeHtml(copy.reg80g(ORG.reg80G))}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 22px;">
              <p style="margin:0;font-size:15px;line-height:1.5;color:#1f2a44;">${escapeHtml(copy.footerThanks)}</p>
              <p style="margin:2px 0 0;font-size:15px;line-height:1.5;font-weight:700;color:#1b5e20;">${escapeHtml(copy.footerTeam)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 20px;background:#f7faf7;border-top:1px solid #e5eee6;">
              <p style="margin:0 0 10px;font-size:13px;line-height:1.5;color:#526074;">${escapeHtml(copy.footerHelpLine)}</p>
              <p style="margin:0;font-size:13px;line-height:1.7;">
                <a href="mailto:${escapeHtml(contactEmail)}" style="color:#1b5e20;text-decoration:none;">${escapeHtml(contactEmail)}</a><br />
                ${phoneLinksHtml()}<br />
                <a href="${escapeHtml(url)}" style="color:#1b5e20;text-decoration:none;">${escapeHtml(siteLabel)}</a>
              </p>
              <p style="margin:10px 0 0;font-size:12px;line-height:1.5;color:#7b8798;">${escapeHtml(ORG.address)}</p>
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

  const email = String(options.toEmail || (row && row.donor_email) || "").trim();
  if (!email || email.length < 5 || !email.includes("@")) {
    return { sent: false, reason: "no_email" };
  }
  if (!isCapturedStatus(row.status)) {
    return { sent: false, reason: "not_captured" };
  }

  const record = donationRowToReceiptRecord(row, options);

  let buffer;
  let filename;
  try {
    ({ buffer, filename } = await buildOfficialReceiptPdf(record));
  } catch (pdfErr) {
    throw new Error(
      `PDF attachment build failed: ${pdfErr && pdfErr.message ? pdfErr.message : String(pdfErr)}`
    );
  }

  const siteUrl = getSiteUrl();
  const html = buildReceiptEmailHtml(record, { siteUrl });
  const text = buildReceiptEmailText(record);
  const amount = formatAmountInr(record.amountInr);
  const copy = emailCopy(record);
  const replyTo = getReplyToEmail();
  const subject =
    typeof copy.subject === "function"
      ? copy.subject(amount)
      : `Your Aadar Foundation donation receipt — ${amount}`;

  const attachments = [
    {
      filename: String(filename || "aadar-donation-receipt.pdf").replace(/[^\w.\-]+/g, "_"),
      content: buffer.toString("base64"),
      content_type: "application/pdf",
    },
  ];

  // Resend tags must be ASCII-safe; bank UTR payment ids often have spaces/symbols.
  const safeTag = (value) =>
    String(value || "unknown")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 50) || "unknown";

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
      subject,
      html,
      text,
      attachments,
      tags: [
        { name: "type", value: "donation_receipt" },
        { name: "payment_id", value: safeTag(record.paymentId) },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend API failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json().catch(() => ({}));
  return { sent: true, id: data.id, email };
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
  const overrideEmail = String(options.toEmail || "").trim();
  if (!overrideEmail && !String(row.donor_email || "").trim()) {
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

        const donorEmail = String(row.donor_email || "")
          .trim()
          .toLowerCase();
        const sentTo = String(result.email || overrideEmail || donorEmail)
          .trim()
          .toLowerCase();
        const sentToDonor = !overrideEmail || sentTo === donorEmail;
        const marked = sentToDonor
          ? await markReceiptEmailSent(row.payment_id)
          : { saved: true, reason: "alternate_recipient" };
        if (sentToDonor && !marked.saved && marked.reason !== "already_sent") {
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
  getReplyToEmail,
  getContactEmail,
  sendDonationReceiptEmail,
  trySendReceiptEmail,
  buildReceiptEmailHtml,
};
