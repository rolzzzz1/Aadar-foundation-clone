import Box from "@mui/material/Box";

import { PAGE_HERO_DESKTOP, PAGE_HERO_MOBILE } from "utils/pageHeroAssets";

const heroImgSx = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: 0,
  pointerEvents: "none",
};

/** Shown while lazy-loaded internal pages fetch — matches landing-page hero, not home. */
export default function PageLoadingFallback() {
  return (
    <Box
      aria-busy="true"
      aria-label="Loading page"
      sx={{
        position: "relative",
        minHeight: "80vh",
        width: "100%",
        bgcolor: "#1f2a44",
        backgroundImage: "linear-gradient(135deg, #1a2238 0%, #1f2a44 45%, #2a3658 100%)",
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={PAGE_HERO_MOBILE}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
        sx={{
          ...heroImgSx,
          display: { xs: "block", md: "none" },
          objectPosition: "center top",
        }}
      />
      <Box
        component="img"
        src={PAGE_HERO_DESKTOP}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="low"
        sx={{
          ...heroImgSx,
          display: { xs: "none", md: "block" },
          objectPosition: "left",
        }}
      />
    </Box>
  );
}
