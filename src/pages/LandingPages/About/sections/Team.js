// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
import HorizontalTeamCard from "examples/Cards/TeamCards/HorizontalTeamCard";

// Images
import user from "assets/images/user.png";
import team1 from "assets/images/vikas.jpg";
import team2 from "assets/images/faizan.jpg";
import team3 from "assets/images/pawan.jpg";
import team5 from "assets/images/Pramod.jpg";
import team6 from "assets/images/Sadia.jpg";

// import team4 from "assets/images/ivana-square.jpg";

function Team() {
  return (
    <MKBox
      component="section"
      variant="gradient"
      position="relative"
      sx={{ backgroundColor: "#f8f9fa", borderRadius: "20px" }}
      py={5}
      px={{ xs: 2, lg: 0 }}
      // mx={-2}
      mt={8}
      mb={8}
    >
      <Container>
        {/* <Grid container textAlign={"center"}>
          <Grid item xs={12} md={12} sx={{ mb: 2 }}>
            <MKTypography variant="h3">Our Team</MKTypography>
          </Grid>
        </Grid> */}

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

        <Grid container spacing={4} display="flex" justifyContent={"center"}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={5}
            xl={7}
            display="flex"
            justifyContent={"center"}
            alignItems={"center"}
            mx="auto"
          >
            <MKBox mb={1} textAlign="center">
              <MKTypography
                sx={{ fontSize: { xs: "1rem", sm: "1rem", md: "1.2rem", lg: "1.2rem" } }}
              >
                Meet the team behind <br />
              </MKTypography>
              <MKTypography
                variant="h4"
                pt={1}
                sx={{ fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem", lg: "1.4rem" } }}
              >
                Aadar Foundation ( Swarg Sadan Ashram )
              </MKTypography>
              <MKTypography
                pt={2}
                sx={{ fontSize: { xs: "0.8rem", sm: "0.8rem", md: "1rem", lg: "1rem" } }}
              >
                We started our journey with a team of seven <br /> and continue to move forward
                together.
              </MKTypography>
            </MKBox>
          </Grid>
          <Grid item xs={10} sm={10} md={8} lg={6} xl={5}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={team1}
                name="Vikas Goswami"
                position={{ color: "info", label: "Founder & CEO" }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
        </Grid>
        <Grid container spacing={4} display="flex" justifyContent={"center"}>
          <Grid item xs={10} sm={10} md={8} lg={6} xl={4}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={team2}
                name="Faizan Beg"
                position={{
                  color: "info",
                  label: "Holistic Care Administrator",
                }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
          <Grid item xs={10} sm={10} md={8} lg={6} xl={4}>
            <MKBox mb={{ xs: 1, lg: 0 }}>
              <HorizontalTeamCard
                image={team3}
                name="Pawan Suryawanshi"
                position={{
                  color: "info",
                  label: "Healthcare Operations Manager  ",
                }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
          <Grid item xs={10} sm={10} md={8} lg={6} xl={4}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={user}
                name="Vibha Aneja"
                position={{
                  color: "info",
                  label: "Residential Care and Food Services ",
                }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
          {/* </Grid>
        <Grid container spacing={4}> */}
          <Grid item xs={10} sm={10} md={8} lg={6} xl={4}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={team5}
                name="Pramod Sumoliya"
                position={{
                  color: "info",
                  label: "Medical Facility Manager",
                }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
          <Grid item xs={10} sm={10} md={8} lg={6} xl={4}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={team6}
                name="Sadia Parveen"
                position={{ color: "info", label: "Communications and Writing Manager" }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
          <Grid item xs={10} sm={10} md={8} lg={6} xl={4}>
            <MKBox mb={{ xs: 1, lg: 0 }}>
              <HorizontalTeamCard
                image={user}
                name="Kamal Aneja"
                position={{ color: "info", label: "Mobility Services Manager " }}
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
