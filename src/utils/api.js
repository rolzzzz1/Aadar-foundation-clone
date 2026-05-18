/**
 * Resolve API URLs for fetch calls.
 * Uses same-origin `/api/...` so CRA setupProxy (dev) or Vercel (prod) can route requests.
 * Set REACT_APP_API_BASE_URL only if the API is on another host (e.g. http://localhost:3001).
 */
export function getApiUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const envBase = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/$/, "");
  if (envBase) return `${envBase}${normalized}`;
  return normalized;
}

function formatDetails(details) {
  if (details == null) return "";
  if (typeof details === "string") return details;
  if (typeof details === "object") {
    if (details.hint) return String(details.hint);
    if (details.description) return String(details.description);
    try {
      return JSON.stringify(details);
    } catch {
      return String(details);
    }
  }
  return String(details);
}

/** Turn a failed API JSON body into a user-visible message (dev hints included). */
export function formatApiErrorMessage(data, status) {
  const base = (data && data.error) || `Request failed (${status})`;
  const detailStr = formatDetails(data && data.details);
  let msg = detailStr && !base.includes(detailStr) ? `${base} — ${detailStr}` : base;

  if (process.env.NODE_ENV !== "development") return msg;

  const lower = msg.toLowerCase();
  if (
    status === 404 ||
    lower.includes("payment api is not running") ||
    lower.includes("could not reach")
  ) {
    msg +=
      " Run npm start (starts [api] on port 3001 and [web] on 3000). If port 3001 is busy, close old terminals and restart.";
  } else if (status === 500 && lower.includes("missing razorpay")) {
    msg += " Copy .env.example to .env.local, add your test keys, then restart npm start.";
  } else if (status === 502 && lower.includes("failed to create order")) {
    msg +=
      " Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET match your Razorpay test keys, then restart npm start.";
  } else if (lower.includes("authentication failed")) {
    msg += " Your key secret likely does not match the key id — update .env.local and restart.";
  }

  return msg;
}

export async function postJson(path, body) {
  const url = getApiUrl(path);

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(body),
    });
  } catch (err) {
    const hint =
      process.env.NODE_ENV === "development"
        ? " Run npm start (not npm run start:web alone). If port 3001 is busy, close old terminals first."
        : "";
    throw new Error(`Could not reach the payment API.${hint} ${(err && err.message) || err}`);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(formatApiErrorMessage(data, res.status));
  }
  return data;
}
