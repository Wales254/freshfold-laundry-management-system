
import { useCallback, useEffect, useState } from "react";

import {
  Alert,
  Paper,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  Button,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import SaveIcon from "@mui/icons-material/Save";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://freshfold-laundry-management-system.onrender.com"
).replace(/\/$/, "");

const DEFAULT_SETTINGS = {
  smsReady: true,
  smsPayment: false,
  smsReminder: true,
  emailReceipt: true,
  emailPromotion: false,
  lowStockAlert: true,
  dailySalesReport: false,
};

function getAuthToken() {
  const storedAuth = localStorage.getItem("auth");

  if (!storedAuth) return null;

  try {
    const parsedAuth = JSON.parse(storedAuth);
    return parsedAuth.token || null;
  } catch {
    return storedAuth;
  }
}

function NotificationSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");

    const token = getAuthToken();

    if (!token) {
      setError("Your session has expired. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/settings/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load notification settings."
        );
      }

      const loadedSettings = data.settings || data;

      setSettings({
        smsReady: loadedSettings.smsReady,
        smsPayment: loadedSettings.smsPayment,
        smsReminder: loadedSettings.smsReminder,
        emailReceipt: loadedSettings.emailReceipt,
        emailPromotion: loadedSettings.emailPromotion,
        lowStockAlert: loadedSettings.lowStockAlert,
        dailySalesReport: loadedSettings.dailySalesReport,
      });
    } catch (err) {
      setError(err.message || "Unable to load notification settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleChange = (event) => {
    const { name, checked } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: checked,
    }));

    setMessage("");
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    const token = getAuthToken();

    if (!token) {
      setError("Your session has expired. Please log in again.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/settings/notifications`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save notification settings."
        );
      }

      if (data.settings) {
        setSettings(data.settings);
      }

      setMessage(
        data.message || "Notification settings saved successfully."
      );
    } catch (err) {
      setError(err.message || "Unable to save notification settings.");
    } finally {
      setSaving(false);
    }
  };

  const renderSwitch = (name, label) => (
    <Grid size={{ xs: 12 }}>
      <FormControlLabel
        control={
          <Switch
            checked={Boolean(settings[name])}
            onChange={handleChange}
            name={name}
            disabled={loading || saving}
          />
        }
        label={label}
      />
    </Grid>
  );

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <NotificationsIcon color="primary" fontSize="large" />

        <Typography variant="h5" fontWeight="bold">
          Notification Settings
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {loading ? (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ py: 5 }}
        >
          <CircularProgress size={25} />
          <Typography>Loading notification settings...</Typography>
        </Stack>
      ) : (
        <>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            SMS Notifications
          </Typography>

          <Grid container spacing={2}>
            {renderSwitch(
              "smsReady",
              "Notify customer when order is ready"
            )}
            {renderSwitch(
              "smsPayment",
              "Notify customer after payment"
            )}
            {renderSwitch(
              "smsReminder",
              "Pickup reminder notifications"
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Email Notifications
          </Typography>

          <Grid container spacing={2}>
            {renderSwitch(
              "emailReceipt",
              "Email receipt after payment"
            )}
            {renderSwitch(
              "emailPromotion",
              "Send promotional emails"
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            System Notifications
          </Typography>

          <Grid container spacing={2}>
            {renderSwitch(
              "lowStockAlert",
              "Low inventory alerts"
            )}
            {renderSwitch(
              "dailySalesReport",
              "Daily sales summary"
            )}
          </Grid>

          <Button
            variant="contained"
            startIcon={
              saving ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            sx={{ mt: 4 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Notification Settings"}
          </Button>
        </>
      )}
    </Paper>
  );
}

export default NotificationSettings;
