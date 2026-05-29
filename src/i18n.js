import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

import enTranslation from "./locales/en/translation.json";

const SECONDARY_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Hind:wght@400;600;700&family=Mukta:wght@400;600;700&family=Pacifico&display=swap";

function loadSecondaryFonts() {
  if (typeof document === "undefined" || document.getElementById("aadar-secondary-fonts")) {
    return;
  }
  const link = document.createElement("link");
  link.id = "aadar-secondary-fonts";
  link.rel = "stylesheet";
  link.href = SECONDARY_FONTS_URL;
  document.head.appendChild(link);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(Backend)
  .init({
    debug: false,
    fallbackLng: "en",
    returnObjects: true,
    load: "languageOnly",
    partialBundledLanguages: true,
    resources: {
      en: { translation: enTranslation },
    },
    backend: {
      loadPath: `${process.env.PUBLIC_URL || ""}/locales/{{lng}}/translation.json`,
    },
    react: {
      useSuspense: false,
      bindI18n: "languageChanged loaded",
    },
  });

i18n.on("languageChanged", (lng) => {
  if (typeof lng === "string" && lng.startsWith("hi")) {
    loadSecondaryFonts();
  }
});
