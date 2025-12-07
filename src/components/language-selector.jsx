import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";

import MKBox from "components/MKBox";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");

  useEffect(() => {
    setCurrentLanguage(i18n.language || "en");
    document.documentElement.lang = i18n.language || "en";
  }, [i18n.language]);

  const handleToggle = () => {
    const newLanguage = currentLanguage === "en" ? "hi" : "en";
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  return (
    <MKBox
      sx={{
        display: "flex",
        alignItems: "center",
        height: { xs: "18px", sm: "20px", md: "22px" },
        lineHeight: 1,
      }}
    >
      <Button
        onClick={handleToggle}
        variant="text"
          sx={{
          minWidth: "auto",
          height: "auto",
          padding: { xs: "2px 4px", sm: "2px 6px", md: "4px 8px" },
          fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
          fontWeight: 400,
          textTransform: "none",
          borderRadius: 0,
          border: "none",
          color: "inherit",
          backgroundColor: "transparent",
          textDecoration: "underline",
          textDecorationColor: "rgba(0, 0, 0, 0.4)",
          textUnderlineOffset: "3px",
          transition: "all 0.2s ease",
            "&:hover": {
            backgroundColor: "transparent",
            textDecorationColor: "currentColor",
            opacity: 0.8,
          },
        }}
      >
        {currentLanguage === "en" ? "हिन्दी" : "English"}
      </Button>
      </MKBox>
  );
};

export default LanguageSelector;
