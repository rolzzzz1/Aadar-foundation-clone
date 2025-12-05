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

import { useTranslation } from "react-i18next";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
// import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
// import MKButton from "components/MKButton";

import CallRoundedIcon from "@mui/icons-material/CallRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function DefaultFooter({ content }) {
  const { brand, socials, menus, copyright } = content[0];

  const { t } = useTranslation();
  const contactInfo = t("footer.contactInfo");

  return (
    <MKBox
      component="footer"
      // bgColor="dark"
      sx={{
        backgroundColor: "#3F3F3F",
        minWidth: "320px",
        overflow: "hidden",
        paddingTop: "40px",
      }}
    >
      {/* <Container sx={{ margin: { md: "10px" } }}> */}
      <Grid container spacing={4} pr={2}>
        {/* Grid 1 */}

        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          sx={{
            // ml: "auto",

            mb: 3,
            maxHeight: "200px",
          }}
        >
          <MKBox pl={4} sx={{ paddingLeft: { lg: "48px", xl: "64px" } }}>
            <MKBox>
              {/* <Link to={brand.route}> */}
              {/* <Link to={brand.href}> */}
              <MKBox
                component="img"
                src={brand.image}
                alt={brand.name}
                maxWidth="5rem"
                mb={1}
                sx={{ borderRadius: "10px" }}
              />
              <MKTypography
                variant="h4"
                color="white"
                fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
              >
                {brand.name}
              </MKTypography>
              {/* </Link> */}
            </MKBox>

            <MKBox display="flex" alignItems="center" mt={2} justifyContent="left">
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
                  sx={{
                    "&:hover": {
                      color: "#E7A232",
                      textDecoration: "underline 2px",
                    },
                  }}
                >
                  {icon}
                </MKTypography>
              ))}
            </MKBox>
          </MKBox>
        </Grid>

        {/* Grid 2 and 3 */}
        {menus.map(({ name: title, items }) => (
          <Grid
            key={title}
            item
            xs={6}
            sm={4}
            md={2}
            sx={{
              // textAlign: "center",
              mb: 3,
              display: "flex",
              flexDirection: "column",
              // marginLeft: { sm: "40px" },
            }}
          >
            <MKBox sx={{ paddingLeft: { xs: "32px", sm: "32px", md: "0" } }}>
              <MKBox>
                <MKTypography
                  display="block"
                  variant="button"
                  sx={{ fontSize: { sm: "1rem", md: "1.2rem" } }}
                  fontWeight="bold"
                  textTransform="capitalize"
                  color="white"
                  mb={1}
                >
                  {title}
                </MKTypography>
              </MKBox>
              <MKBox sx={{ display: "flex", justifyContent: "left", gap: "60px" }}>
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
                          sx={{
                            fontSize: { sm: "0.9rem", md: "1rem" },
                            color: "white !important",
                            textDecoration: "underline",
                            textUnderlineOffset: "4px",
                            textDecorationThickness: "2px",
                            textDecorationColor: "white",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "inline-block",
                            "&:hover": {
                              color: "#E7A232 !important",
                              textDecoration: "underline",
                              textDecorationThickness: "2.5px",
                              textDecorationColor: "#E7A232",
                              transform: "translateX(3px)",
                            },
                          }}
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
                          sx={{
                            fontSize: { sm: "0.9rem", md: "1rem" },
                            color: "white !important",
                            textDecoration: "underline",
                            textUnderlineOffset: "4px",
                            textDecorationThickness: "2px",
                            textDecorationColor: "white",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "inline-block",
                            "&:hover": {
                              color: "#E7A232 !important",
                              textDecoration: "underline",
                              textDecorationThickness: "2.5px",
                              textDecorationColor: "#E7A232",
                              transform: "translateX(3px)",
                            },
                          }}
                        >
                          {name}
                        </MKTypography>
                      )}
                    </MKBox>
                  ))}
                </MKBox>
              </MKBox>
            </MKBox>
          </Grid>
        ))}

        <Grid
          item
          xs={12}
          sm={12}
          md={3}
          sx={{
            // textAlign: "center",
            mb: 3,
            pr: 2,
            // mx: "auto",
            // marginLeft: { sm: "40px" },
          }}
          fontSize={"0.75rem"}
        >
          <MKBox sx={{ paddingLeft: { xs: "32px", sm: "32px", md: "0" } }}>
            <MKBox>
              <MKTypography
                // display="block"
                variant="button"
                sx={{ fontSize: { sm: "1rem", md: "1.2rem" } }}
                fontWeight="bold"
                textTransform="capitalize"
                color="white"
                mb={1}
              >
                {contactInfo.title}
              </MKTypography>
            </MKBox>

            <MKBox
              mt={1}
              // sx={{ display: { sm: "flex", md: "block" }, gap: { sm: "40px" } }}
            >
              <MKTypography
                sx={{
                  fontSize: { xs: "0.9rem", sm: "0.9rem", md: "0.95rem", lg: "1rem" },
                  maxWidth: { xs: "200px", lg: "300px" },
                }}
                fontWeight="regular"
                textTransform="capitalize"
                color="white"
                lineHeight="1.3rem"
                // maxWidth="200px"
                // mx="auto"
                mb={1}
              >
                {contactInfo.address}
              </MKTypography>
              <MKBox
                fontWeight="regular"
                // sx={{ fontSize: { xs: "0.8rem", sm: "0.8rem", md: "0.8rem", lg: "0.9rem" } }}
                // textTransform="capitalize"
                paddingTop="5px"
                color="white"
                display="flex"
                justifyContent="left"
                alignItems="center"
                gap="5px"
              >
                <CallRoundedIcon
                  fontSize="small"
                  // sx={{ fontSize: { xs: "small", sm: "small", md: "medium", lg: "medium" } }}
                />
                <MKTypography
                  sx={{ fontSize: { xs: "0.9rem", sm: "0.9rem", md: "0.95rem", lg: "1rem" } }}
                  paddingLeft="10px"
                  color="white"
                >
                  +91 9039129571, +91 9826441863, +91 9630982392
                </MKTypography>
              </MKBox>
              <MKBox
                fontWeight="regular"
                // textTransform="capitalize"
                sx={{ fontSize: { xs: "0.8rem", sm: "0.8rem", md: "0.75rem" } }}
                paddingTop="5px"
                color="white"
                display="flex"
                justifyContent="left"
                alignItems="center"
                gap="5px"
              >
                <EmailRoundedIcon fontSize="small" />
                <MKTypography
                  sx={{ fontSize: { xs: "0.9rem", sm: "0.9rem", md: "0.95rem", lg: "1rem" } }}
                  paddingLeft="10px"
                  color="white"
                  // overflow="hidden"
                >
                  aadarfoundatio2018
                  <br />
                  <MKTypography
                    color="white"
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" } }}
                  >
                    @gmail.com
                  </MKTypography>
                </MKTypography>
              </MKBox>
              <MKBox
                fontWeight="regular"
                paddingTop="8px"
                color="white"
                display="flex"
                justifyContent="left"
                alignItems="center"
                gap="5px"
              >
                <LocationOnIcon fontSize="small" />
                <MKTypography
                  component="a"
                  href="https://maps.google.com/?q=Swarg+sadan+ashram+-+Sarkari+Malti,+Behind+Muktidham,+Guda+Gudi+Ka+Naka,+Gwalior,+India,+474001"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "0.9rem", md: "0.95rem", lg: "1rem" },
                    paddingLeft: "10px",
                    color: "white !important",
                    textDecoration: "underline",
                    textUnderlineOffset: "4px",
                    textDecorationThickness: "2px",
                    textDecorationColor: "white",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "inline-block",
                    "&:hover": {
                      color: "#E7A232 !important",
                      textDecoration: "underline",
                      textDecorationThickness: "2.5px",
                      textDecorationColor: "#E7A232",
                      transform: "translateX(3px)",
                    },
                  }}
                >
                  {contactInfo.viewOnGoogleMaps}
                </MKTypography>
              </MKBox>
            </MKBox>
          </MKBox>
        </Grid>

        {/* {menus.map(({ name: title, items1 }) => (
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
                {items1.map(({ name, route, href }) => (
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
          ))} */}
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "center", mb: 0.5, mt: 1 }}>
        {copyright}
      </Grid>
      {/* </Container> */}
    </MKBox>
  );
}

// Typechecking props for the DefaultFooter
DefaultFooter.propTypes = {
  content: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])).isRequired,
};

export default DefaultFooter;
