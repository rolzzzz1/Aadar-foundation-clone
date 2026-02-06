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
import aishxDevLogo from "assets/images/logos/aishx-dev-logo.png";

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
        { name: "about us", route: "/pages/landing-pages/about-us" },
        { name: "our work", route: "/pages/landing-pages/work" },
        { name: "volunteer", route: "/pages/landing-pages/volunteer" },
        { name: "gallery", route: "/pages/landing-pages/gallery" },
      ],
    },

    {
      name: "Useful links",
      items: [
        {
          name: "privacy policy",
          route: "/pages/landing-pages/privacy-policy",
        },
        { name: "terms and conditions", route: "/pages/landing-pages/terms-conditions" },
        { name: "contact", route: "/pages/landing-pages/contact" },
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
            Designed by{" "}
            <MKButton
              component="a"
              href="https://linktr.ee/aishx.dev"
              target="_blank"
              rel="noreferrer"
              aria-label="aishx.dev"
              variant="text"
              size="small"
              data-footer-button="aishx"
              sx={{
                padding: 0,
                minWidth: "auto",
                backgroundColor: "transparent",
                backdropFilter: "none",
                border: "none",
                boxShadow: "none",
                textTransform: "none",
                marginLeft: "5px",
                display: "flex",
                alignItems: "center",
                "&:hover": {
                  border: "none",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              }}
            >
              <MKBox
                component="img"
                src={aishxDevLogo}
                alt="Aishx.dev"
                width={{ xs: "92px", sm: "112px", md: "124px" }}
                height="auto"
                sx={{ display: "block" }}
              />
            </MKButton>
          </MKTypography>
        </MKBox>
      </MKTypography>
    </MKBox>
  ),
};
