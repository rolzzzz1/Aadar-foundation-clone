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
          minWidth: { xs: "85px", sm: "90px", md: "95px" },
          height: { xs: "26px", sm: "28px", md: "30px" },
          padding: { xs: "2px 10px", sm: "3px 12px", md: "4px 14px" },
          fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
          fontWeight: 600,
          textTransform: "none",
          borderRadius: "25px",
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
