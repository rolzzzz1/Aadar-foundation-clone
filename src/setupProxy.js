const { createProxyMiddleware } = require("http-proxy-middleware");

const API_PORT = process.env.REACT_APP_API_PORT || "3001";
const API_TARGET = `http://127.0.0.1:${API_PORT}`;

/**
 * Forward /api/* to the local handler server (npm run api:dev / npm start).
 * Same-origin in the browser avoids CORS; the API listens on port 3001.
 */
module.exports = function setupProxy(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: API_TARGET,
      changeOrigin: true,
      logLevel: "silent",
      onProxyReq(proxyReq, req) {
        // eslint-disable-next-line no-console
        console.log(`[proxy] ${req.method} ${req.url} → ${API_TARGET}${req.url}`);
      },
      onError(err, req, res) {
        // eslint-disable-next-line no-console
        console.error("[proxy] API unreachable:", err.message);
        if (res && typeof res.writeHead === "function" && !res.headersSent) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Payment API is not running. Stop other servers, then run: npm start",
              details: err.message,
            })
          );
        }
      },
    })
  );
};
