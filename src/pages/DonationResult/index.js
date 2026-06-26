import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";

import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import DonationReceiptSheet from "components/DonationReceiptSheet";
import aadarLogo from "assets/images/logos/logo-aadar.jpg";

import { DONATION_CHECKOUT_PATH } from "utils/donation";
import { loadDonationReceipt, saveDonationReceipt } from "utils/donationReceiptStorage";
import { formatInr } from "utils/receiptFormat";
import { getReceiptCopy } from "utils/receiptI18n";
import { postJson } from "utils/api";

const HEADING_FONT =
  '"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif';
const brandGreen = "#2e7d32";
const payOrange = "#e67e22";

/** Support contact shown on the receipt-recovery form only */
const RECEIPT_LOOKUP_SUPPORT_EMAIL = "aadarfoundation.tech@gmail.com";
const RECEIPT_LOOKUP_SUPPORT_PHONE = "+91 9826441863";

function needsServerConfirm(r) {
  return !!(r?.paymentId && r?.orderId && r?.donor?.pan && r?.status !== "failed");
}

const lookupFieldSx = {
  "& .MuiInputBase-input": { fontSize: { xs: "0.9375rem", sm: "0.975rem" }, py: 1.1 },
  "& .MuiInputLabel-root": { fontSize: { xs: "0.875rem", sm: "0.9375rem" }, fontWeight: 600 },
  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
};

const lookupBodyText = {
  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
  lineHeight: 1.6,
  color: "#3a465f",
};

const lookupHintText = {
  fontSize: { xs: "0.8125rem", sm: "0.875rem" },
  lineHeight: 1.5,
  color: "#5a6578",
};

const lookupSectionTitle = {
  fontWeight: 800,
  color: "#1f2a44",
  fontSize: { xs: "0.975rem", sm: "1.025rem" },
};

const lookupSubsectionTitle = {
  ...lookupSectionTitle,
  fontSize: { xs: "0.9375rem", sm: "0.975rem" },
};

const lookupAlertText = {
  fontSize: { xs: "0.8125rem", sm: "0.875rem" },
  lineHeight: 1.5,
  color: "#475569",
};

function DetailRow({ label, value }) {
  if (!value || value === "—") return null;
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2} py={0.75}>
      <Typography variant="body2" sx={{ color: "rgba(31,42,68,0.65)", fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "#1f2a44", fontWeight: 700, textAlign: "right", wordBreak: "break-word" }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default function DonationResultPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [record, setRecord] = useState(() => loadDonationReceipt());
  const [confirmBusy, setConfirmBusy] = useState(() => needsServerConfirm(loadDonationReceipt()));
  const [downloadMsg, setDownloadMsg] = useState("");
  const [lookupBusy, setLookupBusy] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [lookupNotFound, setLookupNotFound] = useState(false);
  const [lookup, setLookup] = useState({
    paymentId: "",
    email: "",
    pan: "",
  });

  useEffect(() => {
    const initial = loadDonationReceipt();
    if (!needsServerConfirm(initial)) {
      setConfirmBusy(false);
      return undefined;
    }

    let cancelled = false;

    (async () => {
      setConfirmBusy(true);
      try {
        const result = await postJson("/api/donation-confirm", {
          payment_id: initial.paymentId,
          order_id: initial.orderId,
          donor_pan: initial.donor.pan,
          locale: initial.locale || "en",
        });

        if (cancelled) return;

        if (result?.ok && result?.record?.verified) {
          const merged = {
            ...initial,
            ...result.record,
            verified: true,
            status: "success",
            testMode: initial.testMode,
            locale: initial.locale || result.record.locale,
          };
          saveDonationReceipt(merged);
          setRecord(merged);
        } else {
          setRecord({
            ...initial,
            status: "unverified",
            verified: false,
            errorDescription: t(
              "donationResult.confirmFailed",
              "Payment could not be verified with our records. Please contact us with your payment ID."
            ),
          });
        }
      } catch {
        if (!cancelled) {
          setRecord({
            ...initial,
            status: "unverified",
            verified: false,
            errorDescription: t(
              "donationResult.confirmFailed",
              "Payment could not be verified with our records. Please contact us with your payment ID."
            ),
          });
        }
      } finally {
        if (!cancelled) setConfirmBusy(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [t]);

  useEffect(() => {
    if (!record?.locale) return;
    const target = record.locale === "hi" ? "hi" : "en";
    if (i18n.language !== target) {
      i18n.changeLanguage(target);
    }
  }, [record?.locale, i18n]);

  const orgAlt = useMemo(() => getReceiptCopy(record?.locale || "en").org.name, [record?.locale]);

  const isSuccess = record?.status === "success" && record?.verified === true;
  const isUnverified = record?.status === "unverified";
  const isFailed = record?.status === "failed";
  const canDownloadReceipt = !!(record?.paymentId && isSuccess && record?.verified === true);

  const title = useMemo(() => {
    if (isSuccess) return t("donationResult.titleSuccess");
    if (isUnverified) return t("donationResult.titleUnverified");
    return t("donationResult.titleFailed");
  }, [isSuccess, isUnverified, t]);

  const handleDownload = async () => {
    if (!record || !record.verified) {
      setDownloadMsg(
        t(
          "donationResult.downloadNotVerified",
          "Receipt download is available only after payment is verified."
        )
      );
      return;
    }
    setDownloadMsg(t("donationResult.preparing"));
    const { downloadReceiptPdf } = await import("utils/donationReceipt");
    const result = await downloadReceiptPdf(record);
    if (result === "pdf") {
      setDownloadMsg(t("donationResult.pdfDownloaded"));
    } else {
      setDownloadMsg(t("donationResult.downloadFailed"));
    }
  };

  const normalizePaymentId = (v) => String(v || "").trim();
  const normalizeEmail = (v) =>
    String(v || "")
      .trim()
      .toLowerCase();
  const normalizePan = (v) =>
    String(v || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");

  const handleLookup = async () => {
    setLookupError("");
    setLookupNotFound(false);

    const paymentId = normalizePaymentId(lookup.paymentId);
    const email = normalizeEmail(lookup.email);
    const pan = normalizePan(lookup.pan);

    if (!paymentId || paymentId.length < 5) {
      setLookupError(t("donationResult.lookupInvalid"));
      return;
    }
    if (!pan || pan.length !== 10) {
      setLookupError(t("donationResult.lookupInvalid"));
      return;
    }

    setLookupBusy(true);
    try {
      const result = await postJson("/api/donation-receipt", {
        payment_id: paymentId,
        donor_email: email || "",
        donor_pan: pan,
      });

      const next = result && result.record ? result.record : null;
      if (!next) {
        throw new Error(t("donationResult.lookupNotFound"));
      }

      saveDonationReceipt(next);
      setRecord(next);
    } catch (err) {
      const msg = (err && err.message) || t("donationResult.lookupFailed");
      const notFoundCopy = t(
        "donationResult.lookupNotFound",
        "Receipt not found. Please check your details or contact us with your payment ID."
      );
      const isNotFound =
        msg === notFoundCopy ||
        /receipt\s+not\s+found/i.test(msg) ||
        /couldn'?t\s+find/i.test(msg) ||
        /not\s+find\s+a\s+matching/i.test(msg);
      setLookupNotFound(isNotFound);
      setLookupError(msg);
    } finally {
      setLookupBusy(false);
    }
  };

  if (confirmBusy) {
    return (
      <MKBox
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={2}
        py={6}
        sx={{ background: "linear-gradient(180deg, #f4f7f4 0%, #eef1f6 100%)" }}
      >
        <Card
          sx={{
            maxWidth: 420,
            width: "100%",
            p: 4,
            borderRadius: "18px",
            textAlign: "center",
            border: "1px solid rgba(31, 42, 68, 0.08)",
            boxShadow: "0 18px 48px rgba(31, 42, 68, 0.1)",
          }}
        >
          <CircularProgress sx={{ color: brandGreen, mb: 2 }} />
          <Typography variant="body1" sx={{ color: "#1f2a44", fontWeight: 600 }}>
            {t("donationResult.confirmingPayment", "Verifying your payment…")}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "rgba(31,42,68,0.65)" }}>
            {t("donationResult.pleaseWait", "Please wait")}
          </Typography>
        </Card>
      </MKBox>
    );
  }

  if (!record) {
    return (
      <MKBox
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={2}
        py={6}
        sx={{ background: "linear-gradient(180deg, #f4f7f4 0%, #eef1f6 100%)" }}
      >
        <Card
          sx={{
            maxWidth: 980,
            width: "100%",
            p: { xs: 2.5, sm: 4 },
            borderRadius: "22px",
            textAlign: "left",
            border: "1px solid rgba(31, 42, 68, 0.08)",
            boxShadow: "0 20px 60px rgba(31, 42, 68, 0.12)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "center" },
              gap: { xs: 1.25, sm: 2 },
              mb: 2,
            }}
          >
            <Box
              component="img"
              src={aadarLogo}
              alt="Aadar Foundation"
              sx={{
                width: { xs: 56, sm: 64 },
                height: { xs: 56, sm: 64 },
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <Divider
              sx={{
                display: { xs: "block", sm: "none" },
                width: "100%",
                maxWidth: 280,
                borderColor: "rgba(31, 42, 68, 0.14)",
              }}
            />
            <Box
              sx={{
                minWidth: 0,
                flex: 1,
                textAlign: { xs: "center", sm: "left" },
                borderLeft: { sm: "1px solid rgba(31, 42, 68, 0.14)" },
                pl: { sm: 2.5 },
              }}
            >
              <Typography
                sx={{
                  fontFamily: HEADING_FONT,
                  fontWeight: 500,
                  color: "#1f2a44",
                  fontSize: { xs: "1.1rem", sm: "1.35rem" },
                  lineHeight: 1.25,
                  mb: 0.5,
                }}
              >
                {t("donationResult.lookupHeroTitle", "Recover Donation Receipt")}
              </Typography>
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                  lineHeight: 1.5,
                }}
              >
                {t(
                  "donationResult.lookupHeroSubtitle",
                  "If your payment was completed but the page closed accidentally, retrieve your receipt below."
                )}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              mb: 2.5,
              p: { xs: 1.5, sm: 2 },
              borderRadius: "10px",
              bgcolor: "#f0fdf4",
              border: "1px solid #dcfce7",
              display: "flex",
              alignItems: "center",
              gap: 1.25,
            }}
          >
            <CheckCircleIcon sx={{ color: "#22c55e", fontSize: 22, flexShrink: 0 }} />
            <Typography sx={lookupAlertText}>
              <Box component="span" sx={{ fontWeight: 700, color: "#166534" }}>
                {t("donationResult.lookupAlertBold", "Your payment may already be successful.")}
              </Box>{" "}
              {t(
                "donationResult.lookupAlertRest",
                "Enter your details below to retrieve your receipt."
              )}
            </Typography>
          </Box>

          <Grid container spacing={2.25} sx={{ textAlign: "left" }}>
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  p: 2.25,
                  borderRadius: "18px",
                  bgcolor: "#fff",
                  border: "1px solid rgba(31,42,68,0.08)",
                }}
              >
                <Stack spacing={2}>
                  <TextField
                    label={t("donationResult.lookupPaymentId", "Payment ID")}
                    value={lookup.paymentId}
                    onChange={(e) =>
                      setLookup((prev) => ({ ...prev, paymentId: e.target.value || "" }))
                    }
                    placeholder="Example: pay_Q8x7ABCD1234"
                    size="medium"
                    fullWidth
                    sx={lookupFieldSx}
                    InputProps={{
                      startAdornment: (
                        <PaymentsOutlinedIcon sx={{ mr: 1, color: brandGreen, fontSize: 20 }} />
                      ),
                    }}
                  />
                  <Typography sx={{ ...lookupHintText, mt: -0.5 }}>
                    {t(
                      "donationResult.lookupPaymentIdHint",
                      "You can find this in UPI SMS, Bank SMS, Razorpay message or Bank statement."
                    )}
                  </Typography>

                  <TextField
                    label={t("donationResult.lookupEmail", "Email (optional)")}
                    value={lookup.email}
                    onChange={(e) =>
                      setLookup((prev) => ({ ...prev, email: e.target.value || "" }))
                    }
                    placeholder={t(
                      "donationResult.lookupEmailPh",
                      "Enter the email used during donation"
                    )}
                    size="medium"
                    fullWidth
                    sx={lookupFieldSx}
                    InputProps={{
                      startAdornment: (
                        <EmailOutlinedIcon sx={{ mr: 1, color: "#4a6a8a", fontSize: 20 }} />
                      ),
                    }}
                  />

                  <TextField
                    label={t("donationResult.lookupPan", "PAN Number")}
                    value={lookup.pan}
                    onChange={(e) => setLookup((prev) => ({ ...prev, pan: e.target.value || "" }))}
                    placeholder="ABCDE1234F"
                    size="medium"
                    fullWidth
                    inputProps={{ maxLength: 10 }}
                    sx={lookupFieldSx}
                    InputProps={{
                      startAdornment: (
                        <PersonOutlineIcon sx={{ mr: 1, color: "#4a6a8a", fontSize: 20 }} />
                      ),
                    }}
                  />

                  {lookupError ? (
                    <Alert severity="error" sx={{ textAlign: "left", fontSize: "0.9375rem" }}>
                      {lookupError}
                    </Alert>
                  ) : null}

                  <MKButton
                    variant="contained"
                    color="success"
                    onClick={handleLookup}
                    disabled={lookupBusy}
                    startIcon={<SearchOutlinedIcon />}
                    sx={{
                      py: 1.5,
                      fontSize: { xs: "0.9375rem", sm: "0.975rem" },
                      fontWeight: 800,
                      textTransform: "none",
                      borderRadius: "12px",
                    }}
                  >
                    {lookupBusy
                      ? t("donationResult.lookupBusy", "Retrieving…")
                      : t("donationResult.lookupButton", "Retrieve Donation Receipt")}
                  </MKButton>

                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                    <InfoOutlinedIcon sx={{ fontSize: 20, color: "#5a6578", mt: "2px" }} />
                    <Typography sx={lookupHintText}>
                      {t(
                        "donationResult.lookupPrivacy",
                        "Your details are safe and used only to retrieve your receipt."
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  p: 2.25,
                  borderRadius: "18px",
                  bgcolor: "rgba(31,42,68,0.02)",
                  border: "1px solid rgba(31,42,68,0.08)",
                  height: "100%",
                }}
              >
                <Typography sx={{ ...lookupSectionTitle, mb: 1.5 }}>
                  {t("donationResult.lookupWhereTitle", "Where to find Payment ID?")}
                </Typography>
                <Stack spacing={1.75}>
                  <Box sx={{ display: "flex", gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        bgcolor: "rgba(79, 169, 83, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <PaymentsOutlinedIcon sx={{ color: brandGreen, fontSize: 20 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={lookupSubsectionTitle}>
                        {t("donationResult.lookupWhereUpiTitle", "UPI App")}
                      </Typography>
                      <Typography sx={lookupBodyText}>
                        {t("donationResult.lookupWhereUpiBody", "Check your UPI payment history.")}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        bgcolor: "rgba(79, 169, 83, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <SmsOutlinedIcon sx={{ color: brandGreen, fontSize: 20 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={lookupSubsectionTitle}>
                        {t("donationResult.lookupWhereSmsTitle", "Bank SMS")}
                      </Typography>
                      <Typography sx={lookupBodyText}>
                        {t("donationResult.lookupWhereSmsBody", "Look for Razorpay payment SMS.")}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        bgcolor: "rgba(79, 169, 83, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <ReceiptLongOutlinedIcon sx={{ color: brandGreen, fontSize: 20 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={lookupSubsectionTitle}>
                        {t("donationResult.lookupWhereRzpTitle", "Razorpay Message")}
                      </Typography>
                      <Typography sx={lookupBodyText}>
                        {t(
                          "donationResult.lookupWhereRzpBody",
                          "Check your email or SMS from Razorpay."
                        )}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        bgcolor: "rgba(79, 169, 83, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <ReceiptLongOutlinedIcon sx={{ color: brandGreen, fontSize: 20 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={lookupSubsectionTitle}>
                        {t("donationResult.lookupWhereStmtTitle", "Bank Statement")}
                      </Typography>
                      <Typography sx={lookupBodyText}>
                        {t("donationResult.lookupWhereStmtBody", "Check your account statement.")}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          {lookupNotFound ? (
            <Box sx={{ mt: 2.5 }}>
              <Alert
                severity="warning"
                icon={<InfoOutlinedIcon />}
                sx={{
                  textAlign: "left",
                  borderRadius: "14px",
                  bgcolor: "rgba(255, 193, 7, 0.12)",
                  border: "1px solid rgba(255, 193, 7, 0.25)",
                }}
              >
                <Typography sx={{ ...lookupSectionTitle, mb: 0.5 }}>
                  {t("donationResult.lookupNotFoundTitle", "We couldn't find a matching donation")}
                </Typography>
                <Typography sx={lookupBodyText}>
                  {t(
                    "donationResult.lookupNotFoundBody",
                    "Please verify your Payment ID and PAN. If the issue persists, contact us at {{email}} or {{phone}}.",
                    { email: RECEIPT_LOOKUP_SUPPORT_EMAIL, phone: RECEIPT_LOOKUP_SUPPORT_PHONE }
                  )}
                </Typography>
              </Alert>
            </Box>
          ) : null}

          <Grid container spacing={2} sx={{ mt: 2.5, textAlign: "left" }}>
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "18px",
                  bgcolor: "rgba(79, 169, 83, 0.06)",
                  border: "1px solid rgba(79, 169, 83, 0.18)",
                  height: "100%",
                }}
              >
                <Typography sx={{ ...lookupSectionTitle, mb: 0.75 }}>
                  {t("donationResult.lookupHelpTitle", "Need assistance?")}
                </Typography>
                <Typography sx={{ ...lookupBodyText, mb: 1.25 }}>
                  {t("donationResult.lookupHelpBody", "We're here to help you.")}
                </Typography>
                <Stack spacing={0.75}>
                  <Link
                    href={`mailto:${RECEIPT_LOOKUP_SUPPORT_EMAIL}`}
                    underline="hover"
                    sx={{
                      ...lookupBodyText,
                      fontWeight: 700,
                      color: brandGreen,
                      wordBreak: "break-word",
                    }}
                  >
                    {RECEIPT_LOOKUP_SUPPORT_EMAIL}
                  </Link>
                  <Link
                    href={`tel:${RECEIPT_LOOKUP_SUPPORT_PHONE.replace(/\s/g, "")}`}
                    underline="hover"
                    sx={{ ...lookupBodyText, fontWeight: 700, color: brandGreen }}
                  >
                    {RECEIPT_LOOKUP_SUPPORT_PHONE}
                  </Link>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "18px",
                  bgcolor: "rgba(79, 169, 83, 0.06)",
                  border: "1px solid rgba(79, 169, 83, 0.18)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 1.25,
                }}
              >
                <Box>
                  <Typography sx={{ ...lookupSectionTitle, mb: 0.75 }}>
                    {t("donationResult.lookupSupportAgainTitle", "Want to support again?")}
                  </Typography>
                  <Typography sx={lookupBodyText}>
                    {t(
                      "donationResult.lookupSupportAgainBody",
                      "Your contribution helps us create a better and brighter future."
                    )}
                  </Typography>
                </Box>
                <MKButton
                  component={RouterLink}
                  to={DONATION_CHECKOUT_PATH}
                  variant="contained"
                  color="success"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "0.9375rem", sm: "0.975rem" },
                    textTransform: "none",
                    borderRadius: "12px",
                    py: 1.15,
                  }}
                >
                  {t("donationResult.donateNow")}
                </MKButton>
              </Box>
            </Grid>
          </Grid>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="center"
            sx={{ mt: 2.5 }}
          >
            <MKButton
              component={RouterLink}
              to="/home"
              variant="outlined"
              color="dark"
              startIcon={<HomeOutlinedIcon />}
              sx={{
                fontWeight: 700,
                fontSize: { xs: "0.9375rem", sm: "0.975rem" },
                textTransform: "none",
                borderRadius: "12px",
                py: 1.15,
                px: 2.5,
              }}
            >
              {t("donationResult.backHome")}
            </MKButton>
          </Stack>

          <Typography
            variant="caption"
            sx={{ display: "block", mt: 2, color: "rgba(31,42,68,0.6)", textAlign: "center" }}
          >
            {t("donationResult.lookupFooter", "Thank you for supporting Aadar Foundation.")}
          </Typography>
        </Card>
      </MKBox>
    );
  }

  return (
    <MKBox
      minHeight="100vh"
      py={{ xs: 3, sm: 5 }}
      px={2}
      sx={{ background: "linear-gradient(180deg, #f4f7f4 0%, #eef1f6 55%, #e8ecf3 100%)" }}
    >
      <Card
        sx={{
          maxWidth: canDownloadReceipt ? 720 : 560,
          mx: "auto",
          borderRadius: "18px",
          overflow: "hidden",
          border: "1px solid rgba(31, 42, 68, 0.08)",
          boxShadow: "0 18px 48px rgba(31, 42, 68, 0.1)",
        }}
      >
        <MKBox
          sx={{
            textAlign: "center",
            px: 3,
            pt: 4,
            pb: 3,
            background: isSuccess
              ? "linear-gradient(165deg, #f6fff6 0%, #eef6ee 100%)"
              : "linear-gradient(165deg, #fff8f0 0%, #fff3e8 100%)",
          }}
        >
          <Box
            component="img"
            src={aadarLogo}
            alt={orgAlt}
            sx={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              objectFit: "cover",
              border: `3px solid ${isSuccess ? brandGreen : payOrange}`,
              mb: 2,
            }}
          />
          {isSuccess ? (
            <CheckCircleOutlineIcon sx={{ fontSize: 48, color: brandGreen, mb: 1 }} />
          ) : (
            <ErrorOutlineIcon sx={{ fontSize: 48, color: payOrange, mb: 1 }} />
          )}
          <Typography
            variant="h4"
            sx={{ fontFamily: HEADING_FONT, fontWeight: 500, fontSize: "1.5rem", color: "#1f2a44" }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1.5, color: "rgba(31,42,68,0.72)", lineHeight: 1.55 }}
          >
            {isSuccess
              ? t("donationResult.bodySuccess")
              : isUnverified
              ? record.errorDescription || t("donationResult.bodyUnverified")
              : record.errorDescription || t("donationResult.bodyFailedFallback")}
          </Typography>
          {record.testMode && (
            <Alert severity="warning" sx={{ mt: 2, textAlign: "left" }}>
              {t("donationResult.testMode")}
            </Alert>
          )}
        </MKBox>

        <MKBox px={3} pb={3}>
          {canDownloadReceipt ? (
            <MKBox sx={{ mb: 2.5, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color: brandGreen,
                  letterSpacing: "0.04em",
                  mb: 1.25,
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {t("donationResult.yourReceipt")}
              </Typography>
              <Box sx={{ width: "100%", maxWidth: 720 }}>
                <DonationReceiptSheet record={record} logoSrc={aadarLogo} />
              </Box>
            </MKBox>
          ) : (
            <>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800, color: brandGreen, letterSpacing: "0.04em", mb: 1 }}
              >
                {isSuccess
                  ? t("donationResult.donationSummary")
                  : t("donationResult.attemptSummary")}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <DetailRow label={t("donationResult.amount")} value={formatInr(record.amountInr)} />
              <DetailRow label={t("donationResult.donor")} value={record.donor?.name} />
              <DetailRow
                label={t("donationResult.fatherHusband")}
                value={record.donor?.fatherOrHusbandName}
              />
              <DetailRow label={t("donationResult.email")} value={record.donor?.email} />
              <DetailRow
                label={t("donationResult.mobile")}
                value={record.donor?.contact ? `+91 ${record.donor.contact}` : ""}
              />
              <DetailRow label={t("donationResult.pan")} value={record.donor?.pan} />
              <DetailRow label={t("donationResult.paymentId")} value={record.paymentId} />
              <DetailRow label={t("donationResult.orderId")} value={record.orderId} />
              {record.programLabel ? (
                <DetailRow label={t("donationResult.program")} value={record.programLabel} />
              ) : null}
              {record.purpose ? (
                <DetailRow label={t("donationResult.purpose")} value={record.purpose} />
              ) : null}
            </>
          )}

          {canDownloadReceipt && (
            <Stack spacing={1.5} mt={3}>
              <MKButton
                fullWidth
                variant="contained"
                color="success"
                startIcon={<DownloadOutlinedIcon />}
                onClick={handleDownload}
                sx={{ py: 1.4, fontWeight: 800, textTransform: "none", borderRadius: "12px" }}
              >
                {t("donationResult.downloadPdf")}
              </MKButton>
              {downloadMsg ? (
                <Typography variant="caption" sx={{ color: "rgba(31,42,68,0.65)" }}>
                  {downloadMsg}
                </Typography>
              ) : null}
            </Stack>
          )}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} mt={3}>
            {isFailed && (
              <MKButton
                fullWidth
                variant="contained"
                onClick={() => navigate(DONATION_CHECKOUT_PATH)}
                startIcon={<ReplayOutlinedIcon />}
                sx={{
                  py: 1.2,
                  fontWeight: 800,
                  textTransform: "none",
                  borderRadius: "12px",
                  background: `linear-gradient(90deg, ${payOrange} 0%, #d35400 100%)`,
                  color: "#fff !important",
                }}
              >
                {t("donationResult.tryAgain")}
              </MKButton>
            )}
            <MKButton
              fullWidth
              variant={isSuccess ? "outlined" : "text"}
              color="dark"
              component={RouterLink}
              to="/home"
              startIcon={<HomeOutlinedIcon />}
              sx={{ py: 1.2, fontWeight: 700, textTransform: "none", borderRadius: "12px" }}
            >
              {t("donationResult.backHome")}
            </MKButton>
          </Stack>
        </MKBox>
      </Card>
    </MKBox>
  );
}
