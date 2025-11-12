// React imports
import React from "react";

// i18next imports
import { useTranslation } from "react-i18next";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function Journey() {
  const { t } = useTranslation();
  const homePage = t("homePage");

  // Function to make specific parts bold
  const renderBoldText = (text) => {
    const parts = [
      "led by Mr. Vikas Goswami and supported by society.",
      "Mr. Vikas Goswami",
      "Swarg Sadan Ashram",
      '"Prabhujans" (divine souls)',
    ];
    const hindiParts = [
      "श्री विकास गोस्वामी और समाज द्वारा रची",
      "श्री विकास गोस्वामी",
      "स्वर्ग सदन आश्रम",
      '"प्रभुजन"',
    ];

    const allParts = [...parts, ...hindiParts].sort((a, b) => b.length - a.length);

    // Split text and wrap matching parts in bold
    const elements = [];
    let lastIndex = 0;
    const usedRanges = [];

    // Find all matches with their positions (process longer matches first)
    allParts.forEach((part) => {
      let searchIndex = 0;
      let index = text.indexOf(part, searchIndex);
      while (index !== -1) {
        // Check if this range overlaps with any used range
        const overlaps = usedRanges.some(
          (range) =>
            (index >= range.start && index < range.end) ||
            (index + part.length > range.start && index + part.length <= range.end) ||
            (index <= range.start && index + part.length >= range.end)
        );

        if (!overlaps) {
          usedRanges.push({ start: index, end: index + part.length, text: part });
        }
        searchIndex = index + 1;
        index = text.indexOf(part, searchIndex);
      }
    });

    // Sort by index
    usedRanges.sort((a, b) => a.start - b.start);

    // Build the JSX elements
    usedRanges.forEach((range, idx) => {
      if (range.start >= lastIndex) {
        // Add text before match
        if (range.start > lastIndex) {
          elements.push(text.substring(lastIndex, range.start));
        }
        // Add bold match
        elements.push(<strong key={`bold-${range.start}-${idx}`}>{range.text}</strong>);
        lastIndex = range.end;
      }
    });

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return elements.length > 0 ? elements : text;
  };

  return (
    <MKBox
      component="section"
      py={{ xs: 4, sm: 5, md: 6, lg: 7 }}
      mb={{ xs: 2, sm: 3, md: 4 }}
      mx={"auto"}
      sx={{
        backgroundColor: "#f0f2f5",
        borderRadius: { xs: "15px", sm: "18px", md: "20px" },
        width: { xs: "100%", sm: "95%", md: "90%", lg: "85%" },
        marginTop: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 0 },
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          spacing={{ xs: 2, sm: 3, md: 4 }}
        >
          <Grid item xs={12} sm={11} md={10} lg={10} xl={9} mx={"auto"}>
            <MKBox mb={{ xs: 2, sm: 2.5, md: 3 }} px={{ xs: 1, sm: 2, md: 2 }}>
              <MKTypography
                variant="h3"
                fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                sx={{
                  letterSpacing: "0.05rem",
                  fontSize: {
                    xs: "1.2rem",
                    sm: "1.3rem",
                    md: "1.75rem",
                    lg: "1.875rem",
                    xl: "2rem",
                  },
                  fontWeight: "600",
                  textAlign: "center",
                  mb: { xs: 2.5, sm: 3, md: 3.5 },
                }}
              >
                {homePage.journeySection.title}
              </MKTypography>
              <MKTypography
                sx={{
                  fontWeight: "400",
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.85rem",
                    md: "0.95rem",
                    lg: "1.05rem",
                    xl: "1.15rem",
                  },
                  letterSpacing: "0.05rem",
                  textAlign: "center",
                }}
              >
                {renderBoldText(homePage.journeySection.description)}
              </MKTypography>
            </MKBox>
          </Grid>
          <Grid item xs={12} sm={11} md={9} lg={9} xl={8} mx={"auto"}>
            <MKBox position="relative">
              <MKBox
                display="flex"
                justifyContent="center"
                sx={{
                  border: {
                    xs: "12px solid #000000",
                    sm: "15px solid #000000",
                    md: "18px solid #000000",
                    lg: "20px solid #000000",
                  },
                  borderRadius: {
                    xs: "15px",
                    sm: "20px",
                    md: "22px",
                    lg: "25px",
                  },
                  minHeight: {
                    xs: "200px",
                    sm: "280px",
                    md: "360px",
                    lg: "420px",
                    xl: "480px",
                  },
                  height: {
                    xs: "200px",
                    sm: "280px",
                    md: "360px",
                    lg: "420px",
                    xl: "480px",
                  },
                  boxShadow:
                    "0 8px 16px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
                  overflow: "hidden",
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/0jZWD7v2vOM"
                  title="YouTube video player"
                  style={{
                    border: "0px",
                    borderRadius: "0px",
                    display: "block",
                    margin: "0",
                    padding: "0",
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  autoPlay={true}
                ></iframe>
              </MKBox>
            </MKBox>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Journey;
