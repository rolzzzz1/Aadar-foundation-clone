import React, { useCallback, useMemo, useState } from "react";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";

function loadRazorpayCheckoutScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);

    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay script")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.body.appendChild(script);
  });
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export default function RazorpayTestPage() {
  const keyId = process.env.REACT_APP_RAZORPAY_KEY_ID || "";

  const [amountInr, setAmountInr] = useState("1");
  const [name, setName] = useState("Test User");
  const [email, setEmail] = useState("test@example.com");
  const [contact, setContact] = useState("9999999999");
  const [note, setNote] = useState("Test payment");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const amountPaise = useMemo(() => {
    const n = Number(amountInr);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return Math.round(n * 100);
  }, [amountInr]);

  const startPayment = useCallback(async () => {
    setError("");
    setResult(null);

    if (!keyId) {
      setError(
        "Missing REACT_APP_RAZORPAY_KEY_ID. Add it to your environment and redeploy/restart."
      );
      return;
    }
    if (!amountPaise) {
      setError("Enter a valid amount (INR).");
      return;
    }

    setBusy(true);
    try {
      await loadRazorpayCheckoutScript();

      const order = await postJson("/api/razorpay-order", {
        amount: amountPaise,
        currency: "INR",
        receipt: `test_${Date.now()}`,
        notes: { note },
      });

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Aadar Foundation (Test Mode)",
        description: "Razorpay test payment page",
        order_id: order.id,
        prefill: { name, email, contact },
        notes: { note },
        theme: { color: "#4FA953" },
        handler: async (response) => {
          try {
            const verification = await postJson("/api/razorpay-verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setResult({
              ok: true,
              response,
              verification,
            });
          } catch (e) {
            setResult({
              ok: false,
              response,
              verificationError: e?.message || String(e),
            });
          }
        },
        modal: {
          ondismiss: () => setBusy(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        setResult({ ok: false, failed: resp?.error || resp });
        setBusy(false);
      });

      rzp.open();
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }, [amountPaise, contact, email, keyId, name, note]);

  return (
    <MKBox
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
      py={6}
      sx={{ background: "#f6f7fb" }}
    >
      <Card style={{ width: "min(920px, 100%)" }}>
        <MKBox p={3}>
          <MKTypography variant="h4">Razorpay Test Mode</MKTypography>
          <MKTypography variant="body2" color="text" mt={1}>
            Hidden route: <code>/__razorpay-test</code>. This page is not linked from the navbar.
          </MKTypography>
        </MKBox>

        <Divider />

        <MKBox p={3}>
          {!keyId && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Set <code>REACT_APP_RAZORPAY_KEY_ID</code> (public test key) for the checkout to work.
            </Alert>
          )}

          <Stack spacing={2}>
            <TextField
              label="Amount (INR)"
              value={amountInr}
              onChange={(e) => setAmountInr(e.target.value)}
              inputProps={{ inputMode: "decimal" }}
              helperText={`Charged amount: ₹${amountInr || 0} (${amountPaise} paise)`}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                fullWidth
              />
            </Stack>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Note" value={note} onChange={(e) => setNote(e.target.value)} />

            {error && <Alert severity="error">{error}</Alert>}

            <MKButton
              variant="contained"
              color="success"
              onClick={startPayment}
              disabled={busy}
              sx={{ alignSelf: "flex-start", minWidth: 220 }}
            >
              {busy ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                  <CircularProgress size={18} color="inherit" /> Opening Checkout…
                </span>
              ) : (
                "Pay with Razorpay (Test)"
              )}
            </MKButton>

            {result && (
              <MKBox>
                <Alert severity={result.ok ? "success" : "warning"} sx={{ mb: 1 }}>
                  {result.ok
                    ? "Payment succeeded and signature verified."
                    : "Payment result received (see details)."}
                </Alert>
                <pre
                  style={{
                    margin: 0,
                    padding: 12,
                    background: "#0b1020",
                    color: "#e7eaff",
                    borderRadius: 10,
                    overflow: "auto",
                    fontSize: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {JSON.stringify(result, null, 2)}
                </pre>
              </MKBox>
            )}
          </Stack>
        </MKBox>
      </Card>
    </MKBox>
  );
}
