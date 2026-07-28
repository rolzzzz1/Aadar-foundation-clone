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

const SPONSOR_PURPOSE_KEYS = ["sponsor-prabhuji-month", "sponsor-prabhuji-year"];

function DecorativeLeaf({ side }) {
  const flip = side === "right" ? "scaleX(-1)" : "none";

  return (
    <MKBox
      component="img"
      src={sponsorLeafGold}
      alt=""
      aria-hidden="true"
      sx={{
        width: { xs: 116, sm: 162 },
        height: "auto",
        opacity: 0.9,
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
        mb: { xs: 3.25, md: 3.5 },
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

function SponsorIllustration({ src, alt }) {
  return (
    <MKBox
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: "100%",
        height: "auto",
        display: "block",
        objectFit: "contain",
      }}
    />
  );
}

SponsorIllustration.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

function ButtonHeartHandsIcon() {
  return (
    <MKBox
      component="svg"
      viewBox="0 0 26 26"
      aria-hidden
      sx={{ width: 22, height: 22, mr: 1.1, flexShrink: 0 }}
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

function SponsorCard({ card, idx, payButtonSx }) {
  const illustrationSrc = idx === 0 ? sponsorPrabhujiMonth : sponsorPrabhujiYear;
  const illustrationAlt =
    idx === 0
      ? "Illustration of a Prabhuji with a monthly calendar"
      : "Illustration of care supplies for a year of support";

  return (
    <MKBox
      sx={{
        width: { xs: "100%", lg: "47%" },
        maxWidth: { xs: "100%", lg: "47%" },
        flex: { lg: "0 0 47%" },
        minWidth: 0,
      }}
    >
      <MKBox
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: { xs: 2, sm: 2.3, md: 2.6 },
          p: { xs: 2, sm: 2.2, md: 2.5 },
          backgroundColor: "#ffffff",
          borderRadius: "18px",
          border: "1px solid rgba(82, 125, 62, 0.08)",
          boxShadow: "0 18px 46px rgba(31, 42, 68, 0.08)",
        }}
      >
        <MKBox
          sx={{
            width: { xs: 120, sm: 142, md: 160 },
            minWidth: { xs: 120, sm: 142, md: 160 },
            flexShrink: 0,
          }}
        >
          <SponsorIllustration src={illustrationSrc} alt={illustrationAlt} />
        </MKBox>

        <MKBox
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <MKTypography
            sx={{
              fontSize: { xs: "0.95rem", sm: "1rem", md: "1.03rem" },
              fontWeight: 700,
              color: "#1f2a44",
              lineHeight: 1.35,
              mb: 0.45,
            }}
          >
            {card.description}
          </MKTypography>
          <MKTypography
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.82rem" },
              fontWeight: 500,
              color: "rgba(31, 42, 68, 0.8)",
              lineHeight: 1.25,
              mb: 1.2,
            }}
          >
            {card.periodDetail}
          </MKTypography>
          <MKTypography
            sx={{
              mb: 1.55,
              fontSize: { xs: "1.02rem", sm: "1.08rem", md: "1.16rem" },
              fontWeight: 800,
              color: BRAND_GREEN,
              lineHeight: 1.25,
              letterSpacing: "0.01em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {card.highlight}
          </MKTypography>
          <MKButton
            component={Link}
            to={`${DONATION_CHECKOUT_PATH}?purpose=${encodeURIComponent(
              SPONSOR_PURPOSE_KEYS[idx] || SPONSOR_PURPOSE_KEYS[0]
            )}`}
            variant="contained"
            disableElevation
            sx={payButtonSx}
          >
            <ButtonHeartHandsIcon />
            {card.payButton}
          </MKButton>
        </MKBox>
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
  }).isRequired,
  idx: PropTypes.number.isRequired,
  payButtonSx: PropTypes.object.isRequired,
};

export default function SponsorPrabhujiCtaCards({ sponsor }) {
  const { title, subtitle, cards } = sponsor;

  const payButtonSx = {
    mt: "auto",
    py: { xs: 1.05, sm: 1.12, md: 1.18 },
    px: { xs: 1.5, sm: 1.8, md: 2.2 },
    width: "100%",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #67b35b 0%, #52a548 55%, #67b35b 100%)",
    color: "#ffffff !important",
    fontWeight: 800,
    fontSize: { xs: "0.9rem", sm: "0.95rem", md: "0.98rem" },
    lineHeight: 1.25,
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
          left: { xs: 8, md: 28 },
        }}
      >
        <DecorativeLeaf side="left" />
      </MKBox>
      <MKBox
        sx={{
          position: "absolute",
          top: { xs: 34, md: 44 },
          right: { xs: 8, md: 28 },
        }}
      >
        <DecorativeLeaf side="right" />
      </MKBox>

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
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "center",
          alignItems: "stretch",
          gap: { xs: 2.25, sm: 2.6, lg: 3 },
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
      })
    ).isRequired,
  }).isRequired,
};
