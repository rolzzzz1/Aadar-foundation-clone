// @mui material components
import Card from "@mui/material/Card";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
// import MKCarousel from "components/MKCarousel";

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
import routes from "routes";
import footerRoutes from "footer.routes";

// Images
import bgImage from "assets/images/mainThemeImages/brushstroke.svg";
import bgImage2 from "assets/images/mainThemeImages/aadar-main-black2.png";
// import img1 from "assets/images/galleryImages/resque1.jpg";
// import img2 from "assets/images/galleryImages/resque2.jpg";

function Home() {
  // var items = [
  //   {
  //     name: "Image 1",
  //     imgUrl: img1,
  //   },
  //   {
  //     name: "Image 2",
  //     imgUrl: img2,
  //   },
  // ];

  return (
    <MKBox minWidth="320px">
      {/* Navbar component */}
      <DefaultNavbar
        routes={routes}
        action={{
          type: "internal",
          route: "",
          label: "Donate Now",
          color: "success",
        }}
        sticky
      />

      {/* Main image/carousel section*/}
      <MKBox
        minHeight="100vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage2})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top",
          display: "flex",
          justifyContent: { xs: "center", sm: "end" },
          alignItems: "end",
        }}
      >
        <MKTypography
          color="white"
          textAlign="center"
          fontSize="1.3rem"
          mb={8}
          px={1}
          display={{ xs: "inline", sm: "none" }}
        >
          A home for Hopeless, Homeless, Helpless and Unclaimed people
        </MKTypography>
        <MKBox
          color="white"
          // display="flex"
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
            // width: "40%",

            minHeight: "100vh",
          }}
        >
          <MKTypography
            variant="h2"
            color="white"
            textAlign="center"
            ml={-2}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{ fontSize: { xs: "1.5rem", sm: "1.7rem", md: "2rem", lg: "2rem" } }}
            // display={{ xs: "none", sm: "inline" }}
          >
            Aadar Foundation
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
            A home for Hopeless, Homeless, Helpless <br /> and Unclaimed people
          </MKTypography>
        </MKBox>
      </MKBox>

      {/* Main section */}
      <Card
        sx={{
          p: 2,
          pb: { xs: 4, sm: 8 },
          mx: { xs: 2, lg: 3 },
          mt: -6,
          mb: { xs: 2, sm: 4 },
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        {/* About section component */}
        <About />

        {/* Video section component */}
        <Journey />

        {/* Our work section component */}
        <Work />

        {/* Counters section */}
        <Counters />

        {/* Events section component */}
        <Events />

        {/* <MKBox pt={4}>
          <MKCarousel item={items} />
        </MKBox> */}
      </Card>

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default Home;
