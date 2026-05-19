import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";

import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import DonationReceiptSheet from "components/DonationReceiptSheet";
import aadarLogo from "assets/images/logos/logo-aadar.jpg";

import { loadDonationReceipt } from "utils/donationReceiptStorage";
import { downloadReceiptPdf, formatInr } from "utils/donationReceipt";
import { getReceiptCopy } from "utils/receiptI18n";

const HEADING_FONT = '"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif';
const brandGreen = "#2e7d32";
const payOrange = "#e67e22";

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
  const [downloadMsg, setDownloadMsg] = useState("");

  useEffect(() => {
    setRecord(loadDonationReceipt());
  }, []);

  useEffect(() => {
    if (!record?.locale) return;
    const target = record.locale === "hi" ? "hi" : "en";
    if (i18n.language !== target) {
      i18n.changeLanguage(target);
    }
  }, [record?.locale, i18n]);

  const orgAlt = useMemo(() => getReceiptCopy(record?.locale || "en").org.name, [record?.locale]);

  const isSuccess = record?.status === "success";
  const isUnverified = record?.status === "unverified";
  const isFailed = record?.status === "failed";
  const canDownloadReceipt = !!record?.paymentId && (isSuccess || isUnverified);

  const title = useMemo(() => {
    if (isSuccess) return t("donationResult.titleSuccess");
    if (isUnverified) return t("donationResult.titleUnverified");
    return t("donationResult.titleFailed");
  }, [isSuccess, isUnverified, t]);

  const handleDownload = async () => {
    if (!record) return;
    setDownloadMsg(t("donationResult.preparing"));
    const result = await downloadReceiptPdf(record);
    if (result === "pdf") {
      setDownloadMsg(t("donationResult.pdfDownloaded"));
    } else {
      setDownloadMsg(t("donationResult.downloadFailed"));
    }
  };

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
        <Card sx={{ maxWidth: 480, p: 4, borderRadius: "18px", textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {t("donationResult.noRecordTitle")}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(31,42,68,0.7)", mb: 3 }}>
            {t("donationResult.noRecordBody")}
          </Typography>
          <MKButton
            component={RouterLink}
            to="/__razorpay-test"
            variant="contained"
            color="success"
          >
            {t("donationResult.donateNow")}
          </MKButton>
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
              ? t("donationResult.bodyUnverified")
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
                onClick={() => navigate("/__razorpay-test")}
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
