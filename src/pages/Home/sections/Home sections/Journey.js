// i18next imports
import { useTranslation } from "react-i18next";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function Journey() {
  const { t } = useTranslation();
  const homePage = t("homePage");

  return (
    <MKBox
      component="section"
      py={4}
      mb={2}
      mx={"auto"}
      sx={{
        backgroundColor: "#f0f2f5",
        borderRadius: "20px",
        width: { xs: "100%", sm: "90%" },
        marginTop: { xs: 2, sm: 4 },
      }}
    >
      <Container>
        <Grid container alignItems="center">
          <Grid
            item
            xs={12}
            sm={10}
            md={4}
            sx={{
              mx: { xs: "0", sm: "auto" },
              mb: { xs: 2, md: 0 },
            }}
          >
            <MKBox mx="auto" px={2}>
              <MKTypography
                sx={{
                  fontWeight: "400",
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1rem", lg: "1.3rem", xl: "1.3rem" },
                  letterSpacing: "0.05rem",
                }}
              >
                {homePage.journeySection.description}
              </MKTypography>
              <MKTypography
                sx={{
                  fontWeight: "600",
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1rem", lg: "1.3rem", xl: "1.3rem" },
                  letterSpacing: "0.05rem",
                }}
                my={2}
              >
                {homePage.journeySection.founderName}
              </MKTypography>
            </MKBox>
          </Grid>
          <Grid item xs={12} sm={10} md={6} mx={"auto"}>
            <MKBox position="relative">
              <MKBox
                display="flex"
                justifyCOntent="center"
                border="solid 2px #000000"
                borderRadius="15px"
                minHeight={{ xs: "140px", sm: "280px" }}
              >
                <iframe
                  width="100%"
                  src="https://www.youtube.com/embed/et_pTB-Vfs4?si=cP75J8JI23LzSfvE"
                  title="YouTube video player"
                  style={{ border: "0px", borderRadius: "15px" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                  autoPlay="true"
                ></iframe>
              </MKBox>
            </MKBox>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Journey;
