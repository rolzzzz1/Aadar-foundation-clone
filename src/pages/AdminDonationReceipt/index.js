import React, { useEffect, useMemo, useState } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import DonationReceiptSheet from "components/DonationReceiptSheet";
import MKButton from "components/MKButton";
import MKBox from "components/MKBox";
import aadarLogo from "assets/images/logos/logo-aadar.jpg";
import { formatApiErrorMessage, getApiUrl } from "utils/api";
import {
  validateAddressLine,
  validateContactIN,
  validateEmail,
  validatePan,
  validatePinIn,
  validateRequiredSelection,
} from "utils/donation";

const ADMIN_SECRET_KEY = "aadar_admin_receipt_secret";

const fieldSx = {
  "& .MuiInputBase-input": { fontSize: { xs: "0.9375rem", sm: "0.975rem" } },
  "& .MuiInputLabel-root": { fontSize: { xs: "0.875rem", sm: "0.9375rem" }, fontWeight: 600 },
  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
};

const emptyForm = {
  paymentMethod: "upi",
  transactionRef: "",
  amountInr: "",
  paidAt: new Date().toISOString().slice(0, 10),
  donorName: "",
  fatherOrHusbandName: "",
  donorEmail: "",
  donorContact: "",
  donorPan: "",
  donorAddress: "",
  donorState: "",
  donorCity: "",
  donorPin: "",
  programLabel: "",
  purpose: "",
  locale: "en",
  resendIfExists: false,
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

async function postAdminReceipt(body, secret) {
  const url = getApiUrl("/api/admin-donation-receipt");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Admin-Receipt-Secret": secret,
    },
    credentials: "same-origin",
    body: JSON.stringify({ ...body, secret }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(formatApiErrorMessage(data, res.status));
  }
  return data;
}

function validateForm(form) {
  const amount = Math.round(Number(form.amountInr));
  if (!Number.isFinite(amount) || amount < 1) {
    return "Enter a valid donation amount in INR.";
  }
  if (amount > 500000) {
    return "Maximum donation amount is ₹5,00,000.";
  }

  const ref = String(form.transactionRef || "").trim();
  if (!ref) {
    return form.paymentMethod === "bank"
      ? "Bank transaction reference is required."
      : "UPI transaction reference (UTR) is required.";
  }

  if (!form.paidAt) return "Payment date is required.";

  const nameCheck = validateRequiredSelection(form.donorName, "Donor name");
  if (!nameCheck.ok) return nameCheck.error;

  const emailCheck = validateEmail(form.donorEmail);
  if (!emailCheck.ok) return emailCheck.error;

  const contactCheck = validateContactIN(form.donorContact);
  if (!contactCheck.ok) return contactCheck.error;

  const panCheck = validatePan(form.donorPan);
  if (!panCheck.ok || !panCheck.value) {
    return panCheck.error || "PAN is required for the 80G receipt.";
  }

  const addressCheck = validateAddressLine(form.donorAddress);
  if (!addressCheck.ok) return addressCheck.error;

  const stateCheck = validateRequiredSelection(form.donorState, "State");
  if (!stateCheck.ok) return stateCheck.error;

  const cityCheck = validateRequiredSelection(form.donorCity, "City");
  if (!cityCheck.ok) return cityCheck.error;

  const pinCheck = validatePinIn(form.donorPin);
  if (!pinCheck.ok) return pinCheck.error;

  return "";
}

function buildPayload(form) {
  return {
    payment_method: form.paymentMethod === "bank" ? "bank_transfer" : "upi",
    transaction_ref: String(form.transactionRef || "").trim(),
    amount_inr: Math.round(Number(form.amountInr)),
    paid_at: form.paidAt,
    donor_name: form.donorName.trim(),
    donor_father_or_husband: form.fatherOrHusbandName.trim(),
    donor_email: form.donorEmail.trim(),
    donor_contact: form.donorContact.trim(),
    donor_pan: form.donorPan.trim(),
    donor_address: form.donorAddress.trim(),
    donor_state: form.donorState.trim(),
    donor_city: form.donorCity.trim(),
    donor_pin: form.donorPin.trim(),
    program_label: form.programLabel.trim(),
    purpose: form.purpose.trim(),
    locale: form.locale,
    resend: form.resendIfExists,
  };
}

export default function AdminDonationReceiptPage() {
  const [adminSecret, setAdminSecret] = useState("");
  const [secretInput, setSecretInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [form, setForm] = useState({ ...emptyForm, paidAt: todayIsoDate() });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(ADMIN_SECRET_KEY);
      if (stored) {
        setAdminSecret(stored);
        setUnlocked(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const previewRecord = useMemo(() => result?.record || null, [result]);

  const handleUnlock = () => {
    const trimmed = secretInput.trim();
    if (!trimmed) {
      setError("Enter the admin password.");
      return;
    }
    setError("");
    setAdminSecret(trimmed);
    setUnlocked(true);
    try {
      sessionStorage.setItem(ADMIN_SECRET_KEY, trimmed);
    } catch {
      /* ignore */
    }
  };

  const handleLogout = () => {
    setUnlocked(false);
    setAdminSecret("");
    setSecretInput("");
    setResult(null);
    setError("");
    try {
      sessionStorage.removeItem(ADMIN_SECRET_KEY);
    } catch {
      /* ignore */
    }
  };

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);
    try {
      const payload = buildPayload(form);
      const response = await postAdminReceipt(payload, adminSecret);
      setResult(response);
      if (!response.receipt_email_sent) {
        setError(
          response.email_reason === "already_sent"
            ? "Receipt saved, but email was already sent for this donation."
            : "Receipt saved, but the email could not be sent. Check Resend configuration and try resend."
        );
      }
    } catch (err) {
      setError((err && err.message) || "Could not issue receipt.");
    } finally {
      setBusy(false);
    }
  };

  const handleIssueAnother = () => {
    setResult(null);
    setError("");
    setForm({ ...emptyForm, paidAt: todayIsoDate() });
  };

  if (!unlocked) {
    return (
      <MKBox minHeight="100vh" sx={{ bgcolor: "#eef1f6", pt: { xs: 8, md: 10 }, pb: 6 }}>
        <Container maxWidth="sm">
          <Card sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "18px" }}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <LockOutlinedIcon sx={{ fontSize: 40, color: "#2e7d32" }} />
              <Typography sx={{ fontWeight: 800, color: "#1f2a44", fontSize: "1.2rem" }}>
                Admin — Issue donation receipt
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.55 }}>
                Enter the admin password to create and email 80G receipts for verified UPI / QR and
                bank transfer donations.
              </Typography>
              <TextField
                label="Admin password"
                type="password"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                fullWidth
                sx={fieldSx}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUnlock();
                }}
              />
              {error ? <Alert severity="error">{error}</Alert> : null}
              <MKButton
                variant="contained"
                color="success"
                onClick={handleUnlock}
                sx={{ fontWeight: 800, textTransform: "none", borderRadius: "12px", px: 3 }}
              >
                Continue
              </MKButton>
            </Stack>
          </Card>
        </Container>
      </MKBox>
    );
  }

  return (
    <MKBox minHeight="100vh" sx={{ bgcolor: "#eef1f6", pt: { xs: 3, md: 4 }, pb: 6 }}>
      <Container maxWidth="md">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={1.5}
          mb={2.5}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, color: "#1f2a44", fontSize: "1.35rem" }}>
              Issue donation receipt
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.9rem", mt: 0.5 }}>
              For verified UPI / QR and bank transfer donations only.
            </Typography>
          </Box>
          <MKButton
            variant="outlined"
            color="dark"
            onClick={handleLogout}
            sx={{ alignSelf: { xs: "flex-start", sm: "center" }, textTransform: "none" }}
          >
            Lock page
          </MKButton>
        </Stack>

        {!result ? (
          <Card
            component="form"
            onSubmit={handleSubmit}
            sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: "18px" }}
          >
            <Alert severity="info" sx={{ mb: 2.5 }}>
              Verify the donor&apos;s payment screenshot and bank/UPI details before issuing the
              receipt. The PDF will be emailed to the donor automatically.
            </Alert>

            <Typography sx={{ fontWeight: 800, color: "#1f2a44", mb: 1.25 }}>
              Payment details
            </Typography>
            <Tabs
              value={form.paymentMethod}
              onChange={(_, value) => {
                setForm((prev) => ({ ...prev, paymentMethod: value, transactionRef: "" }));
                setError("");
              }}
              sx={{
                mb: 2,
                minHeight: 40,
                "& .MuiTab-root": { textTransform: "none", fontWeight: 700 },
              }}
            >
              <Tab value="upi" label="UPI / QR" />
              <Tab value="bank" label="Bank transfer" />
            </Tabs>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label={
                    form.paymentMethod === "bank"
                      ? "Bank transaction reference"
                      : "UPI reference (UTR)"
                  }
                  value={form.transactionRef}
                  onChange={updateField("transactionRef")}
                  placeholder={form.paymentMethod === "bank" ? "NEFT123456789" : "123456789012"}
                  fullWidth
                  required
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Amount (₹)"
                  type="number"
                  inputProps={{ min: 1, step: 1 }}
                  value={form.amountInr}
                  onChange={updateField("amountInr")}
                  fullWidth
                  required
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Payment date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.paidAt}
                  onChange={updateField("paidAt")}
                  fullWidth
                  required
                  sx={fieldSx}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2.5 }} />

            <Typography sx={{ fontWeight: 800, color: "#1f2a44", mb: 1.25 }}>
              Donor details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Full name"
                  value={form.donorName}
                  onChange={updateField("donorName")}
                  fullWidth
                  required
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Father / husband name"
                  value={form.fatherOrHusbandName}
                  onChange={updateField("fatherOrHusbandName")}
                  fullWidth
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  type="email"
                  value={form.donorEmail}
                  onChange={updateField("donorEmail")}
                  fullWidth
                  required
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Mobile"
                  type="tel"
                  value={form.donorContact}
                  onChange={updateField("donorContact")}
                  placeholder="9826441863"
                  fullWidth
                  required
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="PAN"
                  value={form.donorPan}
                  onChange={updateField("donorPan")}
                  placeholder="ABCDE1234F"
                  fullWidth
                  required
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  value={form.donorAddress}
                  onChange={updateField("donorAddress")}
                  fullWidth
                  required
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="City"
                  value={form.donorCity}
                  onChange={updateField("donorCity")}
                  fullWidth
                  required
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="State"
                  value={form.donorState}
                  onChange={updateField("donorState")}
                  fullWidth
                  required
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="PIN code"
                  value={form.donorPin}
                  onChange={updateField("donorPin")}
                  fullWidth
                  required
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Program (optional)"
                  value={form.programLabel}
                  onChange={updateField("programLabel")}
                  fullWidth
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Purpose / note (optional)"
                  value={form.purpose}
                  onChange={updateField("purpose")}
                  fullWidth
                  sx={fieldSx}
                />
              </Grid>
            </Grid>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" mt={2.5}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.resendIfExists}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, resendIfExists: e.target.checked }))
                    }
                  />
                }
                label="Re-send email if this transaction already exists"
              />
              <TextField
                select
                label="Receipt language"
                value={form.locale}
                onChange={updateField("locale")}
                SelectProps={{ native: true }}
                sx={{ ...fieldSx, minWidth: 160 }}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </TextField>
            </Stack>

            {error ? (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            ) : null}

            <MKButton
              type="submit"
              variant="contained"
              color="success"
              disabled={busy}
              startIcon={
                busy ? <CircularProgress size={18} color="inherit" /> : <SendOutlinedIcon />
              }
              sx={{
                mt: 2.5,
                py: 1.35,
                fontWeight: 800,
                textTransform: "none",
                borderRadius: "12px",
              }}
            >
              {busy ? "Creating receipt…" : "Create receipt & email donor"}
            </MKButton>
          </Card>
        ) : (
          <Stack spacing={2.5}>
            <Alert
              severity={result.receipt_email_sent ? "success" : "warning"}
              icon={result.receipt_email_sent ? <CheckCircleIcon /> : undefined}
            >
              {result.receipt_email_sent
                ? `Receipt ${result.receipt_no || ""} emailed to ${result.donor_email}.`
                : `Receipt ${result.receipt_no || ""} saved, but email was not sent.`}
            </Alert>

            {previewRecord ? (
              <Card sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: "18px" }}>
                <DonationReceiptSheet record={previewRecord} logoSrc={aadarLogo} />
              </Card>
            ) : null}

            <MKButton
              variant="outlined"
              color="success"
              onClick={handleIssueAnother}
              sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 700 }}
            >
              Issue another receipt
            </MKButton>
          </Stack>
        )}
      </Container>
    </MKBox>
  );
}
