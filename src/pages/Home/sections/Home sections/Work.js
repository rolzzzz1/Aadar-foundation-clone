import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

import CenteredBlogCard from "examples/Cards/BlogCards/CenteredBlogCard1";

import work1 from "assets/images/ourWorkImages/aboutImg.webp";
import work2 from "assets/images/ourWorkImages/treatment.webp";
import work3 from "assets/images/ourWorkImages/shelter.webp";
import work4 from "assets/images/ourWorkImages/food2.jpg";
import work5 from "assets/images/ourWorkImages/care2.jpg";
import work6 from "assets/images/ourWorkImages/rehabilitation1.jpg";

function Work() {
  return (
    <MKBox
      component="section"
      variant="gradient"
      // bgColor="light"
      position="relative"
      mt={{ xs: 4, sm: 8 }}
      py={{ xs: 4, sm: 6 }}
      borderRadius={"10px"}
      mx={-2}
      sx={{ backgroundColor: "#f0f2f5" }}
      // px={{ xs: 2, lg: 0 }}

      // mx={-2}
    >
      <Container>
        <Grid container>
          <Grid item xs={12} md={12} sx={{ textAlign: "center", mb: { xs: 2, sm: 6 } }}>
            <MKTypography
              variant="h3"
              // color="darkText"
              fontSize={{ xs: "1.5rem", sm: "1.5rem", md: "1.75rem", lg: "1.875rem" }}
              fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
              sx={{ fontWeight: "500" }}
            >
              Our Work
            </MKTypography>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid
            item
            xs={11}
            sm={8}
            md={6}
            lg={4}
            sx={{
              // ml: "auto",
              mt: { xs: 3, lg: 1 },
            }}
            mx={"auto"}
          >
            <CenteredBlogCard
              image={work1}
              title="Rescue"
              description="Rescuing a person in bad state from the roadside "
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
          <Grid
            item
            xs={11}
            sm={8}
            md={6}
            lg={4}
            sx={{
              // ml: "auto",
              mt: { xs: 2, lg: 0 },
            }}
            mx={"auto"}
          >
            <CenteredBlogCard
              image={work2}
              title="Treatment"
              description="Taking a person in critical condition for treatment in an ambulance"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
          <Grid
            item
            xs={11}
            sm={8}
            md={6}
            lg={4}
            sx={{
              // ml: "auto",
              mt: { xs: 3, lg: 0 },
            }}
            mx={"auto"}
          >
            <CenteredBlogCard
              image={work3}
              title="Shelter"
              description="Clean & loving environment provided to the residents "
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
          {/* </Grid>
        <Grid container spacing={8} sx={{ marginTop: "20px" }}> */}
          <Grid
            item
            xs={11}
            sm={8}
            md={6}
            lg={4}
            sx={{
              // ml: "auto",
              mt: { xs: 3, lg: 0 },
            }}
            mx={"auto"}
          >
            <CenteredBlogCard
              image={work4}
              title="Food"
              description="Nutritious food is provided to all the residents of the ashram"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
          <Grid
            item
            xs={11}
            sm={8}
            md={6}
            lg={4}
            sx={{
              // ml: "auto",
              mt: { xs: 3, lg: 0 },
            }}
            mx={"auto"}
          >
            <CenteredBlogCard
              image={work5}
              title="Care"
              description="Yoga session being conducted at Swarg sadan ashram"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
          <Grid
            item
            xs={11}
            sm={8}
            md={6}
            lg={4}
            sx={{
              // ml: "auto",
              mt: { xs: 3, lg: 0 },
            }}
            mx={"auto"}
          >
            <CenteredBlogCard
              image={work6}
              title="Rehabilitation"
              description="A father reunited with son after the efforts of Aadar foundation team"
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Work;
