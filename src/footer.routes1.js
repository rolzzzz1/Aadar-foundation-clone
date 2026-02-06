// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
// import TwitterIcon from "@mui/icons-material/Twitter";
// import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

// Material Kit 2 React components
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";

// Images
import logoCT from "assets/images/logos/logo-aadar.jpg";
// import logoME from "assets/images/MyLogo1.png";
import aishxDevLogo from "assets/images/logos/aishx-dev-logo.png";

const getFooterRoutes = (t) => {
  const currentYear = new Date().getFullYear();
  // Replace any 4-digit year (e.g., 2025) with the current year
  const copyrightText = t("footer.copyright").replace(/\d{4}/, currentYear);

  return [
    {
      brand: {
        name: t("footer.title"),
        image: logoCT,
        // route: "/",
        href: "/",
      },

      socials: [
        {
          icon: <YouTubeIcon />,
          link: "https://www.youtube.com/@AadarFoundation/",
        },
        {
          icon: <InstagramIcon />,
          link: "https://www.instagram.com/ashramswargsadangwalior/",
        },
        {
          icon: <FacebookIcon />,
          link: "https://www.facebook.com/AshramSwargSadanGwalior/",
        },
      ],

      menus: [
        {
          name: t("footer.menus.name"),
          items: [
            { name: t("footer.menus.items.home"), href: "/" },
            { name: t("footer.menus.items.about us"), route: "/pages/landing-pages/about-us" },
            { name: t("footer.menus.items.our work"), route: "/pages/landing-pages/work" },
            { name: t("footer.menus.items.volunteer"), route: "/pages/landing-pages/volunteer" },
            { name: t("footer.menus.items.gallery"), route: "/pages/landing-pages/gallery" },
          ],
        },

        {
          name: t("footer.menus.name1"),
          items: [
            {
              name: t("footer.menus.items1.privacy policy"),
              route: "/pages/landing-pages/privacy-policy",
            },
            {
              name: t("footer.menus.items1.terms and conditions"),
              route: "/pages/landing-pages/terms-conditions",
            },
            { name: t("footer.menus.items1.contact"), route: "/pages/landing-pages/contact" },
          ],
        },
      ],

      copyright: (
        <MKBox display="flex" justifyContent="center" mx={"auto"} pt={0} alignItems="center">
          <MKTypography
            variant="button"
            fontWeight="regular"
            fontSize="0.9rem"
            color="white"
            // width="55%"
            // sx={{ borderTop: "0.75px #A8A8A8 solid" }}
            py={2}
            px={2}
          >
            {copyrightText}
            {/* Copyright &copy; {date} Aadar foundation - All rights reserved. */}
            <MKBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              m={{ xs: 0.5, sm: 1 }}
              sx={{
                flexWrap: "wrap",
                rowGap: { xs: 0.5, sm: 1 },
                columnGap: { xs: 1, sm: 1.5 },
                textAlign: "center",
              }}
            >
              <MKTypography
                variant="button"
                fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
                fontWeight="regular"
                fontSize={{ xs: "0.85rem", sm: "0.95rem", md: "1.05rem" }}
                color="white"
              >
                {t("footer.designed by")}
              </MKTypography>
              <MKBox
                component="a"
                href="https://linktr.ee/aishx.dev"
                target="_blank"
                rel="noreferrer"
                aria-label="Visit Aishx.dev (opens in a new tab)"
                title="Aishx.dev"
                data-footer-button="aishx"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "8px",
                  width: { xs: "96px", sm: "116px", md: "128px" },
                  height: { xs: "36px", sm: "42px", md: "46px" },
                  backgroundImage: `url(${aishxDevLogo})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: 0,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                  lineHeight: 0,
                  verticalAlign: "middle",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition:
                    "transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease, border-color 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px) scale(1.04)",
                    boxShadow:
                      "0 6px 20px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15)",
                    filter: "brightness(1.12)",
                    borderColor: "rgba(255, 255, 255, 0.35)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:active": {
                    transform: "translateY(0) scale(0.98)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
                  },
                  "&:focus-visible": {
                    outline: "2px solid rgba(255, 255, 255, 0.8)",
                    outlineOffset: "3px",
                    boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.25)",
                  },
                }}
              />
            </MKBox>
          </MKTypography>
        </MKBox>
      ),
    },
  ];
};

// const getFooterRoutes = (t) => [
//   {
//     brand: {
//       name: t("footer.title"),
//       image: logoCT,
//       // route: "/",
//       href: "/",
//     },

//     socials: [
//       {
//         icon: <YouTubeIcon />,
//         link: "https://www.youtube.com/@AadarFoundation/",
//       },
//       {
//         icon: <InstagramIcon />,
//         link: "https://www.instagram.com/ashramswargsadangwalior/",
//       },
//       {
//         icon: <FacebookIcon />,
//         link: "https://www.facebook.com/AshramSwargSadanGwalior/",
//       },
//     ],

//     menus: [
//       {
//         name: t("footer.menus.name"),
//         items: [
//           { name: t("footer.menus.items.home"), href: "/" },
//           { name: t("footer.menus.items.about us"), route: "/pages/landing-pages/about-us" },
//           { name: t("footer.menus.items.our work"), route: "/pages/landing-pages/work" },
//           { name: t("footer.menus.items.volunteer"), route: "/pages/landing-pages/volunteer" },
//           { name: t("footer.menus.items.gallery"), route: "/pages/landing-pages/gallery" },
//         ],
//       },

//       {
//         name: t("footer.menus.name1"),
//         items: [
//           {
//             name: t("footer.menus.items1.privacy policy"),
//             route: "/pages/landing-pages/privacy-policy",
//           },
//           {
//             name: t("footer.menus.items1.terms and conditions"),
//             route: "/pages/landing-pages/terms-conditions",
//           },
//           { name: t("footer.menus.items1.contact"), route: "/pages/landing-pages/contact" },
//         ],
//       },
//     ],

//     copyright: (
//       <MKBox display="flex" justifyContent="center" mx={"auto"} pt={0} alignItems="center">
//         <MKTypography
//           variant="button"
//           fontWeight="regular"
//           fontSize="0.9rem"
//           color="white"
//           // width="55%"
//           // sx={{ borderTop: "0.75px #A8A8A8 solid" }}
//           py={2}
//           px={2}
//         >
//           {t("footer.copyright")}
//           {/* Copyright &copy; {date} Aadar foundation - All rights reserved. */}
//           <MKBox display="flex" justifyContent="center" alignItems="center" m={1}>
//             <MKTypography
//               variant="button"
//               fontWeight="regular"
//               fontSize="0.9rem"
//               color="white"
//               pr={2}
//             >
//               {t("footer.designed by")}
//               <MKTypography
//                 component="a"
//                 href={"https://linktr.ee/Rolzzzz"}
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 <MKButton
//                   variant="text"
//                   size="small"
//                   sx={{
//                     backgroundColor: "#575757",
//                     backdropFilter: `saturate(200%) blur(30px)`,

//                     color: "#ffffff",
//                     textTransform: "capitalize",
//                     border: "2px solid transparent",
//                     "&: hover": {
//                       border: "2px solid #FFFFFF",
//                     },
//                     marginLeft: "5px",
//                     padding: "5px 5px",
//                   }}
//                 >
//                   <MKTypography fontWeight="regular" fontSize="0.9rem" color="white">
//                     {t("footer.developerName")}
//                   </MKTypography>
//                   &nbsp;
//                   <MKBox
//                     component="img"
//                     src={logoME}
//                     borderRadius="3px"
//                     width="27px"
//                     height="22px"
//                     ml={1}
//                   ></MKBox>
//                 </MKButton>
//               </MKTypography>
//             </MKTypography>
//           </MKBox>
//         </MKTypography>
//       </MKBox>
//     ),
//   },
// ];

// export default {
//   brand: {
//     name: "Aadar foundation",
//     image: logoCT,
//     // route: "/",
//     href: "/",
//   },
//   socials: [
//     {
//       icon: <YouTubeIcon />,
//       link: "https://www.youtube.com/@AadarFoundation/",
//     },
//     {
//       icon: <InstagramIcon />,
//       link: "https://www.instagram.com/ashramswargsadangwalior/",
//     },
//     {
//       icon: <FacebookIcon />,
//       link: "https://www.facebook.com/AshramSwargSadanGwalior/",
//     },
//   ],
//   menus: [
//     {
//       name: "Navigation",
//       items: [
//         { name: "home", href: "/" },
//         { name: "about us", route: "/pages/landing-pages/about-us" },
//         { name: "our work", route: "/pages/landing-pages/work" },
//         { name: "volunteer", route: "/pages/landing-pages/volunteer" },
//         { name: "gallery", route: "/pages/landing-pages/gallery" },
//       ],
//     },

//     {
//       name: "Useful links",
//       items: [
//         {
//           name: "privacy policy",
//           route: "/pages/landing-pages/privacy-policy",
//         },
//         { name: "terms and conditions", route: "/pages/landing-pages/terms-conditions" },
//         { name: "contact", route: "/pages/landing-pages/contact" },
//       ],
//     },

// {
//   name: "company",
//   items: [
//     { name: "about us", href: "https://www.creative-tim.com/presentation" },
//     { name: "freebies", href: "https://www.creative-tim.com/templates/free" },
//     { name: "premium tools", href: "https://www.creative-tim.com/templates/premium" },
//     { name: "blog", href: "https://www.creative-tim.com/blog" },
//   ],
// },
//   ],
//   copyright: (
//     <MKBox display="flex" justifyContent="center" mx={"auto"} pt={0} alignItems="center">
//       <MKTypography
//         variant="button"
//         fontWeight="regular"
//         fontSize="0.9rem"
//         color="white"
//         // width="55%"
//         // sx={{ borderTop: "0.75px #A8A8A8 solid" }}
//         py={2}
//         px={2}
//       >
//         Copyright &copy; {date} Aadar foundation - All rights reserved.
//         <MKBox display="flex" justifyContent="center" alignItems="center" m={1}>
//           <MKTypography
//             variant="button"
//             fontWeight="regular"
//             fontSize="0.9rem"
//             color="white"
//             pr={2}
//           >
//             Designed by{" "}
//             <MKTypography
//               component="a"
//               href={"https://linktr.ee/Rolzzzz"}
//               target="_blank"
//               rel="noreferrer"
//             >
//               <MKButton
//                 variant="text"
//                 size="small"
//                 sx={{
//                   backgroundColor: "#575757",
//                   backdropFilter: `saturate(200%) blur(30px)`,

//                   color: "#ffffff",
//                   textTransform: "capitalize",
//                   border: "2px solid transparent",
//                   "&: hover": {
//                     border: "2px solid #FFFFFF",
//                   },
//                   marginLeft: "5px",
//                   padding: "5px 5px",
//                 }}
//               >
//                 <MKTypography fontWeight="regular" fontSize="0.9rem" color="white">
//                   Aishwarya Sharma
//                 </MKTypography>
//                 &nbsp;
//                 <MKBox
//                   component="img"
//                   src={logoME}
//                   borderRadius="3px"
//                   width="27px"
//                   height="22px"
//                   ml={1}
//                 ></MKBox>
//               </MKButton>
//             </MKTypography>
//           </MKTypography>
//         </MKBox>
//       </MKTypography>
//     </MKBox>
//   ),
// };

export default getFooterRoutes;
