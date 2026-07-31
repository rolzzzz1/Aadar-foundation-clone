import { amountInWordsInrHi, getReceiptCopy, getReceiptLocale } from "utils/receiptI18n";

const ORG_BASE = {
  registration80G: "AAIAA2457N24BP01",
  address:
    "Swarg sadan ashram - Sarkari Malti, Behind Muktidham, Guda Gudi Ka Naka, Gwalior, MP 474001",
  pan: "AAIAA2457N",
  email: "aadarfoundation2018@gmail.com",
  phone: "+91 9039129571",
  website: "https://www.aadarfoundation.org/",
};

export const ORG = {
  name: "Aadar Foundation",
  subtitle: "Aashram Swarg Sadan",
  tagline: "80G Registered Non-Profit Organization",
  ...ORG_BASE,
};

export const RECEIPT_QR_HINT = "Scan to visit our website";

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

/** Indian English amount in words for receipt (whole rupees). */
export function amountInWordsInr(amountInr) {
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

export function formatInr(amountInr) {
  const n = Number(amountInr);
  if (!Number.isFinite(n)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatInrPdf(amountInr) {
  return formatInr(amountInr).replace(/\u20B9/g, "Rs. ");
}

export function formatReceiptDate(iso, locale = "en") {
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

export function receiptForLabel(record, copy) {
  if (record.purpose) return record.purpose;
  if (record.programLabel) return record.programLabel;
  return copy.generalDonation;
}

export function paymentStatusLabel(record, copy) {
  if (record.status === "success") return copy.status.success;
  if (record.status === "unverified") return copy.status.unverified;
  return copy.status.failed;
}

/** Format donor address line for receipts (address, city, state, PIN). */
export function formatDonorAddress(donor = {}) {
  const line = String(donor.address || "").trim();
  const city = String(donor.city || "").trim();
  const state = String(donor.state || "").trim();
  const pin = String(donor.pin || "").trim();
  const cityState = [city, state].filter(Boolean).join(", ");
  const locality = [cityState, pin].filter(Boolean).join(" - ");
  return [line, locality].filter(Boolean).join(", ");
}

/** Human-readable payment mode from Razorpay `payment.method` / DB `payment_method`. */
export function paymentMethodLabel(method, copy) {
  const key = String(method || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if (!key) return copy.paymentMode;
  const map = copy.paymentMethods || {};
  if (map[key]) return map[key];
  if (key === "upi_qr") return map.upi_qr || map.upi || "UPI (QR)";
  if (key.includes("upi")) return map.upi || "UPI";
  if (key.includes("card")) return map.card || "Card";
  if (key.includes("netbank")) return map.netbanking || "Net Banking";
  if (key.includes("wallet")) return map.wallet || "Wallet";
  if (key.includes("bank")) return map.bank_transfer || "Bank Transfer";
  return copy.paymentMode;
}

export function buildReceiptViewModel(record) {
  const locale = getReceiptLocale(record);
  const copy = getReceiptCopy(locale);
  const donor = record.donor || {};
  const org = { ...ORG_BASE, ...copy.org };
  const donorAddress = formatDonorAddress(donor);

  return {
    locale,
    copy,
    isSuccess: record.status === "success",
    testMode: !!record.testMode,
    receiptNo: record.receiptNo || "—",
    date: formatReceiptDate(record.paidAt || new Date().toISOString(), locale),
    paymentMode: paymentMethodLabel(record.paymentMethod || record.payment_method, copy),
    paymentStatus: paymentStatusLabel(record, copy),
    donorName: donor.name || "—",
    fatherOrHusbandName: donor.fatherOrHusbandName || "—",
    email: donor.email || "—",
    mobile: donor.contact ? `+91 ${donor.contact}` : "—",
    pan: donor.pan || "—",
    donorAddress: donorAddress || "—",
    amountInr: Number(record.amountInr) || 0,
    amountFormatted: formatInr(record.amountInr),
    amountFormattedPdf: formatInrPdf(record.amountInr),
    amountWords:
      locale === "hi" ? amountInWordsInrHi(record.amountInr) : amountInWordsInr(record.amountInr),
    paymentId: record.paymentId || "—",
    orderId: record.orderId || "—",
    receiptFor: receiptForLabel(record, copy),
    purpose: receiptForLabel(record, copy),
    errorDescription: record.errorDescription || "",
    org,
    qrHint: copy.qrHint,
  };
}
