import React from "react";
import PropTypes from "prop-types";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

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
          minHeight: { xs: 100, sm: 96 },
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

export { FALLBACK_TESTIMONIALS };
export default ImpactTestimonialCarousel;
