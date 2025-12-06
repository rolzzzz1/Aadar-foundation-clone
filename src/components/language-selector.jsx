import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Switch from "@mui/material/Switch";

import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

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
      ml={-2}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 0.5, sm: 0.75, md: 1 },
        padding: { xs: "4px 8px", sm: "4px 10px", md: "6px 12px" },
        borderRadius: "8px",
        backgroundColor: "#ffffff !important",
        border: "2px solid #4FA953 !important",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(79, 169, 83, 0.2) !important",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(79, 169, 83, 0.4) !important",
          borderColor: "#4FA953 !important",
          backgroundColor: "#ffffff !important",
        },
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
