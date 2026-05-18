import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { ReactComponent as RazorpayLogoLight } from "assets/images/logos/razorpay-logo-light.svg";

const labelSx = {
  color: "#1f2a44",
  fontWeight: 500,
  fontSize: { xs: "0.68rem", sm: "0.75rem", md: "0.8rem" },
  lineHeight: 1.25,
};

const receiptSx = {
  color: "rgba(31, 42, 68, 0.52)",
  fontWeight: 400,
  fontSize: { xs: "0.58rem", sm: "0.62rem", md: "0.65rem" },
  lineHeight: 1.2,
  whiteSpace: "nowrap",
};

/** Trust block below Donate Now — two rows: payments + receipt. */
export default function DonateTrustBanner() {
  return (
    <MKBox
      sx={{
        mt: 2,
        pt: { xs: 1.25, sm: 1.5 },
        borderTop: "1px solid rgba(46, 125, 50, 0.12)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 0.35, sm: 0.4 },
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
          sx={{ color: "#2e7d32", fontSize: { xs: 22, sm: 24 }, flexShrink: 0 }}
        />
        <MKTypography variant="body2" sx={labelSx}>
          Secure payments powered by
        </MKTypography>
        <MKBox
          component={RazorpayLogoLight}
          sx={{
            height: { xs: 16, sm: 18, md: 20 },
            width: "auto",
            flexShrink: 0,
            display: "block",
            "& svg": { height: "100%", width: "auto", display: "block" },
          }}
        />
      </MKBox>

      <MKBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 0.5, sm: 0.65 },
        }}
      >
        <MKBox
          sx={{
            width: { xs: 26, sm: 28 },
            height: { xs: 26, sm: 28 },
            borderRadius: "50%",
            bgcolor: "#eaf7ea",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AssignmentTurnedInOutlinedIcon
            sx={{ color: "rgba(46, 125, 50, 0.65)", fontSize: { xs: 14, sm: 15 } }}
          />
        </MKBox>
        <MKTypography variant="body2" sx={receiptSx}>
          Receipt will be provided in proper optimised way
        </MKTypography>
      </MKBox>
    </MKBox>
  );
}
