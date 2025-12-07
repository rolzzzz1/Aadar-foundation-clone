import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";

import MKBox from "components/MKBox";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");
  const open = Boolean(anchorEl);

  const languages = [
    { code: "en", label: "English", nativeLabel: "English" },
    { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  ];

  useEffect(() => {
    setCurrentLanguage(i18n.language || "en");
    document.documentElement.lang = i18n.language || "en";
  }, [i18n.language]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
    handleClose();
  };

  return (
    <MKBox>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          color: "inherit",
          padding: { xs: "4px", sm: "6px", md: "8px" },
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
        aria-label="Select language"
        aria-controls={open ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <LanguageIcon
          sx={{
            fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.3rem", lg: "1.4rem" },
          }}
        />
      </IconButton>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "language-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            minWidth: "140px",
            mt: 1,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={currentLanguage === language.code}
            sx={{
              py: 1,
              px: 2,
              "&.Mui-selected": {
                backgroundColor: "rgba(79, 169, 83, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(79, 169, 83, 0.15)",
                },
              },
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "36px",
                color: currentLanguage === language.code ? "#4FA953" : "inherit",
              }}
            >
              {currentLanguage === language.code && <CheckIcon sx={{ fontSize: "1.2rem" }} />}
            </ListItemIcon>
            <ListItemText
              primary={language.nativeLabel}
              secondary={language.label}
              primaryTypographyProps={{
                fontSize: "0.95rem",
                fontWeight: currentLanguage === language.code ? 600 : 400,
                color: currentLanguage === language.code ? "#4FA953" : "inherit",
              }}
              secondaryTypographyProps={{
                fontSize: "0.75rem",
                color: "text.secondary",
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </MKBox>
  );
};

export default LanguageSelector;
