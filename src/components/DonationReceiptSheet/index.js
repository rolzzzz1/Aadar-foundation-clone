import React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { buildReceiptViewModel } from "utils/receiptFormat";
import { getReceiptWebsiteQrSrc } from "utils/receiptAssets";

const green = "#1b5e20";
const greenMid = "#2e7d32";
const greenLight = "#eaf7ea";

function MetaCell({ label, value, valueGreen }) {
  return (
    <Box sx={{ textAlign: "center", px: 0.5 }}>
      <Typography
        sx={{ fontSize: "0.62rem", color: "rgba(31,42,68,0.55)", fontWeight: 600, lineHeight: 1.2 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.72rem",
          fontWeight: 700,
          color: valueGreen ? greenMid : "#1f2a44",
          lineHeight: 1.25,
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

MetaCell.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  valueGreen: PropTypes.bool,
};

function DetailTable({ title, rows, amountLabels }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        border: "1px solid #d8e0d8",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      <Box sx={{ bgcolor: green, px: 1, py: 0.45, textAlign: "center" }}>
        <Typography
          sx={{ color: "#fff", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.08em" }}
        >
          {title}
        </Typography>
      </Box>
      {rows.map(([label, value], idx) => {
        const isAmount = amountLabels.includes(label);
        return (
          <Box
            key={label}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 0.75,
              px: 1,
              py: 0.35,
              bgcolor: idx % 2 === 0 ? "#fff" : "#fafcfa",
              borderTop: idx > 0 ? "1px solid #eef2ee" : "none",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.6rem",
                color: "rgba(31,42,68,0.6)",
                fontWeight: 600,
                flexShrink: 0,
                maxWidth: "42%",
                textAlign: "left",
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.6rem",
                color: isAmount ? greenMid : "#1f2a44",
                fontWeight: isAmount ? 800 : 600,
                wordBreak: "break-word",
                textAlign: "right",
                flex: 1,
              }}
            >
              {value}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

DetailTable.propTypes = {
  title: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  amountLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function DonationReceiptSheet({ record, logoSrc }) {
  const vm = buildReceiptViewModel(record);
  const { copy, org } = vm;
  const dr = copy.donorRows;
  const dn = copy.donationRows;
  const amountLabels = [dn.amount, dn.amountAlt];

  const donorRows = [
    [dr.name, vm.donorName],
    [dr.fatherHusband, vm.fatherOrHusbandName],
    [dr.email, vm.email],
    [dr.mobile, vm.mobile],
    [dr.pan, vm.pan],
  ];

  const donationRows = [
    [dn.amount, vm.amountFormatted],
    [dn.transactionId, vm.paymentId],
    [dn.orderId, vm.orderId],
    [dn.receiptFor, vm.receiptFor],
    [dn.inWords, vm.amountWords],
  ];

  return (
    <Box
      className="donation-receipt-sheet"
      lang={vm.locale}
      sx={{
        position: "relative",
        bgcolor: "#fff",
        borderRadius: "10px",
        border: "1px solid #d5e8d5",
        overflow: "hidden",
        fontFamily: '"Segoe UI", Lato, "Noto Sans Devanagari", Helvetica, Arial, sans-serif',
        textAlign: "center",
        mx: "auto",
        maxWidth: 720,
        "@media print": {
          maxWidth: "100%",
          borderRadius: 0,
          border: "none",
          pageBreakInside: "avoid",
          breakInside: "avoid",
        },
      }}
    >
      {logoSrc ? (
        <Box
          component="img"
          src={logoSrc}
          alt=""
          aria-hidden
          sx={{
            position: "absolute",
            left: "50%",
            top: "45%",
            transform: "translate(-50%, -50%)",
            width: 88,
            height: 88,
            opacity: 0.05,
            pointerEvents: "none",
            objectFit: "contain",
          }}
        />
      ) : null}

      <Box sx={{ position: "relative", px: { xs: 1.25, sm: 1.75 }, py: 1.25 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            mb: 0.75,
          }}
        >
          {logoSrc ? (
            <Box
              component="img"
              src={logoSrc}
              alt={org.name}
              sx={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                objectFit: "cover",
                border: `2px solid ${greenMid}`,
              }}
            />
          ) : null}
          <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: green, lineHeight: 1.15 }}>
            {org.name}
          </Typography>
          <Typography
            sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#1f2a44", lineHeight: 1.2 }}
          >
            {org.subtitle}
          </Typography>
          <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: greenMid }}>
            {org.tagline}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 0.75 }}>
          <Box
            sx={{
              bgcolor: green,
              color: "#fff",
              px: 2,
              py: 0.4,
              borderRadius: "999px",
              fontSize: "0.65rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
            }}
          >
            {copy.title}
          </Box>
        </Box>

        {vm.testMode ? (
          <Typography
            sx={{
              mb: 0.75,
              px: 1,
              py: 0.35,
              bgcolor: "#fff8e1",
              color: "#6d4c00",
              fontSize: "0.62rem",
              borderRadius: "4px",
            }}
          >
            {copy.testBanner}
          </Typography>
        ) : null}

        <Grid container spacing={0.75} sx={{ mb: 0.75 }}>
          <Grid item xs={6} sm={3}>
            <MetaCell label={copy.meta.receiptNo} value={vm.receiptNo} valueGreen />
          </Grid>
          <Grid item xs={6} sm={3}>
            <MetaCell label={copy.meta.date} value={vm.date} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <MetaCell label={copy.meta.payment} value={vm.paymentMode} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <MetaCell label={copy.meta.status} value={vm.paymentStatus} valueGreen={vm.isSuccess} />
          </Grid>
        </Grid>

        <Typography sx={{ fontSize: "0.68rem", color: "#1f2a44", lineHeight: 1.4, mb: 0.25 }}>
          {copy.thanks(vm.donorName)}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.62rem",
            color: "rgba(31,42,68,0.65)",
            fontStyle: "italic",
            mb: 0.75,
          }}
        >
          {copy.thanksSub}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 0.75,
            mb: 0.75,
            alignItems: "stretch",
          }}
        >
          <DetailTable title={copy.donorTableTitle} rows={donorRows} amountLabels={amountLabels} />
          <DetailTable
            title={copy.donationTableTitle}
            rows={donationRows}
            amountLabels={amountLabels}
          />
        </Box>

        <Box
          sx={{
            border: "1px dashed #b8c9b8",
            borderRadius: "6px",
            p: 0.85,
            bgcolor: "#fafcfa",
            mb: 0.75,
            fontSize: "0.62rem",
            lineHeight: 1.45,
            color: "#1f2a44",
          }}
        >
          {copy.taxNotice}
          <Typography
            component="span"
            display="block"
            sx={{ fontWeight: 700, color: greenMid, mt: 0.35, fontSize: "inherit" }}
          >
            {copy.reg80g(org.registration80G)}
          </Typography>
          <Typography
            component="span"
            display="block"
            sx={{ fontWeight: 700, color: greenMid, mt: 0.2, fontSize: "inherit" }}
          >
            {copy.fundsNotice}
          </Typography>
          <Typography
            component="span"
            display="block"
            sx={{ fontWeight: 600, color: "rgba(31,42,68,0.72)", mt: 0.35, fontSize: "0.58rem" }}
          >
            {copy.fcraNotice}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-start" },
            justifyContent: "space-between",
            gap: 1,
            mb: 0.75,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Box sx={{ flex: 1, fontSize: "0.6rem", color: "rgba(31,42,68,0.75)", lineHeight: 1.45 }}>
            <Typography sx={{ fontSize: "inherit", mb: 0.35 }}>{org.address}</Typography>
            <Typography sx={{ fontSize: "inherit" }}>
              {copy.contact.email}: {org.email}
            </Typography>
            <Typography sx={{ fontSize: "inherit" }}>
              {copy.contact.phone}: {org.phone}
            </Typography>
            <Typography sx={{ fontSize: "inherit" }}>
              {copy.contact.pan}: {org.pan}
            </Typography>
          </Box>
          <Box sx={{ flexShrink: 0, textAlign: "center" }}>
            <Box
              component="img"
              src={getReceiptWebsiteQrSrc()}
              alt={vm.qrHint}
              sx={{ width: 64, height: 64, objectFit: "contain", display: "block", mx: "auto" }}
            />
            <Typography sx={{ fontSize: "0.58rem", color: "rgba(31,42,68,0.55)", mt: 0.25 }}>
              {vm.qrHint}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: greenLight, mb: 0.6 }} />

        <Box>
          <Typography sx={{ fontSize: "0.62rem", color: "rgba(31,42,68,0.7)", lineHeight: 1.35 }}>
            {copy.closing1}
          </Typography>
          <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, color: green, mt: 0.25 }}>
            {copy.closing2}
          </Typography>
          <Typography sx={{ fontSize: "0.55rem", color: "rgba(31,42,68,0.45)", mt: 0.35 }}>
            {copy.signature}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

DonationReceiptSheet.propTypes = {
  record: PropTypes.object.isRequired,
  logoSrc: PropTypes.string,
};
