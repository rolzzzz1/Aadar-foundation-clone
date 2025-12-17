// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Images
import work1 from "assets/images/ourWorkImages/aboutImg.webp";
import work2 from "assets/images/ourWorkImages/treatment.webp";
import work3 from "assets/images/ourWorkImages/shelter.webp";
import work4 from "assets/images/ourWorkImages/food2.jpg";
import work5 from "assets/images/ourWorkImages/care2.jpg";
import work6 from "assets/images/ourWorkImages/rehabilitation1.jpg";

function Work() {
  const steps = [
    {
      image: work1,
      label: "Rescue – problem identified",
      title: "Rescue: When the Emergency Begins",
      description:
        "We identify children and families in critical danger and intervene before it’s too late.",
    },
    {
      image: work2,
      label: "Treatment – immediate action",
      title: "Treatment: Life‑Saving Immediate Care",
      description:
        "We provide medical support, trauma response, and urgent interventions to stabilize their condition.",
    },
    {
      image: work3,
      label: "Shelter – safety & stability",
      title: "Shelter: Safe Roof, Safe Future",
      description:
        "We offer a secure, protective environment where they can finally rest without fear.",
    },
    {
      image: work4,
      label: "Food – daily sustenance",
      title: "Food: Daily Nutritious Meals",
      description:
        "We ensure consistent, wholesome food so no child has to worry about their next meal.",
    },
    {
      image: work5,
      label: "Care – emotional & mental wellbeing",
      title: "Care: Healing Hearts and Minds",
      description:
        "We provide emotional support, counselling, and ongoing guidance to rebuild confidence and trust.",
    },
    {
      image: work6,
      label: "Rehabilitation – long-term impact",
      title: "Rehabilitation: Rebuilding Independent Lives",
      description:
        "We focus on education, skills, and long‑term support so they can stand on their own and thrive.",
    },
  ];

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
          <Grid item xs={12} md={12} sx={{ textAlign: "center", mb: { xs: 1, sm: 3 } }}>
            <MKTypography
              variant="h3"
              fontSize={{ xs: "1.5rem", sm: "1.5rem", md: "1.75rem", lg: "1.875rem" }}
              fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
              sx={{ fontWeight: "500", mb: 1 }}
            >
              Our Work
            </MKTypography>
            <MKTypography
              variant="h5"
              fontSize={{ xs: "1rem", sm: "1.1rem", md: "1.2rem" }}
              color="text"
              sx={{ fontWeight: "400", fontStyle: "italic", mb: { xs: 2, sm: 3 } }}
            >
              From the Streets to a New Life
            </MKTypography>
          </Grid>
        </Grid>

        {/* Animated Vine-like Line Background */}
        <MKBox
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <MKBox
            component="svg"
            sx={{
              position: "absolute",
              top: "10%",
              left: "5%",
              width: "90%",
              height: "85%",
              zIndex: 0,
              opacity: 0.3,
            }}
            viewBox="0 0 1000 800"
            preserveAspectRatio="none"
          >
            {/* Animated Vine Path - Flowing from 1 → 2 → 3 → 4 → 5 → 6 in zigzag waves */}
            <path
              d="
                M 100 100
                C 200 80, 300 120, 400 100
                C 500 80, 600 120, 700 100
                C 800 80, 900 120, 950 140
                C 900 180, 800 200, 700 220
                C 600 240, 500 220, 400 240
                C 300 260, 200 240, 100 260
                C 80 300, 100 340, 150 360
                C 200 380, 300 360, 400 380
                C 500 400, 600 380, 700 400
                C 800 420, 900 400, 950 440
                C 900 480, 800 500, 700 520
                C 600 540, 500 520, 400 540
                C 300 560, 200 540, 100 560
                C 80 600, 100 640, 150 660
                C 200 680, 300 660, 400 680
                C 500 700, 600 680, 700 700
              "
              stroke="#ECA533"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,1000;500,1000;1000,1000"
                dur="8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.2;0.5;0.2"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
            {/* Secondary Vine Branch */}
            <path
              d="M 200 120 Q 220 100, 240 110 Q 260 120, 280 105 Q 300 90, 320 100"
              stroke="#ECA533"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.3"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,200;100,200;200,200"
                dur="6s"
                repeatCount="indefinite"
                begin="1s"
              />
            </path>
            {/* Third Vine Branch */}
            <path
              d="M 500 180 Q 520 160, 540 170 Q 560 180, 580 165 Q 600 150, 620 160"
              stroke="#ECA533"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.3"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,200;100,200;200,200"
                dur="6s"
                repeatCount="indefinite"
                begin="2s"
              />
            </path>
            {/* Vine Leaves/Decorative Elements - Positioned along the wave path */}
            <circle cx="200" cy="100" r="8" fill="#ECA533" opacity="0.4">
              <animate
                attributeName="opacity"
                values="0.2;0.6;0.2"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="400" cy="160" r="8" fill="#ECA533" opacity="0.4">
              <animate
                attributeName="opacity"
                values="0.2;0.6;0.2"
                dur="3s"
                repeatCount="indefinite"
                begin="1s"
              />
            </circle>
            <circle cx="600" cy="200" r="8" fill="#ECA533" opacity="0.4">
              <animate
                attributeName="opacity"
                values="0.2;0.6;0.2"
                dur="3s"
                repeatCount="indefinite"
                begin="2s"
              />
            </circle>
            <circle cx="800" cy="240" r="8" fill="#ECA533" opacity="0.4">
              <animate
                attributeName="opacity"
                values="0.2;0.6;0.2"
                dur="3s"
                repeatCount="indefinite"
                begin="1.5s"
              />
            </circle>
            <circle cx="950" cy="300" r="8" fill="#ECA533" opacity="0.4">
              <animate
                attributeName="opacity"
                values="0.2;0.6;0.2"
                dur="3s"
                repeatCount="indefinite"
                begin="2.5s"
              />
            </circle>
          </MKBox>
        </MKBox>

        {steps.map((step, index) => (
          <Grid
            key={step.title}
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ mb: { xs: 2, sm: 3 }, position: "relative", zIndex: 1 }}
          >
            {/* Image column */}
            <Grid
              item
              xs={11}
              md={5.5}
              order={{ xs: 1, md: index % 2 === 0 ? 1 : 2 }}
              mx="auto"
              sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <MKBox
                sx={{
                  position: "relative",
                  borderRadius: "20px",
                  overflow: "hidden",
                  padding: 0,
                  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.18)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "fit-content",
                  maxWidth: "100%",
                  minHeight: { xs: 140, sm: 170, md: 200 },
                  maxHeight: { xs: 180, sm: 220, md: 260 },
                  margin: "0 auto",
                  background:
                    "linear-gradient(135deg, rgba(240, 242, 245, 0.6) 0%, rgba(245, 247, 250, 0.7) 50%, rgba(240, 242, 245, 0.6) 100%)",
                  "&:hover": {
                    boxShadow: "0 14px 32px rgba(0, 0, 0, 0.22)",
                    transform: "translateY(-4px)",
                    background:
                      "linear-gradient(135deg, rgba(245, 247, 250, 0.8) 0%, rgba(240, 242, 245, 0.75) 50%, rgba(245, 247, 250, 0.8) 100%)",
                  },
                }}
              >
                <MKBox
                  component="img"
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                  sx={{
                    objectFit: "contain",
                    width: "auto",
                    height: "auto",
                    maxWidth: "100%",
                    maxHeight: { xs: 180, sm: 220, md: 260 },
                    display: "block",
                    borderRadius: "20px",
                  }}
                />
              </MKBox>
            </Grid>

            {/* Text column */}
            <Grid item xs={11} md={5.5} order={{ xs: 2, md: index % 2 === 0 ? 2 : 1 }} mx="auto">
              <MKTypography
                variant="overline"
                color="text"
                sx={{
                  letterSpacing: 2,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  mb: 0.5,
                }}
              >
                Step {index + 1} · {step.label}
              </MKTypography>

              <MKTypography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 0.75,
                  fontSize: { xs: "1.1rem", sm: "1.35rem" },
                }}
              >
                {step.title}
              </MKTypography>

              <MKTypography
                variant="body1"
                color="text"
                sx={{
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  lineHeight: 1.5,
                  maxWidth: "36rem",
                }}
              >
                {step.description}
              </MKTypography>
            </Grid>
          </Grid>
        ))}
      </Container>
    </MKBox>
  );
}

export default Work;
