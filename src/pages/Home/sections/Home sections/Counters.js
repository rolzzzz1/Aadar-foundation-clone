import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

function Counters() {
  return (
    <MKBox component="section" pt={8} pb={2}>
      <Container>
        <Grid container justifyContent="center" sx={{ textAlign: "center" }}>
          <Grid item xs={12} md={12}>
            <MKTypography
              variant="h3"
              // color="darkText"
              fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
              sx={{ fontWeight: "500" }}
              mb={2}
            >
              Our Impact
            </MKTypography>
          </Grid>
          <Grid item xs={12} md={3}>
            <DefaultCounterCard
              count={9}
              separator=","
              title="Years Since"
              description="Serving the homeless, helpless, and destitute since 2015, providing support and relief during their most difficult times."
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DefaultCounterCard
              count={500}
              separator=","
              suffix="+"
              title="People helped"
              description="Providing support to those suffering from a lack of love, food, shelter, medical care, and family."
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DefaultCounterCard
              count={80}
              separator=","
              suffix="+"
              title="Events"
              description="We are actively engaged in our community, supporting residents and organizing various events to foster connection and well-being."
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DefaultCounterCard
              count={98}
              separator=","
              suffix="+"
              title="People rehabilitated"
              description="98 people till now have been reunited with their families by the efforts of Swarg sadan team."
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Counters;
