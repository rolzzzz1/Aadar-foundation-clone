import React, { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import DonationReceiptSheet from "components/DonationReceiptSheet";
import aadarLogo from "assets/images/logos/logo-aadar.jpg";
import getRoutes from "routes1";
import getFooterRoutes from "footer.routes1";
import { DONATE_PAGE_PATH } from "utils/donation";
import { postJson } from "utils/api";
import { validateEmail } from "utils/donation";
import { formatInr } from "utils/receiptFormat";

const brandGreen = "#1e6b35";
const brandGreenDark = "#174f28";
const panelGreen = "#edf7ee";
const panelGreenDeep = "#dcefe0";

const fieldSx = {
  "& .MuiInputBase-input": { fontSize: { xs: "0.9375rem", sm: "0.975rem" }, py: 1.35 },
  "& .MuiInputLabel-root": { fontSize: { xs: "0.875rem", sm: "0.9375rem" }, fontWeight: 600 },
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fff",
    "& fieldset": { borderColor: "rgba(30, 107, 53, 0.18)" },
    "&:hover fieldset": { borderColor: "rgba(30, 107, 53, 0.35)" },
    "&.Mui-focused fieldset": { borderColor: brandGreen },
  },
};

const tabSx = {
  minHeight: 44,
  borderBottom: "1px solid rgba(30, 107, 53, 0.12)",
  "& .MuiTab-root": {
    minHeight: 44,
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.9rem",
    color: "rgba(31, 42, 68, 0.45)",
    gap: 0.75,
    "&.Mui-selected": { color: brandGreen, fontWeight: 700 },
  },
  "& .MuiTabs-indicator": { backgroundColor: brandGreen, height: 3, borderRadius: "3px 3px 0 0" },
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

function ReceiptIllustration() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 220,
        mx: "auto",
        mb: 2.5,
        aspectRatio: "1 / 1",
      }}
      aria-hidden
    >
      <Box
        sx={{
          position: "absolute",
          inset: "8% 10% 12%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30,107,53,0.12) 0%, rgba(30,107,53,0.02) 70%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "18%",
          top: "22%",
          width: "52%",
          height: "58%",
          borderRadius: "14px",
          bgcolor: "#fff",
          border: "2px solid rgba(30,107,53,0.15)",
          boxShadow: "0 12px 28px rgba(30,107,53,0.12)",
          transform: "rotate(-6deg)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ height: 14, bgcolor: panelGreenDeep }} />
        <Box sx={{ p: 1.25 }}>
          <Typography
            sx={{
              fontSize: "0.55rem",
              fontWeight: 800,
              color: brandGreen,
              letterSpacing: "0.04em",
              lineHeight: 1.2,
            }}
          >
            80G TAX
            <br />
            RECEIPT
          </Typography>
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                mt: 0.6,
                height: 4,
                borderRadius: 2,
                bgcolor: "rgba(30,107,53,0.1)",
                width: i === 3 ? "60%" : "85%",
              }}
            />
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          right: "14%",
          top: "18%",
          width: 44,
          height: 44,
          borderRadius: "50%",
          bgcolor: brandGreen,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 20px rgba(30,107,53,0.28)",
        }}
      >
        <VerifiedOutlinedIcon sx={{ color: "#fff", fontSize: 26 }} />
      </Box>
      <Box
        component="svg"
        viewBox="0 0 80 80"
        sx={{
          position: "absolute",
          left: "8%",
          bottom: "18%",
          width: 56,
          height: 56,
          opacity: 0.35,
        }}
      >
        <path
          d="M40 8 C28 8 20 18 20 28 C20 38 40 58 40 58 C40 58 60 38 60 28 C60 18 52 8 40 8 Z"
          fill={brandGreen}
        />
      </Box>
      <Box
        component="svg"
        viewBox="0 0 80 80"
        sx={{
          position: "absolute",
          right: "6%",
          bottom: "12%",
          width: 48,
          height: 48,
          opacity: 0.25,
        }}
      >
        <path
          d="M40 8 C28 8 20 18 20 28 C20 38 40 58 40 58 C40 58 60 38 60 28 C60 18 52 8 40 8 Z"
          fill={brandGreen}
        />
      </Box>
    </Box>
  );
}

function FeatureRow({ icon: Icon, title, subtitle }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          bgcolor: "rgba(30, 107, 53, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 20, color: brandGreen }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{ fontWeight: 700, fontSize: "0.875rem", color: brandGreenDark, lineHeight: 1.3 }}
        >
          {title}
        </Typography>
        <Typography
          sx={{ fontSize: "0.78rem", color: "rgba(31, 42, 68, 0.55)", lineHeight: 1.4, mt: 0.15 }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}

FeatureRow.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default function DonationReceiptRetrievePage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "hi" ? "hi" : "en";
  const routes = getRoutes(t);
  const footerRoutes = getFooterRoutes(t);
  const donateBtn = t("navbar.donateBtn");

  const [contactLookup, setContactLookup] = useState(emptyContactLookup);
  const [donationsList, setDonationsList] = useState(null);
  const [verifiedContact, setVerifiedContact] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [downloadMsg, setDownloadMsg] = useState("");
  const [record, setRecord] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const copy = useMemo(() => t("receiptRetrieve", { returnObjects: true }), [t]);
  const ctaCopy = copy.cta || {};
  const features = copy.features || {};

  const resetResult = () => {
    setRecord(null);
    setError("");
    setDownloadMsg("");
    setEmailSent(false);
    setDonationsList(null);
    setVerifiedContact(null);
  };

  const handleDownload = async () => {
    if (!record || !record.verified) return;
    setDownloadMsg(t("donationResult.preparing"));
    const { downloadReceiptPdf } = await import("utils/donationReceipt");
    const result = await downloadReceiptPdf(record);
    setDownloadMsg(
      result === "pdf" ? t("donationResult.pdfDownloaded") : t("donationResult.downloadFailed")
    );
  };

  const handleFindDonations = async () => {
    resetResult();
    if (!isContactValid(contactLookup.method, contactLookup.value)) {
      setError(copy.contactInvalid || "Please enter a valid email or 10-digit mobile number.");
      return;
    }

    const contactPayload = buildContactPayload(contactLookup.method, contactLookup.value);
    setBusy(true);
    try {
      const result = await postJson("/api/donation-receipt-list", {
        ...contactPayload,
        locale,
      });
      const rows = result?.donations;
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error(copy.listEmpty || copy.notFound || "No donations found.");
      }
      setVerifiedContact(contactPayload);
      setDonationsList(rows);
    } catch (err) {
      setError((err && err.message) || copy.failed || t("donationResult.lookupFailed"));
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
        locale,
      });
      if (!result?.record) throw new Error(copy.notFound || t("donationResult.lookupNotFound"));
      setRecord(result.record);
      setDonationsList(null);
    } catch (err) {
      setError((err && err.message) || copy.failed || t("donationResult.lookupFailed"));
    } finally {
      setBusy(false);
    }
  };

  const resultView = record ? (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <CheckCircleIcon sx={{ color: brandGreen }} />
        <Typography sx={{ fontWeight: 800, color: brandGreen, fontSize: "1.05rem" }}>
          {copy.foundTitle || "Your receipt is ready"}
        </Typography>
      </Stack>

      {emailSent ? (
        <Alert severity="success" sx={{ mb: 2, borderRadius: "10px" }}>
          {t("donationResult.receiptEmailed", {
            email: record.donor?.email || copy.yourEmail || "your email",
          })}
        </Alert>
      ) : null}

      <Box sx={{ mb: 2 }}>
        <DonationReceiptSheet record={record} logoSrc={aadarLogo} />
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <MKButton
          fullWidth
          variant="contained"
          startIcon={<DownloadOutlinedIcon />}
          onClick={handleDownload}
          sx={{
            py: 1.25,
            fontWeight: 800,
            textTransform: "none",
            borderRadius: "10px",
            bgcolor: brandGreen,
            "&:hover": { bgcolor: brandGreenDark },
          }}
        >
          {t("donationResult.downloadPdf")}
        </MKButton>
        <MKButton
          fullWidth
          variant="outlined"
          startIcon={<ReplayOutlinedIcon />}
          onClick={resetResult}
          sx={{
            py: 1.25,
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            borderColor: "rgba(31,42,68,0.2)",
            color: "#1f2a44",
          }}
        >
          {copy.searchAgain || "Look up another receipt"}
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
  ) : null;

  const lookupForm = (
    <Stack spacing={2.25}>
      <Box
        sx={{
          display: "flex",
          gap: 1.25,
          alignItems: "flex-start",
          p: 1.5,
          borderRadius: "10px",
          bgcolor: panelGreen,
          border: "1px solid rgba(30, 107, 53, 0.12)",
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 20, color: brandGreen, mt: 0.15, flexShrink: 0 }} />
        <Typography
          sx={{ fontSize: "0.8125rem", color: "rgba(31, 42, 68, 0.72)", lineHeight: 1.55 }}
        >
          {copy.onlineHint ||
            "For online donations only. Enter the email or mobile number you used when donating to find your donations and download receipts."}
        </Typography>
      </Box>

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
          label={copy.contactEmail || "Email"}
        />
        <Tab
          value="mobile"
          icon={<PhoneIphoneOutlinedIcon sx={{ fontSize: 18 }} />}
          iconPosition="start"
          label={copy.contactMobile || "Mobile"}
        />
      </Tabs>

      <TextField
        label={
          contactLookup.method === "mobile"
            ? copy.mobile || t("donationResult.mobile")
            : copy.emailAddress || copy.email || t("donationResult.email")
        }
        value={contactLookup.value}
        onChange={(e) => setContactLookup((prev) => ({ ...prev, value: e.target.value }))}
        placeholder={
          contactLookup.method === "mobile"
            ? copy.mobilePlaceholder || "9826441863"
            : copy.emailPlaceholder || "Enter your email address"
        }
        type={contactLookup.method === "mobile" ? "tel" : "email"}
        fullWidth
        sx={fieldSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {contactLookup.method === "mobile" ? (
                <PhoneIphoneOutlinedIcon sx={{ fontSize: 20, color: "rgba(31,42,68,0.35)" }} />
              ) : (
                <EmailOutlinedIcon sx={{ fontSize: 20, color: "rgba(31,42,68,0.35)" }} />
              )}
            </InputAdornment>
          ),
        }}
      />

      <MKButton
        variant="contained"
        disabled={busy}
        fullWidth
        startIcon={busy ? <CircularProgress size={18} color="inherit" /> : <SearchOutlinedIcon />}
        onClick={handleFindDonations}
        sx={{
          py: 1.45,
          fontWeight: 800,
          textTransform: "none",
          borderRadius: "10px",
          fontSize: "0.9375rem",
          bgcolor: brandGreen,
          boxShadow: "0 6px 16px rgba(30, 107, 53, 0.22)",
          "&:hover": { bgcolor: brandGreenDark },
        }}
      >
        {busy
          ? copy.busy || t("donationResult.lookupBusy")
          : copy.findDonations || "Find my donations"}
      </MKButton>

      <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center">
        <ShieldOutlinedIcon sx={{ fontSize: 16, color: "rgba(31,42,68,0.4)" }} />
        <Typography sx={{ fontSize: "0.78rem", color: "rgba(31,42,68,0.5)" }}>
          {copy.privacyNote || "We never share your information with anyone"}
        </Typography>
      </Stack>

      {donationsList?.length ? (
        <Box>
          <Typography sx={{ fontWeight: 800, color: "#1f2a44", mb: 1.25, fontSize: "0.9375rem" }}>
            {copy.listTitle || "Your donations"}
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
                  <Typography sx={{ fontWeight: 800, color: brandGreen }}>
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
                    borderColor: brandGreen,
                    color: brandGreen,
                  }}
                >
                  {copy.viewReceipt || "View receipt"}
                </MKButton>
              </Box>
            ))}
          </Stack>
        </Box>
      ) : null}

      {error ? (
        <Alert severity="error" sx={{ borderRadius: "10px" }}>
          {error}
        </Alert>
      ) : null}

      <Box sx={{ textAlign: "center", pt: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#1f2a44", mb: 1 }}>
          {copy.cantFindTitle || "Can't find your receipt?"}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.78rem",
            color: "rgba(31, 42, 68, 0.58)",
            lineHeight: 1.55,
            fontStyle: "italic",
            maxWidth: 420,
            mx: "auto",
          }}
        >
          {ctaCopy.bankTransferNote ||
            "For UPI / QR and bank transfer donations, email us at aadarfoundation2018@gmail.com with your full name, father/husband name, email, mobile number, PAN, complete address (house no., city, state, PIN), donation amount, payment date, transaction reference (UTR or bank ref), and a clear payment screenshot. We will verify your payment and email your 80G tax receipt."}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <MKBox minWidth="320px">
      <DefaultNavbar
        routes={routes}
        action={{
          type: "internal",
          route: DONATE_PAGE_PATH,
          label: donateBtn,
          color: "success",
        }}
        sticky
      />
      <MKBox
        minHeight="100vh"
        pt={{ xs: 14, sm: 16, md: 18 }}
        pb={{ xs: 6, md: 8 }}
        sx={{ background: "linear-gradient(180deg, #f4f7f4 0%, #eef1f6 100%)" }}
      >
        <Container maxWidth="md" sx={{ maxWidth: { md: 920 } }}>
          <Card
            sx={{
              overflow: "hidden",
              borderRadius: "20px",
              border: "1px solid rgba(30, 107, 53, 0.1)",
              boxShadow: "0 24px 64px rgba(31, 42, 68, 0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                minHeight: { md: 520 },
              }}
            >
              {/* Left panel */}
              <Box
                sx={{
                  flex: { md: "0 0 42%" },
                  bgcolor: panelGreen,
                  p: { xs: 3, sm: 3.5, md: 4 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderRight: { md: "1px solid rgba(30, 107, 53, 0.08)" },
                }}
              >
                <ReceiptIllustration />

                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  justifyContent="center"
                  mb={0.75}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "1.15rem", sm: "1.25rem" },
                      color: brandGreenDark,
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    {copy.title || "Retrieve your donation receipt"}
                  </Typography>
                  <FavoriteIcon sx={{ fontSize: 18, color: brandGreen, opacity: 0.85 }} />
                </Stack>

                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: "0.8125rem",
                    color: "rgba(31, 42, 68, 0.6)",
                    lineHeight: 1.55,
                    mb: 3,
                    px: 1,
                  }}
                >
                  {copy.subtitle || "Download your official 80G receipt for online donations."}
                </Typography>

                <Stack spacing={2} sx={{ maxWidth: 280, mx: "auto", width: "100%" }}>
                  <FeatureRow
                    icon={ShieldOutlinedIcon}
                    title={features.official80G?.title || "Official 80G receipt"}
                    subtitle={features.official80G?.subtitle || "For income tax exemption"}
                  />
                  <FeatureRow
                    icon={LockOutlinedIcon}
                    title={features.secure?.title || "Secure & Private"}
                    subtitle={features.secure?.subtitle || "Your information is safe with us"}
                  />
                  <FeatureRow
                    icon={AccessTimeOutlinedIcon}
                    title={features.quick?.title || "Quick & Easy"}
                    subtitle={features.quick?.subtitle || "Find and download in seconds"}
                  />
                </Stack>
              </Box>

              {/* Right panel */}
              <Box
                sx={{
                  flex: 1,
                  bgcolor: "#fff",
                  p: { xs: 3, sm: 3.5, md: 4 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {record ? resultView : lookupForm}
              </Box>
            </Box>

            {/* Footer strip */}
            <Box
              sx={{
                bgcolor: panelGreen,
                borderTop: "1px solid rgba(30, 107, 53, 0.1)",
                px: { xs: 2.5, sm: 3.5 },
                py: { xs: 2, sm: 2.25 },
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 1.25, sm: 2 },
              }}
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Typography
                  sx={{ fontSize: "0.875rem", color: "rgba(31,42,68,0.65)", fontWeight: 500 }}
                >
                  {copy.newHere || "New here?"}
                </Typography>
                <MKButton
                  component={RouterLink}
                  to={DONATE_PAGE_PATH}
                  variant="outlined"
                  startIcon={<FavoriteIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: "10px",
                    borderColor: brandGreen,
                    color: brandGreen,
                    px: 2,
                    py: 0.75,
                    fontSize: "0.875rem",
                    "&:hover": { borderColor: brandGreenDark, bgcolor: "rgba(30,107,53,0.04)" },
                  }}
                >
                  {t("donatePage.donateNow") || "Donate Now"}
                </MKButton>
              </Stack>

              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  color: "rgba(31,42,68,0.4)",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {copy.or || "or"}
              </Typography>

              <MKButton
                component={RouterLink}
                to="/home"
                variant="outlined"
                startIcon={<HomeOutlinedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "10px",
                  borderColor: "rgba(31,42,68,0.18)",
                  color: "#1f2a44",
                  px: 2,
                  py: 0.75,
                  fontSize: "0.875rem",
                  "&:hover": { bgcolor: "rgba(31,42,68,0.03)" },
                }}
              >
                {t("donationResult.backHome") || "Back to Home"}
              </MKButton>
            </Box>
          </Card>
        </Container>
      </MKBox>
      <DefaultFooter content={footerRoutes} />
    </MKBox>
  );
}
