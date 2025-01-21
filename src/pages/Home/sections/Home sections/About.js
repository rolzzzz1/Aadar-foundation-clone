import { Link } from "react-router-dom";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Images
import aboutImg from "assets/images/aboutImg.webp";

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
              <MKTypography color="text" mb={3} paddingTop="10px" maxWidth="600px" fontSize="18px">
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
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default About;
