import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import aadarLogoUrl from "assets/images/logos/logo-aadar.jpg";
import { getReceiptWebsiteQrSrc } from "utils/receiptAssets";
import { buildReceiptViewModel, ORG, formatInr, formatReceiptDate } from "utils/receiptFormat";
import { buildReceiptHtmlBody } from "utils/receiptI18n";

/** Header logo (px) on screen / print preview. */
const RECEIPT_LOGO_PX = 38;
/** Watermark (px) on screen / print preview. */
const RECEIPT_WATERMARK_PX = 88;
/** Header logo (px) in PDF download layout. */
const RECEIPT_PDF_LOGO_PX = 90;
/** Header logo size (mm) in vector PDF fallback. */
const RECEIPT_PDF_LOGO_MM = 11;
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

function receiptDocumentStyles(forPdf) {
  if (forPdf) {
    return `
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; width: 190mm; font-family: "Segoe UI", Lato, "Noto Sans Devanagari", Helvetica, Arial, sans-serif; color: #1a2340; background: #fff; font-size: 11px; line-height: 1.35; }
    .sheet { width: 190mm; max-width: 190mm; margin: 0; background: #fff; border: 1px solid #c5d8c5; border-radius: 4px; overflow: hidden; position: relative; }
    .watermark { display: none; }
    .inner.pdf-body { display: flex; flex-direction: column; align-items: stretch; gap: 11px; padding: 14px 16px 16px; text-align: center; }
    .inner.pdf-body > * { margin: 0; }
    .header-inner { display: flex; flex-direction: column; align-items: center; gap: 5px; flex-shrink: 0; }
    .header-inner img.logo { width: ${RECEIPT_PDF_LOGO_PX}px; height: ${RECEIPT_PDF_LOGO_PX}px; border-radius: 50%; object-fit: cover; border: 2px solid #2e7d32; flex-shrink: 0; }
    .header-inner h1 { font-size: 1rem; line-height: 1.2; color: #1b5e20; font-weight: 800; }
    .header-inner .sub { font-size: 0.82rem; line-height: 1.25; font-weight: 700; color: #1a2340; }
    .header-inner .tag { font-size: 0.72rem; line-height: 1.2; font-weight: 600; color: #2e7d32; }
    .title-pill { align-self: center; background: #1b5e20; color: #fff; padding: 5px 16px; border-radius: 999px; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.07em; }
    .meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px 10px; padding: 10px 10px; background: #f6faf6; border-radius: 6px; text-align: center; }
    .meta label { display: block; font-size: 0.65rem; color: #4a5568; font-weight: 700; margin-bottom: 3px; line-height: 1.2; }
    .meta span { display: block; font-size: 0.76rem; font-weight: 800; word-break: break-word; color: #1a2340; line-height: 1.25; }
    .meta .green { color: #2e7d32; }
    .pdf-thanks { display: flex; flex-direction: column; gap: 4px; text-align: center; }
    .pdf-thanks .thanks { font-size: 0.78rem; line-height: 1.4; color: #1a2340; }
    .pdf-thanks em.thanks { font-size: 0.72rem; color: #4a5568; font-style: italic; }
    .tables { display: flex; gap: 10px; align-items: stretch; }
    .detail-table { flex: 1 1 0; min-width: 0; border: 1px solid #c8d4c8; border-radius: 6px; overflow: hidden; }
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
    .footer-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; text-align: left; font-size: 0.68rem; line-height: 1.4; }
    .footer-row .contact { flex: 1; min-width: 0; font-weight: 600; color: #1a2340; }
    .footer-row .qr-block { flex-shrink: 0; text-align: center; }
    .footer-row img.qr { width: 52px; height: 52px; object-fit: contain; display: block; margin: 0 auto; }
    .footer-row .qr-hint { font-size: 0.62rem; color: #4a5568; margin-top: 4px; font-weight: 600; line-height: 1.2; max-width: 72px; }
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
    * { box-sizing: border-box; }
    body { margin: 0; padding: 8px; font-family: "Segoe UI", Lato, "Noto Sans Devanagari", Helvetica, Arial, sans-serif; color: #1f2a44; background: #fff; font-size: 10px; }
    .sheet { max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid #d5e8d5; border-radius: 8px; overflow: hidden; position: relative; page-break-inside: avoid; }
    .watermark { position: absolute; left: 50%; top: 45%; transform: translate(-50%,-50%); width: ${RECEIPT_WATERMARK_PX}px; opacity: 0.05; pointer-events: none; }
    .inner { position: relative; padding: 12px 14px; text-align: center; }
    .header-inner { display: flex; flex-direction: column; align-items: center; gap: 4px; margin-bottom: 6px; }
    .header-inner img.logo { width: ${RECEIPT_LOGO_PX}px; height: ${RECEIPT_LOGO_PX}px; border-radius: 50%; object-fit: cover; border: 2px solid #2e7d32; }
    .header-inner h1 { margin: 0; font-size: 1rem; color: #1b5e20; }
    .header-inner .sub { margin: 0; font-size: 0.78rem; font-weight: 700; }
    .header-inner .tag { margin: 0; font-size: 0.65rem; font-weight: 600; color: #2e7d32; }
    .title-pill { display: inline-block; background: #1b5e20; color: #fff; padding: 4px 16px; border-radius: 999px; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.1em; margin-bottom: 8px; }
    .meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 8px; text-align: center; }
    .meta label { display: block; font-size: 0.58rem; color: rgba(31,42,68,0.55); font-weight: 600; }
    .meta span { display: block; font-size: 0.68rem; font-weight: 700; word-break: break-word; }
    .meta .green { color: #2e7d32; }
    .thanks { font-size: 0.68rem; line-height: 1.4; margin: 0 0 2px; }
    .thanks em { font-size: 0.62rem; color: rgba(31,42,68,0.65); font-style: italic; display: block; margin-bottom: 8px; }
    .tables { display: flex; gap: 8px; margin-bottom: 8px; }
    .detail-table { flex: 1; border: 1px solid #d8e0d8; border-radius: 6px; overflow: hidden; min-width: 0; }
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
  { forPdf = false } = {}
) {
  const vm = buildReceiptViewModel(record);
  const { copy } = vm;
  const dr = copy.donorRows;
  const dn = copy.donationRows;
  const amountLabels = [dn.amount, dn.amountAlt, dn.amountInWords];

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
    ],
    amountLabels
  );

  const donationTable = detailTableHtml(
    copy.donationTableTitle,
    [
      [dn.amountAlt, vm.amountFormatted],
      [dn.transactionId, vm.paymentId],
      [dn.orderId, vm.orderId],
      [dn.receiptFor, vm.receiptFor],
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
    ${receiptDocumentStyles(forPdf)}
    @media (max-width: 600px) {
      .meta { grid-template-columns: repeat(2, 1fr); }
      .tables { flex-direction: column; }
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
      <div class="header-inner">
        <img class="logo" src="${safe.logoSrc}" alt="${safe.orgName}" />
        <h1>${safe.orgName}</h1>
        <p class="sub">${safe.orgSubtitle}</p>
        <p class="tag">${safe.orgTagline}</p>
      </div>
      <span class="title-pill">${escapeHtml(copy.title)}</span>
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

function drawPdfTable(doc, x, w, title, rows, startY, locale, amountLabels) {
  const headH = 5;
  let cy = startY;

  doc.setFillColor(27, 94, 32);
  doc.rect(x, cy, w, headH, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255);
  doc.text(pdfSafeText(title, locale), x + w / 2, cy + 3.5, { align: "center" });
  cy += headH;

  rows.forEach(([label, value], idx) => {
    const valLines = doc.splitTextToSize(pdfSafeText(value, locale), w * 0.54);
    const rowH = Math.max(4.2, valLines.length * 2.8);

    if (idx % 2 === 1) {
      doc.setFillColor(250, 252, 250);
      doc.rect(x, cy, w, rowH, "F");
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(90, 107, 138);
    doc.text(pdfSafeText(label, locale), x + 1.5, cy + 3);
    doc.setFont("helvetica", "normal");
    const isAmount = amountLabels.has(label);
    doc.setTextColor(isAmount ? 46 : 31, isAmount ? 125 : 42, isAmount ? 50 : 68);
    doc.text(valLines, x + w - 1.5, cy + 3, { align: "right" });
    cy += rowH;
  });

  doc.setDrawColor(216, 224, 216);
  doc.setLineWidth(0.2);
  doc.rect(x, startY, w, cy - startY);
  return cy + 1;
}

function drawPdfMetaGrid(doc, vm, y, margin, contentW) {
  const colW = contentW / 2;
  const left = margin;
  const right = margin + colW;
  const rowH = 9;
  const loc = vm.locale;
  const m = vm.copy.meta;

  const drawPair = (labelL, valL, greenL, labelR, valR, greenR) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    doc.setTextColor(90, 107, 138);
    doc.text(pdfSafeText(labelL, loc), left, y);
    doc.text(pdfSafeText(labelR, loc), right, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(greenL ? 46 : 31, greenL ? 125 : 42, greenL ? 50 : 68);
    doc.text(pdfSafeText(valL, loc), left, y + 3.5);
    doc.setTextColor(greenR ? 46 : 31, greenR ? 125 : 42, greenR ? 50 : 68);
    doc.text(pdfSafeText(valR, loc), right, y + 3.5);
    return y + rowH;
  };

  let cy = drawPair(m.receiptNo, vm.receiptNo, true, m.date, vm.date, false);
  cy = drawPair(m.payment, vm.paymentMode, false, m.status, vm.paymentStatus, true);
  return cy + 1;
}

async function getReceiptRenderHtml(record, { forPdf = false } = {}) {
  const logoData = await getLogoDataUrl();
  const qrData = await getReceiptQrDataUrl();
  return receiptDocumentHtml(record, logoData || aadarLogoUrl, qrData || getReceiptWebsiteQrSrc(), {
    forPdf,
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
    await new Promise((r) => setTimeout(r, 350));

    const sheet = iframe.contentDocument?.querySelector(".sheet");
    if (!sheet) throw new Error("Receipt layout not found");

    await waitForReceiptImages(sheet);

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
    const margin = 10;
    const maxW = pageW - margin * 2;
    const maxH = pageH - margin * 2;
    const pxPerMm = (96 * HTML2CANVAS_SCALE) / 25.4;
    const contentWmm = canvas.width / pxPerMm;
    const contentHmm = canvas.height / pxPerMm;
    const fitScale = Math.min(maxW / contentWmm, maxH / contentHmm, 1);
    const w = contentWmm * fitScale;
    const h = contentHmm * fitScale;
    const y = margin + Math.max(0, (maxH - h) / 2);
    const dataUrl = canvas.toDataURL("image/png");
    doc.addImage(dataUrl, "PNG", (pageW - w) / 2, y, w, h);
    return doc;
  } finally {
    if (iframe.parentNode) document.body.removeChild(iframe);
  }
}

/** Vector PDF fallback (Helvetica; Devanagari may not render). */
async function buildReceiptPdfVector(record) {
  const vm = buildReceiptViewModel(record);
  const { copy } = vm;
  const loc = vm.locale;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 10;
  const pageW = doc.internal.pageSize.getWidth();
  const contentW = pageW - margin * 2;
  const centerX = pageW / 2;
  let y = 8;

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
    y += logoSize + 2;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(27, 94, 32);
  doc.text(pdfSafeText(vm.org.name, loc), centerX, y + 4, { align: "center" });
  doc.setFontSize(8.5);
  doc.setTextColor(31, 42, 68);
  doc.text(pdfSafeText(vm.org.subtitle, loc), centerX, y + 9, { align: "center" });
  doc.setFontSize(7);
  doc.setTextColor(46, 125, 50);
  doc.text(pdfSafeText(vm.org.tagline, loc), centerX, y + 13, { align: "center" });
  y += 17;

  const pillW = Math.min(56, Math.max(48, copy.title.length * 1.8));
  doc.setFillColor(27, 94, 32);
  doc.roundedRect((pageW - pillW) / 2, y, pillW, 6, 3, 3, "F");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(pdfSafeText(copy.title, loc), centerX, y + 4.2, { align: "center" });
  y += 10;

  if (vm.testMode) {
    doc.setFontSize(6);
    doc.setTextColor(109, 76, 0);
    doc.text(pdfSafeText(copy.testBanner, loc), centerX, y, {
      align: "center",
    });
    y += 5;
  }

  y = drawPdfMetaGrid(doc, vm, y, margin, contentW);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(31, 42, 68);
  const thanks = copy.thanks(vm.donorName);
  const thanksLines = doc.splitTextToSize(pdfSafeText(thanks, loc), contentW);
  doc.text(thanksLines, centerX, y, { align: "center" });
  y += thanksLines.length * 3 + 2;
  doc.setFontSize(6);
  doc.setTextColor(90, 107, 138);
  doc.text(pdfSafeText(copy.thanksSub, loc), centerX, y, { align: "center" });
  y += 5;

  const dr = copy.donorRows;
  const dn = copy.donationRows;
  const amountLabels = new Set([dn.amount, dn.amountAlt, dn.amountInWords, dn.inWords]);
  const donorRows = [
    [dr.name, vm.donorName],
    [dr.fatherHusband, vm.fatherOrHusbandName],
    [dr.email, vm.email],
    [dr.mobile, vm.mobile],
    [dr.pan, vm.pan],
  ];
  const donationRows = [
    [dn.amountAlt, vm.amountFormattedPdf],
    [dn.transactionId, vm.paymentId],
    [dn.orderId, vm.orderId],
    [dn.receiptFor, vm.receiptFor],
    [dn.inWords, vm.amountWords],
  ];

  const colW = (contentW - 6) / 2;
  const leftX = margin;
  const tableTop = y;
  const leftEnd = drawPdfTable(
    doc,
    leftX,
    colW,
    copy.donorTableTitle,
    donorRows,
    tableTop,
    loc,
    amountLabels
  );
  const rightEnd = drawPdfTable(
    doc,
    leftX + colW + 6,
    colW,
    copy.donationTableTitle,
    donationRows,
    tableTop,
    loc,
    amountLabels
  );
  y = Math.max(leftEnd, rightEnd) + 3;

  const taxH = 16;
  doc.setDrawColor(184, 201, 184);
  doc.setLineWidth(0.25);
  doc.roundedRect(margin, y, contentW, taxH, 2, 2, "S");
  doc.setFontSize(5.5);
  doc.setTextColor(31, 42, 68);
  const tax = doc.splitTextToSize(pdfSafeText(copy.taxNoticeShort, loc), contentW - 8);
  doc.text(tax, centerX, y + 3.5, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.5);
  doc.setTextColor(46, 125, 50);
  doc.text(pdfSafeText(copy.reg80g(vm.org.registration80G), loc), centerX, y + 8, {
    align: "center",
  });
  doc.text(pdfSafeText(copy.fundsNotice, loc), centerX, y + 11.5, { align: "center" });
  y += taxH + 3;

  const footerTop = y;
  const qrColW = 28;
  const textColW = contentW - qrColW - 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(90, 107, 138);
  const addr = doc.splitTextToSize(pdfSafeText(vm.org.address, loc), textColW);
  doc.text(addr, margin, footerTop + 3);
  let textY = footerTop + 3 + addr.length * 2.8;
  doc.text(pdfSafeText(`${copy.contact.email}: ${vm.org.email}`, loc), margin, textY);
  textY += 3.2;
  doc.text(pdfSafeText(`${copy.contact.phone}: ${vm.org.phone}`, loc), margin, textY);
  textY += 3.2;
  doc.text(pdfSafeText(`${copy.contact.pan}: ${vm.org.pan}`, loc), margin, textY);

  const qrData = await getReceiptQrDataUrl();
  const qrSize = 22;
  const qrX = margin + contentW - qrSize;
  if (qrData) {
    doc.addImage(qrData, "PNG", qrX, footerTop, qrSize, qrSize, undefined, "FAST");
  }
  doc.setFontSize(5);
  doc.text(pdfSafeText(vm.qrHint, loc), qrX + qrSize / 2, footerTop + qrSize + 2.5, {
    align: "center",
  });
  y = footerTop + qrSize + 8;

  doc.setDrawColor(234, 247, 234);
  doc.line(margin, y, margin + contentW, y);
  y += 3;
  doc.setFontSize(6);
  doc.setTextColor(31, 42, 68);
  doc.text(pdfSafeText(copy.closing1, loc), centerX, y, { align: "center" });
  y += 3.5;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(27, 94, 32);
  doc.text(pdfSafeText(copy.closing2, loc), centerX, y, {
    align: "center",
  });
  y += 3.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5);
  doc.setTextColor(120, 130, 150);
  doc.text(pdfSafeText(copy.signaturePdf, loc), centerX, y, { align: "center" });

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
    return buildReceiptPdfVector(record);
  }
}

async function getReceiptPdfBlob(record) {
  const doc = await buildReceiptPdf(record);
  const blob = doc.output("blob");
  if (blob instanceof Blob) {
    return blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" });
  }
  return new Blob([blob], { type: "application/pdf" });
}

/**
 * Download receipt as PDF (English or Hindi).
 * @returns {Promise<'pdf' | false>}
 */
export async function downloadReceiptPdf(record) {
  if (!record) return false;

  try {
    const blob = await getReceiptPdfBlob(record);
    if (!blob || blob.size < 200) throw new Error("Generated PDF is empty");
    triggerDownload(blob, `${receiptFilename(record)}.pdf`);
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
