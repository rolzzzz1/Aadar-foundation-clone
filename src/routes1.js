import About from "layouts/pages/landing-pages/about-us";
import Work from "layouts/pages/landing-pages/work";
import Volunteer from "layouts/pages/landing-pages/volunteer";
import Gallery from "layouts/pages/landing-pages/gallery";
import Contact from "layouts/pages/landing-pages/contact";
import { ABOUT_PATH, WORK_PATH, VOLUNTEER_PATH, GALLERY_PATH, CONTACT_PATH } from "utils/paths";

const getRoutes = (t) => [
  {
    name: t("navbar.navItems.Home"),
    href: "/",
  },
  {
    name: t("navbar.navItems.About Us"),
    route: ABOUT_PATH,
    component: <About isWorkOn={false} />,
  },
  {
    name: t("navbar.navItems.Our Work"),
    route: WORK_PATH,
    component: <Work isWorkOn={true} />,
  },
  {
    name: t("navbar.navItems.Volunteer"),
    route: VOLUNTEER_PATH,
    component: <Volunteer />,
  },
  {
    name: t("navbar.navItems.Gallery"),
    route: GALLERY_PATH,
    component: <Gallery />,
  },
  {
    name: t("navbar.navItems.Contact"),
    route: CONTACT_PATH,
    component: <Contact />,
  },
];

export default getRoutes;
