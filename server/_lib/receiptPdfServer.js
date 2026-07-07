/**
 * Server-side donation receipt PDF — mirrors src/utils/donationReceipt.js buildReceiptPdfVector
 * (same layout as the success-page PDF fallback: logo, QR, tables, 80G notice).
 */

const fs = require("fs");
const path = require("path");
const { jsPDF } = require("jspdf");
const { donationRowToReceiptRecord } = require("./receiptRecord");
const { buildReceiptViewModel } = require("./receiptFormatServer");
const { buildReceiptDocumentHtml } = require("./receiptHtmlServer");
const { renderHtmlToPdfBuffer } = require("./receiptPdfFromHtml");

const RECEIPT_PDF_LOGO_MM = 18;

function pdfSafeText(value, locale = "en") {
  let s = String(value ?? "")
    .replace(/\u20B9/g, "Rs.")
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u00A0/g, " ");
  if (locale === "hi") {
    return s.replace(/[^\u0020-\u007E\u00A0-\u00FF\u0900-\u097F]/g, "");
  }
  return s.replace(/[^\u0020-\u007E\u00A0-\u00FF]/g, "");
}

function readAssetBase64(relativePath) {
  const candidates = [
    path.join(__dirname, "../../src/assets/images", relativePath),
    path.join(__dirname, "../../public/assets/images", relativePath),
  ];
  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath);
      }
    } catch {
      /* try next */
    }
  }
  return null;
}

function readLogoDataUrl() {
  const buf = readAssetBase64("logos/logo-aadar.jpg");
  return buf ? `data:image/jpeg;base64,${buf.toString("base64")}` : null;
}

function readQrDataUrl() {
  const buf = readAssetBase64("receipt-website-qr.png");
  return buf ? `data:image/png;base64,${buf.toString("base64")}` : null;
}

function receiptFilename(record) {
  const id = (record.paymentId || record.receiptNo || record.orderId || "donation").replace(
    /[^a-zA-Z0-9_-]/g,
    ""
  );
  return `aadar-donation-receipt-${id}.pdf`;
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

/**
 * Build vector PDF matching the client success-page receipt (buildReceiptPdfVector).
 */
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

  const logoData = readLogoDataUrl();
  if (logoData) {
    doc.addImage(
      logoData,
      "JPEG",
      centerX - RECEIPT_PDF_LOGO_MM / 2,
      y,
      RECEIPT_PDF_LOGO_MM,
      RECEIPT_PDF_LOGO_MM,
      undefined,
      "FAST"
    );
    y += RECEIPT_PDF_LOGO_MM + 2;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(27, 94, 32);
  doc.text(pdfSafeText(vm.org.name, loc), centerX, y + 4, { align: "center" });
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 95);
  doc.text(pdfSafeText(vm.org.subtitle, loc), centerX, y + 9, { align: "center" });
  y += 13;

  doc.setFontSize(6.5);
  doc.setTextColor(27, 94, 32);
  doc.text(pdfSafeText(vm.org.tagline.toUpperCase(), loc), centerX, y + 2, { align: "center" });
  y += 6;

  doc.setFillColor(27, 94, 32);
  doc.rect(margin, y, contentW, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(pdfSafeText(copy.title, loc), centerX, y + 4.8, { align: "center" });
  y += 11;

  if (vm.testMode) {
    doc.setFontSize(6);
    doc.setTextColor(109, 76, 0);
    doc.text(pdfSafeText(copy.testBanner, loc), centerX, y, { align: "center" });
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
    margin + colW + 6,
    colW,
    copy.donationTableTitle,
    donationRows,
    tableTop,
    loc,
    amountLabels
  );
  y = Math.max(leftEnd, rightEnd) + 3;

  const taxH = 22;
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
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5);
  doc.setTextColor(90, 107, 138);
  const fcraLines = doc.splitTextToSize(pdfSafeText(copy.fcraNotice, loc), contentW - 8);
  doc.text(fcraLines, centerX, y + 15, { align: "center" });
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

  const qrData = readQrDataUrl();
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
  doc.text(pdfSafeText(copy.closing2, loc), centerX, y, { align: "center" });
  y += 3.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5);
  doc.setTextColor(120, 130, 150);
  doc.text(pdfSafeText(copy.signaturePdf, loc), centerX, y, { align: "center" });

  return doc;
}

/**
 * Build donation receipt PDF buffer (same content as success-page download).
 * Prefers HTML→PDF (official layout); falls back to vector PDF if Chrome unavailable.
 * @returns {Promise<{ buffer: Buffer, filename: string, source: 'html' | 'vector' }>}
 */
async function buildReceiptPdfBuffer(input, options = {}) {
  const record =
    input && input.payment_id ? donationRowToReceiptRecord(input, options) : input;
  if (!record) throw new Error("Missing receipt record");

  const filename = receiptFilename(record);

  try {
    const html = buildReceiptDocumentHtml(record);
    const buffer = await renderHtmlToPdfBuffer(html);
    if (buffer && buffer.length > 500) {
      return { buffer, filename, source: "html" };
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[receipt-pdf] HTML render failed, using vector fallback:", err.message);
  }

  const doc = await buildReceiptPdfVector(record);
  const arrayBuffer = doc.output("arraybuffer");
  return {
    buffer: Buffer.from(arrayBuffer),
    filename,
    source: "vector",
  };
}

module.exports = {
  buildReceiptPdfBuffer,
};
