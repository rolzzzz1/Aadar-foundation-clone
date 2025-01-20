/* eslint-disable react/jsx-no-duplicate-props */
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
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
// import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

// Images
// import macbook from "assets/images/macbook.png";
import aboutImg from "assets/images/aboutImg.webp";
// import outlined from "assets/theme/components/button/outlined";

import { Link } from "react-router-dom";

function About() {
  return (
    <MKBox component="section" pt={2} my={2}>
      <Container>
        <Grid container alignItems="center">
          <Grid item xs={12} md={5} sx={{ ml: "auto" }}>
            <MKBox position="relative">
              <MKBox component="img" src={aboutImg} alt="macbook" width="80%" borderRadius="15px" />
            </MKBox>
          </Grid>
          <Grid item md={6} sx={{ ml: { xs: 0, lg: 3 }, mb: { xs: 12, md: 0 } }}>
            <Container>
              <MKTypography variant="h2">Aadar Foundation </MKTypography>
              <MKTypography variant="h4">(Ashram Swarg Sadan)</MKTypography>
              <MKTypography
                // variant="body1"
                color="text"
                mb={3}
                paddingTop="10px"
                maxWidth="600px"
                fontSize="18px"
              >
                The Aadar Foundation's Ashram Swarg Sadan is being established in Gwalior, Madhya
                Pradesh. Currently, the ashram has 92 residents, including those who are helpless,
                disabled, paralyzed, or suffering from various ailments, all of whom receive proper
                care, food, medication, and amusement.
              </MKTypography>

              <MKBox ml={{ xs: "auto", lg: 0 }}>
                <MKButton
                  component={Link}
                  to={"/pages/landing-pages/about-us"}
                  variant="outlined"
                  color="success"
                  size="medium"
                >
                  Read more
                </MKButton>
              </MKBox>
            </Container>

            {/* <Grid container spacing={1}>
              <Grid item xs={8}>
                <MKInput type="email" label="Email Here..." fullWidth />
              </Grid>
              <Grid item xs={4}>
                <MKButton variant="gradient" color="info" sx={{ height: "100%" }}>
                  Subscribe
                </MKButton>
              </Grid>
            </Grid> */}
          </Grid>
          {/* <Grid item xs={12} md={5} sx={{ ml: "auto" }}>
            <MKBox position="relative">
              <MKBox component="img" src={macbook} alt="macbook" width="100%" />
            </MKBox>
          </Grid> */}
        </Grid>
      </Container>
    </MKBox>
  );
}

export default About;
