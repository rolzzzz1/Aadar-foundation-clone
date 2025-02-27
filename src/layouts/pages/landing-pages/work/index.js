// Material Kit 2 React pages
// import Work from "pages/LandingPages/Work";

import About from "pages/LandingPages/About";

import PropTypes from "prop-types";

export default function WorkPage(props) {
  // return <Work />;

  return (
    <>
      <About isWorkOn={props.isWorkOn} />
      {/* {props.isWorkOn ? "On" : "Off"} */}
    </>
  );
}

// Setting default values for the props of DefaultNavbar
WorkPage.defaultProps = {
  isWorkOn: false,
};

// Typechecking props for the DefaultNavbar
WorkPage.propTypes = {
  isWorkOn: PropTypes.bool,
};
