// @mui material components
import React from "react";

import PropTypes from "prop-types";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
// import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

// Material Kit 2 React layouts
// import TabsSimple from "layouts/sections/navigation/nav-tabs/components/TabsSimple";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

import Team from "pages/LandingPages/About/sections/Team";

// Images
import aboutBgImg from "assets/images/mainThemeImages/swargSadanBlack.png";
import bgImage from "assets/images/mainThemeImages/smallBrushstroke2.svg";
import aboutImg from "assets/images/aboutPageImages/main1.jpg";
import swargSadan from "assets/images/aboutPageImages/swargSadan.webp";
import beforeAfter1 from "assets/images/aboutPageImages/before-after1.png";
import group1 from "assets/images/aboutPageImages/group1.jpg";
import resque1 from "assets/images/aboutPageImages/resque1.jpg";
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
// import CareImg1 from "assets/images/careImg1.jpg";
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

  return (
    <MKBox minWidth="320px">
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

      {/* About section of about page */}

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
            About Us
          </MKTypography>
        </MKBox>
      </MKBox>

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
        <MKBox
          component="section"
          // pt={8} mt={8}
          mb={4}
        >
          <MKButton id="workBtn" sx={{ display: "none" }} onClick={() => scrollToWork()}>
            Our work
          </MKButton>
          <Container>
            <MKBox
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="start"
              // textAlign="center"
            >
              <MKTypography
                variant="h3"
                py={5}
                fontSize={{ xs: "1.2rem", sm: "1.875rem" }}
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                sx={{ letterSpacing: "0.05rem" }}
              >
                Who we are
              </MKTypography>

              <Grid container display="flex" justifyContent={"center"}>
                <Grid lg={6}>
                  <MKBox
                    component="img"
                    src={swargSadan}
                    alt={"Swarg sadan building image"}
                    borderRadius="xxl"
                    width="90%"
                    height="100%"
                  ></MKBox>
                </Grid>
                <Grid lg={6}>
                  <MKTypography
                    variant="body1"
                    // fontSize="1rem"
                    fontSize={{ xs: "0.8rem", md: "1rem" }}
                    fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                    sx={{
                      letterSpacing: "0.05rem",
                      paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                    }}
                  >
                    At Aadar Foundation, we believe that serving humanity is the highest form of
                    worship. With this vision, <b>Mr. Vikas Goswami</b> began his journey of service
                    on <b>July 1, 2015</b>, reaching out to the most vulnerable—those who were
                    wounded, sick, abandoned, or disabled—struggling to survive on the streets. He
                    and his team sought out these individuals at railway stations, bus stands,
                    outside temples, and other places across the city, providing them with first aid
                    and care.
                  </MKTypography>
                </Grid>
              </Grid>
              <MKTypography
                variant="body1"
                fontSize={{ xs: "0.9rem", md: "1.1rem" }}
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                paddingTop="40px"
                paddingBottom="30px"
                sx={{ letterSpacing: "0.05rem" }}
                textAlign="center"
                width="80%"
                mx={"auto"}
              >
                As the mission grew,{" "}
                <b>
                  Aadar Foundation (Ashram Swarg Sadan - a residential home for destitute) was
                  officially established on June 20, 2018, in Gwalior (known as Tansen ki nagari),
                  by Mr. Vikas Goswami and his dedicated colleagues Pawan Suryavanshi, Faizan Beg,
                  Vibha Aneja, Pramod Sumoliya, Sadia Parveen, and Kamal Aneja.
                </b>
              </MKTypography>

              <Grid container display="flex" justifyContent={"center"}>
                <Grid lg={6}>
                  <MKTypography
                    variant="body1"
                    fontSize={{ xs: "0.8rem", md: "1rem" }}
                    fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                    paddingTop="10px"
                    sx={{ letterSpacing: "0.05rem" }}
                  >
                    Since then, Aadar Foundation has been a refuge for the{" "}
                    <b>homeless, abandoned, mentally or physically ill, elderly, and injured</b>,
                    offering them dignity, love, and hope. These individuals, often ignored by
                    society, face hunger, neglect, and deteriorating health. At <b>Swarg Sadan</b>,
                    we provide them with
                    <b>
                      {" "}
                      shelter, nutritious food, medical care, clean clothing, counseling,
                      recreational activities, and a warm, family-like environment.
                    </b>
                  </MKTypography>
                  <MKTypography
                    variant="body1"
                    fontSize={{ xs: "0.8rem", md: "1rem" }}
                    fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                    paddingTop="10px"
                    sx={{ letterSpacing: "0.05rem" }}
                  >
                    Beyond care, we strive to reunite them with their families whenever possible. So
                    far, we have welcomed <b>230 Prabhu Jans (beloved souls) into our ashram</b>,
                    successfully
                    <b> rehabilitating 98 individuals </b> with their families across{" "}
                    <b>13 states in India</b>. Currently, <b>91 Prabhu Jans</b> are receiving
                    full-time care at our facility.
                  </MKTypography>
                </Grid>
                <Grid
                  lg={6}
                  pl={4}
                  my="auto"
                  sx={{ paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" } }}
                >
                  <MKBox
                    component="img"
                    src={aboutImg}
                    alt={"Before after images"}
                    borderRadius="xxl"
                    width="100%"
                  ></MKBox>
                </Grid>
              </Grid>

              <Grid container display="flex" justifyContent={"center"}>
                <Grid pt={6}>
                  <MKTypography
                    variant="body1"
                    fontSize={{ xs: "1rem", md: "1.2rem" }}
                    fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                    // paddingTop="30px"
                    sx={{ letterSpacing: "0.05rem", fontWeight: "500" }}
                    textAlign="center"
                    mx={"auto"}
                    width="80%"
                  >
                    At Aadar Foundation, we are committed to restoring dignity, rekindling hope, and
                    transforming lives—one person at a time.
                  </MKTypography>
                </Grid>
              </Grid>
            </MKBox>

            {/* <MKBox py={4}>
              <TabsSimple />
            </MKBox> */}

            <Grid container lg={12} mt={6} display="flex" justifyContent="center" my={4}>
              <Grid sm={6} md={6} lg={4} px={2} display="flex" justifyContent="center">
                <MKBox
                  component="img"
                  src={resque1}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  // width="100%"
                  // height="90%"
                  sx={{
                    height: { sm: "80%", md: "80%", lg: "90%" },
                    width: { xs: "80%", sm: "80%", md: "80%", lg: "100%" },
                  }}
                  my={2}
                ></MKBox>
              </Grid>
              <Grid sm={6} md={6} lg={4} px={2} display="flex" justifyContent="center">
                <MKBox
                  component="img"
                  src={beforeAfter1}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  // width="100%"
                  // height="80%"
                  sx={{
                    height: { sm: "80%", md: "80%", lg: "80%" },
                    width: { xs: "80%", sm: "80%", md: "80%", lg: "100%" },
                  }}
                  my={2}
                ></MKBox>
              </Grid>
              <Grid sm={12} md={12} lg={4} px={1} display="flex" justifyContent="center">
                <MKBox
                  component="img"
                  src={group1}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  // width="100%"
                  // height="70%"
                  sx={{
                    height: { sm: "80%", md: "80%", lg: "70%" },
                    width: { xs: "80%", sm: "80%", md: "80%", lg: "100%" },
                  }}
                  my={2}
                ></MKBox>
              </Grid>
            </Grid>

            <Grid
              py={4}
              md={12}
              pb={1}
              sx={{ marginTop: { sm: -10, md: -14, lg: 0 } }}
              // id="workSection"
            >
              <MKTypography
                variant="h3"
                fontSize={{ xs: "1.5rem", sm: "1.875rem" }}
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                ref={workSection}
              >
                Our work
              </MKTypography>

              <MKTypography
                variant="h3"
                fontSize={{ xs: "1.2rem", sm: "1.5rem" }}
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                pt={4}
                sx={{ fontWeight: "500" }}
              >
                What we do
              </MKTypography>

              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                mx="auto"
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                At Aadar Foundation, we are dedicated to providing care, support, and dignity to the
                homeless, helpless, and abandoned. Our mission is to bring hope and a new life to
                those who are critically ill, injured, hungry, or left alone at railway stations,
                religious sites, streets, and other public places. Through our shelter, Swarg Sadan,
                we offer food, medical care, counseling, clean clothing, and entertainment—all
                completely free, made possible through social cooperation and generous
                contributions.
              </MKTypography>
              <MKTypography
                variant="h3"
                fontSize={{ xs: "1.2rem", sm: "1.5rem" }}
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                pt={4}
                sx={{ fontWeight: "500" }}
              >
                Key aspects of our work
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
                      Rescue
                    </MKTypography>
                    <MKTypography fontSize="0.9rem" sx={{ letterSpacing: "0.05rem" }}>
                      We rescue homeless and destitute individuals who are often found in severe and
                      distressing conditions on roadsides, railway stations, bus stands, religious
                      sites, and other public places.
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
                    // mt={4}
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
                    ></MKBox>
                    <MKBox
                      component="img"
                      src={RescueImg3}
                      alt="RescueImg1"
                      width="30%"
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
                      Treatment
                    </MKTypography>
                    <MKTypography fontSize="0.9rem" sx={{ letterSpacing: "0.05rem" }}>
                      Most residents brought to the Ashram suffer from various ailments, making
                      medical and surgical treatment a vital part of the care we provide.
                    </MKTypography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={8}
                    overflow={"hidden"}
                    // mt={4}
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
                    ></MKBox>
                    <MKBox
                      component="img"
                      src={TreatmentImg2}
                      alt="TreatmentImg2"
                      width="40%"
                      borderRadius="10px"
                      minHeight={"180px"}
                      maxHeight={"180px"}
                    ></MKBox>
                  </Grid>
                </Grid>

                {/* Shelter */}
                <Grid
                  container
                  justifyContent="center"
                  // sx={{ textAlign: "center" }} px={6}
                  py={4}
                >
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={4}
                    // px={6}
                    pr={10}
                    my="auto"
                  >
                    <MKTypography
                      variant="h3"
                      py={1}
                      fontSize={{ xs: "1.1rem", sm: "1.3rem" }}
                      fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                      sx={{ fontWeight: "500" }}
                    >
                      Shelter
                    </MKTypography>
                    <MKTypography fontSize="0.9rem" mx="auto" sx={{ letterSpacing: "0.05rem" }}>
                      We provide a shelter with homely environment to our residents of Swarg sadan.
                      Currently a home for 92 residents in the ashram.
                    </MKTypography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={8}
                    overflow={"hidden"}
                    // mt={4}
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
                      width="40%"
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
                    ></MKBox>
                  </Grid>
                </Grid>

                {/* Food */}
                <Grid
                  container
                  justifyContent="center"
                  // sx={{ textAlign: "center" }} px={6}
                  py={4}
                >
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={4}
                    // px={6}
                    pr={2}
                    my="auto"
                  >
                    <MKTypography
                      variant="h3"
                      py={1}
                      fontSize={{ xs: "1.1rem", sm: "1.3rem" }}
                      fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                      sx={{ fontWeight: "500" }}
                    >
                      Food
                    </MKTypography>
                    <MKTypography fontSize="0.9rem" mx="auto" sx={{ letterSpacing: "0.05rem" }}>
                      Most of the residents admitted in the ashram are either sick or malnourished.
                      Therefore the diet arrangement is a essential part of their recovery. Under
                      medical guidance, we provide balanced meals, along with milk, fruits, and
                      protein-rich foods to aid their recovery and well-being.
                    </MKTypography>
                    {/* Most of the residents admitted in the ashram are either sick or malnourished.
                      Therefore the diet arrangement is a very important and essential part of their
                      recovery. With breakfast, lunch, refreshment and dinner, fruits, milk, and
                      protein supplements are also made available to them. */}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={8}
                    overflow={"hidden"}
                    // mt={4}
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
                      // height="90%"
                      minHeight={"180px"}
                      maxHeight={"180px"}
                    ></MKBox>
                    <MKBox
                      component="img"
                      src={FoodImg2}
                      alt="RescueImg1"
                      width="40%"
                      // height="90%"
                      borderRadius="10px"
                      minHeight={"180px"}
                      maxHeight={"180px"}
                    ></MKBox>
                  </Grid>
                </Grid>

                {/* Care */}
                <Grid
                  container
                  justifyContent="center"
                  // sx={{ textAlign: "center" }} px={6}
                  py={4}
                >
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={4}
                    // px={6}
                    pr={10}
                    my="auto"
                  >
                    <MKTypography
                      variant="h3"
                      py={1}
                      fontSize={{ xs: "1.1rem", sm: "1.3rem" }}
                      fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                      sx={{ fontWeight: "500" }}
                    >
                      Care
                    </MKTypography>
                    <MKTypography fontSize="0.9rem" mx="auto" sx={{ letterSpacing: "0.05rem" }}>
                      During the recovery from illness and further basic care, medical care and
                      unconditional love is given to them by our team.
                    </MKTypography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={8}
                    overflow={"hidden"}
                    // mt={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "15px",
                      marginTop: { xs: 4, sm: 4, md: 4, lg: 0 },
                    }}
                  >
                    {/* <MKBox
                component="img"
                src={CareImg1}
                alt="RescueImg1"
                width="40%"
                borderRadius="10px"
                minHeight={"300px"}
                maxHeight={"300px"}
              ></MKBox> */}
                    <MKBox
                      component="img"
                      src={CareImg2}
                      alt="RescueImg1"
                      width="60%"
                      borderRadius="10px"
                      minHeight={"200px"}
                      maxHeight={"200px"}
                    ></MKBox>
                  </Grid>
                </Grid>

                {/* Rehabilitation */}
                <Grid
                  container
                  justifyContent="center"
                  // sx={{ textAlign: "center" }} px={6}
                  py={4}
                >
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={4}
                    // px={6}
                    pr={10}
                    my="auto"
                  >
                    <MKTypography
                      variant="h3"
                      py={1}
                      fontSize={{ xs: "1.1rem", sm: "1.3rem" }}
                      fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                      sx={{ fontWeight: "500" }}
                    >
                      Rehabilitation
                    </MKTypography>
                    <MKTypography fontSize="0.9rem" mx="auto" sx={{ letterSpacing: "0.05rem" }}>
                      After recovery with the efforts of the Swarg Sadan Team, we have reunited many
                      residents with their families.
                    </MKTypography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={8}
                    overflow={"hidden"}
                    // mt={4}
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
                      width="40%"
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
                In addition to supporting the homeless, we have also extended our efforts to
                orphaned girls through the Grah Se After Care Yojana, a program run by the Women and
                Child Development Department. Here, the girls receive education and vocational
                training in fields like computer skills, sewing, knitting, and beauty care,
                empowering them to build independent and self-sufficient lives. Our organization has
                also facilitated the marriages of 10 young women, helping them embark on a new
                chapter with dignity and security.
              </MKTypography>
              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                mx="auto"
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem", fontWeight: "500" }}
              >
                Aadar Foundation operates with complete transparency, relying on social and economic
                support. Every contribution—whether financial, material, or voluntary—plays a
                crucial role in sustaining our mission. Visitors and donors who witness our work
                firsthand are deeply moved by the dedication of our team and the compassionate
                environment we have created.
              </MKTypography>
              <MKTypography
                mx="auto"
                paddingTop="60px"
                sx={{ letterSpacing: "0.05rem", fontWeight: "500" }}
                width="80%"
                textAlign="center"
                fontSize={{ xs: "0.9rem", md: "1.1rem" }}
              >
                We invite all individuals who believe in selfless service to join us in transforming
                lives and making the world a kinder place. Together, we can restore hope and dignity
                to those in need.
              </MKTypography>
            </Grid>

            <Grid container lg={12} mt={6} display="flex" justifyContent="center" my={4}>
              <Grid sm={6} md={6} lg={4} px={2} display="flex" justifyContent="center">
                <MKBox
                  component="img"
                  src={food}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  // width="100%"
                  sx={{
                    height: { xs: "90%", sm: "80%", md: "80%", lg: "60%" },
                    width: { xs: "80%", sm: "80%", md: "80%", lg: "100%" },
                  }}
                  // height="70%"
                  my={2}
                ></MKBox>
              </Grid>
              <Grid sm={6} md={6} lg={4} px={1} display="flex" justifyContent="center">
                <MKBox
                  component="img"
                  src={celebration}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  // width="100%"
                  sx={{
                    height: { xs: "90%", sm: "80%", md: "80%", lg: "70%" },
                    width: { xs: "80%", sm: "80%", md: "80%", lg: "100%" },
                  }}
                  // height="80%"
                  my={2}
                ></MKBox>
              </Grid>
              <Grid sm={12} md={12} lg={4} px={2} display="flex" justifyContent="center">
                <MKBox
                  component="img"
                  src={team}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  // width="100%"
                  sx={{
                    height: { xs: "90%", sm: "80%", md: "80%", lg: "80%" },
                    width: { xs: "80%", sm: "80%", md: "80%", lg: "100%" },
                  }}
                  // height="90%"
                  my={2}
                ></MKBox>
              </Grid>
            </Grid>

            <Grid py={4} md={12} pb={1} my={{ xs: -6, sm: -10 }}>
              <MKTypography
                variant="h3"
                py={3}
                fontSize={{ xs: "1.2rem", sm: "1.875rem" }}
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
              >
                How we work
              </MKTypography>
              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                paddingTop="10px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                Helpless and destitute individuals, the focus of our work, often cannot reach the
                Ashram on their own. Our dedicated ambulance and rescue team, in collaboration with
                the police and government organizations, ensure their safe arrival. Once admitted,
                they receive essential care and medical treatment. Efforts are then made, with the
                support of authorities, to rehabilitate them with their families whenever possible.
              </MKTypography>

              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                <b>Leadership & Governance</b>
              </MKTypography>
              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                paddingTop="10px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                To ensure the smooth operation of our ashram, we have a dedicated Executive
                Committee and Core Team in place. The Core Team oversees daily management, resource
                allocation, and system maintenance, while the Executive Committee conducts quarterly
                reviews of ashram activities. The committee prepares detailed reports, which are
                presented in Core Team meetings, allowing for continuous evaluation and necessary
                improvements.
              </MKTypography>
              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                <b>Medical facility</b>
              </MKTypography>
              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                paddingTop="10px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                Most of the residents brought to the Ashram are suffering from different types of
                ailments. Hence medical/surgical treatment plays a significant part in the service
                we offer them. There is a team of doctors who are available to offer their services
                to our Ashram. For patients who are in a more critical condition, there is an
                arrangement with local hospitals where medical investigations and treatments
                (medical and surgical) are provided to our residents.
              </MKTypography>

              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                <b>Celebrations & Community Engagement</b>
              </MKTypography>
              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                paddingTop="10px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                We believe in fostering a sense of joy, belonging, and cultural inclusivity. Our
                ashram celebrates festivals like Holi, Diwali, Bhai Dooj, and Rakshabandhan, as well
                as Ganesh Puja, Ramzan, and Eid, respecting the diverse faiths of our residents. To
                uplift spirits, we organize musical performances, dance and singing sessions, and
                community-led celebrations, including birthday and anniversary events hosted by
                well-wishers. These activities bring happiness and strengthen the sense of family
                among our residents.
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
