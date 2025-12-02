// @mui material components
import Card from "@mui/material/Card";
import Carousel from "react-material-ui-carousel";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";

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

// Story back background - using public folder to avoid SVG processing issues
import PropTypes from "prop-types";

// Additional hero images for carousel
import blackAndWhiteHero from "assets/images/mainThemeImages/aadar-main-black2.png";
import heroImage2 from "assets/images/aboutPageImages/main1.jpg";

// Video for slide 2
import heroVideo from "assets/images/video1.mp4";
// Video for slide 3 / hero-style video
import kumbhVideo from "assets/images/kumbh.mp4";

function HeroSlide({ image, homePage, isFirstSlide, ctaButtonText, slideIndex }) {
  const { t } = useTranslation();

  // Rebuild slide 2: video left + Pacifico heading + yellow/orange gradient background
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Use the same special layout for slide 2 and slide 3 (duplicate of slide 2)
  if (slideIndex === 1 || slideIndex === 2) {
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

        {/* Video section - left */}
        <MKBox
          flex={{ xs: "0 0 auto", sm: "0 0 auto", md: "0 0 55%" }}
          width={{ xs: "100%", sm: "100%", md: "55%" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            position: "relative",
            zIndex: 5,
            padding: { xs: 1, sm: 1.5, md: 2, lg: 2.5 },
            paddingX: { xs: 1.4, sm: 2, md: 2, lg: 2.5 },
            height: { xs: "auto", sm: "auto", md: "calc(100vh - 160px)" },
            minHeight: { xs: "220px", sm: "280px", md: "auto" },
          }}
        >
          <MKBox
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: { xs: "92%", sm: "94%", md: "95%", lg: "92%" },
              ml: { xs: 0, sm: 0, md: 4, lg: 5 },
              aspectRatio: { xs: "4/3", sm: "4/3", md: "16/9" },
              maxHeight: { xs: "260px", sm: "320px", md: "none" },
              borderRadius: { xs: "18px", sm: "22px", md: "28px", lg: "32px" },
              overflow: "hidden",
              padding: { xs: "2px", sm: "3px", md: "4px", lg: "4px" },
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
            >
              <source src={kumbhVideo} type="video/mp4" />
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

        {/* Text section - right */}
        <MKBox
          flex={{ xs: "0 0 auto", sm: "0 0 auto", md: "0 0 45%" }}
          width={{ xs: "100%", sm: "100%", md: "45%" }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems={{ xs: "center", sm: "center", md: "flex-start" }}
          sx={{
            position: "relative",
            zIndex: 10,
            padding: { xs: 1.1, sm: 1.5, md: 1.6, lg: 1.8 },
            paddingX: { xs: 1.8, sm: 2.1, md: 1.8, lg: 2 },
            height: { xs: "auto", sm: "auto", md: "calc(100vh - 160px)" },
            maxHeight: { xs: "none", sm: "none", md: "none" },
            minHeight: { xs: "auto", sm: "auto", md: "fit-content" },
            overflow: { xs: "visible", sm: "visible", md: "visible" },
          }}
        >
          <MKBox
            sx={{
              position: "relative",
              zIndex: 10,
              padding: { xs: 1.3, sm: 1.7, md: 1.6, lg: 1.8 },
              paddingTop: { xs: 1.6, sm: 2, md: 1.8, lg: 2 },
              paddingBottom: { xs: 1.3, sm: 1.7, md: 1.6, lg: 1.8 },
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
              maxWidth: { xs: "100%", sm: "95%", md: "92%", lg: "90%" },
              mx: { xs: "auto", sm: "auto", md: 0 },
              width: "100%",
              overflow: "visible",
              minHeight: { xs: "auto", sm: "auto", md: "fit-content" },
            }}
          >
            {/* Slide 2 uses slide2 translations, Slide 3 uses slide3 translations */}
            <MKTypography
              variant="h2"
              fontWeight="bold"
              sx={{
                fontSize: {
                  xs: "1.1rem",
                  sm: "1.3rem",
                  md: "1.5rem",
                  lg: "1.7rem",
                  xl: "1.9rem",
                },
                mt: { xs: 0, sm: 0, md: 0 },
                mb: { xs: 0.6, sm: 0.8, md: 1, lg: 1.2 },
                color: "#1A1A1A",
                lineHeight: { xs: 1.3, sm: 1.35, md: 1.4, lg: 1.45 },
                wordWrap: "break-word",
                overflowWrap: "break-word",
                fontWeight: 500,
                letterSpacing: { xs: "0.1px", sm: "0.15px", md: "0.2px", lg: "0.25px" },
                fontFamily: '"Pacifico", "Flix", "Roboto", "Helvetica", "Arial", sans-serif',
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
                : homePage.heroSection.slide3.title}
            </MKTypography>
            <MKTypography
              variant="h5"
              sx={{
                fontSize: {
                  xs: "0.72rem",
                  sm: "0.8rem",
                  md: "0.88rem",
                  lg: "0.95rem",
                  xl: "1rem",
                },
                mb: { xs: 0.55, sm: 0.8, md: 1, lg: 1.2 },
                color: "#2A2A2A",
                fontWeight: "600",
                lineHeight: { xs: 1.35, sm: 1.45, md: 1.6 },
                wordWrap: "break-word",
                overflowWrap: "break-word",
                textAlign: { xs: "center", sm: "center", md: "left" },
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              }}
            >
              {slideIndex === 1
                ? homePage.heroSection.slide2.subtitle
                : homePage.heroSection.slide3.subtitle}
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
                color: "#333333",
                lineHeight: { xs: 1.5, sm: 1.55, md: 1.65, lg: 1.7 },
                wordWrap: "break-word",
                overflowWrap: "break-word",
                textAlign: { xs: "center", sm: "center", md: "left" },
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              }}
            >
              {slideIndex === 1
                ? homePage.heroSection.slide2.paragraph
                : homePage.heroSection.slide3.paragraph}
            </MKTypography>
            <MKButton
              variant="contained"
              color="success"
              fullWidth={{ xs: true, sm: false, md: false }}
              sx={{
                px: { xs: 3, sm: 2.6, md: 3, lg: 3.2 },
                py: { xs: 1, sm: 0.9, md: 1.0, lg: 1.1 },
                fontSize: {
                  xs: "0.85rem",
                  sm: "0.82rem",
                  md: "0.88rem",
                  lg: "0.92rem",
                },
                textTransform: "none",
                fontWeight: 700,
                letterSpacing: "0.5px",
                backgroundColor: "#4FA953",
                color: "white",
                borderRadius: { xs: "10px", sm: "12px", md: "12px" },
                boxShadow: "0 8px 24px rgba(79, 169, 83, 0.4), 0 4px 12px rgba(79, 169, 83, 0.25)",
                "& > *": {
                  color: "white",
                },
                "&:hover": {
                  backgroundColor: "#3d8a41",
                  transform: {
                    xs: "translateY(-2px)",
                    sm: "translateY(-3px)",
                    md: "translateY(-3px)",
                  },
                  boxShadow:
                    "0 12px 32px rgba(79, 169, 83, 0.5), 0 6px 16px rgba(79, 169, 83, 0.35)",
                  "& > *": {
                    color: "white",
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
                }}
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
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
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
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
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

  // Hero slides (slide 2 and slide 3 share the same special video layout)
  const heroSlides = [{ image: blackAndWhiteHero }, { image: heroImage2 }, { image: heroImage2 }];

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

      {/* Hidden video preloader - starts loading video immediately */}
      <video
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
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Hero Carousel */}
      <MKBox>
        <Carousel
          animation="fade"
          duration={600}
          indicators={true}
          navButtonsAlwaysVisible={true}
          navButtonsAlwaysInvisible={false}
          cycleNavigation={true}
          fullHeightHover={false}
          swipe={true}
          autoPlay={true}
          interval={7000}
          stopAutoPlayOnHover={true}
          navButtonsProps={{
            style: {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(5px)",
              opacity: 0.7,
              borderRadius: "50%",
              width: "40px",
              height: "40px",
            },
          }}
          NextIcon={<span style={{ color: "white", fontSize: "1.5rem" }}>›</span>}
          PrevIcon={<span style={{ color: "white", fontSize: "1.5rem" }}>‹</span>}
        >
          {heroSlides.map((slide, index) => (
            <HeroSlide
              key={index}
              image={slide.image}
              homePage={homePage}
              isFirstSlide={index === 0}
              ctaButtonText={ctaButtonText}
              slideIndex={index}
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
          mt: { xs: -4, sm: -6, md: -8 },
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
};

export default Home;
