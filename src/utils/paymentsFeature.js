/**
 * Client-side payments gate (CRA bakes env at build time).
 *
 * | Environment              | Default | Enable testing                    |
 * |--------------------------|---------|-----------------------------------|
 * | npm start (local)        | ON      | —                                 |
 * | Vercel Production        | OFF     | REACT_APP_PAYMENTS_ENABLED=true   |
 * | Vercel Preview           | OFF     | REACT_APP_PAYMENTS_ENABLED=true   |
 *
 * When going live, set REACT_APP_PAYMENTS_ENABLED=true on Vercel Production
 * (and PAYMENTS_ENABLED=true for the API — see .env.example).
 */
export function isPaymentsEnabled() {
  const flag = process.env.REACT_APP_PAYMENTS_ENABLED;
  if (flag === "true") return true;
  if (flag === "false") return false;
  return process.env.NODE_ENV !== "production";
}
