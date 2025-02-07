import Container from "@mui/material/Container";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

export const privacyData = (
  <MKBox component="section" my={4}>
    <Container>
      <MKTypography variant="h4" sx={{ fontWeight: "500" }} pb={4}>
        Privacy policy
      </MKTypography>
      <MKTypography
        mt={2}
        variant="body1"
        fontSize="1rem"
        fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
        sx={{
          letterSpacing: "0.05rem",
          paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
        }}
      >
        A privacy policy states how you will respect the privacy of your website users. It says what
        information you will gather, how you will use it and how you will keep it secure. A privacy
        policy is a legal document that discloses some or all of the ways a party gathers, uses,
        discloses and manages a customer’s data. The exact contents of a privacy policy will depend
        upon the applicable law and may need to address the requirements of multiple countries or
        jurisdictions. While there is no universal guidance for the content of specific privacy
        policies, a number of organization provide example forms.
      </MKTypography>
      <MKTypography
        mt={4}
        variant="body1"
        fontSize="1rem"
        fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
        sx={{
          letterSpacing: "0.05rem",
          paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
        }}
      >
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1.2rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
            fontWeight: "500",
          }}
        >
          Website Privacy
        </MKTypography>

        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          This privacy sets out how Aadar foundation ( Swarg sadan ) uses and protects any
          information that you give to Aadar foundation when you use this website.
        </MKTypography>
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          Aadar foundation is committed to ensure that your privacy is protected. We shall ask you
          to provide certain information by which you can be identified while using this website,
          then you can be assured that it will only be used in accordance with this privacy
          statement.
        </MKTypography>
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          Aadar foundation may change this policy from time to time by updating this page. You
          should check this page from time to time to ensure that you are happy with any changes.{" "}
          <b>???? This policy is effective from 01 January 2020. ???? </b>
        </MKTypography>
      </MKTypography>
      <MKTypography
        mt={4}
        variant="body1"
        fontSize="1rem"
        fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
        sx={{
          letterSpacing: "0.05rem",
          paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
        }}
      >
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          <b>What We Collect </b>
        </MKTypography>
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          We may collect the following information :
          {
            <MKBox pl={4} mt={1.5}>
              <ul>
                <li>Name and job title.</li>
                <li>Contact information.</li>
                <li>Demographic information such as postcode preferences and interests.</li>
              </ul>
            </MKBox>
          }
        </MKTypography>
      </MKTypography>
      <MKTypography
        mt={4}
        variant="body1"
        fontSize="1rem"
        fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
        sx={{
          letterSpacing: "0.05rem",
          paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
        }}
      >
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          <b>What We Do With The Information We Gather </b>
        </MKTypography>
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          We require this information to understand your needs and to join you with the service, and
          in particular for the following reasons :
        </MKTypography>
        <MKBox pl={4} mt={1.5}>
          <ul>
            <li>Internal record keeping.</li>
            <li>We may use the information to improve our services.</li>
            <li>
              We may periodically send emails about new information about our services which we
              think you may find interesting using the email address which you have provided.
            </li>
          </ul>
        </MKBox>
      </MKTypography>
      <MKTypography
        mt={4}
        variant="body1"
        fontSize="1rem"
        fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
        sx={{
          letterSpacing: "0.05rem",
          paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
        }}
      >
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          <b>Security</b>
        </MKTypography>
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          We are committed to ensure that your information is secure. In order to prevent
          unauthorised access or disclosure we have put in place suitable physical, electronic and
          managerial procedures to safeguard and secure the information we collect online.
        </MKTypography>
      </MKTypography>
      <MKTypography
        mt={4}
        variant="body1"
        fontSize="1rem"
        fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
        sx={{
          letterSpacing: "0.05rem",
          paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
        }}
      >
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          <b>How We Use Cookies</b>
        </MKTypography>
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          A cookie is a small file which asks permission to be placed on your computer’s hard drive.
          Once you agree, the file is added and the cookie helps analyze web traffic or lets you
          visit a particular site. Cookies allow web applications to respond to you as an
          individual. The web application can tailor its operations to your needs, likes and
          dislikes by gathering and remembering information about your preferences.{" "}
        </MKTypography>
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          We use traffic log cookies to identify which pages are being used. This helps us analyze
          data about webpage traffic and improve our website in order to tailor it to customer
          needs. We only use this information for statistical analysis purposes and then the data is
          removed from the system.{" "}
        </MKTypography>
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          Overall, cookies help us provide you with a better website, by enabling us to monitor
          which pages you find useful and which you do not. A cookie in no way gives us access to
          your computer or any information about you, other than the data you choose to share with
          us.
        </MKTypography>{" "}
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          You can choose to accept or decline cookies. Most web browsers automatically accept
          cookies, but you can usually modify your browser setting to decline cookies if you prefer.
          This may prevent you from taking full advantage of the website.
        </MKTypography>
      </MKTypography>
      <MKTypography
        mt={4}
        variant="body1"
        fontSize="1rem"
        fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
        sx={{
          letterSpacing: "0.05rem",
          paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
        }}
      >
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          <b>Links to Other Websites</b>
        </MKTypography>
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          Our website may contain links to other websites of interest. However, once you have uses
          these links to leave our site, you should note that we do not have any control over that
          other website. Therefore, we cannot be responsible for the protection and privacy of any
          information which you provide while visiting such sites and such sites are not governed by
          his privacy statement applicable to the website in question.
        </MKTypography>
      </MKTypography>
      <MKTypography
        mt={4}
        variant="body1"
        fontSize="1rem"
        fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
        sx={{
          letterSpacing: "0.05rem",
          paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
        }}
      >
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          <b>Controlling Your Personal Information</b>
        </MKTypography>
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          We will not sell, distribute or lease your personal information to third parties unless we
          have your permission or are required by law to do so. We may use your personal information
          to send you promotional information about third parties which we think you may find
          interesting if you tell us that you wish this to happen.{" "}
        </MKTypography>
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          You may request details of personal information which we hold about your under the Date
          Protection Act 1998. If you would like a copy of the information held on you please write
          to Aadar foundation (Swarg sadan ashram - Sarkari Malti, Behind Muktidham, Guda Gudi Ka
          Naka, Gwalior, India, 474001) at - Email: aadarfoundatio2018@gmail.com{" "}
        </MKTypography>{" "}
        <MKTypography
          mt={1.5}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          If you believe that any information we are holding on about you is incorrect or
          incomplete, please write to or email us as soon as possible, at the above address. We will
          promptly correct any information found to be incorrect.
        </MKTypography>
      </MKTypography>
    </Container>
  </MKBox>
);
