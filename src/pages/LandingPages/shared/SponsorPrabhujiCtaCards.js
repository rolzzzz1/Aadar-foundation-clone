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
        width: { xs: 100, sm: 140 },
        height: "auto",
        opacity: 0.85,
        transform: flip,
        display: "block",
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
        gap: 1,
        mb: { xs: 3, md: 3.25 },
      }}
    >
      <MKBox sx={{ width: 94, height: 1.5, bgcolor: "rgba(82, 125, 62, 0.28)" }} />
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
      <MKBox sx={{ width: 94, height: 1.5, bgcolor: "rgba(82, 125, 62, 0.28)" }} />
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
          xs: "calc(33.333% - 8px)",
          sm: "calc(33.333% - 12px)",
          lg: "calc(33.333% - 14px)",
        },
        flex: "1 1 0",
        minWidth: 0,
        display: "flex",
      }}
    >
      <MKBox
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          px: { xs: 1, sm: 1.5, md: 2 },
          pt: { xs: 1.15, sm: 1.4, md: 1.65 },
          pb: { xs: 1.15, sm: 1.4, md: 1.65 },
          backgroundColor: "#ffffff",
          borderRadius: { xs: "14px", sm: "18px" },
          border: "1px solid rgba(82, 125, 62, 0.1)",
          boxShadow: "0 14px 36px rgba(31, 42, 68, 0.07)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 18px 42px rgba(31, 42, 68, 0.1)",
          },
        }}
      >
        <MKBox
          sx={{
            width: "100%",
            height: { xs: 72, sm: 88, md: 102 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 0.85,
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {isFood ? (
            <MKBox
              sx={{
                width: { xs: 96, sm: 118, md: 128 },
                height: "100%",
                transform: { xs: "scale(1.08)", sm: "scale(1.18)" },
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
                transform: { xs: "scale(1.12)", sm: "scale(1.28)" },
                transformOrigin: "center center",
              }}
            />
          )}
        </MKBox>

        <MKTypography
          sx={{
            fontSize: { xs: "0.78rem", sm: "0.9rem", md: "0.98rem" },
            fontWeight: 700,
            color: "#1f2a44",
            lineHeight: 1.3,
            minHeight: { sm: "2.6em" },
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {card.description}
        </MKTypography>

        <MKTypography
          sx={{
            mt: 0.3,
            fontSize: { xs: "0.68rem", sm: "0.76rem", md: "0.8rem" },
            fontWeight: 500,
            color: "rgba(31, 42, 68, 0.62)",
            lineHeight: 1.25,
            minHeight: { sm: "1.25em" },
          }}
        >
          {card.periodDetail}
        </MKTypography>

        <MKTypography
          sx={{
            mt: { xs: 0.65, sm: 1 },
            mb: { xs: 0.9, sm: 1.25 },
            fontSize: { xs: "0.82rem", sm: "0.95rem", md: "1.08rem" },
            fontWeight: 800,
            color: BRAND_GREEN,
            lineHeight: 1.2,
            letterSpacing: "0.01em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {card.highlight}
        </MKTypography>

        <MKButton
          component={Link}
          to={`${DONATION_CHECKOUT_PATH}?purpose=${encodeURIComponent(purpose)}`}
          variant="contained"
          disableElevation
          sx={{
            ...payButtonSx,
            mt: "auto",
          }}
        >
          <ButtonHeartHandsIcon />
          {card.payButton}
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
    py: { xs: 0.85, sm: 1.05, md: 1.1 },
    px: { xs: 0.75, sm: 1.4, md: 1.6 },
    width: "100%",
    minHeight: { xs: 44, sm: 48 },
    borderRadius: "12px",
    background: "linear-gradient(90deg, #67b35b 0%, #52a548 55%, #67b35b 100%)",
    color: "#ffffff !important",
    fontWeight: 800,
    fontSize: { xs: "0.68rem", sm: "0.82rem", md: "0.9rem" },
    lineHeight: 1.2,
    textTransform: "none",
    textDecoration: "none",
    boxShadow: "0 12px 28px rgba(82, 165, 72, 0.24)",
    whiteSpace: "normal",
    "&&": { color: "#ffffff" },
    "& *": { color: "#ffffff" },
    "&:hover": {
      background: "linear-gradient(90deg, #5aa84f 0%, #48963f 55%, #5aa84f 100%)",
      boxShadow: "0 15px 32px rgba(82, 165, 72, 0.3)",
      textDecoration: "none",
      transform: "translateY(-1px)",
    },
    "&:focus, &.Mui-focusVisible, &:focus-visible, &:focus:not(:hover)": {
      background: "linear-gradient(90deg, #67b35b 0%, #52a548 55%, #67b35b 100%)",
      color: "#ffffff",
      boxShadow: "0 12px 28px rgba(82, 165, 72, 0.24)",
      outline: "none",
    },
  };

  return (
    <MKBox
      sx={{
        width: "100%",
        position: "relative",
      }}
    >
      <MKBox
        sx={{
          position: "absolute",
          top: { xs: 34, md: 44 },
          left: { xs: 4, md: 16 },
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <DecorativeLeaf side="left" />
      </MKBox>
      <MKBox
        sx={{
          position: "absolute",
          top: { xs: 34, md: 44 },
          right: { xs: 4, md: 16 },
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <DecorativeLeaf side="right" />
      </MKBox>

      <MKBox sx={{ position: "relative", zIndex: 1 }}>
        <MKTypography
          sx={{
            fontFamily:
              '"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
            fontSize: { xs: "1.3rem", sm: "1.52rem", md: "1.72rem" },
            fontWeight: 500,
            color: "#1f2a44",
            textAlign: "center",
            lineHeight: 1.15,
            mb: 1.2,
          }}
        >
          {title}
        </MKTypography>

        {subtitle ? (
          <MKTypography
            sx={{
              textAlign: "center",
              mb: 1.1,
              fontSize: { xs: "0.92rem", sm: "1rem", md: "1.02rem" },
              fontWeight: 400,
              color: "rgba(31, 42, 68, 0.62)",
              lineHeight: 1.55,
              maxWidth: { xs: "100%", sm: 580, md: 640 },
              mx: "auto",
              px: 2,
            }}
          >
            {subtitle}
          </MKTypography>
        ) : null}

        <DividerFlourish />

        <MKBox
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "center",
            alignItems: "stretch",
            gap: { xs: 1.25, sm: 2, lg: 2.5 },
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
