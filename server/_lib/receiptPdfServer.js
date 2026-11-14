/**
 * Server-side donation receipt PDF.
 * Primary output is the HTML layout (Receipt Demo.pdf). Vector drawing is only a fallback
 * and follows that same official layout.
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
  const greenLines = [
    copy.reg80g(vm.org.registration80G),
    copy.fundsNotice,
    copy.fcraNotice,
  ].map((line) => doc.splitTextToSize(pdfSafeText(line, loc), innerW));
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

/**
 * Vector fallback that follows the official HTML receipt (Receipt Demo.pdf).
 * Helvetica cannot draw the rupee sign or Devanagari, so amounts use "Rs."
 */
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

  const logoData = readLogoDataUrl();
  if (logoData) {
    const logoSize = RECEIPT_PDF_LOGO_MM;
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
  const contactLines = [
    `${copy.contact.email}: ${vm.org.email}`,
    `${copy.contact.phone}: ${vm.org.phone}`,
    `${copy.contact.pan}: ${vm.org.pan}`,
  ];
  contactLines.forEach((line) => {
    doc.text(pdfSafeText(line, loc), margin, textY);
    textY += 3.4;
  });

  const qrData = readQrDataUrl();
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

/**
 * Build donation receipt PDF buffer in the official HTML layout (Receipt Demo.pdf).
 * Vector PDF is used only when HTML rendering fails.
 * @returns {Promise<{ buffer: Buffer, filename: string, source: 'html' | 'vector' }>}
 */
async function buildReceiptPdfBuffer(input, options = {}) {
  const record =
    input && input.payment_id ? donationRowToReceiptRecord(input, options) : input;
  if (!record) throw new Error("Missing receipt record");

  const filename = receiptFilename(record);
  const isHi = record.locale === "hi";
  const forceVector = options.forceVector === true;
  const preferHtml = !forceVector;

  if (!forceVector && preferHtml) {
    try {
      const html = buildReceiptDocumentHtml(record);
      const buffer = await renderHtmlToPdfBuffer(html);
      if (buffer && buffer.length > 500) {
        return { buffer, filename, source: "html" };
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[receipt-pdf] HTML render failed, using vector fallback:", err.message);
      if (isHi) {
        // eslint-disable-next-line no-console
        console.warn(
          "[receipt-pdf] Hindi PDF fell back to vector — Devanagari glyphs may be incorrect"
        );
      }
    }
  }

  const doc = await buildReceiptPdfVector(record);
  const arrayBuffer = doc.output("arraybuffer");
  return {
    buffer: Buffer.from(arrayBuffer),
    filename,
    source: "vector",
  };
}

/**
 * The PDF attached to the receipt email. Downloads use this same builder.
 * HTML layout first; the vector file is only used if that render fails.
 */
async function buildOfficialReceiptPdf(record) {
  let buffer;
  let filename;
  let source;
  try {
    ({ buffer, filename, source } = await Promise.race([
      buildReceiptPdfBuffer(record, { preferHtml: true }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("html_pdf_timeout")), 45000);
      }),
    ]));
  } catch (htmlErr) {
    // eslint-disable-next-line no-console
    console.warn(
      "[receipt-pdf] HTML PDF failed, using official vector layout:",
      htmlErr && htmlErr.message ? htmlErr.message : htmlErr
    );
    ({ buffer, filename, source } = await buildReceiptPdfBuffer(record, { forceVector: true }));
  }

  if (!buffer || buffer.length < 200) {
    throw new Error("PDF attachment build failed: empty PDF buffer");
  }

  return { buffer, filename, source };
}

module.exports = {
  buildReceiptPdfBuffer,
  buildOfficialReceiptPdf,
};
