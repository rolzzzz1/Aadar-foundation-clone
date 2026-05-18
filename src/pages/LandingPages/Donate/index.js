import React from "react";

// i18next imports
import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";

// @mui material components
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";

// @mui icons-material components
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Routes
import getRoutes from "routes1";
import getFooterRoutes from "footer.routes1";

// Images
import bgImage2 from "assets/images/mainThemeImages/swargSadanBlack.png";
import bgImage from "assets/images/mainThemeImages/smallBrushstroke2.svg";
import scanner from "assets/images/scanner.jpg";
import donateImg from "assets/images/donate-happy-faces.png";
import MKButton from "components/MKButton";

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
            fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
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
                fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
                sx={{
                  fontWeight: "500",
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "1.875rem", lg: "1.875rem" },
                }}
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
                    fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
                    sx={{
                      fontWeight: "500",
                      fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.2rem", lg: "1.5rem" },
                    }}
                    mt={2}
                  >
                    {i18n.language === "hi" ? "आपके आज के कार्य में" : "Your action today has"}{" "}
                    <br />
                    {i18n.language === "hi" ? "एक" : "the"}
                    <MKTypography
                      display="inline"
                      variant="h4"
                      fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
                      sx={{
                        fontSize: { xs: "1.5rem", sm: "1.7rem", md: "1.7rem", lg: "2rem" },
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
                      fontFamily='"Lato", "Helvetica", "Arial", sans-serif'
                      sx={{
                        letterSpacing: "0.05rem",
                        paddingTop: { xs: "40px", sm: "40px", md: "20px", lg: "0px" },
                      }}
                      mt={{ md: 3, lg: 6 }}
                      mr={{ xs: 2, sm: 6 }}
                    >
                      {donatePage.description}
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
                    mt={{ xs: 4, sm: 5, md: 5, lg: 5, xl: 8 }}
                    loading="lazy"
                    decoding="async"
                  ></MKBox>
                  <MKTypography
                    textAlign="center"
                    variant="h5"
                    mt={1.5}
                    fontSize={{ xs: "1rem", md: "1.2rem" }}
                    fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
                  >
                    <i>{donatePage.imageTagLine}</i>
                  </MKTypography>
                </MKBox>
              </Grid>

              <Grid xs={12} lg={6} xl={6} px={{ xs: 0, sm: 4 }}>
                <MKBox
                  border="2px solid #F44335"
                  borderRadius="5px"
                  p={1}
                  mx={{ xs: 0, sm: 4 }}
                  mb={4}
                  mt={{ xs: 4, sm: 6, md: 8, lg: 2 }}
                >
                  <MKTypography
                    color="error"
                    textAlign="center"
                    fontSize={{ xs: "0.8rem", sm: "0.9rem", md: "1rem" }}
                  >
                    <Trans i18nKey={donatePage.emailMessage} components={{ 1: <b /> }} />
                  </MKTypography>
                </MKBox>
                <MKBox
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  mt={{ md: 6 }}
                  px={{ xs: 2, sm: 3 }}
                >
                  <MKBox
                    component="img"
                    src={scanner}
                    alt="UPI QR code for donations"
                    borderRadius="xxl"
                    loading="lazy"
                    decoding="async"
                    sx={{
                      display: "block",
                      width: { xs: "100%", sm: "92%", md: "85%", lg: "100%" },
                      maxWidth: { xs: 340, sm: 380, md: 400, lg: 440 },
                      height: "auto",
                      objectFit: "contain",
                      p: 0,
                      border: "1px solid rgba(31, 42, 68, 0.12)",
                      boxShadow:
                        "0 8px 24px rgba(31, 42, 68, 0.1), 0 2px 8px rgba(31, 42, 68, 0.06)",
                    }}
                  />
                  <MKButton
                    component={Link}
                    to="/pages/landing-pages/donate2#donate-widget"
                    variant="contained"
                    color="success"
                    sx={{
                      mt: 2,
                      width: "100%",
                      maxWidth: { xs: 340, sm: 380, md: 400, lg: 440 },
                      py: 1.35,
                      borderRadius: "12px",
                      fontWeight: 800,
                      textTransform: "none",
                      fontSize: { xs: "0.88rem", sm: "0.95rem" },
                      boxShadow: "0 10px 26px rgba(79, 169, 83, 0.28)",
                      "&&": { color: "#ffffff" },
                    }}
                  >
                    {t("donatePage.donateViaCardNetbanking")}
                  </MKButton>
                </MKBox>
              </Grid>
            </Grid>
            <Grid display={"flex"} flexDirection={"column"} alignItems={"center"}>
              <MKBox
                sx={{ backgroundColor: "#fbecd4", borderRadius: "20px" }}
                py={{ xs: 6, sm: 8 }}
                px={{ xs: 2, sm: 5, md: 10, lg: 20, xl: 40 }}
                mt={{ xs: 4, sm: 8 }}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <MKTypography
                  fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
                  sx={{
                    fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.4rem", lg: "1.5rem" },
                    fontWeight: "500",
                    letterSpacing: "0.05rem",
                  }}
                  variant="h4"
                  pb={4}
                >
                  {donatePage.bankAccountDetails.title}
                </MKTypography>

                <MKTypography
                  fontSize={{ xs: "1rem", sm: "1rem", md: "1rem", lg: "1rem" }}
                  py={{ lg: 1 }}
                  sx={{ letterSpacing: "0.05rem" }}
                >
                  <b>{donatePage.bankAccountDetails.acccountName.title} - </b>
                  {donatePage.bankAccountDetails.acccountName.value}
                  <Tooltip title={donatePage.clickToCopy} placement="right">
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
                      iconOnly
                    >
                      <ContentCopyIcon />
                    </MKButton>
                  </Tooltip>
                </MKTypography>

                <MKTypography
                  fontSize={{ xs: "1rem", sm: "1rem", md: "1rem", lg: "1rem" }}
                  py={{ lg: 1 }}
                  sx={{ letterSpacing: "0.05rem" }}
                >
                  <b>{donatePage.bankAccountDetails.bankName.title} - </b>
                  {donatePage.bankAccountDetails.bankName.value}{" "}
                  <Tooltip title={donatePage.clickToCopy} placement="right">
                    <MKButton
                      onClick={() => {
                        navigator.clipboard.writeText(donatePage.bankAccountDetails.bankName.value);
                      }}
                      variant="text"
                      color="text"
                      size="medium"
                      display="inline-block"
                      iconOnly
                    >
                      <ContentCopyIcon />
                    </MKButton>
                  </Tooltip>
                </MKTypography>
                <MKTypography
                  fontSize={{ xs: "1rem", sm: "1rem", md: "1rem", lg: "1rem" }}
                  py={{ lg: 1 }}
                  sx={{ letterSpacing: "0.05rem" }}
                >
                  <b>{donatePage.bankAccountDetails.ifscCode.title} - </b>BARB0VJCCGW{" "}
                  <Tooltip title={donatePage.clickToCopy} placement="right">
                    <MKButton
                      onClick={() => {
                        navigator.clipboard.writeText("BARB0VJCCGW");
                      }}
                      variant="text"
                      color="text"
                      size="medium"
                      display="inline-block"
                      iconOnly
                    >
                      <ContentCopyIcon />
                    </MKButton>
                  </Tooltip>
                </MKTypography>
                <MKTypography
                  fontSize={{ xs: "1rem", sm: "1rem", md: "1rem", lg: "1rem" }}
                  py={{ lg: 1 }}
                  sx={{ letterSpacing: "0.05rem" }}
                >
                  <b>{donatePage.bankAccountDetails.accountNo.title} - </b>67940100000154{" "}
                  <Tooltip title={donatePage.clickToCopy} placement="right">
                    <MKButton
                      onClick={() => {
                        navigator.clipboard.writeText("67940100000154");
                      }}
                      variant="text"
                      color="text"
                      size="medium"
                      display="inline-block"
                      iconOnly
                    >
                      <ContentCopyIcon />
                    </MKButton>
                  </Tooltip>
                </MKTypography>
              </MKBox>
            </Grid>
            <MKBox
              border="2px solid #66BB6A"
              borderRadius="5px"
              width={{ xs: "100%", sm: "80%" }}
              p={{ xs: 1, sm: 2 }}
              mx="auto"
              my={{ xs: 4, sm: 8 }}
            >
              <MKTypography
                color="success"
                fontSize={{ xs: "0.8rem", sm: "0.8rem", md: "1rem", lg: "1rem" }}
                textAlign="center"
              >
                {donatePage.message80g} <br />
                <b>{donatePage.panNo}</b>
              </MKTypography>
            </MKBox>
            <MKBox
              component="section"
              py={2}
              mb={2}
              mx={0}
              px={{ xs: 2, sm: 3, md: 4, lg: 5 }}
              sx={{
                backgroundColor: "#fafafa",
                borderRadius: "20px",
              }}
            >
              <Grid
                container
                display="flex"
                pt={6}
                px={{ xs: 1, sm: 2 }}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <MKTypography
                  variant="h4"
                  fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
                  sx={{
                    fontSize: { sm: "1.8rem", md: "1.8rem", lg: "2rem" },
                    fontWeight: "500",
                    color: "#ECA533",
                  }}
                >
                  {donatePage.membershipSection.title}
                </MKTypography>
                <MKTypography
                  variant="h4"
                  fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem", lg: "1.5rem" },
                    fontWeight: "500",
                  }}
                  pl={{ xs: 1, sm: 1, md: 4 }}
                  textAlign="center"
                >
                  {donatePage.membershipSection.subTitle}
                </MKTypography>
              </Grid>

              <Grid container pt={{ xs: 2, sm: 4, md: 4, lg: 6 }} px={{ xs: 1, sm: 2, md: 2 }}>
                <Grid
                  container
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  pt={4}
                  lg={6}
                  xl={6}
                >
                  <MKTypography
                    sx={{
                      fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.3rem", lg: "1.5rem" },
                      fontWeight: "400",
                    }}
                    pb={2}
                    fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
                  >
                    {donatePage.membershipSection.membership.title}
                  </MKTypography>
                  <MKBox pt={{ sm: 1, md: 2 }} px={{ xs: 4, md: 5, lg: 8 }}>
                    {donatePage.membershipSection.membership.items.map((row) => (
                      <MKTypography
                        key={row.label}
                        fontSize={{ xs: "0.8rem", sm: "1rem", md: "1rem", lg: "1rem" }}
                        py={1}
                        sx={{ letterSpacing: "0.05rem" }}
                      >
                        <b>
                          {row.label} - {row.amount}
                        </b>
                        <MKTypography fontSize="0.9rem" sx={{ letterSpacing: "0.05rem" }}>
                          {row.detail}
                        </MKTypography>
                      </MKTypography>
                    ))}
                  </MKBox>
                </Grid>
                <Grid
                  container
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  pt={4}
                  lg={6}
                  xl={6}
                >
                  <MKTypography
                    sx={{
                      fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.3rem", lg: "1.5rem" },
                      fontWeight: "400",
                    }}
                    pb={2}
                    fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
                  >
                    {donatePage.membershipSection.sponsorPrabhuji.title}
                  </MKTypography>
                  <MKBox pt={{ sm: 1, md: 2 }} px={{ xs: 4, md: 5, lg: 10 }}>
                    {donatePage.membershipSection.sponsorPrabhuji.cards.map((row) => (
                      <MKBox key={`${row.description}-${row.periodDetail}`} py={0.8}>
                        <MKTypography
                          fontSize={{ xs: "0.8rem", sm: "1rem", md: "1rem", lg: "1rem" }}
                          sx={{ letterSpacing: "0.05rem" }}
                        >
                          <b>
                            {row.description} - {row.highlight.split("–").pop().trim()}
                          </b>
                        </MKTypography>
                        <MKTypography fontSize="0.9rem" sx={{ letterSpacing: "0.05rem" }}>
                          {row.periodDetail}
                        </MKTypography>
                      </MKBox>
                    ))}
                    <MKTypography
                      fontSize={{ xs: "0.7rem", sm: "0.75rem", md: "0.8rem", lg: "0.85rem" }}
                      py={2}
                      sx={{ letterSpacing: "0.05rem" }}
                    >
                      {donatePage.membershipSection.sponsorPrabhuji.description}
                    </MKTypography>
                  </MKBox>
                </Grid>
              </Grid>

              <Grid
                container
                pt={{ xs: 4, sm: 4, md: 6, lg: 8 }}
                px={{ xs: 1, sm: 2, md: 2 }}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                pb={4}
              >
                <MKTypography
                  fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.3rem", lg: "1.5rem" },
                    fontWeight: "400",
                  }}
                  pb={2}
                  px={{ xs: 4, md: 4, sm: 8 }}
                >
                  {donatePage.membershipSection.foodSponsorship.title}
                </MKTypography>
                <MKBox
                  component="ul"
                  sx={{
                    listStyle: "none",
                    m: 0,
                    p: 0,
                    width: "100%",
                    maxWidth: 720,
                    mx: "auto",
                    px: { xs: 4, md: 4, sm: 8 },
                  }}
                >
                  {donatePage.membershipSection.foodSponsorship.items.map((row, idx) => (
                    <MKBox
                      key={row.label}
                      component="li"
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "minmax(0, 1fr) minmax(5rem, 5.75rem)",
                          sm: "minmax(0, 1fr) 6.75rem",
                          md: "minmax(0, 1fr) 7rem",
                        },
                        columnGap: { xs: 1.25, sm: 2 },
                        alignItems: "start",
                        py: idx === 3 ? 1.6 : 1.2,
                        letterSpacing: "0.05rem",
                        borderBottom: idx < 3 ? "1px solid rgba(31, 42, 68, 0.08)" : "none",
                      }}
                    >
                      <MKTypography
                        component="span"
                        fontSize={{
                          xs: "0.8rem",
                          sm: "0.9rem",
                          md: "0.9rem",
                          lg: idx === 3 ? "1.05rem" : "1rem",
                        }}
                        sx={{
                          minWidth: 0,
                          fontWeight: 500,
                          color: "#1f2a44",
                          lineHeight: 1.45,
                          textAlign: "left",
                          pr: { xs: 0.5, sm: 1 },
                        }}
                      >
                        {row.label}
                      </MKTypography>
                      <MKTypography
                        component="span"
                        fontSize={{
                          xs: "0.8rem",
                          sm: "0.9rem",
                          md: "0.95rem",
                          lg: idx === 3 ? "1.15rem" : "1rem",
                        }}
                        sx={{
                          fontWeight: 700,
                          color: "#2e7d32",
                          whiteSpace: "nowrap",
                          textAlign: "right",
                          justifySelf: "stretch",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {row.amount}
                      </MKTypography>
                    </MKBox>
                  ))}
                </MKBox>
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
