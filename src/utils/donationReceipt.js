import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import aadarLogoUrl from "assets/images/logos/logo-aadar.jpg";
import { getApiUrl } from "utils/api";
import { getReceiptWebsiteQrSrc } from "utils/receiptAssets";
import { buildReceiptViewModel, ORG, formatInr, formatReceiptDate } from "utils/receiptFormat";
import { buildReceiptHtmlBody } from "utils/receiptI18n";
import { buildReceiptHeaderHtml, receiptHeaderCss } from "utils/receiptHeaderHtml";

/** Watermark (px) on screen / print preview. */
const RECEIPT_WATERMARK_PX = 88;
/** Header logo size (mm) in vector PDF fallback. */
const RECEIPT_PDF_LOGO_MM = 18;
const HTML2CANVAS_SCALE = 2;

export { ORG, formatInr, formatReceiptDate as formatDate };

let logoDataUrlPromise = null;
let qrDataUrlPromise = null;

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pdfSafeText(value, locale = "en") {
  let s = String(value ?? "")
    .replace(/\u20B9/g, "Rs.")
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u00A0/g, " ");
  if (locale === "hi") {
    // eslint-disable-next-line no-misleading-character-class -- Devanagari block for Hindi receipts
    return s.replace(/[^\u0020-\u007E\u00A0-\u00FF\u0900-\u097F]/g, "");
  }
  return s.replace(/[^\u0020-\u007E\u00A0-\u00FF]/g, "");
}

async function blobToDataUrl(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function getLogoDataUrl() {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = blobToDataUrl(aadarLogoUrl).catch(() => null);
  }
  return logoDataUrlPromise;
}

async function getReceiptQrDataUrl() {
  if (!qrDataUrlPromise) {
    qrDataUrlPromise = blobToDataUrl(getReceiptWebsiteQrSrc()).catch(() => null);
  }
  return qrDataUrlPromise;
}

function receiptFilename(record) {
  const id = (record.paymentId || record.receiptNo || record.orderId || "donation").replace(
    /[^a-zA-Z0-9_-]/g,
    ""
  );
  return `aadar-donation-receipt-${id}`;
}

function detailTableHtml(title, rows, amountLabels) {
  const body = rows
    .map(
      ([label, value], idx) => `
    <tr class="${idx % 2 === 0 ? "even" : "odd"}">
      <th>${escapeHtml(label)}</th>
      <td class="${amountLabels.includes(label) ? "amount" : ""}">${escapeHtml(value)}</td>
    </tr>`
    )
    .join("");

  return `
  <div class="detail-table">
    <div class="detail-table-head">${escapeHtml(title)}</div>
    <table><tbody>${body}</tbody></table>
  </div>`;
}

function buildClientDevanagariFontFaceCss(fontBaseUrl) {
  const base = String(fontBaseUrl || "").replace(/\/$/, "");
  if (!base) return "";
  return `
    @font-face {
      font-family: "Noto Sans Devanagari";
      font-style: normal;
      font-weight: 400;
      src: url("${base}/fonts/NotoSansDevanagari-Regular.ttf") format("truetype");
      font-display: block;
    }
    @font-face {
      font-family: "Noto Sans Devanagari";
      font-style: normal;
      font-weight: 700;
      src: url("${base}/fonts/NotoSansDevanagari-Bold.ttf") format("truetype");
      font-display: block;
    }
    @font-face {
      font-family: "Noto Sans Devanagari";
      font-style: normal;
      font-weight: 800;
      src: url("${base}/fonts/NotoSansDevanagari-Bold.ttf") format("truetype");
      font-display: block;
    }`;
}

function receiptDocumentStyles(forPdf, { locale = "en", fontBaseUrl = "" } = {}) {
  const isHi = locale === "hi";
  const fontStack = isHi
    ? `"Noto Sans Devanagari", Hind, Mukta, "Segoe UI", Helvetica, Arial, sans-serif`
    : `"Segoe UI", Lato, Helvetica, Arial, sans-serif`;
  const fontFaces = isHi ? buildClientDevanagariFontFaceCss(fontBaseUrl) : "";

  if (forPdf) {
    return `
    ${fontFaces}
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; width: 190mm; font-family: ${fontStack}; color: #1a2340; background: #fff; font-size: 11px; line-height: 1.35; }
    .sheet { width: 190mm; max-width: 190mm; margin: 0; background: #fff; border: 1px solid #c5d8c5; border-radius: 4px; overflow: hidden; position: relative; }
    .watermark { display: none; }
    .inner.pdf-body { display: block; padding: 8px 12px 10px; text-align: center; }
    .inner.pdf-body > * { margin: 0 0 8px; }
    .inner.pdf-body > *:last-child { margin-bottom: 0; }
    ${receiptHeaderCss}
    table.meta { width: 100%; border-collapse: separate; border-spacing: 0; background: #f6faf6; border-radius: 6px; table-layout: fixed; }
    table.meta td { width: 25%; padding: 10px 8px; text-align: center; vertical-align: top; }
    .meta-label { display: block; font-size: 0.65rem; color: #4a5568; font-weight: 700; margin-bottom: 3px; line-height: 1.2; }
    .meta-value { display: block; font-size: 0.76rem; font-weight: 800; word-break: break-word; color: #1a2340; line-height: 1.25; }
    .meta-value.green { color: #2e7d32; }
    .pdf-thanks { display: block; text-align: center; }
    .pdf-thanks .thanks { margin: 0 0 4px; font-size: 0.78rem; line-height: 1.4; color: #1a2340; }
    .pdf-thanks em.thanks { display: block; margin: 0; font-size: 0.72rem; color: #4a5568; font-style: italic; }
    table.tables { width: 100%; border-collapse: separate; border-spacing: 10px 0; table-layout: fixed; }
    table.tables > tbody > tr > td { width: 50%; vertical-align: top; padding: 0; }
    .detail-table { width: 100%; border: 1px solid #c8d4c8; border-radius: 6px; overflow: hidden; }
    .detail-table-head { background: #1b5e20; color: #fff; padding: 5px 8px; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.04em; text-align: center; line-height: 1.2; }
    .detail-table table { width: 100%; border-collapse: collapse; }
    .detail-table th, .detail-table td { padding: 5px 7px; font-size: 0.68rem; line-height: 1.3; vertical-align: top; }
    .detail-table th { color: #4a5568; font-weight: 700; text-align: left; width: 40%; }
    .detail-table td { font-weight: 700; text-align: right; word-break: break-word; color: #1a2340; }
    .detail-table tr.odd { background: #fafcfa; }
    .detail-table tr + tr th, .detail-table tr + tr td { border-top: 1px solid #e8eee8; }
    .detail-table td.amount { color: #2e7d32; font-weight: 800; }
    .tax-box { border: 1px dashed #a8bca8; border-radius: 6px; padding: 10px 12px; background: #f6faf6; font-size: 0.7rem; line-height: 1.4; text-align: center; color: #1a2340; }
    .tax-box strong { color: #2e7d32; display: block; margin-top: 6px; font-size: inherit; font-weight: 800; line-height: 1.35; }
    .tax-box strong + strong { margin-top: 4px; }
    table.footer-row { width: 100%; border-collapse: collapse; table-layout: fixed; text-align: left; font-size: 0.68rem; line-height: 1.4; }
    table.footer-row td { vertical-align: middle; padding: 0; }
    table.footer-row .contact { font-weight: 600; color: #1a2340; }
    table.footer-row .qr-block { width: 72px; text-align: center; }
    table.footer-row img.qr { width: 52px; height: 52px; object-fit: contain; display: block; margin: 0 auto; }
    table.footer-row .qr-hint { font-size: 0.62rem; color: #4a5568; margin-top: 4px; font-weight: 600; line-height: 1.2; max-width: 72px; }
    .closing { padding-top: 10px; border-top: 1px solid #dcefdc; font-size: 0.72rem; line-height: 1.38; color: #1a2340; }
    .closing .bold { font-weight: 800; color: #1b5e20; display: block; margin-top: 4px; }
    .sig { font-size: 0.64rem; color: #4a5568; margin-top: 6px; line-height: 1.3; }
    .test-banner { background: #fff8e1; color: #6d4c00; padding: 6px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; line-height: 1.35; }
    .fail-msg { color: #b71c1c; font-size: 0.76rem; font-weight: 600; line-height: 1.35; }
    html[lang="hi"] .detail-table th, html[lang="hi"] .detail-table td { font-size: 0.64rem; }
    html[lang="hi"] .thanks, html[lang="hi"] .pdf-thanks .thanks { font-size: 0.74rem; }
    html[lang="hi"] .tax-box { font-size: 0.66rem; }`;
  }

  return `
    ${fontFaces}
    * { box-sizing: border-box; }
    body { margin: 0; padding: 8px; font-family: ${fontStack}; color: #1f2a44; background: #fff; font-size: 10px; }
    .sheet { max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid #d5e8d5; border-radius: 8px; overflow: hidden; position: relative; page-break-inside: avoid; }
    .watermark { position: absolute; left: 50%; top: 45%; transform: translate(-50%,-50%); width: ${RECEIPT_WATERMARK_PX}px; opacity: 0.05; pointer-events: none; }
    .inner { position: relative; padding: 12px 14px; text-align: center; }
    ${receiptHeaderCss}
    table.meta { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 8px; table-layout: fixed; text-align: center; }
    table.meta td { width: 25%; padding: 4px 6px; vertical-align: top; }
    .meta-label { display: block; font-size: 0.58rem; color: rgba(31,42,68,0.55); font-weight: 600; margin-bottom: 2px; }
    .meta-value { display: block; font-size: 0.68rem; font-weight: 700; word-break: break-word; }
    .meta-value.green { color: #2e7d32; }
    .thanks { font-size: 0.68rem; line-height: 1.4; margin: 0 0 2px; }
    .thanks em { font-size: 0.62rem; color: rgba(31,42,68,0.65); font-style: italic; display: block; margin-bottom: 8px; }
    table.tables { width: 100%; border-collapse: separate; border-spacing: 8px 0; margin-bottom: 8px; table-layout: fixed; }
    table.tables > tbody > tr > td { width: 50%; vertical-align: top; padding: 0; }
    .detail-table { width: 100%; border: 1px solid #d8e0d8; border-radius: 6px; overflow: hidden; min-width: 0; }
    .detail-table-head { background: #1b5e20; color: #fff; padding: 4px 8px; font-size: 0.58rem; font-weight: 800; letter-spacing: 0.06em; text-align: center; }
    .detail-table table { width: 100%; border-collapse: collapse; }
    .detail-table th, .detail-table td { padding: 3px 6px; font-size: 0.58rem; vertical-align: top; }
    .detail-table th { color: rgba(31,42,68,0.6); font-weight: 600; text-align: left; width: 42%; }
    .detail-table td { font-weight: 600; text-align: right; word-break: break-word; }
    .detail-table tr.odd { background: #fafcfa; }
    .detail-table tr + tr th, .detail-table tr + tr td { border-top: 1px solid #eef2ee; }
    .detail-table td.amount { color: #2e7d32; font-weight: 800; }
    .tax-box { border: 1px dashed #b8c9b8; border-radius: 6px; padding: 8px 10px; background: #fafcfa; margin-bottom: 8px; font-size: 0.6rem; line-height: 1.4; text-align: center; }
    .tax-box strong { color: #2e7d32; display: block; margin-top: 4px; font-size: inherit; }
    .footer-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 8px; text-align: left; font-size: 0.58rem; color: rgba(31,42,68,0.75); line-height: 1.4; }
    .footer-row .contact { flex: 1; min-width: 0; }
    .footer-row .qr-block { flex-shrink: 0; text-align: center; }
    .footer-row img.qr { width: 64px; height: 64px; object-fit: contain; display: block; }
    .footer-row .qr-hint { font-size: 0.55rem; color: rgba(31,42,68,0.55); margin-top: 2px; }
    .closing { text-align: center; padding-top: 6px; border-top: 1px solid #eaf7ea; font-size: 0.62rem; line-height: 1.35; }
    .closing .bold { font-weight: 800; color: #1b5e20; display: block; margin-top: 2px; }
    .sig { font-size: 0.55rem; color: rgba(31,42,68,0.45); margin-top: 4px; }
    .test-banner { background: #fff8e1; color: #6d4c00; padding: 4px 8px; border-radius: 4px; font-size: 0.62rem; margin-bottom: 6px; }
    .fail-msg { color: #b71c1c; font-size: 0.68rem; margin: 0 0 6px; }`;
}

export function receiptDocumentHtml(
  record,
  logoSrc = aadarLogoUrl,
  qrSrc = getReceiptWebsiteQrSrc(),
  { forPdf = false, fontBaseUrl = "" } = {}
) {
  const vm = buildReceiptViewModel(record);
  const { copy } = vm;
  const dr = copy.donorRows;
  const dn = copy.donationRows;
  const amountLabels = [dn.amount, dn.amountAlt, dn.amountInWords];
  const resolvedFontBase =
    fontBaseUrl ||
    (typeof window !== "undefined"
      ? `${window.location.origin}${process.env.PUBLIC_URL || ""}`
      : "");

  const safe = {
    logoSrc: escapeHtml(logoSrc),
    qrSrc: escapeHtml(qrSrc),
    orgName: escapeHtml(vm.org.name),
    orgSubtitle: escapeHtml(vm.org.subtitle),
    orgTagline: escapeHtml(vm.org.tagline),
    org80G: escapeHtml(vm.org.registration80G),
    receiptNo: escapeHtml(vm.receiptNo),
    date: escapeHtml(vm.date),
    paymentMode: escapeHtml(vm.paymentMode),
    paymentStatus: escapeHtml(vm.paymentStatus),
    donorName: escapeHtml(vm.donorName),
    orgAddress: escapeHtml(vm.org.address),
    orgEmail: escapeHtml(vm.org.email),
    orgPhone: escapeHtml(vm.org.phone),
    orgPan: escapeHtml(vm.org.pan),
  };

  const donorTable = detailTableHtml(
    copy.donorTableTitle,
    [
      [dr.name, vm.donorName],
      [dr.fatherHusband, vm.fatherOrHusbandName],
      [dr.email, vm.email],
      [dr.mobile, vm.mobile],
      [dr.pan, vm.pan],
      [dr.address, vm.donorAddress],
    ],
    amountLabels
  );

  const donationTable = detailTableHtml(
    copy.donationTableTitle,
    [
      [dn.amountAlt, vm.amountFormatted],
      [dn.transactionId, vm.paymentId],
      [dn.orderId, vm.orderId],
      [dn.purpose || dn.receiptFor, vm.purpose || vm.receiptFor],
      [dn.modeOfTransaction || copy.meta.payment, vm.paymentMode],
      [dn.amountInWords, vm.amountWords],
    ],
    amountLabels
  );

  const testBanner = vm.testMode ? `<p class="test-banner">${escapeHtml(copy.testBanner)}</p>` : "";

  const failBlock =
    !vm.isSuccess && vm.errorDescription
      ? `<p class="fail-msg">${escapeHtml(vm.errorDescription)}</p>`
      : "";

  return `<!DOCTYPE html>
<html lang="${vm.locale}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(copy.htmlTitle(vm.org.name))}</title>
  <style>
    ${receiptDocumentStyles(forPdf, { locale: vm.locale, fontBaseUrl: resolvedFontBase })}
    @media (max-width: 600px) {
      table.meta td { display: block; width: 50%; float: left; }
      table.tables, table.tables tbody, table.tables tr, table.tables td { display: block; width: 100%; }
      table.tables td + td { margin-top: 8px; }
    }
    @media print {
      @page { size: A4; margin: 8mm; }
      body { padding: 0; }
      .sheet { border: none; border-radius: 0; max-width: none; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <img class="watermark" src="${safe.logoSrc}" alt="" />
    <div class="inner${forPdf ? " pdf-body" : ""}">
      ${buildReceiptHeaderHtml({
        org: {
          name: safe.orgName,
          subtitle: safe.orgSubtitle,
          tagline: safe.orgTagline,
        },
        title: escapeHtml(copy.title),
        logoSrc: safe.logoSrc,
        logoAlt: safe.orgName,
        forPdf,
      })}
      ${testBanner}
      ${failBlock}
      ${buildReceiptHtmlBody({ copy, vm, safe, donorTable, donationTable, forPdf })}
    </div>
  </div>
</body>
</html>`;
}

function buildReceiptBlob(record) {
  return new Blob([receiptDocumentHtml(record)], { type: "text/html;charset=utf-8" });
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.style.cssText = "position:fixed;left:-9999px;top:-9999px;";
  document.body.appendChild(a);
  a.click();
  window.setTimeout(() => {
    if (a.parentNode) document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1500);
}

function drawChevronBanner(doc, x, y, w, h) {
  const tip = Math.min(4.2, h * 0.65);
  doc.setFillColor(27, 94, 32);
  doc.lines(
    [
      [tip, -h / 2],
      [w - tip * 2, 0],
      [tip, h / 2],
      [-tip, h / 2],
      [-(w - tip * 2), 0],
      [-tip, -h / 2],
    ],
    x,
    y + h / 2,
    [1, 1],
    "F",
    true
  );
}

function drawTaglineRow(doc, text, y, margin, contentW, centerX, locale) {
  const label = pdfSafeText(String(text || "").toUpperCase(), locale);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  const textW = doc.getTextWidth(label);
  const pillH = 5.4;
  const pillW = Math.min(contentW - 24, textW + 8);
  const pillX = centerX - pillW / 2;
  const midY = y + pillH / 2;

  doc.setDrawColor(46, 125, 50);
  doc.setLineWidth(0.35);
  doc.setLineDashPattern([0.3, 0.75], 0);
  doc.line(margin, midY, pillX - 1.8, midY);
  doc.line(pillX + pillW + 1.8, midY, margin + contentW, midY);
  doc.setLineDashPattern([], 0);

  doc.setLineWidth(0.35);
  doc.roundedRect(pillX, y, pillW, pillH, pillH / 2, pillH / 2, "S");
  doc.setTextColor(27, 94, 32);
  const fitted = doc.splitTextToSize(label, pillW - 4);
  doc.text(fitted, centerX, y + 3.6, { align: "center" });
  return y + pillH;
}

function drawPdfTable(doc, x, w, title, rows, startY, locale, amountLabels) {
  const headH = 6.4;
  let cy = startY;

  doc.setFillColor(27, 94, 32);
  doc.rect(x, cy, w, headH, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(pdfSafeText(title, locale), x + w / 2, cy + 4.2, { align: "center" });
  cy += headH;

  rows.forEach(([label, value], idx) => {
    const valLines = doc.splitTextToSize(pdfSafeText(value, locale), w * 0.52);
    const rowH = Math.max(5.6, valLines.length * 3.3);

    if (idx % 2 === 1) {
      doc.setFillColor(250, 252, 250);
      doc.rect(x, cy, w, rowH, "F");
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(74, 85, 104);
    const labelLines = doc.splitTextToSize(pdfSafeText(label, locale), w * 0.4);
    doc.text(labelLines, x + 1.8, cy + 3.7);
    const isAmount = amountLabels.has(label);
    doc.setTextColor(isAmount ? 46 : 26, isAmount ? 125 : 35, isAmount ? 50 : 64);
    doc.text(valLines, x + w - 1.8, cy + 3.7, { align: "right" });
    cy += rowH;
  });

  doc.setDrawColor(200, 212, 200);
  doc.setLineWidth(0.25);
  doc.rect(x, startY, w, cy - startY);
  return cy + 1;
}

function drawPdfMetaGrid(doc, vm, startY, margin, contentW) {
  const loc = vm.locale;
  const m = vm.copy.meta;
  const boxH = 16;
  doc.setFillColor(246, 250, 246);
  doc.roundedRect(margin, startY, contentW, boxH, 1.6, 1.6, "F");

  const cells = [
    [m.receiptNo, vm.receiptNo, true],
    [m.date, vm.date, false],
    [m.payment, vm.paymentMode, false],
    [m.status, vm.paymentStatus, !!vm.isSuccess],
  ];
  const colW = contentW / 4;
  cells.forEach(([label, value, green], i) => {
    const cx = margin + colW * i + colW / 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(74, 85, 104);
    doc.text(pdfSafeText(label, loc), cx, startY + 5.2, { align: "center" });
    doc.setFontSize(8);
    doc.setTextColor(green ? 46 : 26, green ? 125 : 35, green ? 50 : 64);
    const lines = doc.splitTextToSize(pdfSafeText(value, loc), colW - 4);
    doc.text(lines.slice(0, 2), cx, startY + 9.4, { align: "center" });
  });
  return startY + boxH;
}

function drawTaxBox(doc, vm, x, y, w) {
  const loc = vm.locale;
  const { copy } = vm;
  const innerW = w - 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const notice = doc.splitTextToSize(pdfSafeText(copy.taxNotice, loc), innerW);
  const greenLines = [copy.reg80g(vm.org.registration80G), copy.fundsNotice, copy.fcraNotice].map(
    (line) => doc.splitTextToSize(pdfSafeText(line, loc), innerW)
  );
  const noticeH = notice.length * 3.4;
  const greenH = greenLines.reduce((sum, lines) => sum + lines.length * 3.6, 0);
  const boxH = 6 + noticeH + 2 + greenH + 2;

  doc.setDrawColor(168, 188, 168);
  doc.setFillColor(246, 250, 246);
  doc.setLineWidth(0.35);
  doc.setLineDashPattern([0.9, 0.65], 0);
  doc.roundedRect(x, y, w, boxH, 1.5, 1.5, "FD");
  doc.setLineDashPattern([], 0);

  doc.setTextColor(26, 35, 64);
  doc.text(notice, x + w / 2, y + 5, { align: "center" });
  let ty = y + 5 + noticeH + 2.2;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(46, 125, 50);
  greenLines.forEach((lines) => {
    doc.text(lines, x + w / 2, ty, { align: "center" });
    ty += lines.length * 3.6;
  });
  return y + boxH;
}

async function getReceiptRenderHtml(record, { forPdf = false } = {}) {
  const logoData = await getLogoDataUrl();
  const qrData = await getReceiptQrDataUrl();
  const fontBaseUrl =
    typeof window !== "undefined" ? `${window.location.origin}${process.env.PUBLIC_URL || ""}` : "";
  return receiptDocumentHtml(record, logoData || aadarLogoUrl, qrData || getReceiptWebsiteQrSrc(), {
    forPdf,
    fontBaseUrl,
  });
}

function waitForReceiptImages(root) {
  const imgs = Array.from(root.querySelectorAll("img"));
  return Promise.all(
    imgs.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        })
    )
  );
}

/** Render receipt HTML to a single-page PDF (Hindi + English). */
async function buildReceiptPdfFromHtml(record) {
  const html = await getReceiptRenderHtml(record, { forPdf: true });
  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "Receipt PDF render");
  iframe.style.cssText =
    "position:fixed;left:-12000px;top:0;width:190mm;height:320mm;border:0;visibility:hidden;";
  document.body.appendChild(iframe);

  try {
    await new Promise((resolve, reject) => {
      iframe.onload = resolve;
      iframe.onerror = reject;
      iframe.srcdoc = html;
    });

    const idoc = iframe.contentDocument;
    const sheet = idoc?.querySelector(".sheet");
    if (!sheet) throw new Error("Receipt layout not found");

    await waitForReceiptImages(sheet);
    if (idoc.fonts && idoc.fonts.ready) {
      await idoc.fonts.ready;
    }
    // Extra beat so Devanagari shaping settles before rasterizing.
    await new Promise((r) => setTimeout(r, 200));

    const canvas = await html2canvas(sheet, {
      scale: HTML2CANVAS_SCALE,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const marginX = 8;
    const marginTop = 6;
    const marginBottom = 6;
    const maxW = pageW - marginX * 2;
    const maxH = pageH - marginTop - marginBottom;
    const pxPerMm = (96 * HTML2CANVAS_SCALE) / 25.4;
    const contentWmm = canvas.width / pxPerMm;
    const contentHmm = canvas.height / pxPerMm;
    const fitScale = Math.min(maxW / contentWmm, maxH / contentHmm, 1);
    const w = contentWmm * fitScale;
    const h = contentHmm * fitScale;
    // Top-align — vertical centering left large empty bands above and below.
    const x = (pageW - w) / 2;
    const y = marginTop;
    const dataUrl = canvas.toDataURL("image/png");
    doc.addImage(dataUrl, "PNG", x, y, w, h);
    return doc;
  } finally {
    if (iframe.parentNode) document.body.removeChild(iframe);
  }
}

/** Vector fallback that follows the official HTML receipt. Helvetica cannot draw ₹ or Devanagari. */
async function buildReceiptPdfVector(record) {
  const vm = buildReceiptViewModel(record);
  const { copy } = vm;
  const loc = vm.locale;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentW = pageW - margin * 2;
  const centerX = pageW / 2;
  const borderX = 8;
  const borderTop = 7;
  let y = 12;

  const logoSize = RECEIPT_PDF_LOGO_MM;
  const logoData = await getLogoDataUrl();
  if (logoData) {
    doc.addImage(
      logoData,
      "JPEG",
      centerX - logoSize / 2,
      y,
      logoSize,
      logoSize,
      undefined,
      "FAST"
    );
    doc.setDrawColor(46, 125, 50);
    doc.setLineWidth(0.7);
    doc.circle(centerX, y + logoSize / 2, logoSize / 2 + 0.15, "S");
    y += logoSize + 4;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(27, 94, 32);
  doc.text(pdfSafeText(vm.org.name, loc), centerX, y + 2, { align: "center" });
  y += 7;
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 95);
  doc.text(pdfSafeText(vm.org.subtitle, loc), centerX, y, { align: "center" });
  y += 4;

  y = drawTaglineRow(doc, vm.org.tagline, y, margin, contentW, centerX, loc) + 3;

  const bannerH = 8;
  drawChevronBanner(doc, margin, y, contentW, bannerH);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(pdfSafeText(copy.title, loc), centerX, y + 5.2, { align: "center" });
  y += bannerH + 3.5;

  if (vm.testMode) {
    const bannerLines = doc.splitTextToSize(pdfSafeText(copy.testBanner, loc), contentW - 8);
    const testH = 4 + bannerLines.length * 3.4;
    doc.setFillColor(255, 248, 225);
    doc.roundedRect(margin, y, contentW, testH, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(109, 76, 0);
    doc.text(bannerLines, centerX, y + 4, { align: "center" });
    y += testH + 2.5;
  }

  y = drawPdfMetaGrid(doc, vm, y, margin, contentW) + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(26, 35, 64);
  const thanks = copy.thanks(vm.donorName);
  const thanksLines = doc.splitTextToSize(pdfSafeText(thanks, loc), contentW - 4);
  doc.text(thanksLines, centerX, y, { align: "center" });
  y += thanksLines.length * 3.6 + 1.5;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(74, 85, 104);
  const subLines = doc.splitTextToSize(pdfSafeText(copy.thanksSub, loc), contentW - 4);
  doc.text(subLines, centerX, y, { align: "center" });
  y += subLines.length * 3.4 + 3;

  const dr = copy.donorRows;
  const dn = copy.donationRows;
  const amountLabels = new Set([dn.amount, dn.amountAlt, dn.amountInWords, dn.inWords]);
  const donorRows = [
    [dr.name, vm.donorName],
    [dr.fatherHusband, vm.fatherOrHusbandName],
    [dr.email, vm.email],
    [dr.mobile, vm.mobile],
    [dr.pan, vm.pan],
    [dr.address, vm.donorAddress],
  ];
  const donationRows = [
    [dn.amountAlt, vm.amountFormattedPdf],
    [dn.transactionId, vm.paymentId],
    [dn.orderId, vm.orderId],
    [dn.purpose || dn.receiptFor, vm.purpose || vm.receiptFor],
    [dn.modeOfTransaction || copy.meta.payment, vm.paymentMode],
    [dn.amountInWords, vm.amountWords],
  ];

  const gap = 4;
  const colW = (contentW - gap) / 2;
  const tableTop = y;
  const leftEnd = drawPdfTable(
    doc,
    margin,
    colW,
    copy.donorTableTitle,
    donorRows,
    tableTop,
    loc,
    amountLabels
  );
  const rightEnd = drawPdfTable(
    doc,
    margin + colW + gap,
    colW,
    copy.donationTableTitle,
    donationRows,
    tableTop,
    loc,
    amountLabels
  );
  y = Math.max(leftEnd, rightEnd) + 3;

  y = drawTaxBox(doc, vm, margin, y, contentW) + 4;

  const footerTop = y;
  const qrSize = 18;
  const qrX = margin + contentW - qrSize;
  const textColW = contentW - qrSize - 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(26, 35, 64);
  const addr = doc.splitTextToSize(pdfSafeText(vm.org.address, loc), textColW);
  doc.text(addr, margin, footerTop + 3);
  let textY = footerTop + 3 + addr.length * 3.2;
  [
    `${copy.contact.email}: ${vm.org.email}`,
    `${copy.contact.phone}: ${vm.org.phone}`,
    `${copy.contact.pan}: ${vm.org.pan}`,
  ].forEach((line) => {
    doc.text(pdfSafeText(line, loc), margin, textY);
    textY += 3.4;
  });

  const qrData = await getReceiptQrDataUrl();
  if (qrData) {
    doc.addImage(qrData, "PNG", qrX, footerTop, qrSize, qrSize, undefined, "FAST");
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(74, 85, 104);
  const hintLines = doc.splitTextToSize(pdfSafeText(vm.qrHint, loc), qrSize + 6);
  doc.text(hintLines, qrX + qrSize / 2, footerTop + qrSize + 3.2, { align: "center" });
  y = Math.max(textY, footerTop + qrSize + 3.2 + hintLines.length * 2.8) + 2;

  doc.setDrawColor(220, 239, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentW, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(26, 35, 64);
  const close1 = doc.splitTextToSize(pdfSafeText(copy.closing1, loc), contentW - 6);
  doc.text(close1, centerX, y, { align: "center" });
  y += close1.length * 3.6 + 1;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(27, 94, 32);
  const close2 = doc.splitTextToSize(pdfSafeText(copy.closing2, loc), contentW - 6);
  doc.text(close2, centerX, y, { align: "center" });
  y += close2.length * 3.6 + 1.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(74, 85, 104);
  const sig = doc.splitTextToSize(pdfSafeText(copy.signature, loc), contentW - 6);
  doc.text(sig, centerX, y, { align: "center" });
  y += sig.length * 3.2 + 3;

  doc.setDrawColor(197, 216, 197);
  doc.setLineWidth(0.45);
  doc.roundedRect(borderX, borderTop, pageW - borderX * 2, y - borderTop, 1.2, 1.2, "S");

  return doc;
}

/** Build donation receipt PDF (single A4 page). */
export async function buildReceiptPdf(record) {
  try {
    return await buildReceiptPdfFromHtml(record);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("buildReceiptPdfFromHtml:", err);
    }
    // jsPDF/Helvetica mangles Devanagari conjuncts — never use vector for Hindi.
    if (record && record.locale === "hi") {
      throw err;
    }
    return buildReceiptPdfVector(record);
  }
}

function filenameFromDisposition(header, fallback) {
  const match = /filename="([^"]+)"/.exec(String(header || ""));
  return match && match[1] ? match[1] : fallback;
}

/**
 * Download the same PDF that is attached to the receipt email.
 * @returns {Promise<'pdf' | false>}
 */
export async function downloadReceiptPdf(record) {
  if (!record || record.verified !== true) return false;

  try {
    const res = await fetch(getApiUrl("/api/donation-receipt-pdf"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/pdf" },
      body: JSON.stringify({ record }),
    });
    if (!res.ok) throw new Error(`Receipt PDF request failed (${res.status})`);
    const blob = await res.blob();
    if (!blob || blob.size < 200) throw new Error("Generated PDF is empty");
    const filename = filenameFromDisposition(
      res.headers.get("Content-Disposition"),
      `${receiptFilename(record)}.pdf`
    );
    triggerDownload(blob, filename);
    return "pdf";
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("downloadReceiptPdf:", err);
    }
    return false;
  }
}

export function downloadReceiptHtml(record) {
  try {
    triggerDownload(buildReceiptBlob(record), `${receiptFilename(record)}.html`);
    return true;
  } catch {
    return false;
  }
}

export async function printReceiptViaIframe(record) {
  try {
    const html = await getReceiptRenderHtml(record);
    const iframe = document.createElement("iframe");
    iframe.setAttribute("title", "Donation receipt print");
    iframe.style.cssText =
      "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
    document.body.appendChild(iframe);

    let printed = false;
    const runPrint = () => {
      if (printed) return;
      printed = true;
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        window.setTimeout(() => {
          if (iframe.parentNode) document.body.removeChild(iframe);
        }, 2000);
      }
    };

    iframe.onload = runPrint;
    iframe.srcdoc = html;
    window.setTimeout(runPrint, 800);
    return true;
  } catch {
    return false;
  }
}

export async function openReceiptPrintWindow(record) {
  try {
    const blob = buildReceiptBlob(record);
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) {
      URL.revokeObjectURL(url);
      return printReceiptViaIframe(record);
    }
    const cleanup = () => URL.revokeObjectURL(url);
    win.addEventListener("load", () => {
      cleanup();
      win.focus();
      win.print();
    });
    window.setTimeout(cleanup, 60000);
    return true;
  } catch {
    return printReceiptViaIframe(record);
  }
}

export { receiptFilename, buildReceiptViewModel };
