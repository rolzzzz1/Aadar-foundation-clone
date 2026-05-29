// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// i18next imports
import { useTranslation } from "react-i18next";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Defer the Instagram fetch + media until the section scrolls into view
import LazyVisible from "components/LazyMedia/LazyVisible";
import { lazy, Suspense } from "react";

const InstagramPosts = lazy(() => import("components/PostsSection/InstagramPosts"));

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
      <Container my={0} py={0} sx={{ px: { xs: 0.5, sm: 2, md: 2, lg: 3 } }}>
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
              fontFamily='"Pacifico", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
              fontSize={{ xs: "1.5rem", sm: "1.5rem", md: "1.75rem", lg: "1.875rem" }}
            >
              {postsSection.title}
            </MKTypography>
          </Grid>
        </Grid>
        <Grid item container lg={12}>
          <MKBox pt={1} width="100%">
            <LazyVisible rootMargin="400px" minHeight={420}>
              <Suspense fallback={null}>
                <InstagramPosts />
              </Suspense>
            </LazyVisible>
          </MKBox>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Work;
