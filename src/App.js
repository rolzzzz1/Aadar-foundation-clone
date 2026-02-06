import React, { useEffect, useState } from "react";
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
// Image watermarking
import { watermarkAllImages, setupWatermarkObserver } from "utils/imageWatermark";

// Import Home directly (not lazy) since it's the main page and should load fast
import Home from "layouts/pages/home";

// Material Kit 2 React routes
import routes from "routes";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Typography from "@mui/material/Typography";

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
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Show back-to-top button when user has scrolled down
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY ?? document.documentElement?.scrollTop ?? document.body?.scrollTop ?? 0;
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

  // Setup image protection
  useEffect(() => {
    // Add CSS protection
    addImageProtectionCSS();

    // Setup event listeners for image protection
    const cleanup = setupImageProtection();

    // Cleanup on unmount
    return cleanup;
  }, []);

  // Apply watermarks to all images (optimized - only run once on mount)
  // Deferred to avoid blocking initial render
  useEffect(() => {
    const watermarkOptions = {
      opacity: 0.05, // Very low opacity for invisible watermark
      scale: 0.25, // 25% of image size
      position: "center", // Center position
      repeat: false, // Single watermark
    };

    // Setup observer for dynamically added images
    const cleanupObserver = setupWatermarkObserver(watermarkOptions);

    // Apply watermarks to existing images - deferred using requestIdleCallback
    const applyWatermarks = async () => {
      const apply = () => {
        watermarkAllImages(watermarkOptions);
      };

      // Use requestIdleCallback to defer watermarking until browser is idle
      if ("requestIdleCallback" in window) {
        if (document.readyState === "complete") {
          requestIdleCallback(apply, { timeout: 2000 });
        } else {
          const handleLoad = () => {
            requestIdleCallback(apply, { timeout: 2000 });
            window.removeEventListener("load", handleLoad);
          };
          window.addEventListener("load", handleLoad);
        }
      } else {
        // Fallback for browsers without requestIdleCallback
        if (document.readyState === "complete") {
          setTimeout(apply, 1000);
        } else {
          const handleLoad = () => {
            setTimeout(apply, 1000);
            window.removeEventListener("load", handleLoad);
          };
          window.addEventListener("load", handleLoad);
        }
      }
    };

    applyWatermarks();

    // Cleanup observer on unmount
    return cleanupObserver;
  }, []); // Only run once on mount, not on every pathname change

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
        <Analytics />
        <SpeedInsights />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
