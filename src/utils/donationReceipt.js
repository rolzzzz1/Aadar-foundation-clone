import { jsPDF } from "jspdf";

import aadarLogoUrl from "assets/images/logos/logo-aadar.jpg";
import { buildReceiptViewModel, ORG, formatInr, formatReceiptDate } from "utils/receiptFormat";

export { ORG, formatInr, formatReceiptDate as formatDate };

let logoDataUrlPromise = null;

const RECEIPT_FUNDS_NOTICE = "This receipt is valid subject to realization of funds.";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pdfSafeText(value) {
  return String(value ?? "")
    .replace(/\u20B9/g, "Rs.")
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/[^\u0020-\u007E\u00A0-\u00FF]/g, "");
}

async function getLogoDataUrl() {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = fetch(aadarLogoUrl)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      )
      .catch(() => null);
  }
  return logoDataUrlPromise;
}

function receiptFilename(record) {
  const id = (record.paymentId || record.receiptNo || record.orderId || "donation").replace(
    /[^a-zA-Z0-9_-]/g,
    ""
  );
  return `aadar-donation-receipt-${id}`;
}

function detailTableHtml(title, rows) {
  const body = rows
    .map(
      ([label, value], idx) => `
    <tr class="${idx % 2 === 0 ? "even" : "odd"}">
      <th>${escapeHtml(label)}</th>
      <td class="${label === "Donation Amount" ? "amount" : ""}">${escapeHtml(value)}</td>
    </tr>`
    )
    .join("");

  return `
  <div class="detail-table">
    <div class="detail-table-head">${escapeHtml(title)}</div>
    <table><tbody>${body}</tbody></table>
  </div>`;
}

function buildReceiptQrUrl(website) {
  const encoded = encodeURIComponent(website);
  return `https://quickchart.io/qr?text=${encoded}&size=72&margin=1`;
}

export function receiptDocumentHtml(record, logoSrc = aadarLogoUrl) {
  const vm = buildReceiptViewModel(record);
  const qrUrl = buildReceiptQrUrl(vm.org.website);
  const safe = {
    logoSrc: escapeHtml(logoSrc),
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

  const donorTable = detailTableHtml("DONOR DETAILS", [
    ["Donor Name", vm.donorName],
    ["Father / Husband Name", vm.fatherOrHusbandName],
    ["Email", vm.email],
    ["Mobile", vm.mobile],
    ["PAN", vm.pan],
  ]);

  const donationTable = detailTableHtml("DONATION DETAILS", [
    ["Donation Amount", vm.amountFormatted],
    ["Transaction ID", vm.paymentId],
    ["Order ID", vm.orderId],
    ["Receipt For", vm.receiptFor],
    ["Amount (in words)", vm.amountWords],
  ]);

  const testBanner = vm.testMode
    ? `<p class="test-banner">TEST MODE — Not a valid tax receipt for live payments.</p>`
    : "";

  const failBlock =
    !vm.isSuccess && vm.errorDescription
      ? `<p class="fail-msg">${escapeHtml(vm.errorDescription)}</p>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Donation Receipt — ${safe.orgName}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 24px; font-family: "Segoe UI", Lato, Helvetica, Arial, sans-serif; color: #1f2a44; background: #eef1f6; }
    .sheet { max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid #d5e8d5; border-radius: 10px; overflow: hidden; position: relative; }
    .watermark { position: absolute; left: 50%; top: 42%; transform: translate(-50%,-50%); width: 200px; opacity: 0.06; pointer-events: none; }
    .inner { position: relative; padding: 22px 24px 20px; text-align: center; }
    .header { display: flex; justify-content: center; margin-bottom: 4px; }
    .header-inner { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; max-width: 100%; }
    .header img.logo { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 2px solid #2e7d32; flex-shrink: 0; }
    .header-text { text-align: center; }
    .header h1 { margin: 0; font-size: 1.35rem; color: #1b5e20; }
    .header .sub { margin: 2px 0 0; font-size: 0.9rem; font-weight: 700; }
    .header .tag { margin: 4px 0 0; font-size: 0.75rem; font-weight: 600; color: #2e7d32; }
    .title-row { display: flex; align-items: center; justify-content: center; gap: 10px; margin: 18px 0 14px; }
    .title-pill { background: #1b5e20; color: #fff; padding: 7px 22px; border-radius: 999px; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px; margin-bottom: 14px; justify-items: center; }
    .meta-col { text-align: center; }
    .meta-col + .meta-col { border-left: 1px solid #e2e8e2; padding-left: 16px; }
    .meta label { display: block; font-size: 0.68rem; color: rgba(31,42,68,0.55); font-weight: 600; margin-bottom: 2px; }
    .meta span { display: block; font-size: 0.82rem; font-weight: 700; }
    .meta .green { color: #2e7d32; }
    .thanks { text-align: center; font-size: 0.8rem; line-height: 1.55; margin: 0 0 4px; }
    .thanks em { font-size: 0.74rem; color: rgba(31,42,68,0.65); font-style: italic; display: block; margin-bottom: 14px; }
    .tables { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-bottom: 14px; }
    .detail-table { border: 1px solid #d8e0d8; border-radius: 6px; overflow: hidden; flex: 1 1 280px; max-width: 360px; }
    .detail-table-head { display: block; background: #1b5e20; color: #fff; padding: 6px 10px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.08em; text-align: center; }
    .detail-table table { width: 100%; border-collapse: collapse; }
    .detail-table th, .detail-table td { padding: 6px 10px; font-size: 0.65rem; text-align: center; vertical-align: top; display: block; width: 100%; }
    .detail-table th { color: rgba(31,42,68,0.6); font-weight: 600; padding-bottom: 0; }
    .detail-table td { font-weight: 600; word-break: break-word; padding-top: 2px; }
    .detail-table tr.odd { background: #fafcfa; }
    .detail-table tr + tr th, .detail-table tr + tr td { border-top: 1px solid #eef2ee; }
    .detail-table td.amount { color: #2e7d32; font-weight: 800; }
    .tax-box { border: 1px dashed #b8c9b8; border-radius: 8px; padding: 12px 14px; background: #fafcfa; margin: 0 auto 14px; max-width: 560px; font-size: 0.68rem; line-height: 1.5; text-align: center; }
    .tax-box strong { color: #2e7d32; display: block; margin-top: 6px; }
    .footer-grid { max-width: 480px; margin: 0 auto; font-size: 0.65rem; color: rgba(31,42,68,0.75); text-align: center; }
    .footer-grid img.qr { width: 64px; height: 64px; display: block; margin: 8px auto 0; }
    .closing { text-align: center; margin-top: 14px; padding-top: 12px; border-top: 1px solid #eaf7ea; font-size: 0.7rem; }
    .closing .bold { font-weight: 800; color: #1b5e20; margin-top: 4px; }
    .sig { font-size: 0.6rem; color: rgba(31,42,68,0.45); margin-top: 8px; }
    .test-banner { background: #fff8e1; color: #6d4c00; padding: 8px; border-radius: 6px; font-size: 0.72rem; text-align: center; margin-bottom: 10px; }
    .fail-msg { color: #b71c1c; font-size: 0.78rem; margin: 0 0 10px; }
    @media (max-width: 600px) {
      .meta { grid-template-columns: 1fr; }
      .meta-col + .meta-col { border-left: none; padding-left: 0; border-top: 1px solid #e2e8e2; padding-top: 10px; }
      .detail-table { flex: 1 1 100%; max-width: none; }
    }
    @media print {
      body { padding: 0; background: #fff; }
      .sheet { border: none; border-radius: 0; max-width: none; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <img class="watermark" src="${safe.logoSrc}" alt="" />
    <div class="inner">
      <div class="header">
        <div class="header-inner">
          <img class="logo" src="${safe.logoSrc}" alt="${safe.orgName}" />
          <div class="header-text">
            <h1>${safe.orgName}</h1>
            <p class="sub">${safe.orgSubtitle}</p>
            <p class="tag">${safe.orgTagline}</p>
          </div>
        </div>
      </div>
      <div class="title-row">
        <span aria-hidden="true">🌿</span>
        <span class="title-pill">DONATION RECEIPT</span>
        <span aria-hidden="true">🌿</span>
      </div>
      ${testBanner}
      ${failBlock}
      <div class="meta">
        <div class="meta-col">
          <label>Receipt No.</label><span class="green">${safe.receiptNo}</span>
          <label style="margin-top:8px">Date</label><span>${safe.date}</span>
        </div>
        <div class="meta-col">
          <label>Mode of Payment</label><span>${safe.paymentMode}</span>
          <label style="margin-top:8px">Payment Status</label><span class="green">${safe.paymentStatus}</span>
        </div>
      </div>
      <p class="thanks">Thank you, <strong>${safe.donorName}</strong>, for your generous contribution towards the care, shelter and dignity of homeless &amp; unclaimed people.</p>
      <em class="thanks">Your support truly makes a difference.</em>
      <div class="tables">
        ${donorTable}
        ${donationTable}
      </div>
      <div class="tax-box">
        This donation is eligible for tax exemption under Section 80G of the Income Tax Act, 1961, subject to applicable rules. Please keep this receipt for your tax records.
        <strong>This receipt is valid subject to realization of funds.</strong>
      </div>
      <div class="footer-grid">
        <div>${safe.orgAddress}</div>
        <div>
          <div>Email: ${safe.orgEmail}</div>
          <div>Phone: ${safe.orgPhone}</div>
          <div>PAN: ${safe.orgPan}</div>
        </div>
        <div>
          <img class="qr" src="${qrUrl}" alt="QR code for website" />
          <div style="margin-top:4px;font-size:0.6rem">Scan to visit our website</div>
        </div>
      </div>
      <div class="closing">
        <div>Every contribution helps us provide food, shelter and dignity to those in need.</div>
        <div class="bold">Thank you for being a part of our mission.</div>
        <div class="sig">This is a computer-generated receipt and does not require physical signature.</div>
      </div>
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

function drawPdfTable(doc, x, w, title, rows, startY) {
  const headH = 7;
  let cy = startY;

  doc.setFillColor(27, 94, 32);
  doc.rect(x, cy, w, headH, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(pdfSafeText(title), x + w / 2, cy + 4.8, { align: "center" });
  cy += headH;

  rows.forEach(([label, value], idx) => {
    const valLines = doc.splitTextToSize(pdfSafeText(value), w - 6);
    const rowH = 5 + valLines.length * 3.2;

    if (idx % 2 === 1) {
      doc.setFillColor(250, 252, 250);
      doc.rect(x, cy, w, rowH, "F");
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(90, 107, 138);
    doc.text(pdfSafeText(label), x + w / 2, cy + 3.5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(
      label === "Donation Amount" ? 46 : 31,
      label === "Donation Amount" ? 125 : 42,
      label === "Donation Amount" ? 50 : 68
    );
    doc.text(valLines, x + w / 2, cy + 7, { align: "center" });
    cy += rowH;
  });

  doc.setDrawColor(216, 224, 216);
  doc.setLineWidth(0.2);
  doc.rect(x, startY, w, cy - startY);
  return cy + 2;
}

/** Build donation receipt PDF (A4) matching the official layout. */
export async function buildReceiptPdf(record) {
  const vm = buildReceiptViewModel(record);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 14;
  const pageW = doc.internal.pageSize.getWidth();
  const contentW = pageW - margin * 2;
  let y = 16;

  const logoSize = 24;
  const centerX = pageW / 2;
  const nameText = pdfSafeText(vm.org.name);
  const subtitleText = pdfSafeText(vm.org.subtitle);
  const taglineText = pdfSafeText(vm.org.tagline);

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
    y += logoSize + 4;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(27, 94, 32);
  doc.text(nameText, centerX, y + 5, { align: "center" });
  doc.setFontSize(10);
  doc.setTextColor(31, 42, 68);
  doc.text(subtitleText, centerX, y + 11, { align: "center" });
  doc.setFontSize(8);
  doc.setTextColor(46, 125, 50);
  doc.text(taglineText, centerX, y + 16, { align: "center" });
  y += 24;

  doc.setFillColor(27, 94, 32);
  const pillW = 52;
  doc.roundedRect((pageW - pillW) / 2, y, pillW, 8, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("DONATION RECEIPT", pageW / 2, y + 5.2, { align: "center" });
  y += 14;

  if (vm.testMode) {
    doc.setFontSize(7);
    doc.setTextColor(109, 76, 0);
    doc.text(pdfSafeText("TEST MODE - Not a valid tax receipt for live payments."), pageW / 2, y, {
      align: "center",
    });
    y += 6;
  }

  const drawMetaLine = (label, value, valueGreen = false) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(90, 107, 138);
    doc.text(pdfSafeText(label), centerX, y, { align: "center" });
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(valueGreen ? 46 : 31, valueGreen ? 125 : 42, valueGreen ? 50 : 68);
    doc.text(pdfSafeText(value), centerX, y, { align: "center" });
    y += 7;
  };

  drawMetaLine("Receipt No.", vm.receiptNo, true);
  drawMetaLine("Date", vm.date);
  drawMetaLine("Mode of Payment", vm.paymentMode);
  drawMetaLine("Payment Status", vm.paymentStatus, true);
  y += 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(31, 42, 68);
  const thanks = `Thank you, ${vm.donorName}, for your generous contribution towards the care, shelter and dignity of homeless & unclaimed people.`;
  const thanksLines = doc.splitTextToSize(pdfSafeText(thanks), contentW);
  doc.text(thanksLines, pageW / 2, y, { align: "center" });
  y += thanksLines.length * 4 + 3;
  doc.setFontSize(7);
  doc.setTextColor(90, 107, 138);
  doc.text("Your support truly makes a difference.", pageW / 2, y, { align: "center" });
  y += 8;

  const donorRows = [
    ["Donor Name", vm.donorName],
    ["Father / Husband", vm.fatherOrHusbandName],
    ["Email", vm.email],
    ["Mobile", vm.mobile],
    ["PAN", vm.pan],
  ];
  const donationRows = [
    ["Donation Amount", vm.amountFormattedPdf],
    ["Transaction ID", vm.paymentId],
    ["Order ID", vm.orderId],
    ["Receipt For", vm.receiptFor],
    ["Amount (words)", vm.amountWords],
  ];

  const colW = (contentW - 8) / 2;
  const tableTop = y;
  const leftX = (pageW - contentW) / 2;
  const leftEnd = drawPdfTable(doc, leftX, colW, "DONOR DETAILS", donorRows, tableTop);
  const rightEnd = drawPdfTable(
    doc,
    leftX + colW + 8,
    colW,
    "DONATION DETAILS",
    donationRows,
    tableTop
  );
  y = Math.max(leftEnd, rightEnd) + 4;

  doc.setDrawColor(184, 201, 184);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentW, 18, 2, 2, "S");
  doc.setFontSize(7);
  doc.setTextColor(31, 42, 68);
  const tax = doc.splitTextToSize(
    pdfSafeText(
      "This donation is eligible for tax exemption under Section 80G of the Income Tax Act, 1961, subject to applicable rules."
    ),
    contentW - 6
  );
  doc.text(tax, pageW / 2, y + 5, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(46, 125, 50);
  const fundsNotice = pdfSafeText(RECEIPT_FUNDS_NOTICE);
  doc.text(fundsNotice, pageW / 2, y + 13, { align: "center" });
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(90, 107, 138);
  const addr = doc.splitTextToSize(pdfSafeText(vm.org.address), contentW - 10);
  doc.text(addr, pageW / 2, y, { align: "center" });
  y += addr.length * 3.5 + 2;
  doc.text(pdfSafeText(`Email: ${vm.org.email}`), pageW / 2, y, { align: "center" });
  y += 4;
  doc.text(pdfSafeText(`Phone: ${vm.org.phone}`), pageW / 2, y, { align: "center" });
  y += 4;
  doc.text(pdfSafeText(`PAN: ${vm.org.pan}`), pageW / 2, y, { align: "center" });
  y += 10;

  doc.setDrawColor(234, 247, 234);
  doc.line(margin, y, margin + contentW, y);
  y += 5;
  doc.setFontSize(7);
  doc.text(
    pdfSafeText("Every contribution helps us provide food, shelter and dignity to those in need."),
    pageW / 2,
    y,
    { align: "center" }
  );
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(27, 94, 32);
  doc.text(pdfSafeText("Thank you for being a part of our mission."), pageW / 2, y, {
    align: "center",
  });
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(120, 130, 150);
  doc.text(
    pdfSafeText("This is a computer-generated receipt and does not require physical signature."),
    pageW / 2,
    y,
    { align: "center" }
  );

  return doc;
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
 * Download receipt as PDF.
 * @returns {Promise<'pdf' | 'html' | false>}
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
    if (downloadReceiptHtml(record)) return "html";
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

export function printReceiptViaIframe(record) {
  try {
    const html = receiptDocumentHtml(record);
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

export function openReceiptPrintWindow(record) {
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
