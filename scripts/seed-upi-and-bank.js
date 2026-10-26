/**
 * One-shot seed: 1 UPI/QR + 1 bank transfer donation (full KYC, official AADAR receipt_no).
 *   node scripts/seed-upi-and-bank.js
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
const { buildManualDonationRecord } = require("../server/_lib/manualReceipt");
const {
  isStoreConfigured,
  upsertDonationRecord,
  fetchDonationByPaymentId,
} = require("../server/_lib/donationRecord");

applyDevTlsWorkaround();

async function main() {
  if (!isStoreConfigured()) {
    console.error("Supabase is not configured.");
    process.exit(1);
  }

  const stamp = Date.now().toString().slice(-8);
  const shared = {
    paid_at: "2026-07-31",
    donor_name: "Test Donor",
    donor_father_or_husband: "Test Father",
    donor_email: "test.donor@example.com",
    donor_contact: "9876543210",
    donor_pan: "ABCDE1234F",
    donor_address: "12 Test Street",
    donor_state: "Madhya Pradesh",
    donor_city: "Indore",
    donor_pin: "452001",
    program_label: "General Donation",
  };

  const entries = [
    {
      label: "UPI / QR",
      body: {
        ...shared,
        payment_method: "upi",
        utr: `6111${stamp}`,
        purpose: "Seed UPI QR payment",
        amount_inr: 501,
      },
    },
    {
      label: "Bank transfer",
      body: {
        ...shared,
        payment_method: "bank_transfer",
        bank_ref: `BANK${stamp}`,
        purpose: "Seed bank transfer",
        amount_inr: 2001,
      },
    },
  ];

  for (const entry of entries) {
    const built = buildManualDonationRecord(entry.body);
    if (!built.ok) {
      console.error(entry.label, built.error);
      process.exit(1);
    }
    const saved = await upsertDonationRecord(built.record);
    if (!saved.saved) {
      console.error(entry.label, "save failed", saved);
      process.exit(1);
    }
    const row = saved.row || (await fetchDonationByPaymentId(built.paymentId));
    console.log(`${entry.label}:`);
    console.log(
      JSON.stringify(
        {
          payment_id: row.payment_id,
          order_id: row.order_id,
          receipt_no: row.receipt_no,
          amount_inr: Math.round(row.amount_paise / 100),
          payment_method: row.payment_method,
          source: row.source,
          donor_contact: row.donor_contact,
          donor_email: row.donor_email,
          status: row.status,
        },
        null,
        2
      )
    );
    console.log("");
  }
}

main().catch((err) => {
  console.error(err && err.message ? err.message : err);
  process.exit(1);
});
