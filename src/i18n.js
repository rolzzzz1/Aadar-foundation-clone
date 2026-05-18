import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

import enTranslation from "./locales/en/translation.json";

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
