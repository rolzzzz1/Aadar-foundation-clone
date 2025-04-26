import Container from "@mui/material/Container";

// i18next imports
import { useTranslation } from "react-i18next";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

export default function privacyData() {
  const { t } = useTranslation();
  const privacyPolicyPage = t("privacyPolicyPage");

  return (
    <MKBox component="section" my={4}>
      <Container>
        <MKTypography
          variant="h4"
          sx={{ fontWeight: "500" }}
          pb={4}
          fontSize={{ xs: "1.2rem", md: "1.5rem" }}
        >
          {privacyPolicyPage.title}
        </MKTypography>
        <MKTypography
          mt={{ xs: 0, sm: 2 }}
          variant="body1"
          fontSize={{ xs: "0.8rem", md: "1rem" }}
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          {privacyPolicyPage.description}
        </MKTypography>
        <MKTypography
          mt={{ xs: 0, sm: 3 }}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "0px" },
          }}
        >
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "1rem", md: "1.2rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
              paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
              fontWeight: "500",
            }}
          >
            {privacyPolicyPage.websitePrivacySection.title}
          </MKTypography>

          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {privacyPolicyPage.websitePrivacySection.description1}
          </MKTypography>
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {privacyPolicyPage.websitePrivacySection.description2}
          </MKTypography>
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {privacyPolicyPage.websitePrivacySection.description3}
          </MKTypography>
        </MKTypography>
        <MKTypography
          mt={3}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
          }}
        >
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "1rem", md: "1.2rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
              paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
              fontWeight: "500",
            }}
          >
            {privacyPolicyPage.whatWeCollectSection.title}
          </MKTypography>
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {privacyPolicyPage.whatWeCollectSection.listDescription}
            {
              <MKBox pl={4} mt={1.5}>
                <ul>
                  <li>{privacyPolicyPage.whatWeCollectSection.listItem1}</li>
                  <li>{privacyPolicyPage.whatWeCollectSection.listItem2}</li>
                  <li>{privacyPolicyPage.whatWeCollectSection.listItem3}</li>
                </ul>
              </MKBox>
            }
          </MKTypography>
        </MKTypography>
        <MKTypography
          mt={3}
          variant="body1"
          fontSize={{ xs: "0.8rem", md: "1rem" }}
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
          }}
        >
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "1rem", md: "1.2rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
              paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
              fontWeight: "500",
            }}
          >
            {privacyPolicyPage.whyWeCollectSection.title}
          </MKTypography>
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {privacyPolicyPage.whyWeCollectSection.listDescription}
          </MKTypography>
          <MKBox pl={4} mt={1}>
            <ul>
              <li>{privacyPolicyPage.whyWeCollectSection.listItem1}</li>
              <li>{privacyPolicyPage.whyWeCollectSection.listItem2}</li>
              <li>{privacyPolicyPage.whyWeCollectSection.listItem3}</li>
            </ul>
          </MKBox>
        </MKTypography>
        <MKTypography
          mt={3}
          variant="body1"
          fontSize={{ xs: "0.8rem", md: "1rem" }}
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
          }}
        >
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "1rem", md: "1.2rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
              paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
              fontWeight: "500",
            }}
          >
            {privacyPolicyPage.securitySection.title}
          </MKTypography>
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {privacyPolicyPage.securitySection.description}
          </MKTypography>
        </MKTypography>
        <MKTypography
          mt={3}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
          }}
        >
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "1rem", md: "1.2rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
              paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
              fontWeight: "500",
            }}
          >
            {privacyPolicyPage.cookiesSection.title}
          </MKTypography>
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {privacyPolicyPage.cookiesSection.description1}
          </MKTypography>
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {privacyPolicyPage.cookiesSection.description2}
          </MKTypography>
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {privacyPolicyPage.cookiesSection.description3}
          </MKTypography>{" "}
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {privacyPolicyPage.cookiesSection.description4}
          </MKTypography>
        </MKTypography>
        <MKTypography
          mt={3}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
          }}
        >
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "1rem", md: "1.2rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
              paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
              fontWeight: "500",
            }}
          >
            {privacyPolicyPage.linkWebsiteSection.title}
          </MKTypography>
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {privacyPolicyPage.linkWebsiteSection.description}
          </MKTypography>
        </MKTypography>
        <MKTypography
          mt={3}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
          }}
        >
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "1rem", md: "1.2rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
              paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
              fontWeight: "500",
            }}
          >
            {privacyPolicyPage.controlPersonalInfoSection.title}
          </MKTypography>
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {privacyPolicyPage.controlPersonalInfoSection.description1}
          </MKTypography>
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {privacyPolicyPage.controlPersonalInfoSection.description2}
          </MKTypography>{" "}
          <MKTypography
            mt={1}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {privacyPolicyPage.controlPersonalInfoSection.description3}
          </MKTypography>
        </MKTypography>
      </Container>
    </MKBox>
  );
}
