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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";

function HorizontalTeamCard({
  image,
  name,
  position,
  // description
}) {
  return (
    <Card sx={{ mt: 3, padding: "10px", minHeight: "220px" }}>
      <Grid container>
        <Grid
          item
          xs={4}
          sm={4}
          md={4}
          lg={4}
          // sx={{ mt: -6 }}
        >
          <MKBox width="100%" pt={2} pb={1} px={2}>
            <MKBox
              component="img"
              src={image}
              alt={name}
              // width="100%"
              borderRadius="md"
              shadow="lg"
              width="100px"
              height="100px"
            />
          </MKBox>
        </Grid>
        <Grid
          item
          xs={8}
          sm={8}
          md={8}
          lg={8}
          sx={{
            my: "auto",
            paddingLeft: "40px",
          }}
        >
          <MKBox pt={{ xs: 1, lg: 1.5 }} pb={2.5} pr={4} pl={{ xs: 4, lg: 1 }} lineHeight={1}>
            <MKTypography variant="h6">{name.split(" ")[0]}</MKTypography>
            <MKTypography variant="h6">{name.split(" ")[1]}</MKTypography>
            <MKTypography variant="h6" color={position.color} mb={1}>
              {position.label}
            </MKTypography>
            <MKTypography variant="body" fontSize="0.75rem" mb={1}>
              Some text description Some text description
            </MKTypography>
            <MKBox display="flex" gap="10px" color="text" mt={2}>
              {/* <MKTypography variant="body2" color="text"> */}
              {/* {description} */}
              {<InstagramIcon fontSize="medium" sx={{ cursor: "pointer" }} />}
              {<FacebookIcon fontSize="medium" sx={{ cursor: "pointer" }} />}
              {<YouTubeIcon fontSize="medium" sx={{ cursor: "pointer" }} />}
              {/* </MKTypography> */}
            </MKBox>
          </MKBox>
        </Grid>
      </Grid>
    </Card>
  );
}

// Typechecking props for the HorizontalTeamCard
HorizontalTeamCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
    label: PropTypes.string.isRequired,
  }).isRequired,
  description: PropTypes.string.isRequired,
};

export default HorizontalTeamCard;
