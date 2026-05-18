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

import Typography from "@mui/material/Typography";

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
          }}
        >
          <Typography variant="h5" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {this.state.error?.message || "An unexpected error occurred"}
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

  // Show back-to-top button when user has scrolled down
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.scrollY ?? document.documentElement?.scrollTop ?? document.body?.scrollTop ?? 0;
      setShowBackToTop(scrollTop > 100);
    };
    const target = document.scrollingElement || document.documentElement || document.body;
    target.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => target.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          {/* Hidden test route (not in navbar) */}
          <Route
            path="/__razorpay-test"
            element={
              <Suspense fallback={null}>
                <RazorpayTest />
              </Suspense>
            }
          />
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
          {/* Hidden duplicate donate page (not in navbar) */}
          <Route
            path="/pages/landing-pages/donate2"
            element={
              <Suspense fallback={null}>
                <Donate2 />
              </Suspense>
            }
          />
          {/* Short alias so /donate2 also resolves to the hidden page */}
          <Route path="/donate2" element={<Navigate to="/pages/landing-pages/donate2" replace />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
        <Box
          component="button"
          role="button"
          aria-label="Back to top"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 9999,
            display: showBackToTop ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            minWidth: 48,
            height: 48,
            px: 1.5,
            borderRadius: "24px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#4FA953",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: 600,
            fontFamily: "inherit",
            boxShadow: "0 4px 14px rgba(79, 169, 83, 0.4)",
            transition: "opacity 0.2s, box-shadow 0.2s, background-color 0.2s",
            "&:hover": {
              backgroundColor: "#45a049",
              boxShadow: "0 6px 20px rgba(79, 169, 83, 0.5)",
            },
          }}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: 26 }} />
          <Box component="span" sx={{ whiteSpace: "nowrap" }}>
            ⬆️ Back To Top
          </Box>
        </Box>
        <DeferredVitals />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
