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
          <Grid item xs={12} md={4} sx={{ mx: "auto" }}>
            <MKBox position="relative" display="flex" justifyContent="center">
              <MKBox
                component="img"
                src={aboutImg}
                alt="aboutImage"
                width="88%"
                borderRadius="15px"
              />
            </MKBox>
          </Grid>
          <Grid item md={7} sx={{ ml: { xs: 0, lg: 3 }, mb: { xs: 12, md: 0 } }}>
            <Container>
              <MKTypography variant="h3" fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'>
                Aadar Foundation{" "}
              </MKTypography>
              <MKTypography variant="h5" sx={{ fontWeight: "500" }}>
                (Swarg Sadan Ashram)
              </MKTypography>
              <MKTypography
                variant="body1"
                color="text"
                my={2}
                paddingTop="5px"
                maxWidth="600px"
                fontSize="0.9rem"
              >
                Aadar Foundation ( Swarg Sadan Ashram ) is established in Gwalior city, Madhya
                Pradesh since 2015 by Mr. Vikas Goswami and his team. We continue our work by giving
                love, basic necessities and respect to homeless, helpless, abandoned, mentally and
                physically sick, injured, infected, old aged and people in dying conditions. These
                people are generally found on railway stations, bus stands, religious and other
                public places in very unhygienic, critically diseased and painful condition. So due
                to lack of food, medicine and care, their condition becomes more and more critical
                and even they generally go towards lingering and painful death.
              </MKTypography>

              <MKBox ml={{ xs: "auto", lg: 0 }}>
                <MKButton
                  component={Link}
                  to={"/pages/landing-pages/about-us"}
                  variant="outlined"
                  color="success"
                  size="small"
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
