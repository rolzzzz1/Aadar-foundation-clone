import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import DonateTrustBanner from "pages/LandingPages/shared/DonateTrustBanner";
import donateCareIllustration from "assets/images/donate-care-illustration.png";
import { sanitizeAmountInput } from "utils/donation";

function DonateGivingBody({
  donatePage,
  selectedAmount,
  setSelectedAmount,
  customAmount,
  setCustomAmount,
  scrollToDonateWidget,
  isMealSponsorshipSelected,
  amountCheck,
  donateCheckoutNav,
  checkoutIsReady,
}) {
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <MKTypography
            variant="h4"
            fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
            sx={{
              fontWeight: "500",
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "1.875rem", lg: "1.875rem" },
            }}
            pt={{ xs: 1, sm: 1.25, md: 1.5 }}
            pb={{ xs: 2.75, sm: 3.25, md: 3.75 }}
          >
            {donatePage.title}
          </MKTypography>
        </Grid>
      </Grid>

      <Grid
        container
        pt={{ xs: 0.5, sm: 1, md: 1.25 }}
        spacing={{ xs: 3, md: 5, lg: 6 }}
        alignItems="stretch"
      >
        <Grid item xs={12} lg={6} xl={6} sx={{ display: "flex", alignSelf: { lg: "flex-start" } }}>
          <MKBox
            sx={{
              position: "relative",
              pr: { xs: 0, sm: 0, md: 2, lg: 3 },
              maxWidth: 720,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <MKBox
              component="img"
              src={donateCareIllustration}
              alt=""
              aria-hidden="true"
              sx={{
                position: "absolute",
                top: { xs: 16, sm: 20, md: 18, lg: 20 },
                right: { xs: -16, sm: -12, md: -8, lg: -28, xl: -36 },
                width: { xs: 130, sm: 160, md: 200, lg: 235, xl: 250 },
                height: "auto",
                opacity: { xs: 0.55, sm: 0.7, md: 0.82, lg: 0.85 },
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 0,
                objectFit: "contain",
              }}
            />
            <MKTypography
              component="h1"
              sx={{
                position: "relative",
                zIndex: 1,
                fontFamily: '"Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
                fontWeight: 600,
                fontSize: { xs: "1.35rem", sm: "1.5rem", md: "1.6rem", lg: "1.7rem" },
                lineHeight: 1.25,
                color: "#1A2B4C",
                letterSpacing: "-0.01em",
                mt: { xs: 1, sm: 1.25, md: 1.5 },
                maxWidth: { xs: "70%", sm: "68%", md: "62%", lg: "58%" },
              }}
            >
              {donatePage.heroHeadlineLead || "Your action today has"}
              <br />
              <MKBox
                component="span"
                sx={{
                  display: "inline",
                  fontFamily:
                    '"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500,
                  fontSize: {
                    xs: "1.4rem",
                    sm: "1.55rem",
                    md: "1.65rem",
                    lg: "1.75rem",
                  },
                  color: "#ECA533",
                  lineHeight: 1.35,
                }}
              >
                {donatePage.heroHeadlineAccent || "the power to transform a life."}
              </MKBox>
            </MKTypography>

            <MKTypography
              variant="body1"
              fontSize={{ xs: "0.88rem", sm: "0.92rem", md: "0.95rem" }}
              fontFamily='"Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
              sx={{
                position: "relative",
                zIndex: 1,
                letterSpacing: "0.01rem",
                lineHeight: 1.5,
                color: "rgba(31, 42, 68, 0.72)",
                maxWidth: { xs: "100%", sm: 400, md: 380 },
                mt: { xs: 1, sm: 1.15 },
              }}
            >
              {donatePage.description}
            </MKTypography>

            <MKBox
              sx={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                maxWidth: 640,
                mt: { xs: 2, sm: 2.25, md: 2.5 },
              }}
            >
              <MKTypography
                component="h2"
                sx={{
                  fontFamily: '"Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: "0.78rem", sm: "0.82rem" },
                  letterSpacing: "0.02em",
                  color: "rgba(31, 42, 68, 0.55)",
                  mb: { xs: 1.25, sm: 1.35 },
                }}
              >
                {donatePage.quickGiveCards.heading || "Ways to Support"}
              </MKTypography>
              <Grid container spacing={{ xs: 0.85, sm: 1.25 }} sx={{ maxWidth: 640 }}>
                {[
                  {
                    id: "membership",
                    Icon: PersonOutlineIcon,
                    ...donatePage.quickGiveCards.membership,
                    isActive: selectedAmount === 501 && !customAmount,
                    onActivate: () => {
                      setCustomAmount("");
                      setSelectedAmount(501);
                      scrollToDonateWidget();
                    },
                  },
                  {
                    id: "mealSponsorship",
                    Icon: RestaurantOutlinedIcon,
                    ...donatePage.quickGiveCards.mealSponsorship,
                    isActive: isMealSponsorshipSelected,
                    onActivate: () => {
                      setSelectedAmount(1500);
                      setCustomAmount("1500");
                      scrollToDonateWidget();
                    },
                  },
                  {
                    id: "monthlyCare",
                    Icon: VolunteerActivismOutlinedIcon,
                    ...donatePage.quickGiveCards.monthlyCare,
                    isActive: selectedAmount === 3001 && !customAmount,
                    onActivate: () => {
                      setCustomAmount("");
                      setSelectedAmount(3001);
                      scrollToDonateWidget();
                    },
                  },
                ].map(({ id, Icon, title, subtitle, amount, period, isActive, onActivate }) => (
                  <Grid item xs={12} sm={4} key={id}>
                    <MKBox
                      component="button"
                      type="button"
                      onClick={onActivate}
                      aria-pressed={isActive}
                      display="flex"
                      flexDirection="column"
                      pl={1.75}
                      pr={1.5}
                      py={{ xs: 0.95, sm: 1 }}
                      sx={{
                        width: "100%",
                        textAlign: "left",
                        backgroundColor: isActive ? "rgba(79, 169, 83, 0.06)" : "#ffffff",
                        borderRadius: "14px",
                        border: isActive
                          ? "1px solid rgba(79, 169, 83, 0.4)"
                          : "1px solid rgba(31, 42, 68, 0.06)",
                        boxShadow: isActive
                          ? "inset 3px 0 0 #4fa953, 0 8px 20px rgba(79, 169, 83, 0.12), 0 2px 5px rgba(31, 42, 68, 0.03)"
                          : "inset 3px 0 0 rgba(236, 165, 51, 0.45), 0 8px 20px rgba(31, 42, 68, 0.06), 0 2px 5px rgba(31, 42, 68, 0.03)",
                        height: "100%",
                        color: "inherit",
                        cursor: "pointer",
                        transition:
                          "box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease, background-color 0.18s ease",
                        "&:hover": {
                          borderColor: "rgba(79, 169, 83, 0.4)",
                          backgroundColor: isActive
                            ? "rgba(79, 169, 83, 0.09)"
                            : "rgba(79, 169, 83, 0.04)",
                          boxShadow: "inset 3px 0 0 #4fa953, 0 10px 24px rgba(31, 42, 68, 0.08)",
                          transform: "translateY(-1px)",
                          "& .quick-give-action": {
                            color: "#2e7d32",
                          },
                          "& .quick-give-action-arrow": {
                            transform: "translateX(3px)",
                          },
                        },
                        "&:focus-visible": {
                          outline: "2px solid #4fa953",
                          outlineOffset: 2,
                        },
                      }}
                    >
                      <MKBox display="flex" alignItems="flex-start" gap={1}>
                        <Icon
                          sx={{
                            color: "#4fa953",
                            fontSize: { xs: "1.4rem", sm: "1.45rem" },
                            width: { xs: "1.4rem", sm: "1.45rem" },
                            height: { xs: "1.4rem", sm: "1.45rem" },
                            flex: "0 0 auto",
                            mt: "1px",
                          }}
                        />
                        <MKBox sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                          <MKTypography
                            variant="button"
                            sx={{
                              fontWeight: 800,
                              fontSize: { xs: "0.76rem", sm: "0.8rem" },
                              lineHeight: 1.2,
                              letterSpacing: "0.01rem",
                              textTransform: "none",
                              color: "rgba(31, 42, 68, 0.82)",
                              overflowWrap: "normal",
                              wordBreak: "normal",
                              whiteSpace: id === "monthlyCare" ? "pre-line" : "normal",
                            }}
                          >
                            {title}
                          </MKTypography>
                          <MKTypography
                            sx={{
                              fontSize: { xs: "0.62rem", sm: "0.64rem" },
                              fontWeight: 500,
                              color: "rgba(31, 42, 68, 0.6)",
                              lineHeight: 1.2,
                              mt: "2px",
                              overflowWrap: "normal",
                              wordBreak: "normal",
                            }}
                          >
                            {subtitle}
                          </MKTypography>
                        </MKBox>
                      </MKBox>

                      <MKBox
                        sx={{
                          borderTop: "1px dashed rgba(31, 42, 68, 0.16)",
                          my: { xs: 0.65, sm: 0.7 },
                        }}
                      />

                      <MKBox
                        display="flex"
                        flexDirection="row"
                        alignItems="baseline"
                        flexWrap="wrap"
                        gap="5px"
                      >
                        <MKTypography
                          sx={{
                            fontSize: { xs: "0.72rem", sm: "0.78rem" },
                            fontWeight: 700,
                            color: "#4fa953",
                            lineHeight: 1.15,
                            fontVariantNumeric: "tabular-nums",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {amount}
                        </MKTypography>
                        {period && (
                          <MKTypography
                            sx={{
                              fontSize: { xs: "0.6rem", sm: "0.62rem" },
                              fontWeight: 500,
                              color: "rgba(31, 42, 68, 0.55)",
                              lineHeight: 1.15,
                            }}
                          >
                            {period}
                          </MKTypography>
                        )}
                      </MKBox>

                      <MKBox
                        className="quick-give-action"
                        display="flex"
                        alignItems="center"
                        gap={0.35}
                        sx={{
                          mt: 0.55,
                          color: isActive ? "#2e7d32" : "rgba(31, 42, 68, 0.5)",
                          transition: "color 0.18s ease",
                        }}
                      >
                        <MKTypography
                          sx={{
                            fontSize: "0.64rem",
                            fontWeight: 700,
                            lineHeight: 1,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {isActive
                            ? donatePage.quickGiveCards.selectedAction || "Selected"
                            : donatePage.quickGiveCards.selectAction || "Select"}
                        </MKTypography>
                        <ArrowForwardIcon
                          className="quick-give-action-arrow"
                          sx={{
                            fontSize: 12,
                            transition: "transform 0.18s ease",
                          }}
                        />
                      </MKBox>
                    </MKBox>
                  </Grid>
                ))}
              </Grid>
            </MKBox>
          </MKBox>
        </Grid>

        <Grid item xs={12} lg={6} xl={6} sx={{ display: "flex" }}>
          <MKBox
            sx={{
              maxWidth: 560,
              mx: { xs: "auto", lg: 0 },
              display: "flex",
              flexDirection: "column",
              flex: 1,
              width: "100%",
              minHeight: 0,
            }}
          >
            {/* Donation widget */}
            <MKBox
              id="donate-widget"
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: 0,
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                boxShadow: "0 12px 36px rgba(31, 42, 68, 0.1)",
                border: "1px solid rgba(31, 42, 68, 0.06)",
                overflow: "hidden",
                scrollMarginTop: { xs: "110px", md: "130px" },
              }}
            >
              <SpaOutlinedIcon
                sx={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  fontSize: 26,
                  color: "rgba(79, 169, 83, 0.16)",
                  transform: "rotate(-25deg)",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
              <SpaOutlinedIcon
                sx={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  fontSize: 26,
                  color: "rgba(79, 169, 83, 0.16)",
                  transform: "scaleX(-1) rotate(-25deg)",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />

              <MKBox
                sx={{
                  px: { xs: 3, sm: 4, md: 4.5 },
                  pt: { xs: 3, sm: 3.5 },
                  pb: { xs: 0.75, sm: 1 },
                  textAlign: "center",
                }}
              >
                <MKTypography
                  fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                  sx={{
                    fontSize: { xs: "1.35rem", sm: "1.5rem" },
                    fontWeight: 500,
                    color: "#1A2B4C",
                    lineHeight: 1.25,
                  }}
                >
                  <MKBox
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.6,
                    }}
                  >
                    {donatePage.makeADifferenceNow}
                    <FavoriteBorderIcon
                      sx={{
                        color: "#ff4d4f",
                        fontSize: { xs: 20, sm: 22 },
                        transform: "translateY(1px) rotate(12deg)",
                      }}
                    />
                  </MKBox>
                </MKTypography>
              </MKBox>

              <MKBox
                sx={{
                  px: { xs: 3, sm: 4, md: 4.5 },
                  pb: { xs: 2, sm: 2.25 },
                  pt: { xs: 0.5, sm: 0.75 },
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  minHeight: 0,
                  justifyContent: "space-between",
                  gap: { xs: 1.35, sm: 1.5 },
                }}
              >
                <Grid container spacing={1.25} sx={{ mt: { xs: 1.5, sm: 1.75 } }}>
                  {[501, 1001, 3001].map((amt) => {
                    const active = selectedAmount === amt && !customAmount;
                    return (
                      <Grid item xs={4} key={amt}>
                        <MKBox sx={{ position: "relative", height: "100%" }}>
                          {amt === 1001 && (
                            <MKBox
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                maxWidth: "calc(100% + 8px)",
                                backgroundColor: "#fff8ec",
                                color: "#b8740b",
                                border: "1px solid rgba(236, 165, 51, 0.55)",
                                boxShadow: "0 2px 5px rgba(138, 90, 18, 0.1)",
                                px: { xs: 0.45, sm: 0.9 },
                                py: 0.2,
                                borderRadius: "999px",
                                fontSize: { xs: "0.45rem", sm: "0.57rem" },
                                fontWeight: 800,
                                zIndex: 3,
                                whiteSpace: "nowrap",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: { xs: 0.15, sm: 0.3 },
                                lineHeight: 1.2,
                                overflow: "hidden",
                              }}
                            >
                              <StarRoundedIcon
                                sx={{ fontSize: { xs: 8, sm: 10 }, flexShrink: 0 }}
                              />
                              <MKBox
                                component="span"
                                sx={{ display: { xs: "none", sm: "inline" } }}
                              >
                                {donatePage.mostPopular}
                              </MKBox>
                              <MKBox
                                component="span"
                                sx={{ display: { xs: "inline", sm: "none" } }}
                              >
                                Popular
                              </MKBox>
                            </MKBox>
                          )}
                          <MKButton
                            fullWidth
                            variant="outlined"
                            color="dark"
                            onClick={() => {
                              setCustomAmount("");
                              setSelectedAmount(amt);
                            }}
                            sx={{
                              "&&": {
                                background: active ? "#fff8ec" : "#ffffff",
                                backgroundColor: active ? "#fff8ec" : "#ffffff",
                                color: active ? "#8a5a12" : "#24324f",
                                border: active
                                  ? "2px solid #ECA533"
                                  : "1px solid rgba(31, 42, 68, 0.14)",
                                boxShadow: active
                                  ? "0 0 0 4px rgba(236, 165, 51, 0.22), 0 6px 14px rgba(236, 165, 51, 0.15)"
                                  : "0 1px 2px rgba(31, 42, 68, 0.04)",
                                borderRadius: "12px",
                                py: 1.2,
                                fontWeight: active ? 800 : 700,
                                fontSize: { xs: "0.95rem", sm: "1.02rem" },
                                letterSpacing: "0.01em",
                                minHeight: 48,
                                height: "100%",
                                fontVariantNumeric: "tabular-nums",
                                transform: active ? "translateY(-1px)" : "none",
                                transition:
                                  "border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease, transform 0.18s ease",
                                "&:hover, &:focus, &:focus-visible, &:active": {
                                  background: active ? "#fff3dc" : "#faf6ef",
                                  backgroundColor: active ? "#fff3dc" : "#faf6ef",
                                  borderColor: active ? "#d9962e" : "rgba(31, 42, 68, 0.28)",
                                  color: active ? "#8a5a12" : "#24324f",
                                  boxShadow: active
                                    ? "0 0 0 5px rgba(236, 165, 51, 0.26), 0 8px 18px rgba(236, 165, 51, 0.18)"
                                    : "0 1px 2px rgba(31, 42, 68, 0.06)",
                                },
                              },
                            }}
                          >
                            ₹{amt.toLocaleString("en-IN")}
                          </MKButton>
                        </MKBox>
                      </Grid>
                    );
                  })}
                </Grid>

                <TextField
                  fullWidth
                  value={customAmount}
                  onChange={(e) => {
                    const v = sanitizeAmountInput(e.target.value);
                    setCustomAmount(v);
                    if (v) setSelectedAmount(Number(v));
                  }}
                  placeholder={donatePage.enterCustomAmount}
                  variant="outlined"
                  error={!!customAmount && !amountCheck.ok}
                  helperText={
                    customAmount && !amountCheck.ok
                      ? amountCheck.error
                      : isMealSponsorshipSelected && customAmount
                      ? donatePage.quickGiveCards.mealSponsorship.inputHint ||
                        `${donatePage.quickGiveCards.mealSponsorship.title} — 50 Prabhuji`
                      : undefined
                  }
                  inputProps={{ inputMode: "numeric", maxLength: 7, pattern: "[0-9]*" }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#ffffff",
                      minHeight: 48,
                      "& fieldset": {
                        borderColor: "rgba(31, 42, 68, 0.14)",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      py: 1.35,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "#1f2a44",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <MKBox
                        component="span"
                        sx={{ mr: 1, color: "#5a6b8a", fontWeight: 700, fontSize: "1rem" }}
                      >
                        ₹
                      </MKBox>
                    ),
                  }}
                />

                <MKButton
                  component={Link}
                  to={donateCheckoutNav.pathname}
                  state={donateCheckoutNav.state}
                  onClick={(e) => {
                    if (!checkoutIsReady) e.preventDefault();
                  }}
                  disabled={!checkoutIsReady}
                  aria-disabled={!checkoutIsReady}
                  aria-label={`Donate ₹${amountCheck.ok ? amountCheck.valueInr : ""} now`}
                  fullWidth
                  variant="contained"
                  color="success"
                  sx={{
                    minHeight: { xs: 52, sm: 56 },
                    borderRadius: "14px",
                    py: { xs: 1.25, sm: 1.35 },
                    px: { xs: 1.35, sm: 1.5 },
                    fontSize: { xs: "1rem", sm: "1.06rem" },
                    fontWeight: 800,
                    background:
                      "linear-gradient(90deg, #4FA953 0%, #3f9a44 50%, #4FA953 100%) !important",
                    color: "#ffffff !important",
                    boxShadow: "0 10px 24px rgba(79, 169, 83, 0.28)",
                    textTransform: "none",
                    textDecoration: "none",
                    letterSpacing: "0.02em",
                    opacity: checkoutIsReady ? 1 : 0.55,
                    transition:
                      "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, opacity 0.2s ease",
                    "&&": {
                      color: "#ffffff",
                    },
                    "&, & *": {
                      color: "#ffffff !important",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#ffffff !important",
                    },
                    "& .donate-cta-arrow": {
                      transition: "transform 0.2s ease",
                    },
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #45a049 0%, #368a3b 50%, #45a049 100%) !important",
                      boxShadow: "0 14px 30px rgba(79, 169, 83, 0.36)",
                      textDecoration: "none",
                      transform: "translateY(-2px)",
                      color: "#ffffff !important",
                      "& .donate-cta-arrow": {
                        transform: "translateX(4px)",
                      },
                    },
                    "&:active": {
                      transform: "translateY(0px)",
                      boxShadow: "0 8px 18px rgba(79, 169, 83, 0.26)",
                    },
                    "&:focus, &.Mui-focusVisible, &:focus-visible, &:focus:not(:hover)": {
                      background:
                        "linear-gradient(90deg, #4FA953 0%, #3f9a44 50%, #4FA953 100%) !important",
                      color: "#ffffff !important",
                      boxShadow: "0 10px 24px rgba(79, 169, 83, 0.28)",
                      outline: "none",
                    },
                    "&.Mui-disabled": {
                      background:
                        "linear-gradient(90deg, #4FA953 0%, #3f9a44 50%, #4FA953 100%) !important",
                      color: "#ffffff !important",
                      opacity: 0.55,
                    },
                  }}
                >
                  <MKBox
                    component="span"
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "40px 1fr 40px",
                      alignItems: "center",
                      width: "100%",
                      gap: 0.5,
                    }}
                  >
                    <MKBox
                      component="span"
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        justifySelf: "start",
                      }}
                    >
                      <VolunteerActivismRoundedIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
                    </MKBox>
                    <MKBox
                      component="span"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: "1rem", sm: "1.08rem" },
                        lineHeight: 1.2,
                        textAlign: "center",
                        color: "#ffffff !important",
                      }}
                    >
                      {donatePage.donateNow}
                    </MKBox>
                    <MKBox
                      component="span"
                      className="donate-cta-arrow"
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        justifySelf: "end",
                      }}
                    >
                      <ArrowForwardRoundedIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
                    </MKBox>
                  </MKBox>
                </MKButton>

                <MKBox sx={{ pt: { xs: 0.5, sm: 0.75 } }}>
                  <DonateTrustBanner />
                </MKBox>
              </MKBox>
            </MKBox>
          </MKBox>
        </Grid>
      </Grid>
    </>
  );
}

DonateGivingBody.propTypes = {
  donatePage: PropTypes.object.isRequired,
  selectedAmount: PropTypes.number.isRequired,
  setSelectedAmount: PropTypes.func.isRequired,
  customAmount: PropTypes.string.isRequired,
  setCustomAmount: PropTypes.func.isRequired,
  scrollToDonateWidget: PropTypes.func.isRequired,
  isMealSponsorshipSelected: PropTypes.bool.isRequired,
  amountCheck: PropTypes.object.isRequired,
  donateCheckoutNav: PropTypes.object.isRequired,
  checkoutIsReady: PropTypes.bool.isRequired,
};

export default DonateGivingBody;
