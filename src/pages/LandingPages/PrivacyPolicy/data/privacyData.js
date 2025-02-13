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
          paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
        }}
      >
        A privacy policy outlines how a website respects and protects user privacy. It specifies the
        information collected, how it is used, and the security measures in place. As a legal
        document, it details how a party gathers, uses, discloses, and manages customer data. The
        content of a privacy policy varies based on applicable laws and may need to comply with
        regulations across multiple jurisdictions. While no universal template exists, various
        organizations provide example policies to guide compliance.
      </MKTypography>
      <MKTypography
        mt={3}
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
          fontSize="1.2rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
            fontWeight: "500",
          }}
        >
          Website Privacy
        </MKTypography>

        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          This Privacy Policy outlines how Aadar Foundation (Swarg Sadan) collects, uses, and
          protects any information you provide while using this website.
        </MKTypography>
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          Aadar Foundation is committed to safeguarding your privacy. If we request information that
          identifies you while using this website, rest assured that it will only be used in
          accordance with this privacy statement.
        </MKTypography>
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          We may update this policy periodically by revising this page. Please review it regularly
          to stay informed of any changes. This policy has been effective since January 1, 2025.
        </MKTypography>
      </MKTypography>
      <MKTypography
        mt={3}
        variant="body1"
        fontSize="1rem"
        fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
        sx={{
          letterSpacing: "0.05rem",
          // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
        }}
      >
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1.2rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
            fontWeight: "500",
          }}
        >
          What We Collect
        </MKTypography>
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          We may collect the following information :
          {
            <MKBox pl={4} mt={1.5}>
              <ul>
                <li>Name and job title.</li>
                <li>Contact information.</li>
                <li>Demographic information such as postcode, preferences and interests.</li>
              </ul>
            </MKBox>
          }
        </MKTypography>
      </MKTypography>
      <MKTypography
        mt={3}
        variant="body1"
        fontSize="1rem"
        fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
        sx={{
          letterSpacing: "0.05rem",
          // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
        }}
      >
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1.2rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
            fontWeight: "500",
          }}
        >
          What We Do With The Information We Gather
        </MKTypography>
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          We require this information to understand your needs and to join you with the service, and
          in particular for the following reasons :
        </MKTypography>
        <MKBox pl={4} mt={1}>
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
        mt={3}
        variant="body1"
        fontSize="1rem"
        fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
        sx={{
          letterSpacing: "0.05rem",
          // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
        }}
      >
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1.2rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
            fontWeight: "500",
          }}
        >
          Security
        </MKTypography>
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          We are committed to ensuring the security of your information. To prevent unauthorized
          access or disclosure, we have implemented appropriate physical, electronic, and managerial
          measures to safeguard and protect the information we collect online.
        </MKTypography>
      </MKTypography>
      <MKTypography
        mt={3}
        variant="body1"
        fontSize="1rem"
        fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
        sx={{
          letterSpacing: "0.05rem",
          // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
        }}
      >
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1.2rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
            fontWeight: "500",
          }}
        >
          How We Use Cookies
        </MKTypography>
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          A cookie is a small file that requests permission to be stored on your computer’s hard
          drive. Once accepted, it helps analyze web traffic or enhances your browsing experience.
          Cookies enable websites to respond to you as an individual by remembering your preferences
          and tailoring content accordingly.
        </MKTypography>
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          We use traffic log cookies to identify which pages are visited, helping us analyze website
          traffic and improve our services to better meet user needs. This information is used
          solely for statistical analysis and is then removed from our system.
        </MKTypography>
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          Overall, cookies enhance your browsing experience by allowing us to monitor which pages
          are useful. They do not grant us access to your computer or any personal information
          beyond what you choose to share.
        </MKTypography>{" "}
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          You can accept or decline cookies. Most browsers accept cookies by default, but you can
          modify your settings to decline them. However, doing so may limit your ability to fully
          utilize the website.
        </MKTypography>
      </MKTypography>
      <MKTypography
        mt={3}
        variant="body1"
        fontSize="1rem"
        fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
        sx={{
          letterSpacing: "0.05rem",
          // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
        }}
      >
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1.2rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
            fontWeight: "500",
          }}
        >
          Links to Other Websites
        </MKTypography>
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          Our website may contain links to other websites of interest. However, once you leave our
          site using these links, please note that we have no control over those external websites.
          Therefore, we cannot be responsible for the protection and privacy of any information you
          provide while visiting them. These sites are not governed by this privacy policy, and we
          encourage you to review their respective privacy statements.
        </MKTypography>
      </MKTypography>
      <MKTypography
        mt={3}
        variant="body1"
        fontSize="1rem"
        fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
        sx={{
          letterSpacing: "0.05rem",
          // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
        }}
      >
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1.2rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
            fontWeight: "500",
          }}
        >
          <b>Controlling Your Personal Information</b>
        </MKTypography>
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          We do not sell, distribute, or share your personal information with third parties unless
          we have your permission or are required by law. However, if you have opted in, we may use
          your information to send you promotional content about third parties that we believe may
          be of interest to you.
        </MKTypography>
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          You have the right to request details of the personal information we hold about you under
          the Data Protection Act 1998. To request a copy, please write to: Aadar Foundation (Swarg
          Sadan Ashram) Sarkari Malti, Behind Muktidham, Guda Gudi Ka Naka, Gwalior, India, 474001
          Email: aadarfoundatio2018@gmail.com
        </MKTypography>{" "}
        <MKTypography
          mt={1}
          variant="body1"
          fontSize="1rem"
          fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
          sx={{
            letterSpacing: "0.05rem",
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          If you believe any information we hold about you is incorrect or incomplete, please
          contact us at the above address. We will promptly update any inaccuracies.
        </MKTypography>
      </MKTypography>
    </Container>
  </MKBox>
);
