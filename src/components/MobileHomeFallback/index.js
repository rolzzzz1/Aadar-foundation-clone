import Box from "@mui/material/Box";
import CriticalImage from "components/CriticalImage";
import { BRAND_LOGOS } from "utils/brandAssets";

/** Static mobile hero shell shown while the Home chunk loads — improves mobile FCP/LCP. */
export default function MobileHomeFallback() {
  if (typeof window !== "undefined" && !window.matchMedia("(max-width: 767px)").matches) {
    return null;
  }

  return (
    <Box
      aria-hidden
      sx={{
        minHeight: "100dvh",
        width: "100%",
        background: "linear-gradient(135deg, #101826 0%, #1f2a44 55%, #2a3658 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        pb: 10,
      }}
    >
      <CriticalImage
        src={BRAND_LOGOS.hindiYellow.primary}
        fallbackSrc={BRAND_LOGOS.hindiYellow.fallback}
        reserveWidth={120}
        reserveHeight={120}
        alt=""
        sx={{
          width: 120,
          height: 120,
          filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
          mb: 2,
        }}
      />
      <Box
        sx={{
          width: 140,
          height: 36,
          borderRadius: "10px",
          bgcolor: "rgba(255,255,255,0.92)",
        }}
      />
    </Box>
  );
}
