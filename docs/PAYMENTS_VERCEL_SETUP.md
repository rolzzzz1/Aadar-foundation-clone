# Payments: ALLOWED_ORIGINS + Razorpay webhook (Vercel)

## 1. ALLOWED_ORIGINS (Vercel)

Blocks other websites from calling your donation APIs in production.

### Production

Vercel → Project → **Settings** → **Environment Variables** → **Production**:

| Name | Value |
|------|--------|
| `ALLOWED_ORIGINS` | `https://www.aadarfoundation.org,https://aadarfoundation.org` |

- No spaces after commas (or spaces are trimmed).
- No trailing `/` on URLs.
- Mark as **Sensitive** optional (not a secret, but hides from teammates).

### Preview (optional)

Same variable for **Preview**, or add your staging domain:

`https://www.aadarfoundation.org,https://aadarfoundation.org`

Vercel **preview** deploys also auto-allow `https://<your-preview-host>.vercel.app` when `VERCEL_URL` is set.

### Local dev

Leave `ALLOWED_ORIGINS` **unset** in `.env` (all origins allowed), **or** set:

`ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000`

Redeploy after changing Production variables.

---

## 2. Razorpay webhook

Backup path: saves donations to Supabase if the browser never hits `/api/razorpay-verify`.

### Razorpay Dashboard

1. **Settings** → **Webhooks** → **+ New Webhook**
2. **Webhook URL:** `https://www.aadarfoundation.org/api/razorpay-webhook`
3. **Events:** enable **`payment.captured`**
4. **Active** → Save
5. Copy **Webhook Secret** (shown once)

Use **Test mode** webhook + test secret while testing; create a separate **Live mode** webhook before real donations.

### Vercel

| Name | Environment | Notes |
|------|-------------|--------|
| `RAZORPAY_WEBHOOK_SECRET` | Production (+ Preview if testing) | Paste secret from Razorpay — **Sensitive** |

Also ensure Production has live Razorpay keys (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `REACT_APP_RAZORPAY_KEY_ID`) and Supabase vars.

**Redeploy** after adding the secret.

### Test webhook

Razorpay → Webhooks → your webhook → **Send test webhook** (`payment.captured`).

- **200** = signature OK
- **400 Invalid webhook signature** = wrong secret or redeploy needed
- **500 Webhook not configured** = missing `RAZORPAY_WEBHOOK_SECRET` on Vercel

Check Supabase `donations` for `source: webhook` on real captured payments.

---

## 3. Quick checklist

- [ ] `ALLOWED_ORIGINS` on Vercel **Production**
- [ ] `RAZORPAY_WEBHOOK_SECRET` on Vercel **Production**
- [ ] Webhook URL in Razorpay (live mode for live site)
- [ ] Redeploy
- [ ] Test donation on live site → row in Supabase (`source: verify`)
- [ ] Optional: Razorpay test webhook → 200 response

---

## 4. Health check (local only)

`GET http://localhost:3001/api/health` shows `allowed_origins.configured` and `webhook_secret` when env is loaded.
