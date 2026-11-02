import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import DonationReceiptSheet from "components/DonationReceiptSheet";
import MKButton from "components/MKButton";
import aadarLogo from "assets/images/logos/logo-aadar.jpg";
import { formatApiErrorMessage, getApiUrl } from "utils/api";
import {
  validateAddressLine,
  validateContactIN,
  validateEmail,
  validatePan,
  validatePinIn,
} from "utils/donation";

const fieldSx = {
  "& .MuiInputBase-input": { fontSize: { xs: "0.9375rem", sm: "0.975rem" } },
  "& .MuiInputLabel-root": { fontSize: { xs: "0.875rem", sm: "0.9375rem" }, fontWeight: 600 },
  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function isoToDateInput(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso).slice(0, 10);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function emptyLookup() {
  return { paymentMethod: "upi", transactionRef: "", razorpayBy: "receipt_no" };
}

function validateLoadedForm(form, t) {
  const amount = Math.round(Number(form.amountInr));
  if (!Number.isFinite(amount) || amount < 1) return t("adminPortal.validationAmount");
  if (amount > 500000) return t("adminPortal.validationMaxAmount");
  if (!form.paidAt) return t("adminPortal.validationPaidAt");
  if (!String(form.donorName || "").trim()) return t("adminPortal.validationName");
  if (!validateEmail(form.donorEmail).ok) return t("adminPortal.validationEmail");
  if (!validateContactIN(form.donorContact).ok) return t("adminPortal.validationMobile");
  if (!validatePan(form.donorPan).ok) return t("adminPortal.validationPan");
  if (!validateAddressLine(form.donorAddress).ok) return t("adminPortal.validationAddress");
  if (!String(form.donorState || "").trim()) return t("adminPortal.validationState");
  if (!String(form.donorCity || "").trim()) return t("adminPortal.validationCity");
  if (!validatePinIn(form.donorPin).ok) return t("adminPortal.validationPin");
  return "";
}

async function postAdmin(path, body, { secret, username }) {
  const res = await fetch(getApiUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Admin-Receipt-Secret": secret,
      "X-Admin-Receipt-Username": username || "",
    },
    credentials: "same-origin",
    body: JSON.stringify({ ...body, secret, username }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(formatApiErrorMessage(data, res.status));
  return data;
}

function formFromRecord(record, paymentMethod) {
  const donor = record?.donor || {};
  const digits = String(donor.contact || "").replace(/\D/g, "");
  const paymentId = String(record?.paymentId || "");
  const donorOnly = paymentMethod === "razorpay";
  const transactionRef = donorOnly ? paymentId : paymentId.replace(/^(upi_|bank_)/i, "");
  return {
    paymentMethod,
    donorOnly,
    paymentId,
    transactionRef,
    receiptNo: record?.receiptNo || "",
    amountInr: record?.amountInr ? String(record.amountInr) : "",
    paidAt: isoToDateInput(record?.paidAt) || todayIsoDate(),
    donorName: donor.name || "",
    fatherOrHusbandName: donor.fatherOrHusbandName || "",
    donorEmail: donor.email || "",
    donorContact: digits.length >= 10 ? digits.slice(-10) : digits,
    donorPan: donor.pan || "",
    donorAddress: donor.address || "",
    donorState: donor.state || "",
    donorCity: donor.city || "",
    donorPin: donor.pin || "",
    programLabel: record?.programLabel || "",
    purpose: record?.purpose || "",
    locale: record?.locale === "hi" ? "hi" : "en",
  };
}

export default function AdminReceiptUpdate({ onBack, onLogout, adminSecret, adminUsername }) {
  const { t } = useTranslation();
  const [lookup, setLookup] = useState(emptyLookup);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailTarget, setEmailTarget] = useState("");
  const [sendToEmail, setSendToEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const previewRecord = useMemo(() => result?.record || null, [result]);
  const panFieldCheck = validatePan(form?.donorPan || "");
  const donorEmail = String(previewRecord?.donor?.email || result?.donor_email || "").trim();
  const canEmailDonor = Boolean(donorEmail && previewRecord?.verified && previewRecord?.paymentId);
  const sendToCheck = validateEmail(sendToEmail);
  const canSendToAddress = Boolean(
    previewRecord?.verified && previewRecord?.paymentId && sendToCheck.ok
  );

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setError("");
  };

  const resetLookup = () => {
    setLookup(emptyLookup());
    setForm(null);
    setResult(null);
    setError("");
    setEmailMsg("");
    setSendToEmail("");
    setEmailTarget("");
  };

  const handleFind = async (event) => {
    event.preventDefault();
    const ref = String(lookup.transactionRef || "").trim();
    if (!ref) {
      if (lookup.paymentMethod === "bank") setError(t("adminPortal.validationBankRef"));
      else if (lookup.paymentMethod === "razorpay") {
        setError(
          lookup.razorpayBy === "payment_id"
            ? t("adminPortal.enterPaymentId")
            : t("adminPortal.enterReceiptNo")
        );
      } else setError(t("adminPortal.validationUtr"));
      return;
    }
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const isRazorpay = lookup.paymentMethod === "razorpay";
      const response = await postAdmin(
        "/api/admin-donation-receipt-lookup",
        isRazorpay
          ? lookup.razorpayBy === "payment_id"
            ? { mode: "payment_id", payment_id: ref }
            : { mode: "receipt_no", receipt_no: ref }
          : {
              mode: "transaction_ref",
              payment_method: lookup.paymentMethod,
              transaction_ref: ref,
            },
        { secret: adminSecret, username: adminUsername }
      );
      const paymentId = String(response.record?.paymentId || "");
      if (isRazorpay && (paymentId.startsWith("upi_") || paymentId.startsWith("bank_"))) {
        setError(t("adminPortal.useManualTab"));
        return;
      }
      setForm(formFromRecord(response.record, lookup.paymentMethod));
    } catch (err) {
      setForm(null);
      setError((err && err.message) || t("adminPortal.lookupFailed"));
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!form) return;
    const validationError = validateLoadedForm(form, t);
    if (validationError) {
      setError(validationError);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const donorFields = {
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
      };
      const response = await postAdmin(
        "/api/admin-donation-receipt",
        form.donorOnly
          ? {
              update: true,
              donor_only: true,
              payment_id: form.paymentId,
              ...donorFields,
            }
          : {
              update: true,
              payment_method: form.paymentMethod === "bank" ? "bank_transfer" : "upi",
              transaction_ref: form.transactionRef,
              amount_inr: Math.round(Number(form.amountInr)),
              paid_at: form.paidAt,
              ...donorFields,
            },
        { secret: adminSecret, username: adminUsername }
      );
      setResult(response);
      setEmailMsg("");
      setSendToEmail("");
    } catch (err) {
      setError((err && err.message) || t("adminPortal.updateFailed"));
    } finally {
      setBusy(false);
    }
  };

  const sendReceipt = async (toEmail, target) => {
    if (!previewRecord?.paymentId || emailBusy) return;
    setError("");
    setEmailMsg(t("adminPortal.sendingEmail"));
    setEmailTarget(target);
    setEmailBusy(true);
    try {
      const response = await postAdmin(
        "/api/admin-donation-receipt-lookup",
        {
          mode: "resend_email",
          payment_id: previewRecord.paymentId,
          receipt_no: result.receipt_no || previewRecord.receiptNo || "",
          to_email: toEmail || "",
          locale: previewRecord.locale === "hi" ? "hi" : "en",
        },
        { secret: adminSecret, username: adminUsername }
      );
      const sentTo = response.email || toEmail || donorEmail;
      const receiptNo = response.receipt_no || result.receipt_no || previewRecord.receiptNo || "";
      setEmailMsg(t("adminPortal.emailSentTo", { receiptNo, email: sentTo }));
    } catch (err) {
      setEmailMsg("");
      setError((err && err.message) || t("adminPortal.emailSendFailed"));
    } finally {
      setEmailBusy(false);
      setEmailTarget("");
    }
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1.5}
        mb={2.5}
      >
        <Box>
          <Typography sx={{ fontWeight: 800, color: "#1f2a44", fontSize: "1.35rem" }}>
            {t("adminPortal.updateTitle")}
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: "0.9rem", mt: 0.5 }}>
            {t("adminPortal.updateSubtitle")}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <MKButton
            variant="outlined"
            color="dark"
            onClick={onBack}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            {t("adminPortal.back")}
          </MKButton>
          <MKButton
            variant="text"
            color="dark"
            onClick={onLogout}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            {t("adminPortal.logout")}
          </MKButton>
        </Stack>
      </Stack>

      {!form && !result ? (
        <Card
          component="form"
          onSubmit={handleFind}
          sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: "18px" }}
        >
          <Typography sx={{ fontWeight: 800, color: "#1f2a44", mb: 1.25 }}>
            {t("adminPortal.paymentDetails")}
          </Typography>
          <Tabs
            value={lookup.paymentMethod}
            onChange={(_, value) => {
              setLookup({ paymentMethod: value, transactionRef: "", razorpayBy: "receipt_no" });
              setError("");
            }}
            sx={{
              mb: 2,
              minHeight: 40,
              "& .MuiTab-root": { textTransform: "none", fontWeight: 700 },
            }}
          >
            <Tab value="upi" label={t("adminPortal.methodUpi")} />
            <Tab value="bank" label={t("adminPortal.methodBank")} />
            <Tab value="razorpay" label={t("adminPortal.methodRazorpay")} />
          </Tabs>
          {lookup.paymentMethod === "razorpay" ? (
            <TextField
              select
              label={t("adminPortal.lookupBy")}
              value={lookup.razorpayBy}
              onChange={(event) => {
                setLookup((prev) => ({
                  ...prev,
                  razorpayBy: event.target.value,
                  transactionRef: "",
                }));
                setError("");
              }}
              SelectProps={{ native: true }}
              fullWidth
              sx={{ ...fieldSx, mb: 2 }}
            >
              <option value="receipt_no">{t("adminPortal.receiptNo")}</option>
              <option value="payment_id">{t("adminPortal.razorpayPaymentId")}</option>
            </TextField>
          ) : null}
          <TextField
            label={
              lookup.paymentMethod === "bank"
                ? t("adminPortal.bankRef")
                : lookup.paymentMethod === "razorpay"
                ? lookup.razorpayBy === "payment_id"
                  ? t("adminPortal.razorpayPaymentId")
                  : t("adminPortal.receiptNo")
                : t("adminPortal.upiRef")
            }
            value={lookup.transactionRef}
            onChange={(event) => {
              setLookup((prev) => ({ ...prev, transactionRef: event.target.value }));
              setError("");
            }}
            placeholder={
              lookup.paymentMethod === "bank"
                ? "HDFC123456789"
                : lookup.paymentMethod === "razorpay"
                ? lookup.razorpayBy === "payment_id"
                  ? "pay_..."
                  : "AADAR-2026-000001"
                : "123456789012"
            }
            fullWidth
            required
            sx={fieldSx}
          />
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
              busy ? <CircularProgress size={18} color="inherit" /> : <SearchOutlinedIcon />
            }
            sx={{ mt: 2.5, py: 1.35, fontWeight: 800, textTransform: "none", borderRadius: "12px" }}
          >
            {busy ? t("adminPortal.findingReceipt") : t("adminPortal.findReceipt")}
          </MKButton>
        </Card>
      ) : null}

      {form && !result ? (
        <Card
          component="form"
          onSubmit={handleSave}
          sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: "18px" }}
        >
          <Alert severity="info" sx={{ mb: 2.5 }}>
            {t(form.donorOnly ? "adminPortal.razorpayUpdateAlert" : "adminPortal.updateAlert", {
              receiptNo: form.receiptNo || "—",
            })}
          </Alert>
          <Typography sx={{ fontWeight: 800, color: "#1f2a44", mb: 1.25 }}>
            {t("adminPortal.paymentDetails")}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label={t("adminPortal.receiptNo")}
                value={form.receiptNo || "—"}
                fullWidth
                disabled
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={
                  form.donorOnly
                    ? t("adminPortal.razorpayPaymentId")
                    : form.paymentMethod === "bank"
                    ? t("adminPortal.bankRef")
                    : t("adminPortal.upiRef")
                }
                value={form.transactionRef}
                fullWidth
                disabled
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t("adminPortal.amount")}
                type="number"
                value={form.amountInr}
                onChange={updateField("amountInr")}
                fullWidth
                required
                disabled={form.donorOnly}
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t("adminPortal.paidAt")}
                type="date"
                value={form.paidAt}
                onChange={updateField("paidAt")}
                fullWidth
                required
                disabled={form.donorOnly}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
            </Grid>
          </Grid>

          <Typography sx={{ fontWeight: 800, color: "#1f2a44", mt: 2.5, mb: 1.25 }}>
            {t("adminPortal.donorDetails")}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label={t("adminPortal.name")}
                value={form.donorName}
                onChange={updateField("donorName")}
                fullWidth
                required
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t("adminPortal.fatherHusband")}
                value={form.fatherOrHusbandName}
                onChange={updateField("fatherOrHusbandName")}
                fullWidth
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t("adminPortal.email")}
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
                label={t("adminPortal.mobile")}
                value={form.donorContact}
                onChange={updateField("donorContact")}
                fullWidth
                required
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t("adminPortal.panOptional")}
                value={form.donorPan}
                onChange={(event) => {
                  const next = String(event.target.value || "")
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 10);
                  setForm((prev) => ({ ...prev, donorPan: next }));
                  setError("");
                }}
                fullWidth
                error={!panFieldCheck.ok}
                helperText={
                  panFieldCheck.ok
                    ? form.donorPan.trim()
                      ? ""
                      : t("adminPortal.panExemptionNote")
                    : t("adminPortal.validationPan")
                }
                FormHelperTextProps={{
                  sx: {
                    color: "#d32f2f",
                    mx: 0.25,
                    mt: 0.5,
                    fontWeight: 500,
                    fontSize: "0.8rem",
                    lineHeight: 1.45,
                  },
                }}
                inputProps={{ maxLength: 10, autoCapitalize: "characters" }}
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t("adminPortal.address")}
                value={form.donorAddress}
                onChange={updateField("donorAddress")}
                fullWidth
                required
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label={t("adminPortal.city")}
                value={form.donorCity}
                onChange={updateField("donorCity")}
                fullWidth
                required
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label={t("adminPortal.state")}
                value={form.donorState}
                onChange={updateField("donorState")}
                fullWidth
                required
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label={t("adminPortal.pinCode")}
                value={form.donorPin}
                onChange={updateField("donorPin")}
                fullWidth
                required
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t("adminPortal.programOptional")}
                value={form.programLabel}
                onChange={updateField("programLabel")}
                fullWidth
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t("adminPortal.purposeOptional")}
                value={form.purpose}
                onChange={updateField("purpose")}
                fullWidth
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label={t("adminPortal.receiptLanguage")}
                value={form.locale}
                onChange={updateField("locale")}
                SelectProps={{ native: true }}
                sx={fieldSx}
              >
                <option value="en">{t("adminPortal.langEnglish")}</option>
                <option value="hi">{t("adminPortal.langHindi")}</option>
              </TextField>
            </Grid>
          </Grid>

          {error ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          ) : null}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 2.5 }}>
            <MKButton
              type="submit"
              variant="contained"
              color="success"
              disabled={busy}
              sx={{ fontWeight: 800, textTransform: "none", borderRadius: "12px", py: 1.2 }}
            >
              {busy ? t("adminPortal.updatingReceipt") : t("adminPortal.updateButton")}
            </MKButton>
            <MKButton
              variant="outlined"
              color="dark"
              disabled={busy}
              onClick={resetLookup}
              sx={{ fontWeight: 700, textTransform: "none", borderRadius: "12px" }}
            >
              {t("adminPortal.findAnother")}
            </MKButton>
          </Stack>
        </Card>
      ) : null}

      {result ? (
        <Stack spacing={2.5}>
          <Alert severity="success" icon={<CheckCircleIcon />}>
            {t("adminPortal.receiptUpdatedReview", {
              receiptNo: result.receipt_no || previewRecord?.receiptNo || "",
            })}
          </Alert>
          {previewRecord ? (
            <Card sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: "18px" }}>
              <DonationReceiptSheet record={previewRecord} logoSrc={aadarLogo} />
            </Card>
          ) : null}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <MKButton
              fullWidth
              variant="contained"
              color="success"
              onClick={() => sendReceipt("", "donor")}
              disabled={!canEmailDonor || emailBusy}
              startIcon={
                emailBusy && emailTarget === "donor" ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <EmailOutlinedIcon />
                )
              }
              sx={{ fontWeight: 800, textTransform: "none", borderRadius: "10px" }}
            >
              {emailBusy && emailTarget === "donor"
                ? t("adminPortal.sendingEmail")
                : donorEmail
                ? t("adminPortal.emailToDonor")
                : t("adminPortal.noDonorEmail")}
            </MKButton>
            <MKButton
              fullWidth
              variant="outlined"
              color="success"
              onClick={resetLookup}
              disabled={emailBusy}
              sx={{ fontWeight: 700, textTransform: "none", borderRadius: "10px" }}
            >
              {t("adminPortal.updateAnother")}
            </MKButton>
          </Stack>
          {donorEmail ? (
            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: "rgba(31,42,68,0.62)", fontSize: "0.84rem" }}
            >
              {t("adminPortal.willEmailTo", { email: donorEmail })}
            </Typography>
          ) : null}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.25}
            alignItems={{ xs: "stretch", sm: "flex-start" }}
          >
            <TextField
              label={t("adminPortal.sendToEmailLabel")}
              placeholder={t("adminPortal.sendToEmailPlaceholder")}
              value={sendToEmail}
              onChange={(event) => setSendToEmail(event.target.value)}
              type="email"
              fullWidth
              disabled={emailBusy}
              sx={fieldSx}
            />
            <MKButton
              variant="contained"
              color="success"
              onClick={() => {
                if (!sendToCheck.ok) {
                  setError(t("adminPortal.enterSendEmail"));
                  return;
                }
                sendReceipt(sendToCheck.value, "address");
              }}
              disabled={!canSendToAddress || emailBusy}
              startIcon={
                emailBusy && emailTarget === "address" ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <EmailOutlinedIcon />
                )
              }
              sx={{
                fontWeight: 800,
                textTransform: "none",
                borderRadius: "10px",
                minWidth: { sm: 190 },
                height: 44,
                mt: { sm: "8px" },
              }}
            >
              {emailBusy && emailTarget === "address"
                ? t("adminPortal.sendingEmail")
                : t("adminPortal.sendToThisEmail")}
            </MKButton>
          </Stack>
          {emailMsg ? (
            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: "#2e7d32", fontWeight: 600 }}
            >
              {emailMsg}
            </Typography>
          ) : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      ) : null}
    </Box>
  );
}

AdminReceiptUpdate.propTypes = {
  onBack: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  adminSecret: PropTypes.string.isRequired,
  adminUsername: PropTypes.string,
};

AdminReceiptUpdate.defaultProps = {
  adminUsername: "",
};
