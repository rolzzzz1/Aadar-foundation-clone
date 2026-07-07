/**
 * Dev helper: resend receipt email for a payment (uses .env).
 * Usage: node scripts/resend-receipt-email.js pay_T9oC1c7hCqtmnR
 */
const fs = require("fs");
const path = require("path");
const { applyDevTlsWorkaround } = require("../api/_lib/httpsAgent");
const { fetchDonationByPaymentId } = require("../api/_lib/donationRecord");
const { trySendReceiptEmail } = require("../api/_lib/receiptEmail");

const root = path.join(__dirname, "..");
for (const name of [".env.local", ".env"]) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

applyDevTlsWorkaround();

const paymentId = process.argv[2];
if (!paymentId) {
  console.error("Usage: node scripts/resend-receipt-email.js <payment_id>");
  process.exit(1);
}

(async () => {
  const row = await fetchDonationByPaymentId(paymentId);
  if (!row) {
    console.error(`Donation not found in Supabase: ${paymentId}`);
    console.error(
      "If the row exists in the Supabase dashboard, the API request may have failed (check SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY, or set RAZORPAY_INSECURE_TLS=true in .env for local SSL/VPN issues)."
    );
    process.exit(1);
  }

  const result = await trySendReceiptEmail(row, { locale: "en", forceResend: true });
  console.log(JSON.stringify(result, null, 2));
  if (!result.sent) process.exit(1);
})().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
