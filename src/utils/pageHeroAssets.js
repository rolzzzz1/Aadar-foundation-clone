import pageHeroDesktop from "assets/images/mainThemeImages/swargSadanBlack.png";

/** Desktop hero for internal pages (md and up). */
export const PAGE_HERO_DESKTOP = pageHeroDesktop;

/**
 * Mobile-only hero for internal pages (below md).
 * Served from /public so the file can be replaced without a webpack hash.
 */
export const PAGE_HERO_MOBILE = `${
  process.env.PUBLIC_URL || ""
}/assets/images/mainThemeImages/page-hero-mobile.jpg?v=2`;

/** Pick the hero image URL for the current viewport (client-only). */
export function getPageHeroSrcForViewport() {
  if (typeof window === "undefined") return PAGE_HERO_DESKTOP;
  return window.matchMedia("(max-width: 767px)").matches ? PAGE_HERO_MOBILE : PAGE_HERO_DESKTOP;
}
