// @mui material components
import React from "react";

import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Images
// import aboutImg from "assets/images/aboutPageImages/main1.jpg";
// import swargSadan from "assets/images/aboutPageImages/swargSadan.webp";
// import beforeAfter1 from "assets/images/aboutPageImages/before-after1.png";
// import group1 from "assets/images/aboutPageImages/group1.jpg";
// import resque1 from "assets/images/aboutPageImages/resque1.jpg";
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

function OurWork() {
  return React.forwardRef((ref) => {
    return (
      <Grid py={4} md={12} pb={1} sx={{ marginTop: { sm: -10, md: -14, lg: 0 } }}>
        <MKTypography
          variant="h3"
          fontSize={{ xs: "1.5rem", sm: "1.875rem" }}
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          ref={ref}
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
          homeless, helpless, and abandoned. Our mission is to bring hope and a new life to those
          who are critically ill, injured, hungry, or left alone at railway stations, religious
          sites, streets, and other public places. Through our shelter, Swarg Sadan, we offer food,
          medical care, counseling, clean clothing, and entertainment—all completely free, made
          possible through social cooperation and generous contributions.
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
                distressing conditions on roadsides, railway stations, bus stands, religious sites,
                and other public places.
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
                Most residents brought to the Ashram suffer from various ailments, making medical
                and surgical treatment a vital part of the care we provide.
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
                Therefore the diet arrangement is a essential part of their recovery. Under medical
                guidance, we provide balanced meals, along with milk, fruits, and protein-rich foods
                to aid their recovery and well-being.
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
          In addition to supporting the homeless, we have also extended our efforts to orphaned
          girls through the Grah Se After Care Yojana, a program run by the Women and Child
          Development Department. Here, the girls receive education and vocational training in
          fields like computer skills, sewing, knitting, and beauty care, empowering them to build
          independent and self-sufficient lives. Our organization has also facilitated the marriages
          of 10 young women, helping them embark on a new chapter with dignity and security.
        </MKTypography>
        <MKTypography
          fontSize={{ xs: "0.8rem", md: "1rem" }}
          mx="auto"
          paddingTop="20px"
          sx={{ letterSpacing: "0.05rem", fontWeight: "500" }}
        >
          Aadar Foundation operates with complete transparency, relying on social and economic
          support. Every contribution—whether financial, material, or voluntary—plays a crucial role
          in sustaining our mission. Visitors and donors who witness our work firsthand are deeply
          moved by the dedication of our team and the compassionate environment we have created.
        </MKTypography>
        <MKTypography
          mx="auto"
          paddingTop="60px"
          sx={{ letterSpacing: "0.05rem", fontWeight: "500" }}
          width="80%"
          textAlign="center"
          fontSize={{ xs: "0.9rem", md: "1.1rem" }}
        >
          We invite all individuals who believe in selfless service to join us in transforming lives
          and making the world a kinder place. Together, we can restore hope and dignity to those in
          need.
        </MKTypography>
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
      </Grid>
    );
  });
}

export default OurWork;
