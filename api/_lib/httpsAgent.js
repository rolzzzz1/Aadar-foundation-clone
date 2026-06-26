/**
 * Optional dev-only TLS bypass for outbound HTTPS (Razorpay, Meta Graph API, etc.).
 * Enable with RAZORPAY_INSECURE_TLS=true in .env — local dev only, never production.
 */

const https = require("https");
const { isProduction } = require("./donation");

function devInsecureTlsEnabled() {
  return process.env.RAZORPAY_INSECURE_TLS === "true" && !isProduction();
}

function getDevHttpsAgent() {
  if (devInsecureTlsEnabled()) {
    return new https.Agent({ rejectUnauthorized: false });
  }
  return undefined;
}

/** Apply process-wide TLS bypass for native fetch() in local api:dev. */
function applyDevTlsWorkaround() {
  if (devInsecureTlsEnabled()) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }
}

module.exports = {
  devInsecureTlsEnabled,
  getDevHttpsAgent,
  applyDevTlsWorkaround,
};
