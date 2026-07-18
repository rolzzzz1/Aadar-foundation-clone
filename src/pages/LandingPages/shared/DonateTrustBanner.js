import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { useTranslation } from "react-i18next";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import razorpayLogoLight from "assets/images/logos/razorpay-logo-light.svg";

const labelSx = {
  color: "#1f2a44",
  fontWeight: 500,
  fontSize: { xs: "0.66rem", sm: "0.72rem", md: "0.76rem" },
  lineHeight: 1.2,
};

/** Trust block below Donate Now — secure payments row. */
export default function DonateTrustBanner() {
  const { t } = useTranslation();
  const trustBannerRaw = t("donatePage.trustBanner");
  const trustBanner =
    trustBannerRaw && typeof trustBannerRaw === "object"
      ? trustBannerRaw
      : {
          securePaymentsPoweredBy: "Secure payments powered by",
        };

  return (
    <MKBox
      sx={{
        mt: 1,
        pt: { xs: 0.75, sm: 0.85 },
        borderTop: "1px solid rgba(46, 125, 50, 0.12)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 0.25, sm: 0.3 },
        width: "100%",
      }}
    >
      <MKBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 0.5, sm: 0.65 },
          flexWrap: "wrap",
        }}
      >
        <VerifiedUserOutlinedIcon
          sx={{ color: "#2e7d32", fontSize: { xs: 18, sm: 20 }, flexShrink: 0 }}
        />
        <MKTypography variant="body2" sx={labelSx}>
          {trustBanner.securePaymentsPoweredBy}
        </MKTypography>
        <MKBox
          component="img"
          src={razorpayLogoLight}
          alt="Razorpay"
          sx={{
            height: { xs: 14, sm: 16, md: 18 },
            width: "auto",
            flexShrink: 0,
            display: "block",
          }}
        />
      </MKBox>
    </MKBox>
  );
}
