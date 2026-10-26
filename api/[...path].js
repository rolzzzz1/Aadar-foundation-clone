/**
 * Single serverless entry for all /api/* routes except razorpay-webhook
 * (kept as its own function for raw-body signature verification).
 * Hobby plan allows max 12 serverless functions per deployment.
 */
const handlers = {
  health: require("../server/handlers/health"),
  "razorpay-order": require("../server/handlers/razorpay-order"),
  "razorpay-verify": require("../server/handlers/razorpay-verify"),
  "donation-confirm": require("../server/handlers/donation-confirm"),
  "instagram-posts": require("../server/handlers/instagram-posts"),
  "donation-receipt": require("../server/handlers/donation-receipt"),
  "donation-receipt-list": require("../server/handlers/donation-receipt-list"),
  "donation-receipt-upi": require("../server/handlers/donation-receipt-upi"),
  "donation-receipt-resend": require("../server/handlers/donation-receipt-resend"),
  "receipt-request": require("../server/handlers/receipt-request"),
  "admin-donation-receipt": require("../server/handlers/admin-donation-receipt"),
  "admin-donation-receipt-lookup": require("../server/handlers/admin-donation-receipt-lookup"),
  "admin-receipt-auth": require("../server/handlers/admin-receipt-auth"),
  "membership-subscription-create": require("../server/handlers/membership-subscription-create"),
  "membership-subscription-verify": require("../server/handlers/membership-subscription-verify"),
};

function resolveRouteKey(req) {
  let parts = req.query && req.query.path;
  if (parts == null || parts === "") {
    const pathname = String(req.url || "")
      .split("?")[0]
      .replace(/\/+$/, "");
    const match = pathname.match(/^\/?api\/(.+)$/);
    parts = match ? match[1] : "";
  }
  if (Array.isArray(parts)) {
    return parts.filter(Boolean).join("/");
  }
  return String(parts || "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/^api\//, "");
}

module.exports = async function handler(req, res) {
  const key = resolveRouteKey(req);
  const routeHandler = handlers[key];
  if (!routeHandler) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(404).json({ error: "Not found", path: key || null });
  }
  return routeHandler(req, res);
};
