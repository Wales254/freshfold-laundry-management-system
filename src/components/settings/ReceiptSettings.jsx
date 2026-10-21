import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SaveIcon from "@mui/icons-material/Save";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://freshfold-laundry-management-system.onrender.com"
).replace(/\/$/, "");

const DEFAULT_SETTINGS = {
  prefix: "RC-",
  currency: "KES",
  footer:
    "Thank you for choosing FreshFold Laundry! We appreciate your trust in us and look forward to serving you again.",
  showLogo: true,
  autoPrint: false,
};

// Read the token using the existing Redux authentication storage.
function getAuthToken() {
  try {
    const savedAuth = localStorage.getItem("auth");

    if (!savedAuth) {
      return null;
    }

    const parsedAuth = JSON.parse(savedAuth);
    return parsedAuth?.token || null;
  } catch (error) {
    console.error("Unable to read authentication information:", error);
    return null;
  }
}

export default function ReceiptSettings() {
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load receipt settings from the backend.
  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      setLoading(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        if (!cancelled) {
          setError("Please log in again to load receipt settings.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/settings/receipt`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load receipt settings."
          );
        }

        if (!cancelled) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...(data.settings || {}),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load receipt settings."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  // Update a form field.
  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  }

  // Save receipt settings to the backend.
  async function handleSave(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const token = getAuthToken();

    if (!token) {
      setError("Please log in again to save receipt settings.");
      return;
    }

    const prefix = settings.prefix.trim();
    const footer = settings.footer.trim();

    if (!prefix) {
      setError("Please enter a receipt number prefix.");
      return;
    }

    if (prefix.length > 20) {
      setError("The receipt prefix cannot exceed 20 characters.");
      return;
    }

    if (!["KES", "USD", "EUR", "GBP"].includes(settings.currency)) {
      setError("Please select a valid currency.");
      return;
    }

    if (footer.length > 1000) {
      setError("The receipt footer cannot exceed 1000 characters.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/api/settings/receipt`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prefix,
            currency: settings.currency,
            footer,
            showLogo: Boolean(settings.showLogo),
            autoPrint: Boolean(settings.autoPrint),
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save receipt settings."
        );
      }

      setSettings({
        ...DEFAULT_SETTINGS,
        ...(data.settings || {
          ...settings,
          prefix,
          footer,
        }),
      });

      setSuccess(
        data.message || "Receipt settings saved successfully."
      );
    } catch (err) {
      setError(
        err.message || "Unable to save receipt settings."
      );
    } finally {
      setSaving(false);
    }
  }

  // Loading screen.
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          minHeight: 250,
        }}
      >
        <CircularProgress size={28} />
        <Typography>Loading receipt settings...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1000,
        mx: "auto",
        p: { xs: 1, sm: 2, md: 3 },
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
        }}
      >
        {/* Page heading */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
          }}
        >
          <ReceiptLongIcon
            color="primary"
            sx={{ fontSize: 36, flexShrink: 0 }}
          />

          <Box>
            <Typography variant="h5" fontWeight={700}>
              Receipt Settings
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Manage receipt numbering, currency, footer, and printing preferences.
            </Typography>
          </Box>
        </Box>

        {/* Error message */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* Success message */}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        {/* Settings form */}
        <Box component="form" onSubmit={handleSave}>
          <Grid container spacing={3}>
            {/* Receipt prefix */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Receipt Number Prefix"
                name="prefix"
                value={settings.prefix}
                onChange={handleChange}
                inputProps={{ maxLength: 20 }}
                helperText="Example: RC-00001"
              />
            </Grid>

            {/* Currency */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                label="Receipt Currency"
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                helperText="Currency displayed on receipts"
              >
                <MenuItem value="KES">
                  KES - Kenyan Shilling
                </MenuItem>

                <MenuItem value="USD">
                  USD - US Dollar
                </MenuItem>

                <MenuItem value="EUR">
                  EUR - Euro
                </MenuItem>

                <MenuItem value="GBP">
                  GBP - British Pound
                </MenuItem>
              </TextField>
            </Grid>

            {/* Footer message */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Receipt Footer Message"
                name="footer"
                value={settings.footer}
                onChange={handleChange}
                inputProps={{ maxLength: 1000 }}
                helperText={`${settings.footer.length}/1000 characters`}
              />
            </Grid>

            {/* Display and printing options */}
            <Grid item xs={12}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                >
                  Receipt Display Options
                </Typography>

                <FormControlLabel
                  sx={{
                    display: "flex",
                    mb: 1,
                  }}
                  control={
                    <Switch
                      name="showLogo"
                      checked={Boolean(settings.showLogo)}
                      onChange={handleChange}
                    />
                  }
                  label="Show business logo on receipts"
                />

                <FormControlLabel
                  sx={{ display: "flex" }}
                  control={
                    <Switch
                      name="autoPrint"
                      checked={Boolean(settings.autoPrint)}
                      onChange={handleChange}
                    />
                  }
                  label="Enable automatic printing"
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  These preferences are stored in the database.
                  The receipt-generation component must also read
                  these settings for them to affect printed receipts.
                </Typography>
              </Paper>
            </Grid>

            {/* Save button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={
                  saving ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                    />
                  ) : (
                    <SaveIcon />
                  )
                }
                sx={{
                  minWidth: 160,
                  py: 1.2,
                }}
              >
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}