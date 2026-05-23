import React, { useEffect, useState, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Material Kit 2 React themes
import theme from "assets/theme";

// Image protection utilities
import { setupImageProtection, addImageProtectionCSS } from "utils/imageProtection";
// Image watermarking (gallery only — canvas work hurts Real Experience Score)
import { watermarkAllImages, setupWatermarkObserver } from "utils/imageWatermark";
import DeferredVitals from "components/DeferredVitals";

// Import Home directly (not lazy) since it's the main page and should load fast
import Home from "layouts/pages/home";

// Material Kit 2 React routes
import routes from "routes";
import { DONATE_PAGE_PATH, DONATION_CHECKOUT_PATH } from "utils/donation";

import Typography from "@mui/material/Typography";

/** Keeps old bookmarks/links working after checkout moved off /__razorpay-test. */
function LegacyCheckoutRedirect() {
  const { search } = useLocation();
  return <Navigate to={`${DONATION_CHECKOUT_PATH}${search}`} replace />;
}

/** Old Donate2 URLs → /donate (preserves hash e.g. #donate-widget). */
function LegacyDonatePageRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={`${DONATE_PAGE_PATH}${search}${hash}`} replace />;
}

const isGalleryRoute = (path) => /\/gallery\/?$/i.test(path);

const RazorpayTest = lazy(() => import("pages/RazorpayTest"));
const Donate2 = lazy(() => import("pages/LandingPages/Donate2"));
const DonationResult = lazy(() => import("pages/DonationResult"));

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const message = this.state.error?.message || "An unexpected error occurred";
      const isChunkError = /Loading chunk [\d]+ failed/i.test(message);

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#f5f5f5",
            padding: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 420 }}>
            {isChunkError
              ? "Part of the page could not load (slow connection or outdated cache). Please refresh."
              : message}
          </Typography>
          <Typography
            component="button"
            type="button"
            variant="button"
            onClick={() => window.location.reload()}
            sx={{
              border: "none",
              cursor: "pointer",
              bgcolor: "#4fa953",
              color: "#fff",
              px: 3,
              py: 1.25,
              borderRadius: "10px",
              fontWeight: 700,
            }}
          >
            Refresh page
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function App() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    const scrollEl = document.scrollingElement || document.documentElement;
    if (scrollEl) {
      scrollEl.scrollTop = 0;
    }
  }, [pathname]);

  // Show back-to-top when the page scrolls (listen on window — documentElement alone often misses events)
  useEffect(() => {
    const SCROLL_SHOW_PX = 120;

    const handleScroll = () => {
      const scrollTop =
        window.scrollY ??
        document.scrollingElement?.scrollTop ??
        document.documentElement?.scrollTop ??
        document.body?.scrollTop ??
        0;
      setShowBackToTop(scrollTop > SCROLL_SHOW_PX);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const el = document.scrollingElement || document.documentElement;
    if (el) el.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const hideBackToTop = pathname === DONATION_CHECKOUT_PATH;

  // Set HTML lang attribute based on current language
  useEffect(() => {
    document.documentElement.lang = i18n.language || "en";
  }, [i18n.language]);

  // Initialize SEO based on current route - lazy loaded for performance
  useEffect(() => {
    // Use requestIdleCallback for non-critical SEO updates
    const updateSEO = () => {
      import("./utils/seo")
        .then(({ setCanonical, setLanguageAlternates }) => {
          setCanonical(pathname);
          setLanguageAlternates(pathname);
        })
        .catch(() => {
          // Silently fail if SEO utils can't be loaded
        });
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(updateSEO, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(updateSEO, 100);
    }
  }, [pathname]);

  // Image protection — defer until idle so it does not compete with LCP / INP
  useEffect(() => {
    let idleId;
    let timeoutId;
    let cleanup = () => {};

    const init = () => {
      addImageProtectionCSS();
      cleanup = setupImageProtection() || (() => {});
    };

    if ("requestIdleCallback" in window) {
      idleId = requestIdleCallback(init, { timeout: 5000 });
    } else {
      timeoutId = window.setTimeout(init, 3000);
    }

    return () => {
      if (idleId != null && "cancelIdleCallback" in window) {
        cancelIdleCallback(idleId);
      }
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
      cleanup();
    };
  }, []);

  // Watermark only on gallery — re-encoding every <img> via canvas tanks RES on the home page
  useEffect(() => {
    if (!isGalleryRoute(pathname)) return undefined;

    const watermarkOptions = {
      opacity: 0.05,
      scale: 0.25,
      position: "center",
      repeat: false,
    };

    const cleanupObserver = setupWatermarkObserver(watermarkOptions);
    let idleId;
    let timeoutId;

    const apply = () => watermarkAllImages(watermarkOptions);

    if ("requestIdleCallback" in window) {
      idleId = requestIdleCallback(apply, { timeout: 8000 });
    } else {
      timeoutId = window.setTimeout(apply, 4000);
    }

    return () => {
      cleanupObserver();
      if (idleId != null && "cancelIdleCallback" in window) {
        cancelIdleCallback(idleId);
      }
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {getRoutes(routes)}
          <Route path="/home" element={<Home />} />
          <Route
            path={DONATION_CHECKOUT_PATH}
            element={
              <Suspense fallback={null}>
                <RazorpayTest />
              </Suspense>
            }
          />
          <Route path="/__razorpay-test" element={<LegacyCheckoutRedirect />} />
          <Route
            path="/donation/success"
            element={
              <Suspense fallback={null}>
                <DonationResult />
              </Suspense>
            }
          />
          <Route
            path="/donation/failed"
            element={
              <Suspense fallback={null}>
                <DonationResult />
              </Suspense>
            }
          />
          <Route
            path={DONATE_PAGE_PATH}
            element={
              <Suspense fallback={null}>
                <Donate2 />
              </Suspense>
            }
          />
          <Route path="/pages/landing-pages/donate2" element={<LegacyDonatePageRedirect />} />
          <Route path="/donate2" element={<LegacyDonatePageRedirect />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
        {!hideBackToTop && (
          <Box
            component="button"
            type="button"
            aria-label="Back to top"
            title="Back to top"
            onClick={scrollToTop}
            sx={{
              position: "fixed",
              bottom: { xs: 20, sm: 28 },
              right: { xs: 20, sm: 28 },
              zIndex: 9999,
              width: 46,
              height: 46,
              borderRadius: "50%",
              border: "2px solid #ECA533",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#8a5a12",
              backgroundColor: "rgba(255, 248, 236, 0.9)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow:
                "0 0 0 1px rgba(236, 165, 51, 0.12), 0 4px 14px rgba(236, 165, 51, 0.16), 0 2px 6px rgba(31, 42, 68, 0.06)",
              opacity: showBackToTop ? 0.8 : 0,
              visibility: showBackToTop ? "visible" : "hidden",
              transform: showBackToTop ? "translateY(0) scale(1)" : "translateY(12px) scale(0.92)",
              pointerEvents: showBackToTop ? "auto" : "none",
              transition:
                "opacity 0.3s ease, transform 0.3s ease, box-shadow 0.22s ease, background-color 0.22s ease, border-color 0.22s ease, color 0.22s ease",
              "&:hover": {
                opacity: showBackToTop ? 0.95 : 0,
                backgroundColor: "rgba(255, 243, 220, 0.96)",
                borderColor: "#d9962e",
                color: "#7a4f10",
                boxShadow:
                  "0 0 0 2px rgba(236, 165, 51, 0.18), 0 6px 18px rgba(236, 165, 51, 0.22), 0 3px 8px rgba(31, 42, 68, 0.08)",
                transform: showBackToTop
                  ? "translateY(-1px) scale(1.02)"
                  : "translateY(12px) scale(0.92)",
              },
              "&:active": {
                transform: showBackToTop
                  ? "translateY(0) scale(0.98)"
                  : "translateY(12px) scale(0.92)",
              },
              "&:focus-visible": {
                outline: "2px solid #ECA533",
                outlineOffset: 3,
                opacity: showBackToTop ? 0.95 : 0,
              },
            }}
          >
            <KeyboardArrowUpIcon sx={{ fontSize: 24, opacity: 0.8 }} />
          </Box>
        )}
        <DeferredVitals />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
