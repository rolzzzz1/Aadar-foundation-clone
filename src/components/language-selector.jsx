import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Switch from "@mui/material/Switch";

import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

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
    <MKBox className="btn-container" ml={-2}>
      <MKTypography
        variant="button"
        fontWeight="700"
        fontSize="0.7rem"
        ml={1}
        sx={{ cursor: "pointer", userSelect: "none", margin: 0, color: "#344767" }}
        onClick={toggleSwitch}
      >
        Eng
      </MKTypography>
      <Switch size="small" checked={checked} onChange={toggleSwitch} sx={{ py: 0.6 }} />
      <MKTypography
        variant="button"
        fontWeight="700"
        fontSize="0.7rem"
        ml={1}
        sx={{ cursor: "pointer", userSelect: "none", margin: 0, color: "#344767" }}
        onClick={toggleSwitch}
      >
        हिं
      </MKTypography>
    </MKBox>
  );
};

export default LanguageSelector;
