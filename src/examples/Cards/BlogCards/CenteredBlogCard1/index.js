/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
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
// import MuiLink from "@mui/material/Link";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
// import MKButton from "components/MKButton";

function CenteredBlogCard({
  image,
  title,
  action,
  // description
}) {
  const imageTemplate = (
    <MKBox
      position="relative"
      display="flex"
      justifyContent="center"
      // alignItems="center"
      borderRadius="lg"
      minHeight="300px"
      maxHeight="300px"
      mx={2}
      mt={-3}
    >
      <MKBox
        component="img"
        src={image}
        alt={title}
        borderRadius="lg"
        width="90%"
        position="relative"
        zIndex={1}
      />
      <MKBox
        borderRadius="lg"
        shadow="md"
        width="90%"
        height="100%"
        position="absolute"
        // left={0}
        top={0}
        sx={{
          backgroundImage: `url(${image})`,
          transform: "scale(0.94)",
          filter: "blur(12px)",
          backgroundSize: "cover",
        }}
      />
    </MKBox>
  );

  return (
    <>
      <Link to={action.route}>
        <Card sx={{ marginTop: "20px" }}>
          {imageTemplate}
          {/* {action.type === "internal" ? (
          <Link to={action.route}>{imageTemplate}</Link>
        ) : (
          <MuiLink href={action.route} target="_blank" rel="noreferrer">
            {imageTemplate}
          </MuiLink>
        )} */}
          <MKBox p={3} mt={-1} textAlign="center">
            <MKTypography
              display="inline"
              variant="h5"
              textTransform="capitalize"
              fontWeight="bold"
              py={2}
            >
              {title}
            </MKTypography>

            {/* <MKBox mt={1} mb={3}>
              <MKTypography variant="body2" component="p" color="text">
                {description}
              </MKTypography>
            </MKBox> */}
          </MKBox>
        </Card>
      </Link>
    </>
  );
}

// Typechecking props for the CenteredBlogCard
CenteredBlogCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(["external", "internal"]).isRequired,
    route: PropTypes.string.isRequired,
  }).isRequired,
};

export default CenteredBlogCard;
