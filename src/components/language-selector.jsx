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
          minWidth: { xs: "80px", sm: "85px", md: "90px" },
          height: { xs: "24px", sm: "26px", md: "28px" },
          padding: { xs: "2px 8px", sm: "2px 10px", md: "3px 12px" },
          fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.65rem" },
          fontWeight: 600,
          textTransform: "none",
          borderRadius: "30px",
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
