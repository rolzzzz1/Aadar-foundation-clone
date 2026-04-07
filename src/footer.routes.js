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
                width: { xs: "88px", sm: "104px", md: "116px" },
                height: { xs: "28px", sm: "32px", md: "36px" },
                backgroundImage: `url(${aishxDevLogo})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                borderRadius: "10px",
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
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15)",
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
          </MKTypography>
        </MKBox>
      </MKTypography>
    </MKBox>
  ),
};
