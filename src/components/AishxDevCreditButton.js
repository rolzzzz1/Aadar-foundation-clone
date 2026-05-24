import PropTypes from "prop-types";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MKBox from "components/MKBox";
import aishxDevLogo from "assets/images/logos/aishx-dev-logo.png";

const outerSx = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: { xs: "6px", sm: "8px" },
  p: "2px",
  borderRadius: "999px",
  verticalAlign: "middle",
  cursor: "pointer",
  textDecoration: "none",
  color: "inherit",
  overflow: "hidden",
  background: "linear-gradient(120deg, #4FA953 0%, #6BC46F 28%, #ECA533 62%, #FFD757 100%)",
  boxShadow:
    "0 4px 16px rgba(79, 169, 83, 0.35), 0 2px 10px rgba(236, 165, 51, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
  transition: "transform 0.22s ease, box-shadow 0.22s ease",
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    background:
      "linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.35) 50%, transparent 70%)",
    transform: "translateX(-120%)",
    transition: "transform 0.5s ease",
    pointerEvents: "none",
  },
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      "0 8px 22px rgba(79, 169, 83, 0.45), 0 4px 14px rgba(236, 165, 51, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
    "&::after": {
      transform: "translateX(120%)",
    },
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
  position: "relative",
  zIndex: 1,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: { xs: 0.4, sm: 0.5 },
  height: { xs: 34, sm: 36 },
  pl: { xs: 0.5, sm: 0.55 },
  pr: { xs: 0.5, sm: 0.55 },
  borderRadius: "999px",
  background: "linear-gradient(180deg, #3a3a3a 0%, #262626 100%)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.3)",
};

const logoWrapSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  overflow: "hidden",
  height: { xs: 28, sm: 30 },
  maxHeight: "100%",
  bgcolor: "#ffffff",
  borderRadius: "5px",
  px: { xs: 0.35, sm: 0.4 },
  py: 0,
  lineHeight: 0,
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
};

/** Original PNG — crop top/bottom whitespace, scale up so label text stays readable. */
const logoSx = {
  display: "block",
  height: { xs: 34, sm: 38 },
  width: "auto",
  maxWidth: { xs: 118, sm: 132 },
  objectFit: "contain",
  objectPosition: "left center",
  clipPath: "inset(22% 0 22% 0)",
  transform: "scale(1.12)",
  transformOrigin: "center center",
  pointerEvents: "none",
  userSelect: "none",
  imageRendering: "-webkit-optimize-contrast",
};

const linkIconSx = {
  fontSize: { xs: 15, sm: 16 },
  color: "#FFD757",
  flexShrink: 0,
  opacity: 0.95,
};

export default function AishxDevCreditButton({ sx }) {
  return (
    <MKBox
      component="a"
      href="https://linktr.ee/aishx.dev"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit Aishx.dev (opens in a new tab)"
      title="Visit Aishx.dev"
      data-footer-button="aishx"
      sx={{ ...outerSx, ...sx }}
    >
      <MKBox sx={innerSx}>
        <MKBox sx={logoWrapSx}>
          <MKBox component="img" src={aishxDevLogo} alt="Aishx.dev" draggable={false} sx={logoSx} />
        </MKBox>
        <OpenInNewIcon aria-hidden sx={linkIconSx} />
      </MKBox>
    </MKBox>
  );
}

AishxDevCreditButton.propTypes = {
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
};
