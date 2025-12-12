import React, { useEffect, Suspense, lazy } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// Material Kit 2 React themes
import theme from "assets/theme";

// Image protection utilities
import { setupImageProtection, addImageProtectionCSS } from "utils/imageProtection";
// Image watermarking
import { watermarkAllImages, setupWatermarkObserver } from "utils/imageWatermark";

// Lazy load routes for code splitting
const Home = lazy(() => import("layouts/pages/home"));

// Material Kit 2 React routes
import routes from "routes";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Typography from "@mui/material/Typography";

// Loading component
const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
    }}
  >
    <CircularProgress />
  </Box>
);

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

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Set HTML lang attribute based on current language
  useEffect(() => {
    document.documentElement.lang = i18n.language || "en";
  }, [i18n.language]);

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
  useEffect(() => {
    const watermarkOptions = {
      opacity: 0.05, // Very low opacity for invisible watermark
      scale: 0.25, // 25% of image size
      position: "center", // Center position
      repeat: false, // Single watermark
    };

    // Setup observer for dynamically added images
    const cleanupObserver = setupWatermarkObserver(watermarkOptions);

    // Apply watermarks to existing images - only once after initial load
    const applyWatermarks = async () => {
      // Wait for images to load
      if (document.readyState === "complete") {
        // Reduced delay for faster initial load
        setTimeout(() => {
          watermarkAllImages(watermarkOptions);
        }, 800);
      } else {
        const handleLoad = () => {
          setTimeout(() => {
            watermarkAllImages(watermarkOptions);
          }, 800);
          window.removeEventListener("load", handleLoad);
        };
        window.addEventListener("load", handleLoad);
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
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {getRoutes(routes)}
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </Suspense>
        <Analytics />
        <SpeedInsights />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
