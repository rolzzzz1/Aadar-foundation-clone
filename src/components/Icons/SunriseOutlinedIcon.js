import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

// Custom outlined icon: a rising sun with rays over gentle waves — used for the
// "Breakfast" pricing card on the Donate2 page (matches a supplied reference icon).
function SunriseOutlinedIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2.25v2.1" />
        <path d="M5.4 4.9l1.5 1.5" />
        <path d="M18.6 4.9l-1.5 1.5" />
        <path d="M2.25 12.5h2.1" />
        <path d="M19.65 12.5h2.1" />
        <path d="M4.3 17.2l1.7-1.3" />
        <path d="M19.7 17.2l-1.7-1.3" />
        <path d="M6 12.5a6 6 0 0 1 12 0" />
        <path d="M2.25 15.6c1.7 1.05 3.55 1.05 5.25 0s3.55-1.05 5.25 0 3.55 1.05 5.25 0" />
        <path d="M4.2 20.1c1.7 1.05 3.55 1.05 5.25 0s3.55-1.05 5.25 0" />
      </g>
    </SvgIcon>
  );
}

export default SunriseOutlinedIcon;
