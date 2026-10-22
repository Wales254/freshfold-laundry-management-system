
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const EMPTY_ACCOUNT = {
  name: "",
  username: "",
  email: "",
  phone: "",
};

function getToken() {
  try {
    const saved = sessionStorage.getItem("auth");

    if (saved) {
      const parsed = JSON.parse(saved);

      if (typeof parsed?.token === "string" && parsed.token.trim()) {
        return parsed.token;
      }
    }
  } catch (error) {
    console.error("Unable to read login session:", error);
  }

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    null
  );
}

function AccountSettings() {
  const [account, setAccount] = useState(EMPTY_ACCOUNT);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAccount() {
      try {
        const token = getToken();

        if (!token) {
          throw new Error("Your login session was not found. Please log in again.");
        }

        const response = await fetch(`${API_URL}/api/account`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load your account details."
          );
        }

        setAccount({
          ...EMPTY_ACCOUNT,
          ...data.account,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          setMessage({
            type: "error",
            text: error.message || "Unable to load account settings.",
          });
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAccount();

    return () => controller.abort();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAccount((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setMessage(null);

    if (!account.name.trim()) {
      setMessage({ type: "error", text: "Full name is required." });
      return;
    }

    if (newPassword || currentPassword || confirmPassword) {
      if (!currentPassword) {
        setMessage({
          type: "error",
          text: "Enter your current password to change your password.",
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        setMessage({
          type: "error",
          text: "New password and confirmation do not match.",
        });
        return;
      }

      if (
        newPassword.length < 12 ||
        !/[a-z]/.test(newPassword) ||
        !/[A-Z]/.test(newPassword) ||
        !/[0-9]/.test(newPassword) ||
        !/[^A-Za-z0-9]/.test(newPassword)
      ) {
        setMessage({
          type: "error",
          text:
            "New password must have at least 12 characters, including uppercase, lowercase, a number, and a symbol.",
        });
        return;
      }
    }

    setSaving(true);

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Your login session was not found. Please log in again.");
      }

      const payload = { ...account };

      if (newPassword || currentPassword || confirmPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const response = await fetch(`${API_URL}/api/account`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save account settings.");
      }

      setAccount({
        ...EMPTY_ACCOUNT,
        ...data.account,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Keep the cached user's profile in step with the saved profile.
      try {
        const saved = sessionStorage.getItem("auth");

        if (saved) {
          const parsed = JSON.parse(saved);

          if (parsed?.user) {
            localStorage.setItem(
              "auth",
              JSON.stringify({
                ...parsed,
                user: {
                  ...parsed.user,
                  name: data.account.name,
                  username: data.account.username,
                  email: data.account.email,
                  phone: data.account.phone,
                  role: data.account.role,
                },
              })
            );
          }
        }
      } catch (error) {
        console.error("Unable to update cached profile:", error);
      }

      setMessage({
        type: "success",
        text: data.message || "Account settings saved successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Unable to save account settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={24} />
          <Typography>Loading account settings...</Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <PersonIcon color="primary" fontSize="large" />
        <Typography variant="h5" fontWeight="bold">
          Account Settings
        </Typography>
      </Stack>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Update your personal account information and password.
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            label="Full Name"
            name="name"
            value={account.name}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            label="Username"
            name="username"
            value={account.username}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            type="email"
            label="Email Address"
            name="email"
            value={account.email}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={account.phone}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Change Password
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Leave all three password fields blank if you do not want to change
        your password.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            type="password"
            autoComplete="current-password"
            label="Current Password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="password"
            autoComplete="new-password"
            label="New Password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="password"
            autoComplete="new-password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={
              saving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Account Settings"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AccountSettings;
