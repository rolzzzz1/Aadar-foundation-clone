import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";

import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import ContactEmergencyOutlinedIcon from "@mui/icons-material/ContactEmergencyOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import HouseOutlinedIcon from "@mui/icons-material/HouseOutlined";

import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import aadarLogo from "assets/images/logos/logo-aadar.jpg";
import { ReactComponent as RazorpayLogoLight } from "assets/images/logos/razorpay-logo-light.svg";

import {
  EMAIL_MAX,
  ADDRESS_MAX,
  NAME_MAX,
  NOTE_MAX,
  PAN_LEN,
  PHONE_LEN,
  PROGRAMS,
  pickQueryAmount,
  pickQueryPurpose,
  sanitizeAmountInput,
  sanitizeText,
  toPaise,
  validateAddressLine,
  validateAmountInr,
  validateContactIN,
  validatePinIn,
  validateRequiredSelection,
  validateEmail,
  validateFatherOrHusbandName,
  validateName,
  validateNote,
  validatePan,
} from "utils/donation";
import { getApiUrl, postJson } from "utils/api";
import {
  buildRazorpayCheckoutOptions,
  getRazorpayKeyMode,
  isRazorpayTestKey,
} from "utils/razorpayCheckout";
import { buildDonationReceiptRecord } from "utils/buildDonationReceiptRecord";
import { saveDonationReceipt } from "utils/donationReceiptStorage";

const PRESET_AMOUNTS = Object.freeze([501, 1001, 3001, 5001, 15001]);
const MOST_CHOSEN_AMOUNT = 1001;

/** Organization IDs shown for Section 80G eligibility (test / donation page). */
const AADAR_ORG_PAN = "AAIAA2457N";
const AADAR_80G_REG_NO = "AAIAA2457N24BP01";

const HEADING_FONT = '"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif';
const BODY_FONT = '"Lato", "Helvetica", "Arial", sans-serif';

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const CITIES_BY_STATE = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"],
  Assam: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Durg"],
  Delhi: ["New Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Solan"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  "Madhya Pradesh": ["Gwalior", "Indore", "Bhopal", "Jabalpur", "Ujjain", "Sagar"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida", "Ghaziabad"],
  Uttarakhand: ["Dehradun", "Haridwar", "Rishikesh", "Haldwani"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
};

function citiesForState(state) {
  if (!state) return [];
  return CITIES_BY_STATE[state] || [];
}

/** Readable secondary text on the payment form (labels, helpers, placeholders). */
const formTextMuted = "#4a5568";
const formTextPlaceholder = "#5c6b82";
const formTextPrimary = "#1f2a44";
const formIconColor = "#4f5d73";

/** Shared type size for labels, values, and placeholders in donation fields. */
const formInputFontSize = "0.875rem";
const formInputMinHeight = 40;

const formFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    fontSize: formInputFontSize,
    minHeight: formInputMinHeight,
    alignItems: "center",
    boxSizing: "border-box",
    "& .MuiOutlinedInput-input": {
      py: 0.875,
      fontSize: formInputFontSize,
      fontWeight: 400,
      lineHeight: 1.43,
    },
    "& .MuiAutocomplete-input": {
      py: 0.875,
      fontSize: formInputFontSize,
      fontWeight: 400,
    },
    "& input, & textarea": {
      color: formTextPrimary,
      fontSize: formInputFontSize,
      fontWeight: 400,
    },
    "& input::placeholder, & textarea::placeholder": {
      color: formTextPlaceholder,
      opacity: 1,
      fontSize: formInputFontSize,
      fontWeight: 400,
    },
    "& .MuiInputAdornment-positionStart": {
      marginRight: 0,
      alignSelf: "center",
    },
  },
  "& .MuiInputLabel-root": {
    color: formTextMuted,
    fontWeight: 500,
    fontSize: formInputFontSize,
    lineHeight: 1.43,
    "&.MuiInputLabel-shrink": {
      fontSize: formInputFontSize,
      fontWeight: 500,
      lineHeight: 1.43,
    },
    "&.Mui-focused": {
      color: "#2e7d32",
    },
    "&.Mui-error": {
      color: "#d32f2f",
    },
  },
  "& .MuiFormHelperText-root": {
    color: formTextMuted,
    fontWeight: 500,
    marginLeft: 0,
    marginTop: 0,
    minHeight: "12px",
    lineHeight: 1.2,
    fontSize: "0.75rem",
    "&.Mui-error": {
      color: "#d32f2f",
    },
  },
};

const formIconSx = { color: formIconColor, fontSize: 21 };
/** Vertical gap between rows in the compact donation field grid. */
const formGridSpacing = 0.5;
const autocompleteFieldSx = {
  display: "block",
  width: "100%",
  "& .MuiOutlinedInput-root": { minHeight: formInputMinHeight },
};

const termsCheckboxUncheckedIcon = (
  <Box
    className="terms-checkbox-box"
    sx={{
      width: 20,
      height: 20,
      borderRadius: "3px",
      border: "1.5px solid #9ca3af",
      bgcolor: "#fff",
      boxSizing: "border-box",
      flexShrink: 0,
    }}
  />
);

const termsCheckboxCheckedIcon = <CheckBoxIcon sx={{ fontSize: 22, color: "#1976d2" }} />;

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

export default function RazorpayTestPage() {
  const keyId = process.env.REACT_APP_RAZORPAY_KEY_ID || "";
  const keyMode = getRazorpayKeyMode(keyId);
  const { search } = useLocation();
  const navigate = useNavigate();

  const purposeKey = useMemo(() => pickQueryPurpose(search), [search]);
  const program = purposeKey ? PROGRAMS[purposeKey] : null;

  const initialAmount = useMemo(() => {
    if (program) return String(program.amountInr);
    const picked = pickQueryAmount(search, MOST_CHOSEN_AMOUNT);
    return String(picked.valueInr);
  }, [program, search]);

  const [amountInr, setAmountInr] = useState(initialAmount);
  const [amountClamped, setAmountClamped] = useState(() => {
    if (program) return false;
    return pickQueryAmount(search, MOST_CHOSEN_AMOUNT).clamped;
  });
  const [selectedPreset, setSelectedPreset] = useState(() =>
    program ? null : PRESET_AMOUNTS.includes(Number(initialAmount)) ? Number(initialAmount) : null
  );

  const [name, setName] = useState("");
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [pan, setPan] = useState("");
  const [address, setAddress] = useState("");
  const [stateSel, setStateSel] = useState("");
  const [citySel, setCitySel] = useState("");
  const [pin, setPin] = useState("");
  const [purposeText, setPurposeText] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (program) {
      setAmountInr(String(program.amountInr));
      setAmountClamped(false);
      setSelectedPreset(null);
      return;
    }
    const picked = pickQueryAmount(search, MOST_CHOSEN_AMOUNT);
    setAmountInr(String(picked.valueInr));
    setAmountClamped(picked.clamped);
    const n = picked.valueInr;
    setSelectedPreset(PRESET_AMOUNTS.includes(n) ? n : null);
  }, [search, program]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [apiSetupWarning, setApiSetupWarning] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return undefined;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(getApiUrl("/api/health"));
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;

        if (!res.ok) {
          setApiSetupWarning(
            "Payment API is not reachable. Run npm start and check the terminal labeled [api]."
          );
          return;
        }

        const rz = data && data.razorpay;
        if (rz && (!rz.key_id || !rz.key_secret)) {
          setApiSetupWarning(
            "Razorpay server keys are missing. Copy .env.example to .env.local, add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET, then restart npm start."
          );
          return;
        }

        setApiSetupWarning("");
      } catch {
        if (!cancelled) {
          setApiSetupWarning(
            "Payment API is not reachable. Run npm start (not npm run start:web alone) and check the [api] terminal."
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const amountCheck = useMemo(() => validateAmountInr(amountInr), [amountInr]);
  const nameCheck = useMemo(() => validateName(name), [name]);
  const fatherOrHusbandNameCheck = useMemo(
    () => validateFatherOrHusbandName(fatherOrHusbandName),
    [fatherOrHusbandName]
  );
  const emailCheck = useMemo(() => validateEmail(email), [email]);
  const contactCheck = useMemo(() => validateContactIN(contact), [contact]);
  const panCheck = useMemo(() => validatePan(pan), [pan]);
  const purposeCheck = useMemo(() => validateNote(purposeText), [purposeText]);
  const addressCheck = useMemo(() => validateAddressLine(address), [address]);
  const stateCheck = useMemo(() => validateRequiredSelection(stateSel, "State"), [stateSel]);
  const cityCheck = useMemo(() => {
    if (!stateSel) {
      return { ok: false, value: citySel, error: "Select a state first." };
    }
    return validateRequiredSelection(citySel, "City");
  }, [stateSel, citySel]);
  const pinCheck = useMemo(() => validatePinIn(pin), [pin]);

  const amountPaise = amountCheck.ok ? toPaise(amountCheck.valueInr) : 0;

  const formValid =
    amountCheck.ok &&
    nameCheck.ok &&
    fatherOrHusbandNameCheck.ok &&
    emailCheck.ok &&
    contactCheck.ok &&
    panCheck.ok &&
    addressCheck.ok &&
    stateCheck.ok &&
    cityCheck.ok &&
    pinCheck.ok &&
    termsAccepted;

  const buildOrderNote = useCallback(() => {
    const parts = [];
    if (purposeCheck.value) parts.push(`Purpose: ${purposeCheck.value}`);
    parts.push(`Address: ${addressCheck.value}`);
    parts.push(`State: ${stateCheck.value}`);
    parts.push(`City: ${cityCheck.value}`);
    parts.push(`PIN: ${pinCheck.value}`);
    return sanitizeText(parts.join(" | "), NOTE_MAX);
  }, [purposeCheck.value, addressCheck.value, stateCheck.value, cityCheck.value, pinCheck.value]);

  const goToDonationResult = useCallback(
    (record) => {
      saveDonationReceipt(record);
      navigate(record.status === "success" ? "/donation/success" : "/donation/failed");
    },
    [navigate]
  );

  const startPayment = useCallback(async () => {
    setError("");
    setTouched({
      amount: true,
      name: true,
      fatherOrHusbandName: true,
      email: true,
      contact: true,
      pan: true,
      address: true,
      state: true,
      city: true,
      pin: true,
    });

    if (!keyId) {
      setError(
        "Missing REACT_APP_RAZORPAY_KEY_ID. Add it to your environment and redeploy/restart."
      );
      return;
    }
    if (!isRazorpayTestKey(keyId) && process.env.NODE_ENV === "development") {
      setError(
        "Use Test Mode keys (rzp_test_...) in .env for local checkout. Live keys trigger real / international compliance flows."
      );
      return;
    }
    if (!formValid) {
      setError("Please fix the highlighted fields before continuing.");
      return;
    }

    setBusy(true);
    try {
      await loadRazorpayCheckoutScript();

      const receiptNo = `rcpt_${Date.now()}`;
      const orderRequest = {
        currency: "INR",
        receipt: receiptNo,
        notes: {
          note: buildOrderNote(),
          donor_name: nameCheck.value,
          donor_father_or_husband: fatherOrHusbandNameCheck.value,
          donor_email: emailCheck.value,
          donor_contact: contactCheck.value,
          donor_pan: panCheck.value,
        },
      };

      if (program) {
        orderRequest.purpose = purposeKey;
      } else {
        orderRequest.amount = amountPaise;
      }

      const order = await postJson("/api/razorpay-order", orderRequest);

      const options = buildRazorpayCheckoutOptions({
        keyId,
        order,
        program,
        name: nameCheck.value,
        email: emailCheck.value,
        contact: contactCheck.value,
        note: buildOrderNote(),
        onDismiss: () => setBusy(false),
        onSuccess: async (response) => {
          const donor = {
            name: nameCheck.value,
            fatherOrHusbandName: fatherOrHusbandNameCheck.value,
            email: emailCheck.value,
            contact: contactCheck.value,
            pan: panCheck.value,
          };
          try {
            const verification = await postJson("/api/razorpay-verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            goToDonationResult(
              buildDonationReceiptRecord({
                status: verification.verified ? "success" : "unverified",
                amountInr: amountCheck.valueInr,
                donor,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                receiptNo,
                purpose: purposeCheck.value,
                programLabel: program?.label,
                keyId,
                verified: verification.verified,
                errorDescription: verification.verified
                  ? ""
                  : "Payment signature could not be verified. Please contact us with your payment ID.",
              })
            );
          } catch (e) {
            goToDonationResult(
              buildDonationReceiptRecord({
                status: "unverified",
                amountInr: amountCheck.valueInr,
                donor,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                receiptNo,
                purpose: purposeCheck.value,
                programLabel: program?.label,
                keyId,
                verified: false,
                errorDescription: (e && e.message) || String(e),
              })
            );
          }
        },
      });

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        const err = (resp && resp.error) || {};
        goToDonationResult(
          buildDonationReceiptRecord({
            status: "failed",
            amountInr: amountCheck.valueInr,
            donor: {
              name: nameCheck.value,
              fatherOrHusbandName: fatherOrHusbandNameCheck.value,
              email: emailCheck.value,
              contact: contactCheck.value,
              pan: panCheck.value,
            },
            orderId:
              (resp && resp.error && resp.error.metadata && resp.error.metadata.order_id) || "",
            receiptNo,
            purpose: purposeCheck.value,
            programLabel: program?.label,
            keyId,
            errorCode: err.code || "",
            errorDescription:
              err.description || err.reason || "Payment failed at the bank or wallet.",
          })
        );
        setBusy(false);
      });

      rzp.open();
    } catch (e) {
      setError((e && e.message) || String(e));
    } finally {
      setBusy(false);
    }
  }, [
    keyId,
    formValid,
    amountPaise,
    nameCheck.value,
    fatherOrHusbandNameCheck.value,
    emailCheck.value,
    contactCheck.value,
    panCheck.value,
    buildOrderNote,
    program,
    purposeKey,
    purposeCheck.value,
    amountCheck.valueInr,
    goToDonationResult,
  ]);

  const markTouched = (field) => () => setTouched((t) => ({ ...t, [field]: true }));
  const showError = (field, check) => touched[field] && !check.ok;

  const onSelectPreset = (amt) => {
    if (program) return;
    setSelectedPreset(amt);
    setAmountInr(String(amt));
  };

  const onCustomAmountChange = (e) => {
    if (program) return;
    setAmountInr(sanitizeAmountInput(e.target.value));
    setSelectedPreset(null);
  };

  const cityOptions = citiesForState(stateSel);

  const brandGreen = "#2e7d32";
  const accentOrange = "#ECA533";
  const payOrange = "#e67e22";

  return (
    <MKBox
      minHeight="100vh"
      sx={{
        background: "linear-gradient(180deg, #f4f7f4 0%, #eef1f6 55%, #e8ecf3 100%)",
        py: { xs: 2, sm: 4 },
        px: { xs: 1.5, sm: 2 },
      }}
    >
      <Card
        elevation={0}
        sx={{
          maxWidth: 1120,
          mx: "auto",
          borderRadius: "18px",
          border: "1px solid rgba(31, 42, 68, 0.08)",
          boxShadow: "0 18px 48px rgba(31, 42, 68, 0.08)",
          overflow: "hidden",
        }}
      >
        <Grid container>
          {/* Left column — trust & branding */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              background: "linear-gradient(165deg, #f6fff6 0%, #eef6ee 45%, #e8f2ea 100%)",
              borderRight: { md: "1px solid rgba(46, 125, 50, 0.12)" },
              borderBottom: { xs: "1px solid rgba(46, 125, 50, 0.12)", md: "none" },
            }}
          >
            <MKBox
              sx={{
                px: { xs: 2, sm: 2.5, md: 3 },
                pb: { xs: 2.5, sm: 3, md: 3.75 },
                pt: { xs: 1, sm: 1.25, md: 1.5 },
                height: "100%",
              }}
            >
              <Stack spacing={{ xs: 1.75, sm: 2 }} alignItems="center" textAlign="center">
                <Box
                  sx={{
                    width: { xs: "min(88%, 168px)", sm: "min(82%, 188px)" },
                    aspectRatio: "1",
                    borderRadius: "50%",
                    p: "2px",
                    background: `linear-gradient(145deg, ${brandGreen} 0%, #1b5e20 55%, ${brandGreen} 100%)`,
                    boxShadow: "0 10px 30px rgba(46, 125, 50, 0.28)",
                    mx: "auto",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    src={aadarLogo}
                    alt="Aadar Foundation"
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                      objectPosition: "center",
                      transform: "scale(1.15)",
                      display: "block",
                    }}
                  />
                </Box>

                <Box sx={{ maxWidth: 360, px: 0.5 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: HEADING_FONT,
                      fontWeight: 500,
                      color: brandGreen,
                      fontSize: { xs: "1.4rem", sm: "1.55rem" },
                      lineHeight: 1.2,
                    }}
                  >
                    Aadar Foundation
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: BODY_FONT,
                      color: "#1f2a44",
                      fontWeight: 700,
                      mt: 0.75,
                      mb: 2.5,
                      fontSize: { xs: "0.95rem", sm: "1.02rem" },
                    }}
                  >
                    Aashram Swarg Sadan
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={0.85}
                    sx={{ mt: 0 }}
                  >
                    <HouseOutlinedIcon sx={{ fontSize: 22, color: brandGreen }} aria-hidden />
                    <Typography
                      variant="body2"
                      component="p"
                      sx={{
                        fontFamily: BODY_FONT,
                        color: brandGreen,
                        fontWeight: 600,
                        fontSize: "0.84rem",
                        lineHeight: 1.35,
                        m: 0,
                        textAlign: "left",
                      }}
                    >
                      A Home for Homeless &amp; Unclaimed People
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    component="p"
                    sx={{
                      fontFamily: BODY_FONT,
                      color: "#4a5568",
                      fontWeight: 500,
                      lineHeight: 1.6,
                      mt: 1.5,
                      fontSize: "0.875rem",
                      m: 0,
                    }}
                  >
                    Your support helps us provide shelter, care and dignity to those who have no
                    one.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    borderRadius: "14px",
                    p: { xs: 1.75, sm: 2 },
                    backgroundColor: "rgba(79, 169, 83, 0.1)",
                    border: "1px solid rgba(79, 169, 83, 0.22)",
                  }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="flex-start">
                    <GppGoodOutlinedIcon
                      sx={{ fontSize: 30, color: brandGreen, flexShrink: 0, mt: 0.15 }}
                      aria-hidden
                    />
                    <Typography
                      variant="body2"
                      component="p"
                      sx={{
                        fontFamily: BODY_FONT,
                        fontWeight: 500,
                        color: "#1f2a44",
                        lineHeight: 1.55,
                        fontSize: "0.8rem",
                        textAlign: "left",
                        m: 0,
                      }}
                    >
                      Your contributions are eligible for upto{" "}
                      <Box component="strong" sx={{ color: brandGreen, fontWeight: 700 }}>
                        50% tax benefit
                      </Box>{" "}
                      under Section 80G as Aadar Foundation is registered as a non profit
                      organization
                    </Typography>
                  </Stack>
                  <Divider sx={{ my: 1.25 }} />
                  <Stack
                    direction="row"
                    justifyContent="center"
                    flexWrap="wrap"
                    useFlexGap
                    sx={{ gap: 1 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 700, color: "#1f2a44", letterSpacing: "0.03em" }}
                    >
                      PAN:{" "}
                      <Box component="span" sx={{ fontWeight: 800, color: brandGreen }}>
                        {AADAR_ORG_PAN}
                      </Box>
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(31,42,68,0.35)" }}>
                      |
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 700, color: "#1f2a44", letterSpacing: "0.03em" }}
                    >
                      80G NUMBER:{" "}
                      <Box component="span" sx={{ fontWeight: 800, color: brandGreen }}>
                        {AADAR_80G_REG_NO}
                      </Box>
                    </Typography>
                  </Stack>
                </Box>

                <Stack spacing={1.15} alignItems="center" sx={{ width: "100%", pt: 0.25 }}>
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    justifyContent="center"
                    useFlexGap
                    sx={{ gap: 1 }}
                  >
                    <Stack
                      direction="row"
                      spacing={0.6}
                      alignItems="center"
                      sx={{
                        px: 1.25,
                        py: 0.65,
                        borderRadius: "999px",
                        backgroundColor: "#fff",
                        border: "1px solid rgba(31,42,68,0.08)",
                        boxShadow: "0 2px 8px rgba(31,42,68,0.06)",
                      }}
                    >
                      <ShieldOutlinedIcon sx={{ fontSize: 17, color: accentOrange }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "#5a6b8a" }}>
                        100% Secure Payments
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={0.6}
                      alignItems="center"
                      sx={{
                        px: 1.25,
                        py: 0.65,
                        borderRadius: "999px",
                        backgroundColor: "#fff",
                        border: "1px solid rgba(31,42,68,0.08)",
                        boxShadow: "0 2px 8px rgba(31,42,68,0.06)",
                      }}
                    >
                      <LockOutlinedIcon sx={{ fontSize: 17, color: accentOrange }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "#5a6b8a" }}>
                        SSL Secured
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={0.6}
                    alignItems="center"
                    sx={{
                      px: 1.25,
                      py: 0.65,
                      borderRadius: "999px",
                      backgroundColor: "#fff",
                      border: "1px solid rgba(31,42,68,0.08)",
                      boxShadow: "0 2px 8px rgba(31,42,68,0.06)",
                    }}
                  >
                    <VolunteerActivismOutlinedIcon sx={{ fontSize: 17, color: accentOrange }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#5a6b8a" }}>
                      Your Donation Makes Impact
                    </Typography>
                  </Stack>
                </Stack>

                <Typography variant="caption" sx={{ color: "rgba(31,42,68,0.45)", pt: 0.5 }}>
                  Test checkout: <code>/__razorpay-test</code>
                </Typography>
              </Stack>
            </MKBox>
          </Grid>

          {/* Right column — form */}
          <Grid item xs={12} md={7}>
            <MKBox sx={{ p: { xs: 2.5, sm: 3, md: 3.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: HEADING_FONT,
                    fontWeight: 500,
                    fontSize: { xs: "1.35rem", sm: "1.5rem" },
                    color: "#1f2a44",
                  }}
                >
                  Donation Details
                </Typography>
                <FavoriteBorderIcon sx={{ color: "#ff6b6b", fontSize: 26 }} />
              </Stack>

              {!keyId && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Set <code>REACT_APP_RAZORPAY_KEY_ID</code> (public test key) for checkout.
                </Alert>
              )}

              {keyId && keyMode === "live" && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Your key is <strong>Live</strong> (<code>rzp_live_</code>). Local testing must use{" "}
                  <strong>Test Mode</strong> keys (<code>rzp_test_</code>) from the Razorpay
                  Dashboard toggle.
                </Alert>
              )}

              {amountClamped && !program && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  The amount in the link was outside the allowed range and has been adjusted.
                </Alert>
              )}

              {program && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Program: <strong>{program.label}</strong> — amount is locked to ₹
                  {program.amountInr.toLocaleString("en-IN")}.
                </Alert>
              )}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  p: { xs: 1.25, sm: 1.35 },
                  mb: 1.5,
                  borderRadius: "12px",
                  background:
                    "linear-gradient(90deg, rgba(255, 243, 224, 0.95) 0%, rgba(255, 251, 245, 0.9) 100%)",
                  borderTop: `1px solid ${accentOrange}66`,
                  borderBottom: `1px solid ${accentOrange}66`,
                }}
              >
                <Typography
                  component="span"
                  sx={{ fontSize: "1.35rem", lineHeight: 1, flexShrink: 0 }}
                >
                  🪔
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: formTextPrimary, lineHeight: 1.55, fontWeight: 500 }}
                >
                  Keeping Indian traditions of{" "}
                  <Box component="span" sx={{ color: payOrange, fontWeight: 600 }}>
                    शुभ दान
                  </Box>{" "}
                  in mind, we&apos;ve suggested auspicious donation amounts as a symbol of blessings
                  and goodwill, while deeply valuing every hard-earned contribution.
                </Typography>
              </Box>

              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: HEADING_FONT,
                  fontWeight: 500,
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  color: "#1f2a44",
                  mb: 1.5,
                }}
              >
                Select Donation Amount (₹)
              </Typography>

              <Stack direction="row" flexWrap="wrap" useFlexGap sx={{ gap: 1.1, mb: 1.5 }}>
                {PRESET_AMOUNTS.map((amt) => {
                  const active = !program && selectedPreset === amt && amountInr === String(amt);
                  return (
                    <Box key={amt} sx={{ position: "relative", flex: "1 1 88px", minWidth: 72 }}>
                      {!program && amt === MOST_CHOSEN_AMOUNT && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -11,
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: "#eaf7ea",
                            color: brandGreen,
                            border: "1px solid rgba(46, 125, 50, 0.28)",
                            px: 1,
                            py: 0.25,
                            borderRadius: "999px",
                            fontSize: "0.62rem",
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                            zIndex: 1,
                          }}
                        >
                          Most Popular
                        </Box>
                      )}
                      <MKButton
                        fullWidth
                        variant="outlined"
                        disabled={!!program}
                        onClick={() => onSelectPreset(amt)}
                        sx={{
                          py: 1.1,
                          borderRadius: "10px",
                          fontWeight: 800,
                          borderWidth: active ? 2 : 1,
                          borderColor: active ? brandGreen : "rgba(31,42,68,0.18)",
                          color: active ? brandGreen : "#24324f",
                          backgroundColor: active ? "rgba(79, 169, 83, 0.06)" : "#fff",
                          "&:hover": {
                            borderColor: brandGreen,
                            backgroundColor: "rgba(79, 169, 83, 0.08)",
                          },
                        }}
                      >
                        ₹{amt.toLocaleString("en-IN")}
                      </MKButton>
                    </Box>
                  );
                })}
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  my: 1.35,
                  gap: { xs: 1.25, sm: 1.75 },
                  width: "100%",
                }}
              >
                <Box
                  component="span"
                  aria-hidden
                  sx={{
                    flex: 1,
                    height: "1px",
                    minWidth: 0,
                    bgcolor: "rgba(31, 42, 68, 0.22)",
                  }}
                />
                <Typography
                  variant="body2"
                  component="span"
                  sx={{
                    flexShrink: 0,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: formTextPrimary,
                    fontSize: "0.8125rem",
                    lineHeight: 1,
                  }}
                >
                  OR
                </Typography>
                <Box
                  component="span"
                  aria-hidden
                  sx={{
                    flex: 1,
                    height: "1px",
                    minWidth: 0,
                    bgcolor: "rgba(31, 42, 68, 0.22)",
                  }}
                />
              </Box>

              <TextField
                fullWidth
                size="small"
                label="Custom Donation Amount (₹)"
                placeholder="Enter amount"
                value={amountInr}
                onChange={onCustomAmountChange}
                onBlur={markTouched("amount")}
                disabled={!!program}
                error={showError("amount", amountCheck)}
                helperText={showError("amount", amountCheck) ? amountCheck.error : " "}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography
                        sx={{ fontWeight: 700, color: formTextMuted, fontSize: formInputFontSize }}
                      >
                        ₹
                      </Typography>
                    </InputAdornment>
                  ),
                  inputProps: { inputMode: "numeric", maxLength: 7, pattern: "[0-9]*" },
                }}
                sx={{ mb: 1, ...formFieldSx }}
              />

              <Grid container spacing={formGridSpacing} alignItems="flex-start">
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Full Name"
                    placeholder="Full name as per PAN card for receipt"
                    value={name}
                    onChange={(e) => setName(sanitizeText(e.target.value, NAME_MAX))}
                    onBlur={markTouched("name")}
                    error={showError("name", nameCheck)}
                    helperText={showError("name", nameCheck) ? nameCheck.error : " "}
                    sx={formFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon sx={formIconSx} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Mobile Number"
                    placeholder="Enter 10 digit mobile number"
                    value={contact}
                    onChange={(e) =>
                      setContact(e.target.value.replace(/\D/g, "").slice(0, PHONE_LEN))
                    }
                    onBlur={markTouched("contact")}
                    error={showError("contact", contactCheck)}
                    helperText={showError("contact", contactCheck) ? contactCheck.error : " "}
                    sx={formFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneOutlinedIcon sx={formIconSx} />
                        </InputAdornment>
                      ),
                      inputProps: { inputMode: "tel", maxLength: PHONE_LEN },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Email ID"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(sanitizeText(e.target.value, EMAIL_MAX))}
                    onBlur={markTouched("email")}
                    error={showError("email", emailCheck)}
                    helperText={showError("email", emailCheck) ? emailCheck.error : " "}
                    sx={formFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon sx={formIconSx} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Father's / Husband's Name"
                    placeholder="Enter father's or husband's name"
                    value={fatherOrHusbandName}
                    onChange={(e) => setFatherOrHusbandName(sanitizeText(e.target.value, NAME_MAX))}
                    onBlur={markTouched("fatherOrHusbandName")}
                    error={showError("fatherOrHusbandName", fatherOrHusbandNameCheck)}
                    helperText={
                      showError("fatherOrHusbandName", fatherOrHusbandNameCheck)
                        ? fatherOrHusbandNameCheck.error
                        : " "
                    }
                    sx={formFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ContactEmergencyOutlinedIcon sx={formIconSx} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="PAN Number"
                    placeholder="Required for 80G tax exemption in India"
                    value={pan}
                    onChange={(e) =>
                      setPan(
                        sanitizeText(e.target.value, PAN_LEN)
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, "")
                      )
                    }
                    onBlur={markTouched("pan")}
                    error={showError("pan", panCheck)}
                    helperText={showError("pan", panCheck) ? panCheck.error : " "}
                    sx={formFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeOutlinedIcon sx={formIconSx} />
                        </InputAdornment>
                      ),
                      inputProps: { maxLength: PAN_LEN },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Street Address"
                    placeholder="House no., street, locality, landmark"
                    value={address}
                    onChange={(e) => setAddress(sanitizeText(e.target.value, ADDRESS_MAX))}
                    onBlur={markTouched("address")}
                    error={showError("address", addressCheck)}
                    helperText={showError("address", addressCheck) ? addressCheck.error : " "}
                    sx={formFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlinedIcon sx={formIconSx} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: "flex", flexDirection: "column" }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    sx={autocompleteFieldSx}
                    options={INDIAN_STATES}
                    value={stateSel || null}
                    onChange={(_, value) => {
                      setStateSel(value || "");
                      setCitySel("");
                    }}
                    onBlur={markTouched("state")}
                    isOptionEqualToValue={(opt, val) => opt === val}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        required
                        label="State"
                        placeholder="Select state"
                        onBlur={(e) => {
                          params.inputProps.onBlur?.(e);
                          markTouched("state")();
                        }}
                        error={showError("state", stateCheck)}
                        helperText={showError("state", stateCheck) ? stateCheck.error : " "}
                        sx={formFieldSx}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <MapOutlinedIcon sx={formIconSx} />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: "flex", flexDirection: "column" }}>
                  <Autocomplete
                    freeSolo
                    fullWidth
                    size="small"
                    sx={autocompleteFieldSx}
                    disabled={!stateSel}
                    options={cityOptions}
                    value={citySel}
                    inputValue={citySel}
                    onInputChange={(_, value) => setCitySel(value)}
                    onChange={(_, value) => setCitySel(value || "")}
                    onBlur={markTouched("city")}
                    filterOptions={(opts, { inputValue }) => {
                      const q = inputValue.trim().toLowerCase();
                      if (!q) return opts;
                      return opts.filter((c) => c.toLowerCase().includes(q));
                    }}
                    noOptionsText={stateSel ? "Type your city name" : "Select a state first"}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        required
                        label="City"
                        placeholder={stateSel ? "Select city" : "Select state first"}
                        onBlur={(e) => {
                          params.inputProps.onBlur?.(e);
                          markTouched("city")();
                        }}
                        error={showError("city", cityCheck)}
                        helperText={showError("city", cityCheck) ? cityCheck.error : " "}
                        sx={formFieldSx}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <LocationCityOutlinedIcon sx={formIconSx} />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="PIN Code"
                    placeholder="Enter 6 digit PIN code"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onBlur={markTouched("pin")}
                    error={showError("pin", pinCheck)}
                    helperText={showError("pin", pinCheck) ? pinCheck.error : " "}
                    sx={formFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlinedIcon sx={formIconSx} />
                        </InputAdornment>
                      ),
                      inputProps: { inputMode: "numeric", maxLength: 6 },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Purpose of Donation (optional)"
                    placeholder="Let us know the purpose of your donation"
                    value={purposeText}
                    onChange={(e) => setPurposeText(sanitizeText(e.target.value, NOTE_MAX))}
                    sx={formFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CardGiftcardOutlinedIcon sx={formIconSx} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: { xs: 1.5, sm: 1.75 },
                  pt: { xs: 1.5, sm: 1.75 },
                  borderTop: "1px solid rgba(31, 42, 68, 0.09)",
                }}
              >
                <FormControlLabel
                  sx={{
                    mt: 0,
                    mx: 0,
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "row",
                    "& .MuiFormControlLabel-label": { mt: 0 },
                  }}
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      icon={termsCheckboxUncheckedIcon}
                      checkedIcon={termsCheckboxCheckedIcon}
                      sx={{
                        p: 0.5,
                        mr: 0.75,
                        "&:hover .terms-checkbox-box": {
                          borderColor: "#6b7280",
                          boxShadow: "0 0 0 2px rgba(156, 163, 175, 0.25)",
                        },
                        "&:hover": {
                          bgcolor: "rgba(25, 118, 210, 0.08)",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ color: "#1f2a44", lineHeight: 1.45 }}
                    >
                      I accept the{" "}
                      <MuiLink
                        component={Link}
                        to="/pages/landing-pages/terms-conditions"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="always"
                        sx={{ fontWeight: 600, color: "#1565c0", fontSize: "0.78rem" }}
                      >
                        Terms &amp; Conditions
                      </MuiLink>{" "}
                      and{" "}
                      <MuiLink
                        component={Link}
                        to="/pages/landing-pages/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="always"
                        sx={{ fontWeight: 600, color: "#1565c0", fontSize: "0.78rem" }}
                      >
                        Privacy Policy
                      </MuiLink>
                      .
                    </Typography>
                  }
                />
              </Box>

              {apiSetupWarning && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {apiSetupWarning}
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <MKButton
                fullWidth
                variant="contained"
                onClick={startPayment}
                disabled={busy || !keyId || !formValid}
                sx={{
                  mt: 2,
                  py: 1.55,
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  letterSpacing: "0.04em",
                  textTransform: "none",
                  background: `linear-gradient(90deg, ${payOrange} 0%, #d35400 100%)`,
                  boxShadow: "0 12px 28px rgba(230, 126, 34, 0.35)",
                  color: "#fff !important",
                  "&:hover": {
                    background: `linear-gradient(90deg, #f39c12 0%, ${payOrange} 100%)`,
                    boxShadow: "0 14px 32px rgba(230, 126, 34, 0.42)",
                  },
                  "&.Mui-disabled": { color: "rgba(255,255,255,0.7) !important" },
                }}
                startIcon={
                  busy ? <CircularProgress size={20} color="inherit" /> : <LockOutlinedIcon />
                }
              >
                {busy ? "Opening Checkout…" : "PROCEED TO PAYMENT"}
              </MKButton>

              <Box
                component="footer"
                aria-label="Secure payments powered by Razorpay"
                sx={{
                  mt: 1.25,
                  pt: 0.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ gap: 0.75, rowGap: 0.5 }}
                >
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{ color: formTextMuted, fontWeight: 500, fontSize: "0.8rem" }}
                  >
                    Secure payments powered by
                  </Typography>
                  <Box
                    component={RazorpayLogoLight}
                    aria-label="Razorpay"
                    sx={{
                      height: { xs: 20, sm: 22 },
                      width: "auto",
                      display: "block",
                      flexShrink: 0,
                      bgcolor: "transparent",
                      "& svg": {
                        display: "block",
                        height: "100%",
                        width: "auto",
                      },
                    }}
                  />
                </Stack>
              </Box>
            </MKBox>
          </Grid>
        </Grid>
      </Card>
    </MKBox>
  );
}
