// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
// import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

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
      <MKBox
        my={-12}
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
            // textAlign="center"
          >
            <MKTypography variant={"h2"} py={3}>
              About us
            </MKTypography>
            <MKTypography variant="body1" fontSize="1rem">
              Considering serving the suffering human beings as worship of God, Mr. Vikas Goswami
              started service from 1st July 2015. First he and his team started the service by
              finding people who were wounded, injured, sick, helpless, disabled, victims living a
              painful life in helpless condition. The team found various helpless people at railway
              stations, bus stands, outside temples or anywhere in the city and started giving them
              first aid.
            </MKTypography>
            <MKTypography variant="body1" fontSize="1rem" paddingTop="20px">
              As they carried on this service,{" "}
              <b>
                {" "}
                Aadar foundation (Ashram Swarg Sadan) was founded on 20 June 2018 in Gwalior city by
                Mr. Vikas Goswami and his colleagues Pawan Suryavanshi, Faizan Beg, Vibha Aneja,
                Pramod Sumoliya, Sadia Parveen, Kamal Aneja.
              </b>
            </MKTypography>
            <MKTypography variant="body1" fontSize="1rem" paddingTop="20px">
              Since then the team started adopting the people who are homeless, helpless, abandoned,
              mentally or physically ill, injured, elderly, lonely people and are slowly moving
              towards a painful death. When included in the Swarg Sadan family, our mission is to
              give them respect, love, hope and happiness. Looking at their clothes and condition,
              no one comes near them to talk to them or help them. Without proper care, due to lack
              of food and water, their condition becomes pitiable and they slowly move towards a
              painful death. By bringing them to the Ashram Swarg Sadan, they are given free food,
              good care, treatment, medicines, clean clothes, counselling, sports, entertainment and
              all kinds of family atmosphere. After recovery, efforts are made to trace their family
              members.{" "}
              <b>
                So far 230 Prabhu Jans have been brought to the Ashram. 70 Prabhu Jans have been
                rehabilitated in their families in 13 states across India. 91 prominent Jans are
                being provided full service at the Ashram.
              </b>
            </MKTypography>
          </MKBox>
          {/* <MKBox py={4}>
            <TabsSimple />
          </MKBox> */}
        </Container>
      </MKBox>

      <Grid
        container
        sx={{
          textAlign: "center",
          paddingTop: "50px",
        }}
        mx={4}
      >
        <Grid py={4} md={5} pb={1}>
          <TabsSimple />
        </Grid>
        <Grid py={4} md={7} textAlign="center" pb={1}>
          <MKTypography variant="h5" fontSize="1.5rem">
            What we do
          </MKTypography>

          <MKTypography fontSize="1rem" mx="auto" maxWidth="550px" paddingTop="20px">
            Our organization works for homeless, helpless, loveless, sick people. It works to give a
            new life to people who are seriously injured, sick, hungry and thirsty, separated from
            their homes, and abandoned by their loved ones, in solitude at railway stations,
            religious places, on roads, etc. Food, good care, treatment, entertainment, clean
            clothes, counseling are completely free for them in the ashram Swarg Sadan, which is
            provided by social cooperation.
          </MKTypography>
          <MKTypography fontSize="1rem" mx="auto" maxWidth="500px" paddingTop="20px">
            The organization has also adopted orphan girls under the Grah Se After Care Yojana run
            by the Women and Child Development Department. Where the girls study, do computer,
            sewing, knitting, beauty parlor, or other livelihood earning courses, and they are also
            made proficient in Grah work according to their wish. The organization has also done the
            work of getting 10 girls married.
          </MKTypography>
        </Grid>
      </Grid>

      <MKTypography fontSize="1rem" mx="auto" px={8}>
        The organization is working with social economic help. People's cooperation in every way
        helps the ashram in its day to day operation. We are working with a very transparent system.
        Social persons are also directly involved in this, the donors who come here are impressed by
        the service of the servants and the arrangements of the ashram. We appeal to all those
        persons who make the life of all these suffering God's incarnations simple and easy by
        serving selflessly.
      </MKTypography>

      {/* <MKBox component="section" pt={3} pb={8}>
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
      </MKBox> */}

      <MKTypography variant="h5" paddingTop="40px" textAlign="center" fontSize="1.5rem">
        How we work
      </MKTypography>
      <MKTypography fontSize="1rem" paddingTop="20px" mx="auto" px={4}>
        <b>1. Food Prasad and Nutrition</b>
        <br />
        Most of the people living in the ashram are sick or extremely malnourished, weak, so food
        arrangements are made keeping their health in mind. Morning breakfast, lunch, evening meal
        along with milk, fruits, protein rich items are provided as per doctor's advice.
      </MKTypography>
      <MKTypography fontSize="1rem" paddingTop="20px" mx="auto" px={4}>
        <b>2. Executive Committee and Core Team</b>
        <br />A core team has been formed for the ashram operator along with the executive committee
        which reviews the activities of the ashram by meeting every three months. It is their job to
        run the ashram, maintain the system, monitor every activity, manage the availability of
        resources to maintain the necessary system in the ashram. The executive committee prepares a
        report and presents it in the core team meeting. After considering it, corrective efforts
        are made.
      </MKTypography>
      <MKTypography fontSize="1rem" paddingTop="20px" mx="auto" px={4}>
        <b>3. Festivals and Entertainment</b>
        <br />
        Festivals like Holi, Deepawali, Bhai Dooj, Rakshabandhan etc. are celebrated well in the
        ashram. Mother sits on the days of the Mother Goddess, Ganeshji puja, Ramzan and Eid are
        celebrated according to the Muslim Gods. For entertainment also, musical instruments,
        dancing and singing, celebration of birthdays and marriage anniversaries by the social
        people on their special days are an important part of their entertainment.
      </MKTypography>

      {/* Team component of about us page */}
      <Team />

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default About;
