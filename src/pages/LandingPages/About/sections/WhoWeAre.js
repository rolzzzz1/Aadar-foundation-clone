// @mui material components
import React from "react";

import { useTranslation, Trans } from "react-i18next";

import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Images
import aboutImg from "assets/images/aboutPageImages/main1.jpg";
import swargSadan from "assets/images/aboutPageImages/swargSadan.webp";
import beforeAfter1 from "assets/images/aboutPageImages/before-after1.png";
import group1 from "assets/images/aboutPageImages/group1.jpg";
import resque1 from "assets/images/aboutPageImages/resque1.jpg";

function WhoWeAre() {
  const { t } = useTranslation();
  const aboutUsPage = t("aboutUsPage");

  return (
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
        {aboutUsPage.whoWeAreSection.title}
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
            <Trans i18nKey={aboutUsPage.whoWeAreSection.description1} components={{ 1: <b /> }} />
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
        <Trans i18nKey={aboutUsPage.whoWeAreSection.description2} components={{ 1: <b /> }} />
        {/* As the mission grew,{" "}
        <b>
          Aadar Foundation (Ashram Swarg Sadan - a residential home for destitute) was officially
          established on June 20, 2018, in Gwalior (known as Tansen ki nagari), by Mr. Vikas Goswami
          and his dedicated colleagues Pawan Suryavanshi, Faizan Beg, Vibha Aneja, Pramod Sumoliya,
          Sadia Parveen, and Kamal Aneja.
        </b> */}
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
            <Trans i18nKey={aboutUsPage.whoWeAreSection.description3} components={{ 1: <b /> }} />
            {/* Since then, Aadar Foundation has been a refuge for the{" "}
            <b>homeless, abandoned, mentally or physically ill, elderly, and injured</b>, offering
            them dignity, love, and hope. These individuals, often ignored by society, face hunger,
            neglect, and deteriorating health. At <b>Swarg Sadan</b>, we provide them with
            <b>
              {" "}
              shelter, nutritious food, medical care, clean clothing, counseling, recreational
              activities, and a warm, family-like environment.
            </b> */}
          </MKTypography>
          <MKTypography
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            paddingTop="10px"
            sx={{ letterSpacing: "0.05rem" }}
          >
            <Trans i18nKey={aboutUsPage.whoWeAreSection.description4} components={{ 1: <b /> }} />
            {/* Beyond care, we strive to reunite them with their families whenever possible. So far, we
            have welcomed <b>230 Prabhu Jans (beloved souls) into our ashram</b>, successfully
            <b> rehabilitating 98 individuals </b> with their families across{" "}
            <b> Nepal and 13 states in India</b>. Currently, <b>105 Prabhu Jans</b> are receiving
            full-time care at our facility. */}
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
            <b>{aboutUsPage.whoWeAreSection.description5}</b>
          </MKTypography>
        </Grid>
      </Grid>
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
    </MKBox>
  );
}

export default WhoWeAre;
