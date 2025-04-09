import React from "react";

// @mui material components
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// import Switch from "@mui/material/Switch";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
// import MKAlert from "components/MKAlert";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Images
import bgImage2 from "assets/images/mainThemeImages/swargSadanBlack.png";
import bgImage from "assets/images/mainThemeImages/smallBrushstroke2.svg";
import scanner from "assets/images/scanner.jpg";
import donateImg from "assets/images/donate-happy-faces.png";

function Donate() {
  return (
    <MKBox minWidth="320px">
      {/* Navbar component */}
      <DefaultNavbar
        routes={routes}
        action={{
          type: "internal",
          route: "/pages/landing-pages/donate",
          label: "Donate",
          color: "success",
        }}
        sticky
      />

      {/* Main Image and text */}
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
            backgroundPosition: "center",
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
            fontSize={{ xs: "1.2rem", sm: "1.875rem" }}
            mb={{ xs: 1, sm: 0 }}
          >
            Donate
          </MKTypography>
        </MKBox>
      </MKBox>

      {/* Contact section */}
      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -2,
          mb: 4,
          backgroundColor: "#f0f2f5",
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <MKBox component="section" my={4}>
          <Container>
            <Grid container display="flex" pt={3}>
              <Grid lg={12}>
                <MKTypography
                  variant="h4"
                  sx={{ fontWeight: "500", fontSize: { md: "1.2rem", lg: "1.5rem" } }}
                  pb={5}
                >
                  Donate
                </MKTypography>
              </Grid>
              <Grid container alignItems="flex-start" lg={6} xl={6}>
                <MKBox>
                  {/* <MKTypography
                    variant="h4"
                    sx={{ fontWeight: "500", fontSize: { md: "1.2rem", lg: "1.5rem" } }}
                    pb={5}
                  >
                    Donate
                  </MKTypography> */}
                  <MKTypography
                    variant="h4"
                    sx={{ fontWeight: "500", fontSize: { md: "1.2rem", lg: "1.5rem" } }}
                  >
                    Your action today has <br />
                    the{" "}
                    <MKTypography
                      display="inline"
                      variant="h4"
                      sx={{
                        fontSize: { md: "1.7rem", lg: "2rem" },
                        fontWeight: "700",
                        color: "#ECA533",
                      }}
                    >
                      power to transform a life.
                    </MKTypography>
                    <MKTypography
                      variant="body1"
                      fontSize={{ xs: "0.8rem", md: "1rem" }}
                      fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                      sx={{
                        letterSpacing: "0.05rem",
                        paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                      }}
                      mt={4}
                    >
                      We ensure that every donation is used with purpose and precision. Each
                      decision we make is thoughtfully considered, and even the smallest
                      contribution is directed toward initiatives where it will yield the greatest
                      impact.
                    </MKTypography>
                  </MKTypography>

                  <MKBox
                    component="img"
                    src={donateImg}
                    alt={"Swarg sadan building image"}
                    borderRadius="xxl"
                    width="100%"
                    height="250px"
                    sx={{ border: "10px solid #ECA533" }}
                    mt={4}
                  ></MKBox>
                  {/* <MKBox border="2px solid #F44335" borderRadius="5px" width="100%" p={1} mt={11}>
                    <MKTypography color="error" fontSize="1rem" textAlign="center">
                      Please email your <b>name, mobile number and screenshot</b> of your
                      transaction at <b>aadarfoundatio2018@gmail.com</b> to get receipt of your
                      contribution.
                    </MKTypography>
                  </MKBox> */}
                </MKBox>
              </Grid>

              <Grid lg={6} xl={6}>
                {/* <MKTypography
                  // display="inline"
                  variant="h4"
                  sx={{
                    fontSize: { md: "1.7rem", lg: "2rem" },
                    fontWeight: "500",
                  }}
                  textAlign="center"
                  pb={2}
                >
                  Scan to pay
                </MKTypography> */}
                <MKBox
                  component="img"
                  src={scanner}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  width="100%"
                  height="500px"
                  mx={6}
                ></MKBox>
              </Grid>
            </Grid>
            <Grid container alignItems="flex-start" pt={6}>
              <MKBox border="2px solid #F44335" borderRadius="5px" width="100%" p={1}>
                <MKTypography color="error" fontSize="1rem" textAlign="center">
                  Please email your <b>name, mobile number and screenshot</b> of your transaction at{" "}
                  <b>aadarfoundatio2018@gmail.com</b> to get receipt of your contribution.
                </MKTypography>
              </MKBox>
            </Grid>
            <Grid display={"flex"} flexDirection={"column"} alignItems={"center"}>
              <MKTypography
                sx={{
                  fontSize: { md: "1.5rem", lg: "2rem" },
                  fontWeight: "500",
                }}
                pt={8}
                pb={4}
              >
                Bank account details
              </MKTypography>
              <MKTypography fontSize="1.1rem" py={1}>
                <b>Account name - </b>
              </MKTypography>
              <MKTypography fontSize="1.1rem" py={1}>
                <b>Bank name - </b>
              </MKTypography>
              <MKTypography fontSize="1.1rem" py={1}>
                <b>IFSC code - </b>
              </MKTypography>
              <MKTypography fontSize="1.1rem" py={1}>
                <b>Account number - </b>
              </MKTypography>
            </Grid>
            <MKBox
              component="section"
              mt={10}
              py={2}
              mb={2}
              mx={"auto"}
              sx={{
                backgroundColor: "#F8F8F8",
                borderRadius: "20px",
                width: { xs: "100%", sm: "100%" },
                // marginTop: { xs: 2, sm: 4 },
              }}
            >
              <Grid container display="flex" pt={6} justifyContent={"center"} alignItems={"center"}>
                <MKTypography
                  variant="h4"
                  sx={{
                    fontSize: { md: "2rem", lg: "2.5rem" },
                    fontWeight: "500",
                    color: "#ECA533",
                  }}

                  // pb={2}
                >
                  Join Us
                </MKTypography>
                <MKTypography
                  variant="h4"
                  sx={{
                    fontSize: { md: "1.3rem", lg: "1.5rem" },
                    fontWeight: "500",
                  }}
                  pl={4}
                >
                  Here’s how you can take part in our services
                </MKTypography>
              </Grid>
              <Grid container pt={3}>
                <Grid container display={"flex"} justifyContent={"center"} pt={4} lg={6} xl={6}>
                  <MKTypography
                    sx={{
                      fontSize: { md: "1.4rem", lg: "1.5rem" },
                      fontWeight: "400",
                    }}
                    pb={2}
                  >
                    Membership
                  </MKTypography>
                </Grid>
                <Grid container display={"flex"} justifyContent={"center"} pt={4} lg={6} xl={6}>
                  <MKTypography
                    sx={{
                      fontSize: { md: "1.4rem", lg: "1.5rem" },
                      fontWeight: "400",
                    }}
                    pb={2}
                  >
                    Sponsor Prabhuji
                  </MKTypography>
                </Grid>
                {/* <Grid
                  container
                  alignItems="flex-start"
                  pt={6}
                  lg={6}
                  xl={6}
                  display="flex"
                  flexDirection={"column"}
                >
                  <MKTypography
                    sx={{
                      fontSize: { md: "1.4rem", lg: "1.6rem" },
                      fontWeight: "400",
                    }}
                    textAlign="center"
                    pb={4}
                  >
                    Bank account details
                  </MKTypography>
                  <MKTypography fontSize="1.1rem">
                    <b>Account name - </b>
                  </MKTypography>
                  <MKTypography fontSize="1.1rem">
                    <b>Bank name - </b>
                  </MKTypography>
                  <MKTypography fontSize="1.1rem">
                    <b>IFSC code - </b>
                  </MKTypography>
                  <MKTypography fontSize="1.1rem">
                    <b>Account number - </b>
                  </MKTypography>
                </Grid> */}
              </Grid>
            </MKBox>
          </Container>
        </MKBox>
      </Card>

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default Donate;
