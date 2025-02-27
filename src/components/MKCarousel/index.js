// import { forwardRef } from "react";

import React from "react";
import Carousel from "react-material-ui-carousel";
// import { Paper } from "@mui/material";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for MKBox
// import MKBox from "components/MKBox";
// import MKTypography from "components/MKTypography";
// import MuiLink from "@mui/material/Link";

function CarouselSlide(props) {
  console.log(props.group);
  return <h1>{props.group[0].name}</h1>;
}

function Item(props) {
  // props.item.three.description.substring(0, 100) + ...
  // console.log(props.item);
  var group = props.group;
  console.log(group);

  // return (
  //   {group.map((item) => {
  //     return (
  //       <h1>{item.name}</h1>
  //     )
  //   })}
  // <Paper sx={{ backgroundColor: "none" }} elevation="0">
  //   <MKBox height="400px" display="flex" justifyContent="space-evenly" alignItems="center" px={8}>
  //     {group.map((item, i) => {
  //       </MKBox>
  //     })}
  {
    /* <MKBox
        width="30%"
        height="90%"
        // px={1}
        sx={{
          boxShadow: "0 -8px 0 #fff, 0 1px 8px rgba(178, 190, 181, .35)",
          "&:hover": {
            // border: "2px solid #CED4DA",
            backgroundColor: "#f9ddbc",
          },
        }}
        borderRadius="7px"
      >
        <MuiLink href={props.item.postLink} target="_blank" rel="noreferrer">
          <MKBox
            width="100%"
            height="70%"
            mx={"auto"}
            display="flex"
            // justifyContent="center"
            alignItems="center"
          >
            <MKBox
              component="img"
              src={props.item.imgUrl}
              width="100%"
              height="90%"
              borderRadius="7px"
              mx="auto"
            ></MKBox>
          </MKBox>

          <MKBox
            width="100%"
            height="30%"
            display="flex"
            flexDirection="column"
            justifyContent="start"
            pt={1}
            px={2}
          >
            <MKTypography variant="h6" gutterBottom textAlign="center">
              {props.item.name}
            </MKTypography>
            <MKTypography
              variant="body2"
              component="p"
              color="text"
              mb={3}
              textAlign="center"
              fontSize="0.75rem"
              sx={{ letterSpacing: "0.01rem" }}
            >
              {props.item.description}
            </MKTypography>
          </MKBox>
        </MuiLink>
      </MKBox> */
  }

  //   {/* <MKBox
  //   width="30%"
  //   height="90%"
  //   // px={1}
  //   sx={{
  //     boxShadow: "0 -8px 0 #fff, 0 1px 8px rgba(178, 190, 181, .35)",
  //     "&:hover": {
  //       // border: "2px solid #CED4DA",
  //       backgroundColor: "#f9ddbc",
  //     },
  //   }}
  //   borderRadius="7px"
  // >
  //   <MuiLink href={""} target="_blank" rel="noreferrer">
  //     <MKBox
  //       width="100%"
  //       height="70%"
  //       mx={"auto"}
  //       display="flex"
  //       // justifyContent="center"
  //       alignItems="center"
  //     >
  //       <MKBox
  //         component="img"
  //         src={props.item.two.imgUrl}
  //         width="100%"
  //         height="90%"
  //         borderRadius="7px"
  //         mx="auto"
  //       ></MKBox>
  //     </MKBox>

  //     <MKBox
  //       width="100%"
  //       height="30%"
  //       display="flex"
  //       flexDirection="column"
  //       justifyContent="start"
  //       pt={1}
  //       px={2}
  //     >
  //       <MKTypography variant="h6" gutterBottom textAlign="center">
  //         {props.item.two.name}
  //       </MKTypography>
  //       <MKTypography
  //         variant="body2"
  //         component="p"
  //         color="text"
  //         mb={3}
  //         textAlign="center"
  //         fontSize="0.75rem"
  //         sx={{ letterSpacing: "0.01rem" }}
  //       >
  //         {props.item.two.description}
  //       </MKTypography>
  //     </MKBox>
  //   </MuiLink>
  // </MKBox> */}

  //   {/* <MKBox
  //   width="30%"
  //   height="90%"
  //   // px={1}
  //   sx={{
  //     boxShadow: "0 -8px 0 #fff, 0 1px 8px rgba(178, 190, 181, .35)",
  //     "&:hover": {
  //       // border: "2px solid #CED4DA",
  //       backgroundColor: "#f9ddbc",
  //     },
  //   }}
  //   borderRadius="7px"
  // >
  //   <MuiLink href={""} target="_blank" rel="noreferrer">
  //     <MKBox
  //       width="100%"
  //       height="70%"
  //       mx={"auto"}
  //       display="flex"
  //       // justifyContent="center"
  //       alignItems="center"
  //     >
  //       <MKBox
  //         component="img"
  //         src={props.item.three.imgUrl}
  //         width="100%"
  //         height="90%"
  //         borderRadius="7px"
  //         mx="auto"
  //       ></MKBox>
  //     </MKBox>

  //     <MKBox
  //       width="100%"
  //       height="30%"
  //       display="flex"
  //       flexDirection="column"
  //       justifyContent="start"
  //       pt={1}
  //       px={2}
  //     >
  //       <MKTypography variant="h6" gutterBottom textAlign="center">
  //         {props.item.three.name}
  //       </MKTypography>
  //       <MKTypography
  //         variant="body2"
  //         component="p"
  //         color="text"
  //         mb={3}
  //         textAlign="center"
  //         fontSize="0.75rem"
  //         sx={{
  //           letterSpacing: "0.01rem",
  //           maxWidth: "100%",
  //           maxHeight: "40%",
  //         }}
  //       >
  //         {props.item.three.description}
  //         {/* {props.item.three.description.length > 90
  //             ? props.item.three.description.substring(0, 90) + "..."
  //             : props.item.three.description} */}
  //   {/* </MKTypography>
  //     </MKBox>
  //   </MuiLink>
  // </MKBox>  */}
  //   </MKBox>
  // </Paper>
  // );
}

export default function MKCarousel(props) {
  var items = props.item;
  var groups = [];
  {
    items.map((item, index) => {
      const groupIndex = Math.floor(index / 2);

      if (!groups[groupIndex]) {
        groups[groupIndex] = [];
      }
      groups[groupIndex].push(item);
    });
  }

  return (
    <Carousel navButtonsAlwaysVisible={true} animation="fade" duration="500" indicators={false}>
      {groups.map((group, i) => {
        // console.log(group);
        return <CarouselSlide key={i} group={group} />;
        // return <Item key={i} group={group}></Item>;
      })}
    </Carousel>
  );
}

Item.defaultProps = {
  group: [],
};

Item.propTypes = {
  group: PropTypes.array,
};

CarouselSlide.defaultProps = {
  group: [],
};

CarouselSlide.propTypes = {
  group: PropTypes.array,
};

MKCarousel.defaultProps = {
  item: {},
};

MKCarousel.propTypes = {
  item: PropTypes.object,
};

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
