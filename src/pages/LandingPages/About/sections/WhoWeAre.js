import React from "react";

// i18next imports
import { useTranslation, Trans } from "react-i18next";

// @mui material components
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
    <MKBox display="flex" flexDirection="column" justifyContent="center" alignItems="start">
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
          </MKTypography>
          <MKTypography
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            paddingTop="10px"
            sx={{ letterSpacing: "0.05rem" }}
          >
            <Trans i18nKey={aboutUsPage.whoWeAreSection.description4} components={{ 1: <b /> }} />
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
