// @mui material components
import Card from "@mui/material/Card";

// i18next imports
import { useTranslation } from "react-i18next";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Material Kit 2 React components
import MKBox from "components/MKBox";

// Routes
import getRoutes from "routes1";
import getFooterRoutes from "footer.routes1";
import { DONATE_PAGE_PATH } from "utils/donation";

import LandingPageHero from "components/LandingPageHero";

import privacyData from "./data/privacyData.js";

function PrivacyPolicy() {
  const { t } = useTranslation();
  const routes = getRoutes(t);
  const footerRoutes = getFooterRoutes(t);
  const donateBtn = t("navbar.donateBtn");
  const privacyPolicyPage = t("privacyPolicyPage");

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
        title={privacyPolicyPage.title}
        brushBackgroundPosition="top"
        titleFontSize={{ xs: "1.5rem", sm: "1.75rem", md: "1.875rem", lg: "1.875rem" }}
        titleSx={{ fontWeight: "500", mb: { xs: 2, sm: 0 } }}
      />

      {/* Contact section */}
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
        {privacyData()}
      </Card>

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default PrivacyPolicy;
