import React from "react";
import PropTypes from "prop-types";

// i18next imports
import { useTranslation } from "react-i18next";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Routes
import getRoutes from "routes1";
import getFooterRoutes from "footer.routes1";

// About page sections files
import Team from "pages/LandingPages/About/sections/Team";
import WhoWeAre from "pages/LandingPages/About/sections/WhoWeAre";

// Images
import aboutBgImg from "assets/images/mainThemeImages/swargSadanBlack.png";
import bgImage from "assets/images/mainThemeImages/smallBrushstroke2.svg";
import food from "assets/images/aboutPageImages/foodAboutpage.jpg";
import team from "assets/images/aboutPageImages/teamImg.jpg";
import celebration from "assets/images/aboutPageImages/celebration.jpeg";
import RescueImg1 from "assets/images/ourWorkImages/aboutImg.webp";
import RescueImg2 from "assets/images/ourWorkImages/RescueImg1.jpg";
import RescueImg3 from "assets/images/ourWorkImages/resque3.jpg";
import TreatmentImg1 from "assets/images/ourWorkImages/treatment.webp";
import TreatmentImg2 from "assets/images/ourWorkImages/treatmentImg2.jpg";
import ShelterImg1 from "assets/images/ourWorkImages/shelter1.jpg";
import ShelterImg2 from "assets/images/ourWorkImages/shelter2.jpg";
import FoodImg1 from "assets/images/ourWorkImages/foodImg1.jpg";
import FoodImg2 from "assets/images/ourWorkImages/food2.jpg";
import CareImg2 from "assets/images/ourWorkImages/aboutPageImg.png";
import RehabilitationImg1 from "assets/images/ourWorkImages/rehabilitation.jpg";
import RehabilitationImg2 from "assets/images/ourWorkImages/rehabilitationImg1.jpg";

function About(props) {
  const [workSectionOn, setWorkSectionOn] = React.useState(false);
  const workSection = React.useRef();

  function scrollToWork() {
    setWorkSectionOn(true);

    setTimeout(() => {
      setWorkSectionOn(false);
    }, 2000);
  }

  React.useEffect(() => {
    if (props.isWorkOn) {
      document.getElementById("workBtn").click();
    }
  }, []);

  React.useEffect(() => {
    if (workSectionOn !== false && workSection.current !== null) {
      setTimeout(function () {
        workSection.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [workSectionOn]);

  const { t } = useTranslation();
  const routes = getRoutes(t);
  const footerRoutes = getFooterRoutes(t);
  const donateBtn = t("navbar.donateBtn");
  const aboutUsPage = t("aboutUsPage");

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
          backgroundImage: `url(${aboutBgImg})`,
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
            {aboutUsPage.title}
          </MKTypography>
        </MKBox>
      </MKBox>

      {/* Main section of about/our work page */}

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
        <MKBox component="section" mb={4}>
          <MKButton id="workBtn" sx={{ display: "none" }} onClick={() => scrollToWork()}>
            Our work
          </MKButton>
          <Container>
            {/* Who we are MKBox section */}

            <WhoWeAre />

            {/* Our work, what we do section */}

            <Grid py={4} md={12} pb={1} sx={{ marginTop: { sm: -10, md: -14, lg: 0 } }}>
              <MKTypography
                variant="h3"
                fontSize={{ xs: "1.5rem", sm: "1.875rem" }}
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                ref={workSection}
              >
                {aboutUsPage.ourWorkSection.title}
              </MKTypography>

              <MKTypography
                variant="h3"
                fontSize={{ xs: "1.2rem", sm: "1.5rem" }}
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                pt={4}
                sx={{ fontWeight: "500" }}
              >
                {aboutUsPage.ourWorkSection.whatWeDoSection.title}
              </MKTypography>

              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                mx="auto"
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                {aboutUsPage.ourWorkSection.whatWeDoSection.description}
              </MKTypography>
              <MKTypography
                variant="h3"
                fontSize={{ xs: "1.2rem", sm: "1.5rem" }}
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                pt={4}
                sx={{ fontWeight: "500" }}
              >
                {aboutUsPage.ourWorkSection.keyAspectsSection.title}
              </MKTypography>

              {/* Our work page section */}
              <Grid container display="flex" justifyContent={"flex-start"} width="100%">
                {/* Rescue */}
                <Grid container justifyContent="center" py={4}>
                  <Grid item xs={12} md={12} lg={4} pr={4} my="auto">
                    <MKTypography
                      variant="h3"
                      py={1}
                      fontSize={{ xs: "1.1rem", sm: "1.3rem" }}
                      fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                      sx={{ fontWeight: "500" }}
                    >
                      {aboutUsPage.ourWorkSection.keyAspectsSection.work1.title}
                    </MKTypography>
                    <MKTypography fontSize="0.9rem" sx={{ letterSpacing: "0.05rem" }}>
                      {aboutUsPage.ourWorkSection.keyAspectsSection.work1.description}
                    </MKTypography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={8}
                    my={"auto"}
                    overflow={"hidden"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "15px",
                      marginTop: { xs: 4, sm: 4, md: 4, lg: 0 },
                    }}
                  >
                    <MKBox
                      component="img"
                      src={RescueImg1}
                      alt="RescueImg1"
                      width="30%"
                      borderRadius="10px"
                      height="80%"
                      minHeight={"180px"}
                      maxHeight={"180px"}
                      display={{ xs: "none", sm: "none", md: "block", lg: "block" }}
                    ></MKBox>

                    <MKBox
                      component="img"
                      src={RescueImg2}
                      alt="RescueImg1"
                      width="30%"
                      borderRadius="10px"
                      height="80%"
                      my={"auto"}
                      minHeight={"180px"}
                      maxHeight={"180px"}
                      display={{ xs: "none", sm: "none", md: "block", lg: "block" }}
                    ></MKBox>
                    <MKBox
                      component="img"
                      src={RescueImg3}
                      alt="RescueImg1"
                      width="80%"
                      borderRadius="10px"
                      height="80%"
                      my={"auto"}
                      minHeight={"180px"}
                      maxHeight={"180px"}
                    ></MKBox>
                  </Grid>
                </Grid>

                {/* Treatment */}
                <Grid container justifyContent="center" py={4}>
                  <Grid item xs={12} md={12} lg={4} pr={4} my="auto">
                    <MKTypography
                      variant="h3"
                      py={1}
                      fontSize={{ xs: "1.1rem", sm: "1.3rem" }}
                      fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                      sx={{ fontWeight: "500" }}
                    >
                      {aboutUsPage.ourWorkSection.keyAspectsSection.work2.title}
                    </MKTypography>
                    <MKTypography fontSize="0.9rem" sx={{ letterSpacing: "0.05rem" }}>
                      {aboutUsPage.ourWorkSection.keyAspectsSection.work2.description}
                    </MKTypography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={8}
                    overflow={"hidden"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "15px",
                      marginTop: { xs: 4, sm: 4, md: 4, lg: 0 },
                    }}
                  >
                    <MKBox
                      component="img"
                      src={TreatmentImg1}
                      alt="TreatmentImg1"
                      width="40%"
                      borderRadius={"10px"}
                      minHeight={"180px"}
                      maxHeight={"180px"}
                      display={{ xs: "none", sm: "none", md: "block", lg: "block" }}
                    ></MKBox>
                    <MKBox
                      component="img"
                      src={TreatmentImg2}
                      alt="TreatmentImg2"
                      width={{ xs: "80%", sm: "60%", md: "40%" }}
                      borderRadius="10px"
                      minHeight={"180px"}
                      maxHeight={"180px"}
                    ></MKBox>
                  </Grid>
                </Grid>

                {/* Shelter */}
                <Grid container justifyContent="center" py={4}>
                  <Grid item xs={12} md={12} lg={4} pr={10} my="auto">
                    <MKTypography
                      variant="h3"
                      py={1}
                      fontSize={{ xs: "1.1rem", sm: "1.3rem" }}
                      fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                      sx={{ fontWeight: "500" }}
                    >
                      {aboutUsPage.ourWorkSection.keyAspectsSection.work3.title}
                    </MKTypography>
                    <MKTypography fontSize="0.9rem" mx="auto" sx={{ letterSpacing: "0.05rem" }}>
                      {aboutUsPage.ourWorkSection.keyAspectsSection.work3.description}
                    </MKTypography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={8}
                    overflow={"hidden"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "15px",
                      marginTop: { xs: 4, sm: 4, md: 4, lg: 0 },
                    }}
                  >
                    <MKBox
                      component="img"
                      src={ShelterImg1}
                      alt="RescueImg1"
                      width={{ xs: "80%", sm: "60%", md: "40%" }}
                      borderRadius="10px"
                      minHeight={"180px"}
                      maxHeight={"180px"}
                    ></MKBox>
                    <MKBox
                      component="img"
                      src={ShelterImg2}
                      alt="RescueImg1"
                      width="40%"
                      borderRadius="10px"
                      minHeight={"180px"}
                      maxHeight={"180px"}
                      display={{ xs: "none", sm: "none", md: "block", lg: "block" }}
                    ></MKBox>
                  </Grid>
                </Grid>

                {/* Food */}
                <Grid container justifyContent="center" py={4}>
                  <Grid item xs={12} md={12} lg={4} pr={2} my="auto">
                    <MKTypography
                      variant="h3"
                      py={1}
                      fontSize={{ xs: "1.1rem", sm: "1.3rem" }}
                      fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                      sx={{ fontWeight: "500" }}
                    >
                      {aboutUsPage.ourWorkSection.keyAspectsSection.work4.title}
                    </MKTypography>
                    <MKTypography fontSize="0.9rem" mx="auto" sx={{ letterSpacing: "0.05rem" }}>
                      {aboutUsPage.ourWorkSection.keyAspectsSection.work4.description}
                    </MKTypography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={8}
                    overflow={"hidden"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "15px",
                      marginTop: { xs: 4, sm: 4, md: 4, lg: 0 },
                    }}
                  >
                    <MKBox
                      component="img"
                      src={FoodImg1}
                      alt="RescueImg1"
                      width="40%"
                      borderRadius="10px"
                      minHeight={"180px"}
                      maxHeight={"180px"}
                      display={{ xs: "none", sm: "none", md: "block", lg: "block" }}
                    ></MKBox>
                    <MKBox
                      component="img"
                      src={FoodImg2}
                      alt="RescueImg1"
                      width={{ xs: "80%", sm: "60%", md: "40%" }}
                      borderRadius="10px"
                      minHeight={"180px"}
                      maxHeight={"180px"}
                    ></MKBox>
                  </Grid>
                </Grid>

                {/* Care */}
                <Grid container justifyContent="center" py={4}>
                  <Grid item xs={12} md={12} lg={4} pr={10} my="auto">
                    <MKTypography
                      variant="h3"
                      py={1}
                      fontSize={{ xs: "1.1rem", sm: "1.3rem" }}
                      fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                      sx={{ fontWeight: "500" }}
                    >
                      {aboutUsPage.ourWorkSection.keyAspectsSection.work5.title}
                    </MKTypography>
                    <MKTypography fontSize="0.9rem" mx="auto" sx={{ letterSpacing: "0.05rem" }}>
                      {aboutUsPage.ourWorkSection.keyAspectsSection.work5.description}
                    </MKTypography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={8}
                    overflow={"hidden"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "15px",
                      marginTop: { xs: 4, sm: 4, md: 4, lg: 0 },
                    }}
                  >
                    <MKBox
                      component="img"
                      src={CareImg2}
                      alt="RescueImg1"
                      width={{ xs: "100%", sm: "60%", md: "60%" }}
                      borderRadius="10px"
                      minHeight={"200px"}
                      maxHeight={"200px"}
                    ></MKBox>
                  </Grid>
                </Grid>

                {/* Rehabilitation */}
                <Grid container justifyContent="center" py={4}>
                  <Grid item xs={12} md={12} lg={4} pr={10} my="auto">
                    <MKTypography
                      variant="h3"
                      py={1}
                      fontSize={{ xs: "1.1rem", sm: "1.3rem" }}
                      fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                      sx={{ fontWeight: "500" }}
                    >
                      {aboutUsPage.ourWorkSection.keyAspectsSection.work6.title}
                    </MKTypography>
                    <MKTypography fontSize="0.9rem" mx="auto" sx={{ letterSpacing: "0.05rem" }}>
                      {aboutUsPage.ourWorkSection.keyAspectsSection.work6.description}
                    </MKTypography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={8}
                    overflow={"hidden"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "15px",
                      marginTop: { xs: 4, sm: 4, md: 4, lg: 0 },
                    }}
                  >
                    <MKBox
                      component="img"
                      src={RehabilitationImg1}
                      alt="RescueImg1"
                      width={{ xs: "60%", sm: "60%", md: "40%" }}
                      borderRadius="10px"
                      minHeight={"200px"}
                      maxHeight={"200px"}
                    ></MKBox>

                    <MKBox
                      component="img"
                      src={RehabilitationImg2}
                      alt="RescueImg1"
                      width="40%"
                      borderRadius="10px"
                      minHeight={"200px"}
                      maxHeight={"200px"}
                      display={{ xs: "none", sm: "none", md: "block", lg: "block" }}
                    ></MKBox>
                  </Grid>
                </Grid>
              </Grid>

              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                mx="auto"
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                {aboutUsPage.ourWorkSection.keyAspectsSection.description1}
              </MKTypography>
              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                mx="auto"
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem", fontWeight: "500" }}
              >
                <b>{aboutUsPage.ourWorkSection.keyAspectsSection.description2}</b>
              </MKTypography>
              <MKTypography
                mx="auto"
                paddingTop="60px"
                sx={{ letterSpacing: "0.05rem", fontWeight: "500" }}
                width="80%"
                textAlign="center"
                fontSize={{ xs: "0.9rem", md: "1.1rem" }}
              >
                <b>{aboutUsPage.ourWorkSection.keyAspectsSection.description3}</b>
              </MKTypography>
              <Grid container lg={12} mt={6} display="flex" justifyContent="center" my={4}>
                <Grid sm={6} md={6} lg={4} px={2} display="flex" justifyContent="center">
                  <MKBox
                    component="img"
                    src={food}
                    alt={"Swarg sadan building image"}
                    borderRadius="xxl"
                    sx={{
                      height: { xs: "90%", sm: "80%", md: "80%", lg: "60%" },
                      width: { xs: "80%", sm: "80%", md: "80%", lg: "100%" },
                    }}
                    my={2}
                  ></MKBox>
                </Grid>
                <Grid sm={6} md={6} lg={4} px={1} display="flex" justifyContent="center">
                  <MKBox
                    component="img"
                    src={celebration}
                    alt={"Swarg sadan building image"}
                    borderRadius="xxl"
                    sx={{
                      height: { xs: "90%", sm: "80%", md: "80%", lg: "70%" },
                      width: { xs: "80%", sm: "80%", md: "80%", lg: "100%" },
                    }}
                    my={2}
                  ></MKBox>
                </Grid>
                <Grid sm={12} md={12} lg={4} px={2} display="flex" justifyContent="center">
                  <MKBox
                    component="img"
                    src={team}
                    alt={"Swarg sadan building image"}
                    borderRadius="xxl"
                    sx={{
                      height: { xs: "90%", sm: "80%", md: "80%", lg: "80%" },
                      width: { xs: "80%", sm: "80%", md: "80%", lg: "100%" },
                    }}
                    my={2}
                  ></MKBox>
                </Grid>
              </Grid>
            </Grid>

            {/* How we work section */}
            <Grid py={4} md={12} pb={1} mt={{ xs: -6, sm: -8, md: -10, lg: -14 }}>
              <MKTypography
                variant="h3"
                py={3}
                fontSize={{ xs: "1.2rem", sm: "1.875rem" }}
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
              >
                {aboutUsPage.howWeWorkSection.title}
              </MKTypography>
              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                paddingTop="10px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                {aboutUsPage.howWeWorkSection.description}
              </MKTypography>

              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                <b>{aboutUsPage.howWeWorkSection.work1.title}</b>
              </MKTypography>
              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                paddingTop="10px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                {aboutUsPage.howWeWorkSection.work1.description}
              </MKTypography>
              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                <b>{aboutUsPage.howWeWorkSection.work2.title}</b>
              </MKTypography>
              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                paddingTop="10px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                {aboutUsPage.howWeWorkSection.work2.description}
              </MKTypography>

              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                <b>{aboutUsPage.howWeWorkSection.work3.title}</b>
              </MKTypography>
              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                paddingTop="10px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                {aboutUsPage.howWeWorkSection.work3.description}
              </MKTypography>
            </Grid>
          </Container>
        </MKBox>
        {/* Team component of about us page */}
        <Team />
      </Card>

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

// Setting default values for the props of DefaultNavbar
About.defaultProps = {
  isWorkOn: false,
};

// Typechecking props for the DefaultNavbar
About.propTypes = {
  isWorkOn: PropTypes.bool,
};

export default About;
