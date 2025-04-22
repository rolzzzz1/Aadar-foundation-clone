import React from "react";

import { useTranslation, Trans } from "react-i18next";

// @mui material components
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";

// import Switch from "@mui/material/Switch";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
// import MKAlert from "components/MKAlert";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Routes
// import routes from "routes";
import getRoutes from "routes1";

import getFooterRoutes from "footer.routes1";
// import footerRoutes from "footer.routes";

// Images
import bgImage2 from "assets/images/mainThemeImages/swargSadanBlack.png";
import bgImage from "assets/images/mainThemeImages/smallBrushstroke2.svg";
import scanner from "assets/images/scanner.jpg";
import donateImg from "assets/images/donate-happy-faces.png";
import MKButton from "components/MKButton";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function Donate() {
  const { t } = useTranslation();
  const routes = getRoutes(t);
  const footerRoutes = getFooterRoutes(t);
  const donateBtn = t("navbar.donateBtn");
  const donatePage = t("donatePage");
  const { i18n } = useTranslation();

  return (
    <MKBox minWidth="320px">
      {/* Navbar component */}
      <DefaultNavbar
        routes={routes}
        action={{
          type: "internal",
          route: "/pages/landing-pages/donate",
          label: donateBtn,
          color: "success",
        }}
        sticky
      />

      {/* Main Image and text */}
      <MKBox
        minHeight="80vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage2})`,
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
            backgroundPosition: "center",
            width: "40%",
            minHeight: "40vh",
          }}
        >
          <MKTypography
            variant="h3"
            color="white"
            textAlign="center"
            ml={-2}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            fontSize={{ xs: "1.2rem", sm: "1.875rem" }}
            mb={{ xs: 1, sm: 0 }}
          >
            {donatePage.tagLine}
          </MKTypography>
        </MKBox>
      </MKBox>

      {/* Donate section */}
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
        <MKBox component="section" my={4}>
          <Container>
            <Grid lg={12}>
              <MKTypography
                variant="h4"
                sx={{ fontWeight: "500", fontSize: { md: "1.2rem", lg: "1.5rem" } }}
                pb={{ md: 3, lg: 5 }}
              >
                {donatePage.title}
              </MKTypography>
            </Grid>
            <Grid container display="flex" pt={2}>
              <Grid container alignItems="flex-start" lg={6} xl={6}>
                <MKBox>
                  <MKTypography
                    variant="h4"
                    sx={{ fontWeight: "500", fontSize: { md: "1.2rem", lg: "1.5rem" } }}
                    mt={2}
                  >
                    {i18n.language === "hi" ? "आपके आज के कार्य में" : "Your action today has"}{" "}
                    <br />
                    {i18n.language === "hi" ? "एक" : "the"}
                    {/* Your action today has <br />
                    the{" "} */}
                    <MKTypography
                      display="inline"
                      variant="h4"
                      sx={{
                        fontSize: { md: "1.7rem", lg: "2rem" },
                        fontWeight: "700",
                        color: "#ECA533",
                      }}
                    >
                      {i18n.language === "hi"
                        ? " जीवन बदलने की शक्ति है।"
                        : " power to transform a life."}
                    </MKTypography>
                    <MKTypography
                      variant="body1"
                      fontSize={{ xs: "0.8rem", md: "1rem" }}
                      fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                      sx={{
                        letterSpacing: "0.05rem",
                        paddingTop: { xs: "40px", sm: "40px", md: "20px", lg: "0px" },
                      }}
                      mt={{ md: 3, lg: 6 }}
                      mr={8}
                    >
                      {donatePage.description}
                      {/* We ensure that every donation is used with purpose and precision. Each
                      decision we make is thoughtfully considered, and even the smallest
                      contribution is directed toward initiatives where it will yield the greatest
                      impact. */}
                    </MKTypography>
                  </MKTypography>

                  <MKBox
                    component="img"
                    src={donateImg}
                    alt={"Swarg sadan building image"}
                    borderRadius="xxl"
                    width="100%"
                    height="250px"
                    sx={{ border: "10px solid #ECA533" }}
                    mt={{ md: 5, lg: 5, xl: 8 }}
                  ></MKBox>
                  <MKTypography
                    textAlign="center"
                    variant="h5"
                    mt={1.5}
                    fontSize={{ xs: "1rem", md: "1.2rem" }}
                  >
                    <i>{donatePage.imageTagLine}</i>
                  </MKTypography>
                  {/* <MKBox border="2px solid #F44335" borderRadius="5px" width="100%" p={1} mt={11}>
                    <MKTypography color="error" fontSize="1rem" textAlign="center">
                      Please email your <b>name, mobile number and screenshot</b> of your
                      transaction at <b>aadarfoundatio2018@gmail.com</b> to get receipt of your
                      contribution.
                    </MKTypography>
                  </MKBox> */}
                </MKBox>
              </Grid>

              <Grid lg={6} xl={6} px={4}>
                {/* <MKTypography
                  // display="inline"
                  variant="h4"
                  sx={{
                    fontSize: { md: "1.7rem", lg: "2rem" },
                    fontWeight: "500",
                  }}
                  textAlign="center"
                  pb={2}
                >
                  Scan to pay
                </MKTypography> */}
                <MKBox
                  border="2px solid #F44335"
                  borderRadius="5px"
                  // width="80%"
                  p={1}
                  mx={4}
                  mb={4}
                  mt={{ md: 8 }}
                >
                  <MKTypography
                    color="error"
                    textAlign="center"
                    fontSize={{ xs: "0.8rem", md: "1rem" }}
                  >
                    <Trans i18nKey={donatePage.emailMessage} components={{ 1: <b /> }} />
                    {/* Please email your <b>name, mobile number and screenshot</b> of your transaction
                    at <b>aadarfoundatio2018@gmail.com</b> to get receipt of your contribution. */}
                  </MKTypography>
                </MKBox>
                <MKBox display="flex" justifyContent="center" mt={{ md: 6 }}>
                  <MKBox
                    component="img"
                    src={scanner}
                    alt={"Swarg sadan building image"}
                    borderRadius="xxl"
                    // width="80%"
                    height="500px"
                  ></MKBox>
                </MKBox>
              </Grid>
            </Grid>
            {/* <Grid container alignItems="flex-start" pt={6}>
              <MKBox border="2px solid #F44335" borderRadius="5px" width="100%" p={1}>
                <MKTypography color="error" fontSize="1rem" textAlign="center">
                  Please email your <b>name, mobile number and screenshot</b> of your transaction at{" "}
                  <b>aadarfoundatio2018@gmail.com</b> to get receipt of your contribution.
                </MKTypography>
              </MKBox>
            </Grid> */}
            <Grid display={"flex"} flexDirection={"column"} alignItems={"center"}>
              <MKBox
                sx={{ backgroundColor: "#fbecd4", borderRadius: "20px" }}
                py={8}
                px={{ lg: 20, xl: 40 }}
                mt={8}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <MKTypography
                  sx={{
                    fontSize: { md: "1.2rem", lg: "1.5rem" },
                    fontWeight: "500",
                    letterSpacing: "0.05rem",
                  }}
                  variant="h4"
                  // pt={8}
                  pb={4}
                >
                  {donatePage.bankAccountDetails.title}
                </MKTypography>

                <MKTypography
                  fontSize={{ md: "1.2rem", lg: "1rem" }}
                  py={{ lg: 1 }}
                  sx={{ letterSpacing: "0.05rem" }}
                >
                  <b>{donatePage.bankAccountDetails.acccountName.title} - </b>
                  {donatePage.bankAccountDetails.acccountName.value}
                  <Tooltip title="Click to copy" placement="right">
                    <MKButton
                      onClick={() => {
                        navigator.clipboard.writeText(
                          donatePage.bankAccountDetails.acccountName.value
                        );
                      }}
                      variant="text"
                      color="text"
                      size="medium"
                      display="inline-block"
                    >
                      <ContentCopyIcon />
                    </MKButton>
                  </Tooltip>
                </MKTypography>

                <MKTypography
                  fontSize={{ md: "1.2rem", lg: "1rem" }}
                  py={{ lg: 1 }}
                  sx={{ letterSpacing: "0.05rem" }}
                >
                  <b>{donatePage.bankAccountDetails.bankName.title} - </b>
                  {donatePage.bankAccountDetails.bankName.value}{" "}
                  <Tooltip title="Click to copy" placement="right">
                    <MKButton
                      onClick={() => {
                        navigator.clipboard.writeText(donatePage.bankAccountDetails.bankName.value);
                      }}
                      variant="text"
                      color="text"
                      size="medium"
                      display="inline-block"
                    >
                      <ContentCopyIcon />
                    </MKButton>
                  </Tooltip>
                </MKTypography>
                <MKTypography
                  fontSize={{ md: "1.2rem", lg: "1rem" }}
                  py={{ lg: 1 }}
                  sx={{ letterSpacing: "0.05rem" }}
                >
                  <b>{donatePage.bankAccountDetails.ifscCode.title} - </b>BARB0VJCCGW{" "}
                  <Tooltip title="Click to copy" placement="right">
                    <MKButton
                      onClick={() => {
                        navigator.clipboard.writeText("BARB0VJCCGW");
                      }}
                      variant="text"
                      color="text"
                      size="medium"
                      display="inline-block"
                    >
                      <ContentCopyIcon />
                    </MKButton>
                  </Tooltip>
                </MKTypography>
                <MKTypography
                  fontSize={{ md: "1.2rem", lg: "1rem" }}
                  py={{ lg: 1 }}
                  sx={{ letterSpacing: "0.05rem" }}
                >
                  <b>{donatePage.bankAccountDetails.accountNo.title} - </b>67940100000154{" "}
                  <Tooltip title="Click to copy" placement="right">
                    <MKButton
                      onClick={() => {
                        navigator.clipboard.writeText("67940100000154");
                      }}
                      variant="text"
                      color="text"
                      size="medium"
                      display="inline-block"
                    >
                      <ContentCopyIcon />
                    </MKButton>
                  </Tooltip>
                </MKTypography>
              </MKBox>
            </Grid>
            <MKBox border="2px solid #66BB6A" borderRadius="5px" width="80%" p={2} mx="auto" my={8}>
              <MKTypography color="success" fontSize="1rem" textAlign="center">
                {donatePage.message80g} <br />
                <b>{donatePage.panNo}</b>
                {/* All donations to the Organisation are 50 % tax exempted under section 80 G of Income
                Tax Act 1961. <br />
                <b>PAN No - AAIAA2457N</b> */}
              </MKTypography>
            </MKBox>
            {/* <MKBox m={2} px={20} py={10} textAlign={"center"}>
              All donations to the Organisation are 50 % tax exempted under section 80 G of Income
              Tax Act 1961. PAN No- AAAJM0891R
            </MKBox> */}
            <MKBox
              component="section"
              // mt={10}
              py={2}
              mb={2}
              // mx={"auto"}
              mx={-2}
              sx={{
                backgroundColor: "#fafafa",
                borderRadius: "20px",
                // width: { xs: "100%", sm: "100%" },
                // marginTop: { xs: 2, sm: 4 },
              }}
            >
              <Grid container display="flex" pt={6} justifyContent={"center"} alignItems={"center"}>
                <MKTypography
                  variant="h4"
                  sx={{
                    fontSize: { md: "1.7rem", lg: "2rem" },
                    fontWeight: "500",
                    color: "#ECA533",
                  }}

                  // pb={2}
                >
                  {donatePage.membershipSection.title}
                </MKTypography>
                <MKTypography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1rem", md: "1.2rem", lg: "1.5rem" },
                    fontWeight: "500",
                  }}
                  pl={4}
                >
                  {donatePage.membershipSection.subTitle}
                </MKTypography>
              </Grid>
              <Grid container pt={6}>
                <Grid
                  container
                  display={"flex"}
                  flexDirection={"column"}
                  // justifyContent={"center"}
                  alignItems={"center"}
                  pt={4}
                  lg={6}
                  xl={6}
                >
                  <MKTypography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.2rem", lg: "1.5rem" },
                      fontWeight: "400",
                    }}
                    pb={2}
                  >
                    {donatePage.membershipSection.membership.title}
                  </MKTypography>
                  <MKBox pt={2} px={{ md: 5, lg: 8 }}>
                    <MKTypography
                      fontSize={{ md: "1.2rem", lg: "1rem" }}
                      py={1}
                      sx={{ letterSpacing: "0.05rem" }}
                    >
                      <b>{donatePage.membershipSection.membership.membership1.name} </b> Rs
                      100/200/500{" "}
                      <MKTypography
                        fontSize="0.9rem"
                        // py={1}
                        sx={{ letterSpacing: "0.05rem" }}
                        // display="inline"
                      >
                        {donatePage.membershipSection.membership.membership1.time}
                      </MKTypography>
                    </MKTypography>
                    <MKTypography
                      fontSize={{ md: "1.2rem", lg: "1rem" }}
                      py={1}
                      sx={{ letterSpacing: "0.05rem" }}
                    >
                      <b>{donatePage.membershipSection.membership.membership2.name} </b>Rs 2600{" "}
                      <MKTypography
                        fontSize="0.9rem"
                        // py={1}
                        sx={{ letterSpacing: "0.05rem" }}
                        // display="inline"
                      >
                        {donatePage.membershipSection.membership.membership2.time}
                      </MKTypography>
                    </MKTypography>
                    <MKTypography
                      fontSize={{ md: "1.2rem", lg: "1rem" }}
                      py={1}
                      sx={{ letterSpacing: "0.05rem" }}
                    >
                      <b>{donatePage.membershipSection.membership.membership3.name} </b>Rs 5100{" "}
                      <MKTypography
                        fontSize="0.9rem"
                        // py={1}
                        sx={{ letterSpacing: "0.05rem" }}
                        // display="inline"
                      >
                        {donatePage.membershipSection.membership.membership3.time}
                      </MKTypography>
                    </MKTypography>
                  </MKBox>
                </Grid>
                <Grid
                  container
                  display={"flex"}
                  flexDirection={"column"}
                  // justifyContent={"center"}
                  alignItems={"center"}
                  pt={4}
                  lg={6}
                  xl={6}
                >
                  <MKTypography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.2rem", lg: "1.5rem" },
                      fontWeight: "400",
                    }}
                    pb={2}
                  >
                    {donatePage.membershipSection.sponsorPrabhuji.title}
                  </MKTypography>
                  <MKBox pt={2} px={{ md: 5, lg: 10 }}>
                    <MKTypography
                      fontSize={{ md: "1.2rem", lg: "1rem" }}
                      py={0.8}
                      sx={{ letterSpacing: "0.05rem" }}
                    >
                      <b>{donatePage.membershipSection.sponsorPrabhuji.sponsorship1.name} </b>
                      Rs 3000
                      <MKTypography fontSize="0.9rem" sx={{ letterSpacing: "0.05rem" }}>
                        {donatePage.membershipSection.sponsorPrabhuji.sponsorship1.services}
                      </MKTypography>{" "}
                    </MKTypography>
                    <MKTypography
                      fontSize={{ md: "1.2rem", lg: "1rem" }}
                      py={0.8}
                      sx={{ letterSpacing: "0.05rem" }}
                    >
                      <b>{donatePage.membershipSection.sponsorPrabhuji.sponsorship2.name}</b> Rs
                      30000
                    </MKTypography>
                    <MKTypography fontSize="0.9rem" sx={{ letterSpacing: "0.05rem" }}>
                      {donatePage.membershipSection.sponsorPrabhuji.sponsorship2.services}
                    </MKTypography>{" "}
                    <MKTypography
                      fontSize={{ md: "0.7rem", lg: "0.85rem" }}
                      py={2}
                      sx={{ letterSpacing: "0.05rem" }}
                    >
                      ** This includes their treatment, food, clothes and care.
                    </MKTypography>
                  </MKBox>
                </Grid>
              </Grid>
              <Grid
                container
                pt={8}
                display={"flex"}
                flexDirection={"column"}
                // justifyContent={"center"}
                alignItems={"center"}
                pb={4}
              >
                <MKTypography
                  sx={{
                    fontSize: { xs: "1rem", md: "1.2rem", lg: "1.5rem" },
                    fontWeight: "400",
                  }}
                  pb={4}
                >
                  {donatePage.membershipSection.foodSponsorship.title}
                </MKTypography>
                <MKTypography
                  fontSize={{ md: "0.8rem", lg: "1rem" }}
                  py={1.2}
                  sx={{ letterSpacing: "0.05rem" }}
                >
                  <b>{donatePage.membershipSection.foodSponsorship.foodSponsorship1} </b>Rs 1500
                </MKTypography>
                <MKTypography
                  fontSize={{ md: "0.8rem", lg: "1rem" }}
                  py={1.2}
                  sx={{ letterSpacing: "0.05rem" }}
                >
                  <b>{donatePage.membershipSection.foodSponsorship.foodSponsorship2} </b>Rs 3000
                </MKTypography>
                <MKTypography
                  fontSize={{ md: "0.8rem", lg: "1rem" }}
                  py={1.2}
                  sx={{ letterSpacing: "0.05rem" }}
                >
                  <b>{donatePage.membershipSection.foodSponsorship.foodSponsorship3} </b>Rs 6000
                </MKTypography>
                <MKTypography
                  fontSize={{ md: "1rem", lg: "1.3rem" }}
                  py={1.8}
                  sx={{ letterSpacing: "0.05rem" }}
                >
                  <b>{donatePage.membershipSection.foodSponsorship.foodSponsorship4} </b>Rs 15000
                </MKTypography>
              </Grid>
            </MKBox>
          </Container>
        </MKBox>
      </Card>

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default Donate;
