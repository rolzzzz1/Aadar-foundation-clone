import Container from "@mui/material/Container";

// i18next imports
import { useTranslation } from "react-i18next";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

export default function termsData() {
  const { t } = useTranslation();
  const termsConditionsPage = t("termsConditionsPage");

  return (
    <MKBox component="section" my={4} mx={2}>
      <Container>
        <MKTypography
          variant="h4"
          sx={{ fontWeight: "500" }}
          pb={4}
          fontSize={{ xs: "1.2rem", md: "1.5rem" }}
        >
          {termsConditionsPage.title}
        </MKTypography>
        <MKTypography
          mt={2}
          variant="body1"
          fontSize={{ xs: "0.8rem", md: "1rem" }}
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
          }}
        >
          {termsConditionsPage.descriptionStart}
        </MKTypography>
        <MKBox ml={2}>
          <MKTypography
            mt={2}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            <ol>
              <li>
                <MKTypography
                  mt={1}
                  variant="body1"
                  fontSize={{ xs: "0.8rem", md: "1rem" }}
                  fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                  sx={{
                    letterSpacing: "0.05rem",
                  }}
                >
                  {termsConditionsPage.listItem1}
                </MKTypography>
              </li>
              <li>
                <MKTypography
                  mt={1}
                  variant="body1"
                  fontSize={{ xs: "0.8rem", md: "1rem" }}
                  fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                  sx={{
                    letterSpacing: "0.05rem",
                  }}
                >
                  {termsConditionsPage.listItem2}
                </MKTypography>
              </li>
              <li>
                <MKTypography
                  mt={1}
                  variant="body1"
                  fontSize={{ xs: "0.8rem", md: "1rem" }}
                  fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                  sx={{
                    letterSpacing: "0.05rem",
                  }}
                >
                  {termsConditionsPage.listItem3}
                </MKTypography>
              </li>
              <li>
                <MKTypography
                  mt={1}
                  variant="body1"
                  fontSize={{ xs: "0.8rem", md: "1rem" }}
                  fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                  sx={{
                    letterSpacing: "0.05rem",
                  }}
                >
                  {termsConditionsPage.listItem4}
                </MKTypography>
              </li>
              <li>
                <MKTypography
                  mt={1}
                  variant="body1"
                  fontSize={{ xs: "0.8rem", md: "1rem" }}
                  fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                  sx={{
                    letterSpacing: "0.05rem",
                  }}
                >
                  {termsConditionsPage.listItem5}
                </MKTypography>
              </li>
              <li>
                <MKTypography
                  mt={1}
                  variant="body1"
                  fontSize={{ xs: "0.8rem", md: "1rem" }}
                  fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                  sx={{
                    letterSpacing: "0.05rem",
                  }}
                >
                  {termsConditionsPage.listItem6}
                </MKTypography>
              </li>
              <li>
                <MKTypography
                  mt={1}
                  variant="body1"
                  fontSize={{ xs: "0.8rem", md: "1rem" }}
                  fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                  sx={{
                    letterSpacing: "0.05rem",
                  }}
                >
                  {termsConditionsPage.listItem7}
                </MKTypography>
              </li>
              <li>
                <MKTypography
                  mt={1}
                  variant="body1"
                  fontSize={{ xs: "0.8rem", md: "1rem" }}
                  fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                  sx={{
                    letterSpacing: "0.05rem",
                  }}
                >
                  {termsConditionsPage.listItem8}
                </MKTypography>
              </li>
              <li>
                <MKTypography
                  mt={1}
                  variant="body1"
                  fontSize={{ xs: "0.8rem", md: "1rem" }}
                  fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                  sx={{
                    letterSpacing: "0.05rem",
                  }}
                >
                  {termsConditionsPage.listItem9}
                </MKTypography>
              </li>
              <li>
                <MKTypography
                  mt={1}
                  variant="body1"
                  fontSize={{ xs: "0.8rem", md: "1rem" }}
                  fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                  sx={{
                    letterSpacing: "0.05rem",
                  }}
                >
                  {termsConditionsPage.listItem10}
                </MKTypography>
              </li>
              <li>
                <MKTypography
                  mt={1}
                  variant="body1"
                  fontSize={{ xs: "0.8rem", md: "1rem" }}
                  fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                  sx={{
                    letterSpacing: "0.05rem",
                  }}
                >
                  {termsConditionsPage.listItem11}
                </MKTypography>
              </li>
            </ol>
          </MKTypography>
          <MKTypography
            mt={2}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
            }}
          >
            {termsConditionsPage.descriptionEnd}
          </MKTypography>
        </MKBox>
      </Container>
    </MKBox>
  );
}
