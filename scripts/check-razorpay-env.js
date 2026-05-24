/**
 * Local diagnostic — prints key mode/prefix only (never full secrets).
 * Usage: node scripts/check-razorpay-env.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const envFiles = [".env.local", ".env.development.local", ".env"];

function parseEnvFile(name) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) return null;
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val.trim();
  }
  return out;
}

function keyMode(keyId) {
  if (!keyId) return "missing";
  if (keyId.startsWith("rzp_test_")) return "test";
  if (keyId.startsWith("rzp_live_")) return "live";
  return "unknown";
}

function preview(keyId) {
  if (!keyId) return "(missing)";
  if (keyId.length <= 16) return keyId;
  return `${keyId.slice(0, 12)}...${keyId.slice(-4)}`;
}

const found = envFiles.filter((name) => fs.existsSync(path.join(root, name)));
const perFile = found.map((name) => ({ file: name, vars: parseEnvFile(name) }));

const merged = {};
for (const name of [...found].reverse()) {
  Object.assign(merged, parseEnvFile(name));
}

const reactKey = merged.REACT_APP_RAZORPAY_KEY_ID || "";
const serverKeyId = merged.RAZORPAY_KEY_ID || reactKey;
const secret = merged.RAZORPAY_KEY_SECRET || "";

const report = {
  envFilesFound: found,
  perFileKeyPreview: perFile.map(({ file, vars }) => ({
    file,
    REACT_APP_RAZORPAY_KEY_ID: preview(vars.REACT_APP_RAZORPAY_KEY_ID),
    RAZORPAY_KEY_ID: preview(vars.RAZORPAY_KEY_ID),
    hasSecret: !!vars.RAZORPAY_KEY_SECRET,
  })),
  effectiveForApiDev: {
    RAZORPAY_KEY_ID: preview(serverKeyId),
    mode: keyMode(serverKeyId),
    hasSecret: !!secret,
  },
  effectiveForReact: {
    REACT_APP_RAZORPAY_KEY_ID: preview(reactKey),
    mode: keyMode(reactKey),
  },
  keysMatch:
    !reactKey || !serverKeyId || reactKey === serverKeyId
      ? reactKey === serverKeyId
        ? "yes"
        : "server falls back to REACT_APP key"
      : "NO — mismatch will break checkout",
  localLiveKeysBlocked: keyMode(serverKeyId) === "live",
  tips: [],
};

if (keyMode(reactKey) !== keyMode(serverKeyId) && reactKey && serverKeyId) {
  report.tips.push("REACT_APP_RAZORPAY_KEY_ID and RAZORPAY_KEY_ID must be the same test or live pair.");
}
if (keyMode(serverKeyId) === "live") {
  report.tips.push("Live keys are blocked locally — use Test Mode keys (rzp_test_) in .env.");
}
if (keyMode(serverKeyId) === "test") {
  report.tips.push("Check Razorpay Dashboard → toggle TEST MODE (top) → Transactions / Orders.");
}
if (found.length > 1) {
  report.tips.push(
    "Multiple env files found — .env.local overrides .env. Ensure all three vars match in the file that wins."
  );
}
if (!secret) {
  report.tips.push("RAZORPAY_KEY_SECRET is missing — orders cannot be created.");
}

console.log(JSON.stringify(report, null, 2));
