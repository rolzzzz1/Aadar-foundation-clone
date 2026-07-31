/**
 * Official donation receipt numbers: AADAR-YYYY-000001
 * Allocated once at persist time and stored in donations.receipt_no (source of truth).
 */

const OFFICIAL_RECEIPT_RE = /^AADAR-(\d{4})-(\d+)$/i;
const SEQ_WIDTH = 6;

function isOfficialReceiptNo(value) {
  return OFFICIAL_RECEIPT_RE.test(String(value || "").trim());
}

function receiptYearFromDate(paidAt) {
  const date = paidAt ? new Date(paidAt) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().getFullYear();
  return date.getFullYear();
}

function formatOfficialReceiptNo(year, seq) {
  const y = Number(year);
  const n = Number(seq);
  if (!Number.isFinite(y) || !Number.isFinite(n) || n < 1) {
    throw new Error("Invalid receipt sequence");
  }
  return `AADAR-${y}-${String(Math.floor(n)).padStart(SEQ_WIDTH, "0")}`;
}

function parseOfficialReceiptNo(value) {
  const match = OFFICIAL_RECEIPT_RE.exec(String(value || "").trim());
  if (!match) return null;
  return { year: Number(match[1]), seq: Number(match[2]) };
}

function storeConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Highest sequence already stored for AADAR-{year}-* (0 if none).
 */
async function fetchMaxOfficialSeq(year) {
  if (!storeConfigured()) return 0;

  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const prefix = `AADAR-${year}-`;
  const url = `${base}/rest/v1/donations?receipt_no=like.${encodeURIComponent(
    `${prefix}*`
  )}&select=receipt_no&order=receipt_no.desc&limit=50`;

  try {
    const res = await fetch(url, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) return 0;
    const rows = await res.json().catch(() => []);
    if (!Array.isArray(rows) || rows.length === 0) return 0;

    let max = 0;
    for (const row of rows) {
      const parsed = parseOfficialReceiptNo(row && row.receipt_no);
      if (parsed && parsed.year === Number(year) && parsed.seq > max) {
        max = parsed.seq;
      }
    }
    return max;
  } catch {
    return 0;
  }
}

/**
 * Next official receipt number for the given payment year.
 * Relies on a unique index on receipt_no plus insert retries for races.
 * @param {{ paidAt?: string, minSeq?: number }} [options]
 */
async function allocateOfficialReceiptNo(options = {}) {
  const year = receiptYearFromDate(options.paidAt);
  const maxExisting = await fetchMaxOfficialSeq(year);
  const hintSeq = Number(options.minSeq);
  const next = Math.max(
    maxExisting + 1,
    Number.isFinite(hintSeq) && hintSeq >= 1 ? Math.floor(hintSeq) : 1
  );
  return formatOfficialReceiptNo(year, next);
}

/**
 * Prefer an already-issued official number; otherwise keep the first non-empty value.
 * Never replace an existing receipt_no once set (idempotent upserts / webhooks).
 */
function resolveReceiptNo(existingNo, incomingNo) {
  const existing = String(existingNo || "").trim();
  const incoming = String(incomingNo || "").trim();
  if (existing) return existing;
  if (incoming) return incoming;
  return "";
}

module.exports = {
  OFFICIAL_RECEIPT_RE,
  SEQ_WIDTH,
  isOfficialReceiptNo,
  formatOfficialReceiptNo,
  parseOfficialReceiptNo,
  receiptYearFromDate,
  fetchMaxOfficialSeq,
  allocateOfficialReceiptNo,
  resolveReceiptNo,
};
