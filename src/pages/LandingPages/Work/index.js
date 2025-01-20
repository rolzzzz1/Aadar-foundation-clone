/*
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
// import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
// import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

// import NavTabs from "layouts/sections/navigation/nav-tabs";
// import TabsSimple from "layouts/sections/navigation/nav-tabs/components/TabsSimple";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
// import MKInput from "components/MKInput";
// import MKButton from "components/MKButton";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";
// import bgImage2 from "assets/images/swargSadanBlack.png";
// import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
// import HorizontalTeamCard from "examples/Cards/TeamCards/HorizontalTeamCard";

// import Team from "pages/LandingPages/About/sections/Team";

// Images
import bgImage2 from "assets/images/swargSadanBlack.png";
import RescueImg1 from "assets/images/aboutImg.webp";
import RescueImg2 from "assets/images/RescueImg1.jpg";
import TreatmentImg1 from "assets/images/treatment.webp";
import TreatmentImg2 from "assets/images/treatmentImg2.jpg";
import ShelterImg1 from "assets/images/swargSadan.webp";
import FoodImg1 from "assets/images/foodImg1.jpg";
import FoodImg2 from "assets/images/foodImg2.jpg";
// import CareImg1 from "assets/images/careImg1.jpg";
import CareImg2 from "assets/images/aboutPageImg.webp";
import RehabilitationImg1 from "assets/images/rehabilitation.jpg";
import RehabilitationImg2 from "assets/images/rehabilitationImg1.jpg";

function Work() {
  return (
    <>
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
        my={-10}
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

      <MKBox component="section" pt={10} pb={8} mt={6}>
        <Grid container display="flex" justifyContent={"center"} sx={{ margin: "10px 30px" }}>
          <MKBox pb={4}>
            <MKTypography variant="h2">Our Work</MKTypography>
          </MKBox>

          {/* Rescue */}
          <Grid container justifyContent="center" sx={{ textAlign: "center" }} px={6} py={4}>
            <Grid item xs={12} md={6} overflow={"hidden"} sx={{ display: "flex", gap: "15px" }}>
              <MKBox
                component="img"
                src={RescueImg1}
                alt="RescueImg1"
                width="50%"
                borderRadius="10px"
                minHeight={"300px"}
                maxHeight={"300px"}
              ></MKBox>
              <MKBox
                component="img"
                src={RescueImg2}
                alt="RescueImg1"
                width="40%"
                borderRadius="10px"
                minHeight={"300px"}
                maxHeight={"300px"}
              ></MKBox>
            </Grid>
            <Grid item xs={12} md={6} px={6} my="auto">
              <MKTypography variant="h2" py={1}>
                Rescue
              </MKTypography>
              <MKTypography variant="body1">
                We rescue the homeless, helpless, hopeless, destitute persons generally found in
                very harsh and painful conditions on roadsides, railway stations, bus stands,
                religious and other public places.
              </MKTypography>
            </Grid>
          </Grid>

          {/* Treatment */}
          <Grid container justifyContent="center" sx={{ textAlign: "center" }} px={6} py={4}>
            <Grid item xs={12} md={6} px={6} my="auto">
              <MKTypography variant="h2" py={1}>
                Treatment
              </MKTypography>
              <MKTypography variant="body1">
                Most of the residents brought to the Ashram are suffering from different types of
                ailments. Hence medical/surgical treatment plays a significant part in the service
                we offer them.
              </MKTypography>
            </Grid>
            <Grid item xs={12} md={6} overflow={"hidden"} sx={{ display: "flex", gap: "15px" }}>
              <MKBox
                component="img"
                src={TreatmentImg1}
                alt="RescueImg1"
                width="50%"
                borderRadius="10px"
                minHeight={"300px"}
                maxHeight={"300px"}
              ></MKBox>
              <MKBox
                component="img"
                src={TreatmentImg2}
                alt="RescueImg1"
                width="40%"
                borderRadius="10px"
                minHeight={"300px"}
                maxHeight={"300px"}
              ></MKBox>
            </Grid>
          </Grid>

          {/* Shelter */}
          <Grid container justifyContent="center" sx={{ textAlign: "center" }} px={6} py={4}>
            <Grid item xs={12} md={6} overflow={"hidden"} sx={{ display: "flex", gap: "15px" }}>
              <MKBox
                component="img"
                src={ShelterImg1}
                alt="RescueImg1"
                width="100%"
                borderRadius="10px"
                minHeight={"300px"}
                maxHeight={"300px"}
              ></MKBox>
              {/* <MKBox
                component="img"
                src={TreatmentImg2}
                alt="RescueImg1"
                width="40%"
                borderRadius="10px"
              ></MKBox> */}
            </Grid>
            <Grid item xs={12} md={6} px={6} my="auto">
              <MKTypography variant="h2" py={1}>
                Shelter
              </MKTypography>
              <MKTypography variant="body1">
                Currently a home for 92 residents in the ashram.
              </MKTypography>
            </Grid>
          </Grid>

          {/* Food */}
          <Grid container justifyContent="center" sx={{ textAlign: "center" }} px={6} py={4}>
            <Grid item xs={12} md={6} px={6} my="auto">
              <MKTypography variant="h2" py={1}>
                Food
              </MKTypography>
              <MKTypography variant="body1">
                Most of the rsidents admitted in the ashram are either sick or malnourished.
                Therefore the diet arrangement is a very important and essential part of their
                recovery. With breakfast, lunch, refreshment and dinner, fruits, milk, and protein
                supplements are also made available to them.
              </MKTypography>
            </Grid>
            <Grid item xs={12} md={6} overflow={"hidden"} sx={{ display: "flex", gap: "15px" }}>
              <MKBox
                component="img"
                src={FoodImg1}
                alt="RescueImg1"
                width="50%"
                borderRadius="10px"
                minHeight={"300px"}
                maxHeight={"300px"}
              ></MKBox>
              <MKBox
                component="img"
                src={FoodImg2}
                alt="RescueImg1"
                width="40%"
                borderRadius="10px"
                minHeight={"300px"}
                maxHeight={"300px"}
              ></MKBox>
            </Grid>
          </Grid>

          {/* Care */}
          <Grid container justifyContent="center" sx={{ textAlign: "center" }} px={6} py={4}>
            <Grid item xs={12} md={6} overflow={"hidden"} sx={{ display: "flex", gap: "15px" }}>
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
                width="90%"
                borderRadius="10px"
                minHeight={"300px"}
                maxHeight={"300px"}
              ></MKBox>
            </Grid>
            <Grid item xs={12} md={6} px={6} my="auto">
              <MKTypography variant="h2" py={1}>
                Care
              </MKTypography>
              <MKTypography variant="body1">
                During the recovery from illness and further basic care, medical care and
                unconditional love is given to them by our team.
              </MKTypography>
            </Grid>
          </Grid>

          {/* Rehabilitation */}
          <Grid container justifyContent="center" sx={{ textAlign: "center" }} px={6} py={4}>
            <Grid item xs={12} md={6} px={6} my="auto">
              <MKTypography variant="h2" py={1}>
                Rehabilitation
              </MKTypography>
              <MKTypography variant="body1">
                After recovery with the efforts of the Swarg sadan Team, the residents are reunited
                with their families.
              </MKTypography>
            </Grid>
            <Grid item xs={12} md={6} overflow={"hidden"} sx={{ display: "flex", gap: "15px" }}>
              <MKBox
                component="img"
                src={RehabilitationImg1}
                alt="RescueImg1"
                width="50%"
                borderRadius="10px"
                minHeight={"300px"}
                maxHeight={"300px"}
              ></MKBox>
              <MKBox
                component="img"
                src={RehabilitationImg2}
                alt="RescueImg1"
                width="40%"
                borderRadius="10px"
                minHeight={"300px"}
                maxHeight={"300px"}
              ></MKBox>
            </Grid>
          </Grid>
        </Grid>
      </MKBox>

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Work;
