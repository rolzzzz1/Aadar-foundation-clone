import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import PageLoadingFallback from "components/PageLoadingFallback";
import "./i18n.js";
import "./fonts.css";

const CHUNK_RELOAD_KEY = "aadar_chunk_reload";

function isChunkLoadFailure(reason) {
  const message = reason?.message || String(reason || "");
  return (
    /Loading chunk [\d]+ failed/i.test(message) ||
    /ChunkLoadError/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /error loading dynamically imported module/i.test(message)
  );
}

/** Recover from slow networks or stale caches after deploy (one automatic reload per session). */
function setupChunkLoadRecovery() {
  const reloadOnce = () => {
    if (sessionStorage.getItem(CHUNK_RELOAD_KEY)) return;
    sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
    window.location.reload();
  };

  window.addEventListener("unhandledrejection", (event) => {
    if (isChunkLoadFailure(event.reason)) {
      event.preventDefault();
      reloadOnce();
    }
  });

  window.addEventListener(
    "error",
    (event) => {
      if (isChunkLoadFailure(event.error || event.message)) {
        reloadOnce();
      }
    },
    true
  );
}

if (typeof window !== "undefined") {
  setupChunkLoadRecovery();
}

// Report Web Vitals for performance monitoring
function reportWebVitals(metric) {
  // Send to Vercel Analytics if available
  if (window.va && typeof window.va === "function") {
    window.va("web-vitals", metric);
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(metric);
  }
}

// Defer Web Vitals until after load so measurement does not compete with user metrics
if (typeof window !== "undefined") {
  const initWebVitals = () => {
    import("web-vitals")
      .then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
        onCLS(reportWebVitals);
        onFID(reportWebVitals);
        onFCP(reportWebVitals);
        onLCP(reportWebVitals);
        onTTFB(reportWebVitals);
        onINP(reportWebVitals);
      })
      .catch(() => {});
  };

  if (document.readyState === "complete") {
    initWebVitals();
  } else {
    window.addEventListener("load", initWebVitals, { once: true });
  }
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found. Make sure <div id='root'></div> exists in index.html");
}

// Create a root.
const root = ReactDOMClient.createRoot(container);

// Simple loading fallback — mobile uses hero shell for faster perceived LCP
const LoadingFallback = () => <PageLoadingFallback />;

root.render(
  <BrowserRouter>
    <React.Suspense fallback={<LoadingFallback />}>
      <App />
    </React.Suspense>
  </BrowserRouter>
);
