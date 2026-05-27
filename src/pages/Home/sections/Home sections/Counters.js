// React imports
import { useState, useEffect, useRef } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// i18next imports
import { useTranslation } from "react-i18next";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

function Counters() {
  const { t } = useTranslation();
  const impactSection = t("homePage.impactSection");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const yearsSinceStart = new Date().getFullYear() - 2015;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Disconnect observer after first trigger
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <MKBox component="section" pt={{ xs: 4, sm: 8 }} pb={2} ref={sectionRef}>
      <Container>
        <Grid container justifyContent="center" sx={{ textAlign: "center" }}>
          <Grid item xs={12} md={12}>
            <MKTypography
              variant="h3"
              fontFamily='"Pacifico", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
              fontSize={{ xs: "1.5rem", sm: "1.5rem", md: "1.75rem", lg: "1.875rem" }}
              sx={{ fontWeight: "500" }}
              mb={2}
            >
              {impactSection.title}
            </MKTypography>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DefaultCounterCard
              key={`counter-1-${isVisible}`}
              count={yearsSinceStart}
              separator=","
              title={impactSection.impact1.title}
              description={impactSection.impact1.description}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DefaultCounterCard
              key={`counter-2-${isVisible}`}
              count={600}
              separator=","
              suffix="+"
              title={impactSection.impact2.title}
              description={impactSection.impact2.description}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DefaultCounterCard
              key={`counter-3-${isVisible}`}
              count={100}
              separator=","
              suffix="+"
              title={impactSection.impact3.title}
              description={impactSection.impact3.description}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DefaultCounterCard
              key={`counter-4-${isVisible}`}
              count={175}
              separator=","
              suffix="+"
              title={impactSection.impact4.title}
              description={impactSection.impact4.description}
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Counters;
