import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

import CenteredBlogCard from "examples/Cards/BlogCards/CenteredBlogCard1";

import work1 from "assets/images/aboutImg.webp";
import work2 from "assets/images/treatment.webp";
import work3 from "assets/images/shelter.webp";
import work4 from "assets/images/food.jpg";
import work5 from "assets/images/care.jpg";
import work6 from "assets/images/rehabilitation.jpg";

function Work() {
  return (
    <MKBox
      component="section"
      variant="gradient"
      bgColor="light"
      position="relative"
      mt={4}
      py={6}
      px={{ xs: 2, lg: 0 }}
      mx={-2}
    >
      <Container>
        <Grid container>
          <Grid item xs={12} md={12} sx={{ textAlign: "center", mb: 6 }}>
            <MKTypography variant="h3" color="darkText">
              Our Work
            </MKTypography>
          </Grid>
        </Grid>
        <Grid container spacing={8}>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image={work1}
              title="Rescue"
              description="Description here"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image={work2}
              title="Treatment"
              description="Description here"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image={work3}
              title="Shelter"
              description="Description here"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={8} sx={{ marginTop: "20px" }}>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image={work4}
              title="Food"
              description="Description here"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image={work5}
              title="Care"
              description="Description here"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image={work6}
              title="Rehabilitation"
              description="Description here"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Work;
