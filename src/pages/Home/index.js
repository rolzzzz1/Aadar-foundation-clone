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
import PropTypes from "prop-types";

// Additional hero images for carousel
import blackAndWhiteHero from "assets/images/mainThemeImages/aadar-main-black2.png";
import heroImage2 from "assets/images/aboutPageImages/main1.jpg";
import heroImage3 from "assets/images/aboutPageImages/swargSadan.webp";

// Video for slide 2
import heroVideo from "assets/images/video1.mp4";

function HeroSlide({ image, homePage, isFirstSlide, ctaButtonText, slideIndex }) {
  // Slide 2 - Video on left, text on right
  if (slideIndex === 1) {
    return (
      <MKBox
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        minHeight="100vh"
        width="100%"
      >
        {/* Video on left - 2/3 width */}
        <MKBox
          flex={{ xs: 1, md: "0 0 66.67%" }}
          width={{ xs: "100%", md: "66.67%" }}
          sx={{
            position: "relative",
            overflow: "hidden",
            height: "100vh",
          }}
        >
          {/* Main video */}
          <MKBox
            component="video"
            autoPlay
            loop
            muted
            playsInline
            sx={{
              position: "absolute",
              top: { xs: "70px", md: "80px" },
              left: 0,
              width: "100%",
              height: { xs: "calc(100% - 70px)", md: "calc(100% - 80px)" },
              objectFit: "cover",
            }}
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </MKBox>

          {/* Blurred video in padding area */}
          <MKBox
            component="video"
            autoPlay
            loop
            muted
            playsInline
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "110%",
              height: { xs: "90px", md: "100px" },
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
          </MKBox>
        </MKBox>

        {/* Vertical yellow paint splash divider */}
        <MKBox
          position="absolute"
          left={{ xs: "calc(66.67% - 35px)", md: "calc(66.67% - 40px)" }}
          top={{ xs: "70px", md: "80px" }}
          bottom={0}
          width={{ xs: "70px", md: "80px" }}
          zIndex={10}
          sx={{
            background:
              "linear-gradient(to bottom, #FFB300 0%, #FFC107 8%, #FFD54F 15%, #FFC107 25%, #FFB300 35%, #FFC107 45%, #FFD54F 55%, #FFC107 65%, #FFB300 75%, #FFC107 85%, #FFD54F 95%, #FFC107 100%)",
            clipPath:
              "polygon(35% 0%, 65% 0%, 72% 2%, 68% 5%, 75% 8%, 62% 12%, 78% 15%, 65% 18%, 82% 22%, 58% 25%, 85% 28%, 62% 32%, 88% 35%, 65% 38%, 85% 42%, 62% 45%, 82% 48%, 65% 52%, 78% 55%, 62% 58%, 75% 62%, 68% 65%, 72% 68%, 65% 72%, 58% 75%, 68% 78%, 65% 82%, 72% 85%, 68% 88%, 75% 92%, 62% 95%, 65% 100%, 35% 100%, 28% 95%, 35% 92%, 32% 88%, 25% 85%, 38% 82%, 32% 78%, 42% 75%, 35% 72%, 28% 68%, 32% 65%, 25% 62%, 38% 58%, 32% 55%, 42% 52%, 35% 48%, 28% 45%, 35% 42%, 32% 38%, 42% 35%, 35% 32%, 28% 28%, 35% 25%, 38% 22%, 32% 18%, 42% 15%, 35% 12%, 32% 8%, 28% 5%, 35% 2%, 32% 0%)",
            filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1))",
          }}
        />

        {/* Text on right - 1/3 width */}
        <MKBox
          flex={{ xs: 1, md: "0 0 33.33%" }}
          width={{ xs: "100%", md: "33.33%" }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems={{ xs: "center", md: "flex-start" }}
          px={{ xs: 2, md: 4 }}
          backgroundColor={{ xs: "#f5f5f5", md: "white" }}
        >
          <MKTypography
            variant="h2"
            color="dark"
            fontWeight="bold"
            sx={{ fontSize: { xs: "2rem", md: "3rem" }, mb: 2 }}
          >
            Our Impact
          </MKTypography>
          <MKTypography
            variant="body1"
            color="text"
            sx={{ fontSize: { xs: "1rem", md: "1.25rem" }, mb: 3 }}
          >
            Empowering communities and creating lasting change through dedicated service and
            compassion.
          </MKTypography>
          <MKButton
            variant="gradient"
            color="success"
            sx={{
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 1.5 },
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
            component={Link}
            to="/pages/landing-pages/donate"
          >
            Learn More
          </MKButton>
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
