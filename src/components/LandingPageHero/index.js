import PropTypes from "prop-types";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import brushStroke from "assets/images/mainThemeImages/smallBrushstroke2.svg";
import { PAGE_HERO_DESKTOP, PAGE_HERO_MOBILE } from "utils/pageHeroAssets";

const TITLE_FONT =
  '"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif';

const heroImgSx = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: 0,
  pointerEvents: "none",
};

function LandingPageHero({ title, minHeight, brushBackgroundPosition, titleFontSize, titleSx }) {
  const titleOverlay = (
    <MKBox
      color="white"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        position: "relative",
        zIndex: 1,
        backgroundImage: `url(${brushStroke})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: brushBackgroundPosition,
        width: "40%",
        minHeight: "40vh",
      }}
    >
      <MKTypography
        variant="h3"
        color="white"
        textAlign="center"
        ml={-2}
        fontFamily={TITLE_FONT}
        fontSize={titleFontSize}
        sx={{ mb: { xs: 1, sm: 0 }, ...titleSx }}
      >
        {title}
      </MKTypography>
    </MKBox>
  );

  return (
    <MKBox
      minHeight={minHeight}
      width="100%"
      sx={{
        position: "relative",
        backgroundColor: "#1f2a44",
        backgroundImage: "linear-gradient(135deg, #1a2238 0%, #1f2a44 45%, #2a3658 100%)",
        display: "flex",
        justifyContent: "end",
        alignItems: "end",
        overflow: "hidden",
      }}
    >
      <MKBox
        component="img"
        src={PAGE_HERO_MOBILE}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        sx={{
          ...heroImgSx,
          display: { xs: "block", md: "none" },
          objectPosition: "center top",
        }}
      />
      <MKBox
        component="img"
        src={PAGE_HERO_DESKTOP}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        fetchPriority="low"
        sx={{
          ...heroImgSx,
          display: { xs: "none", md: "block" },
          objectPosition: "left",
        }}
      />
      {titleOverlay}
    </MKBox>
  );
}

LandingPageHero.defaultProps = {
  minHeight: "80vh",
  brushBackgroundPosition: "center",
  titleFontSize: { xs: "1.2rem", sm: "1.875rem" },
  titleSx: undefined,
};

LandingPageHero.propTypes = {
  title: PropTypes.node.isRequired,
  minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  brushBackgroundPosition: PropTypes.string,
  titleFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  titleSx: PropTypes.object,
};

export default LandingPageHero;
