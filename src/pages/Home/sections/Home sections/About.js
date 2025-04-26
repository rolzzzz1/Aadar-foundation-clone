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

// Images
import aboutImg from "assets/images/ourWorkImages/aboutImg.webp";

function About() {
  const cardActionStyles = {
    display: "flex",
    alignItems: "center",
    width: "max-content",
    fontSize: { md: "0.75rem", lg: "0.87rem" },

    "& .material-icons, .material-icons-round,": {
      transform: `translateX(2px)`,
      transition: "transform 0.2s cubic-bezier(0.34,1.61,0.7,1.3)",
    },

    "&:hover .material-icons, &:focus .material-icons, &:hover .material-icons-round, &:focus .material-icons-round":
      {
        transform: `translateX(6px)`,
      },
  };

  const { t } = useTranslation();
  const homePage = t("homePage");

  return (
    <MKBox component="section" pt={2} my={{ xs: 0.5, sm: 2 }}>
      <Grid container alignItems="center">
        <Grid item xs={9} sm={6} md={5} lg={4} sx={{ mx: "auto" }}>
          <MKBox position="relative" display="flex" justifyContent="center">
            <MKBox
              component="img"
              src={aboutImg}
              alt="aboutImage"
              width="95%"
              borderRadius="15px"
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
              fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
              sx={{
                letterSpacing: "0.05rem",
                fontSize: { xs: "1.3rem", sm: "1.3rem", md: "1.75rem", lg: "1.875rem" },
                fontWeight: "600",
              }}
            >
              {homePage.aboutSection.title}
            </MKTypography>
            <MKTypography
              variant="h5"
              fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
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
                fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.85rem", lg: "0.87rem" },
              }}
            >
              {homePage.aboutSection.description1}
            </MKTypography>
            <MKTypography
              variant="body1"
              paddingTop="10px"
              maxWidth="600px"
              fontSize="0.9rem"
              sx={{
                letterSpacing: "0.05rem",
                fontSize: { md: "0.75rem", lg: "0.87rem" },
                fontWeight: "500",
              }}
            >
              <b>{homePage.aboutSection.description2}</b>
            </MKTypography>

            <MKBox mt={2}>
              <MKTypography
                component={Link}
                to={"/pages/landing-pages/about-us"}
                variant="body2"
                fontWeight="regular"
                color={"success"}
                textTransform="capitalize"
                sx={cardActionStyles}
              >
                {homePage.aboutSection.btn}
                <Icon sx={{ fontWeight: "bold" }}>arrow_forward</Icon>
              </MKTypography>
            </MKBox>
          </Container>
        </Grid>
      </Grid>
    </MKBox>
  );
}

export default About;
