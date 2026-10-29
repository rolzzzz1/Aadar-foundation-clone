/**
 * Server-side HTML receipt — mirrors src/utils/donationReceipt.js receiptDocumentHtml
 * so email PDFs match the success-page download.
 */

const fs = require("fs");
const path = require("path");
const { buildReceiptViewModel } = require("./receiptFormatServer");
const { getReceiptCopy } = require("./receiptI18nServer");

const receiptHeaderCss = `
    .receipt-header { margin-bottom: 10px; }
    .receipt-header-brand { display: flex; flex-direction: column; align-items: center; gap: 3px; margin-bottom: 8px; }
    .receipt-header-brand .receipt-logo { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid #2e7d32; box-shadow: 0 2px 8px rgba(27, 94, 32, 0.12); }
    .receipt-header-brand .receipt-org-name { margin: 0; font-size: 1.45rem; font-weight: 800; color: #1b5e20; line-height: 1.15; letter-spacing: 0.01em; }
    .receipt-header-brand .receipt-org-sub { margin: 0; font-size: 0.92rem; font-weight: 700; color: #1e3a5f; line-height: 1.2; }
    .receipt-reg-row { display: flex; align-items: center; gap: 8px; width: 100%; margin-bottom: 10px; padding: 0 4px; }
    .receipt-reg-dots { flex: 1; border-top: 2px dotted #2e7d32; opacity: 0.55; min-width: 16px; }
    .receipt-reg-pill { flex-shrink: 0; border: 1.5px solid #2e7d32; border-radius: 999px; padding: 4px 14px; font-size: 0.6rem; font-weight: 700; color: #1b5e20; letter-spacing: 0.05em; text-transform: uppercase; line-height: 1.25; text-align: center; }
    .receipt-title-banner { background: #1b5e20; color: #fff; text-align: center; padding: 7px 28px; font-size: 0.85rem; font-weight: 800; letter-spacing: 0.14em; line-height: 1.2; clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0 50%); }
    .receipt-header.pdf-header .receipt-logo { width: 90px; height: 90px; }
    .receipt-header.pdf-header .receipt-org-name { font-size: 1.55rem; }
    .receipt-header.pdf-header .receipt-org-sub { font-size: 0.98rem; }
    .receipt-header.pdf-header .receipt-reg-pill { font-size: 0.64rem; padding: 5px 16px; }
    .receipt-header.pdf-header .receipt-title-banner { font-size: 0.92rem; padding: 8px 32px; }`;

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

function readLogoBuffer() {
  return readAssetBase64("logos/logo-aadar.jpg");
}

function readLogoDataUrl() {
  const buf = readLogoBuffer();
  return buf ? `data:image/jpeg;base64,${buf.toString("base64")}` : "";
}

function readQrDataUrl() {
  const buf = readAssetBase64("receipt-website-qr.png");
  return buf ? `data:image/png;base64,${buf.toString("base64")}` : "";
}

function buildReceiptHeaderHtml({ org, title, logoSrc, logoAlt, forPdf = false }) {
  const pdfClass = forPdf ? " receipt-header pdf-header" : "";
  const logoBlock = logoSrc
    ? `<img class="receipt-logo" src="${logoSrc}" alt="${logoAlt || org.name}" />`
    : "";

  return `
    <header class="receipt-header${pdfClass}">
      <div class="receipt-header-brand">
        ${logoBlock}
        <h1 class="receipt-org-name">${org.name}</h1>
        <p class="receipt-org-sub">${org.subtitle}</p>
      </div>
      <div class="receipt-reg-row">
        <span class="receipt-reg-dots" aria-hidden="true"></span>
        <span class="receipt-reg-pill">${org.tagline}</span>
        <span class="receipt-reg-dots" aria-hidden="true"></span>
      </div>
      <div class="receipt-title-banner">${title}</div>
    </header>`;
}

function receiptDocumentStyles() {
  return `
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; width: 190mm; font-family: "Segoe UI", Lato, "Noto Sans Devanagari", Helvetica, Arial, sans-serif; color: #1a2340; background: #fff; font-size: 11px; line-height: 1.35; }
    .sheet { width: 190mm; max-width: 190mm; margin: 0; background: #fff; border: 1px solid #c5d8c5; border-radius: 4px; overflow: hidden; position: relative; }
    .watermark { display: none; }
    .inner.pdf-body { display: block; padding: 14px 16px 16px; text-align: center; }
    .inner.pdf-body > * { margin: 0 0 11px; }
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
    .footer-row img.qr { width: 52px; height: 52px; object-fit: contain; display: block; margin: 0 auto; }
    .footer-row .qr-hint { font-size: 0.62rem; color: #4a5568; margin-top: 4px; font-weight: 600; line-height: 1.2; max-width: 72px; }
    .closing { padding-top: 10px; border-top: 1px solid #dcefdc; font-size: 0.72rem; line-height: 1.38; color: #1a2340; }
    .closing .bold { font-weight: 800; color: #1b5e20; display: block; margin-top: 4px; }
    .sig { font-size: 0.64rem; color: #4a5568; margin-top: 6px; line-height: 1.3; }
    .test-banner { background: #fff8e1; color: #6d4c00; padding: 6px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; line-height: 1.35; }
    html[lang="hi"] .detail-table th, html[lang="hi"] .detail-table td { font-size: 0.64rem; }
    html[lang="hi"] .thanks, html[lang="hi"] .pdf-thanks .thanks { font-size: 0.74rem; }
    html[lang="hi"] .tax-box { font-size: 0.66rem; }`;
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

function buildReceiptHtmlBody({ copy, vm, safe, donorTable, donationTable }) {
  return `
      <table class="meta" role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <span class="meta-label">${escapeHtml(copy.meta.receiptNo)}</span>
            <span class="meta-value green">${safe.receiptNo}</span>
          </td>
          <td>
            <span class="meta-label">${escapeHtml(copy.meta.date)}</span>
            <span class="meta-value">${safe.date}</span>
          </td>
          <td>
            <span class="meta-label">${escapeHtml(copy.meta.payment)}</span>
            <span class="meta-value">${safe.paymentMode}</span>
          </td>
          <td>
            <span class="meta-label">${escapeHtml(copy.meta.status)}</span>
            <span class="meta-value green">${safe.paymentStatus}</span>
          </td>
        </tr>
      </table>
      <div class="pdf-thanks">
        <p class="thanks">${escapeHtml(copy.thanks(vm.donorName))}</p>
        <em class="thanks">${escapeHtml(copy.thanksSub)}</em>
      </div>
      <table class="tables" role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td>${donorTable}</td>
          <td>${donationTable}</td>
        </tr>
      </table>
      <div class="tax-box">
        ${escapeHtml(copy.taxNotice)}
        <strong>${escapeHtml(copy.reg80g(vm.org.registration80G))}</strong>
        <strong>${escapeHtml(copy.fundsNotice)}</strong>
        <strong>${escapeHtml(copy.fcraNotice)}</strong>
      </div>
      <table class="footer-row" role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td class="contact">
            ${safe.orgAddress}<br />
            ${escapeHtml(copy.contact.email)}: ${safe.orgEmail}<br />
            ${escapeHtml(copy.contact.phone)}: ${safe.orgPhone}<br />
            ${escapeHtml(copy.contact.pan)}: ${safe.orgPan}
          </td>
          <td class="qr-block">
            <img class="qr" src="${safe.qrSrc}" alt="${escapeHtml(vm.qrHint)}" />
            <div class="qr-hint">${escapeHtml(vm.qrHint)}</div>
          </td>
        </tr>
      </table>
      <div class="closing">
        <div>${escapeHtml(copy.closing1)}</div>
        <div class="bold">${escapeHtml(copy.closing2)}</div>
        <div class="sig">${escapeHtml(copy.signature)}</div>
      </div>`;
}

/**
 * Build full HTML receipt document (same layout as success-page download).
 */
function buildReceiptDocumentHtml(record) {
  const vm = buildReceiptViewModel(record);
  const copy = getReceiptCopy(vm.locale);
  const dr = copy.donorRows;
  const dn = copy.donationRows;
  const amountLabels = [dn.amount, dn.amountAlt, dn.amountInWords];

  const logoSrc = readLogoDataUrl();
  const qrSrc = readQrDataUrl();

  const safe = {
    logoSrc: escapeHtml(logoSrc),
    qrSrc: escapeHtml(qrSrc),
    orgName: escapeHtml(vm.org.name),
    orgSubtitle: escapeHtml(vm.org.subtitle),
    orgTagline: escapeHtml(vm.org.tagline),
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
  const htmlTitle = copy.htmlTitle ? copy.htmlTitle(vm.org.name) : "Donation Receipt";

  return `<!DOCTYPE html>
<html lang="${vm.locale}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(htmlTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    ${receiptDocumentStyles()}
    @page { size: A4; margin: 8mm; }
  </style>
</head>
<body>
  <div class="sheet">
    <img class="watermark" src="${safe.logoSrc}" alt="" />
    <div class="inner pdf-body">
      ${buildReceiptHeaderHtml({
        org: {
          name: safe.orgName,
          subtitle: safe.orgSubtitle,
          tagline: safe.orgTagline,
        },
        title: escapeHtml(copy.title),
        logoSrc: safe.logoSrc,
        logoAlt: safe.orgName,
        forPdf: true,
      })}
      ${testBanner}
      ${buildReceiptHtmlBody({ copy, vm, safe, donorTable, donationTable })}
    </div>
  </div>
</body>
</html>`;
}

module.exports = {
  buildReceiptDocumentHtml,
  readLogoDataUrl,
  readLogoBuffer,
};
