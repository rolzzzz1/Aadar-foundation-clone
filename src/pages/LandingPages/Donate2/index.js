import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// i18next imports
import { useTranslation } from "react-i18next";

// @mui material components
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";

// @mui icons-material components
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SunriseOutlinedIcon from "components/Icons/SunriseOutlinedIcon";
import MealCoverIcon from "components/Icons/MealCoverIcon";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Routes
import getRoutes from "routes1";
import getFooterRoutes from "footer.routes1";

// Images
import LandingPageHero from "components/LandingPageHero";
import donate2UpiQr from "assets/images/donate2-upi-qr.png";
import donateImg from "assets/images/donate-happy-faces.png";
import sponsorLeafGold from "assets/images/sponsor-leaf-gold.png";
import donate2Carousel1 from "assets/images/donate2-carousel-1.png";
import donate2Carousel2 from "assets/images/donate2-carousel-2.png";
import donate2Carousel3 from "assets/images/donate2-carousel-3.png";
import donate2Carousel4 from "assets/images/donate2-carousel-4.png";
import MKButton from "components/MKButton";

const DONATE2_IMPACT_PHOTOS = [
  {
    src: donate2Carousel1,
    altKey: "aadarshGram",
    captionKey: "aadarshGram",
  },
  {
    src: donate2Carousel2,
    altKey: "mediaCoverage",
    captionKey: "mediaCoverage",
  },
  {
    src: donate2Carousel3,
    altKey: "careTransformation",
    captionKey: "careTransformation",
  },
  {
    src: donate2Carousel4,
    altKey: "holiCelebration",
    captionKey: "holiCelebration",
  },
];

import DonateTrustBanner from "pages/LandingPages/shared/DonateTrustBanner";
import DonateReceiptCta from "pages/LandingPages/shared/DonateReceiptCta";
import SponsorPrabhujiCtaCards from "pages/LandingPages/shared/SponsorPrabhujiCtaCards";
import LazyVisible from "components/LazyMedia/LazyVisible";

import {
  DONATE_PAGE_PATH,
  DONATE_WIDGET_PRESET_PURPOSE,
  getDonationCheckoutNavigation,
  sanitizeAmountInput,
  validateAmountInr,
} from "utils/donation";
import { getPageHeroSrcForViewport } from "utils/pageHeroAssets";

function ImpactLeaf({ mirrored = false }) {
  return (
    <MKBox
      component="svg"
      viewBox="0 0 34 28"
      aria-hidden="true"
      sx={{
        width: { xs: 25, sm: 28 },
        height: { xs: 21, sm: 24 },
        flexShrink: 0,
        overflow: "visible",
        transform: mirrored ? "scaleX(-1)" : "none",
        filter: "drop-shadow(0 2px 2px rgba(46, 125, 50, 0.14))",
      }}
    >
      <path
        d="M4 23c6.5-1.5 12.2-5.5 17-12"
        fill="none"
        stroke="#388e3c"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M11.5 18.5C6.1 18.6 3.1 15.8 3 11.2c5.2-.5 8.2 2.2 8.5 7.3Z"
        fill="#78c67c"
        stroke="#388e3c"
        strokeWidth="0.8"
      />
      <path
        d="M17.2 14.3c-1.2-5 1.1-8.5 5.7-9.6 1.5 4.9-.8 8.4-5.7 9.6Z"
        fill="#4FA953"
        stroke="#2e7d32"
        strokeWidth="0.8"
      />
      <path
        d="M21.2 10.8c2.4-4.5 6.1-5.9 10.3-3.7-1.9 4.8-5.7 6.1-10.3 3.7Z"
        fill="#94d397"
        stroke="#388e3c"
        strokeWidth="0.8"
      />
      <circle cx="4" cy="23" r="1.6" fill="#ECA533" />
    </MKBox>
  );
}

ImpactLeaf.propTypes = {
  mirrored: PropTypes.bool,
};

const FALLBACK_TESTIMONIALS = [
  {
    quote:
      "When I came here, I had nothing. Today I have food, a place to sleep, and people who care for me like family.",
    author: "Ramesh Prabhuji",
    role: "Resident, Aadar Foundation",
  },
  {
    quote:
      "I was alone on the streets for years. Here I found warmth, medicines, and someone who listens every day.",
    author: "Suresh Prabhuji",
    role: "Resident, Aadar Foundation",
  },
  {
    quote:
      "The volunteers treat us with dignity. A simple meal and clean clothes made me feel human again.",
    author: "Mohan Prabhuji",
    role: "Resident, Aadar Foundation",
  },
  {
    quote:
      "After my treatment, I began to smile again. Support from donors gave me a second chance at life.",
    author: "Gopal Prabhuji",
    role: "Resident, Aadar Foundation",
  },
];

function getInitials(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function ImpactTestimonialCarousel({ testimonials }) {
  const items =
    Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;
  const [index, setIndex] = React.useState(0);
  const active = items[index] || FALLBACK_TESTIMONIALS[0];

  React.useEffect(() => {
    if (items.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [items.length]);

  const stopLinkNav = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <MKBox
      component="blockquote"
      onClick={stopLinkNav}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") stopLinkNav(event);
      }}
      sx={{
        m: 0,
        width: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: "14px",
        px: { xs: 1.5, sm: 1.75 },
        pt: { xs: 1.35, sm: 1.5 },
        pb: { xs: 1.15, sm: 1.25 },
        background:
          "linear-gradient(145deg, rgba(79,169,83,0.08) 0%, rgba(255,255,255,0.92) 55%, rgba(236,165,51,0.06) 100%)",
        border: "none",
      }}
    >
      <MKBox
        aria-hidden="true"
        sx={{
          position: "absolute",
          top: { xs: -6, sm: -8 },
          left: { xs: 6, sm: 8 },
          fontFamily: "Georgia, 'Times New Roman', Times, serif",
          fontSize: { xs: "3.4rem", sm: "3.8rem" },
          lineHeight: 1,
          color: "rgba(79, 169, 83, 0.22)",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        “
      </MKBox>

      <MKBox
        key={active.author + index}
        sx={{
          position: "relative",
          zIndex: 1,
          pl: { xs: 0.75, sm: 1 },
          minHeight: { xs: 118, sm: 112 },
          display: "flex",
          flexDirection: "column",
          animation: "impactTestimonialFade 0.45s ease",
          "@keyframes impactTestimonialFade": {
            from: { opacity: 0, transform: "translateY(4px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <MKTypography
          sx={{
            fontWeight: 500,
            fontSize: { xs: "0.86rem", sm: "0.92rem" },
            lineHeight: 1.55,
            color: "#1f2a44",
            fontStyle: "italic",
            flex: 1,
          }}
        >
          {active.quote}
        </MKTypography>

        <MKBox
          sx={{
            mt: 1.35,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MKBox
            sx={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(145deg, #3fa34d 0%, #1e6b2c 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.78rem",
              letterSpacing: "0.02em",
              boxShadow: "0 3px 8px rgba(30, 107, 44, 0.2)",
            }}
          >
            {getInitials(active.author)}
          </MKBox>
          <MKBox sx={{ minWidth: 0 }}>
            <MKTypography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "0.8rem", sm: "0.84rem" },
                color: "#1e7a32",
                lineHeight: 1.2,
              }}
            >
              {active.author}
            </MKTypography>
            <MKTypography
              sx={{
                mt: 0.2,
                fontWeight: 500,
                fontSize: { xs: "0.68rem", sm: "0.72rem" },
                color: "rgba(31, 42, 68, 0.55)",
                lineHeight: 1.25,
              }}
            >
              {active.role}
            </MKTypography>
          </MKBox>
        </MKBox>
      </MKBox>

      {items.length > 1 ? (
        <MKBox
          role="tablist"
          aria-label="Testimonials"
          sx={{
            mt: 1.25,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
          }}
        >
          {items.map((item, dotIndex) => {
            const isActive = dotIndex === index;
            return (
              <MKBox
                key={`${item.author}-${dotIndex}`}
                component="button"
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show testimonial ${dotIndex + 1}`}
                onClick={(event) => {
                  stopLinkNav(event);
                  setIndex(dotIndex);
                }}
                sx={{
                  width: isActive ? 16 : 7,
                  height: 7,
                  p: 0,
                  border: "none",
                  borderRadius: 999,
                  cursor: "pointer",
                  backgroundColor: isActive ? "#2e7d32" : "rgba(46, 125, 50, 0.28)",
                  transition: "width 0.2s ease, background-color 0.2s ease",
                }}
              />
            );
          })}
        </MKBox>
      ) : null}
    </MKBox>
  );
}

ImpactTestimonialCarousel.propTypes = {
  testimonials: PropTypes.arrayOf(
    PropTypes.shape({
      quote: PropTypes.string,
      author: PropTypes.string,
      role: PropTypes.string,
    })
  ),
};

function ImpactPhotosCarousel({ gallery }) {
  const photos = DONATE2_IMPACT_PHOTOS;
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const active = photos[index] || photos[0];
  const alts = gallery?.alts || {};
  const captions = gallery?.captions || {};
  const title = gallery?.title || "Moments from our work";
  const subtitle = gallery?.subtitle || "";
  const activeCaption = captions[active.captionKey] || alts[active.altKey] || "";

  React.useEffect(() => {
    if (photos.length <= 1 || paused) return undefined;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % photos.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [photos.length, paused]);

  const goTo = (nextIndex) => {
    setIndex((nextIndex + photos.length) % photos.length);
  };

  return (
    <MKBox
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        mb: { xs: 9, sm: 10, md: 11 },
        position: "relative",
        borderRadius: { xs: "16px", sm: "18px" },
        overflow: "hidden",
        background:
          "radial-gradient(120% 90% at 0% 0%, rgba(236,165,51,0.14) 0%, transparent 45%), linear-gradient(135deg, #fffaf1 0%, #fff6e8 48%, #f7f0e4 100%)",
        border: "1px solid rgba(236, 165, 51, 0.22)",
        boxShadow: "0 16px 36px rgba(31, 42, 68, 0.1)",
        "&:hover .impact-nav": { opacity: 1 },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, transparent 0%, transparent 58%, rgba(236,165,51,0.05) 100%)",
          zIndex: 0,
        },
      }}
    >
      <MKBox
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
        }}
      >
        <MKBox
          sx={{
            position: "relative",
            flex: { xs: "none", md: "1 1 64%" },
            width: { xs: "100%", md: "64%" },
            maxWidth: { md: "64%" },
            height: { xs: 210, sm: 260, md: 286 },
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 65%), #151b2b",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          <MKBox
            aria-hidden="true"
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              width: 18,
              height: 18,
              borderTop: "2px solid rgba(236,165,51,0.75)",
              borderLeft: "2px solid rgba(236,165,51,0.75)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
          <MKBox
            aria-hidden="true"
            sx={{
              position: "absolute",
              bottom: 10,
              right: 10,
              width: 18,
              height: 18,
              borderBottom: "2px solid rgba(236,165,51,0.75)",
              borderRight: "2px solid rgba(236,165,51,0.75)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />

          {photos.map((photo, photoIndex) => {
            const isActive = photoIndex === index;
            return (
              <MKBox
                key={photo.src}
                component="img"
                src={photo.src}
                alt={alts[photo.altKey] || title}
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0) scale(1)" : "translateY(6px) scale(0.985)",
                  transition: "opacity 0.5s ease, transform 0.55s ease",
                  pointerEvents: isActive ? "auto" : "none",
                  p: { xs: 0.75, sm: 1 },
                  filter: isActive ? "none" : "blur(1px)",
                }}
              />
            );
          })}

          <MKBox
            component="button"
            type="button"
            className="impact-nav"
            aria-label="Previous photo"
            onClick={() => goTo(index - 1)}
            sx={{
              position: "absolute",
              left: { xs: 8, sm: 10 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              width: { xs: 30, sm: 34 },
              height: { xs: 30, sm: 34 },
              p: 0,
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              backgroundColor: "rgba(15, 22, 38, 0.55)",
              backdropFilter: "blur(8px)",
              opacity: { xs: 1, md: 0.65 },
              transition: "opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease",
              "&:hover": {
                opacity: 1,
                backgroundColor: "rgba(15, 22, 38, 0.78)",
                transform: "translateY(-50%) scale(1.06)",
              },
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </MKBox>

          <MKBox
            component="button"
            type="button"
            className="impact-nav"
            aria-label="Next photo"
            onClick={() => goTo(index + 1)}
            sx={{
              position: "absolute",
              right: { xs: 8, sm: 10 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              width: { xs: 30, sm: 34 },
              height: { xs: 30, sm: 34 },
              p: 0,
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              backgroundColor: "rgba(15, 22, 38, 0.55)",
              backdropFilter: "blur(8px)",
              opacity: { xs: 1, md: 0.65 },
              transition: "opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease",
              "&:hover": {
                opacity: 1,
                backgroundColor: "rgba(15, 22, 38, 0.78)",
                transform: "translateY(-50%) scale(1.06)",
              },
            }}
          >
            <ChevronRightIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </MKBox>

          <MKBox
            aria-hidden="true"
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 3,
              zIndex: 3,
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          >
            <MKBox
              key={`progress-${index}-${paused}`}
              sx={{
                height: "100%",
                width: paused ? `${((index + 1) / photos.length) * 100}%` : "100%",
                background: "linear-gradient(90deg, #eca533 0%, #f5c56a 100%)",
                transformOrigin: "left center",
                animation: paused ? "none" : "impactPhotoProgress 4.5s linear",
                "@keyframes impactPhotoProgress": {
                  from: { transform: "scaleX(0)" },
                  to: { transform: "scaleX(1)" },
                },
              }}
            />
          </MKBox>
        </MKBox>

        <MKBox
          sx={{
            flex: { xs: "none", md: "1 1 36%" },
            width: { xs: "100%", md: "36%" },
            maxWidth: { md: "36%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: { xs: "flex-start", md: "center" },
            px: { xs: 1.5, sm: 1.85, md: 2 },
            py: { xs: 1.15, sm: 1.35, md: 1.5 },
            borderLeft: {
              xs: "none",
              md: "1px solid rgba(236, 165, 51, 0.2)",
            },
            borderTop: {
              xs: "1px solid rgba(236, 165, 51, 0.2)",
              md: "none",
            },
          }}
        >
          <MKBox
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              mb: 0.65,
            }}
          >
            <MKBox
              component="img"
              src={sponsorLeafGold}
              alt=""
              aria-hidden="true"
              sx={{
                width: { xs: 16, sm: 18 },
                height: "auto",
                flexShrink: 0,
                filter: "drop-shadow(0 1px 2px rgba(138, 90, 18, 0.25))",
              }}
            />
            <MKTypography
              sx={{
                fontSize: { xs: "0.66rem", sm: "0.7rem" },
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#8a5a12",
                lineHeight: 1.2,
              }}
            >
              {index + 1} / {photos.length}
            </MKTypography>
          </MKBox>

          <MKTypography
            variant="h4"
            sx={{
              fontFamily:
                '"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
              fontSize: { xs: "1.2rem", sm: "1.32rem", md: "1.4rem" },
              color: "#1f2a44",
              lineHeight: 1.2,
            }}
          >
            {title}
          </MKTypography>

          {subtitle ? (
            <MKTypography
              sx={{
                mt: 0.45,
                fontSize: { xs: "0.8rem", sm: "0.86rem" },
                fontWeight: 400,
                color: "rgba(31, 42, 68, 0.55)",
                letterSpacing: "0.01em",
                lineHeight: 1.35,
              }}
            >
              {subtitle}
            </MKTypography>
          ) : null}

          {activeCaption ? (
            <MKTypography
              key={active.captionKey + index}
              sx={{
                mt: 1,
                fontSize: { xs: "0.78rem", sm: "0.84rem" },
                fontWeight: 600,
                color: "#2e4a2f",
                lineHeight: 1.4,
                pl: 1,
                borderLeft: "2px solid rgba(236, 165, 51, 0.7)",
                animation: "impactCaptionIn 0.4s ease",
                "@keyframes impactCaptionIn": {
                  from: { opacity: 0, transform: "translateY(4px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              {activeCaption}
            </MKTypography>
          ) : null}

          <MKBox
            role="tablist"
            aria-label={title}
            sx={{
              mt: { xs: 1.1, sm: 1.25 },
              display: "flex",
              alignItems: "center",
              gap: 0.65,
            }}
          >
            {photos.map((photo, thumbIndex) => {
              const isActive = thumbIndex === index;
              return (
                <MKBox
                  key={photo.src}
                  component="button"
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show photo ${thumbIndex + 1}`}
                  onClick={() => setIndex(thumbIndex)}
                  sx={{
                    p: 0,
                    width: { xs: 38, sm: 44 },
                    height: { xs: 28, sm: 32 },
                    borderRadius: "7px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: isActive ? "2px solid #eca533" : "2px solid rgba(31, 42, 68, 0.1)",
                    boxShadow: isActive ? "0 0 0 2px rgba(236,165,51,0.22)" : "none",
                    opacity: isActive ? 1 : 0.72,
                    transition: "opacity 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                    backgroundColor: "#151b2b",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  <MKBox
                    component="img"
                    src={photo.src}
                    alt=""
                    aria-hidden="true"
                    sx={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </MKBox>
              );
            })}
          </MKBox>
        </MKBox>
      </MKBox>
    </MKBox>
  );
}

ImpactPhotosCarousel.propTypes = {
  gallery: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    alts: PropTypes.objectOf(PropTypes.string),
    captions: PropTypes.objectOf(PropTypes.string),
  }),
};

function Donate2() {
  const { t } = useTranslation();
  const routes = getRoutes(t);
  const footerRoutes = getFooterRoutes(t);
  const donateBtn = t("navbar.donateBtn");
  const donatePage = t("donatePage");
  const impactBanner =
    donatePage?.impactBanner && typeof donatePage.impactBanner === "object"
      ? donatePage.impactBanner
      : {
          title: "Your Donation Creates Real Impact",
          livesSupported: "600+",
          livesSupportedLabel: "Lives Supported",
          impactMessage: "Making a difference together, one life at a time.",
          testimonials: FALLBACK_TESTIMONIALS,
        };
  const [selectedAmount, setSelectedAmount] = React.useState(1001);
  const [customAmount, setCustomAmount] = React.useState("");

  // Help LCP on direct loads: ask the browser to fetch the hero image as early
  // as possible once this route mounts (without globally preloading it for
  // every page in `public/index.html`).
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const href = getPageHeroSrcForViewport();
    if (!href) return;
    const existing = document.querySelector(`link[rel="preload"][as="image"][href="${href}"]`);
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    document.head.appendChild(link);
  }, []);

  const activeAmountRaw = customAmount && Number(customAmount) > 0 ? customAmount : selectedAmount;
  const amountCheck = React.useMemo(() => validateAmountInr(activeAmountRaw), [activeAmountRaw]);
  const usingCustomAmount = Boolean(customAmount && Number(customAmount) > 0);
  const widgetPresetPurpose = !usingCustomAmount
    ? DONATE_WIDGET_PRESET_PURPOSE[selectedAmount]
    : null;
  const donateCheckoutNav = React.useMemo(
    () =>
      getDonationCheckoutNavigation({
        purpose: widgetPresetPurpose,
        amountInr: amountCheck.ok ? amountCheck.valueInr : 0,
        useFreeAmount: usingCustomAmount,
      }),
    [widgetPresetPurpose, amountCheck.ok, amountCheck.valueInr, usingCustomAmount]
  );
  const checkoutIsReady = amountCheck.ok;

  const scrollToDonateWidget = React.useCallback(() => {
    const el = document.getElementById("donate-widget");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <MKBox minWidth="320px">
      {/* Navbar component */}
      <DefaultNavbar
        routes={routes}
        action={{
          type: "internal",
          route: DONATE_PAGE_PATH,
          label: donateBtn,
          color: "success",
        }}
        sticky
      />

      <LandingPageHero
        title={donatePage.tagLine}
        minHeight={{ xs: "55vh", sm: "65vh", md: "80vh" }}
      />

      {/* Donate section */}
      <Card
        sx={{
          p: { xs: 1.5, sm: 2 },
          pb: { xs: 0.75, sm: 1 },
          mx: { xs: 2, lg: 3 },
          mt: -2,
          mb: 0.5,
          backgroundColor: "#f7f8fa",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <MKBox component="section" mt={{ xs: 1.5, sm: 1.75, md: 2 }} mb={{ xs: 0.5, sm: 0.75 }}>
          <Container>
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
              <Grid item xs={12} lg={6} xl={6} sx={{ display: "flex" }}>
                <MKBox
                  sx={{
                    pr: { xs: 0, sm: 0, md: 2, lg: 3 },
                    maxWidth: 720,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minHeight: 0,
                    justifyContent: "flex-start",
                  }}
                >
                  <MKTypography
                    component="h1"
                    sx={{
                      fontFamily: '"Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
                      fontWeight: 600,
                      fontSize: { xs: "1.35rem", sm: "1.5rem", md: "1.6rem", lg: "1.7rem" },
                      lineHeight: 1.3,
                      color: "#1A2B4C",
                      letterSpacing: "-0.01em",
                      mt: { xs: 2, sm: 2.5, md: 3 },
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
                      letterSpacing: "0.01rem",
                      lineHeight: 1.65,
                      color: "rgba(31, 42, 68, 0.72)",
                      maxWidth: { xs: "100%", sm: 440, md: 420 },
                      mt: { xs: 1.5, sm: 1.75 },
                    }}
                  >
                    {donatePage.description}
                  </MKTypography>

                  <MKBox
                    sx={{
                      width: "100%",
                      maxWidth: 640,
                      mt: { xs: 3, sm: 3.25, md: 3.5, lg: "auto" },
                      pt: { lg: 3 },
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
                        mb: { xs: 1.75, sm: 2 },
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
                          isActive:
                            customAmount === "1501" || (selectedAmount === 1501 && !customAmount),
                          onActivate: () => {
                            setSelectedAmount(1501);
                            setCustomAmount("1501");
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
                      ].map(
                        ({ id, Icon, title, subtitle, amount, period, isActive, onActivate }) => (
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
                              py={{ xs: 1.1, sm: 1.15 }}
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
                                  boxShadow:
                                    "inset 3px 0 0 #4fa953, 0 10px 24px rgba(31, 42, 68, 0.08)",
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
                                <MKBox
                                  sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
                                >
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
                        )
                      )}
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
                                      backgroundColor: "#fff8ec",
                                      color: "#b8740b",
                                      border: "1px solid rgba(236, 165, 51, 0.55)",
                                      boxShadow: "0 2px 5px rgba(138, 90, 18, 0.1)",
                                      px: { xs: 0.65, sm: 0.9 },
                                      py: 0.2,
                                      borderRadius: "999px",
                                      fontSize: { xs: "0.5rem", sm: "0.57rem" },
                                      fontWeight: 800,
                                      zIndex: 3,
                                      whiteSpace: "nowrap",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: 0.3,
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    <StarRoundedIcon sx={{ fontSize: { xs: 9, sm: 10 } }} />
                                    {donatePage.mostPopular}
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
                        helperText={customAmount && !amountCheck.ok ? amountCheck.error : undefined}
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

                      <MKBox sx={{ mt: "auto", pt: { xs: 1, sm: 1.25 } }}>
                        <DonateTrustBanner />
                      </MKBox>
                    </MKBox>
                  </MKBox>
                </MKBox>
              </Grid>
            </Grid>

            <LazyVisible rootMargin="600px" minHeight={260}>
              <MKBox
                sx={{
                  mt: { xs: 6.5, sm: 7, md: 7.5 },
                  mb: { xs: 3.5, sm: 4, md: 4.5 },
                  pt: { xs: 1.5, sm: 2 },
                  pb: { xs: 1.5, sm: 2 },
                }}
              >
                <MKBox
                  component="a"
                  href="#donate-widget"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("donate-widget");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  aria-label={donatePage.supportThemNow}
                  sx={{
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: { xs: "16px", md: "18px" },
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(31, 42, 68, 0.07)",
                    boxShadow: "0 10px 28px rgba(31, 42, 68, 0.06)",
                    px: { xs: 1.75, sm: 2.5, md: 3 },
                    py: { xs: 2.15, sm: 2.4, md: 2.65 },
                    transition: "box-shadow 0.25s ease, border-color 0.25s ease",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      backgroundColor: "#4FA953",
                      opacity: 0.75,
                    },
                    "&:hover": {
                      boxShadow: "0 12px 32px rgba(31, 42, 68, 0.09)",
                      borderColor: "rgba(31, 42, 68, 0.1)",
                    },
                    "&:focus-visible": {
                      outline: "2px solid rgba(79, 169, 83, 0.4)",
                      outlineOffset: "3px",
                    },
                  }}
                >
                  <Grid container spacing={{ xs: 2.25, md: 3 }} alignItems="stretch">
                    <Grid item xs={12} md={5} lg={5}>
                      <MKBox
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          justifyContent: "flex-start",
                          textAlign: "left",
                          gap: { xs: 2.1, sm: 2.35, md: 2.5 },
                          px: { xs: 0.5, sm: 0.75, md: 0.75, lg: 1.25 },
                        }}
                      >
                        <MKBox
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            alignSelf: "center",
                            textAlign: "center",
                            gap: 1.15,
                            maxWidth: "100%",
                          }}
                        >
                          <MKBox
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "auto minmax(0, auto) auto",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: { xs: 0.8, sm: 1.1 },
                              maxWidth: "100%",
                            }}
                          >
                            <ImpactLeaf />
                            <MKTypography
                              fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                              sx={{
                                fontWeight: 400,
                                fontSize: {
                                  xs: "1.22rem",
                                  sm: "1.38rem",
                                  md: "1.32rem",
                                  lg: "1.48rem",
                                },
                                lineHeight: 1.28,
                                letterSpacing: "0.01em",
                                color: "#1f2a44",
                              }}
                            >
                              {(() => {
                                const title = String(impactBanner.title || "");
                                const marker = " Real Impact";
                                const idx = title.lastIndexOf(marker);
                                if (idx === -1) return title;
                                return (
                                  <>
                                    {title.slice(0, idx)}{" "}
                                    <MKBox component="span" sx={{ whiteSpace: "nowrap" }}>
                                      Real Impact
                                    </MKBox>
                                  </>
                                );
                              })()}
                            </MKTypography>
                            <ImpactLeaf mirrored />
                          </MKBox>
                          <MKBox
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <MKBox
                              sx={{
                                width: { xs: 44, sm: 58 },
                                height: 2,
                                borderRadius: 999,
                                background:
                                  "linear-gradient(90deg, transparent 0%, rgba(236,165,51,0.28) 18%, #ECA533 100%)",
                              }}
                            />
                            <MKBox
                              sx={{
                                position: "relative",
                                width: 8,
                                height: 8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <MKBox
                                sx={{
                                  position: "absolute",
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  backgroundColor: "rgba(236, 165, 51, 0.16)",
                                }}
                              />
                              <MKBox
                                sx={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: "2px",
                                  transform: "rotate(45deg)",
                                  background:
                                    "radial-gradient(circle at 30% 30%, #f6c56a 0%, #ECA533 55%, #d48a1f 100%)",
                                  boxShadow: "0 1px 3px rgba(212, 138, 31, 0.3)",
                                }}
                              />
                            </MKBox>
                            <MKBox
                              sx={{
                                width: { xs: 44, sm: 58 },
                                height: 2,
                                borderRadius: 999,
                                background:
                                  "linear-gradient(90deg, #ECA533 0%, rgba(236,165,51,0.28) 82%, transparent 100%)",
                              }}
                            />
                          </MKBox>
                        </MKBox>

                        <MKBox
                          component="button"
                          type="button"
                          onClick={scrollToDonateWidget}
                          aria-label="Donate now"
                          sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                            gap: { xs: 1.35, sm: 1.75 },
                            px: { xs: 1.5, sm: 1.75 },
                            py: { xs: 1.35, sm: 1.5 },
                            borderRadius: "16px",
                            border: "1px solid rgba(79, 169, 83, 0.18)",
                            background:
                              "linear-gradient(105deg, rgba(79,169,83,0.14) 0%, rgba(255,255,255,0.85) 48%, rgba(236,165,51,0.08) 100%)",
                            boxShadow: "0 6px 16px rgba(31, 42, 68, 0.05)",
                            cursor: "pointer",
                            textAlign: "left",
                            color: "#1f2a44",
                            transition: "transform 0.18s ease, box-shadow 0.18s ease",
                            "&:hover": {
                              boxShadow: "0 8px 18px rgba(31, 42, 68, 0.08)",
                              transform: "translateY(-1px)",
                              "& .impact-donate-arrow path": {
                                stroke: "#1e6b2c",
                              },
                              "& .impact-donate-arrow": {
                                transform: "translateX(2px)",
                              },
                            },
                          }}
                        >
                          <MKBox display="flex" alignItems="center" gap={0.9} flexShrink={0}>
                            <MKBox
                              sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                background: "linear-gradient(145deg, #3fa34d 0%, #1e6b2c 100%)",
                                boxShadow: "0 3px 8px rgba(30, 107, 44, 0.22)",
                              }}
                            >
                              <GroupsOutlinedIcon sx={{ fontSize: 26 }} />
                            </MKBox>
                            <MKBox>
                              <MKTypography
                                sx={{
                                  color: "#1e7a32",
                                  fontWeight: 800,
                                  fontSize: { xs: "1rem", sm: "1.06rem" },
                                  lineHeight: 1.05,
                                  letterSpacing: "-0.01em",
                                }}
                              >
                                {impactBanner.livesSupported || "600+"}
                              </MKTypography>
                              <MKTypography
                                sx={{
                                  color: "#1f2a44",
                                  fontWeight: 600,
                                  fontSize: "0.68rem",
                                  mt: 0.1,
                                }}
                              >
                                {impactBanner.livesSupportedLabel || "Lives Supported"}
                              </MKTypography>
                            </MKBox>
                          </MKBox>

                          <MKBox
                            sx={{
                              display: { xs: "none", sm: "block" },
                              width: "1px",
                              height: 42,
                              backgroundColor: "rgba(46, 125, 50, 0.22)",
                              flexShrink: 0,
                            }}
                          />

                          <MKTypography
                            sx={{
                              color: "rgba(31, 42, 68, 0.78)",
                              fontWeight: 500,
                              fontSize: { xs: "0.76rem", sm: "0.8rem" },
                              lineHeight: 1.45,
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            {impactBanner.impactMessage ||
                              "Making a difference together, one life at a time."}
                          </MKTypography>

                          <MKBox
                            className="impact-donate-arrow"
                            sx={{
                              flexShrink: 0,
                              alignSelf: { xs: "flex-end", sm: "center" },
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "transform 0.18s ease",
                            }}
                          >
                            <MKBox
                              component="svg"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              sx={{
                                width: { xs: 22, sm: 24 },
                                height: { xs: 22, sm: 24 },
                                display: "block",
                              }}
                            >
                              <path
                                d="M9 5.5 L16.2 12 L9 18.5"
                                fill="none"
                                stroke="#1e7a32"
                                strokeWidth="3.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </MKBox>
                          </MKBox>
                        </MKBox>

                        <ImpactTestimonialCarousel
                          testimonials={
                            Array.isArray(impactBanner.testimonials) &&
                            impactBanner.testimonials.length > 0
                              ? impactBanner.testimonials
                              : impactBanner.testimonial
                              ? [impactBanner.testimonial]
                              : FALLBACK_TESTIMONIALS
                          }
                        />
                      </MKBox>
                    </Grid>

                    <Grid item xs={12} md={7} lg={7} sx={{ display: "flex" }}>
                      <MKBox
                        sx={{
                          p: "4px",
                          borderRadius: "14px",
                          backgroundColor: "#ECA533",
                          boxShadow: "0 8px 22px rgba(31, 42, 68, 0.08)",
                          width: "100%",
                          mt: { md: "auto" },
                          alignSelf: { xs: "stretch", md: "flex-end" },
                        }}
                      >
                        <MKBox
                          component="img"
                          src={donateImg}
                          alt={impactBanner.title}
                          width="100%"
                          height={{ xs: "188px", sm: "218px", md: "245px", lg: "262px" }}
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                          sx={{
                            display: "block",
                            objectFit: "cover",
                            objectPosition: "center",
                            borderRadius: "10px",
                            border: "3px solid #ffffff",
                            backgroundColor: "#fff",
                          }}
                        />
                      </MKBox>
                    </Grid>
                  </Grid>
                </MKBox>
              </MKBox>
            </LazyVisible>

            <MKBox
              component="section"
              pt={{ xs: 3, sm: 3.5, md: 4 }}
              pb={1.5}
              mt={{ xs: 1.5, sm: 2, md: 2.5 }}
              mb={1}
              mx={0}
              px={{ xs: 1.5, sm: 2, md: 3, lg: 4 }}
              sx={{
                backgroundColor: "#fafafa",
                borderRadius: "20px",
              }}
            >
              <Grid
                container
                pt={{ xs: 1, sm: 1.5 }}
                px={{ xs: 1, sm: 2 }}
                spacing={{ xs: 2, md: 3 }}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={12} textAlign="center">
                  <MKBox
                    sx={{
                      position: "relative",
                      display: "inline-flex",
                      flexWrap: "nowrap",
                      alignItems: "baseline",
                      justifyContent: "center",
                      columnGap: { xs: 1.25, sm: 2, md: 2.5 },
                      whiteSpace: "nowrap",
                      overflow: "visible",
                      maxWidth: "100%",
                      py: { xs: 1.5, sm: 2 },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        zIndex: 0,
                        top: "-40%",
                        bottom: "-40%",
                        left: "-8%",
                        right: "-8%",
                        pointerEvents: "none",
                        background:
                          "radial-gradient(40% 60% at 20% 45%, rgba(236,165,51,0.3) 0%, rgba(236,165,51,0) 70%), radial-gradient(45% 65% at 68% 60%, rgba(79,169,83,0.28) 0%, rgba(79,169,83,0) 72%), radial-gradient(35% 55% at 88% 40%, rgba(236,165,51,0.18) 0%, rgba(236,165,51,0) 70%)",
                        filter: "blur(22px)",
                      },
                      "& > *": {
                        position: "relative",
                        zIndex: 1,
                      },
                    }}
                  >
                    <MKTypography
                      component="span"
                      variant="h4"
                      fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                      sx={{
                        fontSize: { xs: "1.7rem", sm: "2.25rem", md: "2.55rem", lg: "2.85rem" },
                        fontWeight: "500",
                        color: "#ECA533",
                        flexShrink: 0,
                        mr: { xs: 1.25, sm: 1.75, md: 2.25 },
                      }}
                    >
                      {donatePage.membershipSection.title}
                    </MKTypography>
                    <MKTypography
                      component="span"
                      variant="h4"
                      fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
                      sx={{
                        fontSize: { xs: "1.1rem", sm: "1.4rem", md: "1.65rem", lg: "1.85rem" },
                        fontWeight: "500",
                        color: "#1f2a44",
                        flexShrink: 0,
                      }}
                    >
                      {donatePage.membershipSection.subTitle}
                    </MKTypography>
                  </MKBox>
                </Grid>
              </Grid>

              <MKBox
                sx={{
                  width: "100%",
                  px: { xs: 1, sm: 2, md: 2 },
                  pt: { xs: 6, sm: 6.5, md: 7 },
                  pb: { xs: 0.5, sm: 1 },
                }}
              >
                <SponsorPrabhujiCtaCards sponsor={donatePage.membershipSection.sponsorPrabhuji} />
              </MKBox>

              <Grid
                container
                pt={{ xs: 5, sm: 5.5, md: 6, lg: 6.5 }}
                pb={{ xs: 2, sm: 2.5 }}
                px={{ xs: 1, sm: 2, md: 2 }}
                spacing={{ xs: 2, lg: 3 }}
                alignItems="stretch"
              >
                <Grid item xs={12}>
                  <LazyVisible
                    rootMargin="700px"
                    minHeight={{ xs: 460, sm: 500, md: 540, lg: 560 }}
                  >
                    <MKBox
                      sx={{
                        mt: 0,
                        mb: { xs: 0.25, sm: 0.5 },
                        px: { xs: 0.15, sm: 0.35, md: 0.5 },
                      }}
                    >
                      <ImpactPhotosCarousel gallery={donatePage.impactPhotos} />

                      <MKBox
                        sx={{
                          borderRadius: "22px",
                          px: { xs: 1.75, sm: 2.5, md: 3 },
                          py: { xs: 2, sm: 2.25, md: 2.5 },
                          background:
                            "linear-gradient(180deg, rgba(255, 251, 242, 0.55) 0%, rgba(255, 245, 230, 0.35) 100%)",
                          border: "1px solid rgba(236, 165, 51, 0.14)",
                          boxShadow: "0 14px 34px rgba(31, 42, 68, 0.05)",
                        }}
                      >
                        <MKBox
                          sx={{
                            textAlign: "center",
                            mb: { xs: 3, sm: 3.25 },
                          }}
                        >
                          <MKTypography
                            variant="h4"
                            sx={{
                              fontFamily:
                                '"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
                              fontWeight: 500,
                              fontSize: { xs: "1.35rem", sm: "1.5rem", md: "1.6rem" },
                              color: "#1f2a44",
                              lineHeight: 1.25,
                            }}
                          >
                            {donatePage.bankAccountDetails.title}
                          </MKTypography>
                          {donatePage.bankAccountDetails.subtitle ? (
                            <MKTypography
                              component="span"
                              sx={{
                                display: "block",
                                mt: 0.4,
                                fontSize: { xs: "0.88rem", sm: "0.95rem", md: "1rem" },
                                fontWeight: 400,
                                color: "rgba(31, 42, 68, 0.5)",
                                letterSpacing: "0.02em",
                                lineHeight: 1.3,
                              }}
                            >
                              {donatePage.bankAccountDetails.subtitle}
                            </MKTypography>
                          ) : null}
                        </MKBox>

                        <Grid container spacing={{ xs: 2, md: 2.5 }} alignItems="stretch">
                          {[
                            {
                              Icon: PersonOutlineIcon,
                              label: donatePage.bankAccountDetails.acccountName.title,
                              value: donatePage.bankAccountDetails.acccountName.value,
                            },
                            {
                              Icon: AccountBalanceOutlinedIcon,
                              label: donatePage.bankAccountDetails.bankName.title,
                              value: donatePage.bankAccountDetails.bankName.value,
                            },
                            {
                              Icon: CodeOutlinedIcon,
                              label: donatePage.bankAccountDetails.ifscCode.title,
                              value: "BARB0VJCCGW",
                              nowrap: true,
                            },
                            {
                              Icon: CreditCardOutlinedIcon,
                              label: donatePage.bankAccountDetails.accountNo.title,
                              value: "67940100000154",
                              nowrap: true,
                            },
                          ].map(({ Icon, label, value, nowrap }) => (
                            <Grid item xs={12} sm={6} lg={3} key={label}>
                              <MKBox
                                sx={{
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.4,
                                  px: 1.8,
                                  py: 1.5,
                                  borderRadius: "16px",
                                  backgroundColor: "rgba(255, 255, 255, 0.65)",
                                  border: "1px solid rgba(31, 42, 68, 0.06)",
                                  backdropFilter: "blur(10px)",
                                }}
                              >
                                <MKBox
                                  sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "999px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "rgba(236, 165, 51, 0.18)",
                                    color: "#1f2a44",
                                    flex: "0 0 auto",
                                  }}
                                >
                                  <Icon sx={{ fontSize: 24 }} />
                                </MKBox>

                                <MKBox sx={{ minWidth: 0, flex: 1, pr: 0.5 }}>
                                  <MKTypography
                                    sx={{
                                      fontSize: "0.8rem",
                                      fontWeight: 800,
                                      color: "rgba(31, 42, 68, 0.55)",
                                      lineHeight: 1.1,
                                      mb: 0.6,
                                    }}
                                  >
                                    {label}
                                  </MKTypography>
                                  <MKTypography
                                    sx={{
                                      fontSize: "0.85rem",
                                      fontWeight: 600,
                                      color: "#1f2a44",
                                      lineHeight: 1.25,
                                      wordBreak: "normal",
                                      overflowWrap: "break-word",
                                      whiteSpace: nowrap ? "nowrap" : "normal",
                                    }}
                                    title={value}
                                  >
                                    {value}
                                  </MKTypography>
                                </MKBox>

                                <Tooltip title={donatePage.clickToCopy} placement="top">
                                  <MKButton
                                    onClick={() => navigator.clipboard.writeText(value)}
                                    variant="text"
                                    color="text"
                                    size="small"
                                    iconOnly
                                    sx={{
                                      flex: "0 0 auto",
                                      minWidth: "unset",
                                      width: 32,
                                      height: 32,
                                      borderRadius: "10px",
                                      "&:hover": {
                                        backgroundColor: "rgba(31, 42, 68, 0.06)",
                                      },
                                    }}
                                  >
                                    <ContentCopyIcon sx={{ fontSize: 18 }} />
                                  </MKButton>
                                </Tooltip>
                              </MKBox>
                            </Grid>
                          ))}
                        </Grid>
                      </MKBox>
                    </MKBox>
                  </LazyVisible>
                </Grid>

                <Grid item xs={12} sx={{ mt: { xs: 3, sm: 3.5, lg: 4 } }}>
                  <MKBox
                    sx={{
                      borderRadius: "20px",
                      backgroundColor: "transparent",
                      border: "none",
                      boxShadow: "none",
                      p: { xs: 2, sm: 3 },
                      mx: { xs: 2, sm: 3, lg: 0 },
                    }}
                  >
                    {/* Section heading — spans both columns so Food Sponsorship and the
                        UPI alternative below start at the same vertical level */}
                    <MKBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: { xs: 1, sm: 1.5 },
                        mb: 1,
                      }}
                    >
                      <MKTypography
                        sx={{
                          fontFamily:
                            '"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
                          fontSize: { xs: "1.3rem", sm: "1.52rem", md: "1.72rem" },
                          fontWeight: 500,
                          color: "#1f2a44",
                          textAlign: "center",
                        }}
                      >
                        {donatePage.membershipSection.directGiving.title}
                      </MKTypography>
                    </MKBox>
                    <MKTypography
                      sx={{
                        mb: { xs: 0.35, sm: 0.5 },
                        fontSize: { xs: "0.9rem", sm: "0.98rem", md: "1.05rem" },
                        color: "rgba(31, 42, 68, 0.6)",
                        lineHeight: 1.5,
                        textAlign: "center",
                      }}
                    >
                      {donatePage.membershipSection.directGiving.subtitle}
                    </MKTypography>
                    <MKBox
                      sx={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: { xs: 28, sm: 34 },
                        mb: { xs: 3.5, sm: 4 },
                      }}
                    >
                      <MKBox
                        component="img"
                        src={sponsorLeafGold}
                        alt=""
                        aria-hidden="true"
                        sx={{
                          position: "absolute",
                          left: { xs: 0, sm: 10 },
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: { xs: 116, sm: 162 },
                          height: "auto",
                          opacity: 0.9,
                          objectFit: "contain",
                        }}
                      />
                      <MKBox
                        component="img"
                        src={sponsorLeafGold}
                        alt=""
                        aria-hidden="true"
                        sx={{
                          position: "absolute",
                          right: { xs: 0, sm: 10 },
                          top: "50%",
                          transform: "translateY(-50%) scaleX(-1)",
                          width: { xs: 116, sm: 162 },
                          height: "auto",
                          opacity: 0.9,
                          objectFit: "contain",
                        }}
                      />
                      <MKBox
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <MKBox
                          sx={{ width: 94, height: 1.5, bgcolor: "rgba(82, 125, 62, 0.28)" }}
                        />
                        <MKBox
                          component="svg"
                          viewBox="0 0 24 16"
                          aria-hidden
                          sx={{ width: 20, height: "auto", color: "#c7b238" }}
                        >
                          <path
                            d="M12 13c0-4 1.6-6.7 6-8-1 4.8-3.4 7.2-6 8zm0 0C12 9 10.4 6.3 6 5c1 4.8 3.4 7.2 6 8z"
                            fill="currentColor"
                          />
                        </MKBox>
                        <MKBox
                          sx={{ width: 94, height: 1.5, bgcolor: "rgba(82, 125, 62, 0.28)" }}
                        />
                      </MKBox>
                    </MKBox>

                    <MKBox
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 7fr) minmax(0, 5fr)" },
                        columnGap: { lg: 5 },
                        rowGap: { xs: 3, sm: 3.5 },
                        alignItems: "stretch",
                      }}
                    >
                      <MKBox
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          minHeight: 0,
                        }}
                      >
                        {/* Food Sponsorship section */}
                        <MKBox sx={{ mb: 0.75, mt: { xs: 2.7, sm: 3.4 } }}>
                          <MKTypography
                            sx={{
                              fontWeight: 700,
                              color: "#1f2a44",
                              fontSize: { xs: "1.15rem", sm: "1.25rem" },
                            }}
                          >
                            {donatePage.membershipSection.directGiving.foodCard.title}
                          </MKTypography>
                        </MKBox>
                        <MKTypography
                          sx={{
                            fontSize: { xs: "0.9rem", sm: "0.95rem" },
                            color: "rgba(31, 42, 68, 0.6)",
                            lineHeight: 1.5,
                            mb: 2,
                          }}
                        >
                          {donatePage.membershipSection.directGiving.foodCard.subtitle}
                        </MKTypography>

                        <MKBox
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
                            gap: { xs: 1.25, sm: 1.5 },
                          }}
                        >
                          {[
                            { Icon: SunriseOutlinedIcon },
                            { Icon: MealCoverIcon },
                            { Icon: GroupsOutlinedIcon },
                            { Icon: MealCoverIcon },
                          ].map(({ Icon }, idx) => {
                            const item = donatePage.membershipSection.foodSponsorship.items[idx];
                            const meta = donatePage.membershipSection.directGiving.foodItems[idx];
                            if (!item || !meta) return null;
                            return (
                              <MKBox
                                key={meta.title}
                                sx={{
                                  textAlign: "center",
                                  borderRadius: "14px",
                                  backgroundColor: "#ffffff",
                                  border: "1px solid rgba(31, 42, 68, 0.06)",
                                  px: 1,
                                  py: 1.5,
                                }}
                              >
                                <Icon
                                  sx={{
                                    color: "#4fa953",
                                    display: "block",
                                    mx: "auto",
                                    fontSize: {
                                      xs: "2.15rem !important",
                                      sm: "2.4rem !important",
                                    },
                                    width: { xs: "2.15rem", sm: "2.4rem" },
                                    height: { xs: "2.15rem", sm: "2.4rem" },
                                  }}
                                />
                                <MKTypography
                                  sx={{
                                    mt: 0.6,
                                    fontWeight: 700,
                                    color: "#1f2a44",
                                    fontSize: "0.82rem",
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {meta.title}
                                </MKTypography>
                                <MKBox
                                  sx={{
                                    borderTop: "1px dashed rgba(31, 42, 68, 0.14)",
                                    my: 0.75,
                                  }}
                                />
                                <MKTypography
                                  sx={{
                                    fontWeight: 800,
                                    color: "#2e7d32",
                                    fontSize: "0.92rem",
                                    fontVariantNumeric: "tabular-nums",
                                  }}
                                >
                                  ₹{item.amount.replace(/^Rs\s*/i, "")}
                                </MKTypography>
                                <MKTypography
                                  sx={{
                                    mt: 0.25,
                                    fontSize: "0.68rem",
                                    color: "rgba(31, 42, 68, 0.55)",
                                  }}
                                >
                                  {meta.detail}
                                </MKTypography>
                              </MKBox>
                            );
                          })}
                        </MKBox>

                        {/* Donate Now — displayed below Membership Support */}
                        <MKBox
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "flex-end",
                            order: 1,
                            mt: { xs: 3, sm: 3.5, lg: "auto" },
                            pt: { lg: 3.5 },
                            mb: 0,
                          }}
                        >
                          <MKBox
                            sx={{
                              position: "relative",
                              width: "100%",
                              maxWidth: { xs: 280, sm: 310 },
                            }}
                          >
                            <MKBox
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                transform: "translate(-50%, -65%)",
                                zIndex: 2,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.3,
                                px: 0.75,
                                py: 0.2,
                                borderRadius: "999px",
                                backgroundColor: "#ffffff",
                                border: "1px solid rgba(46, 125, 50, 0.35)",
                                boxShadow: "0 2px 6px rgba(31, 42, 68, 0.08)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <StarRoundedIcon
                                sx={{ fontSize: 10, color: "#2e7d32", display: "block" }}
                              />
                              <MKTypography
                                component="span"
                                sx={{
                                  fontSize: { xs: "0.56rem", sm: "0.6rem" },
                                  fontWeight: 800,
                                  color: "#2e7d32 !important",
                                  lineHeight: 1.1,
                                  letterSpacing: "0.02em",
                                }}
                              >
                                {donatePage.membershipSection.directGiving.donateNowBadge}
                              </MKTypography>
                            </MKBox>

                            <MKBox
                              component={Link}
                              to={donateCheckoutNav.pathname}
                              state={donateCheckoutNav.state}
                              onClick={(event) => {
                                if (!checkoutIsReady) event.preventDefault();
                              }}
                              aria-disabled={!checkoutIsReady}
                              tabIndex={checkoutIsReady ? 0 : -1}
                              sx={{
                                position: "relative",
                                display: "grid",
                                gridTemplateColumns: "38px minmax(0, 1fr) 38px",
                                "& .MuiSvgIcon-root": {
                                  fontSize: "25px !important",
                                  width: "25px !important",
                                  height: "25px !important",
                                },
                                alignItems: "center",
                                width: "100%",
                                minHeight: { xs: 58, sm: 62 },
                                boxSizing: "border-box",
                                textDecoration: "none",
                                cursor: checkoutIsReady ? "pointer" : "not-allowed",
                                opacity: checkoutIsReady ? 1 : 0.6,
                                pointerEvents: checkoutIsReady ? "auto" : "none",
                                borderRadius: "12px",
                                py: { xs: 1.2, sm: 1.3 },
                                px: { xs: 1.2, sm: 1.4 },
                                background:
                                  "linear-gradient(90deg, #4FA953 0%, #45a049 55%, #4FA953 100%)",
                                boxShadow: "0 6px 14px rgba(79, 169, 83, 0.18)",
                                transition:
                                  "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
                                "&:hover": {
                                  background:
                                    "linear-gradient(90deg, #45a049 0%, #3d8a41 55%, #45a049 100%)",
                                  boxShadow: "0 6px 14px rgba(79, 169, 83, 0.18)",
                                  transform: "translateY(-1px)",
                                },
                                "&:active": {
                                  transform: "translateY(0px)",
                                  boxShadow: "0 3px 8px rgba(79, 169, 83, 0.14)",
                                },
                              }}
                            >
                              <MKBox
                                sx={{
                                  width: 38,
                                  height: 38,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  justifySelf: "start",
                                  opacity: 0.92,
                                }}
                              >
                                <VolunteerActivismIcon
                                  sx={{ color: "#ffffff", display: "block" }}
                                />
                              </MKBox>

                              <MKBox
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  textAlign: "center",
                                  px: 0.5,
                                }}
                              >
                                <MKTypography
                                  component="span"
                                  sx={{
                                    fontSize: { xs: "0.95rem", sm: "1rem" },
                                    fontWeight: 800,
                                    lineHeight: 1.15,
                                    color: "#ffffff !important",
                                    letterSpacing: "0.005em",
                                  }}
                                >
                                  {donatePage.membershipSection.directGiving.donateNowCta}
                                </MKTypography>
                                <MKTypography
                                  component="span"
                                  sx={{
                                    fontSize: { xs: "0.61rem", sm: "0.65rem" },
                                    fontWeight: 600,
                                    lineHeight: 1.3,
                                    mt: 0.3,
                                    color: "rgba(255, 255, 255, 0.9) !important",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {donatePage.membershipSection.directGiving.donateNowMethods}
                                </MKTypography>
                              </MKBox>

                              <MKBox
                                sx={{
                                  width: 38,
                                  height: 38,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  justifySelf: "end",
                                  opacity: 0.92,
                                }}
                              >
                                <ArrowForwardIcon sx={{ color: "#ffffff", display: "block" }} />
                              </MKBox>
                            </MKBox>
                          </MKBox>
                        </MKBox>

                        {/* Membership Support section */}
                        <MKBox sx={{ mb: 0.75, mt: { xs: 4.5, sm: 5 } }}>
                          <MKTypography
                            sx={{
                              fontWeight: 700,
                              color: "#1f2a44",
                              fontSize: { xs: "1.15rem", sm: "1.25rem" },
                            }}
                          >
                            {donatePage.membershipSection.directGiving.membershipCard.title}
                          </MKTypography>
                        </MKBox>
                        <MKTypography
                          sx={{
                            fontSize: { xs: "0.9rem", sm: "0.95rem" },
                            color: "rgba(31, 42, 68, 0.6)",
                            lineHeight: 1.5,
                            mb: 2,
                          }}
                        >
                          {donatePage.membershipSection.directGiving.membershipCard.subtitle}
                        </MKTypography>

                        <MKBox
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                            gap: { xs: 1.25, sm: 1.5 },
                          }}
                        >
                          {donatePage.membershipSection.membership.items.map((item, idx) => {
                            const meta =
                              donatePage.membershipSection.directGiving.membershipItems[idx];
                            if (!meta) return null;
                            const price = item.amount
                              .replace(/^Rs\s*/i, "")
                              .replace(/\s*\/\s*/g, " / ");
                            return (
                              <MKBox
                                key={meta.title}
                                sx={{
                                  textAlign: "center",
                                  borderRadius: "14px",
                                  backgroundColor: "#ffffff",
                                  border: "1px solid rgba(31, 42, 68, 0.06)",
                                  px: 1,
                                  py: 1.5,
                                }}
                              >
                                <MKTypography
                                  sx={{
                                    fontWeight: 700,
                                    color: "#1f2a44",
                                    fontSize: "0.85rem",
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {meta.title}
                                </MKTypography>
                                {item.detail ? (
                                  <MKTypography
                                    sx={{
                                      fontSize: "0.68rem",
                                      color: "rgba(31, 42, 68, 0.5)",
                                      mt: 0.15,
                                    }}
                                  >
                                    {item.detail.replace(/[()]/g, "").trim()}
                                  </MKTypography>
                                ) : null}
                                <MKBox
                                  sx={{
                                    borderTop: "1px dashed rgba(31, 42, 68, 0.14)",
                                    my: 0.75,
                                  }}
                                />
                                <MKTypography
                                  sx={{
                                    fontWeight: 800,
                                    color: "#2e7d32",
                                    fontSize: "0.92rem",
                                    fontVariantNumeric: "tabular-nums",
                                  }}
                                >
                                  ₹{price}
                                </MKTypography>
                              </MKBox>
                            );
                          })}
                        </MKBox>
                      </MKBox>

                      <MKBox
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: { xs: "center", lg: "flex-end" },
                          minHeight: 0,
                          pl: { lg: 3, xl: 4 },
                          pr: { lg: 0.5 },
                        }}
                      >
                        <MKBox
                          sx={{
                            width: "100%",
                            maxWidth: { xs: "100%", lg: 300 },
                            mt: { xs: 2.7, sm: 3.4 },
                            mb: 2,
                          }}
                        >
                          <MKTypography
                            sx={{
                              fontWeight: 700,
                              color: "#1f2a44",
                              fontSize: { xs: "1.15rem", sm: "1.25rem" },
                            }}
                          >
                            {donatePage.membershipSection.directGiving.scanCard.title}
                          </MKTypography>
                        </MKBox>

                        <MKBox
                          component="figure"
                          sx={{
                            m: 0,
                            mx: { xs: "auto", lg: 0 },
                            mb: 0,
                            mt: { lg: "auto" },
                            p: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            maxWidth: { xs: 260, sm: 280, md: 280, lg: 300 },
                            overflow: "hidden",
                          }}
                        >
                          <MKBox
                            component="img"
                            src={donate2UpiQr}
                            alt="Aadar Foundation UPI QR — scan to donate"
                            width="674"
                            height="1090"
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
                            sx={{
                              display: "block",
                              width: "100%",
                              maxWidth: { xs: 260, sm: 280, md: 280, lg: 300 },
                              aspectRatio: "674 / 1090",
                              height: "auto",
                              objectFit: "contain",
                              objectPosition: "center",
                              p: 0,
                              m: 0,
                              border: "1.5px solid rgba(100, 149, 237, 0.45)",
                              borderRadius: "12px",
                              boxShadow:
                                "0 8px 24px rgba(31, 42, 68, 0.1), 0 2px 8px rgba(31, 42, 68, 0.06)",
                              backgroundColor: "#fff",
                            }}
                          />
                        </MKBox>
                      </MKBox>
                    </MKBox>
                  </MKBox>
                </Grid>

                <Grid item xs={12}>
                  <MKBox
                    sx={{
                      px: { xs: 0.5, sm: 1, md: 1.5 },
                      mt: { xs: 3, sm: 3.5, md: 4 },
                      mb: { xs: 0.5, sm: 1 },
                    }}
                  >
                    <DonateReceiptCta />
                  </MKBox>
                </Grid>

                <Grid item xs={12}>
                  <MKBox
                    width="100%"
                    maxWidth={{ xs: "100%", sm: "64rem", md: "72rem", lg: "80rem" }}
                    px={{ xs: 1.25, sm: 2, md: 3 }}
                    pt={{ xs: 0.75, sm: 1 }}
                    pb={0}
                    mx="auto"
                    mt={{ xs: 1, sm: 1.25 }}
                    mb={0}
                    textAlign="center"
                    sx={{
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                  >
                    <MKBox
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexWrap="wrap"
                      gap={{ xs: 0.6, sm: 0.85 }}
                      mx="auto"
                      mb={0.85}
                    >
                      <MKBox
                        display="inline-flex"
                        alignItems="center"
                        gap={0.65}
                        px={{ xs: 1.2, sm: 1.4 }}
                        py={{ xs: 0.45, sm: 0.5 }}
                        sx={{
                          borderRadius: "999px",
                          backgroundColor: "rgba(236, 165, 51, 0.1)",
                          border: "1px solid rgba(236, 165, 51, 0.32)",
                          boxShadow: "0 2px 8px rgba(236, 165, 51, 0.14)",
                        }}
                      >
                        <BadgeOutlinedIcon sx={{ fontSize: 15, color: "#a3690a" }} />
                        <MKTypography
                          fontSize={{ xs: "0.74rem", sm: "0.8rem" }}
                          sx={{ color: "#a3690a", fontWeight: 700, lineHeight: 1 }}
                        >
                          {donatePage.panLabel}: {donatePage.panValue}
                        </MKTypography>
                      </MKBox>

                      <MKBox
                        display="inline-flex"
                        alignItems="center"
                        gap={0.65}
                        px={{ xs: 1.2, sm: 1.4 }}
                        py={{ xs: 0.45, sm: 0.5 }}
                        sx={{
                          borderRadius: "999px",
                          backgroundColor: "rgba(79, 169, 83, 0.1)",
                          border: "1px solid rgba(79, 169, 83, 0.32)",
                          boxShadow: "0 2px 8px rgba(79, 169, 83, 0.14)",
                        }}
                      >
                        <VerifiedUserOutlinedIcon sx={{ fontSize: 15, color: "#2e7d32" }} />
                        <MKTypography
                          fontSize={{ xs: "0.74rem", sm: "0.8rem" }}
                          sx={{ color: "#2e7d32", fontWeight: 700, lineHeight: 1 }}
                        >
                          {donatePage.certified80gLabel}
                        </MKTypography>
                      </MKBox>
                    </MKBox>
                    <MKTypography
                      fontSize={{ xs: "0.76rem", sm: "0.8rem" }}
                      sx={{
                        color: "rgba(31, 42, 68, 0.78)",
                        lineHeight: 1.45,
                        m: 0,
                      }}
                    >
                      {donatePage.message80g}
                    </MKTypography>
                    <MKTypography
                      component="p"
                      fontSize={{ xs: "0.7rem", sm: "0.74rem" }}
                      sx={{
                        color: "rgba(31, 42, 68, 0.55)",
                        lineHeight: 1.45,
                        mt: 0.75,
                        mb: 0,
                        whiteSpace: { xs: "normal", md: "nowrap" },
                      }}
                    >
                      {donatePage.domesticDonationsFootnote}
                    </MKTypography>
                  </MKBox>
                </Grid>
              </Grid>
            </MKBox>
          </Container>
        </MKBox>
      </Card>

      {/* Footer */}
      <MKBox pt={0} px={0} mt={0}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default Donate2;
