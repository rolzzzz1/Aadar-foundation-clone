import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
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
const GUIDE_HEADLINE_FALLBACK = "Read this before you continue";
const GUIDE_SUB_FALLBACK =
  "Pick the path that matches how you donated — the wrong path will not find your receipt.";
const ONLINE_ACTION_FALLBACK = "Use the lookup form below";
const BANK_ACTION_FALLBACK = "Use the bank / QR form below";

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
        role="region"
        aria-label={copy.guideHeadline || GUIDE_HEADLINE_FALLBACK}
        sx={{
          position: "relative",
          borderRadius: "18px",
          overflow: "hidden",
          backgroundColor: "#fffdf8",
          border: "1.5px solid rgba(236, 165, 51, 0.55)",
          boxShadow: "0 14px 36px rgba(179, 121, 31, 0.12), 0 2px 0 rgba(236, 165, 51, 0.35)",
          animation: "receiptGuidePulse 2.8s ease-in-out 1",
          "@keyframes receiptGuidePulse": {
            "0%": { boxShadow: "0 14px 36px rgba(179, 121, 31, 0.08)" },
            "40%": { boxShadow: "0 16px 42px rgba(179, 121, 31, 0.22)" },
            "100%": { boxShadow: "0 14px 36px rgba(179, 121, 31, 0.12)" },
          },
          ...sx,
        }}
      >
        <MKBox
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1.25,
            px: { xs: 2, sm: 2.5 },
            py: { xs: 1.35, sm: 1.5 },
            background: "linear-gradient(90deg, #ECA533 0%, #f0b84a 55%, #f6c96a 100%)",
          }}
        >
          <MKBox
            sx={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PriorityHighRoundedIcon sx={{ color: "#8a5a10", fontSize: 22 }} />
          </MKBox>
          <MKBox sx={{ minWidth: 0 }}>
            <MKTypography
              component="p"
              sx={{
                m: 0,
                fontWeight: 800,
                color: "#3d2a08",
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                letterSpacing: "0.02em",
                lineHeight: 1.25,
                textTransform: "uppercase",
              }}
            >
              {copy.guideHeadline || GUIDE_HEADLINE_FALLBACK}
            </MKTypography>
            <MKTypography
              component="p"
              sx={{
                m: 0,
                mt: 0.35,
                color: "rgba(61, 42, 8, 0.82)",
                fontSize: { xs: "0.8rem", sm: "0.86rem" },
                lineHeight: 1.45,
                fontWeight: 600,
              }}
            >
              {copy.guideSub || GUIDE_SUB_FALLBACK}
            </MKTypography>
          </MKBox>
        </MKBox>

        <MKBox
          sx={{
            p: { xs: 2, sm: 2.5, md: 2.75 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
            columnGap: { md: 3 },
            rowGap: 2.25,
          }}
        >
          <MKBox
            sx={{
              borderRadius: "14px",
              backgroundColor: "#ffffff",
              border: "1px solid rgba(46, 125, 50, 0.22)",
              p: { xs: 1.75, sm: 2 },
            }}
          >
            <MKTypography
              sx={{
                mb: 1,
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#2e7d32",
              }}
            >
              {copy.onlineStep || "Path 1"}
            </MKTypography>
            <MKBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.85 }}>
              <MKBox
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: "rgba(46, 125, 50, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <BoltOutlinedIcon sx={{ color: "#2e7d32", fontSize: 19 }} />
              </MKBox>
              <MKTypography sx={{ fontWeight: 800, color: "#1f2a44", fontSize: "0.98rem" }}>
                {copy.onlineTitle || "Online Donations via Razorpay"}
              </MKTypography>
            </MKBox>
            <MKTypography sx={{ fontWeight: 700, color: "#2e7d32", fontSize: "0.86rem", mb: 0.55 }}>
              {copy.onlineMethods || "UPI, Cards, Net Banking"}
            </MKTypography>
            <MKTypography
              sx={{ color: "rgba(31, 42, 68, 0.72)", fontSize: "0.84rem", lineHeight: 1.55, mb: 1 }}
            >
              {copy.onlineBodyOnPage || copy.onlineBody || ONLINE_BODY_FALLBACK}
            </MKTypography>
            <MKTypography
              sx={{
                fontWeight: 800,
                color: "#1b5e20",
                fontSize: "0.82rem",
                lineHeight: 1.4,
              }}
            >
              → {copy.onlineAction || ONLINE_ACTION_FALLBACK}
            </MKTypography>
          </MKBox>

          <MKBox
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <MKBox sx={{ flex: 1, height: "1px", backgroundColor: "rgba(31, 42, 68, 0.14)" }} />
            <MKTypography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 800,
                color: "rgba(31, 42, 68, 0.55)",
                letterSpacing: "0.06em",
              }}
            >
              OR
            </MKTypography>
            <MKBox sx={{ flex: 1, height: "1px", backgroundColor: "rgba(31, 42, 68, 0.14)" }} />
          </MKBox>
          <MKBox
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <MKBox
              sx={{ width: "1px", height: "100%", backgroundColor: "rgba(31, 42, 68, 0.14)" }}
            />
            <MKBox
              sx={{
                position: "absolute",
                width: 38,
                height: 38,
                borderRadius: "50%",
                backgroundColor: "#fffdf8",
                border: "1.5px solid rgba(236, 165, 51, 0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.72rem",
                fontWeight: 800,
                color: "#8a5a10",
              }}
            >
              OR
            </MKBox>
          </MKBox>

          <MKBox
            sx={{
              borderRadius: "14px",
              backgroundColor: "#ffffff",
              border: "1px solid rgba(236, 165, 51, 0.35)",
              p: { xs: 1.75, sm: 2 },
            }}
          >
            <MKTypography
              sx={{
                mb: 1,
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#b3791f",
              }}
            >
              {copy.bankStep || "Path 2"}
            </MKTypography>
            <MKBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.85 }}>
              <MKBox
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: "rgba(236, 165, 51, 0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AccountBalanceOutlinedIcon sx={{ color: "#b3791f", fontSize: 19 }} />
              </MKBox>
              <MKTypography sx={{ fontWeight: 800, color: "#1f2a44", fontSize: "0.98rem" }}>
                {copy.bankTitle || "Donated via Direct QR or Bank Transfer?"}
              </MKTypography>
            </MKBox>
            <MKTypography
              sx={{ color: "rgba(31, 42, 68, 0.72)", fontSize: "0.84rem", lineHeight: 1.55, mb: 1 }}
            >
              {copy.bankBodyOnPage || BANK_BODY_FALLBACK}
            </MKTypography>
            <MKTypography
              sx={{
                fontWeight: 800,
                color: "#8a5a10",
                fontSize: "0.82rem",
                lineHeight: 1.4,
              }}
            >
              → {copy.bankAction || BANK_ACTION_FALLBACK}
            </MKTypography>
          </MKBox>
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
