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
          <MKBox display="flex" justifyContent="center" alignItems="center" m={1}>
            <MKTypography
              variant="button"
              fontWeight="regular"
              fontSize="0.9rem"
              color="white"
              pr={2}
            >
              {t("footer.designed by")}
              <MKTypography
                component="a"
                href={"https://linktr.ee/Rolzzzz"}
                target="_blank"
                rel="noreferrer"
              >
                <MKButton
                  variant="text"
                  size="small"
                  sx={{
                    backgroundColor: "#575757",
                    backdropFilter: `saturate(200%) blur(30px)`,
                    color: "#ffffff",
                    textTransform: "none",
                    border: "2px solid transparent",
                    "&: hover": {
                      border: "2px solid #FFFFFF",
                    },
                    marginLeft: "5px",
                    padding: "2px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    minHeight: "auto",
                    lineHeight: 1.2,
                  }}
                >
                  <MKBox display="flex" flexDirection="column" sx={{ lineHeight: 1 }}>
                    <MKTypography fontWeight="bold" fontSize="0.85rem" color="white">
                      Aishx.dev
                    </MKTypography>
                    <MKTypography
                      fontWeight="light"
                      fontSize="0.65rem"
                      color="rgba(255,255,255,0.8)"
                    >
                      ( Aishwarya Sharma )
                    </MKTypography>
                  </MKBox>
                  <MKBox
                    component="img"
                    src={logoME}
                    borderRadius="3px"
                    width="22px"
                    height="18px"
                  ></MKBox>
                </MKButton>
              </MKTypography>
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
