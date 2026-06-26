/** Vercel Speed Insights "Mobile" bucket — max-width 767px. */
export const MOBILE_PERF_MEDIA = "(max-width: 767px)";

export function isMobilePerfViewport() {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_PERF_MEDIA).matches;
}

/** Stable hero height on mobile browsers (avoids address-bar 100vh jumps). */
export const mobileHeroHeightSx = { xs: "100dvh", sm: "100dvh", md: "100vh" };

export function mobileHeroCalcSx(offsetPx) {
  return {
    xs: `calc(100dvh - ${offsetPx}px)`,
    sm: `calc(100dvh - ${offsetPx}px)`,
    md: `calc(100vh - ${offsetPx}px)`,
  };
}

/** Tighter prefetch on phones so below-fold chunks don't compete with LCP. */
export function sectionLazyRootMargin(isNarrowViewport) {
  return isNarrowViewport ? "80px" : "500px";
}
