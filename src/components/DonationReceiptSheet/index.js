import React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

import { buildReceiptViewModel } from "utils/receiptFormat";

const green = "#1b5e20";
const greenMid = "#2e7d32";
const greenLight = "#eaf7ea";

function MetaCell({ label, value, valueGreen }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        sx={{ fontSize: "0.68rem", color: "rgba(31,42,68,0.55)", fontWeight: 600, mb: 0.25 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.82rem",
          fontWeight: 700,
          color: valueGreen ? greenMid : "#1f2a44",
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

function DetailTable({ title, rows }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        maxWidth: 360,
        border: "1px solid #d8e0d8",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      <Box sx={{ bgcolor: green, px: 1.25, py: 0.65, textAlign: "center" }}>
        <Typography
          sx={{ color: "#fff", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.08em" }}
        >
          {title}
        </Typography>
      </Box>
      {rows.map(([label, value], idx) => (
        <Box
          key={label}
          sx={{
            px: 1.25,
            py: 0.65,
            textAlign: "center",
            bgcolor: idx % 2 === 0 ? "#fff" : "#fafcfa",
            borderTop: idx > 0 ? "1px solid #eef2ee" : "none",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.65rem",
              color: "rgba(31,42,68,0.6)",
              fontWeight: 600,
              display: "block",
              mb: 0.2,
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.65rem",
              color: label === "Donation Amount" ? greenMid : "#1f2a44",
              fontWeight: label === "Donation Amount" ? 800 : 600,
              wordBreak: "break-word",
            }}
          >
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

DetailTable.propTypes = {
  title: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default function DonationReceiptSheet({ record, logoSrc }) {
  const vm = buildReceiptViewModel(record);
  const { org } = vm;

  const donorRows = [
    ["Donor Name", vm.donorName],
    ["Father / Husband Name", vm.fatherOrHusbandName],
    ["Email", vm.email],
    ["Mobile", vm.mobile],
    ["PAN", vm.pan],
  ];

  const donationRows = [
    ["Donation Amount", vm.amountFormatted],
    ["Transaction ID", vm.paymentId],
    ["Order ID", vm.orderId],
    ["Receipt For", vm.receiptFor],
    ["Amount (in words)", vm.amountWords],
  ];

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "#fff",
        borderRadius: "10px",
        border: "1px solid #d5e8d5",
        overflow: "hidden",
        fontFamily: '"Segoe UI", Lato, Helvetica, Arial, sans-serif',
        textAlign: "center",
        mx: "auto",
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
            top: "42%",
            transform: "translate(-50%, -50%)",
            width: 200,
            height: 200,
            opacity: 0.06,
            pointerEvents: "none",
            objectFit: "contain",
          }}
        />
      ) : null}

      <Box sx={{ position: "relative", p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              maxWidth: "100%",
            }}
          >
            {logoSrc ? (
              <Box
                component="img"
                src={logoSrc}
                alt={org.name}
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `2px solid ${greenMid}`,
                  flexShrink: 0,
                }}
              />
            ) : null}
            <Box sx={{ textAlign: "center", minWidth: 0 }}>
              <Typography
                sx={{ fontSize: "1.15rem", fontWeight: 800, color: green, lineHeight: 1.2 }}
              >
                {org.name}
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#1f2a44" }}>
                {org.subtitle}
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: greenMid, mt: 0.25 }}>
                {org.tagline}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "center", my: 1.5, gap: 1 }}
        >
          <Typography sx={{ color: greenMid, fontSize: "0.9rem" }} aria-hidden>
            🌿
          </Typography>
          <Box
            sx={{
              bgcolor: green,
              color: "#fff",
              px: 2.5,
              py: 0.55,
              borderRadius: "999px",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
            }}
          >
            DONATION RECEIPT
          </Box>
          <Typography sx={{ color: greenMid, fontSize: "0.9rem" }} aria-hidden>
            🌿
          </Typography>
        </Box>

        {vm.testMode ? (
          <Typography
            sx={{
              mb: 1,
              px: 1,
              py: 0.5,
              bgcolor: "#fff8e1",
              color: "#6d4c00",
              fontSize: "0.7rem",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            TEST MODE — Not a valid tax receipt for live payments.
          </Typography>
        ) : null}

        <Grid container spacing={2} sx={{ mb: 1.5, justifyContent: "center" }}>
          <Grid item xs={12} sm={6}>
            <MetaCell label="Receipt No." value={vm.receiptNo} valueGreen />
            <Box sx={{ mt: 1 }}>
              <MetaCell label="Date" value={vm.date} />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              borderTop: { xs: "1px solid #e2e8e2", sm: "none" },
              borderLeft: { sm: "1px solid #e2e8e2" },
              pt: { xs: 2, sm: 0 },
              pl: { sm: 2 },
            }}
          >
            <MetaCell label="Mode of Payment" value={vm.paymentMode} />
            <Box sx={{ mt: 1 }}>
              <MetaCell label="Payment Status" value={vm.paymentStatus} valueGreen={vm.isSuccess} />
            </Box>
          </Grid>
        </Grid>

        <Typography
          sx={{
            textAlign: "center",
            fontSize: "0.78rem",
            color: "#1f2a44",
            lineHeight: 1.55,
            mb: 0.25,
          }}
        >
          Thank you, <strong>{vm.donorName}</strong>, for your generous contribution towards the
          care, shelter and dignity of homeless &amp; unclaimed people.
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "0.72rem",
            color: "rgba(31,42,68,0.65)",
            fontStyle: "italic",
            mb: 1.5,
          }}
        >
          Your support truly makes a difference.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: 1.25,
            mb: 1.5,
          }}
        >
          <DetailTable title="DONOR DETAILS" rows={donorRows} />
          <DetailTable title="DONATION DETAILS" rows={donationRows} />
        </Box>

        <Box
          sx={{
            border: "1px dashed #b8c9b8",
            borderRadius: "8px",
            p: 1.25,
            bgcolor: "#fafcfa",
            mb: 1.5,
            maxWidth: 560,
            mx: "auto",
          }}
        >
          <DescriptionOutlinedIcon sx={{ color: greenMid, fontSize: 22, mb: 0.5 }} />
          <Box>
            <Typography sx={{ fontSize: "0.68rem", color: "#1f2a44", lineHeight: 1.5 }}>
              This donation is eligible for tax exemption under Section 80G of the Income Tax Act,
              1961, subject to applicable rules. Please keep this receipt for your tax records.
            </Typography>
            <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: greenMid, mt: 0.5 }}>
              This receipt is valid subject to realization of funds.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ fontSize: "0.65rem", color: "rgba(31,42,68,0.75)", maxWidth: 480, mx: "auto" }}>
          <Box sx={{ display: "flex", gap: 0.75, justifyContent: "center", mb: 1 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 16, color: greenMid, flexShrink: 0 }} />
            <Typography sx={{ fontSize: "0.65rem", lineHeight: 1.45, textAlign: "left" }}>
              {org.address}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 0.75, justifyContent: "center", mb: 0.5 }}>
            <EmailOutlinedIcon sx={{ fontSize: 15, color: greenMid }} />
            <Typography sx={{ fontSize: "0.65rem" }}>{org.email}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 0.75, justifyContent: "center", mb: 0.5 }}>
            <PhoneIphoneOutlinedIcon sx={{ fontSize: 15, color: greenMid }} />
            <Typography sx={{ fontSize: "0.65rem" }}>{org.phone}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 0.75, justifyContent: "center", mb: 0.5 }}>
            <BadgeOutlinedIcon sx={{ fontSize: 15, color: greenMid }} />
            <Typography sx={{ fontSize: "0.65rem" }}>PAN: {org.pan}</Typography>
          </Box>
          <Typography sx={{ fontSize: "0.62rem", color: "rgba(31,42,68,0.55)", mt: 0.5 }}>
            Visit: {org.website.replace(/^https?:\/\//, "")}
          </Typography>
        </Box>

        <Divider sx={{ my: 1.25, borderColor: greenLight }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: "0.7rem", color: "rgba(31,42,68,0.7)", mb: 0.35 }}>
            <FavoriteBorderIcon sx={{ fontSize: 14, verticalAlign: "text-bottom", mr: 0.3 }} />
            Every contribution helps us provide food, shelter and dignity to those in need.
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: green }}>
            Thank you for being a part of our mission.
          </Typography>
          <Typography sx={{ fontSize: "0.6rem", color: "rgba(31,42,68,0.45)", mt: 1 }}>
            This is a computer-generated receipt and does not require physical signature.
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
