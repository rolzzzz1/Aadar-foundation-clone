import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

// Configure i18next so the app doesn't get stuck behind React.Suspense
// if translation JSON fails to load in production.
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: "en",
    returnObjects: true,
    backend: {
      // Translation files are served statically from public/locales
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    react: {
      // Disable Suspense so the app always renders, even if translations are delayed
      useSuspense: false,
    },
  });
