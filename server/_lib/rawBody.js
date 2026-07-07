/**
 * Raw request body for Razorpay webhook signature verification.
 * Dev-server sets req.rawBody. On Vercel, disable body parsing (see razorpay-webhook.js config).
 */

function readRequestStream(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

/**
 * @param {import("http").IncomingMessage & {
 *   rawBody?: string,
 *   body?: unknown,
 *   isBase64Encoded?: boolean
 * }} req
 * @param {{ allowParsedObjectFallback?: boolean }} [options]
 * @returns {Promise<string>}
 */
async function getRawBody(req, options = {}) {
  if (req.rawBody) return req.rawBody;

  if (req.isBase64Encoded && typeof req.body === "string") {
    return Buffer.from(req.body, "base64").toString("utf8");
  }

  if (typeof req.body === "string") return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString("utf8");

  // On Vercel, even with `bodyParser: false`, `req.body` can sometimes be set to an
  // object while the raw stream is still available. For webhook signature checks
  // we must prefer the raw stream when possible.
  try {
    const fromStream = await readRequestStream(req);
    if (fromStream) return fromStream;
  } catch {
    /* stream already consumed */
  }

  // Parsed JSON breaks Razorpay HMAC — never use this for webhooks unless explicitly allowed.
  if (options.allowParsedObjectFallback && req.body && typeof req.body === "object") {
    return JSON.stringify(req.body);
  }

  return "";
}

/** Raw body for webhook signature verification only. */
function getWebhookRawBody(req) {
  return getRawBody(req, { allowParsedObjectFallback: false });
}

module.exports = { getRawBody, getWebhookRawBody };
