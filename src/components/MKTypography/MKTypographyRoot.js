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

// @mui material components
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export default styled(Typography)(({ theme, ownerState }) => {
  const { palette = {}, typography = {}, functions = {} } = theme || {};
  const { color, textTransform, verticalAlign, fontWeight, opacity, textGradient } = ownerState;

  const { gradients = {}, transparent = { main: "transparent" } } = palette;
  const { fontWeightLight, fontWeightRegular, fontWeightMedium, fontWeightBold } = typography;
  const linearGradient =
    functions.linearGradient ||
    ((colorA, colorB, angle = 195) => `linear-gradient(${angle}deg, ${colorA}, ${colorB})`);

  // fontWeight styles
  const fontWeights = {
    light: fontWeightLight,
    regular: fontWeightRegular,
    medium: fontWeightMedium,
    bold: fontWeightBold,
  };

  // styles for the typography with textGradient={true}
  const gradientStyles = () => {
    let backgroundImageValue = "none";

    const canUseColorGradient =
      color !== "inherit" && color !== "text" && color !== "white" && Boolean(gradients[color]);

    if (canUseColorGradient) {
      backgroundImageValue = linearGradient(gradients[color].main, gradients[color].state);
    } else if (gradients.dark) {
      backgroundImageValue = linearGradient(gradients.dark.main, gradients.dark.state);
    }

    return {
      backgroundImage: backgroundImageValue,
      display: "inline-block",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: transparent.main,
      position: "relative",
      zIndex: 1,
    };
  };

  // color value
  const colorValue = color === "inherit" || !palette[color] ? "inherit" : palette[color].main;

  return {
    opacity,
    textTransform,
    verticalAlign,
    textDecoration: "none",
    color: colorValue,
    letterSpacing: "-0.125px",
    fontWeight: fontWeights[fontWeight] && fontWeights[fontWeight],
    ...(textGradient && gradientStyles()),
  };
});
