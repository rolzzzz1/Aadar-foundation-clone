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

  if (slideIndex === 1) {
    return (
      <MKBox
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        height="100vh"
        minHeight="100vh"
        width="100%"
        sx={{
          position: "relative",
          overflow: "hidden",
          zIndex: 0,
          paddingTop: { xs: "80px", sm: "90px", md: "100px", lg: "100px" },
          gap: { xs: 0.5, sm: 1, md: 1.5, lg: 1.5 },
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
          flex={{ xs: 1, md: "0 0 50%" }}
          width={{ xs: "100%", md: "50%" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            position: "relative",
            zIndex: 5,
            padding: { xs: 1, sm: 1.5, md: 2, lg: 2.5 },
            height: { xs: "auto", md: "calc(100vh - 100px)" },
          }}
        >
          <MKBox
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: { xs: "100%", sm: "98%", md: "95%", lg: "92%" },
              ml: { xs: 0, sm: 2, md: 4, lg: 5 },
              aspectRatio: "16/9",
              borderRadius: { xs: "20px", sm: "24px", md: "28px", lg: "32px" },
              overflow: "hidden",
              boxShadow:
                "0 30px 100px rgba(0, 0, 0, 0.7), 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 0 4px rgba(255, 255, 255, 0.5) inset, 0 0 0 2px rgba(0, 0, 0, 0.2)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              border: "3px solid rgba(255, 255, 255, 0.5)",
              "&:hover": {
                transform: "translateY(-6px) scale(1.02)",
                boxShadow:
                  "0 40px 120px rgba(0, 0, 0, 0.8), 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 0 5px rgba(255, 255, 255, 0.6) inset, 0 0 0 3px rgba(0, 0, 0, 0.3)",
                border: "3px solid rgba(255, 255, 255, 0.6)",
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
                height: { xs: "25%", sm: "25%", md: "25%", lg: "25%" },
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
          flex={{ xs: 1, md: "0 0 50%" }}
          width={{ xs: "100%", md: "50%" }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems={{ xs: "center", md: "flex-start" }}
          sx={{
            position: "relative",
            zIndex: 10,
            padding: { xs: 1, sm: 1.5, md: 1.8, lg: 2 },
            height: { xs: "auto", md: "calc(100vh - 100px)" },
            maxHeight: { xs: "none", md: "calc(100vh - 100px)" },
          }}
        >
          <MKBox
            sx={{
              position: "relative",
              zIndex: 10,
              padding: { xs: 1.2, sm: 1.4, md: 1.6, lg: 1.8 },
              borderRadius: { xs: "16px", sm: "20px", md: "24px", lg: "28px" },
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(30px)",
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.2), 0 10px 30px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.95)",
              border: "3px solid rgba(255, 255, 255, 0.9)",
              maxWidth: { xs: "100%", sm: "96%", md: "92%", lg: "90%" },
              mx: { xs: "auto", md: 0 },
              width: "100%",
            }}
          >
            <MKTypography
              variant="h2"
              fontWeight="bold"
              sx={{
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.45rem",
                  md: "1.65rem",
                  lg: "1.85rem",
                  xl: "2rem",
                },
                mb: { xs: 0.8, sm: 1, md: 1.2, lg: 1.4 },
                color: "#1A1A1A",
                lineHeight: { xs: 1.35, sm: 1.4, md: 1.45, lg: 1.5 },
                wordWrap: "break-word",
                overflowWrap: "break-word",
                fontWeight: 500,
                letterSpacing: { xs: "0.15px", sm: "0.2px", md: "0.25px", lg: "0.3px" },
                fontFamily: '"Pacifico", "Flix", "Roboto", "Helvetica", "Arial", sans-serif',
                borderBottom: "3px solid #4FA953",
                paddingBottom: { xs: 0.4, sm: 0.6, md: 0.8, lg: 1 },
                display: "inline-block",
                width: "100%",
                textAlign: { xs: "center", md: "left" },
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-4px",
                  left: 0,
                  width: "60px",
                  height: "4px",
                  backgroundColor: "#4FA953",
                  borderRadius: "2px",
                },
              }}
            >
              {homePage.heroSection.slide3.title}
            </MKTypography>
            <MKTypography
              variant="h5"
              sx={{
                fontSize: {
                  xs: "0.82rem",
                  sm: "0.9rem",
                  md: "0.96rem",
                  lg: "1.02rem",
                  xl: "1.08rem",
                },
                mb: { xs: 0.8, sm: 1, md: 1.2, lg: 1.4 },
                color: "#2A2A2A",
                fontWeight: "600",
                lineHeight: { xs: 1.5, sm: 1.6, md: 1.7 },
                wordWrap: "break-word",
                overflowWrap: "break-word",
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              }}
            >
              {homePage.heroSection.slide3.subtitle}
            </MKTypography>
            <MKTypography
              variant="body1"
              sx={{
                fontSize: {
                  xs: "0.78rem",
                  sm: "0.82rem",
                  md: "0.88rem",
                  lg: "0.94rem",
                  xl: "0.98rem",
                },
                mb: { xs: 1.2, sm: 1.5, md: 1.8, lg: 2 },
                color: "#333333",
                lineHeight: { xs: 1.6, sm: 1.65, md: 1.7, lg: 1.75 },
                wordWrap: "break-word",
                overflowWrap: "break-word",
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              }}
            >
              {homePage.heroSection.slide3.paragraph}
            </MKTypography>
            <MKButton
              variant="contained"
              color="success"
              sx={{
                px: { xs: 2.2, sm: 2.6, md: 3, lg: 3.2 },
                py: { xs: 0.7, sm: 0.9, md: 1.0, lg: 1.1 },
                fontSize: {
                  xs: "0.78rem",
                  sm: "0.82rem",
                  md: "0.88rem",
                  lg: "0.92rem",
                },
                textTransform: "none",
                fontWeight: 700,
                letterSpacing: "0.5px",
                backgroundColor: "#4FA953",
                color: "white",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(79, 169, 83, 0.4), 0 4px 12px rgba(79, 169, 83, 0.25)",
                "& > *": {
                  color: "white",
                },
                "&:hover": {
                  backgroundColor: "#3d8a41",
                  transform: "translateY(-3px)",
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

  // Temporarily hide slide 3 from the hero carousel
  const heroSlides = [{ image: blackAndWhiteHero }, { image: heroImage2 }];

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
