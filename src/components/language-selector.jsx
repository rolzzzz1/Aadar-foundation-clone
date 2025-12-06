import React from "react";
import { useState, useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import Switch from "@mui/material/Switch";

import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  // Inject critical CSS into document head immediately (runs before render)
  useLayoutEffect(() => {
    if (typeof document !== "undefined") {
      // Check if style already exists
      const existingStyle = document.getElementById("language-selector-critical-css");
      if (existingStyle) {
        return;
      }

      const style = document.createElement("style");
      style.id = "language-selector-critical-css";
      style.textContent = `
        .btn-container,
        [data-language-selector="true"] {
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          padding: 4px 8px !important;
          transition: all 0.3s ease !important;
          margin-left: -16px !important;
        }
        @media (min-width: 600px) {
          .btn-container,
          [data-language-selector="true"] {
            gap: 0.75rem !important;
            padding: 4px 10px !important;
          }
        }
        @media (min-width: 960px) {
          .btn-container,
          [data-language-selector="true"] {
            gap: 1rem !important;
            padding: 6px 12px !important;
          }
        }
      `;
      // Insert at the beginning of head to ensure it loads first
      document.head.insertBefore(style, document.head.firstChild);
    }
  }, []);

  useEffect(() => {
    // document.body.dir = i18n.dir();
    if (i18n.language === "hi") {
      setChecked(true);
      document.documentElement.lang = "hi";
    } else {
      setChecked(false);
      document.documentElement.lang = "en";
    }
  }, [i18n, i18n.language]);

  // Re-apply critical styles synchronously before paint (useLayoutEffect runs before useEffect)
  useLayoutEffect(() => {
    const applyStyles = () => {
      const container = document.querySelector(".btn-container, [data-language-selector='true']");
      if (container && typeof window !== "undefined") {
        const width = window.innerWidth;
        // Use CSSStyleDeclaration.setProperty with important flag
        container.style.setProperty("display", "flex", "important");
        container.style.setProperty("align-items", "center", "important");
        container.style.setProperty("transition", "all 0.3s ease", "important");
        container.style.setProperty("margin-left", "-16px", "important");

        if (width < 600) {
          container.style.setProperty("gap", "0.5rem", "important");
          container.style.setProperty("padding", "4px 8px", "important");
        } else if (width < 960) {
          container.style.setProperty("gap", "0.75rem", "important");
          container.style.setProperty("padding", "4px 10px", "important");
        } else {
          container.style.setProperty("gap", "1rem", "important");
          container.style.setProperty("padding", "6px 12px", "important");
        }
      }
    };

    // Apply immediately (synchronously before paint)
    applyStyles();
  }, []);

  // Also use useEffect for additional re-application after paint
  useEffect(() => {
    const applyStyles = () => {
      const container = document.querySelector(".btn-container, [data-language-selector='true']");
      if (container && typeof window !== "undefined") {
        const width = window.innerWidth;
        container.style.setProperty("display", "flex", "important");
        container.style.setProperty("align-items", "center", "important");
        container.style.setProperty("transition", "all 0.3s ease", "important");
        container.style.setProperty("margin-left", "-16px", "important");

        if (width < 600) {
          container.style.setProperty("gap", "0.5rem", "important");
          container.style.setProperty("padding", "4px 8px", "important");
        } else if (width < 960) {
          container.style.setProperty("gap", "0.75rem", "important");
          container.style.setProperty("padding", "4px 10px", "important");
        } else {
          container.style.setProperty("gap", "1rem", "important");
          container.style.setProperty("padding", "6px 12px", "important");
        }
      }
    };

    // Watch for Material-UI JSS style injections and re-apply our styles
    const styleObserver = new MutationObserver(() => {
      applyStyles();
    });

    // Watch the document head for new style tags (Material-UI injects JSS here)
    if (document.head) {
      styleObserver.observe(document.head, {
        childList: true,
        subtree: false,
      });
    }

    // Apply immediately
    applyStyles();

    // Apply multiple times to catch any timing issues
    const timeouts = [
      setTimeout(applyStyles, 0),
      setTimeout(applyStyles, 50),
      setTimeout(applyStyles, 100),
      setTimeout(applyStyles, 200),
      setTimeout(applyStyles, 500),
      setTimeout(applyStyles, 1000),
    ];

    // Use requestAnimationFrame multiple times
    if (window.requestAnimationFrame) {
      requestAnimationFrame(() => {
        applyStyles();
        requestAnimationFrame(() => {
          applyStyles();
          requestAnimationFrame(applyStyles);
        });
      });
    }

    // Aggressively re-apply styles for the first 2 seconds after mount
    const interval = setInterval(applyStyles, 100);
    const clearIntervalTimeout = setTimeout(() => {
      clearInterval(interval);
    }, 2000);

    // Watch for window resize
    const handleResize = () => {
      applyStyles();
    };
    window.addEventListener("resize", handleResize);

    // Use MutationObserver to watch for style changes and re-apply
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "style" || mutation.attributeName === "class")
        ) {
          applyStyles();
        }
        // Also watch for child nodes being added
        if (mutation.type === "childList") {
          applyStyles();
        }
      });
    });

    const container = document.querySelector(".btn-container, [data-language-selector='true']");
    if (container) {
      observer.observe(container, {
        attributes: true,
        attributeFilter: ["style", "class"],
        childList: true,
        subtree: false,
      });
    }

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(clearIntervalTimeout);
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      styleObserver.disconnect();
    };
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const [checked, setChecked] = useState(false);

  const toggleSwitch = () => {
    setChecked(!checked);

    if (!checked) {
      changeLanguage("hi");
    } else {
      changeLanguage("en");
    }
  };

  return (
    <MKBox
      className="btn-container"
      data-language-selector="true"
      ml={-2}
      ref={(el) => {
        // Directly set styles on DOM element immediately when created
        // This happens before Material-UI can override them
        if (el && typeof window !== "undefined") {
          const element = el;
          // Use setProperty with important flag to override any existing styles
          element.style.setProperty("display", "flex", "important");
          element.style.setProperty("align-items", "center", "important");
          element.style.setProperty("margin-left", "-16px", "important");
          element.style.setProperty("transition", "all 0.3s ease", "important");
          // Set responsive gap and padding based on screen size
          const width = window.innerWidth;
          if (width < 600) {
            element.style.setProperty("gap", "0.5rem", "important");
            element.style.setProperty("padding", "4px 8px", "important");
          } else if (width < 960) {
            element.style.setProperty("gap", "0.75rem", "important");
            element.style.setProperty("padding", "4px 10px", "important");
          } else {
            element.style.setProperty("gap", "1rem", "important");
            element.style.setProperty("padding", "6px 12px", "important");
          }
          // Re-apply after a microtask to ensure it sticks
          Promise.resolve().then(() => {
            if (element && element.parentNode) {
              element.style.setProperty("display", "flex", "important");
              element.style.setProperty("align-items", "center", "important");
              element.style.setProperty("margin-left", "-16px", "important");
            }
          });
        }
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap:
          typeof window !== "undefined" && window.innerWidth < 600
            ? "0.5rem"
            : typeof window !== "undefined" && window.innerWidth < 960
            ? "0.75rem"
            : "1rem",
        padding:
          typeof window !== "undefined" && window.innerWidth < 600
            ? "4px 8px"
            : typeof window !== "undefined" && window.innerWidth < 960
            ? "4px 10px"
            : "6px 12px",
        transition: "all 0.3s ease",
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 0.5, sm: 0.75, md: 1 },
        padding: { xs: "4px 8px", sm: "4px 10px", md: "6px 12px" },
        transition: "all 0.3s ease",
      }}
    >
      <MKTypography
        variant="button"
        fontWeight={!checked ? "600" : "400"}
        fontSize={{ xs: "0.8rem", sm: "0.75rem", md: "0.75rem", lg: "0.8rem" }}
        ml={1}
        sx={{
          cursor: "pointer",
          userSelect: "none",
          margin: 0,
          color: !checked ? "#4FA953" : "#757575",
          transition: "all 0.3s ease",
          padding: { xs: "2px 4px", sm: "2px 6px", md: "3px 8px" },
          borderRadius: "4px",
          backgroundColor: !checked ? "rgba(79, 169, 83, 0.1)" : "transparent",
          "&:hover": {
            color: !checked ? "#3d8a41" : "#424242",
            backgroundColor: !checked ? "rgba(79, 169, 83, 0.15)" : "rgba(0, 0, 0, 0.05)",
          },
        }}
        onClick={toggleSwitch}
      >
        English
      </MKTypography>
      <Switch
        size="small"
        checked={checked}
        onChange={toggleSwitch}
        sx={{
          py: 0.6,
          transform: { xs: "scale(1.1)", sm: "scale(1.05)", md: "scale(1)" },
          "& .MuiSwitch-switchBase": {
            "&.Mui-checked": {
              color: "#4FA953",
              "&:hover": {
                backgroundColor: "rgba(79, 169, 83, 0.1)",
              },
            },
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            },
          },
          "& .MuiSwitch-thumb": {
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          },
          "& .MuiSwitch-track": {
            backgroundColor: "#bdbdbd",
            opacity: 1,
            "&.Mui-checked": {
              backgroundColor: "#4FA953",
              opacity: 1,
            },
          },
        }}
      />
      <MKTypography
        variant="button"
        fontWeight={checked ? "600" : "400"}
        fontSize={{ xs: "0.8rem", sm: "0.75rem", md: "0.75rem", lg: "0.8rem" }}
        ml={1}
        sx={{
          cursor: "pointer",
          userSelect: "none",
          margin: 0,
          color: checked ? "#4FA953" : "#757575",
          transition: "all 0.3s ease",
          padding: { xs: "2px 4px", sm: "2px 6px", md: "3px 8px" },
          borderRadius: "4px",
          backgroundColor: checked ? "rgba(79, 169, 83, 0.1)" : "transparent",
          "&:hover": {
            color: checked ? "#3d8a41" : "#424242",
            backgroundColor: checked ? "rgba(79, 169, 83, 0.15)" : "rgba(0, 0, 0, 0.05)",
          },
        }}
        onClick={toggleSwitch}
      >
        हिन्दी
      </MKTypography>
    </MKBox>
  );
};

export default LanguageSelector;
