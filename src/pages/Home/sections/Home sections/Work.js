// i18next imports
import { useTranslation } from "react-i18next";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
import CenteredBlogCard from "examples/Cards/BlogCards/CenteredBlogCard1";

// Images
import work1 from "assets/images/ourWorkImages/aboutImg.webp";
import work2 from "assets/images/ourWorkImages/treatment.webp";
import work3 from "assets/images/ourWorkImages/shelter.webp";
import work4 from "assets/images/ourWorkImages/food2.jpg";
import work5 from "assets/images/ourWorkImages/care2.jpg";
import work6 from "assets/images/ourWorkImages/rehabilitation1.jpg";

function Work() {
  const { t } = useTranslation();
  const homePage = t("homePage");

  return (
    <MKBox
      component="section"
      variant="gradient"
      position="relative"
      mt={{ xs: 4, sm: 8 }}
      py={{ xs: 4, sm: 6 }}
      borderRadius={"10px"}
      mx={-2}
      sx={{ backgroundColor: "#f0f2f5" }}
    >
      <Container>
        <Grid container>
          <Grid item xs={12} md={12} sx={{ textAlign: "center", mb: { xs: 2, sm: 6 } }}>
            <MKTypography
              variant="h3"
              fontSize={{ xs: "1.5rem", sm: "1.5rem", md: "1.75rem", lg: "1.875rem" }}
              fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
              sx={{ fontWeight: "600" }}
            >
              {homePage.workSection.title}
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
              mt: { xs: 3, lg: 0 },
            }}
            mx={"auto"}
          >
            <CenteredBlogCard
              image={work1}
              title={homePage.workSection.workTask1.title}
              description={homePage.workSection.workTask1.description}
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
              mt: { xs: 3, lg: 0 },
            }}
            mx={"auto"}
          >
            <CenteredBlogCard
              image={work2}
              title={homePage.workSection.workTask2.title}
              description={homePage.workSection.workTask2.description}
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
              mt: { xs: 3, lg: 0 },
            }}
            mx={"auto"}
          >
            <CenteredBlogCard
              image={work3}
              title={homePage.workSection.workTask3.title}
              description={homePage.workSection.workTask3.description}
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
              mt: { xs: 3, lg: 0 },
            }}
            mx={"auto"}
          >
            <CenteredBlogCard
              image={work4}
              title={homePage.workSection.workTask4.title}
              description={homePage.workSection.workTask4.description}
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
              mt: { xs: 3, lg: 0 },
            }}
            mx={"auto"}
          >
            <CenteredBlogCard
              image={work5}
              title={homePage.workSection.workTask5.title}
              description={homePage.workSection.workTask5.description}
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
              mt: { xs: 3, lg: 0 },
            }}
            mx={"auto"}
          >
            <CenteredBlogCard
              image={work6}
              title={homePage.workSection.workTask6.title}
              description={homePage.workSection.workTask6.description}
              action={{ type: "internal", route: "/pages/landing-pages/work" }}
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Work;
