import { ABOUT_PATH, WORK_PATH, VOLUNTEER_PATH, GALLERY_PATH, CONTACT_PATH } from "utils/paths";

/** Navbar/footer link metadata only — do not import page components here (bloats the home bundle). */
const getRoutes = (t) => [
  {
    name: t("navbar.navItems.Home"),
    href: "/",
  },
  {
    name: t("navbar.navItems.About Us"),
    route: ABOUT_PATH,
  },
  {
    name: t("navbar.navItems.Our Work"),
    route: WORK_PATH,
  },
  {
    name: t("navbar.navItems.Volunteer"),
    route: VOLUNTEER_PATH,
  },
  {
    name: t("navbar.navItems.Gallery"),
    route: GALLERY_PATH,
  },
  {
    name: t("navbar.navItems.Contact"),
    route: CONTACT_PATH,
  },
];

export default getRoutes;
