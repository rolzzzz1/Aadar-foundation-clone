import { formatApiErrorMessage, getApiUrl } from "utils/api";

/** Shared with Admin receipt portal + Donate2 preview gate. */
export const ADMIN_SECRET_KEY = "aadar_admin_receipt_secret";

export function readAdminSession() {
  try {
    const stored = sessionStorage.getItem(ADMIN_SECRET_KEY);
    if (!stored) return null;
    if (stored.trim().startsWith("{")) {
      const parsed = JSON.parse(stored);
      const secret = String(parsed?.secret || "").trim();
      const username = String(parsed?.username || "").trim();
      if (!secret) return null;
      return { secret, username };
    }
    const secret = String(stored || "").trim();
    if (!secret) return null;
    return { secret, username: "" };
  } catch {
    return null;
  }
}

export function writeAdminSession({ username, secret }) {
  sessionStorage.setItem(
    ADMIN_SECRET_KEY,
    JSON.stringify({
      username: String(username || "").trim(),
      secret: String(secret || "").trim(),
    })
  );
}

export function clearAdminSession() {
  try {
    sessionStorage.removeItem(ADMIN_SECRET_KEY);
  } catch {
    /* ignore */
  }
}

export async function verifyAdminLogin({ secret, username }) {
  const url = getApiUrl("/api/admin-receipt-auth");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Admin-Receipt-Secret": secret,
      "X-Admin-Receipt-Username": username || "",
    },
    credentials: "same-origin",
    body: JSON.stringify({ secret, username }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(formatApiErrorMessage(data, res.status));
  }
  return data;
}
