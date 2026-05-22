const { isProduction } = require("./_lib/donation");
const { isStoreConfigured } = require("./_lib/donationRecord");

module.exports = function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  const payload = {
    ok: true,
    service: "aadar-foundation-clone",
    timestamp: new Date().toISOString(),
  };

  if (!isProduction()) {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID;
    payload.razorpay = {
      key_id: !!keyId,
      key_secret: !!process.env.RAZORPAY_KEY_SECRET,
      webhook_secret: !!process.env.RAZORPAY_WEBHOOK_SECRET,
    };
    payload.donation_store = isStoreConfigured();
  }

  return res.status(200).json(payload);
};

