/**
 * Local dev server for Vercel-style handlers in /api.
 * Run alongside `npm start` (setupProxy forwards /api → this server).
 *
 *   npm run api:dev    # port 3001
 *   npm start          # port 3000, proxies /api/*
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { applyDevTlsWorkaround } = require("../server/_lib/httpsAgent");

const PORT = Number(process.env.PORT) || 3001;

const apiDir = path.join(__dirname, "..", "api");

const routes = {
  "/api/test": require("./api-test.js"),
  "/api/health": require(path.join(apiDir, "health.js")),
  "/api/razorpay-order": require(path.join(apiDir, "razorpay-order.js")),
  "/api/razorpay-verify": require(path.join(apiDir, "razorpay-verify.js")),
  "/api/razorpay-webhook": require(path.join(apiDir, "razorpay-webhook.js")),
  "/api/donation-receipt": require(path.join(apiDir, "donation-receipt.js")),
  "/api/donation-receipt-list": require(path.join(apiDir, "donation-receipt-list.js")),
  "/api/donation-receipt-upi": require(path.join(apiDir, "donation-receipt-upi.js")),
  "/api/admin-donation-receipt": require(path.join(apiDir, "admin-donation-receipt.js")),
  "/api/donation-receipt-resend": require(path.join(apiDir, "donation-receipt-resend.js")),
  "/api/donation-confirm": require(path.join(apiDir, "donation-confirm.js")),
  "/api/instagram-posts": require(path.join(apiDir, "instagram-posts.js")),
};

function loadEnvFiles() {
  const root = path.join(__dirname, "..");
  const loadedFrom = [];

  for (const name of [".env.local", ".env.development.local", ".env"]) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;
    loadedFrom.push(name);
    const lines = fs.readFileSync(file, "utf8").split("\n");
    for (const line of lines) {
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
      val = val.trim();
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }

  // CRA only exposes REACT_APP_* to the browser; mirror the public key for the API.
  if (!process.env.RAZORPAY_KEY_ID && process.env.REACT_APP_RAZORPAY_KEY_ID) {
    process.env.RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID;
  }

  return loadedFrom;
}

const envFilesLoaded = loadEnvFiles();
applyDevTlsWorkaround();

function setCors(nodeReq, nodeRes) {
  const origin = nodeReq.headers.origin || "*";
  nodeRes.setHeader("Access-Control-Allow-Origin", origin);
  nodeRes.setHeader("Vary", "Origin");
  nodeRes.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  nodeRes.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Admin-Receipt-Secret");
}

function createMockRes(nodeReq, nodeRes) {
  const res = {
    setHeader(name, value) {
      if (!nodeRes.headersSent) nodeRes.setHeader(name, value);
      return res;
    },
    status(code) {
      nodeRes.statusCode = code;
      return {
        json(body) {
          if (!nodeRes.headersSent) {
            nodeRes.setHeader("Content-Type", "application/json; charset=utf-8");
          }
          nodeRes.end(JSON.stringify(body));
        },
      };
    },
  };
  return res;
}

function readBody(nodeReq) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    nodeReq.on("data", (chunk) => chunks.push(chunk));
    nodeReq.on("end", () => resolve(Buffer.concat(chunks)));
    nodeReq.on("error", reject);
  });
}

const server = http.createServer(async (nodeReq, nodeRes) => {
  const rawUrl = nodeReq.url || "/";
  const urlPath = rawUrl.split("?")[0];
  const query = Object.fromEntries(new URL(rawUrl, "http://127.0.0.1").searchParams);
  setCors(nodeReq, nodeRes);

  if (nodeReq.method === "OPTIONS") {
    nodeRes.statusCode = 204;
    nodeRes.end();
    return;
  }

  const handler = routes[urlPath];
  if (!handler) {
    nodeRes.statusCode = 404;
    nodeRes.setHeader("Content-Type", "application/json; charset=utf-8");
    nodeRes.end(JSON.stringify({ error: "Not found", path: urlPath }));
    return;
  }

  try {
    const raw = await readBody(nodeReq);
    let body;
    if (raw.length) {
      body = JSON.parse(raw.toString("utf8"));
    }

    const req = {
      method: nodeReq.method,
      headers: nodeReq.headers,
      query,
      body,
      rawBody: raw.length ? raw.toString("utf8") : "",
    };

    await handler(req, createMockRes(nodeReq, nodeRes));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[api:dev] ${nodeReq.method} ${urlPath}`, err);
    if (!nodeRes.headersSent) {
      nodeRes.statusCode = 500;
      nodeRes.setHeader("Content-Type", "application/json; charset=utf-8");
      nodeRes.end(JSON.stringify({ error: err.message || String(err) }));
    }
  }
});

server.listen(PORT, "127.0.0.1", () => {
  const hasKeyId = !!(process.env.RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID);
  const hasSecret = !!process.env.RAZORPAY_KEY_SECRET;

  // eslint-disable-next-line no-console
  console.log(`API dev server: http://127.0.0.1:${PORT}`);
  if (envFilesLoaded.length) {
    // eslint-disable-next-line no-console
    console.log(`  env loaded: ${envFilesLoaded.join(", ")}`);
  } else {
    // eslint-disable-next-line no-console
    console.log("  env: no .env.local found — copy .env.example to .env.local");
  }
  // eslint-disable-next-line no-console
  console.log(
    `  Razorpay: key_id=${hasKeyId ? "ok" : "MISSING"}  key_secret=${hasSecret ? "ok" : "MISSING"}`
  );
  // eslint-disable-next-line no-console
  console.log("  POST /api/razorpay-order");
  // eslint-disable-next-line no-console
  console.log("  POST /api/razorpay-verify");
  console.log("  POST /api/razorpay-webhook");
  // eslint-disable-next-line no-console
  console.log("  POST /api/donation-receipt");
  console.log("  POST /api/donation-receipt-list");
  console.log("  POST /api/donation-receipt-upi");
  console.log("  POST /api/admin-donation-receipt");
  console.log("  POST /api/donation-confirm");
  // eslint-disable-next-line no-console
  console.log("  GET  /api/instagram-posts");
  // eslint-disable-next-line no-console
  console.log("  GET  /api/health");
  const hasInstagram = !!(
    process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_ACCOUNT_ID
  );
  // eslint-disable-next-line no-console
  console.log(`  Instagram: ${hasInstagram ? "ok" : "MISSING (set INSTAGRAM_* in .env.local)"}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    // eslint-disable-next-line no-console
    console.error(
      `\nPort ${PORT} is already in use. Stop the other process (or close the old terminal), then run npm start again.\n`
    );
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
