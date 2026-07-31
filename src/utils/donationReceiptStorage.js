export const DONATION_RECEIPT_STORAGE_KEY = "aadar_donation_receipt_v1";

/** @typedef {'success' | 'failed' | 'unverified'} DonationReceiptStatus */

/**
 * @typedef {Object} DonationReceiptRecord
 * @property {DonationReceiptStatus} status
 * @property {number} amountInr
 * @property {string} currency
 * @property {{ name: string, fatherOrHusbandName?: string, email: string, contact: string, pan: string, address?: string, state?: string, city?: string, pin?: string }} donor
 * @property {string} [paymentMethod]
 * @property {string} [paymentId]
 * @property {string} [orderId]
 * @property {string} [receiptNo]
 * @property {string} [purpose]
 * @property {string} [programLabel]
 * @property {string} [paidAt]
 * @property {boolean} [verified]
 * @property {string} [errorCode]
 * @property {string} [errorDescription]
 * @property {boolean} [testMode]
 * @property {boolean} [receiptEmailSent]
 * @property {'en' | 'hi'} [locale]
 */

export function saveDonationReceipt(record) {
  try {
    sessionStorage.setItem(DONATION_RECEIPT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* quota / private mode */
  }
}

/** @returns {DonationReceiptRecord | null} */
export function loadDonationReceipt() {
  try {
    const raw = sessionStorage.getItem(DONATION_RECEIPT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearDonationReceipt() {
  try {
    sessionStorage.removeItem(DONATION_RECEIPT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
