import { Link } from "react-router-dom";

// i18next imports
import { useTranslation } from "react-i18next";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Routes
import getRoutes from "routes1";
import getFooterRoutes from "footer.routes1";

// Images
import bgImage2 from "assets/images/mainThemeImages/swargSadanBlack.png";
import bgImage from "assets/images/mainThemeImages/smallBrushstroke2.svg";

function Contact() {
  const { t } = useTranslation();
  const routes = getRoutes(t);
  const footerRoutes = getFooterRoutes(t);
  const donateBtn = t("navbar.donateBtn");
  const contactPage = t("contactPage");

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
            {contactPage.tagLine}
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
            <Grid container alignItems="center">
              <Grid
                item
                md={12}
                lg={4}
                sx={{
                  mb: { xs: 8, md: 8, lg: 0 },
                }}
              >
                <MKTypography variant="h4" sx={{ fontWeight: "500" }} pb={4}>
                  {contactPage.title}
                </MKTypography>
                <MKTypography
                  variant="body1"
                  paddingTop="15px"
                  fontSize="1.2rem"
                  sx={{ fontWeight: "600" }}
                >
                  {contactPage.address.label}
                </MKTypography>
                <MKTypography variant="body1" fontSize="1rem" maxWidth="350px">
                  <b>{contactPage.address.title}</b> <br />
                  {contactPage.address.address}
                </MKTypography>

                <MKTypography
                  variant="body1"
                  paddingTop="15px"
                  fontSize="1.2rem"
                  sx={{ fontWeight: "600" }}
                >
                  {contactPage.phoneNumber.label}
                </MKTypography>
                <MKTypography variant="body1" fontSize="1rem">
                  +91 9039129571, +91 9826441863, +91 9630982392
                </MKTypography>

                <MKTypography
                  variant="body1"
                  paddingTop="15px"
                  fontSize="1.2rem"
                  sx={{ fontWeight: "600" }}
                >
                  {contactPage.emailLabel}
                </MKTypography>
                <MKTypography variant="body1" fontSize="1rem">
                  aadarfoundatio2018@gmail.com
                </MKTypography>
              </Grid>
              <Grid item xs={12} md={12} lg={8} sx={{ mx: "auto" }}>
                <MKBox
                  position="relative"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  sx={{ alignItems: { sm: "start", md: "start", lg: "center" } }}
                  gap="30px"
                >
                  <MKTypography
                    fontSize="1.3rem"
                    textAlign={{ xs: "center", sm: "left" }}
                    sx={{ fontWeight: "600" }}
                  >
                    {contactPage.followUs}
                  </MKTypography>
                  <MKBox display="flex" justifyContent="center" gap={{ xs: "30px", sm: "40px" }}>
                    <MKBox
                      component={Link}
                      to={"https://www.youtube.com/@AadarFoundation/"}
                      target={"_blank"}
                      sx={{
                        backgroundColor: "#ECA533",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        "&:hover": {
                          boxShadow:
                            "0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19)",
                        },
                      }}
                      px={{ xs: 1, sm: 2 }}
                      py={{ xs: 1, sm: 1 }}
                    >
                      <YouTubeIcon
                        fontSize="large"
                        sx={{
                          color: "#ffffff",
                        }}
                      />
                    </MKBox>

                    <MKBox
                      component={Link}
                      to={"https://www.instagram.com/ashramswargsadangwalior/"}
                      target={"_blank"}
                      sx={{
                        backgroundColor: "#ECA533",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        "&:hover": {
                          boxShadow:
                            "0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19)",
                        },
                      }}
                      px={{ xs: 1, sm: 2 }}
                      py={{ xs: 1, sm: 1 }}
                    >
                      <InstagramIcon fontSize="large" sx={{ color: "#ffffff" }} />
                    </MKBox>
                    <MKBox
                      component={Link}
                      to={"https://www.facebook.com/AshramSwargSadanGwalior/"}
                      target={"_blank"}
                      sx={{
                        backgroundColor: "#ECA533",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        "&:hover": {
                          boxShadow:
                            "0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19)",
                        },
                      }}
                      px={{ xs: 1, sm: 2 }}
                      py={{ xs: 1, sm: 1 }}
                    >
                      <FacebookIcon fontSize="large" sx={{ color: "#ffffff" }} />
                    </MKBox>
                  </MKBox>
                </MKBox>
              </Grid>
            </Grid>
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

export default Contact;
