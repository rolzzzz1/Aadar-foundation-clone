/* eslint-disable react/jsx-no-duplicate-props */
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

import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

// import NavTabs from "layouts/sections/navigation/nav-tabs";
import TabsSimple from "layouts/sections/navigation/nav-tabs/components/TabsSimple";

// Material Kit 2 React components
import MKBox from "components/MKBox";
// import MKTypography from "components/MKTypography";
// import MKInput from "components/MKInput";
// import MKButton from "components/MKButton";

// Images
// import macbook from "assets/images/macbook.png";
// import aboutImg from "assets/images/aboutImg.webp";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// import bgImage from "assets/images/brushstroke.svg";
// import bgImage1 from "assets/images/main1.jpg";
import bgImage2 from "assets/images/swargSadanBlack.png";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
// import HorizontalTeamCard from "examples/Cards/TeamCards/HorizontalTeamCard";

import Team from "pages/LandingPages/About/sections/Team";

// Images
// import team1 from "assets/images/vikas.jpg";
// import team2 from "assets/images/faizan.jpg";
// import team3 from "assets/images/pawan.jpg";
// import team4 from "assets/images/ivana-square.jpg";

function About() {
  return (
    <>
      {/* Navbar component */}
      <DefaultNavbar
        routes={routes}
        action={{
          type: "external",
          route: "https://www.creative-tim.com/product/material-kit-react",
          label: "Donate Now",
          color: "success",
        }}
        sticky
      />

      {/* About section of about page */}
      <MKBox
        my={-10}
        minHeight="60vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage2})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      ></MKBox>
      <MKBox
        component="section"
        pt={8}
        mt={8}
        // my={8}
      >
        <Container>
          <MKBox
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          >
            <MKTypography variant={"h2"} py={3}>
              About us
            </MKTypography>
            <p>
              Considering serving the suffering human beings as worship of God, from July 1, 2015,
              adopting the people who are slowly moving towards a painful death due to lack of
              treatment and providing human life to them, the seriously ill and the ones infested
              with worms. People who were separated from their homes and reunited with their
              families, due to wandering by mistake, in miserable, dirty conditions due to illness
              and depression, due to being separated from society/family for a long time, do not go
              to people due to mistrust. When they are included in the Swarga Sadan family with
              love, affection and respect. 50 missing people from many states of India have been
              reunited with their families.
            </p>
          </MKBox>
          <MKBox py={4}>
            <TabsSimple />
          </MKBox>
        </Container>
      </MKBox>

      <MKBox component="section" pt={3} pb={8}>
        <Container>
          <Grid container justifyContent="center" sx={{ textAlign: "center" }}>
            <Grid item xs={12} md={3}>
              <DefaultCounterCard
                count={9}
                separator=","
                title="Years Since"
                description="Active since 2015 to serve the homeless helpless destitute sick persons who are facing a very painful phase of life."
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DefaultCounterCard
                count={500}
                separator=","
                suffix="+"
                title="People helped"
                description="Helped humans suffering from lack of treatment, lack of family, separated from their homes, in dirty conditions and much more."
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DefaultCounterCard
                count={80}
                separator=","
                suffix="+"
                title="Events done"
                description="Actively engage with society helping them and various activities for the less fortunate."
              />
            </Grid>
          </Grid>
        </Container>
      </MKBox>

      {/* Team component of about us page */}
      <Team />

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default About;

// /*
// =========================================================
// * Material Kit 2 React - v2.1.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/material-kit-react
// * Copyright 2023 Creative Tim (https://www.creative-tim.com)

// Coded by www.creative-tim.com

//  =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */

// // @mui material components
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";

// // Material Kit 2 React components
// import MKBox from "components/MKBox";
// import MKTypography from "components/MKTypography";
// import MKButton from "components/MKButton";

// // Material Kit 2 React examples
// import DefaultNavbar from "examples/Navbars/DefaultNavbar";
// import DefaultFooter from "examples/Footers/DefaultFooter";

// // About Us page sections
// import Information from "pages/LandingPages/AboutUs/sections/Information";
// import Team from "pages/LandingPages/AboutUs/sections/Team";
// import Featuring from "pages/LandingPages/AboutUs/sections/Featuring";
// import Newsletter from "pages/LandingPages/AboutUs/sections/Newsletter";

// // Routes
// import routes from "routes";
// import footerRoutes from "footer.routes";

// // Images
// import bgImage from "assets/images/bg-about-us.jpg";

// function AboutUs() {
//   return (
//     <>
//       <DefaultNavbar
//         routes={routes}
//         action={{
//           type: "external",
//           route: "https://www.creative-tim.com/product/material-kit-react",
//           label: "free download",
//           color: "default",
//         }}
//         transparent
//         light
//       />
//       <MKBox
//         minHeight="75vh"
//         width="100%"
//         sx={{
//           backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
//             `${linearGradient(
//               rgba(gradients.dark.main, 0.6),
//               rgba(gradients.dark.state, 0.6)
//             )}, url(${bgImage})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           display: "grid",
//           placeItems: "center",
//         }}
//       >
//         <Container>
//           <Grid
//             container
//             item
//             xs={12}
//             lg={8}
//             justifyContent="center"
//             alignItems="center"
//             flexDirection="column"
//             sx={{ mx: "auto", textAlign: "center" }}
//           >
//             <MKTypography
//               variant="h1"
//               color="white"
//               sx={({ breakpoints, typography: { size } }) => ({
//                 [breakpoints.down("md")]: {
//                   fontSize: size["3xl"],
//                 },
//               })}
//             >
//               Work with an amazing design
//             </MKTypography>
//             <MKTypography variant="body1" color="white" opacity={0.8} mt={1} mb={3}>
//               We&apos;re constantly trying to express ourselves and actualize our dreams. If you
//               have the opportunity to play this game
//             </MKTypography>
//             <MKButton color="default" sx={{ color: ({ palette: { dark } }) => dark.main }}>
//               create account
//             </MKButton>
//             <MKTypography variant="h6" color="white" mt={8} mb={1}>
//               Find us on
//             </MKTypography>
//             <MKBox display="flex" justifyContent="center" alignItems="center">
//               <MKTypography component="a" variant="body1" color="white" href="#" mr={3}>
//                 <i className="fab fa-facebook" />
//               </MKTypography>
//               <MKTypography component="a" variant="body1" color="white" href="#" mr={3}>
//                 <i className="fab fa-instagram" />
//               </MKTypography>
//               <MKTypography component="a" variant="body1" color="white" href="#" mr={3}>
//                 <i className="fab fa-twitter" />
//               </MKTypography>
//               <MKTypography component="a" variant="body1" color="white" href="#">
//                 <i className="fab fa-google-plus" />
//               </MKTypography>
//             </MKBox>
//           </Grid>
//         </Container>
//       </MKBox>
//       <Card
//         sx={{
//           p: 2,
//           mx: { xs: 2, lg: 3 },
//           mt: -8,
//           mb: 4,
//           boxShadow: ({ boxShadows: { xxl } }) => xxl,
//         }}
//       >
//         <Information />
//         <Team />
//         <Featuring />
//         <Newsletter />
//       </Card>
//       <MKBox pt={6} px={1} mt={6}>
//         <DefaultFooter content={footerRoutes} />
//       </MKBox>
//     </>
//   );
// }

// export default AboutUs;
