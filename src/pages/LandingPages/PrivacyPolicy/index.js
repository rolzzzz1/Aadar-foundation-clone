// @mui material components
// import Container from "@mui/material/Container";
import Card from "@mui/material/Card";

import { useTranslation } from "react-i18next";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Routes
import getRoutes from "routes1";
import getFooterRoutes from "footer.routes1";

// import routes from "routes";
// import footerRoutes from "footer.routes";

// Images
import bgImage2 from "assets/images/mainThemeImages/swargSadanBlack.png";
import bgImage from "assets/images/mainThemeImages/smallBrushstroke2.svg";

// import { privacyData } from "./data/privacyData.js";
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
            backgroundPosition: "top",
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
            mb={{ xs: 2, sm: 0 }}
          >
            {privacyPolicyPage.title}
          </MKTypography>
        </MKBox>
      </MKBox>

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
        {/* {privacyData} */}
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

// Privacy Policy
// A privacy policy states how you will respect the privacy of your website users. It says what information you will gather, how you will use it and how you will keep it secure. A privacy police is a legal document that discloses some or all of the ways a party gathers, uses, discloses and manages a customer’s data. The exact contents of a privacy policy will depend upon the applicable law and may need to address the requirements of multiple countries or jurisdictions. While there is no universal guidance for the content of specific privacy policies, a number of organization provide example forms.

// Website Privacy
// This privacy sets out how MaaMadhuriBrijVarisSewaSadan Apna Ghar uses and protects any information that you give to MMBVSSAG when you use this website.

// MMBVSSAG  is committed to ensure that your privacy is protected. We shall ask you to provide certain information by which you can be identified while using this website, then you can be assured that it will only be used in accordance with this privacy statement.

// MMBVSSAG may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes. This policy is effective from 01 January 2020.

// What We Collect
// We may collect the following information :

// Name and job title.
// Contact information including email address.
// Demographic information such as postcode preferences and interests.
// What We Do With The Information We Gather
// We require this information to understand your needs and to join you with the service, and in particular for the following reasons :

// Internal record keeping.
// We may use the information to improve our services.
// We may periodically send emails about new information about our services which we think you may find interesting using the email address which you have provided.
// Security
// We are committed to ensure that your information is secure. In order to prevent unauthorised access or disclosure we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.

// How We Use Cookies
// A cookie is a small file which asks permission to be placed on your computer’s hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.

// We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.

// Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.

// You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.

// Links to Other Websites
// Our website may contain links to other websites of interest. However, once you have uses these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide while visiting such sites and such sites are not governed by his privacy statement applicable to the website in question.

// Controlling Your Personal Information
// We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.

// You may request details of personal information which we hold about your under the Date Protection Act 1998. If you would like a copy of the information held on you please write to MaaMadhuriBrijVarisSevasadan Apna Ghar, Achhnera Road Vill. Bajhera. Bharatpur(Rajasthan)321001. Email. hq@apnagharashram.org

// If you believe that any information we are holding on about you is incorrect or incomplete, please write to or email us as soon as possible, at the above address. We will promptly correct any information found to be incorrect.
