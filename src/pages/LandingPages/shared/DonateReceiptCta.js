import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
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

export default function DonateReceiptCta({ sx = {} }) {
  const { t } = useTranslation();
  const copy = t("receiptRetrieve.cta", { returnObjects: true });

  return (
    <MKBox
      sx={{
        borderRadius: "22px",
        background:
          "linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(236, 252, 243, 0.75) 55%, rgba(255, 255, 255, 0.9) 100%)",
        border: "1px solid rgba(46, 125, 50, 0.16)",
        boxShadow: "0 14px 34px rgba(31, 42, 68, 0.06)",
        p: { xs: 2, sm: 2.5, md: 3 },
        ...sx,
      }}
    >
      {/* Header: icon + title/subtitle + CTA button */}
      <MKBox
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 1.5, sm: 2 },
          mb: { xs: 2, sm: 2.25 },
        }}
      >
        <MKBox
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.25, sm: 1.75 },
            minWidth: 0,
          }}
        >
          <MKBox
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              lineHeight: 0,
              fontSize: { xs: 58, sm: 68 },
            }}
          >
            <ReceiptLongOutlinedIcon
              sx={{ color: "#2e7d32", fontSize: "1em", width: "1em", height: "1em" }}
            />
          </MKBox>

          <MKBox sx={{ minWidth: 0 }}>
            <MKTypography
              sx={{
                fontFamily:
                  '"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                color: "#1f2a44",
                fontSize: { xs: "1.25rem", sm: "1.4rem", md: "1.5rem" },
                lineHeight: 1.3,
              }}
            >
              {copy.title || "Need your donation receipt?"}
            </MKTypography>
            <MKTypography
              sx={{
                color: "rgba(31, 42, 68, 0.68)",
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                lineHeight: 1.5,
                mt: 0.25,
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
          startIcon={<ReceiptLongOutlinedIcon />}
          sx={{
            flexShrink: 0,
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "12px",
            px: { xs: 2.75, sm: 3.25 },
            py: { xs: 1.15, sm: 1.25 },
            fontSize: { xs: "0.9rem", sm: "0.975rem" },
            width: { xs: "100%", sm: "auto" },
            minWidth: { sm: 200, md: 220 },
            maxWidth: { xs: 300, sm: "none" },
            mr: { sm: 2.5, md: 3.5 },
            color: "#2e7d32",
            border: "1.5px solid rgba(46, 125, 50, 0.45)",
            backgroundColor: "#ffffff",
            boxShadow: "none",
            letterSpacing: "0.01em",
            "& .MuiSvgIcon-root": {
              color: "#2e7d32",
              fontSize: "1.3rem !important",
            },
            "&:hover": {
              backgroundColor: "rgba(46, 125, 50, 0.06)",
              border: "1.5px solid rgba(46, 125, 50, 0.65)",
              boxShadow: "none",
              color: "#1b5e20",
            },
            "&:focus, &.Mui-focusVisible, &:focus-visible, &:focus:not(:hover)": {
              backgroundColor: "#ffffff",
              border: "1.5px solid rgba(46, 125, 50, 0.65)",
              boxShadow: "0 0 0 3px rgba(46, 125, 50, 0.12)",
              outline: "none",
            },
          }}
        >
          {copy.button || "Get my receipt"}
        </MKButton>
      </MKBox>

      {/* Two-column panel: online donations vs direct QR / bank transfer */}
      <MKBox
        sx={{
          position: "relative",
          borderRadius: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          border: "1px solid rgba(46, 125, 50, 0.14)",
          p: { xs: 2, sm: 2.5, md: 2.75 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
          columnGap: { md: 3 },
          rowGap: 2,
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
              Online Donations via Razorpay
            </MKTypography>
          </MKBox>
          <MKTypography sx={{ fontWeight: 700, color: "#2e7d32", fontSize: "0.83rem", mb: 0.5 }}>
            UPI, Cards, Net Banking
          </MKTypography>
          <MKTypography
            sx={{ color: "rgba(31, 42, 68, 0.68)", fontSize: "0.8rem", lineHeight: 1.55 }}
          >
            Your donation details are captured automatically. Retrieve or download your 80G receipt
            instantly.
          </MKTypography>
        </MKBox>

        {/* Divider with "OR" badge — vertical on desktop, horizontal on mobile */}
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
              Donated via Direct QR or Bank Transfer?
            </MKTypography>
          </MKBox>
          <MKTypography
            sx={{ color: "rgba(31, 42, 68, 0.68)", fontSize: "0.8rem", lineHeight: 1.6 }}
          >
            Email{" "}
            <MKBox component="span" sx={{ color: "#2e7d32", fontWeight: 700 }}>
              aadarfoundation2018@gmail.com
            </MKBox>{" "}
            with your name, father/husband name, mobile, email,{" "}
            <MKBox component="span" sx={{ fontWeight: 700, color: "#1f2a44" }}>
              PAN (required)
            </MKBox>
            , address, donation amount, payment date, UTR/Bank Reference, and payment screenshot.
          </MKTypography>
          <MKTypography
            sx={{ color: "rgba(31, 42, 68, 0.68)", fontSize: "0.8rem", lineHeight: 1.6, mt: 1 }}
          >
            After verification, we&apos;ll email your 80G tax receipt.
          </MKTypography>
        </MKBox>
      </MKBox>
    </MKBox>
  );
}

DonateReceiptCta.propTypes = {
  sx: PropTypes.object,
};
