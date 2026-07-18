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
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SunriseOutlinedIcon from "components/Icons/SunriseOutlinedIcon";
import MealCoverIcon from "components/Icons/MealCoverIcon";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
import LandingPageHero from "components/LandingPageHero";
import donate2UpiQr from "assets/images/donate2-upi-qr.png";
import donateImg from "assets/images/donate-happy-faces.png";
import MKButton from "components/MKButton";

import DonateTrustBanner from "pages/LandingPages/shared/DonateTrustBanner";
import DonateReceiptCta from "pages/LandingPages/shared/DonateReceiptCta";
import SponsorPrabhujiCtaCards from "pages/LandingPages/shared/SponsorPrabhujiCtaCards";
import LazyVisible from "components/LazyMedia/LazyVisible";

import {
  DONATE_PAGE_PATH,
  DONATE_WIDGET_PRESET_PURPOSE,
  getDonationCheckoutNavigation,
  sanitizeAmountInput,
  validateAmountInr,
} from "utils/donation";
import {
  MEMBERSHIP_TIERS,
  MEMBERSHIP_TIER_ORDER,
  MEMBERSHIP_FREQUENCIES,
  getMembershipAmountInr,
  getMembershipCheckoutNavigation,
} from "utils/membership";
import { getPageHeroSrcForViewport } from "utils/pageHeroAssets";

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

  // Recurring membership widget mode: "onetime" | "monthly" | "yearly".
  const [givingMode, setGivingMode] = React.useState("onetime");
  const [selectedTier, setSelectedTier] = React.useState("supporter");
  const isRecurringMode = givingMode !== "onetime";
  const membershipFrequency = givingMode === "yearly" ? "yearly" : "monthly";
  const membershipAmountInr = getMembershipAmountInr(selectedTier, membershipFrequency);

  // Help LCP on direct loads: ask the browser to fetch the hero image as early
  // as possible once this route mounts (without globally preloading it for
  // every page in `public/index.html`).
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const href = getPageHeroSrcForViewport();
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
  const oneTimeCheckoutNav = React.useMemo(
    () =>
      getDonationCheckoutNavigation({
        purpose: widgetPresetPurpose,
        amountInr: amountCheck.ok ? amountCheck.valueInr : 0,
        useFreeAmount: usingCustomAmount,
      }),
    [widgetPresetPurpose, amountCheck.ok, amountCheck.valueInr, usingCustomAmount]
  );
  const membershipCheckoutNav = React.useMemo(
    () =>
      getMembershipCheckoutNavigation({ tierKey: selectedTier, frequency: membershipFrequency }),
    [selectedTier, membershipFrequency]
  );
  const donateCheckoutNav = isRecurringMode ? membershipCheckoutNav : oneTimeCheckoutNav;
  const checkoutIsReady = isRecurringMode ? membershipAmountInr > 0 : amountCheck.ok;

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

      <LandingPageHero
        title={donatePage.tagLine}
        minHeight={{ xs: "55vh", sm: "65vh", md: "80vh" }}
      />

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
        <MKBox component="section" my={{ xs: 1.5, sm: 1.75, md: 2 }}>
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
                  pt={{ xs: 1, sm: 1.25, md: 1.5 }}
                  pb={{ xs: 2.75, sm: 3.25, md: 3.75 }}
                >
                  {donatePage.title}
                </MKTypography>
              </Grid>
            </Grid>

            <Grid
              container
              pt={{ xs: 1.25, sm: 1.5, md: 1.75 }}
              spacing={{ xs: 2.5, md: 3 }}
              alignItems="stretch"
            >
              <Grid item xs={12} lg={6} xl={6} sx={{ display: "flex" }}>
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
                      fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem", lg: "1.6rem" },
                      lineHeight: 1.3,
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
                        fontSize: { xs: "1.45rem", sm: "1.65rem", md: "1.75rem", lg: "1.9rem" },
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
                      fontSize={{ xs: "0.8rem", sm: "0.85rem", md: "0.88rem", lg: "0.92rem" }}
                      fontFamily='"Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                      sx={{
                        letterSpacing: "0.03rem",
                        lineHeight: 1.5,
                        color: "#1f2a44",
                        maxWidth: 640,
                        paddingTop: { xs: "10px", sm: "10px", md: "8px", lg: "6px" },
                      }}
                      mt={{ md: 1, lg: 1.25 }}
                    >
                      {donatePage.description}
                    </MKTypography>
                  </MKTypography>
                  <MKBox
                    sx={{
                      width: "100%",
                      maxWidth: 640,
                      mt: { xs: 1.5, sm: 1.75, md: 2, lg: "auto" },
                      pt: { lg: 2.25 },
                    }}
                  >
                    <Grid
                      container
                      spacing={{ xs: 0.85, sm: 1 }}
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
                            py={0.85}
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
                      spacing={{ xs: 0.85, sm: 1.25 }}
                      mt={{ xs: 0.85, sm: 1 }}
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
                      ].map(({ id, Icon, title, subtitle, amount, period }) => {
                        return (
                          <Grid item xs={12} sm={4} key={id}>
                            <MKBox
                              display="flex"
                              flexDirection="column"
                              pl={2}
                              pr={1.75}
                              py={{ xs: 1.5, sm: 1.5 }}
                              sx={{
                                backgroundColor: "#ffffff",
                                borderRadius: "14px",
                                border: "1px solid rgba(31, 42, 68, 0.06)",
                                boxShadow:
                                  "inset 3px 0 0 rgba(236, 165, 51, 0.45), 0 8px 20px rgba(31, 42, 68, 0.06), 0 2px 5px rgba(31, 42, 68, 0.03)",
                                height: "100%",
                                textDecoration: "none",
                                color: "inherit",
                                cursor: "default",
                              }}
                            >
                              <MKBox display="flex" alignItems="flex-start" gap={1.25}>
                                <MKBox
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  sx={{
                                    width: { xs: 38, sm: 40 },
                                    height: { xs: 38, sm: 40 },
                                    borderRadius: "10px",
                                    backgroundColor: "rgba(79, 169, 83, 0.08)",
                                    color: "#4fa953",
                                    flex: "0 0 auto",
                                  }}
                                >
                                  <Icon sx={{ fontSize: { xs: 21, sm: 22 } }} />
                                </MKBox>
                                <MKBox
                                  sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
                                >
                                  <MKTypography
                                    variant="button"
                                    sx={{
                                      fontWeight: 800,
                                      fontSize: { xs: "0.8rem", sm: "0.84rem" },
                                      lineHeight: 1.15,
                                      letterSpacing: "0.01rem",
                                      textTransform: "none",
                                      color: "rgba(31, 42, 68, 0.82)",
                                      minHeight: { xs: "auto", sm: "2.3em" },
                                      overflowWrap: "normal",
                                      wordBreak: "normal",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {title}
                                  </MKTypography>
                                  <MKTypography
                                    sx={{
                                      fontSize: { xs: "0.64rem", sm: "0.68rem" },
                                      fontWeight: 500,
                                      color: "rgba(31, 42, 68, 0.6)",
                                      lineHeight: 1.2,
                                      mt: "3px",
                                      minHeight: { xs: "auto", sm: "2.4em" },
                                      overflowWrap: "normal",
                                      wordBreak: "normal",
                                    }}
                                  >
                                    {subtitle}
                                  </MKTypography>
                                </MKBox>
                              </MKBox>

                              <MKBox
                                sx={{
                                  borderTop: "1px dashed rgba(31, 42, 68, 0.16)",
                                  my: { xs: 1, sm: 1.1 },
                                }}
                              />

                              <MKBox display="flex" alignItems="baseline" flexWrap="wrap" gap="6px">
                                <MKTypography
                                  sx={{
                                    fontSize: { xs: "0.74rem", sm: "0.82rem" },
                                    fontWeight: 700,
                                    color: "#4fa953",
                                    lineHeight: 1.2,
                                    fontVariantNumeric: "tabular-nums",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {amount}
                                </MKTypography>
                                {period && (
                                  <MKTypography
                                    sx={{
                                      fontSize: { xs: "0.62rem", sm: "0.66rem" },
                                      fontWeight: 500,
                                      color: "rgba(31, 42, 68, 0.55)",
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    {period}
                                  </MKTypography>
                                )}
                              </MKBox>
                            </MKBox>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </MKBox>
                </MKBox>
              </Grid>

              <Grid item xs={12} lg={6} xl={6} sx={{ display: "flex" }}>
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
                      pt={2}
                      pb={1}
                      textAlign="center"
                      sx={{
                        background:
                          "linear-gradient(180deg, rgba(245, 247, 250, 1) 0%, rgba(250, 251, 252, 1) 60%)",
                      }}
                    >
                      <MKTypography
                        fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                        sx={{
                          fontSize: { xs: "1.3rem", sm: "1.45rem" },
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
                              fontSize: { xs: 20, sm: 22 },
                              transform: "translateY(1px) rotate(12deg)",
                            }}
                          />
                        </MKBox>
                      </MKTypography>
                      <MKTypography
                        sx={{
                          mt: 0.6,
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          color: "rgba(66, 86, 122, 0.75)",
                        }}
                      >
                        {isRecurringMode
                          ? donatePage.membership.chooseTitle
                          : donatePage.selectAmount}
                      </MKTypography>
                    </MKBox>

                    <MKBox
                      px={2.5}
                      pb={{ xs: 1.75, sm: 2, md: 2.25 }}
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <MKBox
                        display="flex"
                        sx={{
                          backgroundColor: "#f5f7fa",
                          border: "1px solid rgba(31, 42, 68, 0.08)",
                          borderRadius: "999px",
                          p: "4px",
                          mb: 1.25,
                          gap: 0.25,
                        }}
                      >
                        {[
                          { id: "onetime", label: donatePage.membership.toggleOneTime },
                          { id: "monthly", label: donatePage.membership.toggleMonthly },
                          { id: "yearly", label: donatePage.membership.toggleYearly },
                        ].map(({ id, label }) => {
                          const active = givingMode === id;
                          return (
                            <MKBox
                              key={id}
                              component="button"
                              type="button"
                              onClick={() => setGivingMode(id)}
                              sx={{
                                flex: 1,
                                position: "relative",
                                border: "none",
                                outline: "none",
                                backgroundColor: active ? "rgba(79, 169, 83, 0.1)" : "transparent",
                                borderRadius: "10px",
                                py: 1,
                                px: 1,
                                cursor: "pointer",
                                transition: "background-color 0.18s ease",
                                "&:hover": {
                                  backgroundColor: active
                                    ? "rgba(79, 169, 83, 0.14)"
                                    : "rgba(31, 42, 68, 0.05)",
                                },
                              }}
                            >
                              <MKTypography
                                sx={{
                                  fontSize: "0.85rem",
                                  fontWeight: active ? 800 : 600,
                                  color: active ? "#2e7d32" : "rgba(31, 42, 68, 0.55)",
                                  lineHeight: 1.3,
                                }}
                              >
                                {label}
                              </MKTypography>
                              {active && (
                                <MKBox
                                  sx={{
                                    position: "absolute",
                                    bottom: 4,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: 26,
                                    height: 2.5,
                                    borderRadius: "999px",
                                    backgroundColor: "#2e7d32",
                                  }}
                                />
                              )}
                            </MKBox>
                          );
                        })}
                      </MKBox>

                      {isRecurringMode && (
                        <MKTypography
                          sx={{
                            mb: 1,
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            color: "rgba(31, 42, 68, 0.55)",
                          }}
                        >
                          {donatePage.membership.recurringNotice}
                        </MKTypography>
                      )}

                      {isRecurringMode && (
                        <Grid container spacing={1.25} mt={0.25}>
                          {MEMBERSHIP_TIER_ORDER.map((tierKey) => {
                            const tier = MEMBERSHIP_TIERS[tierKey];
                            const tierAmount = getMembershipAmountInr(tierKey, membershipFrequency);
                            const active = selectedTier === tierKey;
                            return (
                              <Grid item xs={12} sm={4} key={tierKey}>
                                <MKBox
                                  component="button"
                                  type="button"
                                  onClick={() => setSelectedTier(tierKey)}
                                  sx={{
                                    width: "100%",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    border: active
                                      ? "2px solid #ECA533"
                                      : "1px solid rgba(31, 42, 68, 0.14)",
                                    backgroundColor: active ? "#fff8ec" : "#ffffff",
                                    borderRadius: "10px",
                                    py: 1.25,
                                    px: 1,
                                    boxShadow: active
                                      ? "0 0 0 4px rgba(236, 165, 51, 0.22), 0 6px 14px rgba(236, 165, 51, 0.15)"
                                      : "0 1px 2px rgba(31, 42, 68, 0.04)",
                                    transition:
                                      "border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease",
                                  }}
                                >
                                  <MKTypography
                                    sx={{
                                      fontWeight: active ? 900 : 700,
                                      fontSize: "0.85rem",
                                      color: active ? "#8a5a12" : "#24324f",
                                    }}
                                  >
                                    {donatePage.membership.tiers[tierKey] || tier.label}
                                  </MKTypography>
                                  <MKTypography
                                    sx={{
                                      fontWeight: 800,
                                      fontSize: "1rem",
                                      color: active ? "#8a5a12" : "#2e7d32",
                                      mt: 0.25,
                                    }}
                                  >
                                    ₹{tierAmount.toLocaleString("en-IN")}
                                    <MKTypography component="span" sx={{ fontSize: "0.62rem" }}>
                                      /
                                      {MEMBERSHIP_FREQUENCIES[membershipFrequency].suffix.replace(
                                        "/",
                                        ""
                                      )}
                                    </MKTypography>
                                  </MKTypography>
                                </MKBox>
                              </Grid>
                            );
                          })}
                        </Grid>
                      )}

                      {!isRecurringMode && (
                        <>
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
                                          py: 1.15,
                                          fontWeight: active ? 900 : 700,
                                          fontSize: {
                                            xs: active ? "1rem" : "0.95rem",
                                            sm: active ? "1.05rem" : "1rem",
                                            md: active ? "1.1rem" : "1.05rem",
                                          },
                                          letterSpacing: "0.01em",
                                          minHeight: 46,
                                          transform: active ? "translateY(-1px)" : "none",
                                          transition:
                                            "border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease, transform 0.18s ease",
                                          "&:hover, &:focus, &:focus-visible, &:active": {
                                            background: active ? "#fff3dc" : "#faf6ef",
                                            backgroundColor: active ? "#fff3dc" : "#faf6ef",
                                            borderColor: active
                                              ? "#d9962e"
                                              : "rgba(31, 42, 68, 0.28)",
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
                            helperText={
                              customAmount && !amountCheck.ok ? amountCheck.error : undefined
                            }
                            inputProps={{ inputMode: "numeric", maxLength: 7, pattern: "[0-9]*" }}
                            sx={{
                              mt: 1.25,
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
                        </>
                      )}

                      <MKButton
                        component={Link}
                        to={donateCheckoutNav.pathname}
                        state={donateCheckoutNav.state}
                        onClick={(e) => {
                          if (!checkoutIsReady) e.preventDefault();
                        }}
                        disabled={!checkoutIsReady}
                        aria-disabled={!checkoutIsReady}
                        aria-label={
                          isRecurringMode
                            ? t("donatePage.membership.becomeMemberAriaLabel", {
                                amount: membershipAmountInr,
                                period:
                                  membershipFrequency === "yearly"
                                    ? donatePage.membership.perYearShort
                                    : donatePage.membership.perMonthShort,
                              })
                            : `Donate ₹${amountCheck.ok ? amountCheck.valueInr : ""} now`
                        }
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 1.25,
                          borderRadius: "12px",
                          py: 1.35,
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
                        {isRecurringMode
                          ? donatePage.membership.becomeMember
                          : donatePage.donateNow}
                      </MKButton>

                      <MKBox sx={{ mt: { xs: 1, lg: "auto" }, pt: { lg: 0.75 } }}>
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
                  pt: { xs: 3.5, sm: 4, md: 4.5 },
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
                            mb: { xs: 2.25, sm: 2.5 },
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
                      </MKBox>
                    </MKBox>
                  </LazyVisible>
                </Grid>

                <Grid item xs={12} sx={{ mt: { xs: 3, sm: 3.5, lg: 4 } }}>
                  <MKBox
                    sx={{
                      borderRadius: "20px",
                      backgroundColor: "#f7f8fa",
                      border: "none",
                      boxShadow: "0 8px 20px rgba(31, 42, 68, 0.04)",
                      p: { xs: 2, sm: 3 },
                      mx: { xs: 2, sm: 3, lg: 0 },
                    }}
                  >
                    {/* Section heading — spans both columns so Food Sponsorship and the
                        UPI alternative below start at the same vertical level */}
                    <MKBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: { xs: 1, sm: 1.5 },
                        mb: 1,
                      }}
                    >
                      <MKTypography
                        fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                        sx={{
                          fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                          fontWeight: 400,
                          color: "#1f2a44",
                          textAlign: "center",
                        }}
                      >
                        {donatePage.membershipSection.directGiving.title}
                      </MKTypography>
                    </MKBox>
                    <MKTypography
                      sx={{
                        mb: { xs: 3.5, sm: 4 },
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                        color: "rgba(31, 42, 68, 0.6)",
                        lineHeight: 1.5,
                        textAlign: "center",
                      }}
                    >
                      {donatePage.membershipSection.directGiving.subtitle}
                    </MKTypography>

                    <MKBox
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 7fr) minmax(0, 5fr)" },
                        columnGap: { lg: 5 },
                        rowGap: { xs: 3, sm: 3.5 },
                        alignItems: "stretch",
                      }}
                    >
                      <MKBox
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          minHeight: 0,
                        }}
                      >
                        {/* Food Sponsorship section */}
                        <MKBox sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 0.75 }}>
                          <MKBox
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              backgroundColor: "rgba(79, 169, 83, 0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <RestaurantOutlinedIcon sx={{ color: "#2e7d32", fontSize: 20 }} />
                          </MKBox>
                          <MKTypography
                            sx={{ fontWeight: 700, color: "#1f2a44", fontSize: "1rem" }}
                          >
                            {donatePage.membershipSection.directGiving.foodCard.title}
                          </MKTypography>
                        </MKBox>
                        <MKTypography
                          sx={{
                            fontSize: "0.8rem",
                            color: "rgba(31, 42, 68, 0.6)",
                            lineHeight: 1.5,
                            mb: 2,
                          }}
                        >
                          {donatePage.membershipSection.directGiving.foodCard.subtitle}
                        </MKTypography>

                        <MKBox
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
                            gap: { xs: 1.25, sm: 1.5 },
                          }}
                        >
                          {[
                            { Icon: SunriseOutlinedIcon },
                            { Icon: MealCoverIcon },
                            { Icon: GroupsOutlinedIcon },
                            { Icon: MealCoverIcon },
                          ].map(({ Icon }, idx) => {
                            const item = donatePage.membershipSection.foodSponsorship.items[idx];
                            const meta = donatePage.membershipSection.directGiving.foodItems[idx];
                            if (!item || !meta) return null;
                            return (
                              <MKBox
                                key={meta.title}
                                sx={{
                                  textAlign: "center",
                                  borderRadius: "14px",
                                  backgroundColor: "#ffffff",
                                  border: "1px solid rgba(31, 42, 68, 0.06)",
                                  px: 1,
                                  py: 1.5,
                                }}
                              >
                                <Icon sx={{ color: "#4fa953", fontSize: 44 }} />
                                <MKTypography
                                  sx={{
                                    mt: 0.6,
                                    fontWeight: 700,
                                    color: "#1f2a44",
                                    fontSize: "0.82rem",
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {meta.title}
                                </MKTypography>
                                <MKBox
                                  sx={{
                                    borderTop: "1px dashed rgba(31, 42, 68, 0.14)",
                                    my: 0.75,
                                  }}
                                />
                                <MKTypography
                                  sx={{
                                    fontWeight: 800,
                                    color: "#2e7d32",
                                    fontSize: "0.92rem",
                                    fontVariantNumeric: "tabular-nums",
                                  }}
                                >
                                  ₹{item.amount.replace(/^Rs\s*/i, "")}
                                </MKTypography>
                                <MKTypography
                                  sx={{
                                    mt: 0.25,
                                    fontSize: "0.68rem",
                                    color: "rgba(31, 42, 68, 0.55)",
                                  }}
                                >
                                  {meta.detail}
                                </MKTypography>
                              </MKBox>
                            );
                          })}
                        </MKBox>

                        {/* Membership Support section */}
                        <MKBox
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.25,
                            mt: { xs: 4, sm: 4.5 },
                            mb: 0.75,
                          }}
                        >
                          <MKBox
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              backgroundColor: "rgba(79, 169, 83, 0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <PersonOutlineIcon sx={{ color: "#2e7d32", fontSize: 20 }} />
                          </MKBox>
                          <MKTypography
                            sx={{ fontWeight: 700, color: "#1f2a44", fontSize: "1rem" }}
                          >
                            {donatePage.membershipSection.directGiving.membershipCard.title}
                          </MKTypography>
                        </MKBox>
                        <MKTypography
                          sx={{
                            fontSize: "0.8rem",
                            color: "rgba(31, 42, 68, 0.6)",
                            lineHeight: 1.5,
                            mb: 2,
                          }}
                        >
                          {donatePage.membershipSection.directGiving.membershipCard.subtitle}
                        </MKTypography>

                        <MKBox
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                            gap: { xs: 1.25, sm: 1.5 },
                          }}
                        >
                          {donatePage.membershipSection.membership.items.map((item, idx) => {
                            const meta =
                              donatePage.membershipSection.directGiving.membershipItems[idx];
                            if (!meta) return null;
                            const price = item.amount
                              .replace(/^Rs\s*/i, "")
                              .replace(/\s*\/\s*/g, " / ");
                            return (
                              <MKBox
                                key={meta.title}
                                sx={{
                                  textAlign: "center",
                                  borderRadius: "14px",
                                  backgroundColor: "#ffffff",
                                  border: "1px solid rgba(31, 42, 68, 0.06)",
                                  px: 1,
                                  py: 1.5,
                                }}
                              >
                                <MKTypography
                                  sx={{
                                    fontWeight: 700,
                                    color: "#1f2a44",
                                    fontSize: "0.85rem",
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {meta.title}
                                </MKTypography>
                                {item.detail ? (
                                  <MKTypography
                                    sx={{
                                      fontSize: "0.68rem",
                                      color: "rgba(31, 42, 68, 0.5)",
                                      mt: 0.15,
                                    }}
                                  >
                                    {item.detail.replace(/[()]/g, "").trim()}
                                  </MKTypography>
                                ) : null}
                                <MKBox
                                  sx={{
                                    borderTop: "1px dashed rgba(31, 42, 68, 0.14)",
                                    my: 0.75,
                                  }}
                                />
                                <MKTypography
                                  sx={{
                                    fontWeight: 800,
                                    color: "#2e7d32",
                                    fontSize: "0.92rem",
                                    fontVariantNumeric: "tabular-nums",
                                  }}
                                >
                                  ₹{price}
                                </MKTypography>
                              </MKBox>
                            );
                          })}
                        </MKBox>

                        <MKBox
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: { xs: 3.5, sm: 4, lg: "auto" },
                            pt: { lg: 2.5 },
                            mb: 0,
                          }}
                        >
                          <MKBox sx={{ position: "relative", width: "100%", maxWidth: 300 }}>
                            {/* Recommended badge — sits on top edge */}
                            <MKBox
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 2,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.3,
                                px: 0.7,
                                py: 0.15,
                                borderRadius: "999px",
                                backgroundColor: "#ffffff",
                                border: "1px solid rgba(126, 201, 132, 0.65)",
                                boxShadow: "0 1px 4px rgba(31, 42, 68, 0.06)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <StarRoundedIcon
                                sx={{ fontSize: 9, color: "#43a047", display: "block" }}
                              />
                              <MKTypography
                                component="span"
                                sx={{
                                  fontSize: "0.5rem",
                                  fontWeight: 600,
                                  color: "rgba(46, 125, 50, 0.7) !important",
                                  lineHeight: 1,
                                  letterSpacing: "0.01em",
                                }}
                              >
                                {donatePage.membershipSection.directGiving.donateNowBadge}
                              </MKTypography>
                            </MKBox>

                            <MKBox
                              component={Link}
                              to={donateCheckoutNav.pathname}
                              state={donateCheckoutNav.state}
                              onClick={(event) => {
                                if (!checkoutIsReady) event.preventDefault();
                              }}
                              aria-disabled={!checkoutIsReady}
                              tabIndex={checkoutIsReady ? 0 : -1}
                              sx={{
                                position: "relative",
                                display: "grid",
                                gridTemplateColumns: "40px minmax(0, 1fr) 40px",
                                "& .MuiSvgIcon-root": {
                                  fontSize: "30px !important",
                                  width: "30px !important",
                                  height: "30px !important",
                                },
                                alignItems: "center",
                                width: "100%",
                                minHeight: { xs: 64, sm: 68 },
                                boxSizing: "border-box",
                                textDecoration: "none",
                                cursor: checkoutIsReady ? "pointer" : "not-allowed",
                                opacity: checkoutIsReady ? 1 : 0.6,
                                pointerEvents: checkoutIsReady ? "auto" : "none",
                                borderRadius: "12px",
                                py: { xs: 1.4, sm: 1.55 },
                                px: { xs: 1.35, sm: 1.5 },
                                background:
                                  "linear-gradient(90deg, #4FA953 0%, #45a049 55%, #4FA953 100%)",
                                boxShadow: "0 6px 14px rgba(79, 169, 83, 0.16)",
                                transition:
                                  "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
                                "&:hover": {
                                  background:
                                    "linear-gradient(90deg, #45a049 0%, #3d8a41 55%, #45a049 100%)",
                                  boxShadow: "0 8px 18px rgba(79, 169, 83, 0.2)",
                                  transform: "translateY(-1px)",
                                },
                                "&:active": {
                                  transform: "translateY(0px)",
                                  boxShadow: "0 4px 10px rgba(79, 169, 83, 0.16)",
                                },
                              }}
                            >
                              {/* Left — hand + heart */}
                              <MKBox
                                sx={{
                                  width: 40,
                                  height: 40,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  justifySelf: "start",
                                  opacity: 0.92,
                                }}
                              >
                                <VolunteerActivismIcon
                                  sx={{ color: "#ffffff", display: "block" }}
                                />
                              </MKBox>

                              {/* Center — title + methods */}
                              <MKBox
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  textAlign: "center",
                                  px: 0.5,
                                }}
                              >
                                <MKTypography
                                  component="span"
                                  sx={{
                                    fontSize: { xs: "0.95rem", sm: "1.02rem" },
                                    fontWeight: 700,
                                    lineHeight: 1.1,
                                    color: "#ffffff !important",
                                    letterSpacing: "0.01em",
                                  }}
                                >
                                  {donatePage.membershipSection.directGiving.donateNowCta}
                                </MKTypography>
                                <MKTypography
                                  component="span"
                                  sx={{
                                    fontSize: { xs: "0.58rem", sm: "0.64rem" },
                                    fontWeight: 500,
                                    lineHeight: 1.2,
                                    mt: 0.3,
                                    color: "rgba(255, 255, 255, 0.82) !important",
                                  }}
                                >
                                  {donatePage.membershipSection.directGiving.donateNowMethods}
                                </MKTypography>
                              </MKBox>

                              {/* Right — arrow */}
                              <MKBox
                                sx={{
                                  width: 40,
                                  height: 40,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  justifySelf: "end",
                                  opacity: 0.92,
                                }}
                              >
                                <ArrowForwardIcon sx={{ color: "#ffffff", display: "block" }} />
                              </MKBox>
                            </MKBox>
                          </MKBox>
                        </MKBox>
                      </MKBox>

                      <MKBox
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          minHeight: 0,
                        }}
                      >
                        <MKBox
                          sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 1.25,
                            mb: 2,
                          }}
                        >
                          <MKBox
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              backgroundColor: "rgba(79, 169, 83, 0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <QrCodeScannerOutlinedIcon sx={{ color: "#2e7d32", fontSize: 20 }} />
                          </MKBox>
                          <MKBox sx={{ minWidth: 0 }}>
                            <MKTypography
                              sx={{ fontWeight: 700, color: "#1f2a44", fontSize: "1rem" }}
                            >
                              {donatePage.membershipSection.directGiving.scanCard.title}
                            </MKTypography>
                          </MKBox>
                        </MKBox>

                        <MKBox
                          component="figure"
                          sx={{
                            m: 0,
                            mx: "auto",
                            mb: 0,
                            mt: { lg: "auto" },
                            p: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            maxWidth: { xs: 260, sm: 280, md: 280, lg: 300 },
                            overflow: "hidden",
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
                              maxWidth: { xs: 260, sm: 280, md: 280, lg: 300 },
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
                    </MKBox>
                  </MKBox>
                </Grid>

                <Grid item xs={12}>
                  <MKBox
                    sx={{
                      px: { xs: 0.5, sm: 1, md: 1.5 },
                      mt: { xs: 3, sm: 3.5, md: 4 },
                      mb: { xs: 0.5, sm: 1 },
                    }}
                  >
                    <DonateReceiptCta />
                  </MKBox>
                </Grid>

                <Grid item xs={12}>
                  <MKBox
                    width="100%"
                    maxWidth={{ xs: "100%", sm: "52rem", md: "58rem" }}
                    px={{ xs: 1.25, sm: 1.5 }}
                    py={{ xs: 0.75, sm: 1 }}
                    mx="auto"
                    mt={{ xs: 1, sm: 1.25 }}
                    textAlign="center"
                    sx={{
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                  >
                    <MKTypography
                      fontSize={{ xs: "0.76rem", sm: "0.8rem" }}
                      sx={{
                        color: "rgba(31, 42, 68, 0.78)",
                        lineHeight: 1.45,
                        m: 0,
                      }}
                    >
                      {donatePage.message80g}
                    </MKTypography>
                    <MKBox
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexWrap="wrap"
                      gap={{ xs: 0.6, sm: 0.85 }}
                      mt={0.85}
                      mx="auto"
                    >
                      <MKBox
                        display="inline-flex"
                        alignItems="center"
                        gap={0.65}
                        px={{ xs: 1.2, sm: 1.4 }}
                        py={{ xs: 0.45, sm: 0.5 }}
                        sx={{
                          borderRadius: "999px",
                          backgroundColor: "rgba(236, 165, 51, 0.1)",
                          border: "1px solid rgba(236, 165, 51, 0.32)",
                          boxShadow: "0 2px 8px rgba(236, 165, 51, 0.14)",
                        }}
                      >
                        <BadgeOutlinedIcon sx={{ fontSize: 15, color: "#a3690a" }} />
                        <MKTypography
                          fontSize={{ xs: "0.74rem", sm: "0.8rem" }}
                          sx={{ color: "#a3690a", fontWeight: 700, lineHeight: 1 }}
                        >
                          {donatePage.panLabel}: {donatePage.panValue}
                        </MKTypography>
                      </MKBox>

                      <MKBox
                        display="inline-flex"
                        alignItems="center"
                        gap={0.65}
                        px={{ xs: 1.2, sm: 1.4 }}
                        py={{ xs: 0.45, sm: 0.5 }}
                        sx={{
                          borderRadius: "999px",
                          backgroundColor: "rgba(79, 169, 83, 0.1)",
                          border: "1px solid rgba(79, 169, 83, 0.32)",
                          boxShadow: "0 2px 8px rgba(79, 169, 83, 0.14)",
                        }}
                      >
                        <VerifiedUserOutlinedIcon sx={{ fontSize: 15, color: "#2e7d32" }} />
                        <MKTypography
                          fontSize={{ xs: "0.74rem", sm: "0.8rem" }}
                          sx={{ color: "#2e7d32", fontWeight: 700, lineHeight: 1 }}
                        >
                          {donatePage.certified80gLabel}
                        </MKTypography>
                      </MKBox>
                    </MKBox>
                    <MKTypography
                      component="p"
                      fontSize={{ xs: "0.7rem", sm: "0.74rem" }}
                      sx={{
                        color: "rgba(31, 42, 68, 0.55)",
                        lineHeight: 1.45,
                        mt: 0.75,
                        mb: 0,
                        whiteSpace: "pre-line",
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
