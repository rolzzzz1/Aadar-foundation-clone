import aadarHindiWhiteBundled from "assets/images/aadarHindiWhite.png";
import aadarHindiYellowBundled from "assets/images/aadarHindiYellow.png";
import logoAadarBundled from "assets/images/logos/logo-aadar.jpg";

const publicAsset = (path) => `${process.env.PUBLIC_URL || ""}${path}`;

/** Bundled URL first (build-hashed), public path as fallback for slow networks / cache misses. */
export const BRAND_LOGOS = {
  hindiWhite: {
    primary: aadarHindiWhiteBundled,
    fallback: publicAsset("/assets/images/aadarHindiWhite.png"),
  },
  hindiYellow: {
    primary: aadarHindiYellowBundled,
    fallback: publicAsset("/assets/images/aadarHindiYellow.png"),
  },
  navbar: {
    primary: logoAadarBundled,
    fallback: publicAsset("/assets/images/logos/logo-aadar.jpg"),
  },
};

export { publicAsset };
