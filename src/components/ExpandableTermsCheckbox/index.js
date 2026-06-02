import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const termsCheckboxUncheckedIcon = (
  <Box
    className="terms-checkbox-box"
    sx={{
      width: 20,
      height: 20,
      borderRadius: "3px",
      border: "1.5px solid #9ca3af",
      bgcolor: "#fff",
      boxSizing: "border-box",
      flexShrink: 0,
    }}
  />
);

const termsCheckboxCheckedIcon = <CheckBoxIcon sx={{ fontSize: 22, color: "#1976d2" }} />;

const labelSx = {
  color: "rgba(31, 42, 68, 0.78)",
  lineHeight: 1.55,
  fontSize: "0.78rem",
};

/**
 * Checkbox with collapsible terms text and Read more / Read less toggle.
 */
export default function ExpandableTermsCheckbox({
  checked,
  onChange,
  summary,
  details,
  defaultExpanded = false,
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpand = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <FormControlLabel
      sx={{
        mt: 0,
        mx: 0,
        mb: 1.25,
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "row",
      }}
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          icon={termsCheckboxUncheckedIcon}
          checkedIcon={termsCheckboxCheckedIcon}
          sx={{ p: 0.5, mr: 0.75, mt: 0.15 }}
        />
      }
      label={
        <Box component="span" sx={{ display: "block", textAlign: "left" }}>
          <Typography variant="body2" component="span" sx={labelSx}>
            {expanded ? details : summary}
          </Typography>{" "}
          <Link
            component="button"
            type="button"
            onClick={toggleExpand}
            underline="always"
            sx={{
              fontWeight: 600,
              color: "#1565c0",
              fontSize: "0.78rem",
              verticalAlign: "baseline",
              p: 0,
              border: 0,
              bgcolor: "transparent",
              cursor: "pointer",
            }}
          >
            {expanded
              ? t("donationForm.readLess", "Read Less")
              : t("donationForm.readMore", "Read More")}
          </Link>
        </Box>
      }
    />
  );
}

ExpandableTermsCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  summary: PropTypes.node.isRequired,
  details: PropTypes.node.isRequired,
  defaultExpanded: PropTypes.bool,
};
