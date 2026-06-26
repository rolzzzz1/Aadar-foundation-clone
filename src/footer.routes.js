// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
// import TwitterIcon from "@mui/icons-material/Twitter";
// import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

// Material Kit 2 React components
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import AishxDevCreditButton from "components/AishxDevCreditButton";

// Images
import logoCT from "assets/images/logos/logo-aadar.jpg";
import {
  ABOUT_PATH,
  WORK_PATH,
  VOLUNTEER_PATH,
  GALLERY_PATH,
  CONTACT_PATH,
  PRIVACY_POLICY_PATH,
  TERMS_CONDITIONS_PATH,
} from "utils/paths";

const date = new Date().getFullYear();

export default {
  brand: {
    name: "Aadar foundation",
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
      name: "Navigation",
      items: [
        { name: "home", href: "/" },
        { name: "about us", route: ABOUT_PATH },
        { name: "our work", route: WORK_PATH },
        { name: "volunteer", route: VOLUNTEER_PATH },
        { name: "gallery", route: GALLERY_PATH },
      ],
    },

    {
      name: "Useful links",
      items: [
        {
          name: "privacy policy",
          route: PRIVACY_POLICY_PATH,
        },
        { name: "terms and conditions", route: TERMS_CONDITIONS_PATH },
        { name: "contact", route: CONTACT_PATH },
      ],
    },

    // {
    //   name: "company",
    //   items: [
    //     { name: "about us", href: "https://www.creative-tim.com/presentation" },
    //     { name: "freebies", href: "https://www.creative-tim.com/templates/free" },
    //     { name: "premium tools", href: "https://www.creative-tim.com/templates/premium" },
    //     { name: "blog", href: "https://www.creative-tim.com/blog" },
    //   ],
    // },
  ],
  copyright: (
    <MKBox display="flex" justifyContent="center" mx={"auto"} pt={0} alignItems="center">
      <MKTypography
        variant="button"
        fontWeight="regular"
        fontSize="1rem"
        color="white"
        // width="55%"
        // sx={{ borderTop: "0.75px #A8A8A8 solid" }}
        py={2}
        px={2}
      >
        Copyright &copy; {date} Aadar foundation - All rights reserved.
        <MKBox display="flex" justifyContent="center" alignItems="center" m={1}>
          <MKTypography variant="button" fontWeight="regular" fontSize="1rem" color="white" pr={2}>
            Designed by <AishxDevCreditButton />
          </MKTypography>
        </MKBox>
      </MKTypography>
    </MKBox>
  ),
};
