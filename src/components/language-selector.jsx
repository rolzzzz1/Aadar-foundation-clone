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
    <MKBox>
      <Button
        onClick={handleToggle}
        variant="outlined"
        sx={{
          minWidth: { xs: "100px", sm: "110px", md: "120px" },
          height: { xs: "32px", sm: "36px", md: "40px" },
          padding: { xs: "4px 12px", sm: "6px 16px", md: "8px 20px" },
          fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
          fontWeight: 600,
          textTransform: "none",
          borderRadius: "20px",
          borderColor: "#4FA953",
          color: currentLanguage === "en" ? "#4FA953" : "#fff",
          backgroundColor: currentLanguage === "en" ? "transparent" : "#4FA953",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: currentLanguage === "en" ? "#3d8a41" : "#3d8a41",
            backgroundColor: currentLanguage === "en" ? "rgba(79, 169, 83, 0.1)" : "#3d8a41",
            color: currentLanguage === "en" ? "#3d8a41" : "#fff",
          },
        }}
      >
        {currentLanguage === "en" ? "English" : "हिन्दी"}
      </Button>
    </MKBox>
  );
};

export default LanguageSelector;
