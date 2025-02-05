// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
// import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

// Material Kit 2 React layouts
// import TabsSimple from "layouts/sections/navigation/nav-tabs/components/TabsSimple";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

import Team from "pages/LandingPages/About/sections/Team";

// Images
import aboutBgImg from "assets/images/swargSadanBlack.png";
import bgImage from "assets/images/smallBrushstroke2.svg";
import aboutImg from "assets/images/main1.jpg";
import swargSadan from "assets/images/swargSadan.webp";
import beforeAfter1 from "assets/images/before-after1.png";
import group1 from "assets/images/group1.jpg";
import resque1 from "assets/images/resque1.jpg";
import food from "assets/images/foodAboutpage.jpg";
import team from "assets/images/teamImg.jpg";
import celebration from "assets/images/celebration.jpeg";

function About() {
  return (
    <MKBox minWidth="575px">
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

      {/* Main Image and text */}
      <MKBox
        minHeight="80vh"
        width="100%"
        sx={{
          backgroundImage: `url(${aboutBgImg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left",
          display: "flex",
          justifyContent: "end",
          alignItems: "end",
        }}
      >
        <MKBox
          color="white"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top",
            width: "40%",
            minHeight: "40vh",
            // marginRight: "150px",
            // marginTop: { md: "80px", lg: "80px" },
          }}
        >
          <MKTypography
            variant="h3"
            color="white"
            textAlign="center"
            ml={-2}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          >
            About Us
          </MKTypography>
        </MKBox>
      </MKBox>

      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -2,
          mb: 4,
          backgroundColor: "#f0f2f5",
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <MKBox
          component="section"
          // pt={8} mt={8}
        >
          <Container>
            <MKBox
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="start"
              // textAlign="center"
            >
              <MKTypography
                variant={"h3"}
                py={5}
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                sx={{ letterSpacing: "0.05rem" }}
              >
                Who we are
              </MKTypography>

              <Grid container display="flex" justifyContent={"center"}>
                <Grid lg={6}>
                  <MKBox
                    component="img"
                    src={swargSadan}
                    alt={"Swarg sadan building image"}
                    borderRadius="xxl"
                    width="90%"
                    height="100%"
                  ></MKBox>
                </Grid>
                <Grid lg={6}>
                  <MKTypography
                    variant="body1"
                    fontSize="1rem"
                    fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                    sx={{
                      letterSpacing: "0.05rem",
                      paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                    }}
                  >
                    At Aadar Foundation, we believe that serving humanity is the highest form of
                    worship. With this vision, <b>Mr. Vikas Goswami</b> began his journey of service
                    on <b>July 1, 2015</b>, reaching out to the most vulnerable—those who were
                    wounded, sick, abandoned, or disabled—struggling to survive on the streets. He
                    and his team sought out these individuals at railway stations, bus stands,
                    outside temples, and other places across the city, providing them with first aid
                    and care.
                  </MKTypography>
                </Grid>
              </Grid>
              <MKTypography
                variant="body1"
                fontSize="1.1rem"
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                paddingTop="40px"
                paddingBottom="30px"
                sx={{ letterSpacing: "0.05rem" }}
                textAlign="center"
                width="80%"
                mx={"auto"}
              >
                As the mission grew,{" "}
                <b>
                  Aadar Foundation (Ashram Swarg Sadan) was officially established on June 20, 2018,
                  in Gwalior, by Mr. Vikas Goswami and his dedicated colleagues Pawan Suryavanshi,
                  Faizan Beg, Vibha Aneja, Pramod Sumoliya, Sadia Parveen, and Kamal Aneja.
                </b>
              </MKTypography>

              <Grid container display="flex" justifyContent={"center"}>
                <Grid lg={6}>
                  <MKTypography
                    variant="body1"
                    fontSize="1rem"
                    fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                    paddingTop="10px"
                    sx={{ letterSpacing: "0.05rem" }}
                  >
                    Since then, Aadar Foundation has been a refuge for the{" "}
                    <b>homeless, abandoned, mentally or physically ill, elderly, and injured</b>,
                    offering them dignity, love, and hope. These individuals, often ignored by
                    society, face hunger, neglect, and deteriorating health. At <b>Swarg Sadan</b>,
                    we provide them with
                    <b>
                      {" "}
                      shelter, nutritious food, medical care, clean clothing, counseling,
                      recreational activities, and a warm, family-like environment.
                    </b>
                  </MKTypography>
                  <MKTypography
                    variant="body1"
                    fontSize="1rem"
                    fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                    paddingTop="10px"
                    sx={{ letterSpacing: "0.05rem" }}
                  >
                    Beyond care, we strive to reunite them with their families whenever possible. So
                    far, we have welcomed <b>230 Prabhu Jans (beloved souls) into our ashram</b>,
                    successfully
                    <b> rehabilitating 98 individuals </b> with their families across{" "}
                    <b>13 states in India</b>. Currently, <b>91 Prabhu Jans</b> are receiving
                    full-time care at our facility.
                  </MKTypography>
                </Grid>
                <Grid
                  lg={6}
                  pl={4}
                  my="auto"
                  sx={{ paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" } }}
                >
                  <MKBox
                    component="img"
                    src={aboutImg}
                    alt={"Before after images"}
                    borderRadius="xxl"
                    width="100%"
                  ></MKBox>
                </Grid>
              </Grid>

              <Grid container display="flex" justifyContent={"center"}>
                <Grid pt={6}>
                  <MKTypography
                    variant="body1"
                    fontSize="1.2rem"
                    fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                    // paddingTop="30px"
                    sx={{ letterSpacing: "0.05rem", fontWeight: "500" }}
                    textAlign="center"
                    mx={"auto"}
                    width="80%"
                  >
                    At Aadar Foundation, we are committed to restoring dignity, rekindling hope, and
                    transforming lives—one person at a time.
                  </MKTypography>
                </Grid>
              </Grid>
            </MKBox>

            {/* <MKBox py={4}>
              <TabsSimple />
            </MKBox> */}

            <Grid container lg={12} mt={6} display="flex" justifyContent="center" my={4}>
              <Grid sm={6} md={6} lg={4} px={2}>
                <MKBox
                  component="img"
                  src={resque1}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  width="100%"
                  // height="90%"
                  sx={{ height: { sm: "80%", md: "80%", lg: "90%" } }}
                  my={2}
                ></MKBox>
              </Grid>
              <Grid sm={6} md={6} lg={4} px={2}>
                <MKBox
                  component="img"
                  src={beforeAfter1}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  width="100%"
                  // height="80%"
                  sx={{ height: { sm: "80%", md: "80%", lg: "80%" } }}
                  my={2}
                ></MKBox>
              </Grid>
              <Grid sm={12} md={12} lg={4} px={1}>
                <MKBox
                  component="img"
                  src={group1}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  width="100%"
                  // height="70%"
                  sx={{ height: { sm: "80%", md: "80%", lg: "70%" } }}
                  my={2}
                ></MKBox>
              </Grid>
            </Grid>

            <Grid py={4} md={12} pb={1} sx={{ marginTop: { sm: -10, md: -14, lg: 0 } }}>
              <MKTypography
                variant="h3"
                fontSize="1.5rem"
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
              >
                What we do
              </MKTypography>

              <MKTypography
                fontSize="1rem"
                mx="auto"
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                At Aadar Foundation, we are dedicated to providing care, support, and dignity to the
                homeless, helpless, and abandoned. Our mission is to bring hope and a new life to
                those who are critically ill, injured, hungry, or left alone at railway stations,
                religious sites, streets, and other public places. Through our shelter, Swarg Sadan,
                we offer food, medical care, counseling, clean clothing, and entertainment—all
                completely free, made possible through social cooperation and generous
                contributions.
              </MKTypography>
              <MKTypography
                fontSize="1rem"
                mx="auto"
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                In addition to supporting the homeless, we have also extended our efforts to
                orphaned girls through the Grah Se After Care Yojana, a program run by the Women and
                Child Development Department. Here, the girls receive education and vocational
                training in fields like computer skills, sewing, knitting, and beauty care,
                empowering them to build independent and self-sufficient lives. Our organization has
                also facilitated the marriages of 10 young women, helping them embark on a new
                chapter with dignity and security.
              </MKTypography>
              <MKTypography
                fontSize="1rem"
                mx="auto"
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem", fontWeight: "500" }}
              >
                Aadar Foundation operates with complete transparency, relying on social and economic
                support. Every contribution—whether financial, material, or voluntary—plays a
                crucial role in sustaining our mission. Visitors and donors who witness our work
                firsthand are deeply moved by the dedication of our team and the compassionate
                environment we have created.
              </MKTypography>
              <MKTypography
                mx="auto"
                paddingTop="60px"
                sx={{ letterSpacing: "0.05rem", fontWeight: "500" }}
                width="80%"
                textAlign="center"
                fontSize="1.2rem"
              >
                We invite all individuals who believe in selfless service to join us in transforming
                lives and making the world a kinder place. Together, we can restore hope and dignity
                to those in need.
              </MKTypography>
            </Grid>

            <Grid container lg={12} mt={6}>
              <Grid sm={3} md={3} lg={3} px={2}>
                <MKBox
                  component="img"
                  src={food}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  width="100%"
                  height="70%"
                  my={2}
                ></MKBox>
              </Grid>
              <Grid sm={4} md={4} lg={4} px={1}>
                <MKBox
                  component="img"
                  src={celebration}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  width="100%"
                  height="80%"
                  my={2}
                ></MKBox>
              </Grid>
              <Grid sm={5} md={5} lg={5} px={2}>
                <MKBox
                  component="img"
                  src={team}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  width="100%"
                  height="90%"
                  my={2}
                ></MKBox>
              </Grid>
            </Grid>

            <Grid py={4} md={12} pb={1} my={-5}>
              <MKTypography
                variant="h3"
                py={3}
                fontSize="1.5rem"
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
              >
                How we work
              </MKTypography>
              <MKTypography fontSize="1rem" sx={{ letterSpacing: "0.05rem" }}>
                <b>1. Food & Nutrition</b>
              </MKTypography>
              <MKTypography fontSize="1rem" sx={{ letterSpacing: "0.05rem" }} paddingTop="10px">
                At Aadar Foundation, we prioritize the health and well-being of the homeless
                individuals we support. Many of them are sick, malnourished, or physically weak, so
                our meal plans are designed with their nutritional needs in mind. Under medical
                guidance, we provide balanced meals, including breakfast, lunch, and dinner, along
                with milk, fruits, and protein-rich foods to aid their recovery and well-being.
              </MKTypography>
              <MKTypography fontSize="1rem" paddingTop="20px" sx={{ letterSpacing: "0.05rem" }}>
                <b>2. Leadership & Governance</b>
              </MKTypography>
              <MKTypography fontSize="1rem" paddingTop="10px" sx={{ letterSpacing: "0.05rem" }}>
                To ensure the smooth operation of our ashram, we have a dedicated Executive
                Committee and Core Team in place. The Core Team oversees daily management, resource
                allocation, and system maintenance, while the Executive Committee conducts quarterly
                reviews of ashram activities. The committee prepares detailed reports, which are
                presented in Core Team meetings, allowing for continuous evaluation and necessary
                improvements.
              </MKTypography>
              <MKTypography fontSize="1rem" paddingTop="20px" sx={{ letterSpacing: "0.05rem" }}>
                <b>3. Celebrations & Community Engagement</b>
              </MKTypography>
              <MKTypography fontSize="1rem" paddingTop="10px" sx={{ letterSpacing: "0.05rem" }}>
                We believe in fostering a sense of joy, belonging, and cultural inclusivity. Our
                ashram celebrates festivals like Holi, Diwali, Bhai Dooj, and Rakshabandhan, as well
                as Ganesh Puja, Ramzan, and Eid, respecting the diverse faiths of our residents. To
                uplift spirits, we organize musical performances, dance and singing sessions, and
                community-led celebrations, including birthday and anniversary events hosted by
                well-wishers. These activities bring happiness and strengthen the sense of family
                among our residents.
              </MKTypography>
            </Grid>
          </Container>
        </MKBox>

        {/* Team component of about us page */}
        <Team />
      </Card>

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default About;
