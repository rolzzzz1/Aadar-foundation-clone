import React, { useEffect, useMemo, useState } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import DonationReceiptSheet from "components/DonationReceiptSheet";
import MKButton from "components/MKButton";
import MKBox from "components/MKBox";
import AdminReceiptRetrieve from "pages/AdminDonationReceipt/AdminReceiptRetrieve";
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

async function postAdminReceipt(body, { secret, username }) {
  const url = getApiUrl("/api/admin-donation-receipt");
  const res = await fetch(url, {
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
  if (!res.ok) {
    throw new Error(formatApiErrorMessage(data, res.status));
  }
  return data;
}

async function verifyAdminLogin({ secret, username }) {
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
  const [adminUsername, setAdminUsername] = useState("");
  const [secretInput, setSecretInput] = useState("");
  const [isSecretVisible, setIsSecretVisible] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [adminView, setAdminView] = useState("menu"); // 'menu' | 'create' | 'retrieve'
  const [form, setForm] = useState({ ...emptyForm, paidAt: todayIsoDate() });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(ADMIN_SECRET_KEY);
      if (stored) {
        // Keep session unlock, but never prefill login fields.
        if (stored.trim().startsWith("{")) {
          const parsed = JSON.parse(stored);
          setAdminSecret(String(parsed?.secret || "").trim());
        } else {
          setAdminSecret(stored);
        }
        setUnlocked(true);
        setAdminView("menu");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const previewRecord = useMemo(() => result?.record || null, [result]);

  const handleUnlock = async () => {
    const username = adminUsername.trim();
    const trimmed = secretInput.trim();
    if (!username) {
      setError("Enter the admin username.");
      return;
    }
    if (!trimmed) {
      setError("Enter the admin password.");
      return;
    }
    setError("");

    try {
      setAuthBusy(true);
      await verifyAdminLogin({ username, secret: trimmed });
    } catch (err) {
      setError("Invalid username or password.");
      return;
    } finally {
      setAuthBusy(false);
    }

    setAdminSecret(trimmed);
    setUnlocked(true);
    setAdminView("menu");
    try {
      sessionStorage.setItem(ADMIN_SECRET_KEY, JSON.stringify({ username, secret: trimmed }));
    } catch {
      /* ignore */
    }
  };

  const handleLogout = () => {
    setUnlocked(false);
    setAdminSecret("");
    setAdminUsername("");
    setSecretInput("");
    setResult(null);
    setError("");
    setAdminView("menu");
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
      const response = await postAdminReceipt(payload, {
        secret: adminSecret,
        username: adminUsername,
      });
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
      <MKBox
        minHeight="100vh"
        sx={{
          display: "flex",
          alignItems: "center",
          py: { xs: 2.5, sm: 3 },
          background: `
            radial-gradient(ellipse 60% 40% at 18% 18%, rgba(46, 125, 50, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 55% 40% at 88% 22%, rgba(46, 125, 50, 0.06) 0%, transparent 55%),
            linear-gradient(180deg, #f7fbf7 0%, #eef4f2 55%, #f2f6fb 100%)
          `,
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            width: "80%",
            maxWidth: 1400,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card
            sx={{
              width: { xs: "100%", sm: "92%", md: "80%" },
              maxWidth: 1200,
              p: { xs: 2, sm: 2.4 },
              borderRadius: "22px",
              border: "1px solid rgba(31, 42, 68, 0.07)",
              boxShadow: "0 24px 80px rgba(31, 42, 68, 0.14)",
            }}
          >
            <Grid container spacing={0} sx={{ borderRadius: "18px", overflow: "hidden" }}>
              <Grid
                item
                xs={12}
                md={5}
                sx={{
                  p: { xs: 2, sm: 2.75, md: 3 },
                  background:
                    "linear-gradient(180deg, rgba(46,125,50,0.08) 0%, rgba(46,125,50,0.03) 55%, rgba(255,255,255,0.8) 100%)",
                  borderRight: { md: "1px solid rgba(31, 42, 68, 0.08)" },
                }}
              >
                <Stack spacing={1.5} alignItems={{ xs: "center", md: "flex-start" }}>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 1.25,
                      borderRadius: "20px",
                      bgcolor: "#fff",
                      border: "1px solid rgba(31, 42, 68, 0.1)",
                      boxShadow: "0 12px 28px rgba(31, 42, 68, 0.08)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={aadarLogo}
                      alt="Aadar Foundation"
                      sx={{
                        width: { xs: 170, sm: 200, md: 190 },
                        height: "auto",
                        display: "block",
                        objectFit: "contain",
                      }}
                    />
                  </Box>

                  <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                    <Typography sx={{ fontWeight: 900, color: "#1f2a44", fontSize: "1.35rem" }}>
                      Admin Portal
                    </Typography>
                    <Box
                      sx={{
                        width: 44,
                        height: 3,
                        borderRadius: 999,
                        bgcolor: "#2e7d32",
                        opacity: 0.75,
                        mt: 1,
                        mx: { xs: "auto", md: 0 },
                      }}
                    />
                    <Typography
                      sx={{
                        color: "rgba(100,116,139,0.95)",
                        fontSize: "0.86rem",
                        mt: 0.45,
                        lineHeight: 1.55,
                        maxWidth: 320,
                      }}
                    >
                      Secure access to manage and retrieve donation receipts and organizational
                      operations.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 0.75,
                      p: 1.25,
                      borderRadius: "16px",
                      bgcolor: "rgba(46, 125, 50, 0.06)",
                      border: "1px solid rgba(46, 125, 50, 0.12)",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "14px",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "rgba(46, 125, 50, 0.1)",
                        flexShrink: 0,
                      }}
                    >
                      <VerifiedOutlinedIcon sx={{ fontSize: 20, color: "#2e7d32" }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 900, fontSize: "0.92rem", color: "#2e7d32" }}>
                        Secure Admin Access
                      </Typography>
                      <Typography
                        sx={{ color: "rgba(31,42,68,0.72)", fontSize: "0.82rem", mt: 0.25 }}
                      >
                        Restricted to authorized administrators only.
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Grid>

              <Grid
                item
                xs={12}
                md={7}
                sx={{
                  p: { xs: 2, sm: 2.75, md: 3 },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!authBusy) handleUnlock();
                  }}
                  sx={{ width: "100%", maxWidth: 520, mx: "auto" }}
                >
                  <Stack spacing={1.1} sx={{ width: "100%", textAlign: "left" }}>
                    <Box sx={{ textAlign: "center", mb: 0.75 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "999px",
                          mx: "auto",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: "rgba(46, 125, 50, 0.08)",
                          border: "1px solid rgba(46, 125, 50, 0.14)",
                        }}
                      >
                        <VerifiedOutlinedIcon sx={{ fontSize: 26, color: "#2e7d32" }} />
                      </Box>
                      <Typography
                        sx={{ fontWeight: 900, color: "#1f2a44", fontSize: "1.55rem", mt: 1.1 }}
                      >
                        Welcome Back
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgba(100,116,139,0.9)",
                          fontSize: "0.86rem",
                          mt: 0.35,
                          lineHeight: 1.55,
                        }}
                      >
                        Enter your admin credentials to continue.
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: "#1f2a44" }}>
                      Admin Username
                    </Typography>
                    <TextField
                      label=""
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      fullWidth
                      sx={{
                        ...fieldSx,
                        "& .MuiOutlinedInput-root": {
                          ...(fieldSx["& .MuiOutlinedInput-root"] || {}),
                          backgroundColor: "#fff",
                        },
                      }}
                      disabled={authBusy}
                      autoComplete="username"
                      placeholder="Enter admin username"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineOutlinedIcon
                              sx={{ fontSize: 20, color: "rgba(31,42,68,0.45)" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Typography
                      sx={{ fontWeight: 800, fontSize: "0.9rem", color: "#1f2a44", mt: 0.35 }}
                    >
                      Admin Password
                    </Typography>
                    <TextField
                      label=""
                      type={isSecretVisible ? "text" : "password"}
                      value={secretInput}
                      onChange={(e) => setSecretInput(e.target.value)}
                      fullWidth
                      sx={{
                        ...fieldSx,
                        "& .MuiOutlinedInput-root": {
                          ...(fieldSx["& .MuiOutlinedInput-root"] || {}),
                          backgroundColor: "#fff",
                        },
                      }}
                      disabled={authBusy}
                      autoComplete="current-password"
                      placeholder="Enter password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon sx={{ fontSize: 20, color: "rgba(31,42,68,0.45)" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={isSecretVisible ? "Hide password" : "Show password"}
                              edge="end"
                              onClick={() => setIsSecretVisible((v) => !v)}
                              tabIndex={-1}
                            >
                              {isSecretVisible ? (
                                <VisibilityOffOutlinedIcon fontSize="small" />
                              ) : (
                                <VisibilityOutlinedIcon fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {error ? (
                      <Alert severity="error" sx={{ textAlign: "left" }}>
                        {error}
                      </Alert>
                    ) : null}

                    <MKButton
                      type="submit"
                      variant="contained"
                      color="success"
                      disabled={authBusy}
                      sx={{
                        fontWeight: 800,
                        textTransform: "none",
                        borderRadius: "14px",
                        px: 3,
                        py: 1.25,
                        background:
                          "linear-gradient(90deg, rgba(24, 124, 54, 1) 0%, rgba(34, 163, 75, 1) 100%)",
                        boxShadow: "0 14px 28px rgba(46, 125, 50, 0.28)",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, rgba(20, 106, 46, 1) 0%, rgba(30, 142, 65, 1) 100%)",
                        },
                      }}
                      startIcon={
                        authBusy ? (
                          <CircularProgress size={18} color="inherit" thickness={5} />
                        ) : (
                          <LockOutlinedIcon sx={{ fontSize: 18 }} />
                        )
                      }
                    >
                      {authBusy ? "Checking…" : "Login"}
                    </MKButton>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        pt: 1.25,
                        mt: 0.25,
                        borderTop: "1px solid rgba(31, 42, 68, 0.08)",
                      }}
                    >
                      <VerifiedOutlinedIcon
                        sx={{ fontSize: 18, color: "rgba(46, 125, 50, 0.8)" }}
                      />
                      <Typography sx={{ fontSize: "0.84rem", color: "rgba(31,42,68,0.6)" }}>
                        Authorized administrators only
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </MKBox>
    );
  }

  if (unlocked && adminView === "menu") {
    return (
      <MKBox
        minHeight="100vh"
        sx={{
          bgcolor: "#eef1f6",
          display: "flex",
          alignItems: "center",
          py: { xs: 1.5, md: 2 },
        }}
      >
        <Container maxWidth="lg">
          <Card
            sx={{
              p: { xs: 1.75, sm: 2.25, md: 2.5 },
              borderRadius: "22px",
              border: "1px solid rgba(31, 42, 68, 0.08)",
              boxShadow: "0 18px 60px rgba(31, 42, 68, 0.12)",
            }}
          >
            <Stack spacing={2.25}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box
                    component="img"
                    src={aadarLogo}
                    alt="Aadar Foundation"
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      bgcolor: "#fff",
                      border: "1px solid rgba(31, 42, 68, 0.08)",
                      objectFit: "contain",
                      p: 0.5,
                    }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 900, color: "#1f2a44", fontSize: "1rem" }}>
                      Aadar Foundation
                    </Typography>
                    <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                      Admin Portal
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "16px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(46, 125, 50, 0.1)",
                      border: "1px solid rgba(46, 125, 50, 0.14)",
                    }}
                  >
                    <PersonOutlineOutlinedIcon sx={{ fontSize: 20, color: "#2e7d32" }} />
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>Welcome,</Typography>
                    <Typography sx={{ fontWeight: 900, color: "#1f2a44", fontSize: "0.95rem" }}>
                      {adminUsername || "admin"}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              <Stack spacing={0.5} alignItems="center" textAlign="center" sx={{ pt: 0 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "16px",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "rgba(46, 125, 50, 0.08)",
                    border: "1px solid rgba(46, 125, 50, 0.12)",
                  }}
                >
                  <DashboardCustomizeOutlinedIcon sx={{ fontSize: 24, color: "#2e7d32" }} />
                </Box>
                <Typography
                  sx={{ fontWeight: 900, color: "#1f2a44", fontSize: "1.45rem", mt: 0.75 }}
                >
                  Admin Tools
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Choose what you want to do.
                </Typography>
              </Stack>

              <Box sx={{ width: "100%", display: "flex", justifyContent: "center", pt: 0.5 }}>
                <Stack spacing={1.25} alignItems="center" sx={{ width: "100%", maxWidth: 760 }}>
                  <Card
                    onClick={() => setAdminView("retrieve")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setAdminView("retrieve");
                    }}
                    sx={{
                      width: "100%",
                      p: { xs: 2, sm: 2.25 },
                      borderRadius: "16px",
                      border: "1px solid rgba(31,42,68,0.08)",
                      bgcolor: "rgba(46, 125, 50, 0.05)",
                      cursor: "pointer",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 14px 40px rgba(31,42,68,0.12)",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 52,
                            height: 52,
                            borderRadius: "16px",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "rgba(46, 125, 50, 0.12)",
                          }}
                        >
                          <DescriptionOutlinedIcon sx={{ fontSize: 26, color: "#2e7d32" }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 900, color: "#1f2a44" }}>
                            Retrieve Receipt
                          </Typography>
                          <Typography sx={{ color: "#64748b", fontSize: "0.88rem", mt: 0.25 }}>
                            Search and retrieve existing donation receipts.
                          </Typography>
                        </Box>
                      </Stack>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "14px",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: "rgba(46, 125, 50, 0.12)",
                          border: "1px solid rgba(46, 125, 50, 0.18)",
                        }}
                      >
                        <ChevronRightIcon sx={{ fontSize: 26, color: "#2e7d32" }} />
                      </Box>
                    </Stack>
                  </Card>

                  <Card
                    onClick={() => setAdminView("create")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setAdminView("create");
                    }}
                    sx={{
                      width: "100%",
                      p: { xs: 2, sm: 2.25 },
                      borderRadius: "16px",
                      border: "1px solid rgba(31,42,68,0.08)",
                      bgcolor: "#fff",
                      cursor: "pointer",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 14px 40px rgba(31,42,68,0.12)",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 52,
                            height: 52,
                            borderRadius: "16px",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "rgba(46, 125, 50, 0.12)",
                          }}
                        >
                          <AddOutlinedIcon sx={{ fontSize: 28, color: "#2e7d32" }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 900, color: "#1f2a44" }}>
                            Create Receipt
                          </Typography>
                          <Typography sx={{ color: "#64748b", fontSize: "0.88rem", mt: 0.25 }}>
                            Create a new donation receipt.
                          </Typography>
                        </Box>
                      </Stack>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "14px",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: "rgba(46, 125, 50, 0.12)",
                          border: "1px solid rgba(46, 125, 50, 0.18)",
                        }}
                      >
                        <ChevronRightIcon sx={{ fontSize: 26, color: "#2e7d32" }} />
                      </Box>
                    </Stack>
                  </Card>
                </Stack>
              </Box>

              <Stack alignItems="center" sx={{ pt: 0.75 }}>
                <Box
                  sx={{ width: "100%", maxWidth: 760, borderTop: "1px solid rgba(31,42,68,0.08)" }}
                />
                <MKButton
                  variant="text"
                  color="dark"
                  onClick={handleLogout}
                  startIcon={<LogoutOutlinedIcon />}
                  sx={{ textTransform: "none", fontWeight: 800, mt: 0.9 }}
                >
                  Logout
                </MKButton>
              </Stack>
            </Stack>
          </Card>
        </Container>
      </MKBox>
    );
  }

  if (unlocked && adminView === "retrieve") {
    return (
      <MKBox minHeight="100vh" sx={{ bgcolor: "#eef1f6", pt: { xs: 3, md: 4 }, pb: 6 }}>
        <Container maxWidth="md">
          <AdminReceiptRetrieve
            onBack={() => {
              setAdminView("menu");
              setError("");
            }}
            onLogout={handleLogout}
          />
        </Container>
      </MKBox>
    );
  }

  if (!unlocked || adminView !== "create") {
    return null;
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
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <MKButton
              variant="outlined"
              color="dark"
              onClick={() => {
                setAdminView("menu");
                setResult(null);
                setError("");
              }}
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              Back
            </MKButton>
            <MKButton
              variant="text"
              color="dark"
              onClick={handleLogout}
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              Logout
            </MKButton>
          </Stack>
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
