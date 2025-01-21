// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

// Material Kit 2 React layouts
import TabsSimple from "layouts/sections/navigation/nav-tabs/components/TabsSimple";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

import Team from "pages/LandingPages/About/sections/Team";

// Images
import aboutBgImg from "assets/images/swargSadanBlack.png";

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
          backgroundImage: `url(${aboutBgImg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      ></MKBox>
      <MKBox component="section" pt={8} mt={8}>
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
