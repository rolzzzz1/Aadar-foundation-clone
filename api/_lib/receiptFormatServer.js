/** Server mirror of src/utils/receiptFormat.js (receipt view model for PDF). */

const { amountInWordsInrHi, getReceiptCopy, getReceiptLocale } = require("./receiptI18nServer");

const ORG_BASE = {
  registration80G: "AAIAA2457N24BP01",
  address:
    "Swarg sadan ashram - Sarkari Malti, Behind Muktidham, Guda Gudi Ka Naka, Gwalior, MP 474001",
  pan: "AAIAA2457N",
  email: "aadarfoundation2018@gmail.com",
  phone: "+91 9039129571",
  website: "https://www.aadarfoundation.org/",
};

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigits(n) {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return `${TENS[t]}${o ? ` ${ONES[o]}` : ""}`.trim();
}

function threeDigits(n) {
  if (n === 0) return "";
  if (n < 100) return twoDigits(n);
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return `${ONES[h]} Hundred${rest ? ` ${twoDigits(rest)}` : ""}`.trim();
}

function amountInWordsInr(amountInr) {
  const n = Math.round(Number(amountInr));
  if (!Number.isFinite(n) || n < 0) return "Rupees Zero Only";
  if (n === 0) return "Rupees Zero Only";

  const parts = [];
  const lakh = Math.floor(n / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;

  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (rest) parts.push(threeDigits(rest));

  return `Rupees ${parts.join(" ")} Only`;
}

function formatInr(amountInr) {
  const n = Number(amountInr);
  if (!Number.isFinite(n)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatInrPdf(amountInr) {
  return formatInr(amountInr).replace(/\u20B9/g, "Rs. ");
}

function formatReceiptDate(iso, locale = "en") {
  try {
    return new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return iso || "—";
  }
}

function formatDisplayReceiptNo(record) {
  const raw = record.receiptNo || "";
  if (/^AADAR-\d{4}-\d+/i.test(raw)) return raw.toUpperCase();

  const year = new Date(record.paidAt || Date.now()).getFullYear();
  const digits = (record.paymentId || record.orderId || raw || String(Date.now()))
    .replace(/\D/g, "")
    .slice(-5)
    .padStart(5, "0");
  return `AADAR-${year}-${digits}`;
}

function receiptForLabel(record, copy) {
  if (record.programLabel) return record.programLabel;
  if (record.purpose) return record.purpose;
  return copy.generalDonation;
}

function paymentStatusLabel(record, copy) {
  if (record.status === "success") return copy.status.success;
  if (record.status === "unverified") return copy.status.unverified;
  return copy.status.failed;
}

function buildReceiptViewModel(record) {
  const locale = getReceiptLocale(record);
  const copy = getReceiptCopy(locale);
  const donor = record.donor || {};
  const org = { ...ORG_BASE, ...copy.org };

  return {
    locale,
    copy,
    isSuccess: record.status === "success",
    testMode: !!record.testMode,
    receiptNo: formatDisplayReceiptNo(record),
    date: formatReceiptDate(record.paidAt || new Date().toISOString(), locale),
    paymentMode: copy.paymentMode,
    paymentStatus: paymentStatusLabel(record, copy),
    donorName: donor.name || "—",
    fatherOrHusbandName: donor.fatherOrHusbandName || "—",
    email: donor.email || "—",
    mobile: donor.contact ? `+91 ${donor.contact}` : "—",
    pan: donor.pan || "—",
    amountInr: Number(record.amountInr) || 0,
    amountFormatted: formatInr(record.amountInr),
    amountFormattedPdf: formatInrPdf(record.amountInr),
    amountWords:
      locale === "hi" ? amountInWordsInrHi(record.amountInr) : amountInWordsInr(record.amountInr),
    paymentId: record.paymentId || "—",
    orderId: record.orderId || "—",
    receiptFor: receiptForLabel(record, copy),
    org,
    qrHint: copy.qrHint,
  };
}

module.exports = {
  buildReceiptViewModel,
};
