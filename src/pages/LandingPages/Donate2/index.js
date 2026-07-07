import React from "react";
import { Link } from "react-router-dom";

// i18next imports
import { useTranslation } from "react-i18next";

// @mui material components
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";

// @mui icons-material components
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";

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
import donate2UpiQr from "assets/images/donate2-upi-qr.png";
import donateImg from "assets/images/donate-happy-faces.png";
import MKButton from "components/MKButton";

import DonateSectionPricingList from "pages/LandingPages/shared/DonateSectionPricingList";
import DonateTrustBanner from "pages/LandingPages/shared/DonateTrustBanner";
import DonateReceiptCta from "pages/LandingPages/shared/DonateReceiptCta";
import SponsorPrabhujiCtaCards from "pages/LandingPages/shared/SponsorPrabhujiCtaCards";
import LazyVisible from "components/LazyMedia/LazyVisible";

import {
  DONATE_PAGE_PATH,
  DONATE_WIDGET_PRESET_PURPOSE,
  getDonationCheckoutNavigation,
  QUICK_GIVE_CARD_PURPOSE,
  sanitizeAmountInput,
  validateAmountInr,
} from "utils/donation";

function Donate2() {
  const { t } = useTranslation();
  const routes = getRoutes(t);
  const footerRoutes = getFooterRoutes(t);
  const donateBtn = t("navbar.donateBtn");
  const donatePage = t("donatePage");
  const impactBanner =
    donatePage?.impactBanner && typeof donatePage.impactBanner === "object"
      ? donatePage.impactBanner
      : {
          title: "Your Donation Creates Real Impact",
          items: {
            food: { title: "Nutritious Food", subtitle: "Every Day" },
            shelter: { title: "Safe Shelter", subtitle: "& Dignity" },
            healthcare: { title: "Healthcare", subtitle: "& Wellness" },
            rehab: { title: "Rehabilitation", subtitle: "& Support" },
          },
        };
  const { i18n } = useTranslation();
  const [selectedAmount, setSelectedAmount] = React.useState(1001);
  const [customAmount, setCustomAmount] = React.useState("");

  // Help LCP on direct loads: ask the browser to fetch the hero image as early
  // as possible once this route mounts (without globally preloading it for
  // every page in `public/index.html`).
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const href = bgImage2;
    if (!href) return;
    const existing = document.querySelector(`link[rel="preload"][as="image"][href="${href}"]`);
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    document.head.appendChild(link);
  }, []);

  const activeAmountRaw = customAmount && Number(customAmount) > 0 ? customAmount : selectedAmount;
  const amountCheck = React.useMemo(() => validateAmountInr(activeAmountRaw), [activeAmountRaw]);
  const usingCustomAmount = Boolean(customAmount && Number(customAmount) > 0);
  const widgetPresetPurpose = !usingCustomAmount
    ? DONATE_WIDGET_PRESET_PURPOSE[selectedAmount]
    : null;
  const donateCheckoutNav = React.useMemo(
    () =>
      getDonationCheckoutNavigation({
        purpose: widgetPresetPurpose,
        amountInr: amountCheck.ok ? amountCheck.valueInr : 0,
        useFreeAmount: usingCustomAmount,
      }),
    [widgetPresetPurpose, amountCheck.ok, amountCheck.valueInr, usingCustomAmount]
  );

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
          fetchPriority="high"
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
            fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
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
          mx: { xs: 2, lg: 3 },
          mt: -2,
          mb: 2,
          backgroundColor: "#f0f2f5",
          backdropFilter: { xs: "none", md: "saturate(200%) blur(30px)" },
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <MKBox component="section" my={{ xs: 2, sm: 2.5 }}>
          <Container>
            <Grid container>
              <Grid item xs={12}>
                <MKTypography
                  variant="h4"
                  fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                  sx={{
                    fontWeight: "500",
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "1.875rem", lg: "1.875rem" },
                  }}
                  pb={{ xs: 3, sm: 3.5, md: 4 }}
                >
                  {donatePage.title}
                </MKTypography>
              </Grid>
            </Grid>

            <Grid
              container
              pt={{ xs: 2, sm: 2.5, md: 3 }}
              spacing={{ xs: 2.5, md: 3 }}
              alignItems="stretch"
            >
              <Grid
                item
                xs={12}
                lg={6}
                xl={6}
                sx={{ display: "flex", pt: { xs: 2.5, sm: 3, md: 3.5 } }}
              >
                <MKBox
                  sx={{
                    pr: { xs: 0, sm: 0, md: 2 },
                    maxWidth: 720,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minHeight: 0,
                  }}
                >
                  <MKTypography
                    variant="h4"
                    fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                    sx={{
                      fontWeight: "500",
                      fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.2rem", lg: "1.5rem" },
                    }}
                  >
                    {i18n.language === "hi" ? "आपके आज के कार्य में" : "Your action today has"}{" "}
                    <br />
                    {i18n.language === "hi" ? "एक" : "the"}
                    <MKTypography
                      display="inline"
                      variant="h4"
                      fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
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
                      fontSize={{ xs: "0.8rem", sm: "0.85rem", md: "0.92rem", lg: "0.95rem" }}
                      fontFamily='"Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                      sx={{
                        letterSpacing: "0.03rem",
                        lineHeight: 1.55,
                        color: "#1f2a44",
                        maxWidth: 640,
                        paddingTop: { xs: "12px", sm: "12px", md: "8px", lg: "0px" },
                      }}
                      mt={{ md: 1.5, lg: 2 }}
                    >
                      {donatePage.description}
                    </MKTypography>
                  </MKTypography>
                  <MKBox
                    sx={{
                      width: "100%",
                      maxWidth: 640,
                      mt: { xs: 1.25, sm: 1.5, lg: "auto" },
                      pt: { lg: 2 },
                    }}
                  >
                    <Grid
                      container
                      spacing={{ xs: 1, sm: 1.2 }}
                      mr={{ xs: 0, sm: 0 }}
                      sx={{ maxWidth: 640 }}
                    >
                      {[
                        {
                          id: "taxBenefit80g",
                          Icon: VerifiedUserOutlinedIcon,
                          text: donatePage.trustBadges.taxBenefit80g,
                        },
                        {
                          id: "livesImpacted",
                          Icon: GroupsOutlinedIcon,
                          text: donatePage.trustBadges.livesImpacted,
                        },
                        {
                          id: "securePayments",
                          Icon: LockOutlinedIcon,
                          text: donatePage.trustBadges.securePayments,
                        },
                      ].map(({ id, Icon, text }) => (
                        <Grid item xs={12} sm={4} key={id}>
                          <MKBox
                            display="flex"
                            alignItems="center"
                            gap={1}
                            px={1.1}
                            py={0.7}
                            sx={{
                              backgroundColor: "rgba(31, 42, 68, 0.035)",
                              borderRadius: "999px",
                              border: "1px solid rgba(31, 42, 68, 0.06)",
                              boxShadow: "none",
                              height: "100%",
                            }}
                          >
                            <MKBox
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                backgroundColor: "rgba(79, 169, 83, 0.10)",
                                color: "#2e7d32",
                                flex: "0 0 auto",
                              }}
                            >
                              <Icon sx={{ fontSize: 15 }} />
                            </MKBox>
                            <MKTypography
                              variant="button"
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.62rem",
                                lineHeight: 1.2,
                                letterSpacing: "0.02rem",
                                textTransform: "none",
                                color: "rgba(31, 42, 68, 0.72)",
                              }}
                            >
                              {text}
                            </MKTypography>
                          </MKBox>
                        </Grid>
                      ))}
                    </Grid>
                    <Grid
                      container
                      spacing={{ xs: 1, sm: 1.2 }}
                      mt={{ xs: 1, sm: 1.25 }}
                      sx={{ maxWidth: 640 }}
                    >
                      {[
                        {
                          id: "membership",
                          Icon: PersonOutlineIcon,
                          ...donatePage.quickGiveCards.membership,
                        },
                        {
                          id: "mealSponsorship",
                          Icon: RestaurantOutlinedIcon,
                          ...donatePage.quickGiveCards.mealSponsorship,
                        },
                        {
                          id: "monthlyCare",
                          Icon: VolunteerActivismOutlinedIcon,
                          ...donatePage.quickGiveCards.monthlyCare,
                        },
                      ].map(({ id, Icon, title, subtitle, amount }) => {
                        const quickGiveNav = getDonationCheckoutNavigation({
                          purpose: QUICK_GIVE_CARD_PURPOSE[id],
                        });
                        return (
                          <Grid item xs={12} sm={4} key={id}>
                            <MKBox
                              component={Link}
                              to={quickGiveNav.pathname}
                              state={quickGiveNav.state}
                              display="flex"
                              alignItems="center"
                              gap={1.5}
                              pl={2}
                              pr={1.75}
                              py={1.5}
                              sx={{
                                backgroundColor: "#ffffff",
                                borderRadius: "14px",
                                border: "1px solid rgba(31, 42, 68, 0.06)",
                                boxShadow:
                                  "inset 4px 0 0 #ECA533, 0 12px 30px rgba(31, 42, 68, 0.10), 0 3px 8px rgba(31, 42, 68, 0.05)",
                                height: "100%",
                                textDecoration: "none",
                                color: "inherit",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                "&:hover": {
                                  transform: "translateY(-1px)",
                                  boxShadow:
                                    "inset 4px 0 0 #ECA533, 0 16px 38px rgba(31, 42, 68, 0.12), 0 4px 12px rgba(31, 42, 68, 0.06)",
                                },
                              }}
                            >
                              <MKBox
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: "10px",
                                  backgroundColor: "rgba(79, 169, 83, 0.10)",
                                  color: "#2e7d32",
                                  flex: "0 0 auto",
                                }}
                              >
                                <Icon sx={{ fontSize: 20 }} />
                              </MKBox>
                              <MKBox sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                                <MKTypography
                                  variant="button"
                                  sx={{
                                    fontWeight: 800,
                                    fontSize: "0.7rem",
                                    lineHeight: 1.2,
                                    letterSpacing: "0.02rem",
                                    textTransform: "none",
                                    color: "#1f2a44",
                                  }}
                                >
                                  {title}
                                </MKTypography>
                                <MKTypography
                                  sx={{
                                    fontSize: "0.58rem",
                                    fontWeight: 500,
                                    color: "rgba(31, 42, 68, 0.6)",
                                    lineHeight: 1.25,
                                    mt: "4px",
                                  }}
                                >
                                  {subtitle}
                                </MKTypography>
                                <MKTypography
                                  sx={{
                                    fontSize: "0.7rem",
                                    fontWeight: 800,
                                    color: "#2e7d32",
                                    lineHeight: 1.2,
                                    mt: "6px",
                                    fontVariantNumeric: "tabular-nums",
                                  }}
                                >
                                  {amount}
                                </MKTypography>
                              </MKBox>
                            </MKBox>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </MKBox>
                </MKBox>
              </Grid>

              <Grid
                item
                xs={12}
                lg={6}
                xl={6}
                sx={{ display: "flex", pt: { xs: 2.5, sm: 3, md: 3.5 } }}
              >
                <MKBox
                  sx={{
                    maxWidth: 560,
                    mx: { xs: "auto", lg: 0 },
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    width: "100%",
                    minHeight: 0,
                  }}
                >
                  {/* Razorpay-style donation widget (UI only) */}
                  <MKBox
                    id="donate-widget"
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#fafbfc",
                      borderRadius: "18px",
                      boxShadow: "0 10px 28px rgba(31, 42, 68, 0.08)",
                      border: "1px solid rgba(31, 42, 68, 0.08)",
                      overflow: "hidden",
                      scrollMarginTop: { xs: "110px", md: "130px" },
                    }}
                  >
                    <MKBox
                      px={2.5}
                      pt={2.5}
                      pb={1.25}
                      textAlign="center"
                      sx={{
                        background:
                          "linear-gradient(180deg, rgba(245, 247, 250, 1) 0%, rgba(250, 251, 252, 1) 60%)",
                      }}
                    >
                      <MKTypography
                        fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                        sx={{
                          fontSize: { xs: "1.4rem", sm: "1.6rem" },
                          fontWeight: 500,
                          color: "#24324f",
                        }}
                      >
                        <MKBox
                          component="span"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.6,
                          }}
                        >
                          {donatePage.makeADifferenceNow}
                          <FavoriteBorderIcon
                            sx={{
                              color: "#ff4d4f",
                              fontSize: { xs: 22, sm: 24 },
                              transform: "translateY(1px) rotate(12deg)",
                            }}
                          />
                        </MKBox>
                      </MKTypography>
                      <MKTypography
                        sx={{
                          mt: 0.8,
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          color: "rgba(66, 86, 122, 0.75)",
                        }}
                      >
                        {donatePage.selectAmount}
                      </MKTypography>
                    </MKBox>

                    <MKBox
                      px={2.5}
                      pb={{ xs: 2, sm: 2.25, md: 2.5 }}
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Grid container spacing={1.25} mt={0.25}>
                        {[501, 1001, 3001].map((amt) => {
                          const active = selectedAmount === amt && !customAmount;
                          return (
                            <Grid item xs={4} key={amt}>
                              <MKBox sx={{ position: "relative" }}>
                                {amt === 1001 && (
                                  <MKBox
                                    sx={{
                                      position: "absolute",
                                      top: -10,
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                      backgroundColor: "#eaf7ea",
                                      color: "#2e7d32",
                                      border: "1px solid rgba(46, 125, 50, 0.25)",
                                      px: 1.2,
                                      py: 0.3,
                                      borderRadius: "999px",
                                      fontSize: "0.65rem",
                                      fontWeight: 800,
                                      zIndex: 2,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {donatePage.mostPopular}
                                  </MKBox>
                                )}
                                <MKButton
                                  fullWidth
                                  variant="outlined"
                                  color="dark"
                                  onClick={() => {
                                    setCustomAmount("");
                                    setSelectedAmount(amt);
                                  }}
                                  sx={{
                                    "&&": {
                                      background: active ? "#fff8ec" : "#ffffff",
                                      backgroundColor: active ? "#fff8ec" : "#ffffff",
                                      color: active ? "#8a5a12" : "#24324f",
                                      border: active
                                        ? "2px solid #ECA533"
                                        : "1px solid rgba(31, 42, 68, 0.14)",
                                      boxShadow: active
                                        ? "0 0 0 4px rgba(236, 165, 51, 0.22), 0 6px 14px rgba(236, 165, 51, 0.15)"
                                        : "0 1px 2px rgba(31, 42, 68, 0.04)",
                                      borderRadius: "10px",
                                      py: 1.4,
                                      fontWeight: active ? 900 : 700,
                                      fontSize: {
                                        xs: active ? "1rem" : "0.95rem",
                                        sm: active ? "1.05rem" : "1rem",
                                        md: active ? "1.1rem" : "1.05rem",
                                      },
                                      letterSpacing: "0.01em",
                                      minHeight: 50,
                                      transform: active ? "translateY(-1px)" : "none",
                                      transition:
                                        "border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease, transform 0.18s ease",
                                      "&:hover, &:focus, &:focus-visible, &:active": {
                                        background: active ? "#fff3dc" : "#faf6ef",
                                        backgroundColor: active ? "#fff3dc" : "#faf6ef",
                                        borderColor: active ? "#d9962e" : "rgba(31, 42, 68, 0.28)",
                                        color: active ? "#8a5a12" : "#24324f",
                                        boxShadow: active
                                          ? "0 0 0 5px rgba(236, 165, 51, 0.26), 0 8px 18px rgba(236, 165, 51, 0.18)"
                                          : "0 1px 2px rgba(31, 42, 68, 0.06)",
                                      },
                                    },
                                  }}
                                >
                                  ₹{amt}
                                </MKButton>
                              </MKBox>
                            </Grid>
                          );
                        })}
                      </Grid>

                      <TextField
                        fullWidth
                        value={customAmount}
                        onChange={(e) => {
                          const v = sanitizeAmountInput(e.target.value);
                          setCustomAmount(v);
                          if (v) setSelectedAmount(Number(v));
                        }}
                        placeholder={donatePage.enterCustomAmount}
                        variant="outlined"
                        error={!!customAmount && !amountCheck.ok}
                        helperText={customAmount && !amountCheck.ok ? amountCheck.error : undefined}
                        inputProps={{ inputMode: "numeric", maxLength: 7, pattern: "[0-9]*" }}
                        sx={{
                          mt: 1.5,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "#ffffff",
                            borderColor: "rgba(31, 42, 68, 0.14)",
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <MKBox
                              component="span"
                              sx={{ mr: 1, color: "#5a6b8a", fontWeight: 700 }}
                            >
                              ₹
                            </MKBox>
                          ),
                        }}
                      />

                      <MKButton
                        component={Link}
                        to={donateCheckoutNav.pathname}
                        state={donateCheckoutNav.state}
                        onClick={(e) => {
                          if (!amountCheck.ok) e.preventDefault();
                        }}
                        disabled={!amountCheck.ok}
                        aria-disabled={!amountCheck.ok}
                        aria-label={`Donate ₹${amountCheck.ok ? amountCheck.valueInr : ""} now`}
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 1.5,
                          borderRadius: "12px",
                          py: 1.5,
                          fontSize: { xs: "0.95rem", sm: "1rem" },
                          fontWeight: 800,
                          background:
                            "linear-gradient(90deg, #4FA953 0%, #45a049 55%, #4FA953 100%)",
                          color: "#ffffff !important",
                          boxShadow: "0 14px 30px rgba(79, 169, 83, 0.22)",
                          textTransform: "none",
                          textDecoration: "none",
                          letterSpacing: "0.2px",
                          transition:
                            "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
                          "&&": {
                            color: "#ffffff",
                          },
                          "& *": {
                            color: "#ffffff",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "#ffffff",
                          },
                          "&:hover": {
                            background:
                              "linear-gradient(90deg, #45a049 0%, #3d8a41 55%, #45a049 100%)",
                            boxShadow: "0 18px 36px rgba(79, 169, 83, 0.28)",
                            textDecoration: "none",
                            transform: "translateY(-1px)",
                          },
                          "&:active": {
                            transform: "translateY(0px)",
                            boxShadow: "0 10px 22px rgba(79, 169, 83, 0.22)",
                          },
                          "&:focus, &.Mui-focusVisible, &:focus-visible, &:focus:not(:hover)": {
                            background:
                              "linear-gradient(90deg, #4FA953 0%, #45a049 55%, #4FA953 100%)",
                            color: "#ffffff",
                            boxShadow: "0 14px 30px rgba(79, 169, 83, 0.22)",
                            outline: "none",
                          },
                        }}
                      >
                        {donatePage.donateNow}
                      </MKButton>

                      <MKBox sx={{ mt: { xs: 1.25, lg: "auto" }, pt: { lg: 1 } }}>
                        <DonateTrustBanner />
                      </MKBox>
                    </MKBox>
                  </MKBox>
                </MKBox>
              </Grid>
            </Grid>

            <LazyVisible rootMargin="600px" minHeight={260}>
              <MKBox
                sx={{
                  mt: { xs: 3.5, sm: 4, md: 4.5 },
                  mb: { xs: 3.5, sm: 4, md: 4.5 },
                  pt: { xs: 1.5, sm: 2 },
                  pb: { xs: 1.5, sm: 2 },
                }}
              >
                <MKBox
                  component="a"
                  href="#donate-widget"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("donate-widget");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  aria-label={donatePage.supportThemNow}
                  sx={{
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: { xs: "16px", md: "18px" },
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(31, 42, 68, 0.07)",
                    boxShadow: "0 10px 28px rgba(31, 42, 68, 0.06)",
                    px: { xs: 1.75, sm: 2.5, md: 3 },
                    py: { xs: 2.15, sm: 2.4, md: 2.65 },
                    transition: "box-shadow 0.25s ease, border-color 0.25s ease",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      backgroundColor: "#4FA953",
                      opacity: 0.75,
                    },
                    "&:hover": {
                      boxShadow: "0 12px 32px rgba(31, 42, 68, 0.09)",
                      borderColor: "rgba(31, 42, 68, 0.1)",
                    },
                    "&:focus-visible": {
                      outline: "2px solid rgba(79, 169, 83, 0.4)",
                      outlineOffset: "3px",
                    },
                  }}
                >
                  <Grid container spacing={{ xs: 2.25, md: 3 }} alignItems="center">
                    <Grid item xs={12} md={5} lg={5}>
                      <MKBox
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          gap: { xs: 2.1, sm: 2.35, md: 2.5 },
                          px: { xs: 0.5, sm: 0.75, md: 0.75, lg: 1.25 },
                        }}
                      >
                        <MKBox
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                            maxWidth: "100%",
                          }}
                        >
                          <MKBox
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: { xs: 0.9, sm: 1.1 },
                              maxWidth: "100%",
                            }}
                          >
                            <SpaOutlinedIcon
                              sx={{
                                color: "#4FA953",
                                fontSize: { xs: 18, sm: 19, md: 20 },
                                flexShrink: 0,
                                opacity: 0.9,
                                transform: "scaleX(-1)",
                              }}
                            />
                            <MKTypography
                              fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                              sx={{
                                fontWeight: 400,
                                fontSize: {
                                  xs: "1.22rem",
                                  sm: "1.38rem",
                                  md: "1.32rem",
                                  lg: "1.48rem",
                                },
                                lineHeight: 1.28,
                                letterSpacing: "0.01em",
                                color: "#1f2a44",
                              }}
                            >
                              {impactBanner.title}
                            </MKTypography>
                            <SpaOutlinedIcon
                              sx={{
                                color: "#4FA953",
                                fontSize: { xs: 18, sm: 19, md: 20 },
                                flexShrink: 0,
                                opacity: 0.9,
                              }}
                            />
                          </MKBox>
                          <MKBox
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.75,
                            }}
                          >
                            <MKBox
                              sx={{
                                width: { xs: 18, sm: 22 },
                                height: 1,
                                backgroundColor: "rgba(31, 42, 68, 0.12)",
                              }}
                            />
                            <MKBox
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor: "#ECA533",
                                opacity: 0.85,
                              }}
                            />
                            <MKBox
                              sx={{
                                width: { xs: 18, sm: 22 },
                                height: 1,
                                backgroundColor: "rgba(31, 42, 68, 0.12)",
                              }}
                            />
                          </MKBox>
                        </MKBox>

                        <MKBox
                          sx={{
                            width: "100%",
                            display: "grid",
                            gridTemplateColumns: {
                              xs: "repeat(2, minmax(0, 1fr))",
                              sm: "repeat(4, minmax(0, 1fr))",
                            },
                            columnGap: { xs: 1, sm: 0.5, md: 0.25, lg: 0.5 },
                            rowGap: { xs: 1.5, sm: 1 },
                            alignItems: "start",
                          }}
                        >
                          {[
                            {
                              Icon: RestaurantOutlinedIcon,
                              title: impactBanner.items.food.title,
                              subtitle: impactBanner.items.food.subtitle,
                            },
                            {
                              Icon: HomeOutlinedIcon,
                              title: impactBanner.items.shelter.title,
                              subtitle: impactBanner.items.shelter.subtitle,
                            },
                            {
                              Icon: FavoriteBorderIcon,
                              title: impactBanner.items.healthcare.title,
                              subtitle: impactBanner.items.healthcare.subtitle,
                            },
                            {
                              Icon: VolunteerActivismOutlinedIcon,
                              title: impactBanner.items.rehab.title,
                              subtitle: impactBanner.items.rehab.subtitle,
                            },
                          ].map(({ Icon, title, subtitle }, index) => (
                            <MKBox
                              key={title}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 0.9,
                                px: { xs: 0.4, sm: 0.35, md: 0.4 },
                                minWidth: 0,
                                position: "relative",
                                borderLeft: {
                                  xs: "none",
                                  sm: index > 0 ? "1px solid rgba(31, 42, 68, 0.08)" : "none",
                                },
                              }}
                            >
                              <MKBox
                                sx={{
                                  width: { xs: 46, sm: 44, md: 48, lg: 52 },
                                  height: { xs: 46, sm: 44, md: 48, lg: 52 },
                                  borderRadius: "50%",
                                  backgroundColor: "rgba(79, 169, 83, 0.08)",
                                  border: "1px solid rgba(79, 169, 83, 0.14)",
                                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <Icon
                                  sx={{
                                    color: "#3d7a42",
                                    fontSize: { xs: 21, sm: 20, md: 21, lg: 23 },
                                  }}
                                />
                              </MKBox>
                              <MKBox sx={{ minWidth: 0, width: "100%" }}>
                                <MKTypography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: {
                                      xs: "0.8rem",
                                      sm: "0.72rem",
                                      md: "0.76rem",
                                      lg: "0.84rem",
                                    },
                                    color: "#1f2a44",
                                    lineHeight: 1.2,
                                    letterSpacing: "0.01em",
                                  }}
                                >
                                  {title}
                                </MKTypography>
                                <MKTypography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: {
                                      xs: "0.72rem",
                                      sm: "0.66rem",
                                      md: "0.7rem",
                                      lg: "0.76rem",
                                    },
                                    color: "rgba(31, 42, 68, 0.55)",
                                    lineHeight: 1.25,
                                    mt: 0.3,
                                  }}
                                >
                                  {subtitle}
                                </MKTypography>
                              </MKBox>
                            </MKBox>
                          ))}
                        </MKBox>
                      </MKBox>
                    </Grid>

                    <Grid item xs={12} md={7} lg={7}>
                      <MKBox
                        sx={{
                          p: "4px",
                          borderRadius: "14px",
                          backgroundColor: "#ECA533",
                          boxShadow: "0 8px 22px rgba(31, 42, 68, 0.08)",
                        }}
                      >
                        <MKBox
                          component="img"
                          src={donateImg}
                          alt={impactBanner.title}
                          width="100%"
                          height={{ xs: "180px", sm: "210px", md: "230px", lg: "240px" }}
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                          sx={{
                            display: "block",
                            objectFit: "cover",
                            objectPosition: "center",
                            borderRadius: "10px",
                            border: "3px solid #ffffff",
                            backgroundColor: "#fff",
                          }}
                        />
                      </MKBox>
                    </Grid>
                  </Grid>
                </MKBox>
              </MKBox>
            </LazyVisible>

            <MKBox
              component="section"
              pt={{ xs: 4.5, sm: 5, md: 5.5 }}
              pb={1.5}
              mt={{ xs: 3, sm: 3.5, md: 4 }}
              mb={1}
              mx={0}
              px={{ xs: 1.5, sm: 2, md: 3, lg: 4 }}
              sx={{
                backgroundColor: "#fafafa",
                borderRadius: "20px",
              }}
            >
              <Grid
                container
                pt={{ xs: 2, sm: 2.5 }}
                px={{ xs: 1, sm: 2 }}
                spacing={{ xs: 2, md: 3 }}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={12} md={10} lg={8} textAlign="center">
                  <MKBox
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "baseline",
                      justifyContent: "center",
                      columnGap: { xs: 2, sm: 3 },
                      rowGap: { xs: 0.5, sm: 0.75 },
                    }}
                  >
                    <MKTypography
                      component="span"
                      variant="h4"
                      fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                      sx={{
                        fontSize: { xs: "1.7rem", sm: "2.05rem", md: "2.15rem", lg: "2.35rem" },
                        fontWeight: "500",
                        color: "#ECA533",
                      }}
                    >
                      {donatePage.membershipSection.title}
                    </MKTypography>
                    <MKTypography
                      component="span"
                      variant="h4"
                      fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                      sx={{
                        fontSize: { xs: "1.05rem", sm: "1.3rem", md: "1.45rem", lg: "1.65rem" },
                        fontWeight: "500",
                        color: "#1f2a44",
                      }}
                    >
                      {donatePage.membershipSection.subTitle}
                    </MKTypography>
                  </MKBox>
                </Grid>
              </Grid>

              <MKBox
                sx={{
                  width: "100%",
                  px: { xs: 1, sm: 2, md: 2 },
                  pt: { xs: 2, sm: 2.5, md: 3 },
                  pb: { xs: 0.5, sm: 1 },
                }}
              >
                <SponsorPrabhujiCtaCards sponsor={donatePage.membershipSection.sponsorPrabhuji} />
              </MKBox>

              <Grid
                container
                pt={{ xs: 3.5, sm: 4, md: 4.5, lg: 5 }}
                pb={{ xs: 2, sm: 2.5 }}
                px={{ xs: 1, sm: 2, md: 2 }}
                spacing={{ xs: 2, lg: 3 }}
                alignItems="stretch"
              >
                <Grid item xs={12} lg={7}>
                  <MKBox
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                      textAlign: "left",
                      width: "100%",
                      maxWidth: { lg: 640 },
                      mx: { xs: "auto", lg: 0 },
                      px: { xs: 2, sm: 3 },
                      pr: { lg: 2 },
                    }}
                  >
                    <MKTypography
                      fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                      sx={{
                        fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.3rem", lg: "1.5rem" },
                        fontWeight: 400,
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      {donatePage.membershipSection.foodSponsorship.title}
                    </MKTypography>
                    <MKTypography
                      sx={{
                        mt: 0.5,
                        mb: { xs: 1.25, sm: 1.5 },
                        fontSize: { xs: "0.78rem", sm: "0.82rem", md: "0.85rem" },
                        fontWeight: 400,
                        color: "rgba(31, 42, 68, 0.6)",
                        lineHeight: 1.5,
                        letterSpacing: "0.02em",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      {donatePage.membershipSection.foodSponsorship.subtitle}
                    </MKTypography>
                    <MKBox
                      component="ul"
                      sx={{
                        listStyle: "none",
                        m: 0,
                        p: 0,
                        width: "100%",
                        pl: { xs: 0, lg: 0.5 },
                      }}
                    >
                      {donatePage.membershipSection.foodSponsorship.items.map((row, idx, arr) => (
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
                            alignItems: "center",
                            py: 1.1,
                            letterSpacing: "0.05rem",
                            borderBottom:
                              idx < arr.length - 1 ? "1px solid rgba(31, 42, 68, 0.08)" : "none",
                          }}
                        >
                          <MKTypography
                            component="span"
                            fontSize={{
                              xs: "0.8rem",
                              sm: "0.9rem",
                              md: "0.9rem",
                              lg: "1rem",
                            }}
                            sx={{
                              minWidth: 0,
                              fontWeight: 500,
                              color: "#1f2a44",
                              lineHeight: 1.45,
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
                              lg: "1rem",
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

                    <MKBox
                      sx={{
                        width: "100%",
                        pl: { xs: 0, lg: 0.5 },
                        pt: { xs: 1.5, sm: 2, md: 2.5, lg: 2.5 },
                      }}
                    >
                      <DonateSectionPricingList
                        title={donatePage.membershipSection.membership.title}
                        subtitle={donatePage.membershipSection.membership.subtitle}
                        items={donatePage.membershipSection.membership.items}
                        wideAmountColumn
                      />
                    </MKBox>
                  </MKBox>
                </Grid>

                <Grid item xs={12} lg={5}>
                  <MKBox
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    sx={{
                      height: "100%",
                      pt: { xs: 1, lg: 0.5 },
                      pl: { xs: 0, lg: 2 },
                      pr: { xs: 0, lg: 1 },
                      px: { xs: 2, sm: 3 },
                      backgroundColor: "transparent",
                      backgroundImage: "none",
                      boxShadow: "none",
                    }}
                  >
                    <MKBox
                      component="figure"
                      sx={{
                        m: 0,
                        mx: "auto",
                        p: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: { xs: "100%", sm: "90%", md: "85%", lg: "100%" },
                        maxWidth: { xs: 260, sm: 280, md: 280, lg: 320 },
                        overflow: "hidden",
                        backgroundColor: "transparent",
                        backgroundImage: "none",
                        boxShadow: "none",
                        border: "none",
                      }}
                    >
                      <MKBox
                        component="img"
                        src={donate2UpiQr}
                        alt="Aadar Foundation UPI QR — scan to donate"
                        width="674"
                        height="1090"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        sx={{
                          display: "block",
                          width: "100%",
                          maxWidth: { xs: 260, sm: 280, md: 280, lg: 320 },
                          aspectRatio: "674 / 1090",
                          height: "auto",
                          objectFit: "contain",
                          objectPosition: "center",
                          p: 0,
                          m: 0,
                          border: "1.5px solid rgba(100, 149, 237, 0.45)",
                          borderRadius: "12px",
                          boxShadow:
                            "0 8px 24px rgba(31, 42, 68, 0.1), 0 2px 8px rgba(31, 42, 68, 0.06)",
                          backgroundColor: "#fff",
                        }}
                      />
                    </MKBox>
                  </MKBox>
                </Grid>

                <Grid item xs={12}>
                  <MKBox
                    sx={{
                      px: { xs: 0.5, sm: 1, md: 1.5 },
                      mt: { xs: 1.5, sm: 2 },
                      mb: { xs: 0.5, sm: 1 },
                    }}
                  >
                    <DonateReceiptCta />
                  </MKBox>
                </Grid>

                <Grid item xs={12}>
                  <LazyVisible
                    rootMargin="700px"
                    minHeight={{ xs: 360, sm: 300, md: 280, lg: 260 }}
                  >
                    <MKBox
                      sx={{
                        mt: { xs: 1, sm: 1.5 },
                        mb: { xs: 0.5, sm: 1 },
                        px: { xs: 0.5, sm: 1, md: 1.5 },
                      }}
                    >
                      <MKBox
                        sx={{
                          borderRadius: "22px",
                          px: { xs: 1.75, sm: 2.5, md: 3 },
                          py: { xs: 2, sm: 2.25, md: 2.5 },
                          background:
                            "linear-gradient(180deg, rgba(255, 251, 242, 0.55) 0%, rgba(255, 245, 230, 0.35) 100%)",
                          border: "1px solid rgba(236, 165, 51, 0.14)",
                          boxShadow: "0 14px 34px rgba(31, 42, 68, 0.05)",
                        }}
                      >
                        <MKBox
                          sx={{
                            textAlign: "center",
                            mb: { xs: 1.5, sm: 1.75 },
                          }}
                        >
                          <MKTypography
                            variant="h4"
                            fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                            sx={{
                              fontWeight: 400,
                              fontSize: { xs: "1.25rem", sm: "1.35rem", md: "1.5rem" },
                              color: "#1f2a44",
                              lineHeight: 1.25,
                            }}
                          >
                            {donatePage.bankAccountDetails.title}
                          </MKTypography>
                          {donatePage.bankAccountDetails.subtitle ? (
                            <MKTypography
                              component="span"
                              sx={{
                                display: "block",
                                mt: 0.4,
                                fontSize: { xs: "0.78rem", sm: "0.82rem", md: "0.88rem" },
                                fontWeight: 400,
                                color: "rgba(31, 42, 68, 0.5)",
                                letterSpacing: "0.02em",
                                lineHeight: 1.3,
                              }}
                            >
                              {donatePage.bankAccountDetails.subtitle}
                            </MKTypography>
                          ) : null}
                        </MKBox>

                        <Grid container spacing={{ xs: 2, md: 2.5 }} alignItems="stretch">
                          {[
                            {
                              Icon: PersonOutlineIcon,
                              label: donatePage.bankAccountDetails.acccountName.title,
                              value: donatePage.bankAccountDetails.acccountName.value,
                            },
                            {
                              Icon: AccountBalanceOutlinedIcon,
                              label: donatePage.bankAccountDetails.bankName.title,
                              value: donatePage.bankAccountDetails.bankName.value,
                            },
                            {
                              Icon: CodeOutlinedIcon,
                              label: donatePage.bankAccountDetails.ifscCode.title,
                              value: "BARB0VJCCGW",
                              nowrap: true,
                            },
                            {
                              Icon: CreditCardOutlinedIcon,
                              label: donatePage.bankAccountDetails.accountNo.title,
                              value: "67940100000154",
                              nowrap: true,
                            },
                          ].map(({ Icon, label, value, nowrap }) => (
                            <Grid item xs={12} sm={6} lg={3} key={label}>
                              <MKBox
                                sx={{
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.4,
                                  px: 1.8,
                                  py: 1.5,
                                  borderRadius: "16px",
                                  backgroundColor: "rgba(255, 255, 255, 0.65)",
                                  border: "1px solid rgba(31, 42, 68, 0.06)",
                                  backdropFilter: "blur(10px)",
                                }}
                              >
                                <MKBox
                                  sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "999px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "rgba(236, 165, 51, 0.18)",
                                    color: "#1f2a44",
                                    flex: "0 0 auto",
                                  }}
                                >
                                  <Icon sx={{ fontSize: 24 }} />
                                </MKBox>

                                <MKBox sx={{ minWidth: 0, flex: 1, pr: 0.5 }}>
                                  <MKTypography
                                    sx={{
                                      fontSize: "0.8rem",
                                      fontWeight: 800,
                                      color: "rgba(31, 42, 68, 0.55)",
                                      lineHeight: 1.1,
                                      mb: 0.6,
                                    }}
                                  >
                                    {label}
                                  </MKTypography>
                                  <MKTypography
                                    sx={{
                                      fontSize: "0.85rem",
                                      fontWeight: 600,
                                      color: "#1f2a44",
                                      lineHeight: 1.25,
                                      wordBreak: "normal",
                                      overflowWrap: "break-word",
                                      whiteSpace: nowrap ? "nowrap" : "normal",
                                    }}
                                    title={value}
                                  >
                                    {value}
                                  </MKTypography>
                                </MKBox>

                                <Tooltip title={donatePage.clickToCopy} placement="top">
                                  <MKButton
                                    onClick={() => navigator.clipboard.writeText(value)}
                                    variant="text"
                                    color="text"
                                    size="small"
                                    iconOnly
                                    sx={{
                                      flex: "0 0 auto",
                                      minWidth: "unset",
                                      width: 32,
                                      height: 32,
                                      borderRadius: "10px",
                                      "&:hover": {
                                        backgroundColor: "rgba(31, 42, 68, 0.06)",
                                      },
                                    }}
                                  >
                                    <ContentCopyIcon sx={{ fontSize: 18 }} />
                                  </MKButton>
                                </Tooltip>
                              </MKBox>
                            </Grid>
                          ))}
                        </Grid>

                        <MKBox display="flex" justifyContent="center" mt={{ xs: 2.2, sm: 2.6 }}>
                          <MKButton
                            component={Link}
                            to={donateCheckoutNav.pathname}
                            state={donateCheckoutNav.state}
                            disabled={!amountCheck.ok}
                            aria-disabled={!amountCheck.ok}
                            variant="contained"
                            startIcon={<BoltOutlinedIcon />}
                            sx={{
                              borderRadius: "10px",
                              py: { xs: 0.85, sm: 0.95 },
                              px: { xs: 2.25, sm: 2.75 },
                              fontSize: { xs: "0.78rem", sm: "0.82rem" },
                              fontWeight: 700,
                              background:
                                "linear-gradient(90deg, #4FA953 0%, #45a049 55%, #4FA953 100%)",
                              color: "#ffffff !important",
                              boxShadow: "0 8px 18px rgba(79, 169, 83, 0.20)",
                              textTransform: "none",
                              textDecoration: "none",
                              letterSpacing: "0.2px",
                              transition:
                                "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
                              "&&": {
                                color: "#ffffff",
                              },
                              "& *": {
                                color: "#ffffff",
                              },
                              "& .MuiSvgIcon-root": {
                                color: "#ffffff",
                              },
                              "&:hover": {
                                background:
                                  "linear-gradient(90deg, #45a049 0%, #3d8a41 55%, #45a049 100%)",
                                boxShadow: "0 12px 24px rgba(79, 169, 83, 0.26)",
                                textDecoration: "none",
                                transform: "translateY(-1px)",
                              },
                              "&:active": {
                                transform: "translateY(0px)",
                                boxShadow: "0 6px 14px rgba(79, 169, 83, 0.22)",
                              },
                              "&:focus, &.Mui-focusVisible, &:focus-visible, &:focus:not(:hover)": {
                                background:
                                  "linear-gradient(90deg, #4FA953 0%, #45a049 55%, #4FA953 100%)",
                                color: "#ffffff",
                                boxShadow: "0 8px 18px rgba(79, 169, 83, 0.20)",
                                outline: "none",
                              },
                              "& .MuiButton-startIcon": {
                                marginRight: { xs: 0.6, sm: 0.75 },
                              },
                              "& .MuiButton-startIcon .MuiSvgIcon-root": {
                                fontSize: { xs: 16, sm: 18 },
                              },
                            }}
                          >
                            {donatePage.donateInstantlyInstead}
                          </MKButton>
                        </MKBox>
                      </MKBox>
                    </MKBox>
                  </LazyVisible>
                </Grid>

                <Grid item xs={12}>
                  <MKBox
                    width={{ xs: "100%", sm: "88%", md: "72%" }}
                    p={{ xs: 1.5, sm: 1.75 }}
                    mx="auto"
                    mt={{ xs: 1.5, sm: 2 }}
                    textAlign="center"
                    sx={{
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                  >
                    <MKTypography
                      fontSize={{ xs: "0.78rem", sm: "0.84rem" }}
                      sx={{
                        color: "rgba(31, 42, 68, 0.78)",
                        lineHeight: 1.65,
                        m: 0,
                        maxWidth: "36rem",
                        mx: "auto",
                      }}
                    >
                      {donatePage.message80g}
                    </MKTypography>
                    <MKBox
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      flexWrap="wrap"
                      gap={{ xs: 0.65, sm: 0.9 }}
                      mt={1.5}
                      px={{ xs: 1.25, sm: 1.75 }}
                      py={{ xs: 0.7, sm: 0.85 }}
                      mx="auto"
                      sx={{
                        borderRadius: "999px",
                        backgroundColor: "rgba(79, 169, 83, 0.1)",
                        border: "1px solid rgba(79, 169, 83, 0.24)",
                      }}
                    >
                      <MKTypography
                        fontSize={{ xs: "0.8rem", sm: "0.86rem" }}
                        sx={{ color: "#166534", fontWeight: 700, lineHeight: 1 }}
                      >
                        {donatePage.panLabel}:
                      </MKTypography>
                      <MKTypography
                        component="span"
                        fontSize={{ xs: "0.82rem", sm: "0.88rem" }}
                        sx={{
                          color: "#14532d",
                          fontWeight: 800,
                          fontFamily: '"Roboto Mono", "Consolas", monospace',
                          letterSpacing: "0.06em",
                          lineHeight: 1,
                        }}
                      >
                        {donatePage.panValue}
                      </MKTypography>
                      <MKBox
                        aria-hidden
                        sx={{
                          width: "1px",
                          height: 16,
                          backgroundColor: "rgba(22, 101, 52, 0.28)",
                          display: { xs: "none", sm: "block" },
                        }}
                      />
                      <MKBox display="flex" alignItems="center" gap={0.5}>
                        <VerifiedUserOutlinedIcon sx={{ fontSize: 16, color: "#166534" }} />
                        <MKTypography
                          fontSize={{ xs: "0.8rem", sm: "0.86rem" }}
                          sx={{ color: "#166534", fontWeight: 700, lineHeight: 1 }}
                        >
                          {donatePage.certified80gLabel}
                        </MKTypography>
                      </MKBox>
                    </MKBox>
                    <MKTypography
                      component="p"
                      fontSize={{ xs: "0.72rem", sm: "0.76rem" }}
                      sx={{
                        color: "rgba(31, 42, 68, 0.55)",
                        lineHeight: 1.6,
                        mt: 1.25,
                        mb: 0,
                        whiteSpace: "pre-line",
                        maxWidth: "32rem",
                        mx: "auto",
                      }}
                    >
                      {donatePage.domesticDonationsFootnote}
                    </MKTypography>
                  </MKBox>
                </Grid>
              </Grid>
            </MKBox>
          </Container>
        </MKBox>
      </Card>

      {/* Footer */}
      <MKBox pt={1} px={0} mt={0}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default Donate2;
