import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import LanguageIcon from "@mui/icons-material/Language";

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
        height: { xs: "16px", sm: "18px", md: "20px" },
        lineHeight: 1,
      }}
    >
      <Button
        onClick={handleToggle}
        variant="text"
        disableRipple
        disableFocusRipple
        sx={{
          minWidth: "auto",
          height: "auto",
          padding: { xs: "4px 4px", sm: "5px 5px", md: "6px 6px" },
          fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
          fontWeight: 400,
          textTransform: "none",
          borderRadius: 0,
          border: "none",
          color: "rgba(0, 0, 0, 0.35) !important",
          backgroundColor: "transparent !important",
          display: "flex",
          alignItems: "center",
          gap: { xs: "4px", sm: "5px", md: "6px" },
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "transparent !important",
            color: "rgba(0, 0, 0, 0.5) !important",
            opacity: 1,
          },
          "&:active": {
            backgroundColor: "transparent !important",
            transform: "none",
          },
          "&:focus": {
            outline: "none",
            boxShadow: "none",
          },
          "&.MuiButton-root": {
            color: "rgba(0, 0, 0, 0.35) !important",
          },
          "& .MuiTouchRipple-root": {
            display: "none",
          },
        }}
      >
        <LanguageIcon
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
          }}
        />
        {currentLanguage === "en" ? "हिन्दी" : "English"}
      </Button>
    </MKBox>
  );
};

export default LanguageSelector;
