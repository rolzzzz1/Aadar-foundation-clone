const {
  buildRecordFromRazorpay,
  upsertDonationRecord,
  fetchDonationByPaymentId,
} = require("./donationRecord");
const { isCapturedStatus } = require("./receiptRecord");
const { trySendReceiptEmail } = require("./receiptEmail");

function resolveReceiptLocale(order, explicit) {
  if (explicit === "hi") return "hi";
  const notes = (order && order.notes) || {};
  return notes.donor_locale === "hi" ? "hi" : "en";
}

/**
 * Persist a captured Razorpay payment to Supabase and email the receipt when eligible.
 * Safe to call from verify, webhook, and confirm — merges rows and skips duplicate emails.
 *
 * @param {{ payment: object, order: object, source: string, locale?: string, sendEmail?: boolean }} params
 * @returns {Promise<{ saved: boolean, reason?: string, row?: object, receiptEmail?: object }>}
 */
async function persistCapturedDonation({
  payment,
  order,
  source,
  locale,
  sendEmail = true,
}) {
  if (!payment || !payment.id) {
    return { saved: false, reason: "missing_payment" };
  }

  const record = buildRecordFromRazorpay({ payment, order, source });
  const saved = await upsertDonationRecord(record);

  if (!saved.saved) {
    return saved;
  }

  let row = saved.row || (await fetchDonationByPaymentId(payment.id));
  if (!row) {
    return { saved: false, reason: "row_missing_after_save" };
  }

  let receiptEmail = { sent: false, reason: "skipped" };
  const emailLocale = resolveReceiptLocale(order, locale);
  if (sendEmail && isCapturedStatus(row.status)) {
    receiptEmail = await trySendReceiptEmail(row, { locale: emailLocale });
    if (!receiptEmail.sent) {
      // eslint-disable-next-line no-console
      console.warn("[donation-persist] receipt email not sent", {
        payment_id: payment.id,
        reason: receiptEmail.reason,
        detail: receiptEmail.detail,
      });
    } else {
      row = (await fetchDonationByPaymentId(payment.id)) || row;
    }
  }

  return {
    saved: true,
    row,
    created: saved.created,
    receiptEmail,
  };
}

module.exports = {
  persistCapturedDonation,
};
