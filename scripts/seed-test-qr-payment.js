/**
 * Insert a fake Razorpay Static QR payment into Supabase (test mode can't do real UPI QR).
 *
 * Usage:
 *   node scripts/seed-test-qr-payment.js
 *   node scripts/seed-test-qr-payment.js --amount 501 --email you@example.com --contact 9876543210
 *
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env / .env.local
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
for (const name of [".env.local", ".env"]) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val.trim();
  }
}

const { applyDevTlsWorkaround } = require("../server/_lib/httpsAgent");
const { isStoreConfigured, fetchDonationByPaymentId } = require("../server/_lib/donationRecord");
const { persistRazorpayQrDonation } = require("../server/_lib/donationPersist");

applyDevTlsWorkaround();

function argValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return null;
  return process.argv[idx + 1];
}

function parseAmountInr() {
  const raw = argValue("--amount");
  if (raw == null) return 501;
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n) || n < 1) {
    console.error("Invalid --amount (use whole rupees, e.g. 501)");
    process.exit(1);
  }
  return n;
}

function buildFakeQrPayment({ amountInr, email, contact, utr }) {
  const suffix = Date.now().toString(36).toUpperCase();
  return {
    id: `pay_TESTQR${suffix}`,
    entity: "payment",
    amount: amountInr * 100,
    currency: "INR",
    status: "captured",
    order_id: null,
    invoice_id: null,
    international: false,
    method: "upi",
    amount_refunded: 0,
    refund_status: null,
    captured: true,
    description: "QRv2 Payment (local test seed)",
    card_id: null,
    bank: null,
    wallet: null,
    vpa: "test.donor@okhdfcbank",
    email: email || "void@razorpay.com",
    contact: contact || "+919876543210",
    notes: [],
    fee: 0,
    tax: 0,
    error_code: null,
    error_description: null,
    acquirer_data: {
      rrn: utr || `TESTUTR${suffix}`.slice(0, 22),
    },
    created_at: Math.floor(Date.now() / 1000),
  };
}

async function main() {
  if (!isStoreConfigured()) {
    console.error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env / .env.local"
    );
    process.exit(1);
  }

  const amountInr = parseAmountInr();
  const email = argValue("--email") || "";
  const contact = argValue("--contact") || "";
  const utr = argValue("--utr") || "";

  const payment = buildFakeQrPayment({ amountInr, email, contact, utr });

  console.log("Seeding test Razorpay Static QR payment…");
  console.log({
    payment_id: payment.id,
    amount_inr: amountInr,
    utr: payment.acquirer_data.rrn,
    contact: payment.contact,
    email: payment.email,
  });

  const persisted = await persistRazorpayQrDonation({
    payment,
    source: "razorpay_qr_test",
  });

  if (!persisted.saved) {
    console.error("Failed to save:", persisted.reason || persisted);
    process.exit(1);
  }

  const row = persisted.row || (await fetchDonationByPaymentId(payment.id));
  console.log("\nSaved to Supabase:");
  console.log(
    JSON.stringify(
      {
        payment_id: row.payment_id,
        order_id: row.order_id,
        receipt_no: row.receipt_no,
        amount_paise: row.amount_paise,
        status: row.status,
        payment_method: row.payment_method,
        source: row.source,
        donor_contact: row.donor_contact,
        donor_email: row.donor_email,
        purpose: row.purpose,
        created_at: row.created_at,
      },
      null,
      2
    )
  );
  console.log(
    "\nNote: No 80G receipt email is sent for QR rows until donor PAN/address are filled (admin / receipt-request flow)."
  );
}

main().catch((err) => {
  console.error(err && err.message ? err.message : err);
  process.exit(1);
});
