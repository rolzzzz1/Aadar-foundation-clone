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
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
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
import {
  DONATE_PAGE_PATH,
  validateAddressLine,
  validateContactIN,
  validateEmail,
  validatePan,
  validatePinIn,
} from "utils/donation";
import { ABOUT_PATH } from "utils/paths";
import { formatApiErrorMessage, getApiUrl, postJson } from "utils/api";
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
  "& .MuiInputBase-input": {
    fontSize: { xs: "0.9375rem", sm: "0.975rem" },
    py: 1.45,
    lineHeight: 1.5,
  },
  "& .MuiInputLabel-root": {
    fontSize: { xs: "0.875rem", sm: "0.9375rem" },
    fontWeight: 600,
    lineHeight: 1.55,
    overflow: "visible",
    textOverflow: "clip",
    maxWidth: "calc(100% - 28px)",
    whiteSpace: "nowrap",
    // Devanagari matras need extra room inside the field before shrink.
    "&.MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
      transform: "translate(14px, 16px) scale(1)",
    },
    "&.MuiInputLabel-shrink": {
      // Default maxWidth calc clips Hindi glyphs on the left/top.
      maxWidth: "none",
      overflow: "visible",
      lineHeight: 1.45,
      letterSpacing: "0.01em",
      px: 0.35,
    },
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(30, 107, 53, 0.04)",
    overflow: "visible",
    "& fieldset": {
      borderColor: "rgba(30, 107, 53, 0.16)",
      overflow: "visible",
    },
    // Widen the outline notch so shrunk Hindi labels are not cut.
    "& .MuiOutlinedInput-notchedOutline legend": {
      maxWidth: "100%",
    },
    "& .MuiOutlinedInput-notchedOutline legend span": {
      paddingLeft: "8px",
      paddingRight: "8px",
    },
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

const channelCardSx = (selected) => ({
  position: "relative",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 1.25,
  width: "100%",
  m: 0,
  p: { xs: 1.5, sm: 1.75 },
  pr: { xs: 1.25, sm: 1.5 },
  textAlign: "left",
  cursor: "pointer",
  borderRadius: "18px",
  overflow: "hidden",
  fontFamily: "inherit",
  border: selected ? `1.5px solid ${brandGreen}` : "1.5px solid rgba(31, 42, 68, 0.1)",
  background: selected
    ? `linear-gradient(155deg, #ffffff 0%, ${panelGreen} 55%, ${brandYellowSoft} 100%)`
    : "linear-gradient(180deg, #ffffff 0%, #fbfcfa 100%)",
  boxShadow: selected
    ? `0 14px 32px rgba(30, 107, 53, 0.16), 0 0 0 3px rgba(236, 165, 51, 0.12)`
    : "0 6px 18px rgba(31, 42, 68, 0.05)",
  transform: selected ? "translateY(-2px)" : "none",
  transition:
    "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderRadius: "18px 0 0 18px",
    background: selected
      ? `linear-gradient(180deg, ${brandYellow} 0%, ${brandGreen} 100%)`
      : "transparent",
  },
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: selected ? brandGreen : yellowBorder,
    boxShadow: selected
      ? `0 16px 36px rgba(30, 107, 53, 0.18), 0 0 0 3px rgba(236, 165, 51, 0.16)`
      : `0 10px 24px rgba(31, 42, 68, 0.08), 0 0 0 3px ${yellowTint}`,
    "& .channel-card-arrow": {
      transform: "translateX(3px)",
      bgcolor: selected ? brandGreen : "rgba(30, 107, 53, 0.12)",
      color: selected ? "#fff" : brandGreenDark,
    },
  },
  "&:focus-visible": {
    outline: `3px solid ${yellowTintStrong}`,
    outlineOffset: 2,
  },
});

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

const MAX_SCREENSHOT_BYTES = 3 * 1024 * 1024;
const ALLOWED_SCREENSHOT_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

const emptyBankForm = {
  name: "",
  fatherOrHusbandName: "",
  mobile: "",
  email: "",
  pan: "",
  address: "",
  city: "",
  state: "",
  pin: "",
  amountInr: "",
  paidAt: todayIsoDate(),
  transactionRef: "",
  screenshotName: "",
  screenshotType: "",
  screenshotBase64: "",
};

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

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
  const [channel, setChannel] = useState("online"); // 'online' | 'bank'
  const [bankForm, setBankForm] = useState({ ...emptyBankForm, paidAt: todayIsoDate() });
  const [bankBusy, setBankBusy] = useState(false);
  const [bankError, setBankError] = useState("");
  const [bankSuccess, setBankSuccess] = useState("");

  const copy = useMemo(() => t("receiptRetrieve", { returnObjects: true }), [t]);

  const donationsHeadingRef = useRef(null);
  const prevDonationsCountRef = useRef(0);
  const receiptCardRef = useRef(null);
  const screenshotInputRef = useRef(null);

  useEffect(() => {
    const hash = String(window.location.hash || "")
      .replace(/^#/, "")
      .toLowerCase();
    if (hash === "bank" || hash === "qr" || hash === "transfer") {
      setChannel("bank");
    }
  }, []);

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

  const updateBankField = (field) => (event) => {
    setBankForm((prev) => ({ ...prev, [field]: event.target.value }));
    setBankError("");
    setBankSuccess("");
  };

  const handleScreenshotChange = async (event) => {
    const file = event.target.files && event.target.files[0];
    setBankError("");
    setBankSuccess("");
    if (!file) {
      setBankForm((prev) => ({
        ...prev,
        screenshotName: "",
        screenshotType: "",
        screenshotBase64: "",
      }));
      return;
    }
    if (!ALLOWED_SCREENSHOT_TYPES.has(String(file.type || "").toLowerCase())) {
      setBankError(copy.bankScreenshotType || "Please upload a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_SCREENSHOT_BYTES) {
      setBankError(copy.bankScreenshotTooLarge || "Screenshot must be under 3 MB.");
      event.target.value = "";
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setBankForm((prev) => ({
        ...prev,
        screenshotName: file.name,
        screenshotType: file.type,
        screenshotBase64: dataUrl,
      }));
    } catch {
      setBankError(copy.bankFailed || "Could not read screenshot file.");
      event.target.value = "";
    }
  };

  const handleBankSubmit = async (event) => {
    event.preventDefault();
    setBankError("");
    setBankSuccess("");

    const name = String(bankForm.name || "").trim();
    const father = String(bankForm.fatherOrHusbandName || "").trim();
    const emailCheck = validateEmail(bankForm.email);
    const mobileCheck = validateContactIN(bankForm.mobile);
    const panCheck = validatePan(bankForm.pan);
    const addressCheck = validateAddressLine(bankForm.address);
    const city = String(bankForm.city || "").trim();
    const state = String(bankForm.state || "").trim();
    const pinCheck = validatePinIn(bankForm.pin);
    const amount = Math.round(Number(bankForm.amountInr));
    const utr = String(bankForm.transactionRef || "").trim();

    if (
      !name ||
      !father ||
      !emailCheck.ok ||
      !mobileCheck.ok ||
      !panCheck.ok ||
      !panCheck.value ||
      !addressCheck.ok ||
      !city ||
      !state ||
      !pinCheck.ok ||
      !Number.isFinite(amount) ||
      amount < 1 ||
      !bankForm.paidAt ||
      utr.length < 4
    ) {
      setBankError(copy.bankInvalid || "Please fill all required fields correctly.");
      return;
    }
    if (!bankForm.screenshotBase64) {
      setBankError(copy.bankScreenshotRequired || "Please attach your payment screenshot.");
      return;
    }

    setBankBusy(true);
    try {
      const url = getApiUrl("/api/receipt-request");
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name,
          father_or_husband_name: father,
          email: emailCheck.value,
          mobile: mobileCheck.value,
          pan: panCheck.value,
          address: addressCheck.value,
          city,
          state,
          pin: pinCheck.value,
          amount_inr: amount,
          paid_at: bankForm.paidAt,
          transaction_ref: utr,
          screenshot_base64: bankForm.screenshotBase64,
          screenshot_type: bankForm.screenshotType,
          screenshot_name: bankForm.screenshotName,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(formatApiErrorMessage(data, res.status));
      }
      setBankSuccess(
        t("receiptRetrieve.bankSuccess", {
          email: emailCheck.value,
          defaultValue:
            copy.bankSuccess ||
            `Your request was emailed to Aadar Foundation. After verification, we'll send your 80G tax receipt to ${emailCheck.value}.`,
        })
      );
      setBankForm({ ...emptyBankForm, paidAt: todayIsoDate() });
      if (screenshotInputRef.current) screenshotInputRef.current.value = "";
    } catch (err) {
      setBankError((err && err.message) || copy.bankFailed || t("receiptRetrieve.bankFailed"));
    } finally {
      setBankBusy(false);
    }
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

  const onlineLookupForm = (
    <Stack spacing={2.5} sx={{ width: "100%", maxWidth: 640, mx: "auto", alignItems: "center" }}>
      <Box sx={{ width: "100%" }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(31, 42, 68, 0.45)",
            mb: 1,
            textAlign: "center",
          }}
        >
          {copy.findByLabel || "Find by"}
        </Typography>
        <Box
          role="tablist"
          aria-label={copy.contactEmail || "Contact method"}
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0.6,
            p: 0.6,
            borderRadius: "16px",
            bgcolor: "rgba(30, 107, 53, 0.05)",
            border: "1px solid rgba(30, 107, 53, 0.12)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
        >
          {[
            {
              value: "email",
              label: copy.contactEmail || "Email",
              icon: EmailOutlinedIcon,
            },
            {
              value: "mobile",
              label: copy.contactMobile || "Mobile",
              icon: PhoneIphoneOutlinedIcon,
            },
          ].map((option) => {
            const selected = contactLookup.method === option.value;
            const Icon = option.icon;
            return (
              <Box
                key={option.value}
                component="button"
                type="button"
                role="tab"
                aria-selected={selected}
                disabled={busy}
                onClick={() => {
                  setContactLookup({ method: option.value, value: "" });
                  setError("");
                  setDonationsList(null);
                }}
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.85,
                  py: 1.2,
                  px: 1.25,
                  m: 0,
                  cursor: busy ? "not-allowed" : "pointer",
                  borderRadius: "12px",
                  border: "none",
                  bgcolor: selected ? "#fff" : "transparent",
                  color: selected ? brandGreenDark : "rgba(31, 42, 68, 0.5)",
                  fontWeight: selected ? 800 : 600,
                  fontSize: "0.9rem",
                  fontFamily: "inherit",
                  lineHeight: 1.2,
                  boxShadow: selected
                    ? `0 6px 16px rgba(30, 107, 53, 0.12), inset 0 -2px 0 ${brandYellow}`
                    : "none",
                  transition:
                    "background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease",
                  "&:hover": {
                    color: selected ? brandGreenDark : ink,
                    bgcolor: selected ? "#fff" : "rgba(255,255,255,0.55)",
                  },
                  "&:focus-visible": {
                    outline: `3px solid ${yellowTintStrong}`,
                    outlineOffset: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "9px",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: selected ? "rgba(30, 107, 53, 0.1)" : "rgba(31, 42, 68, 0.06)",
                    color: selected ? brandGreen : "inherit",
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: 16 }} />
                </Box>
                {option.label}
              </Box>
            );
          })}
        </Box>
      </Box>

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
                  <PhoneIphoneOutlinedIcon sx={{ fontSize: 20, color: "rgba(31,42,68,0.35)" }} />
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
    </Stack>
  );

  const bankRequestForm = (
    <Stack
      spacing={2}
      sx={{ width: "100%", maxWidth: 640, mx: "auto", overflow: "visible", pt: 0.75 }}
    >
      <Typography sx={{ fontSize: "0.82rem", color: "rgba(31,42,68,0.62)", textAlign: "center" }}>
        {copy.bankFormHint ||
          "Fill this form to send your details to Aadar Foundation. A payment screenshot is required."}
        <br />
        {copy.bankIntroAfter || "After verification, we'll email your 80G tax receipt."}
      </Typography>

      {bankSuccess ? (
        <Alert severity="success" sx={{ borderRadius: "10px" }}>
          {bankSuccess}
        </Alert>
      ) : null}

      <Box component="form" onSubmit={handleBankSubmit}>
        <Grid container spacing={1.75}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={copy.name || "Full name"}
              value={bankForm.name}
              onChange={updateBankField("name")}
              fullWidth
              required
              disabled={bankBusy}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={copy.fatherHusband || "Father / husband name"}
              value={bankForm.fatherOrHusbandName}
              onChange={updateBankField("fatherOrHusbandName")}
              fullWidth
              required
              disabled={bankBusy}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={copy.mobile || "Mobile number"}
              value={bankForm.mobile}
              onChange={updateBankField("mobile")}
              placeholder="9826441863"
              type="tel"
              fullWidth
              required
              disabled={bankBusy}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={copy.email || "Email"}
              value={bankForm.email}
              onChange={updateBankField("email")}
              type="email"
              fullWidth
              required
              disabled={bankBusy}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={copy.panRequired || copy.pan || "PAN (required)"}
              value={bankForm.pan}
              onChange={updateBankField("pan")}
              placeholder="ABCDE1234F"
              fullWidth
              required
              disabled={bankBusy}
              inputProps={{ maxLength: 10 }}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={copy.amount || "Amount (₹)"}
              value={bankForm.amountInr}
              onChange={updateBankField("amountInr")}
              type="number"
              inputProps={{ min: 1, step: 1 }}
              fullWidth
              required
              disabled={bankBusy}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={copy.address || "Address"}
              value={bankForm.address}
              onChange={updateBankField("address")}
              fullWidth
              required
              disabled={bankBusy}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label={copy.city || "City"}
              value={bankForm.city}
              onChange={updateBankField("city")}
              fullWidth
              required
              disabled={bankBusy}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label={copy.state || "State"}
              value={bankForm.state}
              onChange={updateBankField("state")}
              fullWidth
              required
              disabled={bankBusy}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label={copy.pin || "PIN code"}
              value={bankForm.pin}
              onChange={updateBankField("pin")}
              fullWidth
              required
              disabled={bankBusy}
              inputProps={{ maxLength: 6, inputMode: "numeric" }}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={copy.paidAt || "Payment date"}
              value={bankForm.paidAt}
              onChange={updateBankField("paidAt")}
              type="date"
              InputLabelProps={{
                shrink: true,
                sx: {
                  maxWidth: "none",
                  overflow: "visible",
                  lineHeight: 1.45,
                  px: 0.35,
                },
              }}
              fullWidth
              required
              disabled={bankBusy}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={copy.bankUtr || copy.utr || "UTR / Bank Reference"}
              value={bankForm.transactionRef}
              onChange={updateBankField("transactionRef")}
              placeholder="123456789012"
              fullWidth
              required
              disabled={bankBusy}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              ref={screenshotInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handleScreenshotChange}
            />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <MKButton
                type="button"
                variant="outlined"
                color="dark"
                disabled={bankBusy}
                startIcon={<AttachFileOutlinedIcon />}
                onClick={() => screenshotInputRef.current?.click()}
                sx={{ textTransform: "none", fontWeight: 700, borderRadius: "12px" }}
              >
                {copy.bankScreenshotChoose || "Upload screenshot"}
              </MKButton>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: ink,
                    lineHeight: 1.55,
                    overflow: "visible",
                  }}
                >
                  {copy.bankScreenshot || "Payment screenshot"} *
                </Typography>
                <Typography
                  sx={{ fontSize: "0.78rem", color: "rgba(31,42,68,0.55)", lineHeight: 1.45 }}
                >
                  {bankForm.screenshotName
                    ? t("receiptRetrieve.bankScreenshotSelected", {
                        name: bankForm.screenshotName,
                        defaultValue: `Selected: ${bankForm.screenshotName}`,
                      })
                    : copy.bankScreenshotHint || "JPG, PNG or WebP · max 3 MB"}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {bankError ? (
          <Alert severity="error" sx={{ mt: 2, borderRadius: "10px" }}>
            {bankError}
          </Alert>
        ) : null}

        <MKButton
          type="submit"
          variant="contained"
          disabled={bankBusy}
          fullWidth
          aria-busy={bankBusy}
          startIcon={
            bankBusy ? (
              <CircularProgress size={20} color="inherit" thickness={5} />
            ) : (
              <SendOutlinedIcon sx={{ fontSize: 20 }} />
            )
          }
          sx={{ ...findReceiptBtnSx, mt: 2.25 }}
        >
          {bankBusy
            ? copy.bankSubmitting || "Sending…"
            : copy.bankSubmit || "Submit receipt request"}
        </MKButton>
      </Box>
    </Stack>
  );

  const selectChannel = (value) => {
    setChannel(value);
    setError("");
    setBankError("");
    setBankSuccess("");
    setDonationsList(null);
    if (value === "bank") {
      window.history.replaceState(null, "", `${window.location.pathname}#bank`);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const channelOptions = [
    {
      value: "online",
      title: copy.channelOnline || copy.tabOnline || "Online Donations via Razorpay",
      subtitle: copy.channelOnlineHint || "Instant lookup & 80G PDF download",
      icon: PaymentsOutlinedIcon,
    },
    {
      value: "bank",
      title: copy.channelBank || copy.tabUpi || "Donated via Direct QR or Bank Transfer",
      subtitle: copy.channelBankHint || "Submit details for verification",
      icon: AccountBalanceOutlinedIcon,
    },
  ];

  const lookupForm = (
    <Stack spacing={2.75} sx={{ width: "100%", alignItems: "center" }}>
      <Box sx={{ width: "100%" }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(31, 42, 68, 0.45)",
            mb: 1.25,
            textAlign: "center",
          }}
        >
          {copy.chooseDonationType || "How did you donate?"}
        </Typography>
        <Box
          role="tablist"
          aria-label={copy.chooseDonationType || "Donation type"}
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1.35,
          }}
        >
          {channelOptions.map((option) => {
            const selected = channel === option.value;
            const Icon = option.icon;
            return (
              <Box
                key={option.value}
                component="button"
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectChannel(option.value)}
                sx={channelCardSx(selected)}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "14px",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: selected ? "rgba(30, 107, 53, 0.14)" : "rgba(31, 42, 68, 0.06)",
                    color: selected ? brandGreen : "rgba(31, 42, 68, 0.45)",
                    boxShadow: selected ? `0 0 0 4px rgba(236, 165, 51, 0.14)` : "none",
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: 22 }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1, pr: 0.5 }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "0.9rem", sm: "0.95rem" },
                      color: selected ? brandGreenDark : ink,
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {option.title}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.45,
                      fontSize: "0.78rem",
                      lineHeight: 1.4,
                      color: selected ? "rgba(23, 79, 40, 0.72)" : "rgba(31, 42, 68, 0.5)",
                    }}
                  >
                    {option.subtitle}
                  </Typography>
                </Box>
                <Box
                  className="channel-card-arrow"
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "999px",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    bgcolor: selected ? brandGreen : "rgba(31, 42, 68, 0.06)",
                    color: selected ? "#fff" : "rgba(31, 42, 68, 0.45)",
                    boxShadow: selected ? "0 4px 12px rgba(30, 107, 53, 0.28)" : "none",
                    transition: "transform 0.2s ease, background-color 0.2s ease, color 0.2s ease",
                  }}
                >
                  <ChevronRightIcon sx={{ fontSize: 22 }} />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {channel === "online" ? onlineLookupForm : bankRequestForm}
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
              overflow: "visible",
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
                borderRadius: "22px 22px 0 0",
                background: `linear-gradient(90deg, ${brandGreenDark} 0%, ${brandGreen} 32%, ${brandYellow} 50%, ${brandGreen} 68%, ${brandGreenDark} 100%)`,
                zIndex: 2,
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                p: { xs: 3, sm: 3.75, md: 4.25 },
                overflow: "visible",
              }}
            >
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
                    mb: 0,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                  }}
                >
                  {copy.title || "Retrieve your donation receipt"}
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
