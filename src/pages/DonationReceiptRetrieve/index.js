import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
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

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
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
import { ABOUT_PATH } from "utils/paths";
import { postJson } from "utils/api";
import { validateEmail } from "utils/donation";
import { formatInr } from "utils/receiptFormat";

const brandGreen = "#1e6b35";
const brandGreenDark = "#174f28";
const brandGreenLight = "#2d8a4e";
const brandYellow = "#ECA533";
const brandYellowSoft = "#FFF8EC";
const yellowTint = "rgba(236, 165, 51, 0.12)";
const yellowTintStrong = "rgba(236, 165, 51, 0.2)";
const yellowBorder = "rgba(236, 165, 51, 0.35)";
const panelGreen = "#edf7ee";
const panelGreenSoft = "#f6fbf7";
const panelWarm = "#faf8f2";
const ink = "#1f2a44";

const fieldSx = {
  "& .MuiInputBase-input": { fontSize: { xs: "0.9375rem", sm: "0.975rem" }, py: 1.45 },
  "& .MuiInputLabel-root": { fontSize: { xs: "0.875rem", sm: "0.9375rem" }, fontWeight: 600 },
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(30, 107, 53, 0.04)",
    "& fieldset": { borderColor: "rgba(30, 107, 53, 0.16)" },
    "&:hover fieldset": { borderColor: yellowBorder },
    "&.Mui-focused fieldset": {
      borderColor: brandGreen,
      borderWidth: "1.5px",
    },
    "&.Mui-focused": {
      boxShadow: `0 0 0 3px ${yellowTintStrong}`,
    },
  },
};

const tabSx = {
  minHeight: 48,
  p: 0.5,
  borderRadius: "14px",
  bgcolor: "rgba(236, 165, 51, 0.07)",
  border: `1px solid ${yellowBorder}`,
  "& .MuiTabs-flexContainer": { gap: 0.5 },
  "& .MuiTab-root": {
    minHeight: 42,
    flex: 1,
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.9rem",
    color: "rgba(31, 42, 68, 0.5)",
    gap: 0.75,
    borderRadius: "11px",
    transition: "background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
    "&.Mui-selected": {
      color: brandGreenDark,
      fontWeight: 700,
      bgcolor: "#fff",
      boxShadow: `0 3px 12px rgba(30, 107, 53, 0.1), inset 0 -2px 0 ${brandYellow}`,
    },
  },
  "& .MuiTabs-indicator": { display: "none" },
};

const findReceiptBtnSx = {
  py: 1.55,
  px: 2.5,
  minHeight: 52,
  fontWeight: 800,
  letterSpacing: "0.015em",
  textTransform: "none",
  borderRadius: "14px",
  fontSize: { xs: "0.95rem", sm: "1rem" },
  color: "#fff",
  background: `linear-gradient(135deg, ${brandGreenLight} 0%, ${brandGreen} 50%, ${brandGreenDark} 100%)`,
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: `
    0 10px 24px rgba(30, 107, 53, 0.26),
    0 4px 12px rgba(236, 165, 51, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.2)
  `,
  transition: "transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
  "& .MuiButton-startIcon": {
    marginRight: "10px",
    marginLeft: "-2px",
  },
  "&:hover": {
    transform: "translateY(-2px)",
    filter: "brightness(1.03)",
    background: `linear-gradient(135deg, ${brandGreen} 0%, ${brandGreenDark} 70%, ${brandYellow} 100%)`,
    boxShadow: `
      0 14px 32px rgba(30, 107, 53, 0.3),
      0 6px 18px rgba(236, 165, 51, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.26)
    `,
  },
  "&:active": {
    transform: "translateY(0)",
    boxShadow: "0 6px 16px rgba(30, 107, 53, 0.22)",
  },
  "&:focus-visible": {
    outline: `3px solid ${yellowTintStrong}`,
    outlineOffset: 2,
  },
  "&.Mui-disabled": {
    color: "rgba(255,255,255,0.92)",
    background: `linear-gradient(135deg, rgba(45,138,78,0.6) 0%, rgba(30,107,53,0.6) 100%)`,
    boxShadow: "none",
    transform: "none",
  },
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

function BotanicalLeaf({ flip, sx }) {
  const gradId = React.useId();

  return (
    <Box
      component="svg"
      viewBox="0 0 56 88"
      aria-hidden
      sx={{
        width: 56,
        height: 88,
        transform: flip ? "scaleX(-1)" : undefined,
        ...sx,
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={brandGreenLight} stopOpacity="0.62" />
          <stop offset="55%" stopColor={brandGreen} stopOpacity="0.48" />
          <stop offset="100%" stopColor={brandYellow} stopOpacity="0.32" />
        </linearGradient>
      </defs>
      <path
        d="M28 6 C16 8 8 20 8 34 C8 50 16 68 28 82 C40 68 48 50 48 34 C48 20 40 8 28 6 Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M28 12 L28 76 M28 22 C22 26 16 34 14 44 M28 22 C34 26 40 34 42 44 M28 38 C24 46 20 54 18 62 M28 38 C32 46 36 54 38 62"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </Box>
  );
}

BotanicalLeaf.propTypes = {
  flip: PropTypes.bool,
  sx: PropTypes.object,
};

BotanicalLeaf.defaultProps = {
  flip: false,
  sx: undefined,
};

const vineTone = {
  stroke: "rgba(31, 42, 68, 0.18)",
  strokeSoft: "rgba(31, 42, 68, 0.12)",
  leafFill: "rgba(31, 42, 68, 0.08)",
  leafFillDeep: "rgba(31, 42, 68, 0.11)",
  vein: "rgba(255, 255, 255, 0.38)",
};

function SideVine({ flip, sx }) {
  const { transform: sxTransform, ...restSx } = sx || {};
  const transform =
    [flip ? "scaleX(-1)" : null, sxTransform].filter(Boolean).join(" ") || undefined;

  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        display: "block",
        lineHeight: 0,
        transform,
        ...restSx,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 140 560"
        sx={{ width: "100%", height: "100%", display: "block" }}
      >
        <path
          d="M84 18 C72 56 58 84 44 112 C30 140 22 174 30 214 C38 252 52 282 64 312 C78 346 86 382 80 420 C74 458 56 496 40 540"
          stroke={vineTone.stroke}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M52 132 C36 128 22 118 12 104"
          stroke={vineTone.strokeSoft}
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M64 312 C84 320 100 336 110 356"
          stroke={vineTone.strokeSoft}
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />

        <g transform="translate(42 106) rotate(-18)">
          <path
            d="M0 0 C-16 -6 -28 8 -28 24 C-16 14 -8 6 0 0 C10 4 18 12 28 24 C28 8 16 -6 0 0 Z"
            fill={vineTone.leafFillDeep}
          />
          <path
            d="M0 4 L0 22 M0 9 C-7 14 -12 18 -14 22"
            stroke={vineTone.vein}
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        <g transform="translate(70 152) rotate(22)">
          <path
            d="M0 0 C-14 -5 -24 8 -24 22 C-14 14 -7 7 0 0 C9 4 16 11 24 22 C24 8 14 -5 0 0 Z"
            fill={vineTone.leafFill}
          />
          <path
            d="M0 4 L0 20"
            stroke={vineTone.vein}
            strokeWidth="0.7"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        <g transform="translate(32 226) rotate(-30)">
          <path
            d="M0 0 C-15 -5 -26 9 -26 24 C-15 15 -7 7 0 0 C10 4 17 12 26 24 C26 9 15 -5 0 0 Z"
            fill={vineTone.leafFill}
          />
        </g>
        <g transform="translate(76 268) rotate(34)">
          <path
            d="M0 0 C-12 -4 -20 7 -20 18 C-12 12 -6 6 0 0 C7 3 13 9 20 18 C20 7 12 -4 0 0 Z"
            fill={vineTone.leafFillDeep}
          />
        </g>
        <g transform="translate(56 342) rotate(-16)">
          <path
            d="M0 0 C-14 -5 -24 8 -24 22 C-14 14 -7 7 0 0 C9 4 16 11 24 22 C24 8 14 -5 0 0 Z"
            fill={vineTone.leafFill}
          />
          <path
            d="M0 3 L0 19"
            stroke={vineTone.vein}
            strokeWidth="0.7"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        <g transform="translate(28 412) rotate(-40)">
          <path
            d="M0 0 C-15 -5 -26 10 -26 26 C-15 16 -7 8 0 0 C10 4 18 12 26 26 C26 10 15 -5 0 0 Z"
            fill={vineTone.leafFillDeep}
          />
        </g>
        <g transform="translate(66 458) rotate(18)">
          <path
            d="M0 0 C-13 -4 -22 8 -22 20 C-13 13 -6 6 0 0 C8 4 14 10 22 20 C22 8 13 -4 0 0 Z"
            fill={vineTone.leafFill}
          />
        </g>
      </Box>
    </Box>
  );
}

SideVine.propTypes = {
  flip: PropTypes.bool,
  sx: PropTypes.object,
};

SideVine.defaultProps = {
  flip: false,
  sx: undefined,
};

function CardHeaderFlourish() {
  return (
    <>
      <SideVine
        sx={{
          position: "absolute",
          top: { xs: -6, sm: -10 },
          left: { xs: -6, sm: -2 },
          width: { xs: 76, sm: 92 },
          height: { xs: 140, sm: 160 },
          opacity: { xs: 0.34, sm: 0.4 },
          transform: "rotate(-8deg)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function ReceiptPageFoliage() {
  return (
    <>
      <SideVine
        sx={{
          position: "absolute",
          top: { xs: 86, md: 98 },
          left: { xs: -48, md: -38 },
          height: { xs: 540, md: 580 },
          width: { xs: 120, md: 140 },
          opacity: { xs: 0.14, md: 0.16 },
          pointerEvents: "none",
        }}
      />
      <SideVine
        flip
        sx={{
          position: "absolute",
          top: { xs: 86, md: 98 },
          right: { xs: -48, md: -38 },
          height: { xs: 540, md: 580 },
          width: { xs: 120, md: 140 },
          opacity: { xs: 0.14, md: 0.16 },
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function ImpactStat({ icon: Icon, title, subtitle }) {
  const isTransparency = /100%\s*transparent/i.test(title);

  return (
    <Box
      sx={{
        textAlign: "center",
        px: { xs: 0.5, sm: 1 },
        py: 0.85,
        borderRadius: "14px",
        bgcolor: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(30, 107, 53, 0.1)",
        height: "100%",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 20px rgba(30, 107, 53, 0.08)",
        },
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "12px",
          background: `linear-gradient(145deg, rgba(30, 107, 53, 0.1) 0%, ${yellowTint} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 0.8,
        }}
      >
        <Icon sx={{ fontSize: 20, color: brandGreen }} />
      </Box>
      <Typography
        sx={{ fontWeight: 800, fontSize: "0.9rem", color: brandGreenDark, lineHeight: 1.25 }}
      >
        {isTransparency ? title.replace(/^100%\s*/i, "") : title}
      </Typography>
      <Typography
        sx={{ fontSize: "0.72rem", color: "rgba(31, 42, 68, 0.58)", lineHeight: 1.4, mt: 0.4 }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}

ImpactStat.propTypes = {
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

  const donationsHeadingRef = useRef(null);
  const prevDonationsCountRef = useRef(0);
  const receiptCardRef = useRef(null);

  useEffect(() => {
    const count = Array.isArray(donationsList) ? donationsList.length : 0;
    const prev = prevDonationsCountRef.current;
    prevDonationsCountRef.current = count;
    if (!count || count === prev) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Wait until list renders, then scroll near heading (offset for sticky navbar).
    const behavior = prefersReducedMotion ? "auto" : "smooth";
    const offset = 170;
    window.requestAnimationFrame(() => {
      const el = donationsHeadingRef.current;
      if (!el) return;
      const top = window.scrollY + el.getBoundingClientRect().top - offset;
      window.scrollTo({ top: Math.max(0, top), behavior });
    });
  }, [donationsList]);

  const scrollToReceiptCardTop = () => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scroll up to the top of the receipt card (offset for sticky navbar).
    const behavior = prefersReducedMotion ? "auto" : "smooth";
    const offset = 110;
    window.requestAnimationFrame(() => {
      const el = receiptCardRef.current;
      if (!el) return;
      const top = window.scrollY + el.getBoundingClientRect().top - offset;
      window.scrollTo({ top: Math.max(0, top), behavior });
    });
  };

  useEffect(() => {
    if (!record) return;
    // Once the receipt is ready, scroll up to the top of the receipt card.
    scrollToReceiptCardTop();
  }, [record]);

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
            py: 1.1,
            fontWeight: 700,
            fontSize: "0.9rem",
            textTransform: "none",
            borderRadius: "10px",
            background: brandGreen,
            color: "#ffffff !important",
            boxShadow: "none",
            transition: "background 0.18s ease",
            "& *": { color: "#ffffff" },
            "&:hover": {
              background: brandGreenDark,
              boxShadow: "none",
            },
          }}
        >
          {t("donationResult.downloadPdf")}
        </MKButton>
        <MKButton
          fullWidth
          variant="outlined"
          startIcon={<ReplayOutlinedIcon />}
          onClick={() => {
            resetResult();
            scrollToReceiptCardTop();
          }}
          sx={{
            py: 1.1,
            fontWeight: 600,
            fontSize: "0.9rem",
            textTransform: "none",
            borderRadius: "10px",
            borderColor: "rgba(31,42,68,0.14)",
            color: "rgba(31, 42, 68, 0.6)",
            "&:hover": {
              borderColor: "rgba(31,42,68,0.24)",
              bgcolor: "rgba(31,42,68,0.03)",
            },
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
    <Stack spacing={2.25} sx={{ width: "100%", alignItems: "center" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stack
          spacing={2.25}
          sx={{
            width: "100%",
            maxWidth: 640,
            alignItems: "center",
            py: { xs: 1.25, sm: 1.75 },
          }}
        >
          <Tabs
            value={contactLookup.method}
            onChange={(_, value) => {
              setContactLookup({ method: value, value: "" });
              setError("");
              setDonationsList(null);
            }}
            sx={{ ...tabSx, width: "100%", mx: "auto", alignSelf: "center" }}
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

          <Box
            component="form"
            sx={{ width: "100%", mx: "auto", alignSelf: "center", pb: { xs: 0.5, sm: 0.75 } }}
            onSubmit={(e) => {
              e.preventDefault();
              if (!busy) handleFindDonations();
            }}
          >
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
              sx={{ ...fieldSx, mb: 2.25 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {contactLookup.method === "mobile" ? (
                      <PhoneIphoneOutlinedIcon
                        sx={{ fontSize: 20, color: "rgba(31,42,68,0.35)" }}
                      />
                    ) : (
                      <EmailOutlinedIcon sx={{ fontSize: 20, color: "rgba(31,42,68,0.35)" }} />
                    )}
                  </InputAdornment>
                ),
              }}
            />

            <MKButton
              type="submit"
              variant="contained"
              disabled={busy}
              fullWidth
              aria-busy={busy}
              startIcon={
                busy ? (
                  <CircularProgress size={20} color="inherit" thickness={5} />
                ) : (
                  <SearchOutlinedIcon sx={{ fontSize: 22 }} />
                )
              }
              sx={findReceiptBtnSx}
            >
              {busy
                ? copy.busy || t("donationResult.lookupBusy")
                : copy.findMyReceipt || copy.findDonations || "Find My Receipt"}
            </MKButton>
          </Box>

          {error ? (
            <Alert severity="error" sx={{ width: "100%", borderRadius: "10px" }}>
              {error}
            </Alert>
          ) : null}

          {donationsList?.length ? (
            <Box sx={{ width: "100%" }}>
              <Typography
                ref={donationsHeadingRef}
                sx={{ fontWeight: 800, color: "#1f2a44", mb: 1.25, fontSize: "0.9375rem" }}
              >
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

          <Box sx={{ textAlign: "center", pt: 1.5 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.875rem",
                color: ink,
                mb: 1,
              }}
            >
              {copy.cantFindTitle || "Can't find your receipt?"}
            </Typography>
            <Box
              sx={{
                px: { xs: 1.5, sm: 2 },
                py: 1.25,
                borderRadius: "12px",
                bgcolor: "rgba(30, 107, 53, 0.04)",
                border: "1px dashed rgba(30, 107, 53, 0.16)",
                width: "100%",
                maxWidth: 640,
                mx: "auto",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  color: "rgba(31, 42, 68, 0.62)",
                  lineHeight: 1.5,
                  fontStyle: "italic",
                }}
              >
                {ctaCopy.bankTransferNote ||
                  "For UPI/QR or bank transfer donations, email aadarfoundation2018@gmail.com with your donor details (name, father/husband name, email, mobile, PAN, address), donation details (amount and date), transaction reference (UTR/Bank Ref), and payment screenshot. We will verify the payment and email your 80G tax receipt."}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );

  const impact = copy.impact || {};

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
        pt={{ xs: 16, sm: 17.5, md: 19 }}
        pb={{ xs: 4, md: 5 }}
        sx={{
          position: "relative",
          overflow: "hidden",
          background: `
            radial-gradient(ellipse 80% 50% at 15% 0%, rgba(30, 107, 53, 0.06) 0%, transparent 55%),
            radial-gradient(ellipse 60% 45% at 92% 6%, ${yellowTintStrong} 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 8% 92%, ${yellowTint} 0%, transparent 52%),
            linear-gradient(180deg, #fffdf9 0%, ${panelWarm} 44%, ${panelGreenSoft} 100%)
          `,
        }}
      >
        <ReceiptPageFoliage />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 2.5 }}
            alignItems="stretch"
            sx={{ mb: { xs: 2, md: 2.5 } }}
          >
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" mb={1.5}>
                  <Typography
                    component="h1"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "1.7rem", sm: "2rem", md: "2.15rem" },
                      color: ink,
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {copy.thankYouPrefix || "Thank you for choosing"}{" "}
                    <Box
                      component="span"
                      sx={{
                        color: brandGreen,
                        background: `linear-gradient(120deg, ${brandGreenLight} 0%, ${brandYellow} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {copy.thankYouHighlight || "kindness"}
                    </Box>
                    .
                  </Typography>
                  <FavoriteIcon sx={{ fontSize: 22, color: brandYellow, opacity: 0.88 }} />
                </Stack>

                <Typography
                  sx={{
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                    color: "rgba(31, 42, 68, 0.68)",
                    lineHeight: 1.6,
                    maxWidth: 520,
                    mb: 1.5,
                  }}
                >
                  {copy.thankYouSubtitle ||
                    "Your support helps us bring food, shelter and dignity to those who need it most."}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1.25}
                  alignItems="flex-start"
                  mb={1.5}
                  sx={{
                    p: 1.1,
                    borderRadius: "14px",
                    bgcolor: brandYellowSoft,
                    border: `1px solid ${yellowBorder}`,
                    borderLeft: `3px solid ${brandYellow}`,
                    boxShadow: `0 4px 16px ${yellowTint}`,
                    maxWidth: 520,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "10px",
                      bgcolor: yellowTint,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ShieldOutlinedIcon sx={{ fontSize: 18, color: brandYellow }} />
                  </Box>
                  <Typography
                    sx={{ fontSize: "0.875rem", color: "rgba(31, 42, 68, 0.68)", lineHeight: 1.6 }}
                  >
                    {copy.trustBadge ||
                      "Aadar Foundation is a registered NGO committed to transparency and accountability."}
                  </Typography>
                </Stack>

                <Link
                  component={RouterLink}
                  to={ABOUT_PATH}
                  underline="none"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: brandGreen,
                    width: "fit-content",
                    "&:hover": { color: brandYellow },
                  }}
                >
                  {copy.knowMore || "Know more about us"}
                  <ArrowForwardIcon sx={{ fontSize: 18 }} />
                </Link>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "100%",
                  background: `linear-gradient(160deg, ${brandYellowSoft} 0%, ${panelGreen} 50%, #e8f3ea 100%)`,
                  borderRadius: "20px",
                  border: `1px solid ${yellowBorder}`,
                  p: { xs: 1.75, sm: 2.25 },
                  boxShadow: `0 16px 40px rgba(30, 107, 53, 0.07), 0 6px 20px ${yellowTint}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <BotanicalLeaf
                  flip
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -6,
                    width: 56,
                    color: brandGreen,
                    opacity: 0.12,
                    transform: "rotate(24deg)",
                    pointerEvents: "none",
                  }}
                />
                <Typography
                  sx={{
                    textAlign: "center",
                    fontWeight: 800,
                    fontSize: { xs: "1.05rem", sm: "1.125rem" },
                    color: brandGreenDark,
                    mb: 1.5,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      display: "block",
                      width: 44,
                      height: 2,
                      borderRadius: 2,
                      background: `linear-gradient(90deg, ${brandGreen}, ${brandYellow})`,
                      mx: "auto",
                      mt: 0.75,
                    },
                  }}
                >
                  {copy.impactTitle || "Your Impact in Action"}
                </Typography>

                <Grid container spacing={1.25}>
                  <Grid item xs={6} sm={3} md={6} lg={3}>
                    <ImpactStat
                      icon={GroupsOutlinedIcon}
                      title={impact.lives?.title || "Thousands"}
                      subtitle={impact.lives?.subtitle || "Lives touched with care"}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3} md={6} lg={3}>
                    <ImpactStat
                      icon={RestaurantOutlinedIcon}
                      title={impact.meals?.title || "Daily Meals"}
                      subtitle={impact.meals?.subtitle || "Served with dignity"}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3} md={6} lg={3}>
                    <ImpactStat
                      icon={LockOutlinedIcon}
                      title={impact.shelter?.title || "Shelter & Support"}
                      subtitle={impact.shelter?.subtitle || "For the homeless & unclaimed"}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3} md={6} lg={3}>
                    <ImpactStat
                      icon={VerifiedOutlinedIcon}
                      title={impact.transparent?.title || "100% Transparent"}
                      subtitle={impact.transparent?.subtitle || "Use of every donation"}
                    />
                  </Grid>
                </Grid>

                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  justifyContent="center"
                  mt={1.5}
                >
                  <ShieldOutlinedIcon sx={{ fontSize: 16, color: brandYellow, opacity: 0.75 }} />
                  <Typography sx={{ fontSize: "0.78rem", color: "rgba(31,42,68,0.55)" }}>
                    {copy.privacyNote || "We never share your information with anyone."}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          <Card
            ref={receiptCardRef}
            sx={{
              overflow: "hidden",
              borderRadius: "22px",
              border: `1px solid ${yellowBorder}`,
              boxShadow: `0 28px 70px rgba(31, 42, 68, 0.08), 0 8px 24px ${yellowTint}`,
              position: "relative",
              bgcolor: "#fff",
              mx: "auto",
              maxWidth: 980,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${brandGreenDark} 0%, ${brandGreen} 32%, ${brandYellow} 50%, ${brandGreen} 68%, ${brandGreenDark} 100%)`,
                zIndex: 2,
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1, p: { xs: 3, sm: 3.75, md: 4.25 } }}>
              <Box
                sx={{
                  position: "relative",
                  textAlign: "center",
                  mb: 2.5,
                  pt: { xs: 1, sm: 1.25 },
                  px: { xs: 2, sm: 4 },
                }}
              >
                <CardHeaderFlourish />
                <Typography
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.25rem", sm: "1.4rem" },
                    color: brandGreenDark,
                    mb: 0.75,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                  }}
                >
                  {copy.title || "Retrieve your donation receipt"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    color: "rgba(31, 42, 68, 0.62)",
                    lineHeight: 1.55,
                    maxWidth: 480,
                    mx: "auto",
                  }}
                >
                  {copy.cardSubtitle ||
                    "Enter the email address or mobile number used during your donation."}
                </Typography>
              </Box>

              {record ? resultView : lookupForm}
            </Box>

            {!record ? (
              <Box
                sx={{
                  background: `linear-gradient(180deg, ${brandYellowSoft} 0%, ${panelGreen} 100%)`,
                  borderTop: `1px solid ${yellowBorder}`,
                  px: { xs: 2.5, sm: 3.5 },
                  py: { xs: 1.6, sm: 1.85 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "9px",
                    bgcolor: "rgba(255,255,255,0.75)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <LockOutlinedIcon sx={{ fontSize: 16, color: brandYellow }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    color: "rgba(31, 42, 68, 0.68)",
                    textAlign: "center",
                  }}
                >
                  {copy.dataSafeNote ||
                    "Your data is safe with us. We use it only to help you retrieve your receipt."}
                </Typography>
              </Box>
            ) : null}
          </Card>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems="center"
            justifyContent="center"
            sx={{
              mt: 3.5,
              pt: 2.5,
              borderTop: `1px dashed ${yellowBorder}`,
            }}
          >
            <MKButton
              component={RouterLink}
              to={DONATE_PAGE_PATH}
              variant="contained"
              startIcon={<FavoriteIcon sx={{ fontSize: 18 }} />}
              sx={{
                fontWeight: 800,
                textTransform: "none",
                borderRadius: "12px",
                background: "linear-gradient(90deg, #4FA953 0%, #45a049 100%)",
                color: "#ffffff !important",
                px: 3.5,
                py: 1.2,
                fontSize: "0.95rem",
                width: { xs: "100%", sm: "auto" },
                boxShadow: "0 12px 26px rgba(79, 169, 83, 0.36)",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
                "& *": { color: "#ffffff" },
                "&:hover": {
                  background: "linear-gradient(90deg, #45a049 0%, #3d8a41 100%)",
                  boxShadow: "0 16px 32px rgba(79, 169, 83, 0.44)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {t("donatePage.donateNow") || "Donate Now"}
            </MKButton>
            <MKButton
              component={RouterLink}
              to="/home"
              variant="text"
              startIcon={<HomeOutlinedIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "10px",
                color: "rgba(31, 42, 68, 0.55)",
                px: 2,
                py: 1,
                fontSize: "0.85rem",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  color: "rgba(31, 42, 68, 0.75)",
                  bgcolor: "rgba(31,42,68,0.04)",
                },
              }}
            >
              {t("donationResult.backHome") || "Back to Home"}
            </MKButton>
          </Stack>
        </Container>
      </MKBox>
      <DefaultFooter content={footerRoutes} />
    </MKBox>
  );
}
