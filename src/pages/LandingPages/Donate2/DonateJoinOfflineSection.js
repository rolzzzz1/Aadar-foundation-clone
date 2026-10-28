import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import DonateReceiptCta from "pages/LandingPages/shared/DonateReceiptCta";
import SponsorPrabhujiCtaCards from "pages/LandingPages/shared/SponsorPrabhujiCtaCards";
import donate2UpiQr from "assets/images/donate2-upi-qr.png";
import { DONATION_RECEIPT_PATH } from "utils/donation";
import { GALLERY_PATH } from "utils/paths";

function DonateJoinOfflineSection({
  donatePage,
  bankOpen,
  setBankOpen,
  scrollToDonateWidget,
  setSelectedAmount,
  setCustomAmount,
}) {
  const membershipSection = donatePage.membershipSection;
  const direct = membershipSection.directGiving;
  const conversion = membershipSection?.conversion;
  const foodGuide = membershipSection.foodSponsorship;
  const membershipGuide = membershipSection.membership;

  const openBank = (e) => {
    if (e) e.preventDefault();
    setBankOpen(true);
    const el = document.getElementById("bank");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <MKBox
      component="section"
      pt={{ xs: 2.5, sm: 3, md: 3.5 }}
      pb={{ xs: 2, sm: 2.5 }}
      mt={{ xs: 3, sm: 4, md: 5 }}
      mb={{ xs: 2, sm: 2.5 }}
      mx={0}
      px={{ xs: 1.5, sm: 2, md: 3, lg: 4 }}
      sx={{
        backgroundColor: "rgba(250, 248, 242, 0.65)",
        borderRadius: "20px",
      }}
    >
      <Grid
        container
        pt={{ xs: 0.5, sm: 1 }}
        px={{ xs: 1, sm: 2 }}
        spacing={1}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} textAlign="center">
          <MKTypography
            variant="h4"
            fontFamily='"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif'
            sx={{
              fontSize: { xs: "1.45rem", sm: "1.75rem", md: "1.95rem" },
              fontWeight: 500,
              color: "#1f2a44",
              py: { xs: 0.75, sm: 1 },
            }}
          >
            <MKBox component="span" sx={{ color: "#ECA533", mr: 1.25 }}>
              {donatePage.membershipSection.title}
            </MKBox>
            {donatePage.membershipSection.subTitle}
          </MKTypography>
        </Grid>
      </Grid>

      <MKBox
        sx={{
          width: "100%",
          px: { xs: 1, sm: 2, md: 2 },
          pt: { xs: 2.5, sm: 3 },
          pb: { xs: 0.5, sm: 1 },
        }}
      >
        <SponsorPrabhujiCtaCards sponsor={donatePage.membershipSection.sponsorPrabhuji} />
      </MKBox>

      <MKBox
        sx={{
          px: { xs: 1, sm: 2 },
          pt: { xs: 1.5, sm: 2 },
          pb: { xs: 1, sm: 1.5 },
          textAlign: "center",
        }}
      >
        <MKTypography
          component={Link}
          to={GALLERY_PATH}
          sx={{
            color: "#2e7d32",
            fontWeight: 600,
            fontSize: { xs: "0.88rem", sm: "0.92rem" },
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            "&:hover": { color: "#1e6b2c" },
          }}
        >
          {conversion?.seeGalleryCta || "See moments from our work in the Gallery"}
        </MKTypography>
      </MKBox>

      {/* Give by UPI — same white-card language as impact / bank on this page. */}
      <MKBox
        sx={{
          position: "relative",
          mx: { xs: 1, sm: 2 },
          mt: { xs: 2, sm: 2.5 },
          mb: { xs: 2, sm: 2.5 },
          px: { xs: 1.75, sm: 2.5, md: 3 },
          py: { xs: 2.5, sm: 3, md: 3.5 },
          borderRadius: { xs: "16px", md: "18px" },
          overflow: "hidden",
          background: "linear-gradient(165deg, #fff9ef 0%, #faf6ee 42%, #f5f1e8 100%)",
          border: "1px solid rgba(236, 165, 51, 0.22)",
          boxShadow: "0 10px 28px rgba(31, 42, 68, 0.05)",
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: "#ECA533",
            opacity: 0.85,
          },
          "@keyframes upiFadeUp": {
            from: { opacity: 0, transform: "translateY(14px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
          "@keyframes upiSoftIn": {
            from: { opacity: 0, transform: "scale(0.98)" },
            to: { opacity: 1, transform: "scale(1)" },
          },
        }}
      >
        <MKBox
          sx={{
            mx: "auto",
            mb: { xs: 2.5, sm: 3 },
            maxWidth: 920,
            px: { xs: 0.5, sm: 0 },
            textAlign: "center",
            position: "relative",
            animation: "upiFadeUp 0.7s ease both",
          }}
        >
          <MKTypography
            sx={{
              fontFamily:
                '"Pacifico", "Pacifico-fallback", "Flix", "Lato", "Lato-fallback", "Helvetica", "Arial", sans-serif',
              fontSize: { xs: "1.55rem", sm: "1.85rem", md: "2.05rem" },
              fontWeight: 500,
              color: "#1f2a44",
              lineHeight: 1.25,
            }}
          >
            {direct.title}
          </MKTypography>
          <MKTypography
            sx={{
              mt: { xs: 0.85, sm: 1 },
              maxWidth: { xs: 360, sm: 480, md: 520 },
              mx: "auto",
              fontSize: { xs: "0.9rem", sm: "0.98rem" },
              color: "rgba(31, 42, 68, 0.62)",
              lineHeight: 1.55,
              letterSpacing: "0.01em",
            }}
          >
            {direct.subtitle}
          </MKTypography>
        </MKBox>

        <Grid
          container
          spacing={{ xs: 2.5, sm: 3, md: 4 }}
          alignItems="center"
          justifyContent="center"
          sx={{
            mx: "auto",
            maxWidth: 920,
            animation: "upiSoftIn 0.85s ease 0.12s both",
          }}
        >
          <Grid item xs={12} md={5}>
            <MKBox
              sx={{
                mx: "auto",
                width: "fit-content",
                maxWidth: "100%",
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
                  width: { xs: "min(72vw, 240px)", sm: "250px", md: "260px" },
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "14px",
                  border: "1px solid rgba(31, 42, 68, 0.07)",
                  boxShadow: "0 10px 28px rgba(31, 42, 68, 0.06)",
                  backgroundColor: "#fff",
                }}
              />
            </MKBox>
          </Grid>

          {foodGuide?.items?.length || membershipGuide?.items?.length ? (
            <Grid item xs={12} md={7}>
              <MKBox sx={{ width: "100%", maxWidth: { xs: 420, md: "none" }, mx: "auto" }}>
                {foodGuide?.items?.length ? (
                  <MKBox sx={{ mb: membershipGuide?.items?.length ? { xs: 2.25, sm: 2.5 } : 0 }}>
                    <MKTypography
                      sx={{
                        mb: 1.1,
                        fontWeight: 700,
                        fontSize: { xs: "1rem", sm: "1.06rem" },
                        color: "#1f2a44",
                        textAlign: { xs: "center", md: "left" },
                      }}
                    >
                      {foodGuide.title}
                    </MKTypography>
                    <MKBox
                      component="ul"
                      sx={{
                        m: 0,
                        p: 0,
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.75,
                      }}
                    >
                      {foodGuide.items.map((item) => (
                        <MKBox
                          component="li"
                          key={`${item.label}-${item.amount}`}
                          sx={{
                            display: "flex",
                            alignItems: "baseline",
                            justifyContent: "space-between",
                            gap: 1.5,
                            py: 0.3,
                            borderBottom: "1px solid rgba(31, 42, 68, 0.06)",
                          }}
                        >
                          <MKTypography
                            sx={{
                              fontSize: { xs: "0.9rem", sm: "0.96rem" },
                              color: "rgba(31, 42, 68, 0.72)",
                              lineHeight: 1.4,
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            {item.label}
                          </MKTypography>
                          <MKTypography
                            sx={{
                              fontSize: { xs: "0.9rem", sm: "0.98rem" },
                              fontWeight: 700,
                              color: "#1f2a44",
                              whiteSpace: "nowrap",
                              flexShrink: 0,
                            }}
                          >
                            {item.amount}
                          </MKTypography>
                        </MKBox>
                      ))}
                    </MKBox>
                  </MKBox>
                ) : null}

                {membershipGuide?.items?.length ? (
                  <MKBox>
                    <MKTypography
                      sx={{
                        mb: 1.1,
                        fontWeight: 700,
                        fontSize: { xs: "1rem", sm: "1.06rem" },
                        color: "#1f2a44",
                        textAlign: { xs: "center", md: "left" },
                      }}
                    >
                      {membershipGuide.title}
                    </MKTypography>
                    <MKBox
                      component="ul"
                      sx={{
                        m: 0,
                        p: 0,
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.75,
                      }}
                    >
                      {membershipGuide.items.map((item) => (
                        <MKBox
                          component="li"
                          key={`${item.label}-${item.amount}`}
                          sx={{
                            display: "flex",
                            alignItems: "baseline",
                            justifyContent: "space-between",
                            gap: 1.5,
                            py: 0.3,
                            borderBottom: "1px solid rgba(31, 42, 68, 0.06)",
                          }}
                        >
                          <MKBox sx={{ flex: 1, minWidth: 0 }}>
                            <MKTypography
                              sx={{
                                fontSize: { xs: "0.9rem", sm: "0.96rem" },
                                color: "rgba(31, 42, 68, 0.72)",
                                lineHeight: 1.4,
                              }}
                            >
                              {item.label}
                            </MKTypography>
                            {item.detail ? (
                              <MKTypography
                                sx={{
                                  mt: 0.15,
                                  fontSize: "0.8rem",
                                  color: "rgba(31, 42, 68, 0.48)",
                                }}
                              >
                                {item.detail}
                              </MKTypography>
                            ) : null}
                          </MKBox>
                          <MKTypography
                            sx={{
                              fontSize: { xs: "0.9rem", sm: "0.98rem" },
                              fontWeight: 700,
                              color: "#1f2a44",
                              whiteSpace: "nowrap",
                              flexShrink: 0,
                            }}
                          >
                            {item.amount}
                          </MKTypography>
                        </MKBox>
                      ))}
                    </MKBox>
                  </MKBox>
                ) : null}
              </MKBox>
            </Grid>
          ) : null}
        </Grid>

        <MKTypography
          sx={{
            mt: { xs: 2.5, sm: 3 },
            mx: "auto",
            maxWidth: 400,
            textAlign: "center",
            fontSize: { xs: "0.82rem", sm: "0.88rem" },
            color: "rgba(31, 42, 68, 0.72)",
            lineHeight: 1.55,
            animation: "upiFadeUp 0.7s ease 0.2s both",
          }}
        >
          {direct.scanCard.receiptCtaLine1}{" "}
          <MKTypography
            component={Link}
            to={`${DONATION_RECEIPT_PATH}#bank`}
            sx={{
              color: "#1f2a44",
              fontWeight: 700,
              fontSize: "inherit",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              "&:hover": { color: "#ECA533" },
            }}
          >
            {direct.scanCard.receiptCtaLink}
          </MKTypography>{" "}
          {direct.scanCard.receiptCtaLine2}
        </MKTypography>

        <MKBox
          sx={{
            mt: { xs: 2.25, sm: 2.75 },
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 0.75, sm: 1.25 },
            animation: "upiFadeUp 0.7s ease 0.28s both",
          }}
        >
          <MKTypography
            component="button"
            type="button"
            onClick={() => {
              setSelectedAmount(1500);
              setCustomAmount("1500");
              scrollToDonateWidget();
            }}
            sx={{
              p: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#2e7d32",
              fontWeight: 700,
              fontSize: "0.8rem",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              "&:hover": { color: "#1e6b2c" },
            }}
          >
            {conversion?.mealFromUpiCta || "Sponsor a meal — ₹1,500"}
          </MKTypography>
          <MKBox
            component="span"
            sx={{
              display: { xs: "none", sm: "inline" },
              color: "rgba(31, 42, 68, 0.28)",
              fontSize: "0.75rem",
              userSelect: "none",
            }}
            aria-hidden
          >
            ·
          </MKBox>
          <MKTypography
            component="button"
            type="button"
            onClick={scrollToDonateWidget}
            sx={{
              p: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "rgba(31, 42, 68, 0.55)",
              fontWeight: 600,
              fontSize: "0.8rem",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              "&:hover": { color: "#1f2a44" },
            }}
          >
            {conversion?.useFormAboveCta || "Card or netbanking"}
          </MKTypography>
          <MKBox
            component="span"
            sx={{
              display: { xs: "none", sm: "inline" },
              color: "rgba(31, 42, 68, 0.28)",
              fontSize: "0.75rem",
              userSelect: "none",
            }}
            aria-hidden
          >
            ·
          </MKBox>
          <MKTypography
            component="a"
            href="#bank"
            onClick={openBank}
            sx={{
              color: "rgba(31, 42, 68, 0.55)",
              fontWeight: 600,
              fontSize: "0.8rem",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              "&:hover": { color: "#1f2a44" },
            }}
          >
            {conversion?.openBankCta || "Bank transfer"}
          </MKTypography>
        </MKBox>
      </MKBox>

      <MKBox
        id="bank"
        sx={{
          position: "relative",
          mx: { xs: 1, sm: 2 },
          mb: { xs: 1.5, sm: 2 },
          borderRadius: { xs: "16px", md: "18px" },
          border: "1px solid rgba(31, 42, 68, 0.07)",
          backgroundColor: "#ffffff",
          boxShadow: "0 10px 28px rgba(31, 42, 68, 0.06)",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: "#1f2a44",
            opacity: 0.35,
            zIndex: 1,
          },
        }}
      >
        <MKBox
          component="button"
          type="button"
          onClick={() => setBankOpen((open) => !open)}
          aria-expanded={bankOpen}
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            px: { xs: 1.75, sm: 2.25 },
            py: { xs: 1.5, sm: 1.65 },
            border: "none",
            background: "none",
            cursor: "pointer",
            textAlign: "left",
            color: "#1f2a44",
            "&:hover": {
              backgroundColor: "rgba(250, 248, 242, 0.65)",
            },
          }}
        >
          <MKBox>
            <MKTypography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                lineHeight: 1.3,
              }}
            >
              {donatePage.bankAccountDetails.title}
            </MKTypography>
            {donatePage.bankAccountDetails.subtitle ? (
              <MKTypography
                sx={{
                  mt: 0.35,
                  fontSize: { xs: "0.78rem", sm: "0.84rem" },
                  color: "rgba(31, 42, 68, 0.55)",
                }}
              >
                {donatePage.bankAccountDetails.subtitle}
              </MKTypography>
            ) : null}
          </MKBox>
          <ExpandMoreIcon
            sx={{
              color: "rgba(31, 42, 68, 0.55)",
              fontSize: { xs: 32, sm: 36 },
              transform: bankOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.2s ease",
              flexShrink: 0,
            }}
          />
        </MKBox>

        {bankOpen ? (
          <MKBox sx={{ px: { xs: 1.5, sm: 2 }, pb: { xs: 1.75, sm: 2 } }}>
            <Grid container spacing={{ xs: 1.5, md: 2 }} alignItems="stretch">
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
                <Grid item xs={12} sm={6} key={label}>
                  <MKBox
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      px: 1.5,
                      py: 1.25,
                      borderRadius: "12px",
                      backgroundColor: "rgba(250, 248, 242, 0.9)",
                      border: "1px solid rgba(31, 42, 68, 0.06)",
                    }}
                  >
                    <MKBox
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "999px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(236, 165, 51, 0.18)",
                        color: "rgba(31, 42, 68, 0.62)",
                        flex: "0 0 auto",
                      }}
                    >
                      <Icon sx={{ fontSize: 22 }} />
                    </MKBox>
                    <MKBox sx={{ minWidth: 0, flex: 1 }}>
                      <MKTypography
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "rgba(31, 42, 68, 0.55)",
                          mb: 0.35,
                        }}
                      >
                        {label}
                      </MKTypography>
                      <MKTypography
                        sx={{
                          fontSize: "0.84rem",
                          fontWeight: 600,
                          color: "#1f2a44",
                          whiteSpace: nowrap ? "nowrap" : "normal",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
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
                        size="medium"
                        iconOnly
                        sx={{
                          flex: "0 0 auto",
                          width: "36px !important",
                          minWidth: "36px !important",
                          height: "36px !important",
                          minHeight: "36px !important",
                          p: "6px !important",
                          borderRadius: "10px",
                          color: "rgba(31, 42, 68, 0.55)",
                          "& .MuiSvgIcon-root": {
                            fontSize: "20px !important",
                          },
                          "&:hover": {
                            color: "#1f2a44",
                            backgroundColor: "rgba(31, 42, 68, 0.06)",
                          },
                        }}
                      >
                        <ContentCopyIcon />
                      </MKButton>
                    </Tooltip>
                  </MKBox>
                </Grid>
              ))}
            </Grid>
          </MKBox>
        ) : null}
      </MKBox>

      <Grid container px={{ xs: 1, sm: 2, md: 2 }} spacing={{ xs: 2, lg: 3 }}>
        <Grid item xs={12}>
          <MKBox
            sx={{
              mx: { xs: 0, sm: 0 },
              mt: { xs: 2, sm: 2.5 },
              mb: { xs: 0.5, sm: 1 },
              px: { xs: 0, sm: 0 },
            }}
          >
            <DonateReceiptCta
              variant="cta"
              sx={{
                mx: { xs: 1, sm: 2 },
              }}
            />
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
              gap={{ xs: 1.25, sm: 1.75 }}
              mx="auto"
              mb={0.85}
            >
              <MKBox display="inline-flex" alignItems="center" gap={0.55}>
                <BadgeOutlinedIcon sx={{ fontSize: 16, color: "#a3690a" }} />
                <MKTypography
                  fontSize={{ xs: "0.78rem", sm: "0.84rem" }}
                  sx={{ color: "#a3690a", fontWeight: 700, lineHeight: 1.2 }}
                >
                  {donatePage.panLabel}: {donatePage.panValue}
                </MKTypography>
              </MKBox>

              <MKBox display="inline-flex" alignItems="center" gap={0.55}>
                <VerifiedUserOutlinedIcon sx={{ fontSize: 16, color: "#2e7d32" }} />
                <MKTypography
                  fontSize={{ xs: "0.78rem", sm: "0.84rem" }}
                  sx={{ color: "#2e7d32", fontWeight: 700, lineHeight: 1.2 }}
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
  );
}

DonateJoinOfflineSection.propTypes = {
  donatePage: PropTypes.object.isRequired,
  bankOpen: PropTypes.bool.isRequired,
  setBankOpen: PropTypes.func.isRequired,
  scrollToDonateWidget: PropTypes.func.isRequired,
  setSelectedAmount: PropTypes.func.isRequired,
  setCustomAmount: PropTypes.func.isRequired,
};

export default DonateJoinOfflineSection;
