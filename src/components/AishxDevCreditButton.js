import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import MKBox from "components/MKBox";
import aishxDevLogo from "assets/images/logos/aishx-dev-logo.png";

const BRAND_NAVY = "#1a2744";
const BRAND_CYAN = "#00bcd4";

const outerSx = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: { xs: "6px", sm: "8px" },
  p: "2.5px",
  borderRadius: "999px",
  verticalAlign: "middle",
  cursor: "pointer",
  textDecoration: "none",
  color: "inherit",
  background: "linear-gradient(110deg, #4FA953 0%, #7BC96F 22%, #ECA533 58%, #FFD757 100%)",
  boxShadow:
    "0 0 18px rgba(79, 169, 83, 0.55), 0 0 14px rgba(255, 215, 87, 0.35), 0 4px 12px rgba(0, 0, 0, 0.2)",
  transition: "transform 0.22s ease, box-shadow 0.22s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      "0 0 24px rgba(79, 169, 83, 0.65), 0 0 18px rgba(255, 215, 87, 0.45), 0 6px 16px rgba(0, 0, 0, 0.22)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&:focus-visible": {
    outline: "2px solid #FFD757",
    outlineOffset: "2px",
  },
};

const innerSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: { xs: 0.65, sm: 0.75 },
  height: { xs: 38, sm: 40 },
  pl: { xs: 0.65, sm: 0.75 },
  pr: { xs: 0.85, sm: 0.95 },
  borderRadius: "999px",
  bgcolor: "#ffffff",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 1px 2px rgba(0, 0, 0, 0.06)",
};

/** Yellow mark from original PNG (left crop only). */
const iconWrapSx = {
  width: { xs: 30, sm: 32 },
  height: { xs: 30, sm: 32 },
  flexShrink: 0,
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.14)",
};

const iconImgSx = {
  display: "block",
  height: "100%",
  width: "auto",
  minWidth: "145%",
  maxWidth: "none",
  objectFit: "cover",
  objectPosition: "left center",
  pointerEvents: "none",
  userSelect: "none",
};

const dividerSx = {
  width: "1px",
  alignSelf: "stretch",
  my: 0.75,
  flexShrink: 0,
  bgcolor: "rgba(26, 39, 68, 0.14)",
};

const brandTextSx = {
  fontWeight: 700,
  fontSize: { xs: "0.92rem", sm: "0.98rem" },
  lineHeight: 1,
  letterSpacing: "-0.02em",
  fontFamily: '"Segoe UI", system-ui, -apple-system, "Lato", sans-serif',
  whiteSpace: "nowrap",
};

const linkIconSx = {
  fontSize: { xs: 17, sm: 18 },
  color: BRAND_NAVY,
  flexShrink: 0,
  opacity: 0.88,
};

export default function AishxDevCreditButton({ sx }) {
  const { t } = useTranslation();
  const visitProfileLabel = t("footer.visitProfile");

  return (
    <Tooltip title={visitProfileLabel} arrow placement="top">
      <Box component="span" sx={{ display: "inline-flex", verticalAlign: "middle", lineHeight: 0 }}>
        <MKBox
          component="a"
          href="https://linktr.ee/aishx.dev"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={visitProfileLabel}
          data-footer-button="aishx"
          sx={{ ...outerSx, ...sx }}
        >
          <MKBox sx={innerSx}>
            <MKBox sx={iconWrapSx}>
              <MKBox component="img" src={aishxDevLogo} alt="" draggable={false} sx={iconImgSx} />
            </MKBox>

            <Typography component="span" sx={brandTextSx} aria-hidden>
              <Box component="span" sx={{ color: BRAND_NAVY }}>
                Aishx
              </Box>
              <Box component="span" sx={{ color: BRAND_CYAN }}>
                .dev
              </Box>
            </Typography>

            <Box sx={dividerSx} aria-hidden />

            <OpenInNewIcon aria-hidden sx={linkIconSx} />
          </MKBox>
        </MKBox>
      </Box>
    </Tooltip>
  );
}

AishxDevCreditButton.propTypes = {
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
};
