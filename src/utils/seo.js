/**
 * SEO Utility Functions
 * Manages meta tags, Open Graph, Twitter Cards, and structured data
 */

const SITE_URL = "https://www.aadar.foundation";
const SITE_NAME = "Aadar Foundation";
const DEFAULT_DESCRIPTION =
  "Aadar Foundation - Transforming lives from the streets to a new life. We rescue, treat, shelter, feed, care for, and rehabilitate children and families in need.";

/**
 * Update or create a meta tag
 */
const setMetaTag = (name, content, isProperty = false) => {
  if (!content) return;

  const attribute = isProperty ? "property" : "name";
  let element = document.querySelector(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

/**
 * Update or create a link tag
 */
const setLinkTag = (rel, href) => {
  if (!href) return;

  let element = document.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

/**
 * Set page title
 */
export const setTitle = (title) => {
  if (title) {
    document.title = `${title} | ${SITE_NAME}`;
  } else {
    document.title = SITE_NAME;
  }
};

/**
 * Set meta description
 */
export const setDescription = (description) => {
  setMetaTag("description", description || DEFAULT_DESCRIPTION);
};

/**
 * Set Open Graph tags for social sharing
 */
export const setOpenGraph = ({
  title,
  description,
  image,
  url,
  type = "website",
}) => {
  const ogTitle = title || SITE_NAME;
  const ogDescription = description || DEFAULT_DESCRIPTION;
  const ogImage = image || `${SITE_URL}/assets/images/aadarHindiYellow.png`;
  const ogUrl = url || SITE_URL;

  setMetaTag("og:title", ogTitle, true);
  setMetaTag("og:description", ogDescription, true);
  setMetaTag("og:image", ogImage, true);
  setMetaTag("og:url", ogUrl, true);
  setMetaTag("og:type", type, true);
  setMetaTag("og:site_name", SITE_NAME, true);
};

/**
 * Set Twitter Card tags
 */
export const setTwitterCard = ({ title, description, image }) => {
  const twitterTitle = title || SITE_NAME;
  const twitterDescription = description || DEFAULT_DESCRIPTION;
  const twitterImage = image || `${SITE_URL}/assets/images/aadarHindiYellow.png`;

  setMetaTag("twitter:card", "summary_large_image");
  setMetaTag("twitter:title", twitterTitle);
  setMetaTag("twitter:description", twitterDescription);
  setMetaTag("twitter:image", twitterImage);
};

/**
 * Set canonical URL
 */
export const setCanonical = (url) => {
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  setLinkTag("canonical", canonicalUrl);
};

/**
 * Set language alternates (for i18n)
 */
export const setLanguageAlternates = (currentPath) => {
  const languages = ["en", "hi"];
  
  // Remove existing alternate links
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => {
    if (link.getAttribute("hreflang") !== "x-default") {
      link.remove();
    }
  });

  languages.forEach((lang) => {
    const href = lang === "en" ? `${SITE_URL}${currentPath}` : `${SITE_URL}/${lang}${currentPath}`;
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", lang);
    link.setAttribute("href", href);
    document.head.appendChild(link);
  });
};

/**
 * Add structured data (JSON-LD)
 */
export const setStructuredData = (data) => {
  // Remove existing structured data script
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

/**
 * Set organization structured data
 */
export const setOrganizationSchema = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Aadar Foundation",
    alternateName: "Aadar Foundation Swarg Sadan",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/images/aadarHindiYellow.png`,
    description: DEFAULT_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    sameAs: [
      // Add your social media links here
      // "https://www.facebook.com/aadarfoundation",
      // "https://www.instagram.com/aadarfoundation",
      // "https://twitter.com/aadarfoundation",
    ],
  };

  setStructuredData(organizationSchema);
};

/**
 * Set breadcrumb structured data
 */
export const setBreadcrumbSchema = (items) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  setStructuredData(breadcrumbSchema);
};

/**
 * Initialize SEO for a page
 */
export const initSEO = ({
  title,
  description,
  image,
  url,
  type = "website",
  breadcrumbs,
}) => {
  // Set basic meta tags
  setTitle(title);
  setDescription(description);

  // Set Open Graph
  setOpenGraph({ title, description, image, url, type });

  // Set Twitter Card
  setTwitterCard({ title, description, image });

  // Set canonical URL
  setCanonical(url);

  // Set organization schema (always)
  setOrganizationSchema();

  // Set breadcrumb schema if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    setBreadcrumbSchema(breadcrumbs);
  }
};

/**
 * Default SEO setup
 */
export const setDefaultSEO = () => {
  initSEO({
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: "/",
  });
};

