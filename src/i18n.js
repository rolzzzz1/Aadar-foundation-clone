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
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    react: {
      useSuspense: false,
    },
    // Prevent app from breaking if translation load fails
    partialBundledLanguages: true,
    load: "currentOnly",
  })
  .catch(() => {
    // If init fails (e.g. network), app still mounts with fallback keys
  });
