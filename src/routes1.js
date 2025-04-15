import About from "layouts/pages/landing-pages/about-us";
import Work from "layouts/pages/landing-pages/work";
import Volunteer from "layouts/pages/landing-pages/volunteer";
import Gallery from "layouts/pages/landing-pages/gallery";
import Contact from "layouts/pages/landing-pages/contact";
import Donate from "layouts/pages/landing-pages/donate";

const getRoutes = (t) => [
  {
    name: t("Home"),
    href: "/",
  },
  {
    name: t("About Us"),
    route: "/pages/landing-pages/about-us",
    component: <About isWorkOn={false} />,
  },
  {
    name: t("Our Work"),
    route: "/pages/landing-pages/work",
    component: <Work isWorkOn={true} />,
  },
  {
    name: t("Volunteer"),
    route: "/pages/landing-pages/volunteer",
    component: <Volunteer />,
  },
  {
    name: t("Gallery"),
    route: "/pages/landing-pages/gallery",
    component: <Gallery />,
  },
  {
    name: t("Contact"),
    route: "/pages/landing-pages/contact",
    component: <Contact />,
  },
  {
    name: "Donate",
    route: "/pages/landing-pages/donate",
    component: <Donate />,
  },
  //   {
  //     name: "Donate",
  //     route: "/pages/landing-pages/donate",
  //     component: <Donate />,
  //   },
  //   {
  //     name: "Gallery",
  //     route: "/pages/landing-pages/gallery",
  //     component: <Gallery />,
  //   },
  //   {
  //     name: "Contact",
  //     route: "/pages/landing-pages/contact",
  //     component: <Contact />,
  //   },
  //   {
  //     name: "Privacy policy",
  //     route: "/pages/landing-pages/privacy-policy",
  //     component: <PrivacyPolicy />,
  //   },
  //   {
  //     name: "Terms Conditions",
  //     route: "/pages/landing-pages/terms-conditions",
  //     component: <TermsConditions />,
  //   },
];

export default getRoutes;
