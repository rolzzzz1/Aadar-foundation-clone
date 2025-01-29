import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

import CenteredBlogCard from "examples/Cards/BlogCards/CenteredBlogCard1";

import work1 from "assets/images/aboutImg.webp";
import work2 from "assets/images/treatment.webp";
import work3 from "assets/images/shelter.webp";
import work4 from "assets/images/food2.jpg";
import work5 from "assets/images/care2.jpg";
import work6 from "assets/images/rehabilitation1.jpg";

function Work() {
  return (
    <MKBox
      component="section"
      variant="gradient"
      bgColor="light"
      position="relative"
      mt={4}
      py={6}
      // px={{ xs: 2, lg: 0 }}

      // mx={-2}
    >
      <Container>
        <Grid container>
          <Grid item xs={12} md={12} sx={{ textAlign: "center", mb: 6 }}>
            <MKTypography
              variant="h3"
              // color="darkText"
              fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
              sx={{ fontWeight: "500" }}
            >
              Our Work
            </MKTypography>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image={work1}
              title="Rescue"
              description="Rescuing a person in bad state from the roadside "
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image={work2}
              title="Treatment"
              description="Taking a person in critical condition for treatment in an ambulance"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image={work3}
              title="Shelter"
              description="A shelter with a clean and loving environment provided to the residents"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={8} sx={{ marginTop: "20px" }}>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image={work4}
              title="Food"
              description="Nutritious food is provided to all the residents"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image={work5}
              title="Care"
              description="Yoga session and various activities are conducted at Swarg sadan ashram"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image={work6}
              title="Rehabilitation"
              description="A father is reunited with his son after the efforts of Aadar foundation team"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Work;
