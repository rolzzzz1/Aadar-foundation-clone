import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

import TransparentBlogCard from "examples/Cards/BlogCards/TransparentBlogCard";

import event1 from "assets/images/event 1.jpg";
import event2 from "assets/images/event 2.jpg";
import event3 from "assets/images/event 3.jpg";

function Work() {
  return (
    <MKBox
      component="section"
      variant="gradient"
      position="relative"
      mt={4}
      py={3}
      pb={0}
      px={{ xs: 2, lg: 0 }}
      mx={-2}
    >
      <Container>
        <Grid container>
          <Grid item xs={12} md={12} sx={{ textAlign: "center", mb: 6 }}>
            <MKTypography variant="h3" color="darkText">
              Events
            </MKTypography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <TransparentBlogCard
              image={event1}
              title="Old Newspapers Donation"
              description="With your invaluable support, service work for the homeless and destitute victims is continuing in Ashram Swarg Sadan. "
              action={{
                type: "internal",
                route: "",
                color: "info",
                label: "Read More",
              }}
            />
          </Grid>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <TransparentBlogCard
              image={event2}
              title="ECS Bagless school visit"
              description="Little children of ecs bagless school came and visited Ashram Swarg Sadan Gwalior"
              action={{
                type: "internal",
                route: "",
                color: "info",
                label: "Read More",
              }}
            />
          </Grid>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <TransparentBlogCard
              image={event3}
              title="Lost young boy went home"
              description="A youth was found in a deranged condition in Sonpura of Hastinapur, whom the police kept in Swarg Sadan Ashram and after 14 days, he left for his country Nepal."
              action={{
                type: "internal",
                route: "",
                color: "info",
                label: "Read More",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Work;
