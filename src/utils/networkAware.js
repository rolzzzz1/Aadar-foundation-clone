/**
 * Network-aware loading helpers.
 *
 * Goal: on slow / metered / "save-data" connections, skip or defer
 * heavy media (Vimeo / YouTube iframes, large hero images, Instagram
 * posts) so the home and donate pages stay usable.
 *
 * We rely on `navigator.connection` (Network Information API) — it is
 * widely supported on Chromium-based mobile browsers, which is where
 * slow-network users almost always come from. Where it is unavailable
 * we degrade to a safe default (assume "fast", but still respect
 * IntersectionObserver-based lazy loading elsewhere).
 */

import { useEffect, useState } from "react";

const SLOW_EFFECTIVE_TYPES = new Set(["slow-2g", "2g", "3g"]);

function readConnection() {
  if (typeof navigator === "undefined") return null;
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
}

/** Best-effort snapshot of the user's network. Safe to call during render. */
export function getNetworkSnapshot() {
  const conn = readConnection();
  if (!conn) {
    return {
      effectiveType: null,
      saveData: false,
      downlink: null,
      isSlow: false,
      isCellular: false,
      supported: false,
    };
  }

  const effectiveType = conn.effectiveType || null;
  const saveData = Boolean(conn.saveData);
  const downlink = typeof conn.downlink === "number" ? conn.downlink : null;
  const isCellular = conn.type === "cellular";
  const isSlow =
    saveData ||
    (effectiveType ? SLOW_EFFECTIVE_TYPES.has(effectiveType) : false) ||
    (downlink !== null && downlink > 0 && downlink < 1.5);

  return {
    effectiveType,
    saveData,
    downlink,
    isSlow,
    isCellular,
    supported: true,
  };
}

/**
 * React hook variant — re-renders when the connection profile changes
 * (e.g. user toggles "Data saver", switches from Wi-Fi to 4G).
 */
export function useNetworkSnapshot() {
  const [snapshot, setSnapshot] = useState(() => getNetworkSnapshot());

  useEffect(() => {
    const conn = readConnection();
    if (!conn || typeof conn.addEventListener !== "function") {
      return undefined;
    }

    const handleChange = () => setSnapshot(getNetworkSnapshot());
    conn.addEventListener("change", handleChange);
    return () => {
      conn.removeEventListener("change", handleChange);
    };
  }, []);

  return snapshot;
}

/**
 * Should we skip auto-loading heavy embeds (Vimeo / YouTube iframes,
 * autoplay videos) on first paint? True when the user is on a slow or
 * metered connection, or has explicitly asked the browser to save data.
 *
 * Components can still offer a click-to-load fallback so the content
 * is reachable on demand.
 */
export function shouldSkipHeavyMedia(snapshot = getNetworkSnapshot()) {
  return Boolean(snapshot && (snapshot.saveData || snapshot.isSlow));
}
