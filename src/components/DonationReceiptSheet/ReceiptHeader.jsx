import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { RECEIPT_HEADER_COLORS } from "utils/receiptHeaderHtml";

export { RECEIPT_HEADER_COLORS as RECEIPT_HEADER };

/**
 * Official receipt header: logo, org name, 80G pill with dotted rules, ribbon title.
 */
export default function ReceiptHeader({ org, title, logoSrc, logoSize = 72 }) {
  const c = RECEIPT_HEADER_COLORS;
  return (
    <Box sx={{ mb: 1.25 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.35,
          mb: 1,
        }}
      >
        {logoSrc ? (
          <Box
            component="img"
            src={logoSrc}
            alt={org.name}
            sx={{
              width: logoSize,
              height: logoSize,
              borderRadius: "50%",
              objectFit: "cover",
              border: `3px solid ${c.logoBorder}`,
              boxShadow: "0 2px 8px rgba(27, 94, 32, 0.12)",
            }}
          />
        ) : null}
        <Typography
          sx={{
            fontSize: { xs: "1.35rem", sm: "1.5rem" },
            fontWeight: 800,
            color: c.greenDark,
            lineHeight: 1.15,
            letterSpacing: "0.01em",
          }}
        >
          {org.name}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "0.88rem", sm: "0.95rem" },
            fontWeight: 700,
            color: c.navy,
            lineHeight: 1.2,
          }}
        >
          {org.subtitle}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: "100%",
          mb: 1,
          px: 0.5,
        }}
      >
        <Box
          sx={{
            flex: 1,
            borderTop: `2px dotted ${c.greenMid}`,
            opacity: 0.55,
            minWidth: 16,
          }}
        />
        <Typography
          component="span"
          sx={{
            flexShrink: 0,
            border: `1.5px solid ${c.greenMid}`,
            borderRadius: "999px",
            px: { xs: 1.25, sm: 1.75 },
            py: 0.45,
            fontSize: { xs: "0.58rem", sm: "0.62rem" },
            fontWeight: 700,
            color: c.greenDark,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            lineHeight: 1.25,
            whiteSpace: { xs: "normal", sm: "nowrap" },
            textAlign: "center",
          }}
        >
          {org.tagline}
        </Typography>
        <Box
          sx={{
            flex: 1,
            borderTop: `2px dotted ${c.greenMid}`,
            opacity: 0.55,
            minWidth: 16,
          }}
        />
      </Box>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            bgcolor: c.greenDark,
            color: "#fff",
            py: { xs: 0.65, sm: 0.75 },
            px: 3,
            textAlign: "center",
            clipPath:
              "polygon(14px 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0 50%)",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: { xs: "0.78rem", sm: "0.88rem" },
              fontWeight: 800,
              letterSpacing: "0.14em",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

ReceiptHeader.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    tagline: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  logoSrc: PropTypes.string,
  logoSize: PropTypes.number,
};
