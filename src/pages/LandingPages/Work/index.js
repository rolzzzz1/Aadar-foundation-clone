// @mui material components
import Grid from "@mui/material/Grid";

import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Images
import bgImage from "assets/images/smallBrushstroke2.svg";
import bgImage2 from "assets/images/swargSadanBlack.png";
import RescueImg1 from "assets/images/aboutImg.webp";
import RescueImg2 from "assets/images/RescueImg1.jpg";
import TreatmentImg1 from "assets/images/treatment.webp";
import TreatmentImg2 from "assets/images/treatmentImg2.jpg";
import ShelterImg1 from "assets/images/swargSadan.webp";
import FoodImg1 from "assets/images/foodImg1.jpg";
import FoodImg2 from "assets/images/foodImg2.jpg";
// import CareImg1 from "assets/images/careImg1.jpg";
import CareImg2 from "assets/images/aboutPageImg.png";
import RehabilitationImg1 from "assets/images/rehabilitation.jpg";
import RehabilitationImg2 from "assets/images/rehabilitationImg1.jpg";

function Work() {
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
            Our Work
          </MKTypography>
        </MKBox>
      </MKBox>

      <MKBox
        component="section"
        // pt={10}
        pb={8}
        mt={4}
        display="flex"
        justifyContent={"center"}
      >
        <Grid container display="flex" justifyContent={"center"} width="90%" mx={"auto"}>
          <MKBox pb={4}>
            <MKTypography variant="h2">Our Work</MKTypography>
          </MKBox>

          {/* Rescue */}
          <Grid container justifyContent="center" sx={{ textAlign: "center" }} px={6} py={4}>
            <Grid
              item
              xs={12}
              md={6}
              my={"auto"}
              overflow={"hidden"}
              sx={{ display: "flex", gap: "15px" }}
            >
              <MKBox
                component="img"
                src={RescueImg1}
                alt="RescueImg1"
                width="50%"
                borderRadius="10px"
                height="80%"
                minHeight={"160px"}
                maxHeight={"200px"}
              ></MKBox>
              <MKBox
                component="img"
                src={RescueImg2}
                alt="RescueImg1"
                width="45%"
                borderRadius="10px"
                height="80%"
                my={"auto"}
                minHeight={"160px"}
                maxHeight={"200px"}
              ></MKBox>
            </Grid>
            <Grid item xs={12} md={6} px={6} my="auto">
              <MKTypography variant="h3" py={1}>
                Rescue
              </MKTypography>
              <MKTypography variant="body2" fontSize={{ sm: "0.85rem", md: "0.85rem" }}>
                We rescue the homeless, helpless, hopeless, destitute persons generally found in
                very harsh and painful conditions on roadsides, railway stations, bus stands,
                religious and other public places.
              </MKTypography>
            </Grid>
          </Grid>

          {/* Treatment */}
          <Grid container justifyContent="center" sx={{ textAlign: "center" }} px={6} py={4}>
            <Grid item xs={12} md={6} px={6} my="auto">
              <MKTypography variant="h3" py={1}>
                Treatment
              </MKTypography>
              <MKTypography variant="body2" fontSize={{ sm: "0.85rem", md: "0.85rem" }}>
                Most of the residents brought to the Ashram are suffering from different types of
                ailments. Hence medical/surgical treatment plays a significant part in the service
                we offer them.
              </MKTypography>
            </Grid>
            <Grid item xs={12} md={6} overflow={"hidden"} sx={{ display: "flex", gap: "15px" }}>
              <MKBox
                component="img"
                src={TreatmentImg1}
                alt="TreatmentImg1"
                width="50%"
                borderRadius="10px"
                minHeight={"160px"}
                maxHeight={"200px"}
              ></MKBox>
              <MKBox
                component="img"
                src={TreatmentImg2}
                alt="TreatmentImg2"
                width="45%"
                borderRadius="10px"
                minHeight={"160px"}
                maxHeight={"200px"}
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
                minHeight={"160px"}
                maxHeight={"200px"}
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
              <MKTypography variant="h3" py={1}>
                Shelter
              </MKTypography>
              <MKTypography variant="body2" fontSize={{ sm: "0.85rem", md: "0.85rem" }}>
                Currently a home for 92 residents in the ashram.
              </MKTypography>
            </Grid>
          </Grid>

          {/* Food */}
          <Grid container justifyContent="center" sx={{ textAlign: "center" }} px={6} py={4}>
            <Grid item xs={12} md={6} px={6} my="auto">
              <MKTypography variant="h3" py={1}>
                Food
              </MKTypography>
              <MKTypography variant="body2" fontSize={{ sm: "0.85rem", md: "0.85rem" }}>
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
                minHeight={"160px"}
                maxHeight={"200px"}
              ></MKBox>
              <MKBox
                component="img"
                src={FoodImg2}
                alt="RescueImg1"
                width="45%"
                borderRadius="10px"
                minHeight={"160px"}
                maxHeight={"200px"}
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
                minHeight={"160px"}
                maxHeight={"200px"}
              ></MKBox>
            </Grid>
            <Grid item xs={12} md={6} px={6} my="auto">
              <MKTypography variant="h3" py={1}>
                Care
              </MKTypography>
              <MKTypography variant="body2" fontSize={{ sm: "0.85rem", md: "0.85rem" }}>
                During the recovery from illness and further basic care, medical care and
                unconditional love is given to them by our team.
              </MKTypography>
            </Grid>
          </Grid>

          {/* Rehabilitation */}
          <Grid container justifyContent="center" sx={{ textAlign: "center" }} px={6} py={4}>
            <Grid item xs={12} md={6} px={6} my="auto">
              <MKTypography variant="h3" py={1}>
                Rehabilitation
              </MKTypography>
              <MKTypography variant="body2" fontSize={{ sm: "0.85rem", md: "0.85rem" }}>
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
                minHeight={"160px"}
                maxHeight={"200px"}
              ></MKBox>
              <MKBox
                component="img"
                src={RehabilitationImg2}
                alt="RescueImg1"
                width="45%"
                borderRadius="10px"
                minHeight={"160px"}
                maxHeight={"200px"}
              ></MKBox>
            </Grid>
          </Grid>
        </Grid>
      </MKBox>

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default Work;
