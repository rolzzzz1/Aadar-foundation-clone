import Card from "@mui/material/Card";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Images
import bgImage2 from "assets/images/swargSadanBlack.png";
import bgImage from "assets/images/smallBrushstroke2.svg";

import { termsData } from "./data/termsData.js";

function TermsConditions() {
  return (
    <MKBox minWidth="320px">
      {/* Navbar component */}
      <DefaultNavbar
        routes={routes}
        action={{
          type: "external",
          route: "https://www.creative-tim.com/product/material-kit-react",
          label: "Donate Now",
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
            Terms and conditions
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
        {termsData}
        {/* <MKBox component="section" my={4}>
          <Container>
            Terms & Conditions Use of this site is provided by Apna Ghar Ashram subject to the
            following Terms and Conditions: Your use constitutes acceptance of these terms and
            conditions as at the date of your first use of the site. Apna Ghar Ashram reserves the
            rights to change these terms and conditions at any time by posting changes online. Your
            continued use of this site after changes are posted constitutes your acceptance of this
            agreement as modified. You agree to use this site only for lawful purposes, and in a
            manner which does not infringe the rights, or restrict, or inhibit the use and enjoyment
            of the site by any third party. This site and the information, names, images, pictures,
            logos regarding or relating to Apna Ghar Ashram are provided “as is” without any
            representation or endorsement made and without warranty of any kind whether express or
            implied. In no event will Apna Ghar Ashram be liable for any damages including, without
            limitation, indirect or consequential damages, or any damages whatsoever arising from
            the use or in connection with such use or loss of use of the site, whether in contract
            or in negligence. Apna Ghar Ashram does not warrant that the functions contained in the
            material contained in this site will be uninterrupted or error free, that defects will
            be corrected, or that this site or the server that makes it available are free of
            viruses or bugs or represents the full functionality, accuracy and reliability of the
            materials. Copyright restrictions: Commercial use or publication of all or any item
            displayed is strictly prohibited with out prior authorization from Apna Ghar Ashram.
            Nothing contained herein shall be construed as conferring any license by Apna Ghar
            Ashram to use any item displayed. Documents may be copied for personal use only on the
            condition that copyright and source indications are also copied, no modifications are
            made and the document is copied entirely. However, some documents and photos have been
            published on this site with the permission of the relevant copyright owners (who are not
            Apna Ghar Ashram). All rights are reserved on these documents and permission to copy
            them must be requested from the copyright owners (the sources are indicated within these
            documents/photographs). Apna Ghar Ashram takes no responsibility for the content of
            external Internet sites. Other websites that we link to are owned and operated by third
            parties and Apna Ghar Ashram has no control over them. The fact that we include links to
            other websites does not mean that Apna Ghar Ashram approves of or endorses any other
            third party website or the content of that website. We accept no liability for any
            statements, information, products or services that are published on or are accessible
            through any websites owned or operated by third parties. Any communication or material
            that you transmit to, or post on, any public area of the site including any data,
            questions, comments, suggestions, or the like, is, and will be treated as,
            non-confidential and non-proprietary information. If there is any conflict between these
            terms and conditions and rules and/or specific terms of use appearing on this site
            relating to specific material then the latter shall prevail. These terms and conditions
            shall be governed and construed in accordance with the laws of India. Any disputes shall
            be subject to the exclusive jurisdiction of the Courts of Rajasthan. If these terms and
            conditions are not accepted in full, the use of this site must be terminated
            immediately. Apna Ghar Ashram is a registered NGO by the name MAA MADHURI BRIJ VARIS
            SEWA SADAN APNA GHAR SANSTHA in Bharatpur, Rajasthan – 321001, India, Tel : +91
            8599999911/22, Website : www.apnagharashram.org,Email:bharatpur@apnagharashram.org ,
            hq@apnagharashram.org .
          </Container>
        </MKBox> */}
      </Card>

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default TermsConditions;

// Terms & Conditions
// Use of this site is provided by Apna Ghar Ashram subject to the following Terms and Conditions:

// Your use constitutes acceptance of these terms and conditions as at the date of your first use of the site.
// Apna Ghar Ashram reserves the rights to change these terms and conditions at any time by posting changes online. Your continued use of this site after changes are posted constitutes your acceptance of this agreement as modified.
// You agree to use this site only for lawful purposes, and in a manner which does not infringe the rights, or restrict, or inhibit the use and enjoyment of the site by any third party.
// This site and the information, names, images, pictures, logos regarding or relating to Apna Ghar Ashram are provided “as is” without any representation or endorsement made and without warranty of any kind whether express or implied. In no event will Apna Ghar Ashram be liable for any damages including, without limitation, indirect or consequential damages, or any damages whatsoever arising from the use or in connection with such use or loss of use of the site, whether in contract or in negligence.
// Apna Ghar Ashram does not warrant that the functions contained in the material contained in this site will be uninterrupted or error free, that defects will be corrected, or that this site or the server that makes it available are free of viruses or bugs or represents the full functionality, accuracy and reliability of the materials.
// Copyright restrictions:
// Commercial use or publication of all or any item displayed is strictly prohibited with out prior authorization from Apna Ghar Ashram. Nothing contained herein shall be construed as conferring any license by Apna Ghar Ashram to use any item displayed.
// Documents may be copied for personal use only on the condition that copyright and source indications are also copied, no modifications are made and the document is copied entirely. However, some documents and photos have been published on this site with the permission of the relevant copyright owners (who are not Apna Ghar Ashram). All rights are reserved on these documents and permission to copy them must be requested from the copyright owners (the sources are indicated within these documents/photographs).
// Apna Ghar Ashram takes no responsibility for the content of external Internet sites. Other websites that we link to are owned and operated by third parties and Apna Ghar Ashram has no control over them. The fact that we include links to other websites does not mean that Apna Ghar Ashram approves of or endorses any other third party website or the content of that website. We accept no liability for any statements, information, products or services that are published on or are accessible through any websites owned or operated by third parties.
// Any communication or material that you transmit to, or post on, any public area of the site including any data, questions, comments, suggestions, or the like, is, and will be treated as, non-confidential and non-proprietary information.
// If there is any conflict between these terms and conditions and rules and/or specific terms of use appearing on this site relating to specific material then the latter shall prevail.
// These terms and conditions shall be governed and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the Courts of Rajasthan.
// If these terms and conditions are not accepted in full, the use of this site must be terminated immediately.
// Apna Ghar Ashram is a registered NGO by the name MAA MADHURI BRIJ VARIS SEWA SADAN APNA GHAR SANSTHA in Bharatpur, Rajasthan – 321001, India, Tel : +91 8599999911/22, Website : www.apnagharashram.org,Email:bharatpur@apnagharashram.org , hq@apnagharashram.org .
