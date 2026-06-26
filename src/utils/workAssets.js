import aboutImgBundled from "assets/images/ourWorkImages/aboutImg.webp";
import treatmentBundled from "assets/images/ourWorkImages/treatment.webp";
import shelterBundled from "assets/images/ourWorkImages/shelter.webp";
import foodBundled from "assets/images/ourWorkImages/food2.jpg";
import careBundled from "assets/images/ourWorkImages/care2.jpg";
import rehabBundled from "assets/images/ourWorkImages/rehabilitation1.jpg";
import { publicAsset } from "utils/brandAssets";

const pub = (name) => publicAsset(`/assets/images/ourWorkImages/${name}`);

/** Bundled URL + stable public copies + alternate file for flaky mobile networks. */
export const WORK_STEP_IMAGES = [
  { primary: aboutImgBundled, fallback: pub("aboutImg.webp") },
  {
    primary: treatmentBundled,
    fallback: pub("treatment.webp"),
    alternate: pub("treatmentImg2.jpg"),
  },
  {
    primary: shelterBundled,
    fallback: pub("shelter.webp"),
    alternate: pub("shelter1.jpg"),
  },
  {
    primary: foodBundled,
    fallback: pub("food2.jpg"),
    alternate: pub("foodImg1.jpg"),
  },
  { primary: careBundled, fallback: pub("care2.jpg") },
  {
    primary: rehabBundled,
    fallback: pub("rehabilitation1.jpg"),
    alternate: pub("rehabilitation.jpg"),
  },
];
