import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Material Kit 2 React components
import MKBox from "components/MKBox";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

import bgImage2 from "assets/images/swargSadanBlack.png";
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

      <MKBox
        my={-12}
        minHeight="60vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage2})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      ></MKBox>

      {/* <MKBox component="section" pt={6} pb={6} mt={6} display="flex" justifyContent={"center"}>
        <MKTypography variant="h3">Contact page is coming soon ...</MKTypography>
      </MKBox> */}

      <MKBox component="section" pt={10} my={6}>
        <Container>
          <Grid container alignItems="center">
            <Grid item md={4} sx={{ ml: { xs: 0, lg: 3 }, mb: { xs: 12, md: 0 } }}>
              <Container>
                <MKTypography variant="h4" sx={{ fontWeight: "500" }}>
                  Get in touch @
                </MKTypography>
                <MKTypography
                  variant="body1"
                  paddingTop="15px"
                  fontSize="0.9rem"
                  sx={{ fontWeight: "600" }}
                >
                  Address :
                </MKTypography>
                <MKTypography variant="body1" fontSize="0.9rem">
                  <b>Swarg sadan ashram</b> <br />
                  Sarkari Malti, Behind Muktidham, Guda Gudi Ka Naka, Gwalior, India, 474001
                </MKTypography>

                <MKTypography
                  variant="body1"
                  paddingTop="15px"
                  fontSize="0.9rem"
                  sx={{ fontWeight: "600" }}
                >
                  Phone number :
                </MKTypography>
                <MKTypography variant="body1" fontSize="0.9rem">
                  062662 02679
                </MKTypography>

                <MKTypography
                  variant="body1"
                  paddingTop="15px"
                  fontSize="0.9rem"
                  sx={{ fontWeight: "600" }}
                >
                  Email :
                </MKTypography>
                <MKTypography variant="body1" fontSize="0.9rem">
                  aadarfoundatio2018@gmail.com
                </MKTypography>

                <MKBox ml={{ xs: "auto", lg: 0 }}>
                  {/* <MKButton
                    component={Link}
                    to={"/pages/landing-pages/about-us"}
                    variant="outlined"
                    color="success"
                    size="small"
                  >
                    Read more
                  </MKButton> */}
                </MKBox>
              </Container>
            </Grid>
            <Grid item xs={12} md={6} sx={{ ml: "auto" }}>
              <MKBox position="relative" display="flex" justifyContent="center">
                {/* <MKBox
                  component="img"
                  src={aboutImg}
                  alt="aboutImage"
                  width="88%"
                  borderRadius="15px"
                /> */}
                CONTACT FORM HERE
              </MKBox>
            </Grid>
          </Grid>
        </Container>
      </MKBox>

      {/* <Container>
        <Grid container>
          <Grid item xs={12} md={12} mt={22} sx={{ textAlign: "center", mb: 2 }}>
            <MKTypography
              variant="h3"
              // color="darkText"
              fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
              sx={{ fontWeight: "500" }}
            >
              Contact
            </MKTypography>
          </Grid>
        </Grid>

        <Grid container spacing={6} mb={4}>
          <Grid
            item
            xs={12}
            lg={4}
            sx={{
              //   ml: "auto",
              mt: { xs: 3, lg: 0 },
              //   border: "1px #000000 solid",
            }}
          >
            <Card sx={{ margin: "20px" }}>
              <MKBox
                width="100%"
                minHeight="200px"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
              >
                <MKTypography variant="h5">Address</MKTypography>
                <MKTypography
                  variant="body2"
                  fontSize="0.8rem"
                  paddingTop="10px"
                  px="20px"
                  textAlign="center"
                >
                  ASHRAM ADD - SARKARI MULTI, Gudagudi Ka Naka Rd, near of MUKTIDHAM, Gwalior,
                  Madhya Pradesh 474001
                </MKTypography>
              </MKBox>
            </Card>
          </Grid>

          <Grid
            item
            xs={12}
            lg={4}
            sx={{
              //   ml: "auto",
              mt: { xs: 3, lg: 0 },
              // border: "1px #000000 solid"
            }}
          >
            <Card sx={{ margin: "20px" }}>
              <MKBox
                width="100%"
                minHeight="200px"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
              >
                <MKTypography variant="h5">Phone number</MKTypography>
                <MKTypography
                  variant="body2"
                  fontSize="0.8rem"
                  paddingTop="10px"
                  px="20px"
                  textAlign="center"
                >
                  90391 29571
                </MKTypography>
              </MKBox>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            lg={4}
            sx={{
              //   ml: "auto",
              mt: { xs: 3, lg: 0 },
              // border: "1px #000000 solid"
            }}
          >
            <Card sx={{ margin: "20px" }}>
              <MKBox
                width="100%"
                minHeight="200px"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
              >
                <MKTypography variant="h5">Email</MKTypography>
                <MKTypography
                  variant="body2"
                  fontSize="0.8rem"
                  paddingTop="10px"
                  px="20px"
                  textAlign="center"
                >
                  aadar1234@gmail.com
                </MKTypography>
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </Container> */}

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default Gallery;
