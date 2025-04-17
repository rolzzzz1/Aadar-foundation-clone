import "react-international-phone/style.css";

import { useTranslation } from "react-i18next";

import { InputAdornment, MenuItem, Select, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";

import Icon from "@mui/material/Icon";
import MKBox from "components/MKBox";

export const MKPhone = ({ value, onChange, ...restProps }) => {
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
    defaultCountry: "in",
    value,
    countries: defaultCountries,
    onChange: (data) => {
      onChange(data.phone, data.country);
    },
  });

  const { t } = useTranslation();
  const volunteerPage = t("volunteerPage");

  return (
    <TextField
      variant="outlined"
      label={volunteerPage.formLabels.phoneNumber}
      color="primary"
      placeholder="Phone number"
      value={inputValue}
      onChange={handlePhoneValueChange}
      type="tel"
      style={{ width: "100%" }}
      inputRef={inputRef}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" style={{ marginRight: "2px", marginLeft: "-8px" }}>
            <Select
              MenuProps={{
                style: {
                  height: "300px",
                  width: "360px",
                  top: "10px",
                  left: "-34px",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
              }}
              sx={{
                width: "max-content",
                // Remove default outline (display only on focus)
                fieldset: {
                  display: "none",
                },
                '&.Mui-focused:has(div[aria-expanded="false"])': {
                  fieldset: {
                    display: "none",
                  },
                },
                // Update default spacing
                ".MuiSelect-select": {
                  padding: "8px",
                  paddingRight: "8px !important",
                },
                svg: {
                  right: 0,
                },
              }}
              value={country.iso2}
              onChange={(e) => setCountry(e.target.value)}
              renderValue={(value) => {
                return (
                  <>
                    <MKBox display="flex" justifyContent="space-evenly" alignItems="center">
                      <FlagImage iso2={value} />
                      <Icon
                        fontSize="small"

                        // sx={{ fontWeight: "normal", verticalAlign: "middle", mr: -0.5 }}
                      >
                        keyboard_arrow_down
                      </Icon>
                    </MKBox>
                  </>
                );
              }}
            >
              {defaultCountries.map((c) => {
                const country = parseCountry(c);
                return (
                  <MenuItem key={country.iso2} value={country.iso2} style={{ width: "70%" }}>
                    <FlagImage iso2={country.iso2} style={{ marginRight: "8px" }} />
                    <Typography marginRight="8px" style={{ fontSize: "14px" }}>
                      {country.name}
                    </Typography>
                    <Typography color="gray" style={{ fontSize: "14px" }}>
                      +{country.dialCode}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </InputAdornment>
        ),
      }}
      {...restProps}
    />
  );
};

// Setting default values for the props of MKInput
MKPhone.defaultProps = {
  value: "",
};

// Typechecking props for the MKInput
MKPhone.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};
