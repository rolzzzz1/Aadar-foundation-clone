import { useEffect, Suspense, lazy } from "react";
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

// Lazy load routes for code splitting
const Home = lazy(() => import("layouts/pages/home"));

// Material Kit 2 React routes
import routes from "routes";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

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
  );
}
