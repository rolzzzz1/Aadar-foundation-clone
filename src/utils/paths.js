/** Canonical public URLs — single source of truth for nav, sitemap, and internal links. */

export const HOME_PATH = "/";

export const ABOUT_PATH = "/about";
export const WORK_PATH = "/work";
export const VOLUNTEER_PATH = "/volunteer";
export const DONATE_PAGE_PATH = "/donate";
export const GALLERY_PATH = "/gallery";
export const CONTACT_PATH = "/contact";
export const PRIVACY_POLICY_PATH = "/privacy-policy";
export const TERMS_CONDITIONS_PATH = "/terms-and-conditions";

export const DONATION_CHECKOUT_PATH = "/donate/checkout";
export const DONATION_SUCCESS_PATH = "/donation/success";
export const DONATION_FAILED_PATH = "/donation/failed";

export const DONATE_WIDGET_HASH = "donate-widget";

/** Old Material Kit / marketing URLs → canonical paths (client + Vercel redirects). */
export const LEGACY_PATH_REDIRECTS = Object.freeze({
  "/pages/landing-pages/about-us": ABOUT_PATH,
  "/pages/landing-pages/about": ABOUT_PATH,
  "/pages/landing-pages/work": WORK_PATH,
  "/pages/landing-pages/volunteer": VOLUNTEER_PATH,
  "/pages/landing-pages/donate": DONATE_PAGE_PATH,
  "/pages/landing-pages/donate2": DONATE_PAGE_PATH,
  "/donate2": DONATE_PAGE_PATH,
  "/pages/landing-pages/gallery": GALLERY_PATH,
  "/pages/landing-pages/contact": CONTACT_PATH,
  "/pages/landing-pages/privacy-policy": PRIVACY_POLICY_PATH,
  "/pages/landing-pages/terms-conditions": TERMS_CONDITIONS_PATH,
});
