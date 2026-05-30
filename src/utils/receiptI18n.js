/** Receipt copy for English and Hindi (used by preview, HTML, and PDF). */

const ORG_EN = {
  name: "Aadar Foundation",
  subtitle: "Aashram Swarg Sadan",
  tagline: "80G Registered Non-Profit Organization",
};

const ORG_HI = {
  name: "आदर फाउंडेशन",
  subtitle: "आश्रम स्वर्ग सदन",
  tagline: "80G पंजीकृत गैर-लाभकारी संगठन",
};

const HI_ONES = [
  "",
  "एक",
  "दो",
  "तीन",
  "चार",
  "पाँच",
  "छह",
  "सात",
  "आठ",
  "नौ",
  "दस",
  "ग्यारह",
  "बारह",
  "तेरह",
  "चौदह",
  "पंद्रह",
  "सोलह",
  "सत्रह",
  "अठारह",
  "उन्नीस",
];
const HI_TENS = ["", "", "बीस", "तीस", "चालीस", "पचास", "साठ", "सत्तर", "अस्सी", "नब्बे"];

function hiTwoDigits(n) {
  if (n < 20) return HI_ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return `${HI_TENS[t]}${o ? ` ${HI_ONES[o]}` : ""}`.trim();
}

function hiThreeDigits(n) {
  if (n === 0) return "";
  if (n < 100) return hiTwoDigits(n);
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return `${HI_ONES[h]} सौ${rest ? ` ${hiTwoDigits(rest)}` : ""}`.trim();
}

/** Indian numbering — amount in Hindi words (whole rupees). */
export function amountInWordsInrHi(amountInr) {
  const n = Math.round(Number(amountInr));
  if (!Number.isFinite(n) || n < 0) return "रुपये शून्य मात्र";
  if (n === 0) return "रुपये शून्य मात्र";

  const parts = [];
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;

  if (crore) parts.push(`${hiThreeDigits(crore)} करोड़`);
  if (lakh) parts.push(`${hiThreeDigits(lakh)} लाख`);
  if (thousand) parts.push(`${hiThreeDigits(thousand)} हज़ार`);
  if (rest) parts.push(hiThreeDigits(rest));

  return `रुपये ${parts.join(" ")} मात्र`;
}

export const RECEIPT_COPY = {
  en: {
    org: ORG_EN,
    qrHint: "Scan to visit our website",
    title: "DONATION RECEIPT",
    testBanner: "TEST MODE — Not a valid tax receipt for live payments.",
    meta: {
      receiptNo: "Receipt No.",
      date: "Date",
      payment: "Payment",
      status: "Status",
    },
    thanks: (name) =>
      `Thank you, ${name}, for your generous contribution towards the care, shelter and dignity of homeless & unclaimed people.`,
    thanksSub: "Your support truly makes a difference.",
    donorTableTitle: "DONOR DETAILS",
    donationTableTitle: "DONATION DETAILS",
    donorRows: {
      name: "Donor Name",
      fatherHusband: "Father / Husband",
      email: "Email",
      mobile: "Mobile",
      pan: "PAN",
    },
    donationRows: {
      amount: "Amount",
      amountAlt: "Donation Amount",
      transactionId: "Transaction ID",
      orderId: "Order ID",
      receiptFor: "Receipt For",
      inWords: "In words",
      amountInWords: "Amount (in words)",
    },
    taxNotice:
      "This donation is eligible for tax exemption under Section 80G of the Income Tax Act, 1961, subject to applicable rules. Please keep this receipt for your tax records.",
    taxNoticeShort:
      "Eligible for tax exemption under Section 80G, subject to applicable rules. Keep for your records.",
    reg80g: (no) => `80G Registration No.: ${no}`,
    fundsNotice: "This receipt is valid subject to realization of funds.",
    fcraNotice: "Domestic contribution (India). Organisation not registered under FCRA.",
    contact: { email: "Email", phone: "Phone", pan: "PAN" },
    closing1: "Every contribution helps us provide food, shelter and dignity to those in need.",
    closing2: "Thank you for being a part of our mission.",
    signature: "This is a computer-generated receipt and does not require physical signature.",
    signaturePdf: "Computer-generated receipt — no physical signature required.",
    paymentMode: "Online (Razorpay)",
    generalDonation: "General Donation",
    status: {
      success: "Successful",
      unverified: "Pending verification",
      failed: "Not completed",
    },
    htmlTitle: (orgName) => `Donation Receipt — ${orgName}`,
  },
  hi: {
    org: ORG_HI,
    qrHint: "हमारी वेबसाइट देखने के लिए स्कैन करें",
    title: "दान रसीद",
    testBanner: "टेस्ट मोड — लाइव भुगतान के लिए यह मान्य कर रसीद नहीं है।",
    meta: {
      receiptNo: "रसीद संख्या",
      date: "दिनांक",
      payment: "भुगतान",
      status: "स्थिति",
    },
    thanks: (name) =>
      `धन्यवाद, ${name}, बेघर और अनाथ लोगों की देखभाल, आश्रय और गरिमा के लिए आपके उदार योगदान के लिए।`,
    thanksSub: "आपका सहयोग वास्तव में फर्क लाता है।",
    donorTableTitle: "दाता विवरण",
    donationTableTitle: "दान विवरण",
    donorRows: {
      name: "दाता का नाम",
      fatherHusband: "पिता / पति",
      email: "ईमेल",
      mobile: "मोबाइल",
      pan: "PAN",
    },
    donationRows: {
      amount: "राशि",
      amountAlt: "दान राशि",
      transactionId: "लेनदेन आईडी",
      orderId: "ऑर्डर आईडी",
      receiptFor: "रसीद का उद्देश्य",
      inWords: "शब्दों में",
      amountInWords: "राशि (शब्दों में)",
    },
    taxNotice:
      "यह दान आयकर अधिनियम, 1961 की धारा 80G के अंतर्गत लागू नियमों के अधीन कर छूट के लिए पात्र है। कृपया अपने कर रिकॉर्ड के लिए इस रसीद को सुरक्षित रखें।",
    taxNoticeShort:
      "धारा 80G के अंतर्गत कर छूट के लिए पात्र, लागू नियमों के अधीन। अपने रिकॉर्ड के लिए सुरक्षित रखें।",
    reg80g: (no) => `80G पंजीकरण संख्या: ${no}`,
    fundsNotice: "यह रसीद धन प्राप्ति के अधीन मान्य है।",
    fcraNotice: "घरेलू अंशदान (भारत)। संगठन FCRA के अंतर्गत पंजीकृत नहीं।",
    contact: { email: "ईमेल", phone: "फ़ोन", pan: "PAN" },
    closing1: "हर योगदान जरूरतमंदों को भोजन, आश्रय और गरिमा प्रदान करने में मदद करता है।",
    closing2: "हमारे मिशन का हिस्सा बनने के लिए धन्यवाद।",
    signature: "यह कंप्यूटर जनित रसीद है; भौतिक हस्ताक्षर की आवश्यकता नहीं है।",
    signaturePdf: "कंप्यूटर जनित रसीद — भौतिक हस्ताक्षर आवश्यक नहीं।",
    paymentMode: "ऑनलाइन (Razorpay)",
    generalDonation: "सामान्य दान",
    status: {
      success: "सफल",
      unverified: "सत्यापन लंबित",
      failed: "पूर्ण नहीं",
    },
    htmlTitle: (orgName) => `दान रसीद — ${orgName}`,
  },
};

export function getReceiptLocale(record) {
  const lang = record?.locale;
  return lang === "hi" ? "hi" : "en";
}

export function getReceiptCopy(recordOrLocale) {
  const locale =
    typeof recordOrLocale === "string" ? recordOrLocale : getReceiptLocale(recordOrLocale);
  return RECEIPT_COPY[locale] || RECEIPT_COPY.en;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Localized receipt body HTML (meta, tables, footer). */
export function buildReceiptHtmlBody({
  copy,
  vm,
  safe,
  donorTable,
  donationTable,
  forPdf = false,
}) {
  const thanksHtml = forPdf
    ? `<div class="pdf-thanks">
      <p class="thanks">${escapeHtml(copy.thanks(vm.donorName))}</p>
      <em class="thanks">${escapeHtml(copy.thanksSub)}</em>
    </div>`
    : `<p class="thanks">${escapeHtml(copy.thanks(vm.donorName))}</p>
      <em class="thanks">${escapeHtml(copy.thanksSub)}</em>`;

  return `
      <div class="meta">
        <div><label>${escapeHtml(copy.meta.receiptNo)}</label><span class="green">${
    safe.receiptNo
  }</span></div>
        <div><label>${escapeHtml(copy.meta.date)}</label><span>${safe.date}</span></div>
        <div><label>${escapeHtml(copy.meta.payment)}</label><span>${safe.paymentMode}</span></div>
        <div><label>${escapeHtml(copy.meta.status)}</label><span class="green">${
    safe.paymentStatus
  }</span></div>
      </div>
      ${thanksHtml}
      <div class="tables">
        ${donorTable}
        ${donationTable}
      </div>
      <div class="tax-box">
        ${escapeHtml(copy.taxNotice)}
        <strong>${escapeHtml(copy.reg80g(vm.org.registration80G))}</strong>
        <strong>${escapeHtml(copy.fundsNotice)}</strong>
        <strong>${escapeHtml(copy.fcraNotice)}</strong>
      </div>
      <div class="footer-row">
        <div class="contact">
          ${safe.orgAddress}<br />
          ${escapeHtml(copy.contact.email)}: ${safe.orgEmail}<br />
          ${escapeHtml(copy.contact.phone)}: ${safe.orgPhone}<br />
          ${escapeHtml(copy.contact.pan)}: ${safe.orgPan}
        </div>
        <div class="qr-block">
          <img class="qr" src="${safe.qrSrc}" alt="${escapeHtml(vm.qrHint)}" />
          <div class="qr-hint">${escapeHtml(vm.qrHint)}</div>
        </div>
      </div>
      <div class="closing">
        <div>${escapeHtml(copy.closing1)}</div>
        <div class="bold">${escapeHtml(copy.closing2)}</div>
        <div class="sig">${escapeHtml(copy.signature)}</div>
      </div>`;
}
