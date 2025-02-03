import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function Journey() {
  return (
    <MKBox
      component="section"
      py={4}
      mt={4}
      mb={2}
      mx={"auto"}
      width="90%"
      sx={{ backgroundColor: "#CED4DA", borderRadius: "20px" }}
    >
      <Container>
        <Grid container alignItems="center">
          <Grid item md={4} sx={{ ml: { xs: 0, lg: 3 }, mb: { xs: 2, md: 0 } }}>
            <Container>
              <MKTypography
                sx={{
                  fontWeight: "400",
                  fontSize: { sm: "1.2rem", md: "1.3rem", lg: "1.5rem", xl: "1.5rem" },
                }}
              >
                A few words on our journey, by one of our founders.
                <MKTypography
                  sx={{
                    fontWeight: "600",
                    fontSize: { sm: "1rem", md: "1rem", lg: "1.3rem", xl: "1.3rem" },
                  }}
                  my={2}
                >
                  - Mr. Vikas Goswami{" "}
                </MKTypography>
              </MKTypography>
            </Container>
          </Grid>
          <Grid item xs={12} md={6} mx={"auto"}>
            <MKBox position="relative">
              <MKBox display="flex" justifyCOntent="center">
                <iframe
                  width="100%"
                  height="280"
                  src="https://www.youtube.com/embed/et_pTB-Vfs4?si=cP75J8JI23LzSfvE"
                  title="YouTube video player"
                  frameBorder={0}
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
