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
    } else {
      setChecked(false);
    }
  }, [i18n, i18n.language]);

  console.log(i18n.language);

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
        English
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
        हिन्दी
      </MKTypography>
    </MKBox>
  );
};

export default LanguageSelector;
