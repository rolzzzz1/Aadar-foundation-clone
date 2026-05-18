import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
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
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";

import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import DonationReceiptSheet from "components/DonationReceiptSheet";
import aadarLogo from "assets/images/logos/logo-aadar.jpg";

import { loadDonationReceipt } from "utils/donationReceiptStorage";
import { downloadReceiptPdf, formatInr, ORG, printReceiptViaIframe } from "utils/donationReceipt";

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

  const [record, setRecord] = useState(() => loadDonationReceipt());
  const [downloadMsg, setDownloadMsg] = useState("");

  useEffect(() => {
    setRecord(loadDonationReceipt());
  }, []);

  const isSuccess = record?.status === "success";
  const isUnverified = record?.status === "unverified";
  const isFailed = record?.status === "failed";
  const canDownloadReceipt = !!record?.paymentId && (isSuccess || isUnverified);

  const title = useMemo(() => {
    if (isSuccess) return "Thank you for your donation!";
    if (isUnverified) return "Payment received";
    return "Payment could not be completed";
  }, [isSuccess, isUnverified]);

  const handlePrint = () => {
    if (!record) return;
    const ok = printReceiptViaIframe(record);
    setDownloadMsg(
      ok
        ? "Print dialog opened — choose Save as PDF to keep a copy."
        : "Could not open the print dialog. Try Download receipt instead."
    );
  };

  const handleDownload = async () => {
    if (!record) return;
    setDownloadMsg("Preparing your receipt…");
    const result = await downloadReceiptPdf(record);
    if (result === "pdf") {
      setDownloadMsg("PDF receipt downloaded to your device.");
    } else if (result === "html") {
      setDownloadMsg(
        "PDF could not be generated. An HTML receipt was downloaded instead — open it and use Print → Save as PDF."
      );
    } else {
      setDownloadMsg("Download failed. Try Print / Save as PDF instead.");
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
            No payment details found
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(31,42,68,0.7)", mb: 3 }}>
            Start a new donation to see your confirmation here.
          </Typography>
          <MKButton
            component={RouterLink}
            to="/__razorpay-test"
            variant="contained"
            color="success"
          >
            Donate now
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
            alt={ORG.name}
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
              ? "Your payment was successful. Download your receipt below for your records."
              : isUnverified
              ? "We received your payment but could not verify it automatically. Please contact us with your payment ID."
              : record.errorDescription ||
                "Something went wrong during checkout. You can try again — no donation was confirmed."}
          </Typography>
          {record.testMode && (
            <Alert severity="warning" sx={{ mt: 2, textAlign: "left" }}>
              Test mode — this was not a live donation.
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
                YOUR RECEIPT
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
                {isSuccess ? "DONATION SUMMARY" : "ATTEMPT SUMMARY"}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <DetailRow label="Amount" value={formatInr(record.amountInr)} />
              <DetailRow label="Donor" value={record.donor?.name} />
              <DetailRow label="Father / husband" value={record.donor?.fatherOrHusbandName} />
              <DetailRow label="Email" value={record.donor?.email} />
              <DetailRow
                label="Mobile"
                value={record.donor?.contact ? `+91 ${record.donor.contact}` : ""}
              />
              <DetailRow label="PAN" value={record.donor?.pan} />
              <DetailRow label="Payment ID" value={record.paymentId} />
              <DetailRow label="Order ID" value={record.orderId} />
              {record.programLabel ? (
                <DetailRow label="Program" value={record.programLabel} />
              ) : null}
              {record.purpose ? <DetailRow label="Purpose" value={record.purpose} /> : null}
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
                Download PDF receipt
              </MKButton>
              <MKButton
                fullWidth
                variant="outlined"
                color="success"
                startIcon={<PrintOutlinedIcon />}
                onClick={handlePrint}
                sx={{ py: 1.2, fontWeight: 700, textTransform: "none", borderRadius: "12px" }}
              >
                Print / Save as PDF
              </MKButton>
              {downloadMsg ? (
                <Typography variant="caption" sx={{ color: "rgba(31,42,68,0.65)" }}>
                  {downloadMsg}
                </Typography>
              ) : null}
              <Typography variant="caption" sx={{ color: "rgba(31,42,68,0.55)", lineHeight: 1.45 }}>
                Official 80G certificate will be issued separately as per foundation process. PAN:{" "}
                {ORG.pan}
              </Typography>
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
                Try again
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
              Back to home
            </MKButton>
          </Stack>
        </MKBox>
      </Card>
    </MKBox>
  );
}
