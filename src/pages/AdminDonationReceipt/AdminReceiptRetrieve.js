import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { validateEmail } from "utils/donation";

import DonationReceiptSheet from "components/DonationReceiptSheet";
import MKButton from "components/MKButton";
import aadarLogo from "assets/images/logos/logo-aadar.jpg";
import { formatInr } from "utils/receiptFormat";

const panelGreen = "#edf7ee";

const fieldSx = {
  "& .MuiInputBase-input": { fontSize: { xs: "0.9375rem", sm: "0.975rem" } },
  "& .MuiInputLabel-root": { fontSize: { xs: "0.875rem", sm: "0.9375rem" }, fontWeight: 600 },
  "& .MuiOutlinedInput-root": { borderRadius: "12px", backgroundColor: "#f8fafc" },
};

const tabSx = {
  minHeight: 44,
  p: 0.5,
  borderRadius: "12px",
  bgcolor: "rgba(46, 125, 50, 0.06)",
  border: "1px solid rgba(46, 125, 50, 0.14)",
  "& .MuiTabs-flexContainer": { gap: 0.5 },
  "& .MuiTab-root": {
    minHeight: 38,
    flex: 1,
    minWidth: 0,
    textTransform: "none",
    fontWeight: 600,
    fontSize: { xs: "0.78rem", sm: "0.88rem" },
    borderRadius: "10px",
    px: { xs: 0.5, sm: 1 },
    "&.Mui-selected": {
      color: "#174f28",
      fontWeight: 700,
      bgcolor: "#fff",
      boxShadow: "0 2px 8px rgba(30, 107, 53, 0.1)",
    },
  },
  "& .MuiTabs-indicator": { display: "none" },
};

const emptyLookup = { method: "mobile", value: "" };

function normalizeContact(v) {
  const digits = String(v || "").replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

function normalizeReceiptNoInput(v) {
  return String(v || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

function formatPaidAt(iso, locale) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(locale === "hi" ? "hi-IN" : "en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function isLookupValid(method, value) {
  if (method === "mobile") return normalizeContact(value).length === 10;
  if (method === "email") return validateEmail(value).ok;
  return normalizeReceiptNoInput(value).length >= 8;
}

function lookupInvalidMessage(method, t) {
  if (method === "mobile") return t("adminPortal.enterMobile");
  if (method === "email") return t("adminPortal.enterEmail");
  return t("adminPortal.enterReceiptNo");
}

function fieldLabel(method, t) {
  if (method === "mobile") return t("receiptRetrieve.mobile");
  if (method === "email") return t("adminPortal.email");
  return t("adminPortal.receiptNo");
}

function fieldPlaceholder(method) {
  if (method === "mobile") return "9826441863";
  if (method === "email") return "donor@example.com";
  return "AADAR-2026-000001";
}

async function postAdminLookup(body, { secret, username }) {
  const res = await fetch("/api/admin-donation-receipt-lookup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Receipt-Secret": secret,
      "X-Admin-Receipt-Username": username || "",
    },
    body: JSON.stringify({ ...body, secret, username }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Lookup failed");
    err.status = res.status;
    throw err;
  }
  return data;
}

export default function AdminReceiptRetrieve({ onBack, onLogout, adminSecret, adminUsername }) {
  const { t, i18n } = useTranslation();
  const receiptLocale = i18n.language === "hi" ? "hi" : "en";
  const [lookup, setLookup] = useState(emptyLookup);
  const [donationsList, setDonationsList] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [downloadMsg, setDownloadMsg] = useState("");
  const [record, setRecord] = useState(null);
  const donationsHeadingRef = useRef(null);

  const resetResult = () => {
    setRecord(null);
    setError("");
    setDownloadMsg("");
    setDonationsList(null);
  };

  const handleDownload = async () => {
    if (!record || !record.verified) return;
    setDownloadMsg(t("adminPortal.preparingPdf"));
    const { downloadReceiptPdf } = await import("utils/donationReceipt");
    const result = await downloadReceiptPdf(record);
    setDownloadMsg(
      result === "pdf" ? t("donationResult.pdfDownloaded") : t("donationResult.downloadFailed")
    );
  };

  const handleFindDonations = async () => {
    resetResult();
    if (!isLookupValid(lookup.method, lookup.value)) {
      setError(lookupInvalidMessage(lookup.method, t));
      return;
    }

    setBusy(true);
    try {
      if (lookup.method === "receipt_no") {
        const result = await postAdminLookup(
          {
            mode: "receipt_no",
            receipt_no: normalizeReceiptNoInput(lookup.value),
            locale: receiptLocale,
          },
          { secret: adminSecret, username: adminUsername }
        );
        if (!result?.record) throw new Error(t("adminPortal.receiptNotFound"));
        setRecord(result.record);
        return;
      }

      const contactPayload =
        lookup.method === "email"
          ? {
              mode: "email",
              donor_email: validateEmail(lookup.value).value,
              locale: receiptLocale,
            }
          : {
              mode: "mobile",
              donor_contact: normalizeContact(lookup.value),
              locale: receiptLocale,
            };

      const result = await postAdminLookup(contactPayload, {
        secret: adminSecret,
        username: adminUsername,
      });
      const rows = result?.donations;
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error(
          lookup.method === "email"
            ? t("adminPortal.noDonationsEmail")
            : t("adminPortal.noDonations")
        );
      }
      setDonationsList(rows);
      window.requestAnimationFrame(() => {
        donationsHeadingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err) {
      setError((err && err.message) || t("adminPortal.lookupFailed"));
    } finally {
      setBusy(false);
    }
  };

  const handleSelectDonation = async (paymentId) => {
    if (!paymentId) return;
    setError("");
    setDownloadMsg("");
    setBusy(true);
    try {
      const result = await postAdminLookup(
        {
          mode: "payment_id",
          payment_id: paymentId,
          locale: receiptLocale,
        },
        { secret: adminSecret, username: adminUsername }
      );
      if (!result?.record) throw new Error(t("adminPortal.receiptNotFound"));
      setRecord(result.record);
      setDonationsList(null);
    } catch (err) {
      setError((err && err.message) || t("adminPortal.receiptNotFound"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: "18px" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1.5}
        mb={2.5}
      >
        <Box>
          <Typography sx={{ fontWeight: 800, color: "#1f2a44", fontSize: "1.25rem" }}>
            {t("adminPortal.retrieveTitle")}
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: "0.9rem", mt: 0.5 }}>
            {t("adminPortal.retrieveSubtitle")}
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

      {record ? (
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <CheckCircleIcon sx={{ color: "#2e7d32" }} />
            <Typography sx={{ fontWeight: 800, color: "#2e7d32", fontSize: "1.05rem" }}>
              {t("adminPortal.receiptLoaded")}
            </Typography>
          </Stack>

          <Box sx={{ mb: 2 }}>
            <DonationReceiptSheet record={record} logoSrc={aadarLogo} />
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <MKButton
              fullWidth
              variant="contained"
              color="success"
              startIcon={<DownloadOutlinedIcon />}
              onClick={handleDownload}
              sx={{ fontWeight: 800, textTransform: "none", borderRadius: "10px" }}
            >
              {t("adminPortal.downloadPdf")}
            </MKButton>
            <MKButton
              fullWidth
              variant="outlined"
              color="dark"
              startIcon={<ReplayOutlinedIcon />}
              onClick={resetResult}
              sx={{ fontWeight: 700, textTransform: "none", borderRadius: "10px" }}
            >
              {t("adminPortal.searchAgain")}
            </MKButton>
          </Stack>

          {downloadMsg ? (
            <Typography
              variant="body2"
              sx={{ mt: 1.5, textAlign: "center", color: "rgba(31,42,68,0.72)" }}
            >
              {downloadMsg}
            </Typography>
          ) : null}
        </Box>
      ) : (
        <Stack spacing={2}>
          <Tabs
            value={lookup.method}
            onChange={(_, value) => {
              setLookup({ method: value, value: "" });
              setError("");
              setDonationsList(null);
            }}
            sx={tabSx}
          >
            <Tab
              value="mobile"
              icon={<PhoneIphoneOutlinedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              iconPosition="start"
              label={t("adminPortal.mobile")}
            />
            <Tab
              value="email"
              icon={<EmailOutlinedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              iconPosition="start"
              label={t("adminPortal.email")}
            />
            <Tab
              value="receipt_no"
              icon={<ReceiptLongOutlinedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              iconPosition="start"
              label={t("adminPortal.receiptNo")}
            />
          </Tabs>

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!busy) handleFindDonations();
            }}
          >
            <TextField
              label={fieldLabel(lookup.method, t)}
              value={lookup.value}
              onChange={(e) => setLookup((prev) => ({ ...prev, value: e.target.value }))}
              placeholder={fieldPlaceholder(lookup.method)}
              type={
                lookup.method === "mobile" ? "tel" : lookup.method === "email" ? "email" : "text"
              }
              inputProps={
                lookup.method === "receipt_no"
                  ? { autoCapitalize: "characters", spellCheck: false }
                  : lookup.method === "email"
                  ? { autoCapitalize: "none", autoCorrect: "off", spellCheck: false }
                  : undefined
              }
              fullWidth
              sx={{ ...fieldSx, mb: 2 }}
              disabled={busy}
            />

            <MKButton
              type="submit"
              variant="contained"
              color="success"
              disabled={busy}
              fullWidth
              startIcon={
                busy ? (
                  <CircularProgress size={18} color="inherit" thickness={5} />
                ) : (
                  <SearchOutlinedIcon />
                )
              }
              sx={{ fontWeight: 800, textTransform: "none", borderRadius: "12px", py: 1.15 }}
            >
              {busy ? t("adminPortal.searching") : t("adminPortal.findDonations")}
            </MKButton>
          </Box>

          {error ? <Alert severity="error">{error}</Alert> : null}

          {donationsList?.length ? (
            <Box>
              <Typography
                ref={donationsHeadingRef}
                sx={{ fontWeight: 800, color: "#1f2a44", mb: 1.25, fontSize: "0.9375rem" }}
              >
                {t("adminPortal.donationsFound")}
              </Typography>
              <Stack spacing={1.25}>
                {donationsList.map((item) => (
                  <Box
                    key={item.paymentId || item.receiptNo}
                    sx={{
                      p: 1.5,
                      borderRadius: "12px",
                      border: "1px solid rgba(30,107,53,0.12)",
                      bgcolor: panelGreen,
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "stretch", sm: "center" },
                      justifyContent: "space-between",
                      gap: 1.25,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 800, color: "#2e7d32" }}>
                        {formatInr(item.amountInr)}
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                        {formatPaidAt(item.paidAt, receiptLocale)}
                        {item.programLabel ? ` · ${item.programLabel}` : ""}
                      </Typography>
                      {item.receiptNo ? (
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "rgba(31,42,68,0.55)",
                            mt: 0.25,
                            wordBreak: "break-all",
                          }}
                        >
                          {item.receiptNo}
                        </Typography>
                      ) : item.paymentId ? (
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "rgba(31,42,68,0.55)",
                            mt: 0.25,
                            wordBreak: "break-all",
                          }}
                        >
                          {item.paymentId}
                        </Typography>
                      ) : null}
                    </Box>
                    <MKButton
                      variant="outlined"
                      size="small"
                      disabled={busy}
                      startIcon={<ReceiptLongOutlinedIcon />}
                      onClick={() => handleSelectDonation(item.paymentId)}
                      sx={{
                        flexShrink: 0,
                        fontWeight: 700,
                        textTransform: "none",
                        borderRadius: "10px",
                        borderColor: "#2e7d32",
                        color: "#2e7d32",
                      }}
                    >
                      {t("adminPortal.viewReceipt")}
                    </MKButton>
                  </Box>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Stack>
      )}
    </Card>
  );
}

AdminReceiptRetrieve.propTypes = {
  onBack: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  adminSecret: PropTypes.string.isRequired,
  adminUsername: PropTypes.string,
};

AdminReceiptRetrieve.defaultProps = {
  adminUsername: "",
};
