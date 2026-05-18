import PropTypes from "prop-types";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

/**
 * List rows styled like the food sponsorship section: label (+ optional detail) left, amount right-aligned.
 */
export default function DonateSectionPricingList({
  title,
  subtitle,
  items,
  wideAmountColumn = false,
}) {
  const gridTemplateColumns = wideAmountColumn
    ? {
        xs: "minmax(0, 1fr) minmax(6.25rem, 7.5rem)",
        sm: "minmax(0, 1fr) 9.25rem",
        md: "minmax(0, 1fr) 9.75rem",
      }
    : {
        xs: "minmax(0, 1fr) minmax(5rem, 5.75rem)",
        sm: "minmax(0, 1fr) 6.75rem",
        md: "minmax(0, 1fr) 7rem",
      };

  return (
    <>
      <MKTypography
        fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
        sx={{
          fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.3rem", lg: "1.5rem" },
          fontWeight: "400",
          width: "100%",
        }}
        pb={subtitle ? 0.75 : 2}
      >
        {title}
      </MKTypography>
      {subtitle ? (
        <MKTypography
          sx={{
            mb: { xs: 1.75, sm: 2 },
            fontSize: { xs: "0.78rem", sm: "0.82rem", md: "0.85rem" },
            fontWeight: 400,
            color: "rgba(31, 42, 68, 0.6)",
            lineHeight: 1.5,
            letterSpacing: "0.02em",
            width: "100%",
          }}
        >
          {subtitle}
        </MKTypography>
      ) : null}
      <MKBox
        component="ul"
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          width: "100%",
        }}
      >
        {items.map((row, idx) => {
          const isLast = idx === items.length - 1;
          const key = `${row.label}-${row.amount}-${idx}`;
          return (
            <MKBox
              key={key}
              component="li"
              sx={{
                display: "grid",
                gridTemplateColumns,
                columnGap: { xs: 1.25, sm: 2 },
                alignItems: "start",
                py: 1.1,
                letterSpacing: "0.05rem",
                borderBottom: !isLast ? "1px solid rgba(31, 42, 68, 0.08)" : "none",
                pb: !isLast ? 1.1 : 0,
              }}
            >
              <MKBox sx={{ minWidth: 0, pr: { xs: 0.5, sm: 1 } }}>
                <MKTypography
                  component="span"
                  display="block"
                  fontSize={{
                    xs: "0.8rem",
                    sm: "0.9rem",
                    md: "0.9rem",
                    lg: "1rem",
                  }}
                  sx={{
                    fontWeight: 500,
                    color: "#1f2a44",
                    lineHeight: 1.45,
                  }}
                >
                  {row.label}
                </MKTypography>
                {row.detail ? (
                  <MKTypography
                    component="span"
                    display="block"
                    fontSize={{ xs: "0.72rem", sm: "0.8rem", md: "0.82rem" }}
                    sx={{
                      color: "rgba(31, 42, 68, 0.62)",
                      mt: 0.35,
                      lineHeight: 1.4,
                    }}
                  >
                    {row.detail}
                  </MKTypography>
                ) : null}
              </MKBox>
              <MKTypography
                component="span"
                fontSize={{
                  xs: "0.8rem",
                  sm: "0.9rem",
                  md: "0.95rem",
                  lg: "1rem",
                }}
                sx={{
                  fontWeight: 700,
                  color: "#2e7d32",
                  whiteSpace: "nowrap",
                  textAlign: "right",
                  justifySelf: "stretch",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {row.amount}
              </MKTypography>
            </MKBox>
          );
        })}
      </MKBox>
    </>
  );
}

DonateSectionPricingList.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      detail: PropTypes.string,
      amount: PropTypes.string.isRequired,
    })
  ).isRequired,
  wideAmountColumn: PropTypes.bool,
};
