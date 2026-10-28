import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { readAdminSession, verifyAdminLogin, writeAdminSession } from "utils/adminReceiptAuth";

/**
 * Soft-launch gate: same credentials as /admin/receipt.
 * @param {boolean} persistSession — when false (Donate2), login is required on every visit.
 */
export default function AdminAccessGate({ children, title, subtitle, persistSession = false }) {
  const { t } = useTranslation();
  const [unlocked, setUnlocked] = useState(false);
  const [checkingSession, setCheckingSession] = useState(persistSession);
  const [adminUsername, setAdminUsername] = useState("");
  const [secretInput, setSecretInput] = useState("");
  const [isSecretVisible, setIsSecretVisible] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!persistSession) {
      setCheckingSession(false);
      return;
    }
    const session = readAdminSession();
    setUnlocked(Boolean(session?.secret));
    setCheckingSession(false);
  }, [persistSession]);

  const handleUnlock = async (event) => {
    event.preventDefault();
    const username = adminUsername.trim();
    const trimmed = secretInput.trim();
    if (!username) {
      setError(t("adminPortal.enterUsername"));
      return;
    }
    if (!trimmed) {
      setError(t("adminPortal.enterPassword"));
      return;
    }
    setError("");

    try {
      setAuthBusy(true);
      await verifyAdminLogin({ username, secret: trimmed });
      if (persistSession) {
        writeAdminSession({ username, secret: trimmed });
      }
      setUnlocked(true);
      setSecretInput("");
    } catch {
      setError(t("adminPortal.invalidLogin"));
    } finally {
      setAuthBusy(false);
    }
  };

  if (checkingSession) {
    return (
      <MKBox
        minHeight="70vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ bgcolor: "rgba(250, 248, 242, 0.9)" }}
      >
        <CircularProgress color="success" size={36} />
      </MKBox>
    );
  }

  if (unlocked) {
    return children;
  }

  return (
    <MKBox
      minHeight="100vh"
      sx={{
        bgcolor: "rgba(250, 248, 242, 0.95)",
        display: "flex",
        alignItems: "center",
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            p: { xs: 2.5, sm: 3.25 },
            borderRadius: "18px",
            border: "1px solid rgba(31, 42, 68, 0.08)",
            boxShadow: "0 16px 40px rgba(31, 42, 68, 0.08)",
          }}
        >
          <Box component="form" onSubmit={handleUnlock}>
            <Stack spacing={2}>
              <Box textAlign="center">
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.35rem", sm: "1.5rem" },
                    color: "#1f2a44",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {title || t("adminPortal.login")}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.75,
                    fontSize: "0.9rem",
                    color: "rgba(31, 42, 68, 0.62)",
                    lineHeight: 1.5,
                  }}
                >
                  {subtitle || t("adminPortal.authorizedOnly")}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{ fontWeight: 800, fontSize: "0.9rem", color: "#1f2a44", mb: 0.75 }}
                >
                  {t("adminPortal.adminUsername") || t("adminPortal.username")}
                </Typography>
                <TextField
                  label=""
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  fullWidth
                  disabled={authBusy}
                  autoComplete="username"
                  placeholder={t("adminPortal.usernameEnter")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineOutlinedIcon
                          sx={{ fontSize: 20, color: "rgba(31,42,68,0.45)" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{ fontWeight: 800, fontSize: "0.9rem", color: "#1f2a44", mb: 0.75 }}
                >
                  {t("adminPortal.adminPassword") || t("adminPortal.password")}
                </Typography>
                <TextField
                  label=""
                  type={isSecretVisible ? "text" : "password"}
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  fullWidth
                  disabled={authBusy}
                  autoComplete="current-password"
                  placeholder={t("adminPortal.passwordEnter")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ fontSize: 20, color: "rgba(31,42,68,0.45)" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            isSecretVisible
                              ? t("adminPortal.hidePassword")
                              : t("adminPortal.showPassword")
                          }
                          edge="end"
                          onClick={() => setIsSecretVisible((v) => !v)}
                          tabIndex={-1}
                        >
                          {isSecretVisible ? (
                            <VisibilityOffOutlinedIcon fontSize="small" />
                          ) : (
                            <VisibilityOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </Box>

              {error ? (
                <Alert severity="error" sx={{ textAlign: "left" }}>
                  {error}
                </Alert>
              ) : null}

              <MKButton
                type="submit"
                variant="contained"
                color="success"
                disabled={authBusy}
                sx={{
                  fontWeight: 800,
                  textTransform: "none",
                  borderRadius: "14px",
                  px: 3,
                  py: 1.25,
                  background:
                    "linear-gradient(90deg, rgba(24, 124, 54, 1) 0%, rgba(34, 163, 75, 1) 100%)",
                  boxShadow: "0 14px 28px rgba(46, 125, 50, 0.28)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, rgba(20, 106, 46, 1) 0%, rgba(30, 142, 65, 1) 100%)",
                  },
                }}
                startIcon={
                  authBusy ? (
                    <CircularProgress size={18} color="inherit" thickness={5} />
                  ) : (
                    <LockOutlinedIcon sx={{ fontSize: 18 }} />
                  )
                }
              >
                {authBusy ? t("adminPortal.checking") : t("adminPortal.login")}
              </MKButton>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
                sx={{
                  pt: 1,
                  borderTop: "1px solid rgba(31, 42, 68, 0.08)",
                }}
              >
                <VerifiedOutlinedIcon sx={{ fontSize: 18, color: "rgba(46, 125, 50, 0.8)" }} />
                <Typography sx={{ fontSize: "0.84rem", color: "rgba(31,42,68,0.6)" }}>
                  {t("adminPortal.authorizedOnly")}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Card>
      </Container>
    </MKBox>
  );
}

AdminAccessGate.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  persistSession: PropTypes.bool,
};
