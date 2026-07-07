import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import { DONATION_RECEIPT_PATH } from "utils/donation";

const BODY_FALLBACK = "Retrieve or download your official 80G receipt for online donations only.";
const BANK_TRANSFER_FALLBACK =
  "For UPI / QR and bank transfer donations, email us at aadarfoundation2018@gmail.com with your full name, father/husband name, email, mobile number, PAN, complete address (house no., city, state, PIN), donation amount, payment date, transaction reference (UTR or bank ref), and a clear payment screenshot. We will verify your payment and email your 80G tax receipt.";

export default function DonateReceiptCta({ sx = {} }) {
  const { t } = useTranslation();
  const copy = t("receiptRetrieve.cta", { returnObjects: true });

  return (
    <MKBox
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "center", md: "center" },
        justifyContent: "space-between",
        gap: { xs: 1.75, md: 2.5 },
        p: { xs: 2.25, sm: 2.5, md: 3 },
        borderRadius: "22px",
        background:
          "linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(236, 252, 243, 0.75) 55%, rgba(255, 255, 255, 0.9) 100%)",
        border: "1px solid rgba(46, 125, 50, 0.16)",
        boxShadow: "0 14px 34px rgba(31, 42, 68, 0.06)",
        textAlign: { xs: "center", md: "left" },
        ...sx,
      }}
    >
      <MKBox
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: { xs: 1.25, sm: 1.75 },
          flex: 1,
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
            fontSize: { xs: 56, sm: 68, md: 72 },
          }}
        >
          <ReceiptLongOutlinedIcon
            sx={{
              color: "#2e7d32",
              fontSize: "1em",
              width: "1em",
              height: "1em",
            }}
          />
        </MKBox>

        <MKBox sx={{ minWidth: 0 }}>
          <MKTypography
            sx={{
              fontWeight: 700,
              color: "#1f2a44",
              fontSize: { xs: "1.02rem", sm: "1.08rem", md: "1.12rem" },
              lineHeight: 1.3,
              mb: 0.5,
            }}
          >
            {copy.title || "Need your donation receipt?"}
          </MKTypography>
          <MKTypography
            sx={{
              color: "rgba(31, 42, 68, 0.72)",
              fontSize: { xs: "0.84rem", sm: "0.9rem" },
              lineHeight: 1.55,
              maxWidth: 560,
            }}
          >
            {copy.body || BODY_FALLBACK}
          </MKTypography>
          <MKTypography
            component="p"
            sx={{
              mt: 1,
              color: "rgba(31, 42, 68, 0.58)",
              fontSize: { xs: "0.78rem", sm: "0.82rem" },
              lineHeight: 1.5,
              fontStyle: "italic",
              maxWidth: 560,
            }}
          >
            {copy.bankTransferNote || BANK_TRANSFER_FALLBACK}
          </MKTypography>
        </MKBox>
      </MKBox>

      <MKButton
        component={RouterLink}
        to={DONATION_RECEIPT_PATH}
        variant="contained"
        color="success"
        sx={{
          flexShrink: 0,
          fontWeight: 800,
          textTransform: "none",
          borderRadius: "12px",
          px: { xs: 2.5, sm: 3 },
          py: { xs: 1.05, sm: 1.15 },
          fontSize: { xs: "0.875rem", sm: "0.9375rem" },
          width: { xs: "100%", sm: "auto" },
          maxWidth: { xs: 280, sm: "none" },
          mr: { md: 4.5 },
          boxShadow: "0 8px 18px rgba(79, 169, 83, 0.22)",
        }}
      >
        {copy.button || "Get my receipt"}
      </MKButton>
    </MKBox>
  );
}

DonateReceiptCta.propTypes = {
  sx: PropTypes.object,
};
