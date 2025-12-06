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

import { useState } from "react";

// react-router components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Collapse from "@mui/material/Collapse";
import MuiLink from "@mui/material/Link";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Material Kit 2 React example components
import DefaultNavbarDropdown from "examples/Navbars/DefaultNavbar/DefaultNavbarDropdown";

function DefaultNavbarMobile({ routes, open, action }) {
  const [collapse, setCollapse] = useState("");

  const handleSetCollapse = (name) => (collapse === name ? setCollapse(false) : setCollapse(name));

  const renderNavbarItems = routes.map(
    ({ name, icon, collapse: routeCollapses, href, route, collapse: navCollapse }) => {
      if (name !== "Privacy policy" && name !== "Terms Conditions" && name !== "Donate") {
        return (
          <DefaultNavbarDropdown
            key={name}
            name={name}
            icon={icon}
            collapseStatus={name === collapse}
            onClick={() => handleSetCollapse(name)}
            href={href}
            route={route}
            collapse={Boolean(navCollapse)}
          >
            <MKBox
              sx={{
                height: "15rem",
                maxHeight: "15rem",
                overflowY: "scroll",
              }}
            >
              {routeCollapses &&
                routeCollapses.map((item) => (
                  <MKBox key={item.name} px={2}>
                    {item.collapse ? (
                      <>
                        <MKTypography
                          display="block"
                          variant="button"
                          fontWeight="bold"
                          textTransform="capitalize"
                          py={1}
                          px={0.5}
                        >
                          {item.name}
                        </MKTypography>
                        {item.collapse.map((el) => (
                          <MKTypography
                            key={el.name}
                            component={el.route ? Link : MuiLink}
                            to={el.route ? el.route : ""}
                            href={el.href ? el.href : ""}
                            target={el.href ? "_blank" : ""}
                            rel={el.href ? "noreferrer" : "noreferrer"}
                            minWidth="11.25rem"
                            display="block"
                            variant="button"
                            color="text"
                            textTransform="capitalize"
                            fontWeight="regular"
                            py={0.625}
                            px={2}
                            sx={({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                              borderRadius: borderRadius.md,
                              cursor: "pointer",
                              transition: "all 300ms linear",

                              "&:hover": {
                                backgroundColor: grey[200],
                                color: dark.main,
                              },
                            })}
                          >
                            {el.name}
                          </MKTypography>
                        ))}
                      </>
                    ) : (
                      <MKBox
                        key={item.key}
                        display="block"
                        component={item.route ? Link : MuiLink}
                        to={item.route ? item.route : ""}
                        href={item.href ? item.href : ""}
                        target={item.href ? "_blank" : ""}
                        rel={item.href ? "noreferrer" : "noreferrer"}
                        sx={({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                          borderRadius: borderRadius.md,
                          cursor: "pointer",
                          transition: "all 300ms linear",
                          py: 1,
                          px: 1.625,

                          "&:hover": {
                            backgroundColor: grey[200],
                            color: dark.main,

                            "& *": {
                              color: dark.main,
                            },
                          },
                        })}
                      >
                        <MKTypography
                          display="block"
                          variant="button"
                          fontWeight="bold"
                          textTransform="capitalize"
                        >
                          {item.name}
                        </MKTypography>
                        <MKTypography
                          display="block"
                          variant="button"
                          color="text"
                          fontWeight="regular"
                          sx={{ transition: "all 300ms linear" }}
                        >
                          {item.description}
                        </MKTypography>
                      </MKBox>
                    )}
                  </MKBox>
                ))}
            </MKBox>
          </DefaultNavbarDropdown>
        );
      }
      // <DefaultNavbarDropdown
      //   key={name}
      //   name={name}
      //   icon={icon}
      //   collapseStatus={name === collapse}
      //   onClick={() => handleSetCollapse(name)}
      //   href={href}
      //   route={route}
      //   collapse={Boolean(navCollapse)}
      // >
      //   <MKBox sx={{ height: "15rem", maxHeight: "15rem", overflowY: "scroll" }}>
      //     {routeCollapses &&
      //       routeCollapses.map((item) => (
      //         <MKBox key={item.name} px={2}>
      //           {item.collapse ? (
      //             <>
      //               <MKTypography
      //                 display="block"
      //                 variant="button"
      //                 fontWeight="bold"
      //                 textTransform="capitalize"
      //                 py={1}
      //                 px={0.5}
      //               >
      //                 {item.name}
      //               </MKTypography>
      //               {item.collapse.map((el) => (
      //                 <MKTypography
      //                   key={el.name}
      //                   component={el.route ? Link : MuiLink}
      //                   to={el.route ? el.route : ""}
      //                   href={el.href ? el.href : ""}
      //                   target={el.href ? "_blank" : ""}
      //                   rel={el.href ? "noreferrer" : "noreferrer"}
      //                   minWidth="11.25rem"
      //                   display="block"
      //                   variant="button"
      //                   color="text"
      //                   textTransform="capitalize"
      //                   fontWeight="regular"
      //                   py={0.625}
      //                   px={2}
      //                   sx={({ palette: { grey, dark }, borders: { borderRadius } }) => ({
      //                     borderRadius: borderRadius.md,
      //                     cursor: "pointer",
      //                     transition: "all 300ms linear",

      //                     "&:hover": {
      //                       backgroundColor: grey[200],
      //                       color: dark.main,
      //                     },
      //                   })}
      //                 >
      //                   {el.name}
      //                 </MKTypography>
      //               ))}
      //             </>
      //           ) : (
      //             <MKBox
      //               key={item.key}
      //               display="block"
      //               component={item.route ? Link : MuiLink}
      //               to={item.route ? item.route : ""}
      //               href={item.href ? item.href : ""}
      //               target={item.href ? "_blank" : ""}
      //               rel={item.href ? "noreferrer" : "noreferrer"}
      //               sx={({ palette: { grey, dark }, borders: { borderRadius } }) => ({
      //                 borderRadius: borderRadius.md,
      //                 cursor: "pointer",
      //                 transition: "all 300ms linear",
      //                 py: 1,
      //                 px: 1.625,

      //                 "&:hover": {
      //                   backgroundColor: grey[200],
      //                   color: dark.main,

      //                   "& *": {
      //                     color: dark.main,
      //                   },
      //                 },
      //               })}
      //             >
      //               <MKTypography
      //                 display="block"
      //                 variant="button"
      //                 fontWeight="bold"
      //                 textTransform="capitalize"
      //               >
      //                 {item.name}
      //               </MKTypography>
      //               <MKTypography
      //                 display="block"
      //                 variant="button"
      //                 color="text"
      //                 fontWeight="regular"
      //                 sx={{ transition: "all 300ms linear" }}
      //               >
      //                 {item.description}
      //               </MKTypography>
      //             </MKBox>
      //           )}
      //         </MKBox>
      //       ))}
      //   </MKBox>
      // </DefaultNavbarDropdown>
    }
  );

  return (
    <Collapse in={Boolean(open)} timeout="auto" unmountOnExit>
      <MKBox width="calc(100% + 1.625rem)" my={2} ml={-1}>
        {renderNavbarItems}
      </MKBox>
      <MKBox
        ml={{ xs: "auto", lg: 0 }}
        display={{ xs: "flex", sm: "none" }}
        justifyContent="center"
        pb={2}
      >
        {action &&
          (action.type === "internal" ? (
            <MKButton
              component={Link}
              to={action.route}
              data-navbar-button="donate"
              variant={
                action.color === "success"
                  ? "contained"
                  : action.color === "white" || action.color === "default"
                  ? "contained"
                  : "gradient"
              }
              color={action.color === "success" ? "warning" : action.color ? action.color : "info"}
              size="small"
              ref={(el) => {
                // Directly set styles on DOM element immediately when created
                // This happens before Material-UI can override them
                if (el && typeof window !== "undefined" && action.color === "success") {
                  const element = el;
                  // Use setProperty with important flag to override any existing styles
                  element.style.setProperty("background-color", "#4FA953", "important");
                  element.style.setProperty("color", "white", "important");
                  element.style.setProperty(
                    "box-shadow",
                    "0 6px 20px rgba(79, 169, 83, 0.35), 0 3px 10px rgba(79, 169, 83, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    "important"
                  );
                  element.style.setProperty("display", "inline-flex", "important");
                  element.style.setProperty("align-items", "center", "important");
                  element.style.setProperty("justify-content", "center", "important");
                  element.style.setProperty("cursor", "pointer", "important");
                  element.style.setProperty("font-weight", "700", "important");
                  element.style.setProperty("position", "relative", "important");
                  element.style.setProperty("overflow", "hidden", "important");
                  // Set responsive padding, font-size, and border-radius based on screen size
                  const width = window.innerWidth;
                  if (width < 600) {
                    element.style.setProperty("padding", "6px 14px", "important");
                    element.style.setProperty("font-size", "0.8rem", "important");
                    element.style.setProperty("border-radius", "10px", "important");
                  } else if (width < 960) {
                    element.style.setProperty("padding", "8px 20px", "important");
                    element.style.setProperty("font-size", "0.85rem", "important");
                    element.style.setProperty("border-radius", "12px", "important");
                  } else {
                    element.style.setProperty("padding", "10px 24px", "important");
                    element.style.setProperty("font-size", "0.95rem", "important");
                    element.style.setProperty("border-radius", "14px", "important");
                  }
                }
              }}
              style={
                action.color === "success"
                  ? {
                      // Critical inline styles that must load immediately (before CSS)
                      backgroundColor: "#4FA953",
                      color: "white",
                      boxShadow:
                        "0 6px 20px rgba(79, 169, 83, 0.35), 0 3px 10px rgba(79, 169, 83, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontWeight: "700",
                      position: "relative",
                      overflow: "hidden",
                      // Base padding, font-size, and border-radius - responsive values will be applied via sx prop after Material-UI loads
                      padding:
                        typeof window !== "undefined" && window.innerWidth < 600
                          ? "6px 14px"
                          : typeof window !== "undefined" && window.innerWidth < 960
                          ? "8px 20px"
                          : "10px 24px",
                      fontSize:
                        typeof window !== "undefined" && window.innerWidth < 600
                          ? "0.8rem"
                          : typeof window !== "undefined" && window.innerWidth < 960
                          ? "0.85rem"
                          : "0.95rem",
                      borderRadius:
                        typeof window !== "undefined" && window.innerWidth < 600
                          ? "10px"
                          : typeof window !== "undefined" && window.innerWidth < 960
                          ? "12px"
                          : "14px",
                    }
                  : {}
              }
              sx={
                action.color === "success"
                  ? {
                      // Removed backgroundColor, color, boxShadow from sx to prevent Material-UI from overriding inline styles
                      fontWeight: "bold",
                      textTransform: "none",
                      letterSpacing: "0.5px",
                      padding: { xs: "6px 14px", md: "8px 20px", lg: "10px 24px" },
                      fontSize: { xs: "0.8rem", md: "0.85rem", lg: "0.95rem" },
                      borderRadius: { xs: "10px", md: "12px", lg: "14px" },
                      boxShadow: "0 4px 12px rgba(79, 169, 83, 0.4)",
                      "&:hover": {
                        backgroundColor: "#3d8a41",
                        boxShadow: "0 6px 16px rgba(79, 169, 83, 0.5)",
                        transform: "translateY(-1px)",
                      },
                    }
                  : {}
              }
            >
              {action.label}
            </MKButton>
          ) : (
            <MKButton
              component="a"
              href={action.route}
              target="_blank"
              rel="noreferrer"
              variant={
                action.color === "success"
                  ? "contained"
                  : action.color === "white" || action.color === "default"
                  ? "contained"
                  : "gradient"
              }
              color={action.color === "success" ? "warning" : action.color ? action.color : "info"}
              size="small"
              sx={
                action.color === "success"
                  ? {
                      backgroundColor: "#4FA953",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.95rem",
                      textTransform: "none",
                      letterSpacing: "0.5px",
                      padding: "8px 20px",
                      boxShadow: "0 4px 12px rgba(79, 169, 83, 0.4)",
                      "&:hover": {
                        backgroundColor: "#3d8a41",
                        boxShadow: "0 6px 16px rgba(79, 169, 83, 0.5)",
                        transform: "translateY(-1px)",
                      },
                    }
                  : {}
              }
            >
              {action.label}
            </MKButton>
          ))}
      </MKBox>
    </Collapse>
  );
}

// Typechecking props for the DefaultNavbarMobile
DefaultNavbarMobile.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  action: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      type: PropTypes.oneOf(["external", "internal"]).isRequired,
      route: PropTypes.string.isRequired,
      color: PropTypes.oneOf([
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "dark",
        "light",
        "default",
        "white",
      ]),
      label: PropTypes.string.isRequired,
    }),
  ]),
};

export default DefaultNavbarMobile;
