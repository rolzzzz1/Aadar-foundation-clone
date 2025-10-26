// @mui material components
import Card from "@mui/material/Card";
import Carousel from "react-material-ui-carousel";

// i18next imports
import { useTranslation } from "react-i18next";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

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

function HeroSlide({ image, homePage }) {
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
      <MKBox
        display="flex"
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
          mb={8}
          px={1}
          display={{ xs: "inline", sm: "none" }}
          position="relative"
          zIndex={2}
        >
          A home for Hopeless, Homeless, Helpless and Unclaimed people
        </MKTypography>
      </MKBox>

      {/* Desktop view - positioned on the right */}
      <MKBox
        color="white"
        display={{ xs: "none", sm: "flex" }}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        mr={6}
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left",
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
      </MKBox>
    </MKBox>
  );
}

function Home() {
  const { t } = useTranslation();
  const routes = getRoutes(t);
  const footerRoutes = getFooterRoutes(t);
  const donateBtn = t("navbar.donateBtn");
  const homePage = t("homePage");

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
            <HeroSlide key={index} image={slide.image} homePage={homePage} />
          ))}
        </Carousel>
      </MKBox>

      {/* Main section */}
      <Card
        sx={{
          p: 2,
          pb: { xs: 4, sm: 8 },
          mx: { xs: 2, lg: 3 },
          mt: { xs: -6, sm: -8, md: -10 },
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
};

export default Home;
