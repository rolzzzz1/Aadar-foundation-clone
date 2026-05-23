/**
 * Raw request body for Razorpay webhook signature verification.
 * Vercel may leave the stream readable; dev-server sets req.rawBody.
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
 * @param {import("http").IncomingMessage & { rawBody?: string, body?: unknown }} req
 * @returns {Promise<string>}
 */
async function getRawBody(req) {
  if (req.rawBody) return req.rawBody;
  if (typeof req.body === "string") return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString("utf8");

  if (req.body === undefined || req.body === null) {
    try {
      const fromStream = await readRequestStream(req);
      if (fromStream) return fromStream;
    } catch {
      /* stream already consumed */
    }
  }

  if (req.body && typeof req.body === "object") {
    return JSON.stringify(req.body);
  }

  return "";
}

module.exports = { getRawBody };
