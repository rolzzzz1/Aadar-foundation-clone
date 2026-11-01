const { buildReceiptPdfBuffer } = require("./receiptPdfServer");
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
    date: "Date",
    taxNotice:
      "Donations to Aadar Foundation are eligible for deduction under Section 80G of the Income Tax Act, 1961, subject to applicable limits and rules.",
    reg80g: (no) => `80G Registration No.: ${no}`,
    footerHelpLine: "If you have questions about this receipt, we're happy to help.",
    footerThanks: "With gratitude,",
    footerTeam: "Team Aadar Foundation",
    footerWebsite: "Visit our website",
    subject: (amount) => `Your Aadar Foundation donation receipt — ${amount}`,
  },
  hi: {
    receiptLabel: "दान रसीद",
    greeting: (name) => `प्रिय ${name},`,
    intro:
      "आपके उदार सहयोग के लिए धन्यवाद। आपका योगदान बेघर एवं लावारिस लोगों को देखभाल, आश्रय और गरिमा प्रदान करने में मदद करता है।",
    amountLabel: "प्राप्त दान राशि",
    pdfTitle: "आधिकारिक रसीद संलग्न",
    pdfNote:
      "आपकी 80G दान रसीद इस ईमेल में PDF के रूप में संलग्न है। कृपया इसे डाउनलोड कर अपने कर रिकॉर्ड के लिए सुरक्षित रखें।",
    detailsTitle: "लेनदेन सारांश",
    paymentId: "भुगतान आईडी",
    orderId: "ऑर्डर आईडी",
    pan: "PAN",
    receiptNo: "रसीद संख्या",
    date: "दिनांक",
    taxNotice:
      "आदर फाउंडेशन को किए गए दान आयकर अधिनियम, 1961 की धारा 80G के अंतर्गत, लागू सीमा और नियमों के अधीन कर कटौती के लिए पात्र हैं।",
    reg80g: (no) => `80G पंजीकरण संख्या: ${no}`,
    footerHelpLine: "इस रसीद के बारे में कोई प्रश्न हो तो हम सहायता के लिए उपलब्ध हैं।",
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

/** Plain-text letter so inboxes still show a body when HTML is hidden. */
function buildReceiptEmailText(record) {
  const donor = record.donor || {};
  const copy = emailCopy(record);
  const vm = buildReceiptViewModel(record);
  const amount = formatAmountInr(record.amountInr);
  const donorName = donor.name || "Donor";

  return [
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
    getContactEmail(),
    ORG.phone,
    getSiteUrl(),
  ].join("\n");
}

/**
 * Short HTML letter plus the PDF attachment. Kept simple so mail apps show the message, not only the file.
 */
function buildReceiptEmailHtml(record, { siteUrl } = {}) {
  const donor = record.donor || {};
  const copy = emailCopy(record);
  const vm = buildReceiptViewModel(record);
  const amount = formatAmountInr(record.amountInr);
  const donorName = donor.name || "Donor";
  const url = siteUrl || getSiteUrl();
  const contactEmail = getContactEmail();

  return `<!DOCTYPE html>
<html lang="${record.locale === "hi" ? "hi" : "en"}">
<body style="margin:0;padding:24px;background:#ffffff;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#1f2a44;">
  <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">${escapeHtml(copy.greeting(donorName))}</p>
  <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">${escapeHtml(copy.intro)}</p>
  <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
    <strong>${escapeHtml(copy.amountLabel)}:</strong> ${escapeHtml(amount)}<br />
    <strong>${escapeHtml(copy.receiptNo)}:</strong> ${escapeHtml(vm.receiptNo)}<br />
    <strong>${escapeHtml(copy.date)}:</strong> ${escapeHtml(vm.date)}
  </p>
  <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">${escapeHtml(copy.pdfNote)}</p>
  <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#334155;">
    ${escapeHtml(copy.taxNotice)}<br />
    <strong>${escapeHtml(copy.reg80g(ORG.reg80G))}</strong>
  </p>
  <p style="margin:0 0 4px;font-size:15px;line-height:1.5;">${escapeHtml(copy.footerThanks)}</p>
  <p style="margin:0 0 16px;font-size:15px;line-height:1.5;font-weight:600;color:#1b5e20;">${escapeHtml(copy.footerTeam)}</p>
  <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">
    <a href="mailto:${escapeHtml(contactEmail)}" style="color:#1b5e20;">${escapeHtml(contactEmail)}</a><br />
    ${escapeHtml(ORG.phone)}<br />
    <a href="${escapeHtml(url)}" style="color:#1b5e20;">${escapeHtml(url)}</a>
  </p>
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
    // Every emailed receipt uses the official HTML layout (Receipt Demo.pdf).
    try {
      ({ buffer, filename } = await Promise.race([
        buildReceiptPdfBuffer(record, { preferHtml: true }),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error("html_pdf_timeout")), 45000);
        }),
      ]));
    } catch (htmlErr) {
      // eslint-disable-next-line no-console
      console.warn("[receipt-email] HTML PDF failed, using official vector layout:", htmlErr.message);
      ({ buffer, filename } = await buildReceiptPdfBuffer(record, { forceVector: true }));
    }
  } catch (pdfErr) {
    throw new Error(
      `PDF attachment build failed: ${pdfErr && pdfErr.message ? pdfErr.message : String(pdfErr)}`
    );
  }

  if (!buffer || buffer.length < 200) {
    throw new Error("PDF attachment build failed: empty PDF buffer");
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
