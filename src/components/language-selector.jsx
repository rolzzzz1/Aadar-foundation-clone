import React from "react";
import { useState, useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import Switch from "@mui/material/Switch";

import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import "./language-selector.css";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  // Inject style tag after Material-UI loads and watch for style injection
  useLayoutEffect(() => {
    if (typeof document === "undefined") return;

    const styleId = "language-selector-inline-css";
    let injectedStyle = document.getElementById(styleId);

    const injectStyle = () => {
      if (injectedStyle) return;

      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        div[data-language-toggle-wrapper] {
          display: flex !important;
          align-items: center !important;
          gap: 0.35rem !important;
          padding: 0px 8px !important;
          transition: all 0.3s ease !important;
          margin-left: -16px !important;
          box-sizing: border-box !important;
        }
        @media (min-width: 600px) {
          div[data-language-toggle-wrapper] {
            gap: 0.5rem !important;
            padding: 0px 10px !important;
          }
        }
        @media (min-width: 960px) {
          div[data-language-toggle-wrapper] {
            gap: 0.65rem !important;
            padding: 1px 12px !important;
          }
        }
      `;
      document.head.appendChild(style);
      injectedStyle = style;
    };

    const applyStyles = () => {
      const wrapper = document.querySelector("[data-language-toggle-wrapper]");
      if (wrapper && typeof window !== "undefined") {
        const width = window.innerWidth;
        wrapper.style.setProperty("display", "flex", "important");
        wrapper.style.setProperty("align-items", "center", "important");
        wrapper.style.setProperty("transition", "all 0.3s ease", "important");
        wrapper.style.setProperty("margin-left", "-16px", "important");
        wrapper.style.setProperty("box-sizing", "border-box", "important");

        if (width < 600) {
          wrapper.style.setProperty("gap", "0.5rem", "important");
          wrapper.style.setProperty("padding", "4px 8px", "important");
        } else if (width < 960) {
          wrapper.style.setProperty("gap", "0.75rem", "important");
          wrapper.style.setProperty("padding", "4px 10px", "important");
        } else {
          wrapper.style.setProperty("gap", "1rem", "important");
          wrapper.style.setProperty("padding", "6px 12px", "important");
        }
      }
    };

    // Watch document head for Material-UI style injection
    const headObserver = new MutationObserver((mutations) => {
      let materialUILoaded = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === 1 &&
            (node.tagName === "STYLE" || node.tagName === "LINK") &&
            (node.getAttribute("data-emotion") ||
              node.getAttribute("data-jss") ||
              node.id?.includes("mui") ||
              node.href?.includes("mui"))
          ) {
            materialUILoaded = true;
          }
        });
      });

      if (materialUILoaded) {
        // Material-UI styles detected, inject our style after them
        setTimeout(() => {
          injectStyle();
          applyStyles();
        }, 10);
      }
    });

    if (document.head) {
      headObserver.observe(document.head, {
        childList: true,
        subtree: false,
      });
    }

    // Inject immediately and also after delay
    injectStyle();
    applyStyles();

    // Apply multiple times to catch timing issues
    const timeouts = [
      setTimeout(() => {
        injectStyle();
        applyStyles();
      }, 0),
      setTimeout(() => {
        injectStyle();
        applyStyles();
      }, 10),
      setTimeout(() => {
        injectStyle();
        applyStyles();
      }, 50),
      setTimeout(() => {
        injectStyle();
        applyStyles();
      }, 100),
      setTimeout(() => {
        injectStyle();
        applyStyles();
      }, 500),
    ];

    if (window.requestAnimationFrame) {
      requestAnimationFrame(() => {
        injectStyle();
        applyStyles();
        requestAnimationFrame(() => {
          injectStyle();
          applyStyles();
        });
      });
    }

    return () => {
      timeouts.forEach(clearTimeout);
      headObserver.disconnect();
    };
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
    <div
      data-language-toggle-wrapper
      style={{
        display: "flex",
        alignItems: "center",
        gap:
          typeof window !== "undefined" && window.innerWidth < 600
            ? "0.35rem"
            : typeof window !== "undefined" && window.innerWidth < 960
            ? "0.5rem"
            : "0.65rem",
        padding:
          typeof window !== "undefined" && window.innerWidth < 600
            ? "0px 8px"
            : typeof window !== "undefined" && window.innerWidth < 960
            ? "0px 10px"
            : "1px 12px",
        transition: "all 0.3s ease",
        marginLeft: "-16px",
        boxSizing: "border-box",
      }}
      ref={(el) => {
        if (el && typeof window !== "undefined") {
          const applyStyles = () => {
            if (!el) return;
            const width = window.innerWidth || (window.screen && window.screen.width) || 1920;
            el.style.setProperty("display", "flex", "important");
            el.style.setProperty("align-items", "center", "important");
            el.style.setProperty("margin-left", "-16px", "important");
            el.style.setProperty("transition", "all 0.3s ease", "important");
            el.style.setProperty("box-sizing", "border-box", "important");
            if (width < 600) {
              el.style.setProperty("gap", "0.35rem", "important");
              el.style.setProperty("padding", "0px 8px", "important");
            } else if (width < 960) {
              el.style.setProperty("gap", "0.5rem", "important");
              el.style.setProperty("padding", "0px 10px", "important");
            } else {
              el.style.setProperty("gap", "0.65rem", "important");
              el.style.setProperty("padding", "1px 12px", "important");
            }
          };

          // Apply immediately
          applyStyles();

          // Watch for style changes
          const observer = new MutationObserver(() => {
            applyStyles();
          });
          observer.observe(el, {
            attributes: true,
            attributeFilter: ["style", "class"],
            childList: false,
            subtree: false,
          });

          // Apply multiple times
          setTimeout(applyStyles, 0);
          setTimeout(applyStyles, 10);
          setTimeout(applyStyles, 50);
          setTimeout(applyStyles, 100);
          setTimeout(applyStyles, 500);

          // Continuous monitoring for first 5 seconds
          const interval = setInterval(applyStyles, 100);
          setTimeout(() => clearInterval(interval), 5000);

          if (window.requestAnimationFrame) {
            requestAnimationFrame(() => {
              applyStyles();
              requestAnimationFrame(applyStyles);
            });
          }
        }
      }}
    >
      <MKBox className="btn-container" data-language-selector="true" ml={-2}>
        <MKTypography
          variant="button"
          fontWeight={!checked ? "600" : "400"}
          fontSize={{ xs: "0.65rem", sm: "0.6rem", md: "0.6rem", lg: "0.65rem" }}
          ml={1}
          sx={{
            cursor: "pointer",
            userSelect: "none",
            margin: 0,
            color: !checked ? "#4FA953" : "#757575",
            transition: "all 0.3s ease",
            padding: { xs: "1px 3px", sm: "1px 4px", md: "2px 6px" },
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
            py: 0.3,
            transform: { xs: "scale(0.85)", sm: "scale(0.8)", md: "scale(0.75)" },
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
              width: "16px",
              height: "16px",
            },
            "& .MuiSwitch-track": {
              backgroundColor: "#bdbdbd",
              opacity: 1,
              width: "32px",
              height: "18px",
              "&.Mui-checked": {
                backgroundColor: "#4FA953",
                opacity: 1,
              },
            },
          }}
        />
        <MKTypography
          variant="button"
          fontWeight={checked ? "500" : "500"}
          fontSize={{ xs: "0.65rem", sm: "0.6rem", md: "0.6rem", lg: "0.65rem" }}
          ml={1}
          sx={{
            cursor: "pointer",
            userSelect: "none",
            margin: 0,
            color: checked ? "#4FA953" : "rgba(117, 117, 117, 0.7)",
            opacity: checked ? 1 : 0.75,
            transition: "all 0.3s ease",
            padding: { xs: "1px 3px", sm: "1px 4px", md: "2px 6px" },
            borderRadius: "4px",
            backgroundColor: checked ? "rgba(79, 169, 83, 0.1)" : "transparent",
            "&:hover": {
              color: checked ? "#3d8a41" : "rgba(66, 66, 66, 0.8)",
              opacity: 1,
              backgroundColor: checked ? "rgba(79, 169, 83, 0.15)" : "rgba(0, 0, 0, 0.05)",
            },
          }}
          onClick={toggleSwitch}
        >
          हिन्दी
        </MKTypography>
      </MKBox>
    </div>
  );
};

export default LanguageSelector;
