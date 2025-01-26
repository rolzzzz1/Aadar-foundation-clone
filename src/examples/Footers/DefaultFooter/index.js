/*
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
// import MKButton from "components/MKButton";

import CallRoundedIcon from "@mui/icons-material/CallRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

function DefaultFooter({ content }) {
  const { brand, socials, menus, copyright } = content;

  return (
    <MKBox
      component="footer"
      // bgColor="dark"
      sx={{
        backgroundColor: "#3F3F3F",
        minWidth: "575px",
        overflow: "hidden",
      }}
    >
      <Container>
        <Grid container spacing={4} sx={{ paddingTop: "40px" }}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              textAlign: "center",
              ml: "auto",
              mb: 3,
              maxHeight: "200px",
            }}
          >
            <MKBox>
              <Link to={brand.route}>
                <MKBox component="img" src={brand.image} alt={brand.name} maxWidth="5rem" mb={1} />
              </Link>
              <MKTypography variant="h4" color="white">
                {brand.name}
              </MKTypography>
            </MKBox>
            <MKBox display="flex" alignItems="center" mt={2} justifyContent="center">
              {socials.map(({ icon, link }, key) => (
                <MKTypography
                  key={link}
                  component="a"
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  variant="h3"
                  // color="dark"
                  color="white"
                  opacity={0.8}
                  mr={key === socials.length - 1 ? 0 : 2.5}
                >
                  {icon}
                </MKTypography>
              ))}
            </MKBox>
          </Grid>
          {menus.map(({ name: title, items }) => (
            <Grid key={title} item xs={6} md={4} sx={{ textAlign: "center", mb: 3 }}>
              <MKTypography
                display="block"
                variant="button"
                sx={{ fontSize: { sm: "1rem", md: "1.25rem" } }}
                fontWeight="bold"
                textTransform="capitalize"
                color="white"
                mb={1}
              >
                {title}
              </MKTypography>
              <MKBox component="ul" p={0} m={0} sx={{ listStyle: "none" }}>
                {items.map(({ name, route, href }) => (
                  <MKBox key={name} component="li" p={0} m={0} lineHeight={1.25}>
                    {href ? (
                      <MKTypography
                        component="a"
                        href={href}
                        // target="_blank"
                        rel="noreferrer"
                        variant="button"
                        fontWeight="regular"
                        textTransform="capitalize"
                        sx={{ fontSize: { sm: "0.8rem", md: "0.9rem" } }}
                        // fontSize={"0.9rem"}
                        color="white"
                      >
                        {name}
                      </MKTypography>
                    ) : (
                      <MKTypography
                        component={Link}
                        to={route}
                        variant="button"
                        fontWeight="regular"
                        textTransform="capitalize"
                        sx={{ fontSize: { sm: "0.8rem", md: "0.9rem" } }}
                        // fontSize={"0.9rem"}
                        color="white"
                      >
                        {name}
                      </MKTypography>
                    )}
                  </MKBox>
                ))}
              </MKBox>
            </Grid>
          ))}

          <Grid
            item
            xs={6}
            md={4}
            sx={{ textAlign: "center", mb: 3, px: 4, mx: "auto" }}
            fontSize={"0.75rem"}
          >
            <MKTypography
              sx={{ fontSize: { sm: "1rem", md: "1.25rem" } }}
              fontWeight="bold"
              color="white"
            >
              Contact
            </MKTypography>

            <MKBox mt={1}>
              <MKTypography
                sx={{
                  fontSize: { xs: "0.68rem", sm: "0.68rem", md: "0.8rem", lg: "0.9rem" },
                  maxWidth: { xs: "200px", lg: "300px" },
                }}
                fontWeight="regular"
                textTransform="capitalize"
                color="white"
                lineHeight="1.2rem"
                // maxWidth="200px"
                mx="auto"
                mb={1}
              >
                ASHRAM ADD - SARKARI MULTI, Gudagudi Ka Naka Rd, near of MUKTIDHAM, Gwalior, Madhya
                Pradesh 474001
              </MKTypography>
              <MKBox
                fontWeight="regular"
                sx={{ fontSize: { xs: "0.8rem", sm: "0.8rem", md: "0.9rem" } }}
                // textTransform="capitalize"
                paddingTop="5px"
                color="white"
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap="5px"
              >
                <CallRoundedIcon
                  sx={{ fontSize: { xs: "small", sm: "small", md: "medium", lg: "medium" } }}
                />
                <MKTypography
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.8rem", md: "0.9rem" } }}
                  paddingLeft="10px"
                  color="white"
                >
                  90391 29571
                </MKTypography>
              </MKBox>
              <MKBox
                fontWeight="regular"
                // textTransform="capitalize"
                sx={{ fontSize: { xs: "0.8rem", sm: "0.8rem", md: "0.9rem" } }}
                paddingTop="5px"
                color="white"
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap="5px"
              >
                <EmailRoundedIcon fontSize="inherit" />
                <MKTypography
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.8rem", md: "0.9rem" } }}
                  paddingLeft="10px"
                  color="white"
                >
                  aadar1234@gmail.com
                </MKTypography>
              </MKBox>

              {/* {socials.map(({ icon, link }, key) => (
                <MKTypography
                  key={link}
                  component="a"
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  variant="h5"
                  color="dark"
                  opacity={0.8}
                  mr={key === socials.length - 1 ? 0 : 2.5}
                >
                  {icon}
                </MKTypography>
              ))} */}
            </MKBox>
          </Grid>
        </Grid>
        <Grid
          // item
          xs={12}
          sx={{ textAlign: "center", mb: 0.5, mt: 1 }}
        >
          {copyright}
        </Grid>
      </Container>
    </MKBox>
  );
}

// Typechecking props for the DefaultFooter
DefaultFooter.propTypes = {
  content: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])).isRequired,
};

export default DefaultFooter;
