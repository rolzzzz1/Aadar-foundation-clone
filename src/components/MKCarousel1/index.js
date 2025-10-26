import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MuiLink from "@mui/material/Link";

import "./styles.css";

// import event1 from "assets/images/eventImages/event 1.jpg";
// import event2 from "assets/images/eventImages/event 2.jpg";

export default function MKCarousel1(props) {
  var items = props.item;

  return (
    <Carousel
      navButtonsAlwaysVisible={props.navButtons}
      animation="fade"
      number="300"
      duration="300"
      indicators={false}
      minWidth="320px"
      navButtonsProps={{
        style: {
          opacity: 0.6,
        },
      }}
    >
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
}

// export default function MKCarousel1(props) {
//   var items = props.item;

//   return (
//     <Carousel navButtonsAlwaysVisible={true} animation="fade" duration="500" indicators={false}>
//       {items.map((item, i) => (
//         <Item key={i} item={item} />
//       ))}
//     </Carousel>
//   );
// }

function Item(props) {
  return (
    <Paper>
      <MKBox
        display="flex"
        // flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="40px"
        width="100%"
        mx="auto"
        height={{ xs: "300px", sm: "350px", md: "350px", lg: "400px" }}
        sx={{ backgroundColor: "#f0f2f5" }}
      >
        {props.item.map((item, i) => {
          //   return <h1 key={i}>{item.name}</h1>;
          return (
            <MKBox
              key={i}
              // width="30%"
              width={{ xs: "70%", sm: "60%", md: "36%", lg: "33%", xl: "30%" }}
              height="100%"
              // px={1}

              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0 -8px 0 #fff, 0 1px 8px rgba(178, 190, 181, .35)",
                "&:hover": {
                  // border: "2px solid #CED4DA",
                  backgroundColor: "#f9ddbc",
                },
              }}
              borderRadius="7px"
              className="eventsImgs"
            >
              <MuiLink href={item.postLink} target="_blank" rel="noreferrer">
                <MKBox
                  width="100%"
                  height={{ xs: "80%", sm: "60%", md: "60%", lg: "65%" }}
                  mx={"auto"}
                  display="flex"
                >
                  <MKBox
                    component="img"
                    src={item.imgUrl}
                    width="100%"
                    height="100%"
                    borderRadius="7px"
                    mx="auto"
                    loading="lazy"
                    // className="eventsImgs"
                  ></MKBox>
                </MKBox>

                <MKBox
                  width="100%"
                  height={{ xs: "30%", sm: "45%", md: "40%", lg: "35%" }}
                  display="flex"
                  flexDirection="column"
                  justifyContent="start"
                  overflow="hidden"
                  pt={{ xs: 2, sm: 2.5, md: 2.5, lg: 2.5 }}
                  px={1}
                >
                  <MKTypography
                    // variant="h6"
                    gutterBottom
                    textAlign="center"
                    fontSize={{ xs: "0.8rem", sm: "1rem", md: "0.9rem", lg: "1rem", xl: "1.2rem" }}
                    sx={{ fontWeight: "500" }}
                    lineHeight={{ xs: "0.75rem", sm: "1.5rem", md: "2rem" }}
                  >
                    {item.name}
                  </MKTypography>
                  <MKTypography
                    variant="body2"
                    component="p"
                    // color="text"
                    display={{ xs: "none", sm: "block" }}
                    mb={3}
                    textAlign="center"
                    fontSize={{ xs: "0.75rem", sm: "0.75rem", md: "0.65rem", lg: "0.75rem" }}
                    sx={{ letterSpacing: "0.01rem" }}
                  >
                    {item.description}
                  </MKTypography>
                </MKBox>
              </MuiLink>
            </MKBox>
          );
        })}
      </MKBox>
    </Paper>
  );

  //   console.log(props.item[0]);
}

// function Item(props) {
//   return (
//     <Paper>
//       <MKBox
//         display="flex"
//         // flexDirection="column"
//         justifyContent="center"
//         gap="40px"
//         width="100%"
//         mx="auto"
//         height="400px"
//       >
//         <MKBox
//           width="30%"
//           height="90%"
//           // px={1}
//           sx={{
//             boxShadow: "0 -8px 0 #fff, 0 1px 8px rgba(178, 190, 181, .35)",
//             "&:hover": {
//               // border: "2px solid #CED4DA",
//               backgroundColor: "#f9ddbc",
//             },
//           }}
//           borderRadius="7px"
//         >
//           <MuiLink href={""} target="_blank" rel="noreferrer">
//             <MKBox
//               width="100%"
//               height="70%"
//               mx={"auto"}
//               display="flex"
//               // justifyContent="center"
//               alignItems="center"
//             >
//               <MKBox
//                 component="img"
//                 src={props.item.imgUrl}
//                 width="100%"
//                 height="90%"
//                 borderRadius="7px"
//                 mx="auto"
//               ></MKBox>
//             </MKBox>

//             <MKBox
//               width="100%"
//               height="30%"
//               display="flex"
//               flexDirection="column"
//               justifyContent="start"
//               pt={1}
//               px={2}
//             >
//               <MKTypography variant="h6" gutterBottom textAlign="center">
//                 {props.item.name}
//               </MKTypography>
//               <MKTypography
//                 variant="body2"
//                 component="p"
//                 color="text"
//                 mb={3}
//                 textAlign="center"
//                 fontSize="0.75rem"
//                 sx={{ letterSpacing: "0.01rem" }}
//               >
//                 {props.item.description}
//               </MKTypography>
//             </MKBox>
//           </MuiLink>
//         </MKBox>

//         <MKBox
//           width="30%"
//           height="90%"
//           // px={1}
//           sx={{
//             boxShadow: "0 -8px 0 #fff, 0 1px 8px rgba(178, 190, 181, .35)",
//             "&:hover": {
//               // border: "2px solid #CED4DA",
//               backgroundColor: "#f9ddbc",
//             },
//           }}
//           borderRadius="7px"
//         >
//           <MuiLink href={""} target="_blank" rel="noreferrer">
//             <MKBox
//               width="100%"
//               height="70%"
//               mx={"auto"}
//               display="flex"
//               // justifyContent="center"
//               alignItems="center"
//             >
//               <MKBox
//                 component="img"
//                 src={props.item.imgUrl}
//                 width="100%"
//                 height="90%"
//                 borderRadius="7px"
//                 mx="auto"
//               ></MKBox>
//             </MKBox>

//             <MKBox
//               width="100%"
//               height="30%"
//               display="flex"
//               flexDirection="column"
//               justifyContent="start"
//               pt={1}
//               px={2}
//             >
//               <MKTypography variant="h6" gutterBottom textAlign="center">
//                 {props.item.name}
//               </MKTypography>
//               <MKTypography
//                 variant="body2"
//                 component="p"
//                 color="text"
//                 mb={3}
//                 textAlign="center"
//                 fontSize="0.75rem"
//                 sx={{ letterSpacing: "0.01rem" }}
//               >
//                 {props.item.description}
//               </MKTypography>
//             </MKBox>
//           </MuiLink>
//         </MKBox>
//       </MKBox>
//     </Paper>
//   );
// }

// Item.defaultProps = {
//   item: {},
// };

// Item.propTypes = {
//   item: PropTypes.object,
// };

Item.defaultProps = {
  item: [],
};

Item.propTypes = {
  item: PropTypes.array,
};

MKCarousel1.defaultProps = {
  item: [],
  navButtons: true,
};

MKCarousel1.propTypes = {
  item: PropTypes.array,
  navButtons: PropTypes.bool,
};
