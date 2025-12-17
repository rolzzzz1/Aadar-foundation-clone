// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// React Router
import { useNavigate } from "react-router-dom";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// i18n
import { useTranslation } from "react-i18next";

// Images
import work1 from "assets/images/ourWorkImages/aboutImg.webp";
import work2 from "assets/images/ourWorkImages/treatment.webp";
import work3 from "assets/images/ourWorkImages/shelter.webp";
import work4 from "assets/images/ourWorkImages/food2.jpg";
import work5 from "assets/images/ourWorkImages/care2.jpg";
import work6 from "assets/images/ourWorkImages/rehabilitation1.jpg";

function Work() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const steps = [
    {
      image: work1,
      label: t("homePage.workSectionNew.step1.label"),
      title: t("homePage.workSectionNew.step1.title"),
      description: t("homePage.workSectionNew.step1.description"),
    },
    {
      image: work2,
      label: t("homePage.workSectionNew.step2.label"),
      title: t("homePage.workSectionNew.step2.title"),
      description: t("homePage.workSectionNew.step2.description"),
    },
    {
      image: work3,
      label: t("homePage.workSectionNew.step3.label"),
      title: t("homePage.workSectionNew.step3.title"),
      description: t("homePage.workSectionNew.step3.description"),
    },
    {
      image: work4,
      label: t("homePage.workSectionNew.step4.label"),
      title: t("homePage.workSectionNew.step4.title"),
      description: t("homePage.workSectionNew.step4.description"),
    },
    {
      image: work5,
      label: t("homePage.workSectionNew.step5.label"),
      title: t("homePage.workSectionNew.step5.title"),
      description: t("homePage.workSectionNew.step5.description"),
    },
    {
      image: work6,
      label: t("homePage.workSectionNew.step6.label"),
      title: t("homePage.workSectionNew.step6.title"),
      description: t("homePage.workSectionNew.step6.description"),
    },
  ];

  return (
    <MKBox
      component="section"
      variant="gradient"
      position="relative"
      mt={{ xs: 3, sm: 6 }}
      py={{ xs: 3, sm: 4 }}
      borderRadius={"10px"}
      mx={-2}
      sx={{ backgroundColor: "#f0f2f5" }}
    >
      <Container>
        <Grid container>
          <Grid item xs={12} md={12} sx={{ textAlign: "center", mb: { xs: 0.5, sm: 2 } }}>
            <MKTypography
              variant="h3"
              fontSize={{ xs: "1.4rem", sm: "1.5rem", md: "1.7rem", lg: "1.8rem" }}
              fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
              sx={{ fontWeight: "500", mb: 0.5 }}
            >
              {t("homePage.workSectionNew.title")}
            </MKTypography>
            <MKTypography
              variant="h5"
              fontSize={{ xs: "0.9rem", sm: "1rem", md: "1.1rem" }}
              fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
              color="text"
              sx={{
                fontWeight: "400",
                fontStyle: "italic",
                mt: { xs: 1, sm: 1.5 },
                mb: { xs: 1, sm: 1.5 },
              }}
            >
              "{t("homePage.workSectionNew.subtitle")}"
            </MKTypography>
            <MKTypography
              variant="body1"
              fontSize={{ xs: "0.85rem", sm: "0.95rem", md: "1rem" }}
              color="text"
              sx={{
                fontWeight: "400",
                maxWidth: "800px",
                mx: "auto",
                mt: { xs: 2, sm: 2.5, md: 3 },
                mb: { xs: 1, sm: 1.5 },
                lineHeight: 1.6,
              }}
            >
              {t("homePage.workSectionNew.intro")}
            </MKTypography>
          </Grid>
        </Grid>

        {/* Cards Grid */}
        <Grid container spacing={3} sx={{ mt: { xs: 2, sm: 3 } }}>
          {steps.map((step) => (
            <Grid item xs={11} sm={6} md={4} key={step.title} mx="auto">
              <MKBox
                onClick={() => navigate("/pages/landing-pages/about-us")}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.18)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  backgroundColor: "#ffffff",
                  borderTop: "4px solid #ECA533",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 14px 32px rgba(236, 165, 51, 0.3)",
                    transform: "translateY(-4px)",
                    borderTop: "4px solid #ECA533",
                  },
                }}
              >
                {/* Image */}
                <MKBox
                  sx={{
                    width: "100%",
                    height: { xs: 200, sm: 220, md: 240 },
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(240, 242, 245, 0.6)",
                    position: "relative",
                  }}
                >
                  <MKBox
                    component="img"
                    src={step.image}
                    alt={step.title}
                    loading="lazy"
                    sx={{
                      objectFit: "cover",
                      objectPosition: { xs: "center top", sm: "center", md: "center" },
                      width: "100%",
                      height: "100%",
                      minWidth: "100%",
                      minHeight: "100%",
                      display: "block",
                    }}
                  />
                </MKBox>

                {/* Content */}
                <MKBox
                  sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <MKTypography
                    variant="overline"
                    sx={{
                      letterSpacing: 1.5,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      mb: 0.5,
                      fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                      color: "#ECA533",
                    }}
                  >
                    {step.label}
                  </MKTypography>
                  <MKTypography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                    }}
                  >
                    {step.title}
                  </MKTypography>

                  <MKTypography
                    variant="body1"
                    color="text"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                      lineHeight: 1.5,
                      flexGrow: 1,
                    }}
                  >
                    {step.description}
                  </MKTypography>
                </MKBox>
              </MKBox>
            </Grid>
          ))}
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Work;
