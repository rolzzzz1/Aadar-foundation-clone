import enTranslation from "../locales/en/translation.json";

/** Safe homePage object — avoids crash when async locale JSON has not loaded yet. */
export function getHomePageCopy(t) {
  const page = t("homePage", { returnObjects: true });
  if (page && typeof page === "object" && page.heroSection?.slide4) {
    return page;
  }
  return enTranslation.homePage;
}
