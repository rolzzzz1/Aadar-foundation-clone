import React from "react";
import PropTypes from "prop-types";

// i18next imports
import { useTranslation, Trans } from "react-i18next";

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
import { DONATE_PAGE_PATH } from "utils/donation";

// Images
import bgImage2 from "assets/images/mainThemeImages/swargSadanBlack.png";
import bgImage from "assets/images/mainThemeImages/smallBrushstroke2.svg";
import scanner from "assets/images/scanner.jpg";
import donateImg from "assets/images/donate-happy-faces.png";
import MKButton from "components/MKButton";
import DonateSectionPricingList from "pages/LandingPages/shared/DonateSectionPricingList";

function BankDetailRow({ label, value, copyLabel, onCopy }) {
  return (
    <MKBox
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        width: "100%",
        py: 1.25,
        borderBottom: "1px solid rgba(31, 42, 68, 0.1)",
        "&:last-of-type": { borderBottom: "none" },
      }}
    >
      <MKTypography
        component="div"
        fontSize={{ xs: "0.92rem", sm: "1rem" }}
        sx={{
          flex: 1,
          minWidth: 0,
          letterSpacing: "0.03rem",
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        <MKBox component="span" fontWeight="700">
          {label}
        </MKBox>
        <MKBox component="span" sx={{ ml: 0.5 }}>
          {value}
        </MKBox>
      </MKTypography>
      <Tooltip title={copyLabel} placement="top">
        <MKButton
          onClick={onCopy}
          variant="text"
          color="text"
          size="small"
          iconOnly
          sx={{ flexShrink: 0, minWidth: 36, minHeight: 36 }}
          aria-label={copyLabel}
        >
          <ContentCopyIcon fontSize="small" />
        </MKButton>
      </Tooltip>
    </MKBox>
  );
}

BankDetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  copyLabel: PropTypes.string.isRequired,
  onCopy: PropTypes.func.isRequired,
};

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
          route: DONATE_PAGE_PATH,
          label: donateBtn,
          color: "success",
        }}
        sticky
      />

      {/* Main Image and text — hero image is rendered as an <img> with
          decoding="async" + low fetchpriority so the page can paint
          immediately on slow networks instead of blocking on a 260 KB
          PNG background. The dark gradient acts as a placeholder until
          the image arrives, so the headline is always readable. */}
      <MKBox
        minHeight={{ xs: "55vh", sm: "65vh", md: "80vh" }}
        width="100%"
        sx={{
          position: "relative",
          backgroundColor: "#1f2a44",
          backgroundImage: "linear-gradient(135deg, #1a2238 0%, #1f2a44 45%, #2a3658 100%)",
          display: "flex",
          justifyContent: "end",
          alignItems: "end",
          overflow: "hidden",
        }}
      >
        <MKBox
          component="img"
          src={bgImage2}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          fetchPriority="low"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "left",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <MKBox
          color="white"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            position: "relative",
            zIndex: 1,
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
            fontFamily='"Pacifico", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
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
          p: { xs: 1.5, sm: 2 },
          mx: { xs: 1, sm: 2, lg: 3 },
          mt: { xs: 1, sm: -2 },
          mb: 4,
          backgroundColor: "#f0f2f5",
          backdropFilter: { xs: "none", md: "saturate(200%) blur(30px)" },
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <MKBox component="section" my={4}>
          <Container>
            <Grid lg={12}>
              <MKTypography
                variant="h4"
                fontFamily='"Pacifico", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
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
                    fontFamily='"Pacifico", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
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
                      fontFamily='"Pacifico", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
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
                      fontFamily='"Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
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
                    fetchPriority="low"
                  ></MKBox>
                  <MKTypography
                    textAlign="center"
                    variant="h5"
                    mt={1.5}
                    fontSize={{ xs: "1rem", md: "1.2rem" }}
                    fontFamily='"Pacifico", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
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
                    fetchPriority="low"
                    width="1824"
                    height="2645"
                    sx={{
                      display: "block",
                      width: { xs: "100%", sm: "92%", md: "85%", lg: "100%" },
                      maxWidth: { xs: 340, sm: 380, md: 400, lg: 440 },
                      // Explicit aspect-ratio + intrinsic width/height attrs
                      // reserve vertical space before the lazy image loads.
                      // The scanner is a tall portrait JPEG (1824 × 2645)
                      // — without this the page expanded ~500px when the
                      // image arrived, dominating CLS on the Donate page.
                      aspectRatio: "1824 / 2645",
                      height: "auto",
                      objectFit: "contain",
                      p: 0,
                      border: "1px solid rgba(31, 42, 68, 0.12)",
                      boxShadow:
                        "0 8px 24px rgba(31, 42, 68, 0.1), 0 2px 8px rgba(31, 42, 68, 0.06)",
                    }}
                  />
                </MKBox>
              </Grid>
            </Grid>
            <Grid display={"flex"} flexDirection={"column"} alignItems={"center"}>
              <MKBox
                sx={{
                  backgroundColor: "#fbecd4",
                  borderRadius: "20px",
                  width: "100%",
                  maxWidth: 640,
                }}
                py={{ xs: 3, sm: 5, md: 6 }}
                px={{ xs: 2, sm: 4, md: 6, lg: 8 }}
                mt={{ xs: 4, sm: 8 }}
                display="flex"
                flexDirection="column"
                alignItems="stretch"
              >
                <MKTypography
                  fontFamily='"Pacifico", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                  sx={{
                    fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                    fontWeight: "500",
                    letterSpacing: "0.05rem",
                  }}
                  variant="h4"
                  pb={3}
                  textAlign="center"
                >
                  {donatePage.bankAccountDetails.title}
                </MKTypography>

                <BankDetailRow
                  label={`${donatePage.bankAccountDetails.acccountName.title} -`}
                  value={donatePage.bankAccountDetails.acccountName.value}
                  copyLabel={donatePage.clickToCopy}
                  onCopy={() =>
                    navigator.clipboard.writeText(donatePage.bankAccountDetails.acccountName.value)
                  }
                />
                <BankDetailRow
                  label={`${donatePage.bankAccountDetails.bankName.title} -`}
                  value={donatePage.bankAccountDetails.bankName.value}
                  copyLabel={donatePage.clickToCopy}
                  onCopy={() =>
                    navigator.clipboard.writeText(donatePage.bankAccountDetails.bankName.value)
                  }
                />
                <BankDetailRow
                  label={`${donatePage.bankAccountDetails.ifscCode.title} -`}
                  value="BARB0VJCCGW"
                  copyLabel={donatePage.clickToCopy}
                  onCopy={() => navigator.clipboard.writeText("BARB0VJCCGW")}
                />
                <BankDetailRow
                  label={`${donatePage.bankAccountDetails.accountNo.title} -`}
                  value="67940100000154"
                  copyLabel={donatePage.clickToCopy}
                  onCopy={() => navigator.clipboard.writeText("67940100000154")}
                />
              </MKBox>
            </Grid>
            <MKBox
              border="2px solid #66BB6A"
              borderRadius="5px"
              width="100%"
              maxWidth={640}
              p={{ xs: 1.5, sm: 2 }}
              mx="auto"
              my={{ xs: 4, sm: 8 }}
            >
              <MKTypography
                color="success"
                fontSize={{ xs: "0.85rem", sm: "0.95rem", md: "1rem" }}
                textAlign="center"
                sx={{ lineHeight: 1.65 }}
              >
                {donatePage.message80g}
                <MKBox
                  component="span"
                  display="block"
                  fontWeight="700"
                  mt={1}
                  sx={{
                    fontFamily: '"Roboto Mono", "Consolas", monospace',
                    letterSpacing: "0.03em",
                  }}
                >
                  {donatePage.panNo}
                </MKBox>
                <MKBox
                  component="span"
                  display="block"
                  mt={1}
                  sx={{
                    fontSize: { xs: "0.68rem", sm: "0.72rem" },
                    color: "rgba(31, 42, 68, 0.55)",
                    fontWeight: 400,
                    lineHeight: 1.5,
                    whiteSpace: "pre-line",
                  }}
                >
                  {donatePage.domesticDonationsFootnote}
                </MKBox>
              </MKTypography>
            </MKBox>
            <MKBox
              component="section"
              py={2}
              mb={2}
              mx={0}
              px={{ xs: 1, sm: 3, md: 4, lg: 5 }}
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
                  fontFamily='"Pacifico", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
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
                  fontFamily='"Pacifico", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
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

              {/* Membership / Sponsor Prabhuji / Food Sponsorship — single
                  row on md+ screens, stacked on xs/sm so the lists stay
                  readable on phones. `alignItems="stretch"` keeps the three
                  cards the same height regardless of content length. */}
              <Grid
                container
                pt={{ xs: 2, sm: 4, md: 4, lg: 6 }}
                px={{ xs: 1, sm: 2, md: 2 }}
                alignItems="stretch"
                justifyContent="center"
                spacing={{ xs: 4, sm: 5, md: 3, lg: 4 }}
                pb={4}
              >
                {/* Subtle vertical dividers between the three cards on md+ —
                    a hairline left border on the 2nd and 3rd columns. The
                    dividers disappear on xs/sm where the cards stack. */}
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    px: { xs: 0, md: 2.5, lg: 3 },
                  }}
                >
                  <DonateSectionPricingList
                    centered
                    wideAmountColumn
                    title={donatePage.membershipSection.membership.title}
                    subtitle={donatePage.membershipSection.membership.subtitle}
                    items={donatePage.membershipSection.membership.items}
                    headerMinHeight={{ xs: "auto", md: 150, lg: 160 }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    px: { xs: 0, md: 2.5, lg: 3 },
                    borderLeft: { xs: "none", md: "1px solid rgba(31, 42, 68, 0.12)" },
                  }}
                >
                  <DonateSectionPricingList
                    centered
                    wideAmountColumn
                    title={donatePage.membershipSection.sponsorPrabhuji.title}
                    subtitle={donatePage.membershipSection.sponsorPrabhuji.subtitle}
                    items={donatePage.membershipSection.sponsorPrabhuji.cards.map((row) => ({
                      label: row.description,
                      detail: row.periodDetail,
                      amount: row.highlight.split("–").pop()?.trim() || row.highlight,
                    }))}
                    headerMinHeight={{ xs: "auto", md: 150, lg: 160 }}
                  />
                  <MKTypography
                    fontSize={{ xs: "0.7rem", sm: "0.75rem", md: "0.78rem", lg: "0.82rem" }}
                    py={2}
                    sx={{
                      letterSpacing: "0.05rem",
                      textAlign: "center",
                      maxWidth: { sm: 560, md: "100%" },
                      mx: "auto",
                    }}
                  >
                    {donatePage.membershipSection.sponsorPrabhuji.description}
                  </MKTypography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    px: { xs: 0, md: 2.5, lg: 3 },
                    borderLeft: { xs: "none", md: "1px solid rgba(31, 42, 68, 0.12)" },
                  }}
                >
                  <DonateSectionPricingList
                    centered
                    title={donatePage.membershipSection.foodSponsorship.title}
                    subtitle={donatePage.membershipSection.foodSponsorship.subtitle}
                    items={donatePage.membershipSection.foodSponsorship.items}
                    headerMinHeight={{ xs: "auto", md: 150, lg: 160 }}
                  />
                </Grid>
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
