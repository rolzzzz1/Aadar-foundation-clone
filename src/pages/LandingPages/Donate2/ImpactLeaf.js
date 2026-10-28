import PropTypes from "prop-types";
import MKBox from "components/MKBox";

function ImpactLeaf({ mirrored = false }) {
  return (
    <MKBox
      component="svg"
      viewBox="0 0 34 28"
      aria-hidden="true"
      sx={{
        width: { xs: 25, sm: 28 },
        height: { xs: 21, sm: 24 },
        flexShrink: 0,
        overflow: "visible",
        transform: mirrored ? "scaleX(-1)" : "none",
        filter: "drop-shadow(0 2px 2px rgba(46, 125, 50, 0.14))",
      }}
    >
      <path
        d="M4 23c6.5-1.5 12.2-5.5 17-12"
        fill="none"
        stroke="#388e3c"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M11.5 18.5C6.1 18.6 3.1 15.8 3 11.2c5.2-.5 8.2 2.2 8.5 7.3Z"
        fill="#78c67c"
        stroke="#388e3c"
        strokeWidth="0.8"
      />
      <path
        d="M17.2 14.3c-1.2-5 1.1-8.5 5.7-9.6 1.5 4.9-.8 8.4-5.7 9.6Z"
        fill="#4FA953"
        stroke="#2e7d32"
        strokeWidth="0.8"
      />
      <path
        d="M21.2 10.8c2.4-4.5 6.1-5.9 10.3-3.7-1.9 4.8-5.7 6.1-10.3 3.7Z"
        fill="#94d397"
        stroke="#388e3c"
        strokeWidth="0.8"
      />
      <circle cx="4" cy="23" r="1.6" fill="#ECA533" />
    </MKBox>
  );
}

ImpactLeaf.propTypes = {
  mirrored: PropTypes.bool,
};

export default ImpactLeaf;
