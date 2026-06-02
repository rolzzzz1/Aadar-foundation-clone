// @mui material components
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Carousel from "react-material-ui-carousel";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect, useMemo, useCallback, memo, Suspense, lazy } from "react";

// i18next imports
import { useTranslation } from "react-i18next";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Home page sections - lazy loaded to improve initial load performance
const About = lazy(() => import("pages/Home/sections/Home sections/About"));
const Work = lazy(() => import("pages/Home/sections/Home sections/Work"));
const Events = lazy(() => import("pages/Home/sections/Home sections/Events"));
const Journey = lazy(() => import("pages/Home/sections/Home sections/Journey"));
const Counters = lazy(() => import("pages/Home/sections/Home sections/Counters"));

// IntersectionObserver mount-gate: each below-the-fold section's JS chunk
// + images only start downloading when the section scrolls into view, so
// the hero never has to fight 5 parallel chunk fetches on slow networks.
import LazyVisible from "components/LazyMedia/LazyVisible";

// Routes
import getRoutes from "routes1";
import getFooterRoutes from "footer.routes1";
import { DONATE_PAGE_PATH } from "utils/donation";

// Images
const publicAsset = (path) => `${process.env.PUBLIC_URL || ""}${path}`;
const bgImage = publicAsset("/assets/images/mainThemeImages/brushstroke.svg");
const aadarHindiWhite = publicAsset("/assets/images/aadarHindiWhite.png");
const aadarHindiYellow = publicAsset("/assets/images/aadarHindiYellow.png");

// Icons and controls
import IconButton from "@mui/material/IconButton";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

// Story back background - using public folder to avoid SVG processing issues
import PropTypes from "prop-types";

const blackAndWhiteHeroPng = publicAsset("/assets/images/mainThemeImages/aadar-main-black2.png");
const blackAndWhiteHeroWebp = publicAsset("/assets/images/mainThemeImages/aadar-main-black2.webp");
const blackAndWhiteHero = `image-set(url("${blackAndWhiteHeroWebp}") type("image/webp"), url("${blackAndWhiteHeroPng}") type("image/png"))`;

/** image-set() must not be wrapped in url() — only plain paths use url(). */
function heroBackgroundImage(src) {
  if (
    typeof src === "string" &&
    (src.startsWith("image-set(") ||
      src.startsWith("linear-gradient(") ||
      src.startsWith("radial-gradient("))
  ) {
    return src;
  }
  return `url(${src})`;
}
const slide2MobileBg = publicAsset("/assets/images/mainThemeImages/slide2-mobile-bg.png");
const slide2MobileBgWebp = publicAsset("/assets/images/mainThemeImages/slide2-mobile-bg.webp");
const slide3MobileBg = publicAsset("/assets/images/mainThemeImages/slide3-mobile-bg.png");
const slide3MobileBgWebp = publicAsset("/assets/images/mainThemeImages/slide3-mobile-bg.webp");
const slide4MobileBg = publicAsset("/assets/images/mainThemeImages/slide4-mobile-bg.png");
const slide4MobileBgWebp = publicAsset("/assets/images/mainThemeImages/slide4-mobile-bg.webp");

// Video URLs configuration - import from config file
import { VIDEO_URLS } from "../../config/videoUrls";
import { getHomePageCopy } from "utils/getHomePageCopy";

// Network-aware loading: skip heavy embeds on save-data / 2g / 3g
import { useNetworkSnapshot } from "utils/networkAware";

// Video for slide 2 (Kumbh story - Dadi Mayki), slide 3 (Nirbhay story), and slide 4
// All slides use Vimeo for fast loading
const maykiVimeoId = VIDEO_URLS.maykiVimeo;
const nirbhayVimeoId = VIDEO_URLS.nirbhayVimeo;
const slide4VimeoId = VIDEO_URLS.slide4Vimeo;

// Helper function to get Vimeo embed URL with minimal UI and fast loading
const getVimeoEmbedUrl = (videoId) => {
  if (!videoId) return "";
  // Optimized for fastest loading: 240p quality for instant load
  // Always use preload=auto for faster video loading
  // Note: If video asks to sign in, check Vimeo privacy settings:
  // - Set video privacy to "Public"
  // - Enable embedding to "Anywhere"
  // - Set a content rating
  return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&controls=0&playsinline=1&quality=240p&responsive=1&dnt=1&title=0&byline=0&portrait=0&preload=auto&transparent=0`;
};

function MobileSlidePhoto({ webpSrc, pngSrc, alt, eager }) {
  return (
    <picture
      style={{
        display: "block",
        width: "calc(100% - 10px)",
        height: "calc(100% - 10px)",
        margin: "5px",
        position: "relative",
        zIndex: 10,
      }}
    >
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={pngSrc}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        // eslint-disable-next-line react/no-unknown-property
        fetchPriority={eager ? "high" : "low"}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 40%",
          borderRadius: "12px",
          display: "block",
        }}
      />
    </picture>
  );
}

MobileSlidePhoto.propTypes = {
  webpSrc: PropTypes.string.isRequired,
  pngSrc: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  eager: PropTypes.bool,
};

function SectionSkeleton({ minHeight }) {
  return (
    <MKBox
      aria-hidden
      sx={{
        width: "100%",
        minHeight,
        bgcolor: "rgba(240, 242, 245, 0.6)",
        borderRadius: "8px",
      }}
    />
  );
}

SectionSkeleton.propTypes = {
  minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]).isRequired,
};

const HeroSlide = memo(function HeroSlide({
  image,
  homePage,
  isFirstSlide,
  ctaButtonText,
  slideIndex,
  isActive,
  shouldAnimate,
  isCarouselPaused,
  setIsCarouselPaused,
  activeSlide,
  totalSlides,
  skipHeroVideos,
}) {
  const { t } = useTranslation();

  // Rebuild slide 2: video left + Pacifico heading + yellow/orange gradient background
  const [isParagraphExpanded, setIsParagraphExpanded] = useState(false);

  // Treat very small screens as mobile (we hide hero videos there)
  // Memoize these values to avoid recalculating on every render
  const isMobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 576, []);
  // Hide video for screens between 576px and 767px, show for >= 768px
  const showVideo = useMemo(
    () => typeof window !== "undefined" && window.innerWidth >= 768 && !skipHeroVideos,
    [skipHeroVideos]
  );
  // Check if screen is between 576px and 767px
  const isTabletRange = useMemo(
    () => typeof window !== "undefined" && window.innerWidth >= 576 && window.innerWidth < 768,
    []
  );

  // Use the same special layout for slide 2, slide 3, and slide 4
  if (slideIndex === 1 || slideIndex === 2 || slideIndex === 3) {
    return (
      <MKBox
        display="flex"
        flexDirection={{ xs: "column", sm: "column", md: "row" }}
        height={{ xs: "100vh", sm: "100vh", md: "100vh" }}
        minHeight={{ xs: "100vh", sm: "100vh", md: "100vh" }}
        width="100%"
        sx={{
          position: "relative",
          overflow: { xs: "hidden", md: "hidden" },
          zIndex: 0,
          paddingTop: { xs: "64px", sm: "76px", md: "110px", lg: "120px" },
          paddingBottom: { xs: 8, sm: 8, md: 0 },
          gap: { xs: 1.2, sm: 1.5, md: 1.5, lg: 1.5 },
        }}
      >
        {/* Gradient / pattern background */}
        <MKBox
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(135deg, #ECA533 0%, rgba(255, 200, 87, 0.95) 20%, rgba(236, 165, 51, 0.9) 40%, rgba(255, 215, 100, 0.85) 60%, rgba(236, 165, 51, 0.8) 80%, rgba(255, 200, 87, 0.75) 100%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <MKBox
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255, 255, 255, 0.03) 10px,
                rgba(255, 255, 255, 0.03) 20px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 10px,
                rgba(0, 0, 0, 0.02) 10px,
                rgba(0, 0, 0, 0.02) 20px
              ),
              radial-gradient(
                circle at 20% 50%,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 50%
              ),
              radial-gradient(
                circle at 80% 50%,
                rgba(255, 200, 87, 0.15) 0%,
                transparent 50%
              )
            `,
            backgroundSize: "40px 40px, 40px 40px, 100% 100%, 100% 100%",
            opacity: 0.6,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Video section - left (hidden on small screens and 576-767px) */}
        {showVideo && (
          <MKBox
            className={
              isActive ? `hero-slide-video-${slideIndex} active` : `hero-slide-video-${slideIndex}`
            }
            flex={{ xs: "0 0 auto", sm: "0 0 auto", md: "0 0 55%" }}
            width={{ xs: "100%", sm: "100%", md: "55%" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              position: "relative",
              zIndex: 5,
              padding: { xs: 1, sm: 1.2, md: 2, lg: 2.5 },
              paddingX: { xs: 1.4, sm: 1.8, md: 2, lg: 2.5 },
              height: { xs: "auto", sm: "auto", md: "calc(100vh - 160px)" },
              minHeight: { xs: "220px", sm: "240px", md: "auto" },
            }}
          >
            <MKBox
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: { xs: "92%", sm: "75%", md: "95%", lg: "92%" },
                ml: { xs: 0, sm: 0, md: 4, lg: 5 },
                aspectRatio: { xs: "4/3", sm: "4/3", md: "16/9" },
                maxHeight: { xs: "260px", sm: "240px", md: "none" },
                borderRadius: { xs: "18px", sm: "22px", md: "28px", lg: "32px" },
                overflow: "hidden",
                padding: { xs: "2px", sm: "2px", md: "4px", lg: "4px" },
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(241, 188, 102, 0.9))",
                boxShadow: "0 26px 80px rgba(0, 0, 0, 0.65), 0 14px 32px rgba(0, 0, 0, 0.6)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  borderRadius: "inherit",
                  border: "1px solid rgba(255, 255, 255, 0.65)",
                  pointerEvents: "none",
                  zIndex: 2,
                },
                "&:hover": {
                  transform: "translateY(-6px) scale(1.02)",
                  boxShadow: "0 34px 110px rgba(0, 0, 0, 0.8), 0 18px 44px rgba(0, 0, 0, 0.7)",
                },
              }}
            >
              {/* Video iframes are rendered outside carousel for faster loading */}
              {/* Placeholder to maintain layout - actual videos rendered outside */}
              <MKBox
                sx={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />

              {/* Bottom overlay to hide text */}
              <MKBox
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: { xs: "20%", sm: "22%", md: "25%", lg: "25%" },
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.95) 30%, rgba(0, 0, 0, 0.7) 60%, transparent)",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              />
            </MKBox>
          </MKBox>
        )}

        {/* Text section - right */}
        <MKBox
          flex={{ xs: "0 0 auto", sm: "0 0 auto", md: "0 0 45%" }}
          width={{ xs: "90%", sm: "80%", md: "45%" }}
          display="flex"
          flexDirection="column"
          justifyContent={
            isMobile
              ? "center"
              : isTabletRange
              ? "center"
              : { xs: "center", sm: "center", md: "center" }
          }
          alignItems={{ xs: "center", sm: "center", md: "flex-start" }}
          sx={{
            position: "relative",
            zIndex: 10,
            padding: { xs: 0.8, sm: 0.8, md: 1.6, lg: 1.8 },
            paddingX: { xs: 1.5, sm: 1.5, md: 1.8, lg: 2 },
            paddingTop: { xs: isMobile ? 0 : 0.8, sm: isTabletRange ? 0 : 0.8, md: 1.6, lg: 1.8 },
            paddingBottom: { xs: 0, sm: 0, md: 0 },
            marginTop:
              slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                ? { xs: 2, sm: 2, md: 0 }
                : { xs: 2, sm: 2, md: 0 },
            height: {
              xs: isMobile ? "auto" : "auto",
              sm: isTabletRange ? "auto" : "auto",
              md: "calc(100vh - 160px)",
            },
            maxHeight: {
              xs: isMobile ? "none" : "none",
              sm: isTabletRange ? "none" : "none",
              md: "none",
            },
            minHeight: {
              xs: isMobile ? "calc(100vh - 80px)" : "calc(100vh - 80px)",
              sm: isTabletRange ? "calc(100vh - 80px)" : "calc(100vh - 80px)",
              md: "fit-content",
            },
            overflow: { xs: "visible", sm: "visible", md: "visible" },
            mx: { xs: "auto", sm: "auto", md: 0 },
            mb: { xs: 0, sm: 0, md: 2, lg: 2.5 },
          }}
        >
          {/* Horizontal rectangular image for slide 2 - positioned above text box (on xs and sm screens) */}
          {slideIndex === 1 && isActive && (
            <MKBox
              sx={{
                width: { xs: "90%", sm: "85%", md: 0 },
                maxWidth: { xs: "320px", sm: "400px", md: 0 },
                height: { xs: "200px", sm: "220px", md: 0 },
                minHeight: { xs: "200px", sm: "220px", md: 0 },
                borderRadius: { xs: "16px", sm: "16px", md: 0 },
                overflow: "hidden",
                padding: { xs: "5px", sm: "5px", md: 0 },
                background:
                  "linear-gradient(135deg, #4FA953 0%, #ECA533 25%, #FFD757 50%, #ECA533 75%, #4FA953 100%)",
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(255, 255, 255, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                mb: { xs: 0, sm: 0, md: 0 },
                mt: { xs: 0, sm: 0, md: 0 },
                mx: { xs: "auto", sm: "auto", md: 0 },
                position: "relative",
                zIndex: 12,
                display: {
                  xs: isParagraphExpanded ? "none" : "block",
                  sm: isParagraphExpanded ? "none" : "block",
                  md: "none",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: { xs: "5px", sm: "5px", md: 0 },
                  borderRadius: { xs: "12px", sm: "12px", md: 0 },
                  border: {
                    xs: "2px solid rgba(255, 255, 255, 0.9)",
                    sm: "2px solid rgba(255, 255, 255, 0.9)",
                    md: "none",
                  },
                  zIndex: 1,
                  pointerEvents: "none",
                  backgroundColor: "transparent",
                },
              }}
            >
              <MobileSlidePhoto
                webpSrc={slide2MobileBgWebp}
                pngSrc={slide2MobileBg}
                alt="Aadar Foundation"
                eager={isActive}
              />
            </MKBox>
          )}
          {/* Horizontal rectangular image for slide 3 - positioned above text box (on xs and sm screens) */}
          {slideIndex === 2 && isActive && (
            <MKBox
              sx={{
                width: { xs: "90%", sm: "85%", md: 0 },
                maxWidth: { xs: "320px", sm: "400px", md: 0 },
                height: { xs: "200px", sm: "220px", md: 0 },
                minHeight: { xs: "200px", sm: "220px", md: 0 },
                borderRadius: { xs: "16px", sm: "16px", md: 0 },
                overflow: "hidden",
                padding: { xs: "5px", sm: "5px", md: 0 },
                background:
                  "linear-gradient(135deg, #4FA953 0%, #ECA533 25%, #FFD757 50%, #ECA533 75%, #4FA953 100%)",
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(255, 255, 255, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                mb: { xs: 0, sm: 0, md: 0 },
                mt: { xs: 0, sm: 0, md: 0 },
                mx: { xs: "auto", sm: "auto", md: 0 },
                position: "relative",
                zIndex: 12,
                display: {
                  xs: isParagraphExpanded ? "none" : "block",
                  sm: isParagraphExpanded ? "none" : "block",
                  md: "none",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: { xs: "5px", sm: "5px", md: 0 },
                  borderRadius: { xs: "12px", sm: "12px", md: 0 },
                  border: {
                    xs: "2px solid rgba(255, 255, 255, 0.9)",
                    sm: "2px solid rgba(255, 255, 255, 0.9)",
                    md: "none",
                  },
                  zIndex: 1,
                  pointerEvents: "none",
                  backgroundColor: "transparent",
                },
              }}
            >
              <MobileSlidePhoto
                webpSrc={slide3MobileBgWebp}
                pngSrc={slide3MobileBg}
                alt="Aadar Foundation"
                eager={isActive}
              />
            </MKBox>
          )}
          {/* Horizontal rectangular image for slide 4 - positioned above text box (on xs and sm screens) */}
          {slideIndex === 3 && isActive && (
            <MKBox
              sx={{
                width: { xs: "90%", sm: "85%", md: 0 },
                maxWidth: { xs: "320px", sm: "400px", md: 0 },
                height: { xs: "200px", sm: "220px", md: 0 },
                minHeight: { xs: "200px", sm: "220px", md: 0 },
                borderRadius: { xs: "16px", sm: "16px", md: 0 },
                overflow: "hidden",
                padding: { xs: "5px", sm: "5px", md: 0 },
                background:
                  "linear-gradient(135deg, #4FA953 0%, #ECA533 25%, #FFD757 50%, #ECA533 75%, #4FA953 100%)",
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(255, 255, 255, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                mb: { xs: 0, sm: 0, md: 0 },
                mt: { xs: 0, sm: 0, md: 0 },
                mx: { xs: "auto", sm: "auto", md: 0 },
                position: "relative",
                zIndex: 12,
                display: {
                  xs: isParagraphExpanded ? "none" : "block",
                  sm: isParagraphExpanded ? "none" : "block",
                  md: "none",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: { xs: "5px", sm: "5px", md: 0 },
                  borderRadius: { xs: "12px", sm: "12px", md: 0 },
                  border: {
                    xs: "2px solid rgba(255, 255, 255, 0.9)",
                    sm: "2px solid rgba(255, 255, 255, 0.9)",
                    md: "none",
                  },
                  zIndex: 1,
                  pointerEvents: "none",
                  backgroundColor: "transparent",
                },
              }}
            >
              {/* Same data-saver fallback as slide 2/3: keep just the gradient
                  on slow connections so the page stays responsive. */}
              <MobileSlidePhoto
                webpSrc={slide4MobileBgWebp}
                pngSrc={slide4MobileBg}
                alt="Aadar Foundation"
                eager={isActive}
              />
            </MKBox>
          )}
          <MKBox
            className={
              isActive
                ? `hero-slide-text-box-${slideIndex} active`
                : `hero-slide-text-box-${slideIndex}`
            }
            sx={{
              position: "relative",
              zIndex:
                slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                  ? { xs: 13, sm: 13, md: 10 }
                  : 10,
              marginTop:
                slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                  ? {
                      xs: isParagraphExpanded ? 0 : "-40px",
                      sm: isParagraphExpanded ? 0 : "-44px",
                      md: 0,
                    }
                  : 0,
              padding: { xs: 1, sm: 1, md: 1.6, lg: 1.8 },
              paddingTop: { xs: 1.5, sm: 1.5, md: 2.1, lg: 2.3 },
              paddingBottom: { xs: 0.8, sm: 0.8, md: 1.6, lg: 1.8 },
              paddingRight: { xs: 2.8, sm: 2.8, md: 3.4, lg: 3.6 },
              borderRadius: { xs: "16px", sm: "16px", md: "24px", lg: "28px" },
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(30px)",
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.2), 0 10px 30px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.95)",
              border: {
                xs: "2px solid rgba(255, 255, 255, 0.9)",
                sm: "2px solid rgba(255, 255, 255, 0.9)",
                md: "3px solid rgba(255, 255, 255, 0.9)",
              },
              maxWidth: { xs: "100%", sm: "100%", md: "92%", lg: "90%" },
              mx: { xs: "auto", sm: "auto", md: 0 },
              width: "100%",
              overflow:
                slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                  ? { md: "hidden", lg: "hidden" }
                  : "visible",
              minHeight: { xs: "auto", sm: "auto", md: "fit-content" },
              maxHeight:
                slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                  ? { md: "calc(100vh - 200px)", lg: "calc(100vh - 220px)" }
                  : "none",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* YouTube icon link - positioned in top-right corner, for slide 2, slide 3, and slide 4 */}
            {((slideIndex === 1 && homePage.heroSection.slide2.youtubeUrl) ||
              (slideIndex === 2 && homePage.heroSection.slide3.youtubeUrl) ||
              (slideIndex === 3 &&
                homePage.heroSection.slide4 &&
                homePage.heroSection.slide4.youtubeUrl)) && (
              <Tooltip
                title={t("homePage.heroSection.clickToWatchOnYouTube")}
                arrow
                placement="left"
              >
                <MKBox
                  component="a"
                  href={
                    slideIndex === 1
                      ? homePage.heroSection.slide2.youtubeUrl
                      : slideIndex === 2
                      ? homePage.heroSection.slide3.youtubeUrl
                      : homePage.heroSection.slide4.youtubeUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("homePage.heroSection.watchOnYouTube")}
                  sx={{
                    position: "absolute",
                    // Align vertically with the story heading
                    top: { xs: "8px", sm: "10px", md: "12px", lg: "14px" },
                    right: { xs: "10px", sm: "12px", md: "14px", lg: "16px" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FF0000",
                    textDecoration: "none",
                    opacity: 0.9,
                    zIndex: 50,
                    pointerEvents: "auto",
                    width: { xs: "24px", sm: "26px", md: "28px", lg: "30px" },
                    height: { xs: "24px", sm: "26px", md: "28px", lg: "30px" },
                    minWidth: { xs: "24px", sm: "26px", md: "28px", lg: "30px" },
                    minHeight: { xs: "24px", sm: "26px", md: "28px", lg: "30px" },
                  }}
                >
                  <YouTubeIcon
                    sx={{
                      fontSize: {
                        xs: "24px !important",
                        sm: "26px !important",
                        md: "28px !important",
                        lg: "30px !important",
                      },
                      width: {
                        xs: "24px !important",
                        sm: "26px !important",
                        md: "28px !important",
                        lg: "30px !important",
                      },
                      height: {
                        xs: "24px !important",
                        sm: "26px !important",
                        md: "28px !important",
                        lg: "30px !important",
                      },
                      minWidth: {
                        xs: "24px !important",
                        sm: "26px !important",
                        md: "28px !important",
                        lg: "30px !important",
                      },
                      minHeight: {
                        xs: "24px !important",
                        sm: "26px !important",
                        md: "28px !important",
                        lg: "30px !important",
                      },
                    }}
                  />
                </MKBox>
              </Tooltip>
            )}
            {/* Slide 2 uses slide2 translations, Slide 3 uses slide3 translations */}
            <MKTypography
              className={
                isActive
                  ? `hero-slide-title-${slideIndex} active`
                  : `hero-slide-title-${slideIndex}`
              }
              variant="h2"
              fontWeight="bold"
              sx={{
                fontSize: {
                  xs: "0.85rem",
                  sm: "0.95rem",
                  md: "1.1rem",
                  lg: "1.25rem",
                  xl: "1.4rem",
                },
                mt: { xs: 0, sm: 0, md: 0 },
                mb: { xs: 0.6, sm: 0.8, md: 1, lg: 1.2 },
                color: "#1A1A1A",
                lineHeight: { xs: 1.3, sm: 1.35, md: 1.4, lg: 1.45 },
                wordWrap: "break-word",
                overflowWrap: "break-word",
                fontWeight: 500,
                letterSpacing: { xs: "0.1px", sm: "0.15px", md: "0.2px", lg: "0.25px" },
                fontFamily:
                  '"Pacifico", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
                borderBottom: "3px solid #4FA953",
                paddingBottom: { xs: 0.3, sm: 0.5, md: 0.7, lg: 0.9 },
                paddingTop: { xs: 0, sm: 0, md: 0 },
                display: "inline-block",
                width: "100%",
                textAlign: { xs: "center", sm: "center", md: "left" },
                position: "relative",
                overflow: "visible",
                boxSizing: "border-box",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-4px",
                  left: { xs: "50%", sm: "50%", md: 0 },
                  transform: { xs: "translateX(-50%)", sm: "translateX(-50%)", md: "none" },
                  width: { xs: "80px", sm: "100px", md: "60px" },
                  height: { xs: "3px", sm: "3px", md: "4px" },
                  backgroundColor: "#4FA953",
                  borderRadius: "2px",
                },
              }}
            >
              {slideIndex === 1
                ? homePage.heroSection.slide2.title
                : slideIndex === 2
                ? homePage.heroSection.slide3.title
                : homePage.heroSection.slide4.title}
            </MKTypography>
            <MKTypography
              variant="h5"
              sx={{
                fontSize: {
                  xs: "0.65rem",
                  sm: "0.72rem",
                  md: "0.78rem",
                  lg: "0.85rem",
                  xl: "0.9rem",
                },
                mb: { xs: 0.55, sm: 0.8, md: 1, lg: 1.2 },
                color: "#2A2A2A",
                fontWeight: "500",
                lineHeight: { xs: 1.35, sm: 1.45, md: 1.6 },
                wordWrap: "break-word",
                overflowWrap: "break-word",
                textAlign: { xs: "center", sm: "center", md: "left" },
                fontFamily:
                  '"Pacifico", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
                letterSpacing: { xs: "0.5px", sm: "0.7px", md: "0.9px", lg: "1.1px" },
              }}
            >
              {slideIndex === 1
                ? homePage.heroSection.slide2.subtitle
                : slideIndex === 2
                ? homePage.heroSection.slide3.subtitle
                : homePage.heroSection.slide4.subtitle}
            </MKTypography>
            <MKTypography
              variant="body1"
              sx={{
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.76rem",
                  md: "0.84rem",
                  lg: "0.9rem",
                  xl: "0.94rem",
                },
                mb:
                  slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                    ? { xs: 0.1, sm: 0.1, md: 1.4, lg: 1.6 }
                    : { xs: 0.9, sm: 1.1, md: 1.4, lg: 1.6 },
                color: "#555555",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                textAlign: { xs: "center", sm: "center", md: "left" },
                fontFamily:
                  slideIndex === 1
                    ? '"Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                    : '"Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
                whiteSpace:
                  slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                    ? {
                        xs: isParagraphExpanded ? "normal" : "normal",
                        sm: isParagraphExpanded ? "normal" : "normal",
                        md: "normal",
                      }
                    : "normal",
                overflow:
                  slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                    ? {
                        xs: isParagraphExpanded ? "visible" : "hidden",
                        sm: isParagraphExpanded ? "visible" : "hidden",
                        md: "auto",
                      }
                    : "visible",
                textOverflow:
                  slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                    ? {
                        xs: isParagraphExpanded ? "clip" : "ellipsis",
                        sm: isParagraphExpanded ? "clip" : "ellipsis",
                        md: "clip",
                      }
                    : "clip",
                lineHeight:
                  slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                    ? {
                        xs: isParagraphExpanded ? 1.5 : 1.5,
                        sm: isParagraphExpanded ? 1.55 : 1.55,
                        md: 1.65,
                      }
                    : { xs: 1.5, sm: 1.55, md: 1.65, lg: 1.7 },
                display:
                  slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                    ? {
                        xs: isParagraphExpanded ? "block" : "-webkit-box",
                        sm: isParagraphExpanded ? "block" : "-webkit-box",
                        md: "block",
                      }
                    : "block",
                WebkitLineClamp:
                  slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                    ? {
                        xs: isParagraphExpanded ? "none" : 3,
                        sm: isParagraphExpanded ? "none" : 3,
                        md: "none",
                      }
                    : "none",
                WebkitBoxOrient:
                  slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                    ? {
                        xs: isParagraphExpanded ? "unset" : "vertical",
                        sm: isParagraphExpanded ? "unset" : "vertical",
                        md: "unset",
                      }
                    : "unset",
                width: "100%",
                maxWidth: "100%",
                flex: "1 1 auto",
                overflowY:
                  slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                    ? { md: "auto", lg: "auto" }
                    : "visible",
                minHeight: 0,
              }}
            >
              {slideIndex === 1
                ? homePage.heroSection.slide2.paragraph
                : slideIndex === 2
                ? homePage.heroSection.slide3.paragraph
                : homePage.heroSection.slide4.paragraph}
            </MKTypography>
            {(slideIndex === 1 || slideIndex === 2 || slideIndex === 3) && (
              <MKTypography
                component="button"
                onClick={() => setIsParagraphExpanded(!isParagraphExpanded)}
                sx={{
                  display: { xs: "inline-block", sm: "inline-block", md: "none" },
                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                  color: "#4FA953",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "none",
                  backgroundColor: "transparent !important",
                  border: "none !important",
                  boxShadow: "none !important",
                  padding: 0,
                  marginTop: { xs: 0.1, sm: 0.1 },
                  marginBottom: { xs: 1, sm: 1 },
                  lineHeight: 1.2,
                  textAlign: { xs: "center", sm: "center", md: "left" },
                  width: { xs: "100%", sm: "100%", md: "auto" },
                  "&:hover": {
                    color: "#3d8a41",
                    textDecoration: "none",
                    backgroundColor: "transparent !important",
                    boxShadow: "none !important",
                  },
                  "&:active": {
                    backgroundColor: "transparent !important",
                    boxShadow: "none !important",
                  },
                  "&:focus": {
                    backgroundColor: "transparent !important",
                    outline: "none",
                    boxShadow: "none !important",
                  },
                }}
              >
                {isParagraphExpanded ? "Read less" : "Read more"}
              </MKTypography>
            )}
            <MKButton
              data-hero-button={`slide${slideIndex + 1}`}
              className={
                isActive
                  ? `hero-slide-button-${slideIndex} active`
                  : `hero-slide-button-${slideIndex}`
              }
              variant="contained"
              color="success"
              fullWidth={{ xs: true, sm: false, md: false }}
              ref={(el) => {
                // Directly set styles on DOM element immediately when created
                // This happens before Material-UI can override them
                if (el && typeof window !== "undefined") {
                  const element = el;
                  // Use setProperty with important flag to override any existing styles
                  element.style.setProperty("background-color", "#4FA953", "important");
                  element.style.setProperty("color", "white", "important");
                  element.style.setProperty(
                    "box-shadow",
                    "0 10px 30px rgba(79, 169, 83, 0.35), 0 5px 15px rgba(79, 169, 83, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    "important"
                  );
                  element.style.setProperty("display", "inline-flex", "important");
                  element.style.setProperty("align-items", "center", "important");
                  element.style.setProperty("justify-content", "center", "important");
                  element.style.setProperty("cursor", "pointer", "important");
                  element.style.setProperty("font-weight", "700", "important");
                  element.style.setProperty("border-radius", "12px", "important");
                  element.style.setProperty("position", "relative", "important");
                  element.style.setProperty("overflow", "hidden", "important");
                  // Set padding based on screen size (Material-UI spacing: 8px per unit)
                  const width = window.innerWidth;
                  if (width < 600) {
                    element.style.setProperty("padding", "0.4rem 1.25rem", "important"); // py: 0.8, px: 2.5
                  } else if (width < 768) {
                    element.style.setProperty("padding", "0.4rem 1.25rem", "important"); // py: 0.8, px: 2.5
                  } else if (width < 960) {
                    element.style.setProperty("padding", "0.5rem 1.6rem", "important"); // py: 1, px: 3.2
                  } else if (width < 1280) {
                    element.style.setProperty("padding", "0.6rem 1.75rem", "important"); // py: 1.2, px: 3.5
                  } else {
                    element.style.setProperty("padding", "0.65rem 2rem", "important"); // py: 1.3, px: 4
                  }
                }
              }}
              style={{
                // Critical inline styles that must load immediately (before CSS)
                // Always apply base styles regardless of active state for first load
                backgroundColor: "#4FA953",
                color: "white",
                boxShadow:
                  "0 10px 30px rgba(79, 169, 83, 0.35), 0 5px 15px rgba(79, 169, 83, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontWeight: "700",
                borderRadius: "12px",
                position: "relative",
                overflow: "hidden",
                // Base padding - responsive values will be applied via sx prop after Material-UI loads
                // Material-UI spacing: 8px per unit
                padding:
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? "0.4rem 1.25rem"
                    : typeof window !== "undefined" && window.innerWidth < 960
                    ? "0.5rem 1.6rem"
                    : typeof window !== "undefined" && window.innerWidth < 1280
                    ? "0.6rem 1.75rem"
                    : "0.65rem 2rem",
                // Apply visibility and transform based on state
                ...(isActive
                  ? {
                      opacity: 1,
                      transform: "translateY(0) scale(1)",
                      visibility: "visible",
                      filter: "blur(0)",
                    }
                  : {
                      opacity: 0,
                      transform: "translateY(22px) scale(0.93)",
                      filter: "blur(1.2px)",
                      visibility: "hidden",
                    }),
              }}
              sx={{
                px: { xs: 2.5, sm: 2.5, md: 3.5, lg: 4 },
                py: { xs: 0.8, sm: 0.8, md: 1.2, lg: 1.3 },
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.8rem",
                  md: "0.95rem",
                  lg: "1rem",
                },
                textTransform: "none",
                fontWeight: 700,
                letterSpacing: { xs: "0.3px", sm: "0.4px", md: "0.5px", lg: "0.6px" },
                // Removed backgroundColor, color, boxShadow from sx to prevent Material-UI from overriding inline styles
                borderRadius: { xs: "12px", sm: "14px", md: "16px" },
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&::after": {
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                },
                position: "relative",
                overflow: "hidden",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink:
                  slideIndex === 1 || slideIndex === 2 || slideIndex === 3 ? { md: 0, lg: 0 } : 0,
                marginTop:
                  slideIndex === 1 || slideIndex === 2 || slideIndex === 3
                    ? { md: "auto", lg: "auto" }
                    : 0,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                  transition: "left 0.5s ease",
                },
                "& > *": {
                  color: "white",
                  position: "relative",
                  zIndex: 1,
                },
                "&:hover": {
                  backgroundColor: "#3d8a41",
                  transform: {
                    xs: "translateY(-3px) scale(1.02)",
                    sm: "translateY(-4px) scale(1.02)",
                    md: "translateY(-4px) scale(1.02)",
                  },
                  boxShadow:
                    "0 15px 40px rgba(79, 169, 83, 0.5), 0 8px 20px rgba(79, 169, 83, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                  "&::before": {
                    left: "100%",
                  },
                  "& > *": {
                    color: "white",
                  },
                  "& .button-arrow": {
                    transform: "translateX(4px)",
                  },
                },
                "&:active": {
                  transform: {
                    xs: "translateY(-1px) scale(0.98)",
                    sm: "translateY(-2px) scale(0.98)",
                    md: "translateY(-2px) scale(0.98)",
                  },
                },
              }}
              component={Link}
              to={DONATE_PAGE_PATH}
            >
              <span style={{ color: "white" }}>{t("homePage.heroSection.ctaButtonSlide2")}</span>
              <span
                style={{
                  marginLeft: "0.75rem",
                  display: "inline-block",
                  color: "white",
                  fontWeight: 700,
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.4s ease",
                }}
                className="button-arrow"
              >
                {" >>"}
              </span>
            </MKButton>
          </MKBox>

          {/* Indicators and Pause button for mobile - positioned below text section */}
          {isMobile && slideIndex !== 0 && (
            <MKBox
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: { xs: 1, sm: 1.2 },
                mt: { xs: 2, sm: 2.5 },
                mb: { xs: 1, sm: 1.5 },
                width: "100%",
                zIndex: 25,
                pointerEvents: "auto",
              }}
            >
              {/* Indicators container - left */}
              <MKBox
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <MKBox
                    key={index}
                    onClick={() => {
                      // Navigation is handled by Carousel, this is just visual
                      // The actual navigation happens through Carousel's built-in controls
                    }}
                    sx={{
                      width: activeSlide === index ? 13 : 11,
                      height: activeSlide === index ? 13 : 11,
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor:
                        activeSlide === index
                          ? "rgba(255, 255, 255, 0.9)"
                          : "rgba(255, 255, 255, 0.45)",
                      backgroundColor:
                        activeSlide === index ? "rgba(255, 255, 255, 0.9)" : "transparent",
                      opacity: activeSlide === index ? 0.9 : 0.7,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        opacity: 1,
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                ))}
              </MKBox>

              {/* Pause/Play button - right */}
              <MKBox
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: { xs: 0.75, sm: 1 },
                  justifyContent: "flex-end",
                }}
              >
                <MKTypography
                  sx={{
                    fontSize: { xs: "0.6rem", sm: "0.65rem" },
                    color: "rgba(255, 255, 255, 0.6)",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    fontWeight: 400,
                    letterSpacing: "0.3px",
                    textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(3px)",
                    padding: { xs: "4px 8px", sm: "4px 10px" },
                    borderRadius: "6px",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  {t("homePage.heroSection.pausePlayHint")}
                </MKTypography>
                <Tooltip
                  title={
                    isCarouselPaused
                      ? t("homePage.heroSection.clickForNextStory")
                      : t("homePage.heroSection.clickToHoldStory")
                  }
                  arrow
                  placement="top"
                >
                  <IconButton
                    onClick={() => setIsCarouselPaused((prev) => !prev)}
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.35)",
                      color: "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(3px)",
                      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
                      width: { xs: 40, sm: 44 },
                      height: { xs: 40, sm: 44 },
                      minWidth: { xs: 40, sm: 44 },
                      minHeight: { xs: 40, sm: 44 },
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "rgba(255, 255, 255, 0.9)",
                        transform: "scale(1.05)",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                      },
                      transition: "all 0.25s ease",
                    }}
                    aria-label={
                      isCarouselPaused
                        ? t("homePage.heroSection.playSlides")
                        : t("homePage.heroSection.pauseSlides")
                    }
                  >
                    {isCarouselPaused ? (
                      <PlayArrowIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                    ) : (
                      <PauseIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                    )}
                  </IconButton>
                </Tooltip>
              </MKBox>
            </MKBox>
          )}

          {/* Indicators and Pause button for tablet range (576-767px) - positioned below text section */}
          {isTabletRange && slideIndex !== 0 && (
            <MKBox
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                mt: 2,
                mb: 1.5,
                width: "100%",
                zIndex: 25,
                pointerEvents: "auto",
              }}
            >
              {/* Indicators container - left */}
              <MKBox
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <MKBox
                    key={index}
                    onClick={() => {
                      // Navigation is handled by Carousel, this is just visual
                      // The actual navigation happens through Carousel's built-in controls
                    }}
                    sx={{
                      width: activeSlide === index ? 13 : 11,
                      height: activeSlide === index ? 13 : 11,
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor:
                        activeSlide === index
                          ? "rgba(255, 255, 255, 0.9)"
                          : "rgba(255, 255, 255, 0.45)",
                      backgroundColor:
                        activeSlide === index ? "rgba(255, 255, 255, 0.9)" : "transparent",
                      opacity: activeSlide === index ? 0.9 : 0.7,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        opacity: 1,
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                ))}
              </MKBox>

              {/* Pause/Play button - right */}
              <MKBox
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "flex-end",
                }}
              >
                <MKTypography
                  sx={{
                    fontSize: "0.65rem",
                    color: "rgba(255, 255, 255, 0.6)",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    fontWeight: 400,
                    letterSpacing: "0.3px",
                    textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(3px)",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  {t("homePage.heroSection.pausePlayHint")}
                </MKTypography>
                <Tooltip
                  title={
                    isCarouselPaused
                      ? t("homePage.heroSection.clickForNextStory")
                      : t("homePage.heroSection.clickToHoldStory")
                  }
                  arrow
                  placement="top"
                >
                  <IconButton
                    onClick={() => setIsCarouselPaused((prev) => !prev)}
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.35)",
                      color: "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(3px)",
                      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
                      width: 44,
                      height: 44,
                      minWidth: 44,
                      minHeight: 44,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "rgba(255, 255, 255, 0.9)",
                        transform: "scale(1.05)",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                      },
                      transition: "all 0.25s ease",
                    }}
                    aria-label={
                      isCarouselPaused
                        ? t("homePage.heroSection.playSlides")
                        : t("homePage.heroSection.pauseSlides")
                    }
                  >
                    {isCarouselPaused ? (
                      <PlayArrowIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <PauseIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </Tooltip>
              </MKBox>
            </MKBox>
          )}
        </MKBox>
      </MKBox>
    );
  }

  return (
    <MKBox
      minHeight={{ xs: "100vh", sm: "100vh", md: "100vh" }}
      height={{ xs: "100vh", sm: "100vh", md: "100vh" }}
      width="100%"
      sx={{
        // Prefer a real <img> for the first hero slide so it can be
        // prioritized and counted as the page's LCP element.
        backgroundImage: isFirstSlide
          ? "linear-gradient(135deg, #101826 0%, #1f2a44 55%, #2a3658 100%)"
          : heroBackgroundImage(image),
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top",
        display: "flex",
        justifyContent: { xs: "center", sm: "end" },
        alignItems: "end",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isFirstSlide && (
        <picture
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <source srcSet={blackAndWhiteHeroWebp} type="image/webp" />
          <img
            src={blackAndWhiteHeroPng}
            alt=""
            loading="eager"
            decoding="async"
            // eslint-disable-next-line react/no-unknown-property
            fetchpriority="high"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
              display: "block",
            }}
          />
        </picture>
      )}

      {/* Mobile view - centered */}
      {isFirstSlide && (
        <MKBox
          display={{ xs: "flex", sm: "none" }}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          position="relative"
          zIndex={2}
          sx={{
            mb: { xs: 10, sm: 0 },
          }}
        >
          <MKBox
            component="img"
            src={aadarHindiYellow}
            width={{ xs: "120px", sm: "100px", md: "120px", lg: "120px" }}
            height={{ xs: "120px", sm: "100px", md: "120px", lg: "120px" }}
            display={{ xs: "inline", sm: "none" }}
            mb={2}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            alt="Aadar Foundation Logo"
            sx={{
              filter: { xs: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))", sm: "none" },
              objectFit: "contain",
            }}
          />
          <MKTypography
            color="white"
            textAlign="center"
            fontSize="0.9rem"
            px={1}
            display={{ xs: "inline", sm: "none" }}
            position="relative"
            zIndex={2}
          >
            {homePage.tagLine1} {homePage.tagLine2}
          </MKTypography>
          <MKButton
            variant="contained"
            size="small"
            data-hero-button="slide1-mobile"
            sx={{
              mt: 2,
              mb: 3,
              px: { xs: 3 },
              py: { xs: 0.75 },
              fontWeight: "700",
              fontSize: { xs: "0.8rem", sm: "0.85rem" },
              textTransform: "capitalize",
              borderRadius: "10px",
              backgroundColor: "white",
              color: "#FFC107",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 193, 7, 0.1), transparent)",
                transition: "left 0.5s ease",
              },
              "&:hover": {
                backgroundColor: "#fffef5",
                transform: "translateY(-6px) scale(1.12)",
                boxShadow:
                  "0 20px 50px rgba(255, 193, 7, 0.6), 0 10px 30px rgba(255, 193, 7, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)",
                border: "2px solid rgba(255, 193, 7, 0.5)",
                "&::before": {
                  left: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 193, 7, 0.4), transparent)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 235, 59, 0.15) 100%)",
                  pointerEvents: "none",
                  opacity: 1,
                },
                "& .arrow-icon": {
                  transform: "translateX(8px) scale(1.1)",
                  color: "#FFA000",
                },
                color: "#FFA000",
                fontWeight: "800",
              },
              "&:active": {
                transform: "translateY(-1px) scale(1.02)",
              },
              transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              "&::after": {
                opacity: 0,
                transition: "opacity 0.4s ease",
              },
            }}
            component={Link}
            to={DONATE_PAGE_PATH}
            display={{ xs: "inline-flex", sm: "none" }}
          >
            {ctaButtonText}
            <MKBox
              sx={{
                ml: 0.75,
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <ArrowForwardIcon
                className="arrow-icon"
                sx={{
                  fontSize: { xs: "1.1rem", sm: "1.2rem" },
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.4s ease",
                  color: "#FFC107",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  opacity: 0.85,
                  filter: "blur(2px)",
                }}
              />
              <ArrowForwardIcon
                className="arrow-icon"
                sx={{
                  fontSize: { xs: "1.1rem", sm: "1.2rem" },
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.4s ease",
                  color: "#FFC107",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  opacity: 0.7,
                  filter: "blur(1.4px)",
                }}
              />
              <ArrowForwardIcon
                className="arrow-icon"
                sx={{
                  fontSize: { xs: "1.1rem", sm: "1.2rem" },
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.4s ease",
                  color: "#FFC107",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  opacity: 0.6,
                  filter: "blur(1px)",
                }}
              />
              <ArrowForwardIcon
                className="arrow-icon"
                sx={{
                  fontSize: { xs: "1.1rem", sm: "1.2rem" },
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.4s ease",
                  color: "#FFC107",
                  position: "relative",
                }}
              />
            </MKBox>
          </MKButton>
        </MKBox>
      )}

      {/* Desktop view - positioned on the right */}
      {isFirstSlide && (
        <MKBox
          color="white"
          display={{ xs: "none", sm: "flex" }}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          mr={6}
          mt={{ xs: 3, sm: 3.5, md: 4 }}
          mb={-4}
          className={
            isActive && isFirstSlide
              ? `hero-slide-1-paint-patch active${shouldAnimate ? " should-animate" : ""}`
              : ""
          }
          sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: { xs: "95%", sm: "115%", md: "105%", lg: "110%" },
            backgroundRepeat: "no-repeat",
            backgroundPosition: {
              xs: "left 45%",
              sm: "left 45%",
              md: "-5px 45%",
              lg: "-10px 45%",
            },
            minHeight: { xs: "85vh", sm: "100vh", md: "100vh" },
          }}
          position="relative"
          zIndex={2}
        >
          <MKTypography
            variant="h2"
            color="white"
            textAlign="center"
            ml={-2}
            className={
              isActive && isFirstSlide
                ? `hero-slide-1-text active${shouldAnimate ? " should-animate" : ""}`
                : ""
            }
            fontFamily='"Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
            sx={{ fontSize: { xs: "1.5rem", sm: "1.7rem", md: "2rem", lg: "2rem" } }}
          >
            <MKBox
              component="img"
              src={aadarHindiWhite}
              width={{ xs: "80px", sm: "100px", md: "120px", lg: "120px" }}
              height="auto"
              my={1}
              mb={-2}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              alt="Aadar Foundation Logo"
              sx={{
                aspectRatio: "auto",
              }}
            />
          </MKTypography>
          <MKTypography
            variant="body"
            color="white"
            textAlign="center"
            mt={1}
            ml={-2}
            display="inline-block"
            className={
              isActive && isFirstSlide
                ? `hero-slide-1-text active${shouldAnimate ? " should-animate" : ""}`
                : ""
            }
            fontFamily='"Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
            sx={{ fontSize: { xs: "0.9rem", sm: "1.05rem", md: "1.1rem", lg: "1.3rem" } }}
          >
            {homePage.tagLine1} <br /> {homePage.tagLine2}
          </MKTypography>
          <MKButton
            variant="contained"
            size="small"
            data-hero-button="slide1"
            className={
              isActive && isFirstSlide
                ? `hero-slide-1-button active${shouldAnimate ? " should-animate" : ""}`
                : ""
            }
            ref={(el) => {
              // Directly set styles on DOM element immediately when created
              // This happens before Material-UI can override them
              if (el && typeof window !== "undefined") {
                const element = el;
                // Use setProperty with important flag to override any existing styles
                element.style.setProperty("background-color", "white", "important");
                element.style.setProperty("color", "#FFC107", "important");
                element.style.setProperty(
                  "box-shadow",
                  "0 6px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)",
                  "important"
                );
                element.style.setProperty("display", "inline-flex", "important");
                element.style.setProperty("align-items", "center", "important");
                element.style.setProperty("justify-content", "center", "important");
                element.style.setProperty("cursor", "pointer", "important");
                element.style.setProperty("border-radius", "10px", "important");
                element.style.setProperty("font-weight", "700", "important");
                element.style.setProperty("position", "relative", "important");
                element.style.setProperty("overflow", "hidden", "important");
                // Set padding based on screen size (Material-UI spacing: 8px per unit)
                const width = window.innerWidth;
                if (width < 576) {
                  element.style.setProperty("padding", "0.45rem 1.75rem", "important"); // py: 0.9, px: 3.5
                  element.style.setProperty("margin-top", "1rem", "important"); // mt: 2 = 16px = 1rem
                } else if (width < 768) {
                  element.style.setProperty("padding", "0.4rem 1.5rem", "important"); // py: 0.8, px: 3
                  element.style.setProperty("margin-top", "1.25rem", "important"); // mt: 2.5 = 20px = 1.25rem
                } else if (width < 960) {
                  element.style.setProperty("padding", "0.5rem 2rem", "important"); // py: 1, px: 4
                  element.style.setProperty("margin-top", "1.25rem", "important"); // mt: 2.5 = 20px = 1.25rem
                } else {
                  element.style.setProperty("padding", "0.6rem 2.25rem", "important"); // py: 1.2, px: 4.5
                  element.style.setProperty("margin-top", "1.5rem", "important"); // mt: 3 = 24px = 1.5rem
                }
              }
            }}
            style={{
              // Critical inline styles that must load immediately (before CSS)
              // Always apply base styles regardless of active state for first load
              backgroundColor: "white",
              color: "#FFC107",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              textDecoration: "none",
              borderRadius: "10px",
              fontWeight: "700",
              position: "relative",
              overflow: "hidden",
              // Base padding - responsive values will be applied via sx prop after Material-UI loads
              // Material-UI spacing: 8px per unit, so px: 3.5 = 28px ≈ 1.75rem, py: 0.9 = 7.2px ≈ 0.45rem
              padding:
                typeof window !== "undefined" && window.innerWidth < 576
                  ? "0.45rem 1.75rem"
                  : typeof window !== "undefined" && window.innerWidth < 768
                  ? "0.4rem 1.5rem"
                  : typeof window !== "undefined" && window.innerWidth < 960
                  ? "0.5rem 2rem"
                  : "0.6rem 2.25rem",
              // Margin-top: mt: 2 = 16px = 1rem, mt: 2.5 = 20px = 1.25rem, mt: 3 = 24px = 1.5rem
              marginTop:
                typeof window !== "undefined" && window.innerWidth < 576
                  ? "1rem"
                  : typeof window !== "undefined" && window.innerWidth < 960
                  ? "1.25rem"
                  : "1.5rem",
              // Apply visibility and transform based on state
              // Note: When shouldAnimate is true, let CSS animation handle transform completely
              ...(isActive && isFirstSlide && !shouldAnimate
                ? {
                    opacity: 1,
                    transform: "translateX(0) scale(1)",
                    visibility: "visible",
                  }
                : {}),
              ...(isActive && isFirstSlide && shouldAnimate
                ? {
                    // Don't set transform/opacity inline - let CSS animation handle it completely
                    visibility: "visible",
                  }
                : {}),
              ...(isActive && !isFirstSlide
                ? {
                    opacity: 1,
                    transform: "translateX(0) scale(1)",
                    visibility: "visible",
                  }
                : {}),
              ...(!isActive
                ? {
                    opacity: 0,
                    transform: "translateX(-180px)",
                    visibility: "hidden",
                  }
                : {}),
            }}
            sx={{
              mt: { xs: 2, sm: 2.5, md: 3 },
              ml: -2,
              px: { xs: 3.5, sm: 3, md: 4.5 },
              py: { xs: 0.9, sm: 0.8, md: 1.2 },
              fontWeight: "700",
              fontSize: { xs: "0.85rem", sm: "0.88rem", md: "1rem" },
              textTransform: "capitalize",
              borderRadius: "10px",
              // Removed backgroundColor, color, boxShadow from sx to prevent Material-UI from overriding inline styles
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 193, 7, 0.1), transparent)",
                transition: "left 0.5s ease",
              },
              "&:hover": {
                backgroundColor: "#fffef5",
                transform: "translateY(-6px) scale(1.12)",
                boxShadow:
                  "0 20px 50px rgba(255, 193, 7, 0.6), 0 10px 30px rgba(255, 193, 7, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)",
                border: "2px solid rgba(255, 193, 7, 0.5)",
                "&::before": {
                  left: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 193, 7, 0.4), transparent)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 235, 59, 0.15) 100%)",
                  pointerEvents: "none",
                  opacity: 1,
                },
                "& .arrow-icon": {
                  transform: "translateX(8px) scale(1.1)",
                  color: "#FFA000",
                },
                color: "#FFA000",
                fontWeight: "800",
              },
              "&:active": {
                transform: "translateY(-1px) scale(1.02)",
              },
              transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              "&::after": {
                opacity: 0,
                transition: "opacity 0.4s ease",
              },
            }}
            component={Link}
            to={DONATE_PAGE_PATH}
          >
            {ctaButtonText}
            <MKBox
              sx={{
                ml: 1,
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <ArrowForwardIcon
                className="arrow-icon"
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem" },
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.4s ease",
                  color: "#FFC107",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  opacity: 0.85,
                  filter: "blur(2px)",
                }}
              />
              <ArrowForwardIcon
                className="arrow-icon"
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem" },
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.4s ease",
                  color: "#FFC107",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  opacity: 0.7,
                  filter: "blur(1.4px)",
                }}
              />
              <ArrowForwardIcon
                className="arrow-icon"
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem" },
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.4s ease",
                  color: "#FFC107",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  opacity: 0.6,
                  filter: "blur(1px)",
                }}
              />
              <ArrowForwardIcon
                className="arrow-icon"
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem" },
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.4s ease",
                  color: "#FFC107",
                  position: "relative",
                }}
              />
            </MKBox>
          </MKButton>
        </MKBox>
      )}
    </MKBox>
  );
});

function Home() {
  const { t, i18n } = useTranslation();
  // Memoize routes and footer routes to prevent recreation on every render
  const routes = useMemo(() => getRoutes(t), [t]);
  const footerRoutes = useMemo(() => getFooterRoutes(t), [t]);
  const donateBtn = t("navbar.donateBtn");
  const homePage = useMemo(() => getHomePageCopy(t), [t, i18n.language]);
  const ctaButtonText = t("homePage.heroSection.ctaButton");

  // Network profile — Vimeo skipped only when the browser has save-data enabled.
  const network = useNetworkSnapshot();
  const skipHeroVideos = Boolean(network?.saveData);

  const [isDesktopViewport, setIsDesktopViewport] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );
  useEffect(() => {
    const update = () => setIsDesktopViewport(window.innerWidth >= 768);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const showHeroVimeo = isDesktopViewport && !skipHeroVideos;

  // Slides 2–4 background — dynamic import keeps a large JPG out of the main JS chunk
  const [heroSlideBg, setHeroSlideBg] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      import("assets/images/aboutPageImages/main1.jpg")
        .then((mod) => {
          if (!cancelled) setHeroSlideBg(mod.default);
        })
        .catch(() => {});
    };
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(load, { timeout: 2500 });
      return () => {
        cancelled = true;
        cancelIdleCallback(id);
      };
    }
    const tId = window.setTimeout(load, 800);
    return () => {
      cancelled = true;
      window.clearTimeout(tId);
    };
  }, []);

  // State to let user pause/resume hero slider
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  // State to track video mute status for each slide
  const [videoMutedStates, setVideoMutedStates] = useState({
    slide2: true,
    slide3: true,
    slide4: true,
  });
  // State to control button visibility - only show after video starts loading
  const [showVideoButtons, setShowVideoButtons] = useState({
    slide2: false,
    slide3: false,
    slide4: false,
  });

  // Memoize callbacks to prevent unnecessary re-renders
  const handleSetIsCarouselPaused = useCallback((value) => {
    setIsCarouselPaused(value);
  }, []);
  // Use global flag to persist slide state across remounts for faster navigation
  const [activeSlide, setActiveSlide] = useState(() => {
    return window.__homeActiveSlide ?? 0;
  });
  const [slideInterval, setSlideInterval] = useState(8000);

  // Persist animation flag across remounts using global state
  const [hasPlayedSlide1Animation, setHasPlayedSlide1Animation] = useState(() => {
    return window.__homeHasPlayedAnimation ?? false;
  });
  const animationTimerRef = useRef(null);

  // Save animation state to global on change
  useEffect(() => {
    window.__homeHasPlayedAnimation = hasPlayedSlide1Animation;
  }, [hasPlayedSlide1Animation]);

  // Save active slide to global on change
  useEffect(() => {
    window.__homeActiveSlide = activeSlide;
  }, [activeSlide]);

  // Treat very small screens as mobile (we hide hero videos there)
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 576
  );
  // Check if screen is between 576px and 767px (tablet range)
  const [isTabletRange, setIsTabletRange] = useState(
    typeof window !== "undefined" && window.innerWidth >= 576 && window.innerWidth < 768
  );
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (event) => setReduceMotion(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (isMobile || isTabletRange) {
      setHasPlayedSlide1Animation(true);
    }
  }, [isMobile, isTabletRange]);

  // Update isMobile and isTabletRange on window resize (debounced)
  useEffect(() => {
    let resizeTimeout = null;
    const handleResize = () => {
      // Debounce resize handler to avoid excessive updates
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 576);
        setIsTabletRange(window.innerWidth >= 576 && window.innerWidth < 768);
      }, 150); // Debounce by 150ms
    };
    window.addEventListener("resize", handleResize);
    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Inject critical CSS for CTA buttons into document head on mount
  // This ensures buttons are styled correctly on first load, even before React fully hydrates
  // Inject after Material-UI styles to ensure our styles override them
  useEffect(() => {
    // Only run in browser (not during SSR)
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
    // Avoid heavy DOM observers on mobile; critical CSS is already in index.html.
    if (window.innerWidth < 768) {
      return;
    }

    const styleId = "hero-cta-buttons-critical-css";
    // Check if style already exists - if so, skip (prevents re-injection on remount)
    if (document.getElementById(styleId)) {
      return;
    }

    const injectCriticalCSS = () => {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        /* Critical CSS for CTA buttons - injected after Material-UI to override */
        /* Target by data attributes first (set immediately), then by classes */
        [data-hero-button="slide1"],
        [data-hero-button="slide1-mobile"],
        [data-hero-button="slide1"].MuiButton-root,
        [data-hero-button="slide1-mobile"].MuiButton-root,
        button.hero-slide-1-button.MuiButton-root,
        button.hero-slide-1-button.active.MuiButton-root,
        a.hero-slide-1-button.MuiButton-root,
        a.hero-slide-1-button.active.MuiButton-root,
        button.hero-slide-1-button,
        button.hero-slide-1-button.active,
        a.hero-slide-1-button,
        a.hero-slide-1-button.active {
          background-color: white !important;
          color: #FFC107 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          border-radius: 10px !important;
          font-weight: 700 !important;
          position: relative !important;
          overflow: hidden !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Responsive styles for mobile Help Today button */
        @media (max-width: 599px) {
          [data-hero-button="slide1-mobile"],
          [data-hero-button="slide1-mobile"].MuiButton-root {
            padding: 0.75rem 1.5rem !important;
            font-size: 0.8rem !important;
            margin-top: 1rem !important;
            margin-bottom: 1.5rem !important;
          }
        }
        
        [data-hero-button="slide2"],
        [data-hero-button="slide3"],
        [data-hero-button="slide4"],
        [data-hero-button="slide2"].MuiButton-root,
        [data-hero-button="slide3"].MuiButton-root,
        [data-hero-button="slide4"].MuiButton-root,
        button.hero-slide-button-1.MuiButton-root,
        button.hero-slide-button-2.MuiButton-root,
        button.hero-slide-button-3.MuiButton-root,
        button.hero-slide-button-1.active.MuiButton-root,
        button.hero-slide-button-2.active.MuiButton-root,
        button.hero-slide-button-3.active.MuiButton-root,
        a.hero-slide-button-1.MuiButton-root,
        a.hero-slide-button-2.MuiButton-root,
        a.hero-slide-button-3.MuiButton-root,
        a.hero-slide-button-1.active.MuiButton-root,
        a.hero-slide-button-2.active.MuiButton-root,
        a.hero-slide-button-3.active.MuiButton-root,
        button.hero-slide-button-1,
        button.hero-slide-button-2,
        button.hero-slide-button-3,
        button.hero-slide-button-1.active,
        button.hero-slide-button-2.active,
        button.hero-slide-button-3.active,
        a.hero-slide-button-1,
        a.hero-slide-button-2,
        a.hero-slide-button-3,
        a.hero-slide-button-1.active,
        a.hero-slide-button-2.active,
        a.hero-slide-button-3.active {
          background-color: #4FA953 !important;
          color: white !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          font-weight: 700 !important;
          position: relative !important;
          overflow: hidden !important;
          box-shadow: 0 10px 30px rgba(79, 169, 83, 0.35), 0 5px 15px rgba(79, 169, 83, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
        }
        
        /* Critical CSS for footer aishx.dev logo button - do not override background-image */
        [data-footer-button="aishx"],
        [data-footer-button="aishx"].MuiButton-root,
        button[data-footer-button="aishx"],
        a[data-footer-button="aishx"] {
          cursor: pointer !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-decoration: none !important;
          transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease, border-color 0.2s ease !important;
        }
        [data-footer-button="aishx"]:hover,
        [data-footer-button="aishx"].MuiButton-root:hover,
        button[data-footer-button="aishx"]:hover,
        a[data-footer-button="aishx"]:hover {
          transform: translateY(-2px) !important;
          filter: none !important;
        }
        [data-footer-button="aishx"]:active,
        [data-footer-button="aishx"].MuiButton-root:active,
        button[data-footer-button="aishx"]:active,
        a[data-footer-button="aishx"]:active {
          transform: translateY(0) scale(0.98) !important;
        }
        
        /* Critical CSS for navbar donate button - defaults to mobile for smallest screens */
        [data-navbar-button="donate"],
        [data-navbar-button="donate"].MuiButton-root,
        button[data-navbar-button="donate"],
        a[data-navbar-button="donate"] {
          background-color: #4FA953 !important;
          color: white !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          font-weight: 700 !important;
          position: relative !important;
          overflow: hidden !important;
          border-radius: 10px !important;
          font-size: 0.8rem !important;
          padding: 6px 14px !important;
          box-shadow: 0 6px 20px rgba(79, 169, 83, 0.35), 0 3px 10px rgba(79, 169, 83, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
        }
        
        /* Responsive styles for donate button */
        @media (max-width: 599px) {
          [data-navbar-button="donate"],
          [data-navbar-button="donate"].MuiButton-root,
          button[data-navbar-button="donate"],
          a[data-navbar-button="donate"] {
            padding: 6px 14px !important;
            font-size: 0.8rem !important;
            border-radius: 10px !important;
          }
        }
        @media (min-width: 600px) and (max-width: 959px) {
          [data-navbar-button="donate"],
          [data-navbar-button="donate"].MuiButton-root,
          button[data-navbar-button="donate"],
          a[data-navbar-button="donate"] {
            padding: 8px 20px !important;
            font-size: 0.85rem !important;
            border-radius: 12px !important;
          }
        }
        @media (min-width: 960px) {
          [data-navbar-button="donate"],
          [data-navbar-button="donate"].MuiButton-root,
          button[data-navbar-button="donate"],
          a[data-navbar-button="donate"] {
            padding: 10px 24px !important;
            font-size: 0.95rem !important;
            border-radius: 14px !important;
          }
        }
        
        /* Critical CSS for language selector toggle button */
        .btn-container,
        .btn-container.MKBox-root,
        div.btn-container,
        div.btn-container.MKBox-root,
        [class*="btn-container"],
        [class*="btn-container"].MKBox-root,
        [data-language-selector="true"],
        [data-language-selector="true"].MKBox-root,
        div[data-language-selector="true"],
        div[data-language-selector="true"].MKBox-root {
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          padding: 4px 8px !important;
          transition: all 0.3s ease !important;
          margin-left: -16px !important;
        }
        
        @media (min-width: 600px) {
          .btn-container,
          .btn-container.MKBox-root,
          div.btn-container,
          div.btn-container.MKBox-root,
          [class*="btn-container"],
          [class*="btn-container"].MKBox-root,
          [data-language-selector="true"],
          [data-language-selector="true"].MKBox-root,
          div[data-language-selector="true"],
          div[data-language-selector="true"].MKBox-root {
            gap: 0.75rem !important;
            padding: 4px 10px !important;
          }
        }
        
        @media (min-width: 960px) {
          .btn-container,
          .btn-container.MKBox-root,
          div.btn-container,
          div.btn-container.MKBox-root,
          [class*="btn-container"],
          [class*="btn-container"].MKBox-root,
          [data-language-selector="true"],
          [data-language-selector="true"].MKBox-root,
          div[data-language-selector="true"],
          div[data-language-selector="true"].MKBox-root {
            gap: 1rem !important;
            padding: 6px 12px !important;
          }
        }
      `;
      // Append to end of head to ensure it loads after Material-UI styles
      document.head.appendChild(style);
    };

    // Try to inject immediately
    injectCriticalCSS();

    // Watch for Material-UI style injection and inject our CSS after
    const observer = new MutationObserver((mutations) => {
      let materialUIStylesInjected = false;
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === 1 &&
              (node.tagName === "STYLE" || node.tagName === "LINK") &&
              (node.getAttribute("data-emotion") ||
                node.getAttribute("data-jss") ||
                node.id?.includes("mui") ||
                node.href?.includes("mui"))
            ) {
              materialUIStylesInjected = true;
            }
          });
        }
      });

      if (materialUIStylesInjected) {
        // Material-UI styles detected, inject our CSS after them
        setTimeout(() => {
          if (!document.getElementById(styleId)) {
            injectCriticalCSS();
          } else {
            // Move existing style to end of head to ensure it's after Material-UI
            const existingStyle = document.getElementById(styleId);
            if (existingStyle && existingStyle.parentNode) {
              existingStyle.parentNode.removeChild(existingStyle);
              document.head.appendChild(existingStyle);
            }
          }
        }, 50);
      }
    });

    // Observe head for style/link additions
    observer.observe(document.head, {
      childList: true,
      subtree: false,
    });

    // Also inject after a short delay to ensure Material-UI styles are loaded
    const timeoutId = setTimeout(() => {
      if (!document.getElementById(styleId)) {
        injectCriticalCSS();
      } else {
        // Move to end of head
        const existingStyle = document.getElementById(styleId);
        if (existingStyle && existingStyle.parentNode) {
          existingStyle.parentNode.removeChild(existingStyle);
          document.head.appendChild(existingStyle);
        }
      }
    }, 200);

    // Use requestAnimationFrame to inject after next paint (after Material-UI)
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (!document.getElementById(styleId)) {
          injectCriticalCSS();
        } else {
          // Move to end of head
          const existingStyle = document.getElementById(styleId);
          if (existingStyle && existingStyle.parentNode) {
            existingStyle.parentNode.removeChild(existingStyle);
            document.head.appendChild(existingStyle);
          }
        }
      }, 50);
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      // Cleanup on unmount
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  // Aggressive DOM manipulation to force button styles after Material-UI loads
  // Use a global flag to prevent multiple observers from being set up
  useEffect(() => {
    // Only run in browser (not during SSR)
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
    // Skip on mobile; this observer is expensive and mobile already has inline critical CSS.
    if (window.innerWidth < 768) {
      return;
    }

    // Check if observer is already set up globally (prevents re-setup on remount)
    if (window.__homeButtonStylesObserverSet) {
      return;
    }
    window.__homeButtonStylesObserverSet = true;

    const forceButtonStyles = () => {
      // Find all hero buttons by data attribute or class
      const slide1Buttons = document.querySelectorAll(
        '[data-hero-button="slide1"], .hero-slide-1-button, button.hero-slide-1-button, a.hero-slide-1-button'
      );
      const slide234Buttons = document.querySelectorAll(
        '[data-hero-button="slide2"], [data-hero-button="slide3"], [data-hero-button="slide4"], .hero-slide-button-1, .hero-slide-button-2, .hero-slide-button-3, button.hero-slide-button-1, button.hero-slide-button-2, button.hero-slide-button-3, a.hero-slide-button-1, a.hero-slide-button-2, a.hero-slide-button-3'
      );
      // Find navbar donate buttons
      const navbarButtons = document.querySelectorAll(
        '[data-navbar-button="donate"], button[data-navbar-button="donate"], a[data-navbar-button="donate"]'
      );

      // Force styles on slide 1 button
      slide1Buttons.forEach((btn) => {
        if (btn && btn.style) {
          // Use setProperty with important flag
          btn.style.setProperty("background-color", "white", "important");
          btn.style.setProperty("color", "#FFC107", "important");
          btn.style.setProperty("display", "inline-flex", "important");
          btn.style.setProperty("align-items", "center", "important");
          btn.style.setProperty("justify-content", "center", "important");
          btn.style.setProperty("cursor", "pointer", "important");
          btn.style.setProperty("border-radius", "10px", "important");
          btn.style.setProperty("font-weight", "700", "important");
          btn.style.setProperty("position", "relative", "important");
          btn.style.setProperty("overflow", "hidden", "important");
          btn.style.setProperty(
            "box-shadow",
            "0 6px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)",
            "important"
          );
          // Set padding based on screen size (Material-UI spacing: 8px per unit)
          const width = window.innerWidth;
          if (width < 600) {
            btn.style.setProperty("padding", "0.45rem 1.75rem", "important"); // py: 0.9, px: 3.5
            btn.style.setProperty("margin-top", "1rem", "important"); // mt: 2 = 16px = 1rem
          } else if (width < 960) {
            btn.style.setProperty("padding", "0.5rem 2rem", "important"); // py: 1, px: 4
            btn.style.setProperty("margin-top", "1.25rem", "important"); // mt: 2.5 = 20px = 1.25rem
          } else {
            btn.style.setProperty("padding", "0.6rem 2.25rem", "important"); // py: 1.2, px: 4.5
            btn.style.setProperty("margin-top", "1.5rem", "important"); // mt: 3 = 24px = 1.5rem
          }
        }
      });

      // Force styles on slides 2, 3, 4 buttons
      slide234Buttons.forEach((btn) => {
        if (btn && btn.style) {
          btn.style.setProperty("background-color", "#4FA953", "important");
          btn.style.setProperty("color", "white", "important");
          btn.style.setProperty("display", "inline-flex", "important");
          btn.style.setProperty("align-items", "center", "important");
          btn.style.setProperty("justify-content", "center", "important");
          btn.style.setProperty("cursor", "pointer", "important");
          btn.style.setProperty("font-weight", "700", "important");
          btn.style.setProperty("border-radius", "12px", "important");
          btn.style.setProperty("position", "relative", "important");
          btn.style.setProperty("overflow", "hidden", "important");
          btn.style.setProperty(
            "box-shadow",
            "0 10px 30px rgba(79, 169, 83, 0.35), 0 5px 15px rgba(79, 169, 83, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            "important"
          );
          // Set padding based on screen size (Material-UI spacing: 8px per unit)
          const width2 = window.innerWidth;
          if (width2 < 600) {
            btn.style.setProperty("padding", "0.55rem 1.75rem", "important"); // py: 1.1, px: 3.5
          } else if (width2 < 960) {
            btn.style.setProperty("padding", "0.5rem 1.6rem", "important"); // py: 1, px: 3.2
          } else if (width2 < 1280) {
            btn.style.setProperty("padding", "0.6rem 1.75rem", "important"); // py: 1.2, px: 3.5
          } else {
            btn.style.setProperty("padding", "0.65rem 2rem", "important"); // py: 1.3, px: 4
          }
        }
      });

      // Force styles on navbar donate buttons
      navbarButtons.forEach((btn) => {
        if (btn && btn.style) {
          btn.style.setProperty("background-color", "#4FA953", "important");
          btn.style.setProperty("color", "white", "important");
          btn.style.setProperty("display", "inline-flex", "important");
          btn.style.setProperty("align-items", "center", "important");
          btn.style.setProperty("justify-content", "center", "important");
          btn.style.setProperty("cursor", "pointer", "important");
          btn.style.setProperty("font-weight", "700", "important");
          btn.style.setProperty("border-radius", "12px", "important");
          btn.style.setProperty("position", "relative", "important");
          btn.style.setProperty("overflow", "hidden", "important");
          btn.style.setProperty(
            "box-shadow",
            "0 6px 20px rgba(79, 169, 83, 0.35), 0 3px 10px rgba(79, 169, 83, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            "important"
          );
          // Set padding based on screen size
          const width3 = window.innerWidth;
          if (width3 < 600) {
            btn.style.setProperty("padding", "6px 14px", "important");
          } else if (width3 < 960) {
            btn.style.setProperty("padding", "8px 20px", "important");
          } else {
            btn.style.setProperty("padding", "10px 24px", "important");
          }
        }
      });

      // Footer aishx.dev button: do not force styles - component (footer.routes1) has logo + UI + hover
    };

    // Run immediately
    forceButtonStyles();

    // Run after delays to catch Material-UI style injection
    const timeout1 = setTimeout(forceButtonStyles, 100);
    const timeout2 = setTimeout(forceButtonStyles, 300);
    const timeout3 = setTimeout(forceButtonStyles, 500);
    const timeout4 = setTimeout(forceButtonStyles, 1000);

    // Use MutationObserver to watch for button changes
    const observer = new MutationObserver(() => {
      forceButtonStyles();
    });

    // Observe the entire document for changes
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style"],
      });
    }

    // Also use requestAnimationFrame for immediate next frame
    let raf1Id = null;
    let raf2Id = null;
    if (typeof requestAnimationFrame !== "undefined") {
      raf1Id = requestAnimationFrame(() => {
        forceButtonStyles();
        if (typeof requestAnimationFrame !== "undefined") {
          raf2Id = requestAnimationFrame(forceButtonStyles);
        }
      });
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      if (raf1Id !== null && typeof cancelAnimationFrame !== "undefined") {
        cancelAnimationFrame(raf1Id);
      }
      if (raf2Id !== null && typeof cancelAnimationFrame !== "undefined") {
        cancelAnimationFrame(raf2Id);
      }
      observer.disconnect();
      // Don't reset the flag on unmount - keep it for faster remounts
      // window.__homeButtonStylesObserverSet = false;
    };
  }, []);

  // Set animation flag when slide 1 first becomes active (initial load)
  // Skip if already played (persisted across remounts)
  useEffect(() => {
    if (hasPlayedSlide1Animation) {
      return; // Already played, skip
    }

    if (activeSlide === 0) {
      // Clear any existing timer
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
      // Set flag after animation completes (0.12s delay + 2.5s duration + buffer)
      animationTimerRef.current = setTimeout(() => {
        setHasPlayedSlide1Animation(true);
        window.__homeHasPlayedAnimation = true;
      }, 3000);
    }
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [activeSlide, hasPlayedSlide1Animation]);

  // Calculate interval based on current slide
  // All slides: 8 seconds
  useEffect(() => {
    setSlideInterval(8000); // 8 seconds
  }, [activeSlide]);

  // Refs for video iframes to set fetchpriority attribute and position
  const maykiVideoRef = useRef(null);
  const nirbhayVideoRef = useRef(null);
  const slide4VideoRef = useRef(null);
  const heroCarouselRef = useRef(null);
  const [isHeroInView, setIsHeroInView] = useState(true);

  // Pause hero videos when the hero is not in the viewport.
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      setIsHeroInView(true);
      return undefined;
    }

    const node = heroCarouselRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Consider "in view" only when a meaningful portion is visible.
        setIsHeroInView(Boolean(entry?.isIntersecting) && (entry?.intersectionRatio ?? 0) > 0.12);
      },
      { threshold: [0, 0.12, 0.25] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Warm Vimeo connection once desktop hero videos are enabled.
  useEffect(() => {
    if (!showHeroVimeo || window.__vimeoPreconnectAdded) return undefined;

    const addLink = (rel, href) => {
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    };
    addLink("dns-prefetch", "https://player.vimeo.com");
    addLink("preconnect", "https://player.vimeo.com");
    addLink("preconnect", "https://f.vimeocdn.com");
    window.__vimeoPreconnectAdded = true;

    return undefined;
  }, [showHeroVimeo]);

  // Set fetchpriority attribute on video iframes after mount
  useEffect(() => {
    if (!showHeroVimeo) return;
    if (maykiVideoRef.current) {
      maykiVideoRef.current.setAttribute("fetchpriority", "high");
    }
    if (nirbhayVideoRef.current) {
      nirbhayVideoRef.current.setAttribute("fetchpriority", "high");
    }
    if (slide4VideoRef.current) {
      slide4VideoRef.current.setAttribute("fetchpriority", "high");
    }
  }, [showHeroVimeo]);

  // Play/pause videos when slide changes - immediate control
  useEffect(() => {
    // If the hero isn't visible, keep everything paused.
    if (!isHeroInView) {
      [".hero-video-overlay-1", ".hero-video-overlay-2", ".hero-video-overlay-3"].forEach((sel) => {
        const iframe = document.querySelector(sel);
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ method: "pause" }, "https://player.vimeo.com");
        }
      });
      return;
    }

    // Map of slide indices to video iframe classes
    const videoMap = {
      0: null, // Slide 1 has no video
      1: ".hero-video-overlay-1", // Slide 2
      2: ".hero-video-overlay-2", // Slide 3
      3: ".hero-video-overlay-3", // Slide 4
    };

    // Immediately pause all inactive videos
    Object.entries(videoMap).forEach(([slideIndex, iframeClass]) => {
      if (iframeClass) {
        const iframe = document.querySelector(iframeClass);
        if (iframe && iframe.contentWindow) {
          const isActive = parseInt(slideIndex) === activeSlide;

          if (!isActive) {
            // Immediately pause video for inactive slides
            iframe.contentWindow.postMessage(
              {
                method: "pause",
              },
              "https://player.vimeo.com"
            );
          }
        }
      }
    });

    // Play active video with a small delay to ensure seek completes
    const activeVideoClass = videoMap[activeSlide];
    if (activeVideoClass) {
      const iframe = document.querySelector(activeVideoClass);
      if (iframe && iframe.contentWindow) {
        // Seek to beginning
        iframe.contentWindow.postMessage(
          {
            method: "setCurrentTime",
            value: 0,
          },
          "https://player.vimeo.com"
        );
        // Small delay before playing to ensure seek completes
        setTimeout(() => {
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(
              {
                method: "play",
              },
              "https://player.vimeo.com"
            );
          }
        }, 100);
      }
    }
  }, [activeSlide, isHeroInView]);

  // When the hero leaves the viewport, immediately pause all videos. When it
  // re-enters, resume only the active slide's video (if any).
  useEffect(() => {
    if (!showHeroVimeo) return;

    const pauseAll = () => {
      [".hero-video-overlay-1", ".hero-video-overlay-2", ".hero-video-overlay-3"].forEach((sel) => {
        const iframe = document.querySelector(sel);
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ method: "pause" }, "https://player.vimeo.com");
        }
      });
    };

    if (!isHeroInView) {
      pauseAll();
      return;
    }

    // Resume only the active slide (2/3/4).
    const activeSel =
      activeSlide === 1
        ? ".hero-video-overlay-1"
        : activeSlide === 2
        ? ".hero-video-overlay-2"
        : activeSlide === 3
        ? ".hero-video-overlay-3"
        : null;
    if (!activeSel) return;

    const iframe = document.querySelector(activeSel);
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ method: "play" }, "https://player.vimeo.com");
    }
  }, [isHeroInView, activeSlide, showHeroVimeo]);

  // Show video buttons only after video starts loading (delay to prevent flash)
  useEffect(() => {
    // Hide all buttons initially
    setShowVideoButtons({
      slide2: false,
      slide3: false,
      slide4: false,
    });

    // Show buttons for active slide after video transition starts
    if (activeSlide === 1) {
      // Show buttons after video fade-in has started (600ms delay)
      const timer = setTimeout(() => {
        setShowVideoButtons((prev) => ({ ...prev, slide2: true }));
      }, 600);
      return () => clearTimeout(timer);
    } else if (activeSlide === 2) {
      const timer = setTimeout(() => {
        setShowVideoButtons((prev) => ({ ...prev, slide3: true }));
      }, 600);
      return () => clearTimeout(timer);
    } else if (activeSlide === 3) {
      const timer = setTimeout(() => {
        setShowVideoButtons((prev) => ({ ...prev, slide4: true }));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [activeSlide]);

  // Position video iframes to match video container locations
  useEffect(() => {
    const updateVideoPositions = () => {
      if (typeof window === "undefined" || window.innerWidth < 768) return;

      // Find video containers for each slide (they might be in active or inactive slides)
      const videoContainer1 = document.querySelector(".hero-slide-video-1");
      const videoContainer2 = document.querySelector(".hero-slide-video-2");
      const videoContainer3 = document.querySelector(".hero-slide-video-3");

      // Get the inner video box (the one with the black placeholder background)
      const getInnerVideoBox = (container) => {
        if (!container) return null;
        // Find the box with black background (the placeholder)
        const boxes = container.querySelectorAll('[class*="MuiBox-root"]');
        for (const box of boxes) {
          const computedStyle = window.getComputedStyle(box);
          const bgColor = computedStyle.backgroundColor;
          // Check for black background (can be rgb(0, 0, 0) or rgba(0, 0, 0, ...))
          if (
            bgColor === "rgb(0, 0, 0)" ||
            bgColor === "rgba(0, 0, 0, 1)" ||
            bgColor.startsWith("rgb(0, 0, 0)") ||
            bgColor === "#000" ||
            bgColor === "#000000"
          ) {
            return box;
          }
        }
        // Fallback: return the deepest nested box (usually the video placeholder)
        if (boxes.length > 0) {
          // Find the box that's a direct child of the container with padding
          for (const box of boxes) {
            const parent = box.parentElement;
            if (parent === container || parent?.classList.contains("hero-slide-video")) {
              const style = window.getComputedStyle(box);
              if (style.width === "100%" && style.height === "100%") {
                return box;
              }
            }
          }
          return boxes[boxes.length - 1];
        }
        return null;
      };

      const innerBox1 = getInnerVideoBox(videoContainer1);
      const innerBox2 = getInnerVideoBox(videoContainer2);
      const innerBox3 = getInnerVideoBox(videoContainer3);

      // Get the parent container (MKBox with position: relative) for relative positioning
      // The iframes are children of this container
      const parentContainer =
        maykiVideoRef.current?.parentElement ||
        nirbhayVideoRef.current?.parentElement ||
        slide4VideoRef.current?.parentElement;
      if (!parentContainer) return;

      const parentRect = parentContainer.getBoundingClientRect();

      // Position iframe 1 (slide 2)
      if (maykiVideoRef.current && innerBox1) {
        const rect = innerBox1.getBoundingClientRect();
        maykiVideoRef.current.style.left = `${rect.left - parentRect.left}px`;
        maykiVideoRef.current.style.top = `${rect.top - parentRect.top}px`;
        maykiVideoRef.current.style.width = `${rect.width}px`;
        maykiVideoRef.current.style.height = `${rect.height}px`;
        maykiVideoRef.current.style.borderRadius = window.getComputedStyle(innerBox1).borderRadius;
      }

      // Position iframe 2 (slide 3)
      if (nirbhayVideoRef.current && innerBox2) {
        const rect = innerBox2.getBoundingClientRect();
        nirbhayVideoRef.current.style.left = `${rect.left - parentRect.left}px`;
        nirbhayVideoRef.current.style.top = `${rect.top - parentRect.top}px`;
        nirbhayVideoRef.current.style.width = `${rect.width}px`;
        nirbhayVideoRef.current.style.height = `${rect.height}px`;
        nirbhayVideoRef.current.style.borderRadius =
          window.getComputedStyle(innerBox2).borderRadius;
      }

      // Position iframe 3 (slide 4)
      if (slide4VideoRef.current && innerBox3) {
        const rect = innerBox3.getBoundingClientRect();
        slide4VideoRef.current.style.left = `${rect.left - parentRect.left}px`;
        slide4VideoRef.current.style.top = `${rect.top - parentRect.top}px`;
        slide4VideoRef.current.style.width = `${rect.width}px`;
        slide4VideoRef.current.style.height = `${rect.height}px`;
        slide4VideoRef.current.style.borderRadius = window.getComputedStyle(innerBox3).borderRadius;
      }

      // Position control buttons to match video container locations
      const controls1 = document.querySelector(".hero-video-controls-1");
      const controls2 = document.querySelector(".hero-video-controls-2");
      const controls3 = document.querySelector(".hero-video-controls-3");

      if (controls1 && innerBox1) {
        const rect = innerBox1.getBoundingClientRect();
        // Position pause button at top left
        const pauseBtn1 = controls1.querySelector(".pause-play-btn");
        if (pauseBtn1) {
          pauseBtn1.style.left = `${rect.left - parentRect.left + 8}px`;
          pauseBtn1.style.top = `${rect.top - parentRect.top + 8}px`;
        }
        // Position unmute button at bottom right
        const muteBtn1 = controls1.querySelector(".mute-unmute-btn");
        if (muteBtn1) {
          muteBtn1.style.left = `${rect.right - parentRect.left - 60}px`;
          muteBtn1.style.top = `${rect.bottom - parentRect.top - 60}px`;
        }
      }

      if (controls2 && innerBox2) {
        const rect = innerBox2.getBoundingClientRect();
        // Position pause button at top left
        const pauseBtn2 = controls2.querySelector(".pause-play-btn");
        if (pauseBtn2) {
          pauseBtn2.style.left = `${rect.left - parentRect.left + 8}px`;
          pauseBtn2.style.top = `${rect.top - parentRect.top + 8}px`;
        }
        // Position unmute button at bottom right
        const muteBtn2 = controls2.querySelector(".mute-unmute-btn");
        if (muteBtn2) {
          muteBtn2.style.left = `${rect.right - parentRect.left - 60}px`;
          muteBtn2.style.top = `${rect.bottom - parentRect.top - 60}px`;
        }
      }

      if (controls3 && innerBox3) {
        const rect = innerBox3.getBoundingClientRect();
        // Position pause button at top left
        const pauseBtn3 = controls3.querySelector(".pause-play-btn");
        if (pauseBtn3) {
          pauseBtn3.style.left = `${rect.left - parentRect.left + 8}px`;
          pauseBtn3.style.top = `${rect.top - parentRect.top + 8}px`;
        }
        // Position unmute button at bottom right
        const muteBtn3 = controls3.querySelector(".mute-unmute-btn");
        if (muteBtn3) {
          muteBtn3.style.left = `${rect.right - parentRect.left - 60}px`;
          muteBtn3.style.top = `${rect.bottom - parentRect.top - 60}px`;
        }
      }
    };

    // Update positions on mount and when active slide changes
    // Use multiple timeouts to ensure DOM is ready
    const timeout1 = setTimeout(updateVideoPositions, 100);
    const timeout2 = setTimeout(updateVideoPositions, 300);
    const timeout3 = setTimeout(updateVideoPositions, 600);
    const timeout4 = setTimeout(updateVideoPositions, 1000);

    // Update on window resize with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateVideoPositions, 100);
    };
    window.addEventListener("resize", handleResize);

    // Update when slide changes (with a delay to allow DOM update)
    const slideTimeout = setTimeout(updateVideoPositions, 400);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      clearTimeout(slideTimeout);
      clearTimeout(resizeTimeout);
    };
  }, [activeSlide, showHeroVimeo]);

  // Preload the *next* slide assets without blocking initial paint.
  // Goal: keep slide transitions smooth while improving FCP/LCP.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    // Preload slide background images (cheap, local) after first paint
    const preloadImages = () => {
      const isMobile = window.innerWidth < 768;
      let imageUrls;
      if (isMobile) {
        imageUrls = [
          publicAsset("/assets/images/aadarHindiYellow.png"),
          blackAndWhiteHeroWebp,
          slide2MobileBgWebp,
          slide3MobileBgWebp,
          slide4MobileBgWebp,
        ];
      } else if (heroSlideBg) {
        imageUrls = [blackAndWhiteHeroWebp, blackAndWhiteHeroPng, heroSlideBg];
      } else {
        imageUrls = [blackAndWhiteHeroWebp, blackAndWhiteHeroPng];
      }
      imageUrls.forEach((src) => {
        if (!src) return;
        const img = new Image();
        img.decoding = "async";
        img.loading = "eager";
        if (!isMobile && src === blackAndWhiteHeroWebp) {
          img.fetchPriority = "high";
        }
        img.src = src;
      });
    };

    const imageTimeoutId = window.setTimeout(preloadImages, 0);

    return () => {
      window.clearTimeout(imageTimeoutId);
    };
  }, [blackAndWhiteHeroWebp, blackAndWhiteHeroPng, heroSlideBg]);

  // Hero slides (slide 2, slide 3, and slide 4 share the same special video layout)
  const heroSlides = useMemo(() => {
    const slideBg = heroSlideBg || blackAndWhiteHeroPng;
    // Mobile: WebP only (~225 KB). Desktop: WebP + PNG fallback via image-set.
    const slide1Bg = isDesktopViewport ? blackAndWhiteHero : blackAndWhiteHeroWebp;
    return [{ image: slide1Bg }, { image: slideBg }, { image: slideBg }, { image: slideBg }];
  }, [heroSlideBg, isDesktopViewport]);

  return (
    <MKBox minWidth="320px">
      {/* Navbar component */}
      <DefaultNavbar
        routes={routes}
        action={{
          type: "internal",
          route: DONATE_PAGE_PATH,
          label: donateBtn,
          color: "success",
        }}
        sticky
      />
      {/* Hero Carousel */}
      <MKBox ref={heroCarouselRef} sx={{ position: "relative" }}>
        {/* Desktop Vimeo overlays (hidden on mobile and when save-data is on). */}
        {showHeroVimeo && (
          <>
            {/* Slide 2 video - positioned to match .hero-slide-video-1 */}
            {maykiVimeoId && (
              <iframe
                ref={maykiVideoRef}
                src={getVimeoEmbedUrl(maykiVimeoId)}
                title="Vimeo video player - Slide 2"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                loading="eager"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: activeSlide === 1 ? 1 : 0,
                  visibility: activeSlide === 1 ? "visible" : "hidden",
                  pointerEvents: activeSlide === 1 ? "auto" : "none",
                  zIndex: activeSlide === 1 ? 4 : -1,
                  transform: activeSlide === 1 ? "scale(1)" : "scale(0.99)",
                  filter: activeSlide === 1 ? "blur(0px)" : "blur(1px)",
                  transition: activeSlide === 1 ? "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                  willChange: "opacity, transform, filter",
                }}
                className="hero-video-overlay-1"
              />
            )}
            {/* Slide 3 video - positioned to match .hero-slide-video-2 */}
            {nirbhayVimeoId && (
              <iframe
                ref={nirbhayVideoRef}
                src={getVimeoEmbedUrl(nirbhayVimeoId)}
                title="Vimeo video player - Slide 3"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                loading="eager"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: activeSlide === 2 ? 1 : 0,
                  visibility: activeSlide === 2 ? "visible" : "hidden",
                  pointerEvents: activeSlide === 2 ? "auto" : "none",
                  zIndex: activeSlide === 2 ? 4 : -1,
                  transform: activeSlide === 2 ? "scale(1)" : "scale(0.99)",
                  filter: activeSlide === 2 ? "blur(0px)" : "blur(1px)",
                  transition: activeSlide === 2 ? "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                  willChange: "opacity, transform, filter",
                }}
                className="hero-video-overlay-2"
              />
            )}
            {/* Slide 4 video - positioned to match .hero-slide-video-3 */}
            {slide4VimeoId && (
              <iframe
                ref={slide4VideoRef}
                src={getVimeoEmbedUrl(slide4VimeoId)}
                title="Vimeo video player - Slide 4"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                loading="eager"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: activeSlide === 3 ? 1 : 0,
                  visibility: activeSlide === 3 ? "visible" : "hidden",
                  pointerEvents: activeSlide === 3 ? "auto" : "none",
                  zIndex: activeSlide === 3 ? 4 : -1,
                  transform: activeSlide === 3 ? "scale(1)" : "scale(0.99)",
                  filter: activeSlide === 3 ? "blur(0px)" : "blur(1px)",
                  transition: activeSlide === 3 ? "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                  willChange: "opacity, transform, filter",
                }}
                className="hero-video-overlay-3"
              />
            )}
          </>
        )}

        {/* Pause/Play and Mute/Unmute buttons for slides 2, 3, 4 - positioned above videos */}
        {typeof window !== "undefined" && window.innerWidth >= 768 && (
          <>
            {/* Buttons for slide 2 */}
            {activeSlide === 1 && (
              <MKBox
                className="hero-video-controls-1"
                sx={{
                  position: "absolute",
                  zIndex: 15,
                  pointerEvents: "none",
                  width: "100%",
                  height: "100%",
                  opacity: showVideoButtons.slide2 ? 1 : 0,
                  transition: "opacity 0.3s ease-in",
                }}
              >
                {/* Pause/Play button - top left */}
                <MKBox
                  className="pause-play-btn"
                  sx={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    pointerEvents: "auto",
                  }}
                >
                  <Tooltip
                    title={
                      isCarouselPaused
                        ? t("homePage.heroSection.clickForNextStory")
                        : t("homePage.heroSection.clickToHoldStory")
                    }
                    arrow
                    placement="right"
                  >
                    <IconButton
                      onClick={() => setIsCarouselPaused((prev) => !prev)}
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.35)",
                        color: "rgba(255, 255, 255, 0.7)",
                        backdropFilter: "blur(3px)",
                        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
                        width: 52,
                        height: 52,
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          color: "rgba(255, 255, 255, 0.9)",
                          transform: "scale(1.05)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                        },
                        transition: "all 0.25s ease",
                      }}
                      aria-label={
                        isCarouselPaused
                          ? t("homePage.heroSection.playSlides")
                          : t("homePage.heroSection.pauseSlides")
                      }
                    >
                      {isCarouselPaused ? (
                        <PlayArrowIcon sx={{ fontSize: 24 }} />
                      ) : (
                        <PauseIcon sx={{ fontSize: 24 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                  <MKTypography
                    sx={{
                      fontSize: "0.7rem",
                      color: "rgba(255, 255, 255, 0.8)",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      fontWeight: 400,
                      letterSpacing: "0.3px",
                      textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(3px)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {t("homePage.heroSection.pausePlayHint")}
                  </MKTypography>
                </MKBox>
                {/* Mute/Unmute button - bottom right */}
                <MKBox
                  className="mute-unmute-btn"
                  sx={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    pointerEvents: "auto",
                  }}
                >
                  <Tooltip
                    title={videoMutedStates.slide2 ? "Unmute video" : "Mute video"}
                    arrow
                    placement="left"
                  >
                    <IconButton
                      onClick={() => {
                        setVideoMutedStates((prev) => ({
                          ...prev,
                          slide2: !prev.slide2,
                        }));
                        // Control Vimeo video mute/unmute via postMessage
                        const videoIframe = document.querySelector(".hero-video-overlay-1");
                        if (videoIframe && videoIframe.contentWindow) {
                          videoIframe.contentWindow.postMessage(
                            {
                              method: "setVolume",
                              value: videoMutedStates.slide2 ? 1 : 0,
                            },
                            "https://player.vimeo.com"
                          );
                        }
                      }}
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.35)",
                        color: "rgba(255, 255, 255, 0.7)",
                        backdropFilter: "blur(3px)",
                        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
                        width: 52,
                        height: 52,
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          color: "rgba(255, 255, 255, 0.9)",
                          transform: "scale(1.05)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                        },
                        transition: "all 0.25s ease",
                      }}
                      aria-label={videoMutedStates.slide2 ? "Unmute video" : "Mute video"}
                    >
                      {videoMutedStates.slide2 ? (
                        <VolumeOffIcon sx={{ fontSize: 24 }} />
                      ) : (
                        <VolumeUpIcon sx={{ fontSize: 24 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </MKBox>
              </MKBox>
            )}
            {/* Buttons for slide 3 */}
            {activeSlide === 2 && (
              <MKBox
                className="hero-video-controls-2"
                sx={{
                  position: "absolute",
                  zIndex: 15,
                  pointerEvents: "none",
                  width: "100%",
                  height: "100%",
                  opacity: showVideoButtons.slide3 ? 1 : 0,
                  transition: "opacity 0.3s ease-in",
                }}
              >
                {/* Pause/Play button - top left */}
                <MKBox
                  className="pause-play-btn"
                  sx={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    pointerEvents: "auto",
                  }}
                >
                  <Tooltip
                    title={
                      isCarouselPaused
                        ? t("homePage.heroSection.clickForNextStory")
                        : t("homePage.heroSection.clickToHoldStory")
                    }
                    arrow
                    placement="right"
                  >
                    <IconButton
                      onClick={() => setIsCarouselPaused((prev) => !prev)}
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.35)",
                        color: "rgba(255, 255, 255, 0.7)",
                        backdropFilter: "blur(3px)",
                        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
                        width: 52,
                        height: 52,
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          color: "rgba(255, 255, 255, 0.9)",
                          transform: "scale(1.05)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                        },
                        transition: "all 0.25s ease",
                      }}
                      aria-label={
                        isCarouselPaused
                          ? t("homePage.heroSection.playSlides")
                          : t("homePage.heroSection.pauseSlides")
                      }
                    >
                      {isCarouselPaused ? (
                        <PlayArrowIcon sx={{ fontSize: 24 }} />
                      ) : (
                        <PauseIcon sx={{ fontSize: 24 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                  <MKTypography
                    sx={{
                      fontSize: "0.7rem",
                      color: "rgba(255, 255, 255, 0.8)",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      fontWeight: 400,
                      letterSpacing: "0.3px",
                      textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(3px)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {t("homePage.heroSection.pausePlayHint")}
                  </MKTypography>
                </MKBox>
                {/* Mute/Unmute button - bottom right */}
                <MKBox
                  className="mute-unmute-btn"
                  sx={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    pointerEvents: "auto",
                  }}
                >
                  <Tooltip
                    title={videoMutedStates.slide3 ? "Unmute video" : "Mute video"}
                    arrow
                    placement="left"
                  >
                    <IconButton
                      onClick={() => {
                        setVideoMutedStates((prev) => ({
                          ...prev,
                          slide3: !prev.slide3,
                        }));
                        // Control Vimeo video mute/unmute via postMessage
                        const videoIframe = document.querySelector(".hero-video-overlay-2");
                        if (videoIframe && videoIframe.contentWindow) {
                          videoIframe.contentWindow.postMessage(
                            {
                              method: "setVolume",
                              value: videoMutedStates.slide3 ? 1 : 0,
                            },
                            "https://player.vimeo.com"
                          );
                        }
                      }}
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.35)",
                        color: "rgba(255, 255, 255, 0.7)",
                        backdropFilter: "blur(3px)",
                        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
                        width: 52,
                        height: 52,
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          color: "rgba(255, 255, 255, 0.9)",
                          transform: "scale(1.05)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                        },
                        transition: "all 0.25s ease",
                      }}
                      aria-label={videoMutedStates.slide3 ? "Unmute video" : "Mute video"}
                    >
                      {videoMutedStates.slide3 ? (
                        <VolumeOffIcon sx={{ fontSize: 24 }} />
                      ) : (
                        <VolumeUpIcon sx={{ fontSize: 24 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </MKBox>
              </MKBox>
            )}
            {/* Buttons for slide 4 */}
            {activeSlide === 3 && (
              <MKBox
                className="hero-video-controls-3"
                sx={{
                  position: "absolute",
                  zIndex: 15,
                  pointerEvents: "none",
                  width: "100%",
                  height: "100%",
                  opacity: showVideoButtons.slide4 ? 1 : 0,
                  transition: "opacity 0.3s ease-in",
                }}
              >
                {/* Pause/Play button - top left */}
                <MKBox
                  className="pause-play-btn"
                  sx={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    pointerEvents: "auto",
                  }}
                >
                  <Tooltip
                    title={
                      isCarouselPaused
                        ? t("homePage.heroSection.clickForNextStory")
                        : t("homePage.heroSection.clickToHoldStory")
                    }
                    arrow
                    placement="right"
                  >
                    <IconButton
                      onClick={() => setIsCarouselPaused((prev) => !prev)}
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.35)",
                        color: "rgba(255, 255, 255, 0.7)",
                        backdropFilter: "blur(3px)",
                        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
                        width: 52,
                        height: 52,
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          color: "rgba(255, 255, 255, 0.9)",
                          transform: "scale(1.05)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                        },
                        transition: "all 0.25s ease",
                      }}
                      aria-label={
                        isCarouselPaused
                          ? t("homePage.heroSection.playSlides")
                          : t("homePage.heroSection.pauseSlides")
                      }
                    >
                      {isCarouselPaused ? (
                        <PlayArrowIcon sx={{ fontSize: 24 }} />
                      ) : (
                        <PauseIcon sx={{ fontSize: 24 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                  <MKTypography
                    sx={{
                      fontSize: "0.7rem",
                      color: "rgba(255, 255, 255, 0.8)",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      fontWeight: 400,
                      letterSpacing: "0.3px",
                      textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(3px)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {t("homePage.heroSection.pausePlayHint")}
                  </MKTypography>
                </MKBox>
                {/* Mute/Unmute button - bottom right */}
                <MKBox
                  className="mute-unmute-btn"
                  sx={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    pointerEvents: "auto",
                  }}
                >
                  <Tooltip
                    title={videoMutedStates.slide4 ? "Unmute video" : "Mute video"}
                    arrow
                    placement="left"
                  >
                    <IconButton
                      onClick={() => {
                        setVideoMutedStates((prev) => ({
                          ...prev,
                          slide4: !prev.slide4,
                        }));
                        // Control Vimeo video mute/unmute via postMessage
                        const videoIframe = document.querySelector(".hero-video-overlay-3");
                        if (videoIframe && videoIframe.contentWindow) {
                          videoIframe.contentWindow.postMessage(
                            {
                              method: "setVolume",
                              value: videoMutedStates.slide4 ? 1 : 0,
                            },
                            "https://player.vimeo.com"
                          );
                        }
                      }}
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.35)",
                        color: "rgba(255, 255, 255, 0.7)",
                        backdropFilter: "blur(3px)",
                        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
                        width: 52,
                        height: 52,
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          color: "rgba(255, 255, 255, 0.9)",
                          transform: "scale(1.05)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                        },
                        transition: "all 0.25s ease",
                      }}
                      aria-label={videoMutedStates.slide4 ? "Unmute video" : "Mute video"}
                    >
                      {videoMutedStates.slide4 ? (
                        <VolumeOffIcon sx={{ fontSize: 24 }} />
                      ) : (
                        <VolumeUpIcon sx={{ fontSize: 24 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </MKBox>
              </MKBox>
            )}
          </>
        )}

        {/* Custom styles for carousel navigation arrows - blur on hover/click */}
        <style>
          {`
            /* Critical CSS for CTA buttons - must load first for Vercel */
            /* Target by data attributes first (set immediately), then by classes */
            [data-hero-button="slide1"],
            [data-hero-button="slide1"].MuiButton-root,
            button.hero-slide-1-button.MuiButton-root,
            button.hero-slide-1-button.active.MuiButton-root,
            a.hero-slide-1-button.MuiButton-root,
            a.hero-slide-1-button.active.MuiButton-root,
            button.hero-slide-1-button,
            button.hero-slide-1-button.active,
            a.hero-slide-1-button,
            a.hero-slide-1-button.active {
              background-color: white !important;
              color: #FFC107 !important;
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              cursor: pointer !important;
              border-radius: 10px !important;
              font-weight: 700 !important;
              position: relative !important;
              overflow: hidden !important;
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            }
            
            [data-hero-button="slide2"],
            [data-hero-button="slide3"],
            [data-hero-button="slide4"],
            [data-hero-button="slide2"].MuiButton-root,
            [data-hero-button="slide3"].MuiButton-root,
            [data-hero-button="slide4"].MuiButton-root,
            button.hero-slide-button-1.MuiButton-root,
            button.hero-slide-button-2.MuiButton-root,
            button.hero-slide-button-3.MuiButton-root,
            button.hero-slide-button-1.active.MuiButton-root,
            button.hero-slide-button-2.active.MuiButton-root,
            button.hero-slide-button-3.active.MuiButton-root,
            a.hero-slide-button-1.MuiButton-root,
            a.hero-slide-button-2.MuiButton-root,
            a.hero-slide-button-3.MuiButton-root,
            a.hero-slide-button-1.active.MuiButton-root,
            a.hero-slide-button-2.active.MuiButton-root,
            a.hero-slide-button-3.active.MuiButton-root,
            button.hero-slide-button-1,
            button.hero-slide-button-2,
            button.hero-slide-button-3,
            button.hero-slide-button-1.active,
            button.hero-slide-button-2.active,
            button.hero-slide-button-3.active,
            a.hero-slide-button-1,
            a.hero-slide-button-2,
            a.hero-slide-button-3,
            a.hero-slide-button-1.active,
            a.hero-slide-button-2.active,
            a.hero-slide-button-3.active {
              background-color: #4FA953 !important;
              color: white !important;
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              cursor: pointer !important;
              font-weight: 700 !important;
              position: relative !important;
              overflow: hidden !important;
              box-shadow: 0 10px 30px rgba(79, 169, 83, 0.35), 0 5px 15px rgba(79, 169, 83, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
            }
            
            /* Critical CSS for footer aishx.dev logo button - do not override background-image */
            [data-footer-button="aishx"],
            [data-footer-button="aishx"].MuiButton-root,
            button[data-footer-button="aishx"],
            a[data-footer-button="aishx"] {
              cursor: pointer !important;
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              text-decoration: none !important;
              transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease, border-color 0.2s ease !important;
            }
            [data-footer-button="aishx"]:hover,
            [data-footer-button="aishx"].MuiButton-root:hover,
            button[data-footer-button="aishx"]:hover,
            a[data-footer-button="aishx"]:hover {
              transform: translateY(-2px) !important;
              filter: none !important;
            }
            [data-footer-button="aishx"]:active,
            [data-footer-button="aishx"].MuiButton-root:active,
            button[data-footer-button="aishx"]:active,
            a[data-footer-button="aishx"]:active {
              transform: translateY(0) scale(0.98) !important;
            }
            
            /* Target carousel navigation buttons */
            .MuiIconButton-root[aria-label*="Next"]:hover,
            .MuiIconButton-root[aria-label*="Previous"]:hover,
            button[aria-label*="Next"]:hover,
            button[aria-label*="Previous"]:hover {
              background-color: rgba(255, 255, 255, 0.2) !important;
              backdrop-filter: blur(8px) !important;
              -webkit-backdrop-filter: blur(8px) !important;
            }
            .MuiIconButton-root[aria-label*="Next"]:active,
            .MuiIconButton-root[aria-label*="Previous"]:active,
            button[aria-label*="Next"]:active,
            button[aria-label*="Previous"]:active {
              background-color: rgba(255, 255, 255, 0.3) !important;
              backdrop-filter: blur(10px) !important;
              -webkit-backdrop-filter: blur(10px) !important;
            }
            
            /* Hero Section Transition Animations */
            @keyframes heroFadeIn {
              0% {
                opacity: 0;
                transform: scale(1.08) translateY(30px);
                filter: blur(8px);
              }
              50% {
                opacity: 0.6;
                transform: scale(1.02) translateY(10px);
                filter: blur(3px);
              }
              100% {
                opacity: 1;
                transform: scale(1) translateY(0);
                filter: blur(0);
              }
            }
            
            @keyframes heroFadeOut {
              0% {
                opacity: 1;
                transform: scale(1) translateY(0);
                filter: blur(0);
              }
              50% {
                opacity: 0.4;
                transform: scale(0.98) translateY(-10px);
                filter: blur(3px);
              }
              100% {
                opacity: 0;
                transform: scale(0.92) translateY(-30px);
                filter: blur(8px);
              }
            }
            
            @keyframes heroSlideIn {
              from {
                opacity: 0;
                transform: translateX(50px) scale(0.95);
                filter: brightness(0.7) blur(5px);
              }
              to {
                opacity: 1;
                transform: translateX(0) scale(1);
                filter: brightness(1) blur(0);
              }
            }
            
            @keyframes heroSlideOut {
              from {
                opacity: 1;
                transform: translateX(0) scale(1);
                filter: brightness(1) blur(0);
              }
              to {
                opacity: 0;
                transform: translateX(-50px) scale(0.95);
                filter: brightness(0.7) blur(5px);
              }
            }
            
            /* Apply smooth transitions to carousel container */
            .react-material-ui-carousel {
              overflow: hidden;
              position: relative;
            }
            
            /* Enhanced fade transition with depth effect */
            .react-material-ui-carousel .MuiPaper-root {
              transition: opacity 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                          transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                          filter 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              will-change: opacity, transform, filter;
            }
            
            /* Incoming slide animation */
            .react-material-ui-carousel .MuiPaper-root[class*="active"] {
              animation: heroFadeIn 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            
            /* Outgoing slide animation */
            .react-material-ui-carousel .MuiPaper-root:not([class*="active"]) {
              animation: heroFadeOut 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            
            /* Smooth transitions for all carousel children */
            .react-material-ui-carousel > div {
              transition: opacity 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                          transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            /* Position video overlay iframes - positioned dynamically via JavaScript */
            iframe.hero-video-overlay-1,
            iframe.hero-video-overlay-2,
            iframe.hero-video-overlay-3 {
              position: absolute !important;
              border-radius: 28px !important;
              overflow: hidden !important;
            }
            
            @media (min-width: 1200px) {
              iframe.hero-video-overlay-1,
              iframe.hero-video-overlay-2,
              iframe.hero-video-overlay-3 {
                border-radius: 32px !important;
              }
            }
            
            /* Ensure video elements transition smoothly */
            .react-material-ui-carousel video {
              transition: opacity 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                          transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            /* Smooth image transitions */
            .react-material-ui-carousel img {
              transition: opacity 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                          transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            /* Slide 1 - Smooth Left to Right Animations */
            @keyframes slideInFromLeftSmooth {
              0% {
                opacity: 0;
                transform: translateX(-200px);
              }
              15% {
                opacity: 0.3;
              }
              100% {
                opacity: 1;
                transform: translateX(0);
              }
            }
            
            @keyframes slideInFromLeftText {
              0% {
                opacity: 0;
                transform: translateX(-180px);
              }
              15% {
                opacity: 0.3;
              }
              100% {
                opacity: 1;
                transform: translateX(0);
              }
            }
            
            @keyframes slideInFromBottom {
              0% {
                opacity: 0;
                transform: translateY(60px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes slideInFromLeftButton {
              0% {
                opacity: 0;
                transform: translateX(-180px) scale(0.96);
              }
              15% {
                opacity: 0.3;
              }
              100% {
                opacity: 1;
                transform: translateX(0) scale(1);
              }
            }
            
            /* Apply animations to slide 1 elements when active and should animate - smooth continuous motion */
            .hero-slide-1-paint-patch.active.should-animate {
              animation: slideInFromLeftSmooth 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s forwards !important;
              will-change: transform, opacity;
            }
            
            /* Ensure paint patch animation works on small screens */
            @media (max-width: 767px) {
              .hero-slide-1-paint-patch.active.should-animate {
                animation: slideInFromLeftSmooth 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s forwards !important;
                will-change: transform, opacity;
              }
            }
            
            .hero-slide-1-text.active.should-animate {
              animation: slideInFromLeftText 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.12s forwards !important;
              will-change: transform, opacity;
            }
            
            /* Ensure animation works on all screen sizes including small screens */
            @media (max-width: 767px) {
              .hero-slide-1-text.active.should-animate {
                animation: slideInFromLeftText 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.12s forwards !important;
                will-change: transform, opacity;
              }
            }
            
            @media (max-width: 575px) {
              .hero-slide-1-text.active.should-animate {
                animation: slideInFromLeftText 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.12s forwards !important;
                will-change: transform, opacity;
              }
            }
            
            /* Initial state - elements start completely hidden and far to the left */
            .hero-slide-1-paint-patch:not(.active) {
              opacity: 0;
              transform: translateX(-200px);
              transition: none;
            }
            
            .hero-slide-1-text:not(.active) {
              opacity: 0;
              transform: translateX(-180px);
              transition: none;
            }
            
            .hero-slide-1-button:not(.active) {
              opacity: 0;
              transform: translateX(-180px) scale(0.96);
              transition: none;
            }
            
            /* When slide is active but animation shouldn't play (returning to slide 1), show elements immediately */
            .hero-slide-1-paint-patch.active:not(.should-animate) {
              opacity: 1 !important;
              transform: translateX(0) !important;
              animation: none !important;
            }
            
            .hero-slide-1-text.active:not(.should-animate) {
              opacity: 1 !important;
              transform: translateX(0) !important;
              animation: none !important;
            }
            
            .hero-slide-1-button.active:not(.should-animate) {
              opacity: 1 !important;
              transform: translateX(0) scale(1) !important;
              animation: none !important;
            }
            
            /* Help Today Button Continuous Animations */
            @keyframes buttonPulse {
              0%, 100% {
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(255, 193, 7, 0.4);
              }
              50% {
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 8px rgba(255, 193, 7, 0);
              }
            }
            
            @keyframes arrowMove {
              0%, 100% {
                transform: translateX(0);
              }
              50% {
                transform: translateX(3px);
              }
            }
            
            @keyframes buttonGlow {
              0%, 100% {
                filter: drop-shadow(0 0 0 rgba(255, 193, 7, 0));
              }
              50% {
                filter: drop-shadow(0 0 8px rgba(255, 193, 7, 0.6));
              }
            }
            
            @keyframes buttonFloat {
              0%, 100% {
                transform: translateX(0) translateY(0) scale(1);
              }
              50% {
                transform: translateX(0) translateY(-12px) scale(1);
              }
            }
            
            /* Apply continuous animations after slide-in animation completes */
            /* For button without initial animation (returning to slide 1) */
            .hero-slide-1-button.active:not(.should-animate) {
              animation: buttonPulse 3s ease-in-out infinite, 
                         buttonGlow 2.5s ease-in-out infinite,
                         buttonFloat 3s ease-in-out infinite !important;
            }
            
            /* For button with initial animation - start continuous animations after slide-in */
            /* Force YouTube icon size in slides 2, 3, 4 - target by video container classes and general selectors */
            .hero-slide-video-1 svg.MuiSvgIcon-root[data-testid="YouTubeIcon"],
            .hero-slide-video-2 svg.MuiSvgIcon-root[data-testid="YouTubeIcon"],
            .hero-slide-video-3 svg.MuiSvgIcon-root[data-testid="YouTubeIcon"],
            .hero-slide-video-1 a[aria-label*="YouTube"] svg,
            .hero-slide-video-2 a[aria-label*="YouTube"] svg,
            .hero-slide-video-3 a[aria-label*="YouTube"] svg,
            /* Also target by parent slide container */
            [class*="hero-slide"] a[aria-label*="YouTube"] svg,
            [class*="hero-slide"] svg[data-testid="YouTubeIcon"] {
              font-size: 24px !important;
              width: 24px !important;
              height: 24px !important;
              min-width: 24px !important;
              min-height: 24px !important;
            }
            @media (min-width: 600px) {
              .hero-slide-video-1 svg.MuiSvgIcon-root[data-testid="YouTubeIcon"],
              .hero-slide-video-2 svg.MuiSvgIcon-root[data-testid="YouTubeIcon"],
              .hero-slide-video-3 svg.MuiSvgIcon-root[data-testid="YouTubeIcon"],
              .hero-slide-video-1 a[aria-label*="YouTube"] svg,
              .hero-slide-video-2 a[aria-label*="YouTube"] svg,
              .hero-slide-video-3 a[aria-label*="YouTube"] svg,
              [class*="hero-slide"] a[aria-label*="YouTube"] svg,
              [class*="hero-slide"] svg[data-testid="YouTubeIcon"] {
                font-size: 26px !important;
                width: 26px !important;
                height: 26px !important;
                min-width: 26px !important;
                min-height: 26px !important;
              }
            }
            @media (min-width: 900px) {
              .hero-slide-video-1 svg.MuiSvgIcon-root[data-testid="YouTubeIcon"],
              .hero-slide-video-2 svg.MuiSvgIcon-root[data-testid="YouTubeIcon"],
              .hero-slide-video-3 svg.MuiSvgIcon-root[data-testid="YouTubeIcon"],
              .hero-slide-video-1 a[aria-label*="YouTube"] svg,
              .hero-slide-video-2 a[aria-label*="YouTube"] svg,
              .hero-slide-video-3 a[aria-label*="YouTube"] svg,
              [class*="hero-slide"] a[aria-label*="YouTube"] svg,
              [class*="hero-slide"] svg[data-testid="YouTubeIcon"] {
                font-size: 28px !important;
                width: 28px !important;
                height: 28px !important;
                min-width: 28px !important;
                min-height: 28px !important;
              }
            }
            @media (min-width: 1200px) {
              .hero-slide-video-1 svg.MuiSvgIcon-root[data-testid="YouTubeIcon"],
              .hero-slide-video-2 svg.MuiSvgIcon-root[data-testid="YouTubeIcon"],
              .hero-slide-video-3 svg.MuiSvgIcon-root[data-testid="YouTubeIcon"],
              .hero-slide-video-1 a[aria-label*="YouTube"] svg,
              .hero-slide-video-2 a[aria-label*="YouTube"] svg,
              .hero-slide-video-3 a[aria-label*="YouTube"] svg,
              [class*="hero-slide"] a[aria-label*="YouTube"] svg,
              [class*="hero-slide"] svg[data-testid="YouTubeIcon"] {
                font-size: 30px !important;
                width: 30px !important;
                height: 30px !important;
                min-width: 30px !important;
                min-height: 30px !important;
              }
            }
            
            .hero-slide-1-button.active.should-animate {
              /* Use exact same animation as text for perfect synchronization */
              opacity: 0 !important;
              transform: translateX(-180px) !important;
              transition: none !important;
              visibility: visible !important;
              animation: slideInFromLeftText 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.12s forwards,
                         buttonPulse 3s ease-in-out infinite 2.62s,
                         buttonGlow 2.5s ease-in-out infinite 2.62s,
                         buttonFloat 3s ease-in-out infinite 2.62s !important;
              will-change: transform, opacity;
            }
            
            /* Ensure button animation works on small screens */
            @media (max-width: 767px) {
              .hero-slide-1-button.active.should-animate {
                animation: slideInFromLeftText 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.12s forwards,
                           buttonPulse 3s ease-in-out infinite 2.62s,
                           buttonGlow 2.5s ease-in-out infinite 2.62s,
                           buttonFloat 3s ease-in-out infinite 2.62s !important;
              }
            }
            
            /* Arrow animation for Help Today button - starts after slide-in completes */
            .hero-slide-1-button.active .arrow-icon {
              animation: arrowMove 2s ease-in-out infinite;
            }
            
            .hero-slide-1-button.active.should-animate .arrow-icon {
              animation: arrowMove 2s ease-in-out infinite 2.62s;
            }
            
            /* Slides 2, 3, 4 - Ultra Smooth Hero Effects */
            @keyframes slideInFromLeftEnhanced {
              0% {
                opacity: 0;
                transform: translateX(-40px) translateY(6px) scale(0.97) rotateY(-3deg);
                filter: blur(2.5px) brightness(0.8);
              }
              8% {
                opacity: 0.15;
                transform: translateX(-30px) translateY(4.5px) scale(0.975) rotateY(-2.3deg);
                filter: blur(2.2px) brightness(0.82);
              }
              16% {
                opacity: 0.28;
                transform: translateX(-22px) translateY(3.2px) scale(0.98) rotateY(-1.7deg);
                filter: blur(1.9px) brightness(0.84);
              }
              24% {
                opacity: 0.42;
                transform: translateX(-16px) translateY(2.2px) scale(0.985) rotateY(-1.2deg);
                filter: blur(1.6px) brightness(0.86);
              }
              32% {
                opacity: 0.55;
                transform: translateX(-11px) translateY(1.5px) scale(0.988) rotateY(-0.8deg);
                filter: blur(1.3px) brightness(0.88);
              }
              42% {
                opacity: 0.68;
                transform: translateX(-7px) translateY(1px) scale(0.992) rotateY(-0.5deg);
                filter: blur(1px) brightness(0.9);
              }
              52% {
                opacity: 0.78;
                transform: translateX(-4px) translateY(0.6px) scale(0.995) rotateY(-0.3deg);
                filter: blur(0.7px) brightness(0.92);
              }
              64% {
                opacity: 0.86;
                transform: translateX(-2px) translateY(0.3px) scale(0.997) rotateY(-0.15deg);
                filter: blur(0.4px) brightness(0.94);
              }
              76% {
                opacity: 0.92;
                transform: translateX(-0.8px) translateY(0.15px) scale(0.9985) rotateY(-0.08deg);
                filter: blur(0.25px) brightness(0.96);
              }
              88% {
                opacity: 0.97;
                transform: translateX(-0.3px) translateY(0.05px) scale(0.9995) rotateY(-0.03deg);
                filter: blur(0.1px) brightness(0.98);
              }
              100% {
                opacity: 1;
                transform: translateX(0) translateY(0) scale(1) rotateY(0deg);
                filter: blur(0) brightness(1);
              }
            }
            
            @keyframes slideInFromRightEnhanced {
              0% {
                opacity: 0;
                transform: translateX(40px) translateY(6px) scale(0.97) rotateY(3deg);
                filter: blur(2.5px) brightness(0.8);
              }
              8% {
                opacity: 0.15;
                transform: translateX(30px) translateY(4.5px) scale(0.975) rotateY(2.3deg);
                filter: blur(2.2px) brightness(0.82);
              }
              16% {
                opacity: 0.28;
                transform: translateX(22px) translateY(3.2px) scale(0.98) rotateY(1.7deg);
                filter: blur(1.9px) brightness(0.84);
              }
              24% {
                opacity: 0.42;
                transform: translateX(16px) translateY(2.2px) scale(0.985) rotateY(1.2deg);
                filter: blur(1.6px) brightness(0.86);
              }
              32% {
                opacity: 0.55;
                transform: translateX(11px) translateY(1.5px) scale(0.988) rotateY(0.8deg);
                filter: blur(1.3px) brightness(0.88);
              }
              42% {
                opacity: 0.68;
                transform: translateX(7px) translateY(1px) scale(0.992) rotateY(0.5deg);
                filter: blur(1px) brightness(0.9);
              }
              52% {
                opacity: 0.78;
                transform: translateX(4px) translateY(0.6px) scale(0.995) rotateY(0.3deg);
                filter: blur(0.7px) brightness(0.92);
              }
              64% {
                opacity: 0.86;
                transform: translateX(2px) translateY(0.3px) scale(0.997) rotateY(0.15deg);
                filter: blur(0.4px) brightness(0.94);
              }
              76% {
                opacity: 0.92;
                transform: translateX(0.8px) translateY(0.15px) scale(0.9985) rotateY(0.08deg);
                filter: blur(0.25px) brightness(0.96);
              }
              88% {
                opacity: 0.97;
                transform: translateX(0.3px) translateY(0.05px) scale(0.9995) rotateY(0.03deg);
                filter: blur(0.1px) brightness(0.98);
              }
              100% {
                opacity: 1;
                transform: translateX(0) translateY(0) scale(1) rotateY(0deg);
                filter: blur(0) brightness(1);
              }
            }
            
            @keyframes fadeInUpEnhanced {
              0% {
                opacity: 0;
                transform: translateY(22px) scale(0.93);
                filter: blur(1.2px);
              }
              8% {
                opacity: 0.15;
                transform: translateY(18px) scale(0.935);
                filter: blur(1px);
              }
              16% {
                opacity: 0.28;
                transform: translateY(14px) scale(0.94);
                filter: blur(0.85px);
              }
              24% {
                opacity: 0.42;
                transform: translateY(11px) scale(0.945);
                filter: blur(0.7px);
              }
              32% {
                opacity: 0.55;
                transform: translateY(8px) scale(0.95);
                filter: blur(0.6px);
              }
              42% {
                opacity: 0.68;
                transform: translateY(5px) scale(0.96);
                filter: blur(0.45px);
              }
              52% {
                opacity: 0.78;
                transform: translateY(3px) scale(0.97);
                filter: blur(0.3px);
              }
              64% {
                opacity: 0.86;
                transform: translateY(1.5px) scale(0.985);
                filter: blur(0.2px);
              }
              76% {
                opacity: 0.92;
                transform: translateY(0.6px) scale(0.992);
                filter: blur(0.1px);
              }
              88% {
                opacity: 0.97;
                transform: translateY(0.2px) scale(0.996);
                filter: blur(0.05px);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
              }
            }
            
            /* Video container animations for slides 2, 3, 4 - one smooth wave */
            .hero-slide-video-1.active,
            .hero-slide-video-2.active,
            .hero-slide-video-3.active {
              animation: slideInFromLeftEnhanced 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s both;
              will-change: transform, opacity, filter;
              transform-style: preserve-3d;
            }
            
            .hero-slide-video-1:not(.active),
            .hero-slide-video-2:not(.active),
            .hero-slide-video-3:not(.active) {
              opacity: 0;
              transform: translateX(-40px) translateY(6px) scale(0.97) rotateY(-3deg);
              filter: blur(2.5px) brightness(0.8);
            }
            
            /* Text box animations for slides 2, 3, 4 - one smooth wave */
            .hero-slide-text-box-1.active,
            .hero-slide-text-box-2.active,
            .hero-slide-text-box-3.active {
              animation: slideInFromRightEnhanced 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s both;
              will-change: transform, opacity, filter;
              transform-style: preserve-3d;
            }
            
            .hero-slide-text-box-1:not(.active),
            .hero-slide-text-box-2:not(.active),
            .hero-slide-text-box-3:not(.active) {
              opacity: 0;
              transform: translateX(40px) translateY(6px) scale(0.97) rotateY(3deg);
              filter: blur(2.5px) brightness(0.8);
            }
            
            /* Title and button animations - one smooth wave */
            .hero-slide-title-1.active,
            .hero-slide-title-2.active,
            .hero-slide-title-3.active {
              animation: fadeInUpEnhanced 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s both;
              will-change: transform, opacity, filter;
              /* Animation handles the transition - 'both' fill-mode ensures final state is maintained */
              /* Inline styles in sx prop ensure visibility before CSS loads */
            }
            
            .hero-slide-button-1.active,
            .hero-slide-button-2.active,
            .hero-slide-button-3.active {
              animation: fadeInUpEnhanced 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s both;
              will-change: transform, opacity, filter;
              /* Animation handles the transition, this ensures visibility after animation completes */
              /* The 'both' fill-mode ensures the final state (opacity: 1) is maintained */
            }
            
            /* Title initial states for slides 2, 3, 4 */
            .hero-slide-title-1:not(.active),
            .hero-slide-title-2:not(.active),
            .hero-slide-title-3:not(.active) {
              opacity: 0;
              transform: translateY(22px) scale(0.93);
              filter: blur(1.2px);
            }
            
            /* Ensure title is hidden before animation starts (only when not active) */
            .hero-slide-title-1:not(.active),
            .hero-slide-title-2:not(.active),
            .hero-slide-title-3:not(.active) {
              opacity: 0;
              transform: translateY(22px) scale(0.93);
              filter: blur(1.2px);
            }
            
            /* Button initial states for slides 2, 3, 4 - only when not active */
            .hero-slide-button-1:not(.active),
            .hero-slide-button-2:not(.active),
            .hero-slide-button-3:not(.active) {
              opacity: 0;
              transform: translateY(22px) scale(0.93);
              filter: blur(1.2px);
            }
            
            /* Button active state - animation handles the transition */
            /* Inline styles in sx prop ensure visibility before CSS loads */
            /* The animation rule above handles the transition with 'both' fill-mode */
            
          `}
        </style>

        {/* Pause/Play hero slider (small button near indicators) - only for slide 1 */}
        {activeSlide === 0 && !isMobile && (
          <MKBox
            sx={{
              position: "absolute",
              bottom: "72px",
              right: { xs: "16px", sm: "22px", md: "28px" },
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Tooltip
              title={
                isCarouselPaused
                  ? t("homePage.heroSection.clickForNextStory")
                  : t("homePage.heroSection.clickToHoldStory")
              }
              arrow
              placement="top"
            >
              <IconButton
                onClick={() => setIsCarouselPaused((prev) => !prev)}
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  color: "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(3px)",
                  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
                  width: { xs: 28, sm: 32, md: 36 },
                  height: { xs: 28, sm: 32, md: 36 },
                  minWidth: { xs: 28, sm: 32, md: 36 },
                  minHeight: { xs: 28, sm: 32, md: 36 },
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "rgba(255, 255, 255, 0.8)",
                    transform: "scale(1.05)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                  },
                  transition: "all 0.25s ease",
                }}
                aria-label={
                  isCarouselPaused
                    ? t("homePage.heroSection.playSlides")
                    : t("homePage.heroSection.pauseSlides")
                }
              >
                {isCarouselPaused ? (
                  <PlayArrowIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />
                ) : (
                  <PauseIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />
                )}
              </IconButton>
            </Tooltip>
            <MKTypography
              sx={{
                fontSize: { xs: "0.4rem", sm: "0.45rem", md: "0.5rem" },
                color: "rgba(255, 255, 255, 0.35)",
                textAlign: "center",
                whiteSpace: "normal",
                maxWidth: { xs: "90px", sm: "100px", md: "120px" },
                lineHeight: 1.3,
                fontWeight: 400,
                letterSpacing: "0.3px",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(3px)",
                padding: { xs: "3px 5px", sm: "3px 6px", md: "4px 8px" },
                borderRadius: "6px",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              {t("homePage.heroSection.pausePlayHint")}
            </MKTypography>
          </MKBox>
        )}

        <Carousel
          animation="fade"
          duration={reduceMotion ? 0 : isMobile || isTabletRange ? 350 : 650}
          indicators={!isMobile && !isTabletRange}
          navButtonsAlwaysVisible={true}
          navButtonsAlwaysInvisible={false}
          cycleNavigation={true}
          fullHeightHover={false}
          swipe={true}
          autoPlay={!isCarouselPaused}
          index={activeSlide}
          onChange={(now) => {
            setActiveSlide(now);
            window.__homeActiveSlide = now;
            // Track first time slide 1 is shown (only on initial page load)
            if (now === 0 && !hasPlayedSlide1Animation) {
              setHasPlayedSlide1Animation(true);
              window.__homeHasPlayedAnimation = true;
            }
          }}
          interval={slideInterval}
          stopAutoPlayOnHover={false}
          indicatorContainerProps={{
            style: {
              position: "absolute",
              bottom: "72px",
              left: "16px",
              transform: "none",
              zIndex: 10,
              display: "flex",
              gap: 8,
              paddingLeft: "0",
              pointerEvents: "auto",
              width: "auto",
              margin: 0,
            },
          }}
          indicatorIconButtonProps={{
            disableRipple: true,
            style: {
              padding: 4,
              margin: 0,
              color: "rgba(255, 255, 255, 0.45)",
              border: "2px solid rgba(255, 255, 255, 0.45)",
              width: 11,
              height: 11,
              opacity: 0.7,
            },
          }}
          activeIndicatorIconButtonProps={{
            style: {
              color: "rgba(255, 255, 255, 0.9)",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(255, 255, 255, 0.9)",
              width: 13,
              height: 13,
              opacity: 0.9,
            },
          }}
          navButtonsProps={{
            style: {
              backgroundColor: "transparent",
              backdropFilter: "none",
              opacity: 0.9,
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              transition: "all 0.3s ease",
            },
          }}
          NextIcon={
            <span
              style={{
                color: "white",
                fontSize: "1.9rem",
                fontWeight: "700",
                textShadow: "0 3px 10px rgba(0, 0, 0, 0.8)",
              }}
            >
              ›
            </span>
          }
          PrevIcon={
            <span
              style={{
                color: "white",
                fontSize: "1.9rem",
                fontWeight: "700",
                textShadow: "0 3px 10px rgba(0, 0, 0, 0.8)",
              }}
            >
              ‹
            </span>
          }
        >
          {heroSlides.map((slide, index) => (
            <HeroSlide
              key={index}
              image={slide.image}
              homePage={homePage}
              isFirstSlide={index === 0}
              ctaButtonText={ctaButtonText}
              slideIndex={index}
              isActive={activeSlide === index}
              shouldAnimate={
                index === 0 &&
                !hasPlayedSlide1Animation &&
                !isMobile &&
                !isTabletRange &&
                !reduceMotion
              }
              isCarouselPaused={isCarouselPaused}
              setIsCarouselPaused={handleSetIsCarouselPaused}
              activeSlide={activeSlide}
              totalSlides={heroSlides.length}
              skipHeroVideos={skipHeroVideos}
            />
          ))}
        </Carousel>
      </MKBox>

      {/* Main section */}
      <Card
        sx={{
          p: 2,
          pb: { xs: 4, sm: 8 },
          mx: { xs: 2, lg: 3 },
          mt: { xs: -2, sm: -4, md: -6 },
          mb: { xs: 2, sm: 4 },
          position: "relative",
          zIndex: 10,
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => ({
            xs: rgba(white.main, 0.96),
            md: rgba(white.main, 0.8),
          }),
          backdropFilter: { xs: "none", md: "saturate(200%) blur(30px)" },
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <MKBox
          sx={{
            contentVisibility: "auto",
            containIntrinsicSize: "0 720px",
            minHeight: { xs: 720, sm: 640, md: 560, lg: 520 },
          }}
        >
          <LazyVisible rootMargin="500px" minHeight={520}>
            <Suspense fallback={<SectionSkeleton minHeight={520} />}>
              <About />
            </Suspense>
          </LazyVisible>
        </MKBox>
        <MKBox
          sx={{
            contentVisibility: "auto",
            containIntrinsicSize: "0 620px",
            minHeight: { xs: 620, sm: 500, md: 360, lg: 340 },
          }}
        >
          <LazyVisible rootMargin="500px" minHeight={340}>
            <Suspense fallback={<SectionSkeleton minHeight={340} />}>
              <Counters />
            </Suspense>
          </LazyVisible>
        </MKBox>
        <MKBox
          sx={{
            contentVisibility: "auto",
            containIntrinsicSize: "0 560px",
            minHeight: { xs: 560, sm: 540, md: 520, lg: 500 },
          }}
        >
          <LazyVisible rootMargin="500px" minHeight={500}>
            <Suspense fallback={<SectionSkeleton minHeight={500} />}>
              <Journey />
            </Suspense>
          </LazyVisible>
        </MKBox>
        <MKBox
          sx={{
            contentVisibility: "auto",
            containIntrinsicSize: "0 1100px",
            minHeight: { xs: 1500, sm: 1100, md: 780, lg: 700 },
          }}
        >
          <LazyVisible rootMargin="500px" minHeight={700}>
            <Suspense fallback={<SectionSkeleton minHeight={700} />}>
              <Work />
            </Suspense>
          </LazyVisible>
        </MKBox>
        <MKBox
          sx={{
            contentVisibility: "auto",
            containIntrinsicSize: "0 820px",
            minHeight: { xs: 900, sm: 820, md: 720, lg: 680 },
          }}
        >
          <LazyVisible rootMargin="500px" minHeight={680}>
            <Suspense fallback={<SectionSkeleton minHeight={680} />}>
              <Events />
            </Suspense>
          </LazyVisible>
        </MKBox>
      </Card>

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

// Typechecking props for HeroSlide
HeroSlide.propTypes = {
  image: PropTypes.string.isRequired,
  homePage: PropTypes.object.isRequired,
  isFirstSlide: PropTypes.bool.isRequired,
  ctaButtonText: PropTypes.string.isRequired,
  slideIndex: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  shouldAnimate: PropTypes.bool,
  isCarouselPaused: PropTypes.bool.isRequired,
  setIsCarouselPaused: PropTypes.func.isRequired,
  activeSlide: PropTypes.number.isRequired,
  totalSlides: PropTypes.number.isRequired,
  skipHeroVideos: PropTypes.bool,
};

// Memoize Home component to prevent unnecessary re-renders when navigating back
export default memo(Home);
