// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Material Kit 2 React components
import MKBox from "components/MKBox";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

import bgImage2 from "assets/images/swargSadanBlack.png";
import bgImage from "assets/images/smallBrushstroke2.svg";
import MKTypography from "components/MKTypography";

function Gallery() {
  return (
    <MKBox minWidth="575px">
      {/* Navbar component */}
      <DefaultNavbar
        routes={routes}
        action={{
          type: "external",
          route: "https://www.creative-tim.com/product/material-kit-react",
          label: "Donate Now",
          color: "success",
        }}
        sticky
      />

      {/* Main image part */}
      <MKBox
        minHeight="80vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage2})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left",
          display: "flex",
          justifyContent: "end",
          alignItems: "end",
        }}
      >
        <MKBox
          color="white"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top",
            width: "40%",
            minHeight: "40vh",
          }}
        >
          <MKTypography
            variant="h3"
            color="white"
            textAlign="center"
            ml={-2}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          >
            Gallery
          </MKTypography>
        </MKBox>
      </MKBox>

      <MKBox
        component="section"
        // pt={14}
        pb={4}
        mt={4}
        display="flex"
        justifyContent={"center"}
      >
        <MKTypography variant="h3">Our gallery is coming soon ...</MKTypography>
      </MKBox>

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default Gallery;
