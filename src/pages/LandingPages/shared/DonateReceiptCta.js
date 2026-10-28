import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import { DONATION_RECEIPT_PATH } from "utils/donation";

const BODY_FALLBACK = "Retrieve or download your official 80G receipt for online donations only.";
const ONLINE_BODY_FALLBACK =
  "Retrieve or download your official 80G receipt for Razorpay donations.";
const BANK_BODY_FALLBACK =
  "Submit your details below. After verification, we'll email your 80G tax receipt.";

/**
 * @param {"cta"|"guide"} variant
 * - cta: Donate2 header + “Get my receipt” button
 * - guide: receipt-page Razorpay vs QR/bank OR panel
 */
export default function DonateReceiptCta({ variant = "cta", sx = {} }) {
  const { t } = useTranslation();
  const copy = t("receiptRetrieve.cta", { returnObjects: true }) || {};

  if (variant === "guide") {
    return (
      <MKBox
        sx={{
          position: "relative",
          borderRadius: "16px",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(31, 42, 68, 0.1)",
          boxShadow: "0 8px 24px rgba(31, 42, 68, 0.05)",
          p: { xs: 2, sm: 2.5, md: 2.75 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
          columnGap: { md: 3 },
          rowGap: 2,
          ...sx,
        }}
      >
        <MKBox>
          <MKBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.85 }}>
            <MKBox
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                backgroundColor: "rgba(46, 125, 50, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <BoltOutlinedIcon sx={{ color: "#2e7d32", fontSize: 18 }} />
            </MKBox>
            <MKTypography sx={{ fontWeight: 700, color: "#1f2a44", fontSize: "0.9rem" }}>
              {copy.onlineTitle || "Online Donations via Razorpay"}
            </MKTypography>
          </MKBox>
          <MKTypography sx={{ fontWeight: 700, color: "#2e7d32", fontSize: "0.83rem", mb: 0.5 }}>
            {copy.onlineMethods || "UPI, Cards, Net Banking"}
          </MKTypography>
          <MKTypography
            sx={{ color: "rgba(31, 42, 68, 0.68)", fontSize: "0.8rem", lineHeight: 1.55 }}
          >
            {copy.onlineBodyOnPage || copy.onlineBody || ONLINE_BODY_FALLBACK}
          </MKTypography>
        </MKBox>

        <MKBox
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 1,
          }}
        >
          <MKBox sx={{ flex: 1, height: "1px", backgroundColor: "rgba(31, 42, 68, 0.12)" }} />
          <MKTypography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "rgba(31, 42, 68, 0.5)",
              letterSpacing: "0.04em",
            }}
          >
            OR
          </MKTypography>
          <MKBox sx={{ flex: 1, height: "1px", backgroundColor: "rgba(31, 42, 68, 0.12)" }} />
        </MKBox>
        <MKBox
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <MKBox sx={{ width: "1px", height: "100%", backgroundColor: "rgba(31, 42, 68, 0.12)" }} />
          <MKBox
            sx={{
              position: "absolute",
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              border: "1px solid rgba(31, 42, 68, 0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "rgba(31, 42, 68, 0.5)",
            }}
          >
            OR
          </MKBox>
        </MKBox>

        <MKBox>
          <MKBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.85 }}>
            <MKBox
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                backgroundColor: "rgba(236, 165, 51, 0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <AccountBalanceOutlinedIcon sx={{ color: "#b3791f", fontSize: 18 }} />
            </MKBox>
            <MKTypography sx={{ fontWeight: 700, color: "#1f2a44", fontSize: "0.9rem" }}>
              {copy.bankTitle || "Donated via Direct QR or Bank Transfer?"}
            </MKTypography>
          </MKBox>
          <MKTypography
            sx={{ color: "rgba(31, 42, 68, 0.68)", fontSize: "0.8rem", lineHeight: 1.6 }}
          >
            {copy.bankBodyOnPage || BANK_BODY_FALLBACK}
          </MKTypography>
        </MKBox>
      </MKBox>
    );
  }

  return (
    <MKBox
      sx={{
        position: "relative",
        borderRadius: { xs: "16px", md: "18px" },
        background: "linear-gradient(165deg, #f3f9f4 0%, #eef6ef 45%, #e8f2ea 100%)",
        border: "1px solid rgba(79, 169, 83, 0.22)",
        boxShadow: "0 10px 28px rgba(31, 42, 68, 0.05)",
        p: { xs: 2, sm: 2.25, md: 2.5 },
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          backgroundColor: "#4FA953",
          opacity: 0.85,
        },
        ...sx,
      }}
    >
      <MKBox
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <MKBox
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.25, sm: 1.5 },
            minWidth: 0,
          }}
        >
          <MKBox
            sx={{
              width: { xs: 44, sm: 48 },
              height: { xs: 44, sm: 48 },
              borderRadius: "14px",
              backgroundColor: "rgba(79, 169, 83, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ReceiptLongOutlinedIcon sx={{ color: "#2e7d32", fontSize: { xs: 24, sm: 26 } }} />
          </MKBox>

          <MKBox sx={{ minWidth: 0 }}>
            <MKTypography
              sx={{
                fontFamily:
                  '"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                color: "#1f2a44",
                fontSize: { xs: "1.2rem", sm: "1.35rem", md: "1.45rem" },
                lineHeight: 1.3,
              }}
            >
              {copy.title || "Need your donation receipt?"}
            </MKTypography>
            <MKTypography
              sx={{
                color: "rgba(31, 42, 68, 0.62)",
                fontSize: { xs: "0.84rem", sm: "0.9rem" },
                lineHeight: 1.5,
                mt: 0.35,
                maxWidth: 480,
              }}
            >
              {copy.body || BODY_FALLBACK}
            </MKTypography>
          </MKBox>
        </MKBox>

        <MKButton
          component={RouterLink}
          to={DONATION_RECEIPT_PATH}
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          sx={{
            flexShrink: 0,
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "12px",
            px: { xs: 2.5, sm: 3 },
            py: { xs: 1.05, sm: 1.15 },
            fontSize: { xs: "0.88rem", sm: "0.94rem" },
            width: { xs: "100%", sm: "auto" },
            minWidth: { sm: 180 },
            maxWidth: { xs: 300, sm: "none" },
            color: "#1f2a44",
            border: "1px solid rgba(79, 169, 83, 0.28)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            boxShadow: "none",
            letterSpacing: "0.01em",
            "& .MuiButton-endIcon": {
              marginLeft: "8px",
              marginRight: "-2px",
            },
            "& .MuiSvgIcon-root": {
              color: "#2e7d32",
              fontSize: "1.2rem !important",
            },
            "&:hover": {
              backgroundColor: "#ffffff",
              border: "1px solid rgba(79, 169, 83, 0.5)",
              boxShadow: "none",
              color: "#1f2a44",
            },
            "&:focus, &.Mui-focusVisible, &:focus-visible, &:focus:not(:hover)": {
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              border: "1px solid rgba(79, 169, 83, 0.5)",
              boxShadow: "0 0 0 3px rgba(79, 169, 83, 0.12)",
              outline: "none",
            },
          }}
        >
          {copy.button || "Get my receipt"}
        </MKButton>
      </MKBox>
    </MKBox>
  );
}

DonateReceiptCta.propTypes = {
  variant: PropTypes.oneOf(["cta", "guide"]),
  sx: PropTypes.object,
};
