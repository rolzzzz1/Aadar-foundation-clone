// import { forwardRef } from "react";

import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";

// prop-types is a library for typechecking of props
// import PropTypes from "prop-types";

// Custom styles for MKBox
// import MKBoxRoot from "components/MKBox/MKBoxRoot";

function Item(props) {
  return (
    <Paper>
      <h2>{props.item.name}</h2>
      <p>{props.description}</p>

      <Button className="CheckButton">Check it out!</Button>
    </Paper>
  );
}

export default function MKCarousel() {
  var items = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
    },
  ];

  return (
    <Carousel>
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
}

// Setting default values for the props of MKBox
// MKCarousel.defaultProps = {
//   variant: "contained",
//   bgColor: "transparent",
//   color: "dark",
//   opacity: 1,
//   borderRadius: "none",
//   shadow: "none",
//   coloredShadow: "none",
// };

// Typechecking props for the MKBox
// MKCarousel.propTypes = {
//   variant: PropTypes.oneOf(["contained", "gradient"]),
//   bgColor: PropTypes.string,
//   color: PropTypes.string,
//   opacity: PropTypes.number,
//   borderRadius: PropTypes.string,
//   shadow: PropTypes.string,
//   coloredShadow: PropTypes.oneOf([
//     "primary",
//     "secondary",
//     "info",
//     "success",
//     "warning",
//     "error",
//     "light",
//     "dark",
//     "none",
//   ]),
// };

// export default MKCarousel;
