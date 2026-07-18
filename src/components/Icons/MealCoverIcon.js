import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

// Custom filled icon: a covered dish / cloche with a shine highlight, sitting on
// a serving plate — used for the "Lunch / Dinner" and "Full Day Meals" pricing
// cards on the Donate2 page (matches a supplied reference icon).
function MealCoverIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M2 18.5a1.5 1.5 0 0 1 1.5-1.5h17a1.5 1.5 0 0 1 0 3h-17A1.5 1.5 0 0 1 2 18.5z"
      />
      <path fill="currentColor" d="M4.2 16.3a7.8 7.8 0 0 1 15.6 0z" />
      <circle cx="12" cy="6" r="1.4" fill="currentColor" />
      <path
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinecap="round"
        d="M7.6 13.6c.7-2.7 2.6-4.5 5-4.9"
      />
    </SvgIcon>
  );
}

export default MealCoverIcon;
