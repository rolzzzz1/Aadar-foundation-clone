// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// i18next imports
import { useTranslation } from "react-i18next";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Instagram posts section
import InstagramPosts from "components/PostsSection/InstagramPosts";

function Work() {
  const { t } = useTranslation();
  const postsSection = t("homePage.postsSection");

  return (
    <MKBox
      component="section"
      variant="gradient"
      position="relative"
      mt={2}
      py={4}
      pb={2}
      sx={{ backgroundColor: "#f0f2f5" }}
      borderRadius={"10px"}
      mx={0}
    >
      <Container my={0} py={0} sx={{ px: { xs: 1, sm: 2, md: 2 } }}>
        <Grid container>
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              textAlign: "center",
              pb: 2,
              pt: 3,
            }}
          >
            <MKTypography
              variant="h3"
              sx={{ fontWeight: "500" }}
              fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
              fontSize={{ xs: "1.5rem", sm: "1.5rem", md: "1.75rem", lg: "1.875rem" }}
            >
              {postsSection.title}
            </MKTypography>
          </Grid>
        </Grid>
        <Grid item container lg={12}>
          <MKBox pt={1} width="100%">
            <InstagramPosts />
          </MKBox>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Work;
