import React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import LazyVisible from "components/LazyMedia/LazyVisible";
import donateImg from "assets/images/donate-happy-faces.png";
import ImpactLeaf from "./ImpactLeaf";
import ImpactTestimonialCarousel, { FALLBACK_TESTIMONIALS } from "./ImpactTestimonialCarousel";

function DonateImpactProof({ donatePage, impactBanner, scrollToDonateWidget }) {
  return (
    <LazyVisible rootMargin="600px" minHeight={200}>
      <MKBox
        sx={{
          mt: { xs: 5, sm: 6, md: 7 },
          mb: { xs: 3, sm: 3.5, md: 4 },
          pt: { xs: 0.5, sm: 0.75 },
          pb: { xs: 0.5, sm: 0.75 },
        }}
      >
        <MKBox
          sx={{
            display: "block",
            color: "inherit",
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: "16px", md: "18px" },
            backgroundColor: "#ffffff",
            border: "1px solid rgba(31, 42, 68, 0.07)",
            boxShadow: "0 10px 28px rgba(31, 42, 68, 0.06)",
            px: { xs: 1.75, sm: 2.5, md: 3 },
            py: { xs: 1.65, sm: 1.85, md: 2 },
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
          }}
        >
          <Grid container spacing={{ xs: 1.75, md: 2.5 }} alignItems="stretch">
            <Grid item xs={12} md={5} lg={5}>
              <MKBox
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  gap: { xs: 1.6, sm: 1.75, md: 1.85 },
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
                    gap: 0.85,
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
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 1.35, sm: 1.75 },
                    px: { xs: 1.5, sm: 1.75 },
                    py: { xs: 1.35, sm: 1.5 },
                    borderRadius: "16px",
                    border: "1px solid rgba(31, 42, 68, 0.08)",
                    backgroundColor: "rgba(250, 248, 242, 0.9)",
                    textAlign: "left",
                    color: "#1f2a44",
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

                  <MKBox sx={{ flex: 1, minWidth: 0 }}>
                    <MKTypography
                      sx={{
                        color: "rgba(31, 42, 68, 0.78)",
                        fontWeight: 500,
                        fontSize: { xs: "0.76rem", sm: "0.8rem" },
                        lineHeight: 1.45,
                      }}
                    >
                      {impactBanner.impactMessage ||
                        "Making a difference together, one life at a time."}
                    </MKTypography>
                    <MKTypography
                      component="button"
                      type="button"
                      onClick={scrollToDonateWidget}
                      sx={{
                        mt: 0.75,
                        p: 0,
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#2e7d32",
                        fontWeight: 700,
                        fontSize: { xs: "0.78rem", sm: "0.82rem" },
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                        "&:hover": { color: "#1e6b2c" },
                      }}
                    >
                      {donatePage.membershipSection?.conversion?.useFormAboveCta ||
                        "Donate with the form above"}
                    </MKTypography>
                  </MKBox>
                </MKBox>

                <ImpactTestimonialCarousel
                  testimonials={
                    Array.isArray(impactBanner.testimonials) && impactBanner.testimonials.length > 0
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
                  height={{ xs: "168px", sm: "192px", md: "210px", lg: "224px" }}
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
  );
}

DonateImpactProof.propTypes = {
  donatePage: PropTypes.object.isRequired,
  impactBanner: PropTypes.object.isRequired,
  scrollToDonateWidget: PropTypes.func.isRequired,
};

export default DonateImpactProof;
export { FALLBACK_TESTIMONIALS };
