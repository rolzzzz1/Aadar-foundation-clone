// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
// import TwitterIcon from "@mui/icons-material/Twitter";
// import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

// Material Kit 2 React components
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";

// Images
import logoCT from "assets/images/logos/logo-aadar.jpg";
// import logoME from "assets/images/MyLogo1.png";
import logoME from "assets/images/logos/MeLogo3.png";

// const date = new Date().getFullYear();

const getFooterRoutes = (t) => [
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
          {t("footer.copyright")}
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
            <MKTypography
              component="a"
              href={"https://linktr.ee/Rolzzzz"}
              target="_blank"
              rel="noreferrer"
            >
              <MKButton
                variant="text"
                size="small"
                data-footer-button="aishx"
                ref={(el) => {
                  if (el && typeof window !== "undefined") {
                    const element = el;
                    element.style.setProperty(
                      "background",
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)",
                      "important"
                    );
                    element.style.setProperty(
                      "backdrop-filter",
                      "saturate(200%) blur(30px)",
                      "important"
                    );
                    element.style.setProperty("color", "#ffffff", "important");
                    element.style.setProperty("display", "flex", "important");
                    element.style.setProperty("align-items", "center", "important");
                    const width = window.innerWidth;
                    if (width < 600) {
                      element.style.setProperty("border-radius", "10px", "important");
                      element.style.setProperty("border-width", "1px", "important");
                      element.style.setProperty("padding", "4px 10px", "important");
                      element.style.setProperty("gap", "6px", "important");
                      element.style.setProperty("margin-left", "4px", "important");
                    } else if (width < 960) {
                      element.style.setProperty("border-radius", "12px", "important");
                      element.style.setProperty("border-width", "1.5px", "important");
                      element.style.setProperty("padding", "5px 12px", "important");
                      element.style.setProperty("gap", "8px", "important");
                      element.style.setProperty("margin-left", "6px", "important");
                    } else {
                      element.style.setProperty("border-radius", "14px", "important");
                      element.style.setProperty("border-width", "1.5px", "important");
                      element.style.setProperty("padding", "6px 14px", "important");
                      element.style.setProperty("gap", "8px", "important");
                      element.style.setProperty("margin-left", "6px", "important");
                    }
                    element.style.setProperty("border-style", "solid", "important");
                    element.style.setProperty(
                      "border-color",
                      "rgba(255, 255, 255, 0.3)",
                      "important"
                    );
                    element.style.setProperty(
                      "box-shadow",
                      "0 1px 6px rgba(0, 0, 0, 0.25)",
                      "important"
                    );
                  }
                }}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)",
                  backdropFilter: "saturate(200%) blur(30px)",
                  color: "#ffffff",
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  borderStyle: "solid",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 1px 6px rgba(0, 0, 0, 0.25)",
                  borderRadius:
                    typeof window !== "undefined" && window.innerWidth < 600
                      ? "10px"
                      : typeof window !== "undefined" && window.innerWidth < 960
                      ? "12px"
                      : "14px",
                  borderWidth:
                    typeof window !== "undefined" && window.innerWidth < 600 ? "1px" : "1.5px",
                  padding:
                    typeof window !== "undefined" && window.innerWidth < 600
                      ? "4px 10px"
                      : typeof window !== "undefined" && window.innerWidth < 960
                      ? "5px 12px"
                      : "6px 14px",
                  gap: typeof window !== "undefined" && window.innerWidth < 600 ? "6px" : "8px",
                  marginLeft:
                    typeof window !== "undefined" && window.innerWidth < 600 ? "4px" : "6px",
                  minHeight: "auto",
                  transition: "all 0.25s ease",
                }}
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)",
                  backdropFilter: `saturate(200%) blur(30px)`,
                  color: "#ffffff",
                  textTransform: "none",
                  borderRadius: { xs: "10px", sm: "12px", md: "14px" },
                  borderWidth: { xs: "1px", sm: "1.5px" },
                  borderStyle: "solid",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.6)",
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.35)",
                  },
                  marginLeft: { xs: "4px", sm: "6px" },
                  padding: { xs: "4px 10px", sm: "5px 12px", md: "6px 14px" },
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: "6px", sm: "8px", md: "8px" },
                  minHeight: "auto",
                  transition: "all 0.25s ease",
                  boxShadow: "0 1px 6px rgba(0, 0, 0, 0.25)",
                }}
              >
                <MKTypography
                  fontWeight="700"
                  fontSize={{ xs: "0.8rem", sm: "0.9rem", md: "1rem" }}
                  color="white"
                  letterSpacing={{ xs: "0.4px", sm: "0.6px", md: "0.8px" }}
                  sx={{
                    fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
                    textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                    lineHeight: 1.3,
                  }}
                >
                  aishx.dev
                </MKTypography>
                <MKBox
                  component="img"
                  src={logoME}
                  borderRadius="50%"
                  width={{ xs: "16px", sm: "18px", md: "20px" }}
                  height={{ xs: "16px", sm: "18px", md: "20px" }}
                  sx={{
                    borderWidth: { xs: "1px", sm: "1.5px" },
                    borderStyle: "solid",
                    borderColor: "rgba(255, 255, 255, 0.4)",
                    transition: "all 0.25s ease",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
                  }}
                ></MKBox>
              </MKButton>
            </MKTypography>
          </MKBox>
        </MKTypography>
      </MKBox>
    ),
  },
];

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
