import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { DONATION_CHECKOUT_PATH } from "utils/donation";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import sponsorLeafGold from "assets/images/sponsor-leaf-gold.png";
import sponsorPrabhujiMonth from "assets/images/sponsor-prabhuji-month.png";
import sponsorPrabhujiYear from "assets/images/sponsor-prabhuji-year.png";

const BRAND_GREEN = "#527d3e";

function DecorativeLeaf({ side }) {
  const flip = side === "right" ? "scaleX(-1)" : "none";

  return (
    <MKBox
      component="img"
      src={sponsorLeafGold}
      alt=""
      aria-hidden="true"
      sx={{
        display: { xs: "none", md: "block" },
        width: { md: 120, lg: 140 },
        height: "auto",
        opacity: 0.85,
        transform: flip,
        objectFit: "contain",
      }}
    />
  );
}

DecorativeLeaf.propTypes = {
  side: PropTypes.oneOf(["left", "right"]).isRequired,
};

function DividerFlourish() {
  return (
    <MKBox
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 0.75, sm: 1 },
        mb: { xs: 2.25, sm: 2.75, md: 3.25 },
        px: { xs: 1, sm: 0 },
      }}
    >
      <MKBox
        sx={{
          width: { xs: 48, sm: 72, md: 94 },
          height: 1.5,
          bgcolor: "rgba(82, 125, 62, 0.28)",
          flexShrink: 0,
        }}
      />
      <MKBox
        component="svg"
        viewBox="0 0 24 16"
        aria-hidden
        sx={{ width: { xs: 16, sm: 20 }, height: "auto", color: "#c7b238", flexShrink: 0 }}
      >
        <path
          d="M12 13c0-4 1.6-6.7 6-8-1 4.8-3.4 7.2-6 8zm0 0C12 9 10.4 6.3 6 5c1 4.8 3.4 7.2 6 8z"
          fill="currentColor"
        />
      </MKBox>
      <MKBox
        sx={{
          width: { xs: 48, sm: 72, md: 94 },
          height: 1.5,
          bgcolor: "rgba(82, 125, 62, 0.28)",
          flexShrink: 0,
        }}
      />
    </MKBox>
  );
}

/** Meal art with the same soft sage blob backdrop as the month/year PNGs. */
function FoodMealIllustration() {
  return (
    <MKBox
      component="svg"
      viewBox="0 0 200 180"
      role="img"
      aria-label="Illustration of a meal plate for Prabhuji"
      sx={{ width: "100%", height: "100%", display: "block" }}
    >
      {/* Soft green organic background — matches sponsor card illustrations */}
      <path
        d="M28 96c2-34 28-62 72-68 38-5 74 18 82 52 7 30-8 58-36 70-26 11-58 10-82-2-28-14-38-32-36-52z"
        fill="#dce8d4"
      />
      <circle cx="48" cy="58" r="4" fill="#c7d9bc" />
      <circle cx="158" cy="48" r="3.2" fill="#c7d9bc" />
      <circle cx="168" cy="112" r="2.6" fill="#c7d9bc" />

      {/* Plate + meal */}
      <ellipse cx="100" cy="138" rx="52" ry="9" fill="rgba(82, 125, 62, 0.14)" />
      <ellipse
        cx="100"
        cy="108"
        rx="58"
        ry="20"
        fill="#e8f0e4"
        stroke="#527d3e"
        strokeWidth="2.4"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="46"
        ry="15"
        fill="#fffef8"
        stroke="#6f8f5c"
        strokeWidth="1.8"
      />
      <ellipse cx="86" cy="98" rx="15" ry="10" fill="#f4e2a8" />
      <ellipse cx="114" cy="96" rx="12" ry="9" fill="#d8e8cf" />
      <ellipse cx="100" cy="106" rx="11" ry="7" fill="#f0c27a" />

      {/* Leaf garnish */}
      <path
        d="M138 62c0 16-12 26-22 30"
        fill="none"
        stroke="#c7b238"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M128 56c2.2 7 1 14-2.2 18M134 58c1.6 6 0.4 11-1.8 15"
        fill="none"
        stroke="#527d3e"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </MKBox>
  );
}

function ButtonHeartHandsIcon() {
  return (
    <MKBox
      component="svg"
      viewBox="0 0 26 26"
      aria-hidden
      sx={{ width: 20, height: 20, mr: 1, flexShrink: 0 }}
    >
      <path
        d="M13 10.4c-.7-1.4-2.3-2.3-3.9-2.3-2 0-3.5 1.5-3.5 3.4 0 3 3.1 5.3 7.4 8.2 4.3-2.9 7.4-5.2 7.4-8.2 0-1.9-1.5-3.4-3.5-3.4-1.6 0-3.2.9-3.9 2.3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 18.7c1.4 0 2.2.7 3 1.4.9.8 1.8 1.6 3.5 1.6 1.7 0 2.6-.8 3.5-1.6.8-.7 1.6-1.4 3-1.4 1 0 1.7.2 2.1.5-.6 1.5-2.5 2.7-4.6 2.7H10c-2.1 0-4-1.1-4.7-2.7.5-.3 1.2-.5 2.2-.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.8 17.1l3.1 2.2M22.2 17.1l-3.1 2.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </MKBox>
  );
}

function resolvePurpose(card, idx) {
  if (card.purpose) return card.purpose;
  if (idx === 0) return "sponsor-prabhuji-month";
  if (idx === 1) return "sponsor-prabhuji-year";
  return "food-10-prabhuji";
}

function SponsorCard({ card, idx, payButtonSx }) {
  const purpose = resolvePurpose(card, idx);
  const isFood = purpose === "food-10-prabhuji" || idx === 2;

  return (
    <MKBox
      sx={{
        width: {
          xs: "100%",
          md: "calc(33.333% - 12px)",
          lg: "calc(33.333% - 14px)",
        },
        flex: { xs: "1 1 auto", md: "1 1 0" },
        minWidth: 0,
        display: "flex",
      }}
    >
      <MKBox
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          alignItems: "center",
          justifyContent: { xs: "space-between", md: "flex-start" },
          gap: { xs: 1.25, md: 0 },
          textAlign: { xs: "left", md: "center" },
          px: { xs: 1.35, sm: 1.5, md: 1.35, lg: 2 },
          py: { xs: 1.25, sm: 1.35, md: 1.5, lg: 1.65 },
          backgroundColor: "#ffffff",
          borderRadius: { xs: "14px", md: "18px" },
          border: "1px solid rgba(82, 125, 62, 0.1)",
          boxShadow: "0 14px 36px rgba(31, 42, 68, 0.07)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          overflow: "hidden",
          "&:hover": {
            transform: { md: "translateY(-3px)" },
            boxShadow: { md: "0 18px 42px rgba(31, 42, 68, 0.1)" },
          },
        }}
      >
        <MKBox
          sx={{
            width: "100%",
            height: { md: 80, lg: 102 },
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            mb: { md: 0.75 },
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {isFood ? (
            <MKBox
              sx={{
                width: { md: 108, lg: 128 },
                height: "100%",
                transform: "scale(1.18)",
                transformOrigin: "center center",
              }}
            >
              <FoodMealIllustration />
            </MKBox>
          ) : (
            <MKBox
              component="img"
              src={idx === 0 ? sponsorPrabhujiMonth : sponsorPrabhujiYear}
              alt={
                idx === 0
                  ? "Illustration of a Prabhuji with a monthly calendar"
                  : "Illustration of care supplies for a year of support"
              }
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center bottom",
                display: "block",
                transform: "scale(1.28)",
                transformOrigin: "center center",
              }}
            />
          )}
        </MKBox>

        <MKBox
          sx={{
            flex: { xs: "1 1 auto", md: "0 0 auto" },
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "flex-start", md: "center" },
            width: { md: "100%" },
            pr: { xs: 0.5, md: 0 },
          }}
        >
          <MKTypography
            sx={{
              fontSize: { xs: "0.86rem", sm: "0.9rem", md: "0.88rem", lg: "0.98rem" },
              fontWeight: 700,
              color: "#1f2a44",
              lineHeight: 1.3,
              minHeight: { md: "2.6em" },
              display: "flex",
              alignItems: { xs: "flex-start", md: "flex-end" },
              justifyContent: { xs: "flex-start", md: "center" },
            }}
          >
            {card.description}
          </MKTypography>

          <MKTypography
            sx={{
              mt: 0.25,
              fontSize: { xs: "0.7rem", sm: "0.74rem", md: "0.72rem", lg: "0.8rem" },
              fontWeight: 500,
              color: "rgba(31, 42, 68, 0.62)",
              lineHeight: 1.25,
              minHeight: { md: "1.25em" },
            }}
          >
            {card.periodDetail}
          </MKTypography>

          <MKTypography
            sx={{
              mt: { xs: 0.4, md: 0.85 },
              mb: { xs: 0, md: 1.1 },
              fontSize: { xs: "0.9rem", sm: "0.95rem", md: "0.95rem", lg: "1.08rem" },
              fontWeight: 800,
              color: BRAND_GREEN,
              lineHeight: 1.2,
              letterSpacing: "0.01em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {card.highlight}
          </MKTypography>
        </MKBox>

        <MKButton
          component={Link}
          to={`${DONATION_CHECKOUT_PATH}?purpose=${encodeURIComponent(purpose)}`}
          variant="contained"
          disableElevation
          sx={{
            ...payButtonSx,
            mt: { xs: 0, md: "auto" },
            width: { xs: "auto", md: "100%" },
            maxWidth: "100%",
            flexShrink: 1,
            alignSelf: { xs: "center", md: "stretch" },
            minWidth: { xs: 0, md: 0 },
            overflow: "hidden",
          }}
        >
          <MKBox
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 0.5, md: 0.65 },
              minWidth: 0,
              maxWidth: "100%",
              color: "#ffffff !important",
              "&, & *": { color: "#ffffff !important" },
            }}
          >
            <MKBox
              component="span"
              sx={{
                display: "inline-flex",
                flexShrink: 0,
                color: "#ffffff !important",
                "& > *": {
                  width: { xs: 16, md: 18, lg: 20 },
                  height: { xs: 16, md: 18, lg: 20 },
                  mr: { xs: 0.5, md: 0.75 },
                  color: "#ffffff !important",
                },
              }}
            >
              <ButtonHeartHandsIcon />
            </MKBox>
            <MKBox
              component="span"
              sx={{
                color: "#ffffff !important",
                fontWeight: 800,
                lineHeight: 1.2,
                textAlign: "center",
                whiteSpace: "normal",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                minWidth: 0,
              }}
            >
              {card.payButton}
            </MKBox>
          </MKBox>
        </MKButton>
      </MKBox>
    </MKBox>
  );
}

SponsorCard.propTypes = {
  card: PropTypes.shape({
    description: PropTypes.string.isRequired,
    periodDetail: PropTypes.string.isRequired,
    highlight: PropTypes.string.isRequired,
    payButton: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    purpose: PropTypes.string,
  }).isRequired,
  idx: PropTypes.number.isRequired,
  payButtonSx: PropTypes.object.isRequired,
};

export default function SponsorPrabhujiCtaCards({ sponsor }) {
  const { title, subtitle, cards } = sponsor;

  const payButtonSx = {
    py: { xs: 0.9, sm: 1, md: 1, lg: 1.1 },
    px: { xs: 1.1, sm: 1.25, md: 1, lg: 1.4 },
    width: "100%",
    minHeight: { xs: 40, sm: 44, md: 46, lg: 48 },
    borderRadius: "12px",
    background: "linear-gradient(90deg, #67b35b 0%, #52a548 55%, #67b35b 100%)",
    color: "#ffffff !important",
    fontWeight: 800,
    fontSize: { xs: "0.72rem", sm: "0.78rem", md: "0.74rem", lg: "0.86rem" },
    lineHeight: 1.2,
    textTransform: "none",
    textDecoration: "none",
    boxShadow: "0 12px 28px rgba(82, 165, 72, 0.24)",
    whiteSpace: "normal",
    "&&": { color: "#ffffff !important" },
    "&, & *": { color: "#ffffff !important" },
    "&:hover": {
      background: "linear-gradient(90deg, #5aa84f 0%, #48963f 55%, #5aa84f 100%)",
      boxShadow: "0 15px 32px rgba(82, 165, 72, 0.3)",
      textDecoration: "none",
      transform: "translateY(-1px)",
      color: "#ffffff !important",
      "&, & *": { color: "#ffffff !important" },
    },
    "&:focus, &.Mui-focusVisible, &:focus-visible, &:focus:not(:hover)": {
      background: "linear-gradient(90deg, #67b35b 0%, #52a548 55%, #67b35b 100%)",
      color: "#ffffff !important",
      boxShadow: "0 12px 28px rgba(82, 165, 72, 0.24)",
      outline: "none",
      "&, & *": { color: "#ffffff !important" },
    },
  };

  return (
    <MKBox
      sx={{
        width: "100%",
        maxWidth: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <MKBox
        sx={{
          position: "absolute",
          top: { md: 44 },
          left: { md: 8, lg: 16 },
          pointerEvents: "none",
          zIndex: 0,
          display: { xs: "none", md: "block" },
        }}
      >
        <DecorativeLeaf side="left" />
      </MKBox>
      <MKBox
        sx={{
          position: "absolute",
          top: { md: 44 },
          right: { md: 8, lg: 16 },
          pointerEvents: "none",
          zIndex: 0,
          display: { xs: "none", md: "block" },
        }}
      >
        <DecorativeLeaf side="right" />
      </MKBox>

      <MKBox sx={{ position: "relative", zIndex: 1, width: "100%" }}>
        <MKTypography
          sx={{
            fontFamily:
              '"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
            fontSize: { xs: "1.22rem", sm: "1.45rem", md: "1.72rem" },
            fontWeight: 500,
            color: "#1f2a44",
            textAlign: "center",
            lineHeight: 1.2,
            mb: { xs: 1, sm: 1.2 },
            px: { xs: 0.5, sm: 1 },
          }}
        >
          {title}
        </MKTypography>

        {subtitle ? (
          <MKTypography
            sx={{
              textAlign: "center",
              mb: { xs: 0.85, sm: 1.1 },
              fontSize: { xs: "0.86rem", sm: "0.96rem", md: "1.02rem" },
              fontWeight: 400,
              color: "rgba(31, 42, 68, 0.62)",
              lineHeight: 1.55,
              maxWidth: { xs: "100%", sm: 580, md: 640 },
              mx: "auto",
              px: { xs: 1, sm: 2 },
            }}
          >
            {subtitle}
          </MKTypography>
        ) : null}

        <DividerFlourish />

        <MKBox
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            flexWrap: "nowrap",
            justifyContent: "center",
            alignItems: "stretch",
            gap: { xs: 1.15, sm: 1.35, md: 2, lg: 2.5 },
            width: "100%",
          }}
        >
          {cards.map((card, idx) => (
            <SponsorCard
              key={`${card.highlight}-${idx}`}
              card={card}
              idx={idx}
              payButtonSx={payButtonSx}
            />
          ))}
        </MKBox>
      </MKBox>
    </MKBox>
  );
}

SponsorPrabhujiCtaCards.propTypes = {
  sponsor: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    cards: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        periodDetail: PropTypes.string.isRequired,
        highlight: PropTypes.string.isRequired,
        payButton: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        purpose: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};
