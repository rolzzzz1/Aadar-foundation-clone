/** Receipt header palette — matches official donation receipt artwork. */
export const RECEIPT_HEADER_COLORS = {
  greenDark: "#1b5e20",
  greenMid: "#2e7d32",
  navy: "#1e3a5f",
  logoBorder: "#2e7d32",
};

/** CSS for receipt header (include in receiptDocumentStyles). */
export const receiptHeaderCss = `
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

/** HTML fragment for PDF / print receipt. Strings must be HTML-escaped by caller. */
export function buildReceiptHeaderHtml({ org, title, logoSrc, logoAlt, forPdf = false }) {
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
