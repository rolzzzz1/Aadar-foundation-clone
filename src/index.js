import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import "./i18n.js";
import "./fonts.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found. Make sure <div id='root'></div> exists in index.html");
}

// Create a root.
const root = ReactDOMClient.createRoot(container);

root.render(
  <BrowserRouter>
    <React.Suspense>
      <App />
    </React.Suspense>
  </BrowserRouter>
);
