import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import MKBox from "components/MKBox";

import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

function Counters() {
  return (
    <MKBox component="section" pt={8} pb={2}>
      <Container>
        <Grid container justifyContent="center" sx={{ textAlign: "center" }}>
          <Grid item xs={12} md={3}>
            <DefaultCounterCard
              count={9}
              separator=","
              title="Years Since"
              description="Active since 2015 to serve the homeless, helpless and destitute facing a very painful phase of life."
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DefaultCounterCard
              count={500}
              separator=","
              suffix="+"
              title="People helped"
              description="Helped humans suffering from lack of love, food, shelter, treatment, family, care."
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DefaultCounterCard
              count={80}
              separator=","
              suffix="+"
              title="Events"
              description="Actively engaging with society helping our residents and conducting various events."
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
