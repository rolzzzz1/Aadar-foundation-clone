import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { DONATION_CHECKOUT_PATH } from "utils/donation";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

const BRAND_GREEN = "#2e7d32";

/** Server-enforced program keys (see utils/donation.js PROGRAMS). Order matches sponsor.cards. */
const SPONSOR_PURPOSE_KEYS = ["sponsor-prabhuji-month", "sponsor-prabhuji-year"];

/**
 * Sponsor Prabhuji — CTA cards at 40% width each on md+ (centered row); full width stacked on xs.
 * Pay Now links use `purpose` so the API sets the canonical amount (not a client-controlled amount).
 */
export default function SponsorPrabhujiCtaCards({ sponsor }) {
  const { title, subtitle, cards } = sponsor;

  const payButtonSx = {
    mt: "auto",
    py: { xs: 1.25, sm: 1.4, md: 1.5 },
    px: { xs: 2, sm: 2.5, md: 3 },
    width: "100%",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #4FA953 0%, #45a049 55%, #4FA953 100%)",
    color: "#ffffff !important",
    fontWeight: 800,
    fontSize: { xs: "0.82rem", sm: "0.9rem", md: "0.95rem" },
    lineHeight: 1.3,
    letterSpacing: "0.2px",
    textTransform: "none",
    textDecoration: "none",
    boxShadow: "0 14px 30px rgba(79, 169, 83, 0.22)",
    whiteSpace: "normal",
    transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
    "&&": { color: "#ffffff" },
    "& *": { color: "#ffffff" },
    "& .MuiSvgIcon-root": { color: "#ffffff" },
    "&:hover": {
      background: "linear-gradient(90deg, #45a049 0%, #3d8a41 55%, #45a049 100%)",
      boxShadow: "0 18px 36px rgba(79, 169, 83, 0.28)",
      textDecoration: "none",
      transform: "translateY(-1px)",
    },
    "&:active": {
      background: "linear-gradient(90deg, #45a049 0%, #3d8a41 55%, #45a049 100%)",
      transform: "translateY(0px)",
      boxShadow: "0 10px 22px rgba(79, 169, 83, 0.22)",
    },
    // MKButtonRoot applies a near-white background on `:focus:not(:hover)` for
    // contained primary buttons, which makes the button look white after click.
    // Override every focus state so the green gradient persists.
    "&:focus, &.Mui-focusVisible, &:focus-visible, &:focus:not(:hover)": {
      background: "linear-gradient(90deg, #4FA953 0%, #45a049 55%, #4FA953 100%)",
      color: "#ffffff",
      boxShadow: "0 14px 30px rgba(79, 169, 83, 0.22)",
      outline: "none",
    },
  };

  return (
    <MKBox sx={{ width: "100%" }}>
      <MKTypography
        fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
        sx={{
          fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.3rem", lg: "1.5rem" },
          fontWeight: 400,
          width: "100%",
          textAlign: "center",
        }}
        pb={subtitle ? 1 : { xs: 4, sm: 4.5, md: 5 }}
      >
        {title}
      </MKTypography>
      {subtitle ? (
        <MKTypography
          sx={{
            width: "100%",
            textAlign: "center",
            mb: { xs: 3, sm: 3.5, md: 4 },
            fontSize: { xs: "0.78rem", sm: "0.82rem", md: "0.85rem" },
            fontWeight: 400,
            color: "rgba(31, 42, 68, 0.6)",
            lineHeight: 1.5,
            letterSpacing: "0.02em",
            maxWidth: { xs: "100%", sm: 560, md: 640 },
            mx: "auto",
          }}
        >
          {subtitle}
        </MKTypography>
      ) : null}

      <MKBox
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "stretch",
          gap: { xs: 2, sm: 2.5 },
          width: "100%",
        }}
      >
        {cards.map((card, idx) => (
          <MKBox
            key={`${card.highlight}-${idx}`}
            sx={{
              width: { xs: "100%", md: "40%" },
              maxWidth: { xs: "100%", md: "40%" },
              flex: { md: "0 0 40%" },
              minWidth: 0,
            }}
          >
            <MKBox
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                p: { xs: 2.5, sm: 3, md: 3.25 },
                boxShadow: "0 6px 24px rgba(31, 42, 68, 0.1), 0 2px 8px rgba(31, 42, 68, 0.06)",
                border: "1px solid rgba(31, 42, 68, 0.06)",
              }}
            >
              <MKTypography
                sx={{
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem", lg: "1.25rem" },
                  fontWeight: 600,
                  color: "#1f2a44",
                  lineHeight: 1.4,
                  width: "100%",
                  maxWidth: "100%",
                }}
              >
                {card.description}
              </MKTypography>
              <MKTypography
                sx={{
                  mt: 1,
                  fontSize: { xs: "0.82rem", sm: "0.88rem" },
                  fontWeight: 500,
                  color: "rgba(31, 42, 68, 0.75)",
                  width: "100%",
                }}
              >
                {card.periodDetail}
              </MKTypography>
              <MKTypography
                sx={{
                  mt: 2,
                  mb: 2,
                  fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.15rem" },
                  fontWeight: 700,
                  color: BRAND_GREEN,
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
                {card.payButton}
              </MKButton>
            </MKBox>
          </MKBox>
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
