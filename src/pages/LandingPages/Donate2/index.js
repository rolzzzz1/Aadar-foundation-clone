import React from "react";
import { useTranslation } from "react-i18next";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
import MKBox from "components/MKBox";
import LandingPageHero from "components/LandingPageHero";
import getRoutes from "routes1";
import getFooterRoutes from "footer.routes1";
import {
  DONATE_PAGE_PATH,
  DONATE_WIDGET_PRESET_PURPOSE,
  getDonationCheckoutNavigation,
  validateAmountInr,
} from "utils/donation";
import { getPageHeroSrcForViewport } from "utils/pageHeroAssets";
import DonateGivingBody from "./DonateGivingBody";
import DonateImpactProof from "./DonateImpactProof";
import { FALLBACK_TESTIMONIALS } from "./ImpactTestimonialCarousel";
import DonateJoinOfflineSection from "./DonateJoinOfflineSection";

/** Donate2 page — composed from section components under this folder. */
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
          livesSupported: "600+",
          livesSupportedLabel: "Lives Supported",
          impactMessage: "Making a difference together, one life at a time.",
          testimonials: FALLBACK_TESTIMONIALS,
        };

  const [selectedAmount, setSelectedAmount] = React.useState(1001);
  const [customAmount, setCustomAmount] = React.useState("");
  const [bankOpen, setBankOpen] = React.useState(false);

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
  const amountInr = amountCheck.ok ? amountCheck.valueInr : 0;
  const widgetPresetPurpose = DONATE_WIDGET_PRESET_PURPOSE[amountInr] || null;
  const useFreeAmount = usingCustomAmount && !widgetPresetPurpose;
  const isMealSponsorshipSelected = widgetPresetPurpose === "meal-sponsorship";
  const donateCheckoutNav = React.useMemo(
    () =>
      getDonationCheckoutNavigation({
        purpose: widgetPresetPurpose,
        amountInr,
        useFreeAmount,
      }),
    [widgetPresetPurpose, amountInr, useFreeAmount]
  );
  const checkoutIsReady = amountCheck.ok;

  const scrollToDonateWidget = React.useCallback(() => {
    const el = document.getElementById("donate-widget");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <MKBox
      minWidth="320px"
      sx={{
        // Keep in-page anchors / widget scrolls clear of the sticky navbar on phones.
        scrollPaddingTop: { xs: "96px", sm: "110px", md: "120px" },
      }}
    >
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

      <Card
        sx={{
          p: { xs: 1.25, sm: 2 },
          pb: { xs: 1.5, sm: 2 },
          mx: { xs: 1.25, sm: 2, lg: 3 },
          mt: -2,
          mb: 1.5,
          backgroundColor: "#faf8f2",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <MKBox component="section" mt={{ xs: 1.5, sm: 1.75, md: 2 }} mb={{ xs: 1.5, sm: 2 }}>
          <Container>
            <DonateGivingBody
              donatePage={donatePage}
              selectedAmount={selectedAmount}
              setSelectedAmount={setSelectedAmount}
              customAmount={customAmount}
              setCustomAmount={setCustomAmount}
              scrollToDonateWidget={scrollToDonateWidget}
              isMealSponsorshipSelected={isMealSponsorshipSelected}
              amountCheck={amountCheck}
              donateCheckoutNav={donateCheckoutNav}
              checkoutIsReady={checkoutIsReady}
            />
            <DonateImpactProof
              donatePage={donatePage}
              impactBanner={impactBanner}
              scrollToDonateWidget={scrollToDonateWidget}
            />
            <DonateJoinOfflineSection
              donatePage={donatePage}
              bankOpen={bankOpen}
              setBankOpen={setBankOpen}
              scrollToDonateWidget={scrollToDonateWidget}
              setSelectedAmount={setSelectedAmount}
              setCustomAmount={setCustomAmount}
            />
          </Container>
        </MKBox>
      </Card>

      <MKBox pt={0} px={0} mt={0}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default Donate2;
