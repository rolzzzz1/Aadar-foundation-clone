// @mui material components
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Carousel from "react-material-ui-carousel";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

// i18next imports
import { useTranslation } from "react-i18next";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Home page sections
import About from "pages/Home/sections/Home sections/About";
import Work from "pages/Home/sections/Home sections/Work";
import Events from "pages/Home/sections/Home sections/Events";
import Journey from "pages/Home/sections/Home sections/Journey";
import Counters from "pages/Home/sections/Home sections/Counters";

// Routes
import getRoutes from "routes1";
import getFooterRoutes from "footer.routes1";

// Images
import bgImage from "assets/images/mainThemeImages/brushstroke.svg";
import aadarHindiWhite from "assets/images/aadarHindiWhite.png";
import aadarHindiYellow from "assets/images/aadarHindiYellow.png";

// Icons and controls
import IconButton from "@mui/material/IconButton";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// Story back background - using public folder to avoid SVG processing issues
import PropTypes from "prop-types";

// Additional hero images for carousel
import blackAndWhiteHero from "assets/images/mainThemeImages/aadar-main-black2.png";
import heroImage2 from "assets/images/aboutPageImages/main1.jpg";

// Video for slide 2 (Kumbh story - Dadi Mayki), slide 3 (Nirbhay story), and slide 4
// Videos are loaded from Cloudinary CDN
const maykiVideo = "https://res.cloudinary.com/ds07nbwgq/video/upload/v1764692316/Mayki_v8ewvq.mp4";
const nirbhayVideo =
  "https://res.cloudinary.com/ds07nbwgq/video/upload/v1764692322/Nirbhay_ei8puy.mp4";
const slide4Video = "https://res.cloudinary.com/ds07nbwgq/video/upload/v1764760343/Baba_p4tnj9.mp4"; // Add your video link here for slide 4

function HeroSlide({ image, homePage, isFirstSlide, ctaButtonText, slideIndex, isActive }) {
  const { t } = useTranslation();

  // Rebuild slide 2: video left + Pacifico heading + yellow/orange gradient background
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Treat very small screens as mobile (we hide hero videos there)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 576;

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Ensure video plays when its slide is active
  useEffect(() => {
    if (
      !videoRef.current ||
      !isActive ||
      isMobile ||
      !(slideIndex === 1 || slideIndex === 2 || slideIndex === 3)
    ) {
      return;
    }

    const video = videoRef.current;

    const tryPlay = async () => {
      try {
        // Ensure video is muted based on state
        video.muted = isMuted;
        await video.play();
      } catch (error) {
        console.log("Video autoplay prevented:", error);
        // Retry after a short delay
        setTimeout(() => {
          video.play().catch(() => {});
        }, 100);
      }
    };

    // Check if video is ready to play
    if (video.readyState >= 3) {
      // Video can play through
      tryPlay();
    } else if (video.readyState >= 2) {
      // Video has enough data to begin playback
      tryPlay();
    } else {
      // Wait for video to load
      const handleCanPlay = () => {
        tryPlay();
      };
      const handleLoadedData = () => {
        tryPlay();
      };

      video.addEventListener("canplay", handleCanPlay, { once: true });
      video.addEventListener("loadeddata", handleLoadedData, { once: true });

      return () => {
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("loadeddata", handleLoadedData);
      };
    }
  }, [isActive, isMuted]);

  // Use the same special layout for slide 2, slide 3, and slide 4
  if (slideIndex === 1 || slideIndex === 2 || slideIndex === 3) {
    return (
      <MKBox
        display="flex"
        flexDirection={{ xs: "column", sm: "column", md: "row" }}
        height={{ xs: "auto", sm: "auto", md: "100vh" }}
        minHeight={{ xs: "100vh", sm: "100vh", md: "100vh" }}
        width="100%"
        sx={{
          position: "relative",
          overflow: { xs: "auto", md: "hidden" },
          zIndex: 0,
          paddingTop: { xs: "64px", sm: "76px", md: "110px", lg: "120px" },
          paddingBottom: { xs: 2.2, sm: 2.6, md: 0 },
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

        {/* Video section - left (hidden on small screens) */}
        {!isMobile && (
          <MKBox
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
              <video
                key={`video-${slideIndex}`}
                ref={videoRef}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                poster={heroImage2}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 15%",
                  backgroundColor: "#000",
                  display: "block",
                }}
                onError={(e) => {
                  // Fallback to image if video fails to load
                  e.target.style.display = "none";
                  const img = document.createElement("img");
                  img.src = heroImage2;
                  img.style.width = "100%";
                  img.style.height = "100%";
                  img.style.objectFit = "cover";
                  e.target.parentElement.appendChild(img);
                }}
              >
                <source
                  src={
                    slideIndex === 1
                      ? maykiVideo
                      : slideIndex === 2
                      ? nirbhayVideo
                      : slide4Video || nirbhayVideo
                  }
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

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

              <IconButton
                onClick={toggleMute}
                sx={{
                  position: "absolute",
                  bottom: { xs: "12px", sm: "16px", md: "20px", lg: "24px" },
                  right: { xs: "12px", sm: "16px", md: "20px", lg: "24px" },
                  backgroundColor: "rgba(0, 0, 0, 0.75)",
                  color: "white",
                  zIndex: 3,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(8px)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    transform: "scale(1.1)",
                  },
                  width: { xs: "42px", sm: "46px", md: "50px", lg: "54px" },
                  height: { xs: "42px", sm: "46px", md: "50px", lg: "54px" },
                  transition: "all 0.3s ease",
                }}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <VolumeOffIcon
                    sx={{
                      fontSize: { xs: "24px", sm: "26px", md: "28px", lg: "30px" },
                      color: "#FFFFFF",
                    }}
                  />
                ) : (
                  <VolumeUpIcon
                    sx={{
                      fontSize: { xs: "24px", sm: "26px", md: "28px", lg: "30px" },
                      color: "#FFFFFF",
                    }}
                  />
                )}
              </IconButton>
            </MKBox>
          </MKBox>
        )}

        {/* Text section - right */}
        <MKBox
          flex={{ xs: "0 0 auto", sm: "0 0 auto", md: "0 0 45%" }}
          width={{ xs: "100%", sm: "80%", md: "45%" }}
          display="flex"
          flexDirection="column"
          justifyContent={isMobile ? "center" : { xs: "center", sm: "center", md: "center" }}
          alignItems={{ xs: "center", sm: "center", md: "flex-start" }}
          sx={{
            position: "relative",
            zIndex: 10,
            padding: { xs: 1.1, sm: 1.5, md: 1.6, lg: 1.8 },
            paddingX: { xs: 1.8, sm: 2.1, md: 1.8, lg: 2 },
            paddingTop: { xs: isMobile ? 0 : 1.1, sm: 1.5, md: 1.6, lg: 1.8 },
            height: { xs: isMobile ? "100vh" : "auto", sm: "auto", md: "calc(100vh - 160px)" },
            maxHeight: { xs: "none", sm: "none", md: "none" },
            minHeight: { xs: isMobile ? "100vh" : "auto", sm: "auto", md: "fit-content" },
            overflow: { xs: "visible", sm: "visible", md: "visible" },
            mx: { xs: "auto", sm: "auto", md: 0 },
            mb: { xs: 0, sm: 3, md: 2, lg: 2.5 },
          }}
        >
          <MKBox
            sx={{
              position: "relative",
              zIndex: 10,
              padding: { xs: 1.3, sm: 1.7, md: 1.6, lg: 1.8 },
              paddingTop: { xs: 1.9, sm: 2.2, md: 2.1, lg: 2.3 },
              paddingBottom: { xs: 1.3, sm: 1.7, md: 1.6, lg: 1.8 },
              paddingRight: { xs: 2.8, sm: 3.2, md: 3.4, lg: 3.6 },
              borderRadius: { xs: "16px", sm: "18px", md: "24px", lg: "28px" },
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(30px)",
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.2), 0 10px 30px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.95)",
              border: {
                xs: "2px solid rgba(255, 255, 255, 0.9)",
                sm: "2px solid rgba(255, 255, 255, 0.9)",
                md: "3px solid rgba(255, 255, 255, 0.9)",
              },
              maxWidth: { xs: "100%", sm: "85%", md: "92%", lg: "90%" },
              mx: { xs: "auto", sm: "auto", md: 0 },
              width: "100%",
              overflow: "visible",
              minHeight: { xs: "auto", sm: "auto", md: "fit-content" },
            }}
          >
            {/* YouTube icon link - positioned in top-right corner, for slide 2, slide 3, and slide 4 */}
            {((slideIndex === 1 && homePage.heroSection.slide2.youtubeUrl) ||
              (slideIndex === 2 && homePage.heroSection.slide3.youtubeUrl) ||
              (slideIndex === 3 &&
                homePage.heroSection.slide4 &&
                homePage.heroSection.slide4.youtubeUrl)) && (
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
                aria-label="Watch on YouTube"
                sx={{
                  position: "absolute",
                  // Align vertically with the story heading
                  top: { xs: "20px", sm: "22px", md: "24px", lg: "26px" },
                  right: { xs: "10px", sm: "12px", md: "14px", lg: "16px" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FF0000",
                  textDecoration: "none",
                  opacity: 0.9,
                  zIndex: 50,
                  pointerEvents: "auto",
                }}
              >
                <YouTubeIcon
                  sx={{
                    fontSize: { xs: "22px", sm: "22px", md: "24px", lg: "26px" },
                    width: { xs: "22px", sm: "22px", md: "24px", lg: "26px" },
                    height: { xs: "22px", sm: "22px", md: "24px", lg: "26px" },
                  }}
                />
              </MKBox>
            )}
            {/* Slide 2 uses slide2 translations, Slide 3 uses slide3 translations */}
            <MKTypography
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
                fontFamily: '"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif',
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
                fontFamily: '"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif',
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
                mb: { xs: 0.9, sm: 1.1, md: 1.4, lg: 1.6 },
                color: "#555555",
                lineHeight: { xs: 1.5, sm: 1.55, md: 1.65, lg: 1.7 },
                wordWrap: "break-word",
                overflowWrap: "break-word",
                textAlign: { xs: "center", sm: "center", md: "left" },
                fontFamily:
                  slideIndex === 1
                    ? '"Lato", "Helvetica", "Arial", sans-serif'
                    : '"Lato", "Helvetica", "Arial", sans-serif',
              }}
            >
              {slideIndex === 1
                ? homePage.heroSection.slide2.paragraph
                : slideIndex === 2
                ? homePage.heroSection.slide3.paragraph
                : homePage.heroSection.slide4.paragraph}
            </MKTypography>
            <MKButton
              variant="contained"
              color="success"
              fullWidth={{ xs: true, sm: false, md: false }}
              sx={{
                px: { xs: 3.5, sm: 3.2, md: 3.5, lg: 4 },
                py: { xs: 1.1, sm: 1, md: 1.2, lg: 1.3 },
                fontSize: {
                  xs: "0.9rem",
                  sm: "0.88rem",
                  md: "0.95rem",
                  lg: "1rem",
                },
                textTransform: "none",
                fontWeight: 700,
                letterSpacing: { xs: "0.3px", sm: "0.4px", md: "0.5px", lg: "0.6px" },
                backgroundColor: "#4FA953",
                color: "white",
                borderRadius: { xs: "12px", sm: "14px", md: "16px" },
                boxShadow:
                  "0 10px 30px rgba(79, 169, 83, 0.35), 0 5px 15px rgba(79, 169, 83, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
              to="/pages/landing-pages/donate"
            >
              <span style={{ color: "white" }}>{t("homePage.heroSection.ctaButtonSlide2")}</span>
              <span
                style={{
                  marginLeft: "0.75rem",
                  display: "inline-block",
                  color: "white",
                  fontWeight: 700,
                  transition: "transform 0.3s ease",
                }}
                className="button-arrow"
              >
                {" >>"}
              </span>
            </MKButton>
          </MKBox>
        </MKBox>
      </MKBox>
    );
  }

  return (
    <MKBox
      minHeight="100vh"
      width="100%"
      sx={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top",
        display: "flex",
        justifyContent: { xs: "center", sm: "end" },
        alignItems: "end",
        position: "relative",
      }}
    >
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
            width={{ xs: "80px", sm: "100px", md: "120px", lg: "120px" }}
            display={{ xs: "inline", sm: "none" }}
            mb={2}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            alt="Aadar Foundation Logo"
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
            A home for Hopeless, Homeless, Helpless and Unclaimed people
          </MKTypography>
          <MKButton
            variant="contained"
            size="small"
            sx={{
              mt: 2,
              mb: 3,
              px: { xs: 3 },
              py: { xs: 0.5 },
              fontWeight: "bold",
              fontSize: "0.75rem",
              textTransform: "capitalize",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#FFC107",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
            component={Link}
            to="/pages/landing-pages/donate"
            display={{ xs: "inline", sm: "none" }}
          >
            {ctaButtonText}
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
          mt={4}
          mb={-4}
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
            minHeight: "100vh",
          }}
          position="relative"
          zIndex={2}
        >
          <MKTypography
            variant="h2"
            color="white"
            textAlign="center"
            ml={-2}
            fontFamily='"Lato", "Helvetica", "Arial", sans-serif'
            sx={{ fontSize: { xs: "1.5rem", sm: "1.7rem", md: "2rem", lg: "2rem" } }}
          >
            <MKBox
              component="img"
              src={aadarHindiWhite}
              width={{ xs: "80px", sm: "100px", md: "120px", lg: "120px" }}
              my={1}
              mb={-2}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              alt="Aadar Foundation Logo"
            />
          </MKTypography>
          <MKTypography
            variant="body"
            color="white"
            textAlign="center"
            mt={2}
            ml={-2}
            display="inline-block"
            fontFamily='"Lato", "Helvetica", "Arial", sans-serif'
            sx={{ fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1.1rem", lg: "1.3rem" } }}
          >
            {homePage.tagLine1} <br /> {homePage.tagLine2}
          </MKTypography>
          <MKButton
            variant="contained"
            size="small"
            sx={{
              mt: 3,
              ml: -2,
              px: { xs: 3, sm: 3.5, md: 4 },
              py: { xs: 0.5, sm: 0.65, md: 0.8 },
              fontWeight: "bold",
              fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
              textTransform: "capitalize",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#FFC107",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
            component={Link}
            to="/pages/landing-pages/donate"
          >
            {ctaButtonText}
          </MKButton>
        </MKBox>
      )}
    </MKBox>
  );
}

function Home() {
  const { t } = useTranslation();
  const routes = getRoutes(t);
  const footerRoutes = getFooterRoutes(t);
  const donateBtn = t("navbar.donateBtn");
  const homePage = t("homePage");
  const ctaButtonText = t("homePage.heroSection.ctaButton");

  // State to let user pause/resume hero slider
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Refs for preloader videos
  const maykiPreloaderRef = useRef(null);
  const nirbhayPreloaderRef = useRef(null);
  const slide4PreloaderRef = useRef(null);

  // Force all videos to start loading immediately on mount
  useEffect(() => {
    // Force load all preloader videos
    if (maykiPreloaderRef.current) {
      maykiPreloaderRef.current.load();
    }
    if (nirbhayPreloaderRef.current) {
      nirbhayPreloaderRef.current.load();
    }
    if (slide4PreloaderRef.current) {
      slide4PreloaderRef.current.load();
    }
  }, []);

  // Hero slides (slide 2, slide 3, and slide 4 share the same special video layout)
  const heroSlides = [
    { image: blackAndWhiteHero },
    { image: heroImage2 },
    { image: heroImage2 },
    { image: heroImage2 },
  ];

  return (
    <MKBox minWidth="320px">
      {/* Navbar component */}
      <DefaultNavbar
        routes={routes}
        action={{
          type: "internal",
          route: "/pages/landing-pages/donate",
          label: donateBtn,
          color: "success",
        }}
        sticky
      />

      {/* Hidden video preloader - starts loading videos immediately */}
      {/* Videos are loaded from public folder or CDN - may not be available in build */}
      <video
        ref={maykiPreloaderRef}
        preload="auto"
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <source src={maykiVideo} type="video/mp4" />
      </video>
      <video
        ref={nirbhayPreloaderRef}
        preload="auto"
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <source src={nirbhayVideo} type="video/mp4" />
      </video>
      {slide4Video && (
        <video
          ref={slide4PreloaderRef}
          preload="auto"
          style={{
            position: "absolute",
            top: "-9999px",
            left: "-9999px",
            width: "1px",
            height: "1px",
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <source src={slide4Video} type="video/mp4" />
        </video>
      )}

      {/* Hero Carousel */}
      <MKBox sx={{ position: "relative" }}>
        {/* Custom styles for carousel navigation arrows - blur on hover/click */}
        <style>
          {`
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
          `}
        </style>

        {/* Pause/Play hero slider (small button near indicators) */}
        <Tooltip
          title={isCarouselPaused ? "Click for next story" : "Click to hold story"}
          arrow
          placement="top"
        >
          <IconButton
            onClick={() => setIsCarouselPaused((prev) => !prev)}
            sx={{
              position: "absolute",
              bottom: "72px",
              right: { xs: "16px", sm: "22px", md: "28px" },
              zIndex: 6,
              backgroundColor: "rgba(0, 0, 0, 0.28)",
              color: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(3px)",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
              width: { xs: 26, sm: 28, md: 30 },
              height: { xs: 26, sm: 28, md: 30 },
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "#ffffff",
                transform: "scale(1.03)",
              },
              transition: "all 0.25s ease",
            }}
            aria-label={isCarouselPaused ? "Play slides" : "Pause slides"}
          >
            {isCarouselPaused ? (
              <PlayArrowIcon sx={{ fontSize: { xs: 18, sm: 18, md: 20 } }} />
            ) : (
              <PauseIcon sx={{ fontSize: { xs: 18, sm: 18, md: 20 } }} />
            )}
          </IconButton>
        </Tooltip>

        <Carousel
          animation="fade"
          duration={450}
          indicators
          navButtonsAlwaysVisible={true}
          navButtonsAlwaysInvisible={false}
          cycleNavigation={true}
          fullHeightHover={false}
          swipe={true}
          autoPlay={!isCarouselPaused}
          onChange={(now) => setActiveSlide(now)}
          interval={4500}
          stopAutoPlayOnHover={false}
          indicatorContainerProps={{
            style: {
              position: "absolute",
              bottom: "72px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 5,
              display: "flex",
              gap: 8,
              paddingLeft: "24px",
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
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        {/* About section component */}
        <About />

        {/* Journey video section component */}
        <Journey />

        {/* Our work section component */}
        <Work />

        {/* Counters section component */}
        <Counters />

        {/* Events section component */}
        <Events />
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
};

export default Home;
