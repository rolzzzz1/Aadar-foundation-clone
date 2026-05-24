/**
 * Creates a ₹1 test order against Razorpay — validates key_id + key_secret.
 * Usage: node scripts/test-razorpay-order.js
 */
const fs = require("fs");
const path = require("path");
const Razorpay = require("razorpay");

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

const keyId = process.env.RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

async function main() {
  if (!keyId || !keySecret) {
    console.error("Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET");
    process.exit(1);
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  try {
    const order = await razorpay.orders.create({
      amount: 100,
      currency: "INR",
      receipt: `diag_${Date.now()}`,
      payment_capture: 1,
    });
    console.log(
      JSON.stringify(
        {
          ok: true,
          orderId: order.id,
          status: order.status,
          keyMode: keyId.startsWith("rzp_test_") ? "test" : "live",
          message:
            "Keys work — order created. Complete a test payment on /donate2, then check Dashboard in TEST MODE → Orders / Payments.",
        },
        null,
        2
      )
    );
  } catch (err) {
    const desc =
      (err && err.error && (err.error.description || err.error.reason)) ||
      err.message ||
      String(err);
    console.error(
      JSON.stringify(
        {
          ok: false,
          error: desc,
          hint:
            "Usually wrong Key Secret, or Key ID/Secret from different Razorpay accounts. Regenerate both from Dashboard → API Keys (Test Mode) and update .env, then restart npm start.",
        },
        null,
        2
      )
    );
    process.exit(1);
  }
}

main();
