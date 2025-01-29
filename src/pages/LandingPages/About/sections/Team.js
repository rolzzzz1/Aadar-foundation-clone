// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
import HorizontalTeamCard from "examples/Cards/TeamCards/HorizontalTeamCard";

// Images
import team1 from "assets/images/vikas.jpg";
import team2 from "assets/images/faizan.jpg";
import team3 from "assets/images/pawan.jpg";
// import team4 from "assets/images/ivana-square.jpg";

function Team() {
  return (
    <MKBox
      component="section"
      variant="gradient"
      position="relative"
      sx={{ backgroundColor: "#f8f9fa" }}
      py={6}
      px={{ xs: 2, lg: 0 }}
      // mx={-2}
      mt={4}
      mb={8}
    >
      <Container>
        <Grid container textAlign={"center"}>
          <Grid item xs={12} md={12} sx={{ mb: 2 }}>
            <MKTypography variant="h3">Our Team</MKTypography>
          </Grid>
        </Grid>

        {/* <Grid item xs={12} sm={12} md={12} lg={4} height="200px">
          <MKBox mb={1} width="45%">
            <HorizontalTeamCard
              image={team1}
              name="Vikas Goswami"
              position={{ color: "info", label: "Founder" }}
              description="< Social icons links here >"
            />
          </MKBox>
        </Grid> */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={team1}
                name="Vikas Goswami"
                position={{ color: "info", label: "Founder" }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={team2}
                name="Faizan Beg"
                position={{ color: "info", label: "Founder" }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <MKBox mb={{ xs: 1, lg: 0 }}>
              <HorizontalTeamCard
                image={team3}
                name="Pawan Suryawanshi"
                position={{ color: "info", label: "Founder" }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={team1}
                name="Vikas Goswami"
                position={{ color: "info", label: "Founder" }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={team2}
                name="Faizan Beg"
                position={{ color: "info", label: "Founder" }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <MKBox mb={{ xs: 1, lg: 0 }}>
              <HorizontalTeamCard
                image={team3}
                name="Pawan Suryawanshi"
                position={{ color: "info", label: "Founder" }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Team;
