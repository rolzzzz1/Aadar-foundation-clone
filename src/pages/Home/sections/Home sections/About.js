import { Link } from "react-router-dom";

// i18next imports
import { useTranslation } from "react-i18next";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { ABOUT_PATH } from "utils/paths";

// Images
import aboutImg from "assets/images/ourWorkImages/aboutImg.webp";

function About() {
  const { t } = useTranslation();
  const homePage = t("homePage");

  return (
    <MKBox component="section" pt={2} my={{ xs: 0.5, sm: 2 }}>
      <Grid container alignItems="center">
        <Grid item xs={9} sm={6} md={5} lg={4} sx={{ mx: "auto" }}>
          <MKBox
            position="relative"
            display="flex"
            justifyContent="center"
            sx={{
              width: "95%",
              mx: "auto",
              aspectRatio: "4 / 3",
              borderRadius: "15px",
              overflow: "hidden",
            }}
          >
            <MKBox
              component="img"
              src={aboutImg}
              alt="aboutImage"
              width="100%"
              height="100%"
              borderRadius="15px"
              loading="lazy"
              decoding="async"
              sx={{ objectFit: "cover", display: "block" }}
            />
          </MKBox>
        </Grid>
        <Grid
          item
          xs={11}
          sm={11}
          md={12}
          lg={7}
          sx={{
            mx: "auto",
            mb: { xs: 2, md: 0 },
            mt: { xs: 2, sm: 2 },
          }}
          display="flex"
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Container sx={{ margin: "20px 1px", padding: "10px 20px" }}>
            <MKTypography
              variant="h3"
              fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
              sx={{
                letterSpacing: "0.05rem",
                fontSize: { xs: "1.3rem", sm: "1.3rem", md: "1.75rem", lg: "1.875rem" },
                fontWeight: "500",
              }}
            >
              {homePage.aboutSection.title}
            </MKTypography>
            <MKTypography
              variant="h5"
              fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
              sx={{
                letterSpacing: "0.05rem",
                fontSize: { xs: "0.8rem", sm: "0.8rem", md: "1rem", lg: "1.25rem" },
                fontWeight: "500",
              }}
            >
              {homePage.aboutSection.subTitle}
            </MKTypography>
            <MKTypography
              variant="body1"
              color="text"
              mt={2}
              sx={{
                letterSpacing: "0.05rem",
                fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.95rem", lg: "1rem" },
                lineHeight: { xs: 1.6, sm: 1.65, md: 1.7, lg: 1.75 },
              }}
            >
              {homePage.aboutSection.description1}
            </MKTypography>
            <MKTypography
              variant="body1"
              paddingTop="10px"
              maxWidth="600px"
              sx={{
                letterSpacing: "0.05rem",
                fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.95rem", lg: "1rem" },
                fontWeight: "500",
                lineHeight: { xs: 1.6, sm: 1.65, md: 1.7, lg: 1.75 },
              }}
            >
              <b>{homePage.aboutSection.description2}</b>
            </MKTypography>

            <MKBox mt={2.5}>
              <MKTypography
                component={Link}
                to={ABOUT_PATH}
                variant="body2"
                fontWeight="700"
                textTransform="none"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  color: "#4FA953",
                  textDecoration: "none",
                  fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem", lg: "1.05rem" },
                  fontWeight: "700",
                  position: "relative",
                  transition: "all 0.3s ease",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "-2px",
                    left: 0,
                    width: "0%",
                    height: "2px",
                    backgroundColor: "#4FA953",
                    transition: "width 0.3s ease",
                  },
                  "&:hover": {
                    color: "#3d8a41",
                    "&::after": {
                      width: "100%",
                    },
                    "& .material-icons": {
                      transform: "translateX(4px)",
                    },
                  },
                  "& .material-icons": {
                    fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem" },
                    transition: "transform 0.3s ease",
                    marginLeft: "2px",
                  },
                }}
              >
                {homePage.aboutSection.btn}
                <Icon>arrow_forward</Icon>
              </MKTypography>
            </MKBox>
          </Container>
        </Grid>
      </Grid>
    </MKBox>
  );
}

export default About;
