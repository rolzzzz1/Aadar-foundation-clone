/*
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

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
      // bgColor="dark"
      position="relative"
      sx={{ backgroundColor: "#f8f9fa" }}
      py={6}
      px={{ xs: 2, lg: 0 }}
      mx={-2}
      mb={8}
    >
      <Container>
        <Grid container textAlign={"center"}>
          <Grid item xs={12} md={12} sx={{ mb: 6 }}>
            <MKTypography variant="h3">Our Team</MKTypography>
          </Grid>
        </Grid>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={4}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={team1}
                name="Vikas Goswami"
                position={{ color: "info", label: "Founder" }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
          <Grid item xs={12} lg={4}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={team2}
                name="Faizan Beg"
                position={{ color: "info", label: "Founder" }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
          <Grid item xs={12} lg={4}>
            <MKBox mb={{ xs: 1, lg: 0 }}>
              <HorizontalTeamCard
                image={team3}
                name="Pawan Suryawanshi"
                position={{ color: "info", label: "Founder" }}
                description="< Social icons links here >"
              />
            </MKBox>
          </Grid>
          {/* <Grid item xs={12} lg={6}>
              <MKBox mb={{ xs: 1, lg: 0 }}>
                <HorizontalTeamCard
                  image={team4}
                  name="Marquez Garcia"
                  position={{ color: "info", label: "JS Developer" }}
                  description="Artist is a term applied to a person who engages in an activity deemed to be an art."
                />
              </MKBox>
            </Grid> */}
        </Grid>
      </Container>
    </MKBox>

    // <MKBox
    //   component="section"
    //   variant="gradient"
    //   bgColor="dark"
    //   position="relative"
    //   py={6}
    //   px={{ xs: 2, lg: 0 }}
    //   mx={-2}
    // >
    //   <Container>
    //     <Grid container>
    //       <Grid item xs={12} md={8} sx={{ mb: 6 }}>
    //         <MKTypography variant="h3" color="white">
    //           The Executive Team
    //         </MKTypography>
    //         <MKTypography variant="body2" color="white" opacity={0.8}>
    //           There&apos;s nothing I really wanted to do in life that I wasn&apos;t able to get good
    //           at. That&apos;s my skill.
    //         </MKTypography>
    //       </Grid>
    //     </Grid>
    //     <Grid container spacing={3}>
    //       <Grid item xs={12} lg={6}>
    //         <MKBox mb={1}>
    //           <HorizontalTeamCard
    //             image={team1}
    //             name="Emma Roberts"
    //             position={{ color: "info", label: "UI Designer" }}
    //             description="Artist is a term applied to a person who engages in an activity deemed to be an art."
    //           />
    //         </MKBox>
    //       </Grid>
    //       <Grid item xs={12} lg={6}>
    //         <MKBox mb={1}>
    //           <HorizontalTeamCard
    //             image={team2}
    //             name="William Pearce"
    //             position={{ color: "info", label: "Boss" }}
    //             description="Artist is a term applied to a person who engages in an activity deemed to be an art."
    //           />
    //         </MKBox>
    //       </Grid>
    //       <Grid item xs={12} lg={6}>
    //         <MKBox mb={{ xs: 1, lg: 0 }}>
    //           <HorizontalTeamCard
    //             image={team3}
    //             name="Ivana Flow"
    //             position={{ color: "info", label: "Athlete" }}
    //             description="Artist is a term applied to a person who engages in an activity deemed to be an art."
    //           />
    //         </MKBox>
    //       </Grid>
    //       <Grid item xs={12} lg={6}>
    //         <MKBox mb={{ xs: 1, lg: 0 }}>
    //           <HorizontalTeamCard
    //             image={team4}
    //             name="Marquez Garcia"
    //             position={{ color: "info", label: "JS Developer" }}
    //             description="Artist is a term applied to a person who engages in an activity deemed to be an art."
    //           />
    //         </MKBox>
    //       </Grid>
    //     </Grid>
    //   </Container>
    // </MKBox>
  );
}

export default Team;
