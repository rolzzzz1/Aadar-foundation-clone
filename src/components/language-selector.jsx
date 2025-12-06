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
      sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 0.75, md: 1 } }}
    >
      <MKTypography
        variant="button"
        fontWeight={{ xs: "500", sm: "500", md: "400" }}
        fontSize={{ xs: "0.8rem", sm: "0.75rem", md: "0.75rem", lg: "0.8rem" }}
        ml={1}
        sx={{
          cursor: "pointer",
          userSelect: "none",
          margin: 0,
          color: "#1a237e",
          transition: "all 0.2s ease",
          "&:hover": {
            color: "#0d47a1",
            fontWeight: "600",
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
            },
          },
          "& .MuiSwitch-track": {
            backgroundColor: "#bdbdbd",
            "&.Mui-checked": {
              backgroundColor: "#4FA953",
            },
          },
        }}
      />
      <MKTypography
        variant="button"
        fontWeight={{ xs: "500", sm: "500", md: "400" }}
        fontSize={{ xs: "0.8rem", sm: "0.75rem", md: "0.75rem", lg: "0.8rem" }}
        ml={1}
        sx={{
          cursor: "pointer",
          userSelect: "none",
          margin: 0,
          color: "#1a237e",
          transition: "all 0.2s ease",
          "&:hover": {
            color: "#0d47a1",
            fontWeight: "600",
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
