import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { useTranslation } from "react-i18next";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

function Counters() {
  const { t } = useTranslation();
  const impactSection = t("homePage.impactSection");
  console.log(impactSection.title);
  return (
    <MKBox component="section" pt={{ xs: 4, sm: 8 }} pb={2}>
      <Container>
        <Grid container justifyContent="center" sx={{ textAlign: "center" }}>
          <Grid item xs={12} md={12}>
            <MKTypography
              variant="h3"
              fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
              fontSize={{ xs: "1.5rem", sm: "1.5rem", md: "1.75rem", lg: "1.875rem" }}
              sx={{ fontWeight: "500" }}
              mb={2}
            >
              <b>{impactSection.title}</b>
            </MKTypography>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DefaultCounterCard
              count={9}
              separator=","
              title={impactSection.impact1.title}
              description={impactSection.impact1.description}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DefaultCounterCard
              count={500}
              separator=","
              suffix="+"
              title={impactSection.impact2.title}
              description={impactSection.impact2.description}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DefaultCounterCard
              count={80}
              separator=","
              suffix="+"
              title={impactSection.impact3.title}
              description={impactSection.impact3.description}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DefaultCounterCard
              count={98}
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
