import Container from "@mui/material/Container";

import { useTranslation } from "react-i18next";

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
            // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
          }}
        >
          {termsConditionsPage.descriptionStart}
          {/* Use of this site is provided by Aadar foundation subject to the following Terms and
          Conditions: */}
        </MKTypography>
        <MKBox ml={2}>
          <MKTypography
            mt={2}
            variant="body1"
            fontSize={{ xs: "0.8rem", md: "1rem" }}
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            sx={{
              letterSpacing: "0.05rem",
              // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
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
                    // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                  }}
                >
                  {termsConditionsPage.listItem1}
                  {/* Your use constitutes acceptance of these terms and conditions as at the date of
                  your first use of the site. */}
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
                    // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                  }}
                >
                  {termsConditionsPage.listItem2}
                  {/* Aadar foundation reserves the rights to change these terms and conditions at any
                  time by posting changes online. Your continued use of this site after changes are
                  posted constitutes your acceptance of this agreement as modified. */}
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
                    // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                  }}
                >
                  {termsConditionsPage.listItem3}
                  {/* You agree to use this site only for lawful purposes, and in a manner which does
                  not infringe the rights, or restrict, or inhibit the use and enjoyment of the site
                  by any third party. */}
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
                    // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                  }}
                >
                  {termsConditionsPage.listItem4}
                  {/* This site and the information, names, images, pictures, logos regarding or
                  relating to Aadar foundation are provided “as is” without any representation or
                  endorsement made and without warranty of any kind whether express or implied. In
                  no event will Aadar foundation be liable for any damages including, without
                  limitation, indirect or consequential damages, or any damages whatsoever arising
                  from the use or in connection with such use or loss of use of the site, whether in
                  contract or in negligence. */}
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
                    // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                  }}
                >
                  {termsConditionsPage.listItem5}
                  {/* Aadar foundation does not warrant that the functions contained in the material
                  contained in this site will be uninterrupted or error free, that defects will be
                  corrected, or that this site or the server that makes it available are free of
                  viruses or bugs or represents the full functionality, accuracy and reliability of
                  the materials. */}
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
                    // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                  }}
                >
                  {termsConditionsPage.listItem6}
                  {/* Copyright restrictions: <br />
                  Commercial use or publication of all or any item displayed is strictly prohibited
                  with out prior authorization from Aadar foundation. Nothing contained herein shall
                  be construed as conferring any license by Aadar foundation to use any item
                  displayed. <br />
                  Documents may be copied for personal use only on the condition that copyright and
                  source indications are also copied, no modifications are made and the document is
                  copied entirely. However, some documents and photos have been published on this
                  site with the permission of the relevant copyright owners (who are not Aadar
                  foundation). All rights are reserved on these documents and permission to copy
                  them must be requested from the copyright owners (the sources are indicated within
                  these documents/photographs). */}
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
                    // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                  }}
                >
                  {termsConditionsPage.listItem7}
                  {/* Aadar foundation takes no responsibility for the content of external Internet
                  sites. Other websites that we link to are owned and operated by third parties and
                  Aadar foundation has no control over them. The fact that we include links to other
                  websites does not mean thatAadar foundation approves of or endorses any other
                  third party website or the content of that website. We accept no liability for any
                  statements, information, products or services that are published on or are
                  accessible through any websites owned or operated by third parties. */}
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
                    // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                  }}
                >
                  {termsConditionsPage.listItem8}
                  {/* Any communication or material that you transmit to, or post on, any public area of
                  the site including any data, questions, comments, suggestions, or the like, is,
                  and will be treated as, non-confidential and non-proprietary information. */}
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
                    // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                  }}
                >
                  {termsConditionsPage.listItem9}
                  {/* If there is any conflict between these terms and conditions and rules and/or
                  specific terms of use appearing on this site relating to specific material then
                  the latter shall prevail. */}
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
                    // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                  }}
                >
                  {termsConditionsPage.listItem10}
                  {/* These terms and conditions shall be governed and construed in accordance with the
                  laws of India. Any disputes shall be subject to the exclusive jurisdiction of the
                  Courts of Madhya Pradesh. */}
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
                    // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                  }}
                >
                  {termsConditionsPage.listItem11}
                  {/* If these terms and conditions are not accepted in full, the use of this site must
                  be terminated immediately. */}
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
              // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
            }}
          >
            {termsConditionsPage.descriptionEnd}
            {/* Aadar foundation is a registered NGO by the name Aadar foundation in Gwalior, Madhya
            Pradesh – 474001, India,
            <br /> Tel : +91 9039129571, Website : https://aadar.foundation/, Email:
            aadarfoundatio2018@gmail.com */}
          </MKTypography>
        </MKBox>
      </Container>
    </MKBox>
  );
}

// export const termsData = (
//   <MKBox component="section" my={4} mx={2}>
//     <Container>
//       <MKTypography
//         variant="h4"
//         sx={{ fontWeight: "500" }}
//         pb={4}
//         fontSize={{ xs: "1.2rem", md: "1.5rem" }}
//       >
//         Terms & Conditions
//       </MKTypography>
//       <MKTypography
//         mt={2}
//         variant="body1"
//         fontSize={{ xs: "0.8rem", md: "1rem" }}
//         fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//         sx={{
//           letterSpacing: "0.05rem",
//           // paddingTop: { xs: "20px", sm: "20px", md: "20px", lg: "20px" },
//         }}
//       >
//         Use of this site is provided by Aadar foundation subject to the following Terms and
//         Conditions:
//       </MKTypography>
//       <MKBox ml={2}>
//         <MKTypography
//           mt={2}
//           variant="body1"
//           fontSize={{ xs: "0.8rem", md: "1rem" }}
//           fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//           sx={{
//             letterSpacing: "0.05rem",
//             // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
//           }}
//         >
//           <ol>
//             <li>
//               <MKTypography
//                 mt={1}
//                 variant="body1"
//                 fontSize={{ xs: "0.8rem", md: "1rem" }}
//                 fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//                 sx={{
//                   letterSpacing: "0.05rem",
//                   // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
//                 }}
//               >
//                 Your use constitutes acceptance of these terms and conditions as at the date of your
//                 first use of the site.
//               </MKTypography>
//             </li>
//             <li>
//               <MKTypography
//                 mt={1}
//                 variant="body1"
//                 fontSize={{ xs: "0.8rem", md: "1rem" }}
//                 fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//                 sx={{
//                   letterSpacing: "0.05rem",
//                   // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
//                 }}
//               >
//                 Aadar foundation reserves the rights to change these terms and conditions at any
//                 time by posting changes online. Your continued use of this site after changes are
//                 posted constitutes your acceptance of this agreement as modified.
//               </MKTypography>
//             </li>
//             <li>
//               <MKTypography
//                 mt={1}
//                 variant="body1"
//                 fontSize={{ xs: "0.8rem", md: "1rem" }}
//                 fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//                 sx={{
//                   letterSpacing: "0.05rem",
//                   // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
//                 }}
//               >
//                 You agree to use this site only for lawful purposes, and in a manner which does not
//                 infringe the rights, or restrict, or inhibit the use and enjoyment of the site by
//                 any third party.
//               </MKTypography>
//             </li>
//             <li>
//               <MKTypography
//                 mt={1}
//                 variant="body1"
//                 fontSize={{ xs: "0.8rem", md: "1rem" }}
//                 fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//                 sx={{
//                   letterSpacing: "0.05rem",
//                   // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
//                 }}
//               >
//                 This site and the information, names, images, pictures, logos regarding or relating
//                 to Aadar foundation are provided “as is” without any representation or endorsement
//                 made and without warranty of any kind whether express or implied. In no event will
//                 Aadar foundation be liable for any damages including, without limitation, indirect
//                 or consequential damages, or any damages whatsoever arising from the use or in
//                 connection with such use or loss of use of the site, whether in contract or in
//                 negligence.
//               </MKTypography>
//             </li>
//             <li>
//               <MKTypography
//                 mt={1}
//                 variant="body1"
//                 fontSize={{ xs: "0.8rem", md: "1rem" }}
//                 fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//                 sx={{
//                   letterSpacing: "0.05rem",
//                   // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
//                 }}
//               >
//                 Aadar foundation does not warrant that the functions contained in the material
//                 contained in this site will be uninterrupted or error free, that defects will be
//                 corrected, or that this site or the server that makes it available are free of
//                 viruses or bugs or represents the full functionality, accuracy and reliability of
//                 the materials.
//               </MKTypography>
//             </li>
//             <li>
//               <MKTypography
//                 mt={1}
//                 variant="body1"
//                 fontSize={{ xs: "0.8rem", md: "1rem" }}
//                 fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//                 sx={{
//                   letterSpacing: "0.05rem",
//                   // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
//                 }}
//               >
//                 Copyright restrictions: <br />
//                 Commercial use or publication of all or any item displayed is strictly prohibited
//                 with out prior authorization from Aadar foundation. Nothing contained herein shall
//                 be construed as conferring any license by Aadar foundation to use any item
//                 displayed. <br />
//                 Documents may be copied for personal use only on the condition that copyright and
//                 source indications are also copied, no modifications are made and the document is
//                 copied entirely. However, some documents and photos have been published on this site
//                 with the permission of the relevant copyright owners (who are not Aadar foundation).
//                 All rights are reserved on these documents and permission to copy them must be
//                 requested from the copyright owners (the sources are indicated within these
//                 documents/photographs).
//               </MKTypography>
//             </li>
//             <li>
//               <MKTypography
//                 mt={1}
//                 variant="body1"
//                 fontSize={{ xs: "0.8rem", md: "1rem" }}
//                 fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//                 sx={{
//                   letterSpacing: "0.05rem",
//                   // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
//                 }}
//               >
//                 Aadar foundation takes no responsibility for the content of external Internet sites.
//                 Other websites that we link to are owned and operated by third parties and Aadar
//                 foundation has no control over them. The fact that we include links to other
//                 websites does not mean thatAadar foundation approves of or endorses any other third
//                 party website or the content of that website. We accept no liability for any
//                 statements, information, products or services that are published on or are
//                 accessible through any websites owned or operated by third parties.
//               </MKTypography>
//             </li>
//             <li>
//               <MKTypography
//                 mt={1}
//                 variant="body1"
//                 fontSize={{ xs: "0.8rem", md: "1rem" }}
//                 fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//                 sx={{
//                   letterSpacing: "0.05rem",
//                   // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
//                 }}
//               >
//                 Any communication or material that you transmit to, or post on, any public area of
//                 the site including any data, questions, comments, suggestions, or the like, is, and
//                 will be treated as, non-confidential and non-proprietary information.
//               </MKTypography>
//             </li>
//             <li>
//               <MKTypography
//                 mt={1}
//                 variant="body1"
//                 fontSize={{ xs: "0.8rem", md: "1rem" }}
//                 fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//                 sx={{
//                   letterSpacing: "0.05rem",
//                   // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
//                 }}
//               >
//                 If there is any conflict between these terms and conditions and rules and/or
//                 specific terms of use appearing on this site relating to specific material then the
//                 latter shall prevail.
//               </MKTypography>
//             </li>
//             <li>
//               <MKTypography
//                 mt={1}
//                 variant="body1"
//                 fontSize={{ xs: "0.8rem", md: "1rem" }}
//                 fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//                 sx={{
//                   letterSpacing: "0.05rem",
//                   // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
//                 }}
//               >
//                 These terms and conditions shall be governed and construed in accordance with the
//                 laws of India. Any disputes shall be subject to the exclusive jurisdiction of the
//                 Courts of Madhya Pradesh.
//               </MKTypography>
//             </li>
//             <li>
//               <MKTypography
//                 mt={1}
//                 variant="body1"
//                 fontSize={{ xs: "0.8rem", md: "1rem" }}
//                 fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//                 sx={{
//                   letterSpacing: "0.05rem",
//                   // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
//                 }}
//               >
//                 If these terms and conditions are not accepted in full, the use of this site must be
//                 terminated immediately.
//               </MKTypography>
//             </li>
//           </ol>
//         </MKTypography>
//         <MKTypography
//           mt={2}
//           variant="body1"
//           fontSize={{ xs: "0.8rem", md: "1rem" }}
//           fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//           sx={{
//             letterSpacing: "0.05rem",
//             // paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
//           }}
//         >
//           Aadar foundation is a registered NGO by the name Aadar foundation in Gwalior, Madhya
//           Pradesh – 474001, India,
//           <br /> Tel : +91 9039129571, Website : https://aadar.foundation/, Email:
//           aadarfoundatio2018@gmail.com
//         </MKTypography>
//       </MKBox>
//     </Container>
//   </MKBox>
// );
