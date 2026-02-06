import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import "./i18n.js";
import "./fonts.css";

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

// Initialize Web Vitals reporting
if (typeof window !== "undefined") {
  import("web-vitals")
    .then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(reportWebVitals);
      onFID(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
      onINP(reportWebVitals);
    })
    .catch(() => {
      // Silently fail if web-vitals is not available
    });
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found. Make sure <div id='root'></div> exists in index.html");
}

// Create a root.
const root = ReactDOMClient.createRoot(container);

// Simple loading fallback
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #4fa953",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

root.render(
  <BrowserRouter>
    <React.Suspense fallback={<LoadingFallback />}>
      <App />
    </React.Suspense>
  </BrowserRouter>
);
