import { Fragment, useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

// react-router components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import LanguageSelector from "components/language-selector";

// Material Kit 2 React example components
import DefaultNavbarDropdown from "examples/Navbars/DefaultNavbar/DefaultNavbarDropdown";
import DefaultNavbarMobile from "examples/Navbars/DefaultNavbar/DefaultNavbarMobile";

// Material Kit 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";
import aadarLogo from "assets/images/logos/logo-aadar.jpg";

function DefaultNavbar({
  // brand,
  routes,
  transparent,
  light,
  action,
  sticky,
  relative,
  center,
}) {
  const [dropdown, setDropdown] = useState("");
  const [dropdownEl, setDropdownEl] = useState("");
  const [dropdownName, setDropdownName] = useState("");
  const [nestedDropdown, setNestedDropdown] = useState("");
  const [nestedDropdownEl, setNestedDropdownEl] = useState("");
  const [nestedDropdownName, setNestedDropdownName] = useState("");
  const [arrowRef, setArrowRef] = useState(null);
  const [mobileNavbar, setMobileNavbar] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const openMobileNavbar = () => setMobileNavbar(!mobileNavbar);

  const { t } = useTranslation();
  const donateBtn = t("navbar.donateBtn");

  useEffect(() => {
    // A function that sets the display state for the DefaultNavbarMobile.
    function displayMobileNavbar() {
      if (window.innerWidth < breakpoints.values.lg) {
        setMobileView(true);
        setMobileNavbar(false);
      } else {
        setMobileView(false);
        setMobileNavbar(false);
      }
    }

    /**
     The event listener that's calling the displayMobileNavbar function when
     resizing the window.
    */
    window.addEventListener("resize", displayMobileNavbar);

    // Call the displayMobileNavbar function to set the state with the initial value.
    displayMobileNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", displayMobileNavbar);
  }, []);

  const renderNavbarItems = routes.map(({ name, icon, href, route, collapse }) => {
    // return (
    if (name !== "Privacy policy" && name !== "Terms Conditions" && name !== "Donate") {
      return (
        <>
          <DefaultNavbarDropdown
            key={name}
            name={name}
            // name={navbar.name}
            icon={icon}
            href={href}
            route={route}
            collapse={Boolean(collapse)}
            onMouseEnter={({ currentTarget }) => {
              if (collapse) {
                setDropdown(currentTarget);
                setDropdownEl(currentTarget);
                setDropdownName(name);
              }
            }}
            onMouseLeave={() => collapse && setDropdown(null)}
            light={light}
          />
        </>
      );
    }

    // )
  });

  // const renderNavbarItems = routes.map(({ name, icon, href, route, collapse }) => (
  //   <DefaultNavbarDropdown
  //     key={name}
  //     name={name}
  //     icon={icon}
  //     href={href}
  //     route={route}
  //     collapse={Boolean(collapse)}
  //     onMouseEnter={({ currentTarget }) => {
  //       if (collapse) {
  //         setDropdown(currentTarget);
  //         setDropdownEl(currentTarget);
  //         setDropdownName(name);
  //       }
  //     }}
  //     onMouseLeave={() => collapse && setDropdown(null)}
  //     light={light}
  //   />
  // ));

  // Render the routes on the dropdown menu
  const renderRoutes = routes.map(({ name, collapse, columns, rowsPerColumn }) => {
    let template;

    // Render the dropdown menu that should be display as columns
    if (collapse && columns && name === dropdownName) {
      const calculateColumns = collapse.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / rowsPerColumn);

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
      }, []);

      template = (
        <Grid key={name} container spacing={3} py={1} px={1.5}>
          {calculateColumns.map((cols, key) => {
            const gridKey = `grid-${key}`;
            const dividerKey = `divider-${key}`;

            return (
              <Grid key={gridKey} item xs={12 / columns} sx={{ position: "relative" }}>
                {cols.map((col, index) => (
                  <Fragment key={col.name}>
                    <MKTypography
                      display="block"
                      variant="button"
                      fontWeight="bold"
                      textTransform="capitalize"
                      py={1}
                      px={0.5}
                      mt={index !== 0 ? 2 : 0}
                    >
                      {col.name}
                    </MKTypography>
                    {col.collapse.map((item) => (
                      <MKTypography
                        key={item.name}
                        component={item.route ? Link : MuiLink}
                        to={item.route ? item.route : ""}
                        href={item.href ? item.href : (e) => e.preventDefault()}
                        target={item.href ? "_blank" : ""}
                        rel={item.href ? "noreferrer" : "noreferrer"}
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
                        {item.name}
                      </MKTypography>
                    ))}
                  </Fragment>
                ))}
                {key !== 0 && (
                  <Divider
                    key={dividerKey}
                    orientation="vertical"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "-4px",
                      transform: "translateY(-45%)",
                      height: "90%",
                    }}
                  />
                )}
              </Grid>
            );
          })}
        </Grid>
      );

      // Render the dropdown menu that should be display as list items
    } else if (collapse && name === dropdownName) {
      template = collapse.map((item) => {
        const linkComponent = {
          component: MuiLink,
          href: item.href,
          target: "_blank",
          rel: "noreferrer",
        };

        const routeComponent = {
          component: Link,
          to: item.route,
        };

        return (
          <MKTypography
            key={item.name}
            {...(item.route ? routeComponent : linkComponent)}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            variant="button"
            textTransform="capitalize"
            minWidth={item.description ? "14rem" : "12rem"}
            color={item.description ? "dark" : "text"}
            fontWeight={item.description ? "bold" : "regular"}
            py={item.description ? 1 : 0.625}
            px={2}
            sx={({ palette: { grey, dark }, borders: { borderRadius } }) => ({
              borderRadius: borderRadius.md,
              cursor: "pointer",
              transition: "all 300ms linear",

              "&:hover": {
                backgroundColor: grey[200],
                color: dark.main,

                "& *": {
                  color: dark.main,
                },
              },
            })}
            onMouseEnter={({ currentTarget }) => {
              if (item.dropdown) {
                setNestedDropdown(currentTarget);
                setNestedDropdownEl(currentTarget);
                setNestedDropdownName(item.name);
              }
            }}
            onMouseLeave={() => {
              if (item.dropdown) {
                setNestedDropdown(null);
              }
            }}
          >
            {item.description ? (
              <MKBox>
                {item.name}
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
            ) : (
              item.name
            )}
            {item.collapse && (
              <Icon
                fontSize="small"
                sx={{ fontWeight: "normal", verticalAlign: "middle", mr: -0.5 }}
              >
                keyboard_arrow_right
              </Icon>
            )}
          </MKTypography>
        );
      });
    }

    return template;
  });

  // Routes dropdown menu
  const dropdownMenu = (
    <Popper
      anchorEl={dropdown}
      popperRef={null}
      open={Boolean(dropdown)}
      placement="top-start"
      transition
      style={{ zIndex: 10 }}
      modifiers={[
        {
          name: "arrow",
          enabled: true,
          options: {
            element: arrowRef,
          },
        },
      ]}
      onMouseEnter={() => setDropdown(dropdownEl)}
      onMouseLeave={() => {
        if (!nestedDropdown) {
          setDropdown(null);
          setDropdownName("");
        }
      }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          sx={{
            transformOrigin: "left top",
            background: ({ palette: { white } }) => white.main,
          }}
        >
          <MKBox borderRadius="lg">
            <MKTypography variant="h1" color="white">
              <Icon ref={setArrowRef} sx={{ mt: -3 }}>
                arrow_drop_up
              </Icon>
            </MKTypography>
            <MKBox shadow="lg" borderRadius="lg" p={2} mt={2}>
              {renderRoutes}
            </MKBox>
          </MKBox>
        </Grow>
      )}
    </Popper>
  );

  // Render routes that are nested inside the dropdown menu routes
  const renderNestedRoutes = routes.map(({ collapse, columns }) =>
    collapse && !columns
      ? collapse.map(({ name: parentName, collapse: nestedCollapse }) => {
          let template;

          if (parentName === nestedDropdownName) {
            template =
              nestedCollapse &&
              nestedCollapse.map((item) => {
                const linkComponent = {
                  component: MuiLink,
                  href: item.href,
                  target: "_blank",
                  rel: "noreferrer",
                };

                const routeComponent = {
                  component: Link,
                  to: item.route,
                };

                return (
                  <MKTypography
                    key={item.name}
                    {...(item.route ? routeComponent : linkComponent)}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    variant="button"
                    textTransform="capitalize"
                    minWidth={item.description ? "14rem" : "12rem"}
                    color={item.description ? "dark" : "text"}
                    fontWeight={item.description ? "bold" : "regular"}
                    py={item.description ? 1 : 0.625}
                    px={2}
                    sx={({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                      borderRadius: borderRadius.md,
                      cursor: "pointer",
                      transition: "all 300ms linear",

                      "&:hover": {
                        backgroundColor: grey[200],
                        color: dark.main,

                        "& *": {
                          color: dark.main,
                        },
                      },
                    })}
                  >
                    {item.description ? (
                      <MKBox>
                        {item.name}
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
                    ) : (
                      item.name
                    )}
                    {item.collapse && (
                      <Icon
                        fontSize="small"
                        sx={{ fontWeight: "normal", verticalAlign: "middle", mr: -0.5 }}
                      >
                        keyboard_arrow_right
                      </Icon>
                    )}
                  </MKTypography>
                );
              });
          }

          return template;
        })
      : null
  );

  // Dropdown menu for the nested dropdowns
  const nestedDropdownMenu = (
    <Popper
      anchorEl={nestedDropdown}
      popperRef={null}
      open={Boolean(nestedDropdown)}
      placement="right-start"
      transition
      style={{ zIndex: 10 }}
      onMouseEnter={() => {
        setNestedDropdown(nestedDropdownEl);
      }}
      onMouseLeave={() => {
        setNestedDropdown(null);
        setNestedDropdownName("");
        setDropdown(null);
      }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          sx={{
            transformOrigin: "left top",
            background: ({ palette: { white } }) => white.main,
          }}
        >
          <MKBox ml={2.5} mt={-2.5} borderRadius="lg">
            <MKBox shadow="lg" borderRadius="lg" py={1.5} px={1} mt={2}>
              {renderNestedRoutes}
            </MKBox>
          </MKBox>
        </Grow>
      )}
    </Popper>
  );

  const navbar = t("navbar");

  return (
    <Container
      sx={
        sticky
          ? { position: "sticky", top: 0, zIndex: 10, minWidth: "320px", margin: "auto" }
          : null
      }
    >
      {/* <MKBox sx={sticky ? { position: "sticky", top: 0, zIndex: 10, margin: "0 auto" } : null}> */}
      <MKBox
        // py={1}
        // pl={{ xs: 0.5, sm: 2 }}
        // px={{ xs: 4, sm: transparent ? 2 : 3, lg: transparent ? 0 : 2 }}
        my={relative ? 0 : 2}
        mx={relative ? 0 : 1.5}
        // width="100%"
        width={relative ? "100%" : "calc(100% - 24px)"}
        borderRadius="xl"
        shadow={transparent ? "none" : "md"}
        color={light ? "white" : "dark"}
        position={relative ? "relative" : "absolute"}
        // position={"absolute"}
        // left={0}
        right={0}
        zIndex={3}
        sx={({ palette: { transparent: transparentColor, primary }, functions: { rgba } }) => ({
          backgroundColor: transparent ? transparentColor.main : rgba(primary.main, 0.8),
          backdropFilter: transparent ? "none" : `saturate(200%) blur(10px)`,
        })}
        // sx={({ palette: { transparent: transparentColor, grey } }) => ({
        //   backgroundColor: transparent ? transparentColor.main : grey[400],
        //   backdropFilter: transparent ? "none" : `saturate(200%) blur(30px)`,
        // })}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* <MKAvatar src={aadarLogo} alt="xl" size="xl" /> */}
        <MKBox
          // component={Link}
          // to="/"
          lineHeight={1}
          // py={transparent ? 1.5 : 0.75}
          pl={relative || transparent ? 0 : { xs: 1, sm: 1, md: 1.5, lg: 2.5 }}
          borderRadius="xl"
          display="flex"
        >
          <MKBox
            component="img"
            src={aadarLogo}
            width={{ xs: "50px", sm: "70px", md: "80px", lg: "80px", xl: "90px" }}
            borderRadius="10px"
            my={1}
          />

          {/* <img src={aadarLogo} width="130px" /> */}
          {/* <MKBox
            component={Link}
            to="/"
            lineHeight={1}
            py={transparent ? 1.5 : 0.75}
            pl={relative || transparent ? 0 : { xs: 0, lg: 1 }}
            display="flex"
            flexDirection="column"
          >
            <MKTypography
              variant="button"
              fontWeight="bold"
              color={light ? "white" : "dark"}
              fontSize="20px"
            >
              {brand}
            </MKTypography>
            <MKTypography
              variant="button"
              fontWeight="light"
              color={light ? "white" : "dark"}
              fontSize="14px"
            >
              A Home for Homeless & Unclaimed People
            </MKTypography>
          </MKBox> */}
        </MKBox>
        <MKBox
          // py={1}
          px={{ xs: 2, sm: transparent ? 2 : 3, lg: transparent ? 0 : 2 }}
          my={relative ? 0 : 2}
          mx={relative ? 0 : { xs: 1, sm: 1, md: 3 }}
          width={relative ? "95%" : "calc(95% - 48px)"}
          borderRadius="xl"
          shadow={transparent ? "none" : "md"}
          color={light ? "white" : "dark"}
          // position={relative ? "relative" : "absolute"}
          position="relative"
          top={0}
          // left={0}
          right={0}
          zIndex={3}
          sx={({ palette: { transparent: transparentColor, grey } }) => ({
            backgroundColor: transparent ? transparentColor.main : grey[100],
            backdropFilter: transparent ? "none" : `saturate(200%) blur(30px)`,
          })}
        >
          <MKBox
            sx={{ backgroundColor: "#f0f2f5" }}
            width="100%"
            display="flex"
            justifyContent="end"
            alignItems="center"
            mx="auto"
          >
            {/* <MKTypography
              component="a"
              href={"https://www.youtube.com/@AadarFoundation/"}
              target="_blank"
              rel="noreferrer"
              variant="h5"
              // color="dark"
              color="text"
              opacity={0.8}
              mr={2}
              sx={{
                "&:hover": {
                  color: "#E7A232",
                  textDecoration: "underline 2px",
                },
              }}
              height="20px"
            >
              <YouTubeIcon />
            </MKTypography>
            <MKTypography
              component="a"
              href={"https://www.instagram.com/ashramswargsadangwalior/"}
              target="_blank"
              rel="noreferrer"
              variant="h5"
              // color="dark"
              color="text"
              opacity={0.8}
              mr={2}
              sx={{
                "&:hover": {
                  color: "#E7A232",
                  textDecoration: "underline 2px",
                },
              }}
              height="20px"
            >
              <InstagramIcon />
            </MKTypography>
            <MKTypography
              component="a"
              href={"https://www.facebook.com/AshramSwargSadanGwalior/"}
              target="_blank"
              rel="noreferrer"
              variant="h5"
              // color="dark"
              color="text"
              opacity={0.8}
              mr={2}
              sx={{
                "&:hover": {
                  color: "#E7A232",
                  textDecoration: "underline 2px",
                },
              }}
              height="20px"
            >
              <FacebookIcon />
            </MKTypography> */}

            <MKTypography
              variant="button"
              fontWeight="light"
              lineHeight={1.25}
              color={light ? "white" : "dark"}
              display={{ xs: "inline", sm: "inline", md: "inline", lg: "inline" }}
              fontSize={{
                xs: "0.75rem",
                sm: "0.68rem",
                md: "0.75rem",
                lg: "0.8rem",
                xl: "0.8rem",
              }}
              pr={1}
              pl={4}
            >
              <LanguageSelector />
            </MKTypography>
          </MKBox>
          <MKBox display="flex" justifyContent="space-between" alignItems="center">
            <MKBox
              // component={Link}
              // to="/"
              lineHeight={1}
              py={transparent ? 1.5 : 0.75}
              pl={relative || transparent ? 0 : { xs: 0, lg: 1 }}
              display="flex"
              flexDirection="column"
              maxWidth={{ xs: "200px", md: "220px", lg: "200px", xl: "250px" }}
            >
              <MKTypography
                variant="button"
                fontWeight="bold"
                color={light ? "white" : "dark"}
                fontSize={{
                  xs: "1rem",
                  sm: "1rem",
                  md: "1.125rem",
                  lg: "1.125rem",
                  xl: "1.25rem",
                }}
                lineHeight={1.25}
              >
                {navbar.title}
              </MKTypography>

              <MKTypography
                variant="button"
                fontWeight="light"
                lineHeight={1.25}
                color={light ? "white" : "dark"}
                display={{ xs: "inline", sm: "inline", md: "inline", lg: "inline" }}
                fontSize={{
                  xs: "0.68rem",
                  sm: "0.68rem",
                  md: "0.75rem",
                  lg: "0.8rem",
                  xl: "0.8rem",
                }}
                pt={0.25}
              >
                {navbar.subTitle}
              </MKTypography>

              {/* <MKBox display="flex" alignItems="center">
                <MKTypography
                  variant="button"
                  fontWeight="regular"
                  textTransform="capitalize"
                  color={light ? "light" : "dark"}
                  sx={{
                    fontSize: { sm: "0.8", md: "0.875rem", lg: "0.8rem", xl: "0.9rem" },
                    fontWeight: "100%",
                    mr: 0.8,
                    ml: 2,
                    // "&:hover": { color: "#E7A232", textDecoration: "underline 2px" },
                  }}
                >
                  <LanguageSelector />
                </MKTypography>
              </MKBox> */}
            </MKBox>

            <MKBox
              color="inherit"
              display={{ xs: "none", lg: "flex" }}
              ml="auto"
              mr={center ? "auto" : 2}
            >
              {renderNavbarItems}
            </MKBox>
            <MKBox
              mx={1}
              p={0.5}
              display="flex"
              alignItems="baseline"
              color={light ? "light" : "dark"}
              opacity={light ? 1 : 0.6}
              sx={{
                cursor: "pointer",
                userSelect: "none",
                "&: hover": { color: "#E7A232", textDecoration: "underline 2px" },
              }}
            >
              {/* <MKTypography
                  variant="body2"
                  lineHeight={1}
                  color="inherit"
                  sx={{ alignSelf: "center", "& *": { verticalAlign: "middle" } }}
                >
                  {icon}
                </MKTypography> */}
              {/* <MKTypography
                variant="button"
                fontWeight="regular"
                textTransform="capitalize"
                color={light ? "light" : "dark"}
                sx={{
                  fontSize: { sm: "0.8", md: "0.875rem", lg: "0.8rem", xl: "0.9rem" },
                  fontWeight: "100%",
                  mr: 0.8,
                  // "&:hover": { color: "#E7A232", textDecoration: "underline 2px" },
                }}
                width="100%"
              >
                <LanguageSelector />
              </MKTypography> */}
            </MKBox>

            {/* Donate button */}
            <MKBox display="flex" alignItems="center">
              {/* <MKTypography
                variant="button"
                fontWeight="regular"
                textTransform="capitalize"
                color={light ? "light" : "dark"}
                sx={{
                  fontSize: { sm: "0.8", md: "0.875rem", lg: "0.8rem", xl: "0.9rem" },
                  fontWeight: "100%",
                  mr: 1.5,
                  // "&:hover": { color: "#E7A232", textDecoration: "underline 2px" },
                }}
                width="100%"
              >
                <LanguageSelector />
              </MKTypography> */}
              {/* <MKButton
                component={Link}
                to={"/pages/landing-pages/donate"}
                variant="contained"
                color="success"
                size="small"
                sx={{ padding: { md: "10px 15px", lg: "10px 15px", xl: "10px 20px" } }}
              >
                Donate
              </MKButton> */}

              <MKBox ml={{ xs: "auto", lg: 0 }} display={{ xs: "none", sm: "block" }}>
                {action &&
                  (action.type === "internal" ? (
                    <MKButton
                      component={Link}
                      to={action.route}
                      variant={
                        action.color === "success"
                          ? "contained"
                          : action.color === "white" || action.color === "default"
                          ? "contained"
                          : "gradient"
                      }
                      color={
                        action.color === "success"
                          ? "warning"
                          : action.color
                          ? action.color
                          : "info"
                      }
                      size="small"
                      sx={
                        action.color === "success"
                          ? {
                              backgroundColor: "#FFC107",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "0.875rem",
                              textTransform: "none",
                              letterSpacing: "0.5px",
                              "&:hover": {
                                backgroundColor: "#7FA80C",
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
                      color={
                        action.color === "success"
                          ? "warning"
                          : action.color
                          ? action.color
                          : "info"
                      }
                      size="small"
                      sx={
                        action.color === "success"
                          ? {
                              backgroundColor: "#FFC107",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "0.875rem",
                              textTransform: "none",
                              letterSpacing: "0.5px",
                              "&:hover": {
                                backgroundColor: "#7FA80C",
                              },
                            }
                          : {}
                      }
                    >
                      {action.label}
                    </MKButton>
                  ))}
              </MKBox>

              <MKBox
                display={{ xs: "inline-block", lg: "none" }}
                lineHeight={0}
                py={1.5}
                pl={1.5}
                color={transparent ? "white" : "inherit"}
                sx={{ cursor: "pointer" }}
                onClick={openMobileNavbar}
              >
                <Icon fontSize="default">{mobileNavbar ? "close" : "menu"}</Icon>
              </MKBox>
            </MKBox>

            {/* <MKBox
              display={{ xs: "inline-block", lg: "none" }}
              lineHeight={0}
              py={1.5}
              pl={1.5}
              color={transparent ? "white" : "inherit"}
              sx={{ cursor: "pointer" }}
              onClick={openMobileNavbar}
            >
              <Icon fontSize="default">{mobileNavbar ? "close" : "menu"}</Icon>
            </MKBox> */}
          </MKBox>

          <MKBox
            bgColor={transparent ? "white" : "transparent"}
            shadow={transparent ? "lg" : "none"}
            borderRadius="xl"
            px={transparent ? 2 : 0}
          >
            {mobileView && (
              <DefaultNavbarMobile
                routes={routes}
                open={mobileNavbar}
                action={{
                  type: "internal",
                  route: "/pages/landing-pages/donate",
                  label: donateBtn,
                  color: "success",
                }}
              />
            )}
          </MKBox>
        </MKBox>

        {/* <MKBox
          py={1}
          px={{ xs: 4, sm: transparent ? 2 : 3, lg: transparent ? 0 : 2 }}
          my={relative ? 0 : 2}
          mx={relative ? 0 : 3}
          width={relative ? "50%" : "calc(50% - 48px)"}
          height={"30%"}
          borderRadius="xl"
          // shadow={transparent ? "none" : "md"}
          color={light ? "white" : "dark"}
          position={relative ? "relative" : "absolute"}
          margin={0}
          // left={0}
          bottom={0}
          right={0}
          zIndex={3}
          fontSize="14px"
          display="flex"
          gap="20px"
          justifyContent="right"
          alignItems="center"
          // sx={({ palette: { transparent: transparentColor, grey } }) => ({
          //   backgroundColor: transparent ? transparentColor.main : grey[300],
          //   backdropFilter: transparent ? "none" : `saturate(100%) blur(30px)`,
          // })}
        >
          <MKBox display="flex" gap="20px" fontSize="12px" padding={"0 20px 0 0"}>
            <p>+91 2345678901</p>
            <p>aadar123@gmail.com</p>
          </MKBox>
        </MKBox> */}

        {dropdownMenu}
        {nestedDropdownMenu}
        {/* <MKBox
          // py={1}
          // px={{ xs: 4, sm: transparent ? 2 : 3, lg: transparent ? 0 : 2 }}
          my={relative ? 0 : 2}
          mx={relative ? 0 : 3}
          // width={relative ? "85%" : "calc(85% - 48px)"}
          borderRadius="xl"
          // shadow={transparent ? "none" : "md"}
          color={light ? "white" : "dark"}
          position={relative ? "relative" : "absolute"}
          bottom={0}
          // top={0}
          // left={0}
          right={0}
          zIndex={3}
          // sx={({ palette: { transparent: transparentColor, grey } }) => ({
          //   backgroundColor: transparent ? transparentColor.main : grey[100],
          //   backdropFilter: transparent ? "none" : `saturate(200%) blur(30px)`,
          // })}
        >
          <p>8989021190</p>
        </MKBox> */}
      </MKBox>
      {/* <MKBox
        py={1}
        px={{ xs: 4, sm: transparent ? 2 : 3, lg: transparent ? 0 : 2 }}
        my={relative ? 0 : 16}
        mx={relative ? 0 : 3}
        // width={relative ? "50%" : "calc(50% - 48px)"}
        borderRadius="xl"
        // shadow={transparent ? "none" : "md"}
        color={light ? "white" : "dark"}
        // position={relative ? "relative" : "absolute"}
        position={"absolute"}
        // left={0}
        right={0}
        zIndex={4}

        // sx={({ palette: { transparent: transparentColor, grey } }) => ({
        //   backgroundColor: transparent ? transparentColor.main : grey[400],
        //   backdropFilter: transparent ? "none" : `saturate(200%) blur(30px)`,
        // })}
      >
        <MKTypography fontSize="12px">
          <MKBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="10px"
            // fontSize="12px"
            sx={{ color: "#888888" }}
          >
            <CallRoundedIcon fontSize="small" />
            <span>9039129571</span>

            <EmailRoundedIcon fontSize="small" />
            <span>aadar1234@gmail.com</span>
          </MKBox>
        </MKTypography>
      </MKBox> */}
      {/* </MKBox> */}
    </Container>
  );
}

// Setting default values for the props of DefaultNavbar
DefaultNavbar.defaultProps = {
  brand: "Aadar Foundation",
  transparent: false,
  light: false,
  action: false,
  sticky: false,
  relative: false,
  center: false,
};

// Typechecking props for the DefaultNavbar
DefaultNavbar.propTypes = {
  brand: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.shape).isRequired,
  transparent: PropTypes.bool,
  light: PropTypes.bool,
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
  sticky: PropTypes.bool,
  relative: PropTypes.bool,
  center: PropTypes.bool,
};

export default DefaultNavbar;
