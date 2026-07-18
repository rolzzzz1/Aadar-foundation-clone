import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

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

import DonationReceiptSheet from "components/DonationReceiptSheet";
import MKButton from "components/MKButton";
import aadarLogo from "assets/images/logos/logo-aadar.jpg";
import { postJson } from "utils/api";
import { validateEmail } from "utils/donation";
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
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.9rem",
    borderRadius: "10px",
    "&.Mui-selected": {
      color: "#174f28",
      fontWeight: 700,
      bgcolor: "#fff",
      boxShadow: "0 2px 8px rgba(30, 107, 53, 0.1)",
    },
  },
  "& .MuiTabs-indicator": { display: "none" },
};

const emptyContactLookup = { method: "email", value: "" };

function normalizeContact(v) {
  const digits = String(v || "").replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

function formatPaidAt(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function buildContactPayload(method, value) {
  const raw = String(value || "").trim();
  if (method === "mobile") {
    return { contact_type: "mobile", donor_contact: normalizeContact(raw) };
  }
  return { contact_type: "email", donor_email: raw.toLowerCase() };
}

function isContactValid(method, value) {
  if (method === "mobile") return normalizeContact(value).length === 10;
  return validateEmail(value).ok;
}

export default function AdminReceiptRetrieve({ onBack, onLogout }) {
  const [contactLookup, setContactLookup] = useState(emptyContactLookup);
  const [donationsList, setDonationsList] = useState(null);
  const [verifiedContact, setVerifiedContact] = useState(null);
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
    setVerifiedContact(null);
  };

  const handleDownload = async () => {
    if (!record || !record.verified) return;
    setDownloadMsg("Preparing PDF…");
    const { downloadReceiptPdf } = await import("utils/donationReceipt");
    const result = await downloadReceiptPdf(record);
    setDownloadMsg(result === "pdf" ? "PDF downloaded." : "Download failed.");
  };

  const handleFindDonations = async () => {
    resetResult();
    if (!isContactValid(contactLookup.method, contactLookup.value)) {
      setError("Enter a valid email or 10-digit mobile number.");
      return;
    }

    const contactPayload = buildContactPayload(contactLookup.method, contactLookup.value);
    setBusy(true);
    try {
      const result = await postJson("/api/donation-receipt-list", {
        ...contactPayload,
        locale: "en",
      });
      const rows = result?.donations;
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error("No donations found for this contact.");
      }
      setVerifiedContact(contactPayload);
      setDonationsList(rows);
      window.requestAnimationFrame(() => {
        donationsHeadingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err) {
      setError((err && err.message) || "Could not find donations.");
    } finally {
      setBusy(false);
    }
  };

  const handleSelectDonation = async (paymentId) => {
    if (!verifiedContact || !paymentId) return;
    setError("");
    setDownloadMsg("");
    setBusy(true);
    try {
      const result = await postJson("/api/donation-receipt", {
        payment_id: paymentId,
        ...verifiedContact,
        locale: "en",
      });
      if (!result?.record) throw new Error("Receipt not found.");
      setRecord(result.record);
      setDonationsList(null);
    } catch (err) {
      setError((err && err.message) || "Could not load receipt.");
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
            Retrieve donation receipt
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: "0.9rem", mt: 0.5 }}>
            Look up receipts by donor email or mobile.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <MKButton
            variant="outlined"
            color="dark"
            onClick={onBack}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Back
          </MKButton>
          <MKButton
            variant="text"
            color="dark"
            onClick={onLogout}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Logout
          </MKButton>
        </Stack>
      </Stack>

      {record ? (
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <CheckCircleIcon sx={{ color: "#2e7d32" }} />
            <Typography sx={{ fontWeight: 800, color: "#2e7d32", fontSize: "1.05rem" }}>
              Receipt loaded
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
              Download PDF
            </MKButton>
            <MKButton
              fullWidth
              variant="outlined"
              color="dark"
              startIcon={<ReplayOutlinedIcon />}
              onClick={resetResult}
              sx={{ fontWeight: 700, textTransform: "none", borderRadius: "10px" }}
            >
              Search again
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
            value={contactLookup.method}
            onChange={(_, value) => {
              setContactLookup({ method: value, value: "" });
              setError("");
              setDonationsList(null);
            }}
            sx={tabSx}
          >
            <Tab
              value="email"
              icon={<EmailOutlinedIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Email"
            />
            <Tab
              value="mobile"
              icon={<PhoneIphoneOutlinedIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Mobile"
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
              label={contactLookup.method === "mobile" ? "Mobile number" : "Email address"}
              value={contactLookup.value}
              onChange={(e) => setContactLookup((prev) => ({ ...prev, value: e.target.value }))}
              placeholder={contactLookup.method === "mobile" ? "9826441863" : "donor@example.com"}
              type={contactLookup.method === "mobile" ? "tel" : "email"}
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
              {busy ? "Searching…" : "Find donations"}
            </MKButton>
          </Box>

          {error ? <Alert severity="error">{error}</Alert> : null}

          {donationsList?.length ? (
            <Box>
              <Typography
                ref={donationsHeadingRef}
                sx={{ fontWeight: 800, color: "#1f2a44", mb: 1.25, fontSize: "0.9375rem" }}
              >
                Donations found
              </Typography>
              <Stack spacing={1.25}>
                {donationsList.map((item) => (
                  <Box
                    key={item.paymentId}
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
                        {formatPaidAt(item.paidAt)}
                        {item.programLabel ? ` · ${item.programLabel}` : ""}
                      </Typography>
                      {item.paymentId ? (
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
                      View receipt
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
};
