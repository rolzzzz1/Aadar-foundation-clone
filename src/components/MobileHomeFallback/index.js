import Box from "@mui/material/Box";
import CriticalImage from "components/CriticalImage";
import { BRAND_LOGOS, publicAsset } from "utils/brandAssets";

const heroWebp = publicAsset("/assets/images/mainThemeImages/aadar-main-black2.webp");

/** Static mobile hero shell shown while the Home chunk loads — improves mobile FCP/LCP. */
export default function MobileHomeFallback() {
  if (typeof window !== "undefined" && !window.matchMedia("(max-width: 767px)").matches) {
    return null;
  }

  return (
    <Box
      aria-hidden
      sx={{
        minHeight: "min(88dvh, 640px)",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        component="img"
        src={heroWebp}
        alt=""
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(16, 24, 38, 0.55) 0%, rgba(16, 24, 38, 0.82) 100%)",
        }}
      />
      <CriticalImage
        src={BRAND_LOGOS.hindiYellow.fallback}
        fallbackSrc={BRAND_LOGOS.hindiYellow.primary}
        reserveWidth={120}
        reserveHeight={120}
        alt=""
        sx={{
          position: "relative",
          zIndex: 1,
          width: 120,
          height: 120,
          filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
          mb: 2,
        }}
      />
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: 140,
          height: 36,
          borderRadius: "10px",
          bgcolor: "rgba(255,255,255,0.92)",
        }}
      />
    </Box>
  );
}
