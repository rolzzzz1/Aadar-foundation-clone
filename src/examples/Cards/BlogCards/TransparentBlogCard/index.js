/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
// import Icon from "@mui/material/Icon";
import MuiLink from "@mui/material/Link";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function TransparentBlogCard({ image, title, description, action }) {
  const cardActionStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // width: "max-content",

    // "& .material-icons, .material-icons-round,": {
    //   transform: `translateX(2px)`,
    //   transition: "transform 0.2s cubic-bezier(0.34,1.61,0.7,1.3)",
    // },

    // "&:hover .material-icons, &:focus .material-icons, &:hover .material-icons-round, &:focus .material-icons-round":
    //   {
    //     transform: `translateX(6px)`,
    //   },
  };

  const imageTemplate = (
    <MKBox position="relative" display="flex" justifyContent="center" borderRadius="lg">
      <MKBox
        component="img"
        src={image}
        alt={title}
        borderRadius="lg"
        shadow="md"
        width="100%"
        // minWidth="150px"
        // maxWidth="150px"
        minHeight="260px"
        maxHeight="260px"
        position="relative"
        zIndex={1}
      />
      {/* <MKBox
        borderRadius="lg"
        shadow="md"
        width="100%"
        maxHeight="280px"
        minHeight="280px"
        position="absolute"
        // left={0}
        top={0}
        sx={{
          backgroundImage: `url(${image})`,
          transform: "scale(0.94)",
          filter: "blur(12px)",
          backgroundSize: "cover",
        }}
      /> */}
    </MKBox>
  );

  return (
    <MuiLink href={action.route} target="_blank" rel="noreferrer">
      <Card
        sx={{
          background: "transparent",
          // backgroundColor: "#000000",
          boxShadow: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // overflow: "visible",
          maxHeight: "360px",
          minHeight: "360px",
          "&:hover": {
            // border: "2px solid #CED4DA",
            backgroundColor: "#f9ddbc",
          },
        }}
      >
        <MKBox
          width="80%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          sx={{
            // backgroundColor: "#CED4DA",
            borderRadius: "10px",
            // maxHeight: "500px",
            // minHeight: "500px",
          }}
        >
          {action.type === "internal" ? (
            <Link to={action.route}>{imageTemplate}</Link>
          ) : (
            <MuiLink href={action.route} target="_blank" rel="noreferrer">
              {imageTemplate}
            </MuiLink>
          )}
          <MKBox
            pt={2}
            pb={3}
            // maxHeight="100px" For carousel
            // minHeight="100px"
            maxHeight="200px"
            minHeight="200px"
            mx={1}
            // sx={{ backgroundColor: "#CED4DA", my: -3, width: "70%", borderRadius: "10px" }}
          >
            {action.type === "internal" ? (
              <Link to={action.route} sx={cardActionStyles}>
                <MKTypography variant="h6" gutterBottom textAlign="center">
                  {title}
                </MKTypography>
              </Link>
            ) : (
              <MuiLink href={action.route} target="_blank" rel="noreferrer" sx={cardActionStyles}>
                <MKTypography variant="h6" gutterBottom textAlign="center">
                  {title}
                </MKTypography>
              </MuiLink>
            )}
            <MKTypography
              variant="body2"
              component="p"
              color="text"
              mb={3}
              textAlign="center"
              fontSize="0.85rem"
              sx={{ letterSpacing: "0.01rem" }}
            >
              {description}
            </MKTypography>
          </MKBox>
        </MKBox>
      </Card>
    </MuiLink>
  );
}

// Typechecking props for the TransparentBlogCard
TransparentBlogCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(["external", "internal"]),
    route: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    color: PropTypes.oneOf([
      "inherit",
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
      "text",
    ]).isRequired,
  }).isRequired,
};

export default TransparentBlogCard;
