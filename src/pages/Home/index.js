// @mui material components
import Card from "@mui/material/Card";
import Carousel from "react-material-ui-carousel";
import { Link } from "react-router-dom";

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
import slide2TextBg from "assets/images/mainThemeImages/back-text.svg"; // SVG background for slide 2 text area
import PropTypes from "prop-types";

// Additional hero images for carousel
import blackAndWhiteHero from "assets/images/mainThemeImages/aadar-main-black2.png";
import heroImage2 from "assets/images/aboutPageImages/main1.jpg";
import heroImage3 from "assets/images/aboutPageImages/swargSadan.webp";

// Video for slide 2
import heroVideo from "assets/images/video1.mp4";

function HeroSlide({ image, homePage, isFirstSlide, ctaButtonText, slideIndex }) {
  const { t } = useTranslation();
  // Slide 2 - Video on left, text on right
  if (slideIndex === 1 || slideIndex === 2) {
    const isSlide3 = slideIndex === 2;
    const isSlide2 = slideIndex === 1;
    return (
      <MKBox
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        height="100vh"
        maxHeight="100vh"
        width="100%"
        sx={{
          position: "relative",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {/* Video on left - 2/3 width */}
        <MKBox
          flex={{ xs: 1, md: isSlide3 ? "0 0 50%" : "0 0 66.67%" }}
          width={{ xs: "100%", md: isSlide3 ? "50%" : "66.67%" }}
          sx={{
            position: "relative",
            overflow: "hidden",
            height: "100vh",
            maxHeight: "100vh",
            zIndex: 0,
          }}
        >
          {/* Main video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={heroImage2}
            style={{
              position: "absolute",
              top: "80px",
              left: 0,
              width: "100%",
              height: "calc(100% - 80px)",
              objectFit: "cover",
              backgroundColor: "#000",
            }}
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Blurred video in padding area */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "110%",
              height: "100px",
              objectFit: "cover",
              objectPosition: "center top",
              filter: "blur(8px)",
              opacity: 0.8,
              transform: "translateY(-10px)",
              zIndex: 1,
            }}
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Fog overlay - blurred padding area */}
          {!isSlide3 && (
            <MKBox
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "100px",
                background:
                  "linear-gradient(to bottom, rgba(241, 188, 102, 0.9), rgba(241, 188, 102, 0.7), rgba(241, 188, 102, 0.5), transparent)",
                zIndex: 3,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Fog overlay - right edge */}
          {!isSlide3 && (
            <MKBox
              sx={{
                position: "absolute",
                top: "80px",
                right: 0,
                width: "150px",
                height: "calc(100% - 80px)",
                background:
                  "linear-gradient(to left, rgba(241, 188, 102, 1), rgba(241, 188, 102, 0.85), rgba(241, 188, 102, 0.6), transparent)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Fog overlay - left edge */}
          {!isSlide3 && (
            <MKBox
              sx={{
                position: "absolute",
                top: "80px",
                left: 0,
                width: "120px",
                height: "calc(100% - 80px)",
                background:
                  "linear-gradient(to right, rgba(241, 188, 102, 0.95), rgba(241, 188, 102, 0.7), rgba(241, 188, 102, 0.45), transparent)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Fog overlay - bottom edge */}
          {!isSlide3 && (
            <MKBox
              sx={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: "100%",
                height: "120px",
                background:
                  "linear-gradient(to top, rgba(241, 188, 102, 0.95), rgba(241, 188, 102, 0.7), rgba(241, 188, 102, 0.45), transparent)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
          )}
        </MKBox>

        {/* Text on right - 1/3 width */}
        <MKBox
          flex={{ xs: 1, md: isSlide3 ? "0 0 50%" : "0 0 33.33%" }}
          width={{ xs: "100%", md: isSlide3 ? "50%" : "33.33%" }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems={{ xs: "center", md: "flex-start" }}
          px={{ xs: 2, md: 4 }}
          pl={{ xs: 2, md: 6 }}
          sx={{
            position: "relative",
            overflow: "hidden",
            height: "100vh",
            maxHeight: "100vh",
            backgroundColor: isSlide3 ? "transparent" : "#F1BC66",
            ...(isSlide3
              ? {}
              : {
                  backgroundImage: `url(${slide2TextBg})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }),
          }}
        >
          {/* Text content */}
          <MKBox position="relative" zIndex={15}>
            <MKTypography
              variant="h2"
              fontWeight="bold"
              sx={{
                fontSize: { xs: "1.6rem", md: "2.4rem" },
                mb: 2,
                color: isSlide3 ? "#333" : "#f5f5f5",
                textShadow: isSlide3 ? "0 2px 4px rgba(255, 255, 255, 0.8)" : "none",
              }}
            >
              Our Impact
            </MKTypography>
            <MKTypography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
                mb: 3,
                opacity: 0.95,
                color: isSlide3 ? "#333" : "#f5f5f5",
                textShadow: isSlide3 ? "0 1px 2px rgba(255, 255, 255, 0.8)" : "none",
              }}
            >
              Empowering communities and creating lasting change through dedicated service and
              compassion.
            </MKTypography>
            <MKButton
              variant={isSlide3 ? "contained" : "gradient"}
              color="success"
              sx={{
                px: { xs: 2, md: 3 },
                py: { xs: 0.5, md: 0.9 },
                fontSize: { xs: "0.8rem", md: "0.9rem" },
                textTransform: "none",
                fontWeight: 700,
                letterSpacing: "0.2px",
                backgroundColor: isSlide3 ? "#F1BC66" : isSlide2 ? "#7FA707" : "#FFC107",
                color: "white",
                borderRadius: "10px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                "&:hover": {
                  backgroundColor: isSlide3 ? "#e7a232" : isSlide2 ? "#6d9006" : "#e0ac06",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.22)",
                },
              }}
              component={Link}
              to="/pages/landing-pages/donate"
            >
              {t("homePage.heroSection.ctaButtonSlide2")}
            </MKButton>
          </MKBox>

          {/* Fog overlay - left edge (towards video) */}
          {!isSlide3 && (
            <MKBox
              sx={{
                position: "absolute",
                top: "80px",
                left: 0,
                width: "60px",
                height: "calc(100% - 80px)",
                background:
                  "linear-gradient(to right, rgba(241, 188, 102, 0.5), rgba(241, 188, 102, 0.3), transparent)",
                zIndex: 20,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Blurred overlay - soft left border into the video */}
          {!isSlide3 && (
            <MKBox
              sx={{
                position: "absolute",
                top: "80px",
                left: "-20px",
                width: "40px",
                height: "calc(100% - 80px)",
                backgroundColor: "#F1BC66",
                filter: "blur(12px)",
                opacity: 0.9,
                zIndex: 21,
                pointerEvents: "none",
              }}
            />
          )}
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

  const heroSlides = [{ image: blackAndWhiteHero }, { image: heroImage2 }, { image: heroImage3 }];

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
