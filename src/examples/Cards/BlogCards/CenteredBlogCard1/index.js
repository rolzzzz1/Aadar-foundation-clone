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

import "./styles.css";

function CenteredBlogCard({ image, title, action, description }) {
  const imageTemplate = (
    <MKBox
      position="relative"
      display="flex"
      justifyContent="center"
      // alignItems="center"
      borderRadius="lg"
      // minHeight="240px"
      // maxHeight="240px"

      sx={{ minHeight: { xs: "200px", sm: "240px" }, maxHeight: { xs: "140px", sm: "240px" } }}
      mx={1}
      mt={-3}
    >
      <MKBox
        component="img"
        src={image}
        alt={title}
        borderRadius="lg"
        width="100%"
        position="relative"
        zIndex={1}
        loading="lazy"
        // className="centerBlogImgs"
      />
      <MKBox
        borderRadius="lg"
        shadow="md"
        width="10%"
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
        <Card
          sx={{
            marginTop: "20px",
            "&:hover": {
              // border: "2px solid #CED4DA",
              backgroundColor: "#f9ddbc",
            },
          }}
          className="centerBlogImgs"
        >
          {imageTemplate}
          {/* {action.type === "internal" ? (
          <Link to={action.route}>{imageTemplate}</Link>
        ) : (
          <MuiLink href={action.route} target="_blank" rel="noreferrer">
            {imageTemplate}
          </MuiLink>
        )} */}
          <MKBox
            p={3}
            mt={-1}
            textAlign="center"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: { xs: "0", sm: "140px" }, maxHeight: { xs: "0", sm: "140px" } }}
          >
            <MKTypography
              display="inline"
              variant="h5"
              textTransform="capitalize"
              // fontWeight="bold"
              pt={2}
              pb={1}
              sx={{ fontWeight: "500", fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              {title}
            </MKTypography>

            <MKBox
              mt={1}
              mb={3}
              // sx={{ display: { xs: "none" } }}
            >
              <MKTypography
                variant="body2"
                component="p"
                color="text"
                sx={{
                  fontWeight: "400",
                  fontSize: { xs: "0.75rem", md: "0.9rem", lg: "0.75rem", xl: "0.9rem" },
                  letterSpacing: "0.05rem",
                  // display: { xs: "none" },
                }}
              >
                {description}
              </MKTypography>
            </MKBox>
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
