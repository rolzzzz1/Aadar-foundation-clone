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

function HorizontalTeamCard({
  image,
  name,
  position,
  // description
}) {
  return (
    <Card
      sx={{
        mt: 3,
        padding: "10px",
        // minHeight: "200px"
        backgroundColor: "#f0f2f5",
      }}
    >
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
              width="150px"
              height="150px"
              // border="solid 1px #777"
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
            // paddingLeft: "40px",
          }}
          pl={9}
        >
          <MKBox pt={{ xs: 1, lg: 1.5 }} pb={2.5} pr={3} pl={{ xs: 4, lg: 1 }} lineHeight={1}>
            <MKTypography variant="h6">{name.split(" ")[0]}</MKTypography>
            <MKTypography variant="h6">{name.split(" ")[1]}</MKTypography>
            <MKTypography
              variant="h6"
              fontSize="0.8rem"
              sx={{ fontWeight: "500" }}
              color={position.color}
              mb={1}
              pt={1}
            >
              {position.label}
            </MKTypography>
            {/* <MKTypography variant="body" fontSize="0.75rem" mb={1}>
              Some text description Some text description
            </MKTypography> */}
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
