
import { useEffect, useState } from "react";
import {
  Alert,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
  Stack,
  CircularProgress,
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

function ReceiptSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in again to load receipt settings.");
        }

        const response = await fetch(
          `${API_URL}/api/settings/receipt`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load receipt settings."
          );
        }

        if (active) {
          setSettings({
            prefix: data.settings.prefix,
            currency: data.settings.currency,
            footer: data.settings.footer,
            showLogo: data.settings.showLogo,
            autoPrint: data.settings.autoPrint,
          });
        }
      } catch (err) {
        if (active) {
          setError(true);
          setMessage(err.message || "Unable to load receipt settings.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSwitch = (event) => {
    const { name, checked } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: checked,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError(false);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again to save receipt settings.");
      }

      const response = await fetch(
        `${API_URL}/api/settings/receipt`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save receipt settings."
        );
      }

      setSettings({
        prefix: data.settings.prefix,
        currency: data.settings.currency,
        footer: data.settings.footer,
        showLogo: data.settings.showLogo,
        autoPrint: data.settings.autoPrint,
      });

      setMessage("Receipt settings saved successfully.");
    } catch (err) {
      setError(true);
      setMessage(err.message || "Unable to save receipt settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={24} />
          <Typography>Loading receipt settings...</Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <ReceiptLongIcon color="primary" fontSize="large" />

        <Typography variant="h5" fontWeight="bold">
          Receipt Settings
        </Typography>
      </Stack>

      {message && (
        <Alert severity={error ? "error" : "success"} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Receipt Prefix"
            name="prefix"
            value={settings.prefix}
            onChange={handleChange}
            inputProps={{ maxLength: 20 }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            fullWidth
            label="Currency"
            name="currency"
            value={settings.currency}
            onChange={handleChange}
          >
            <MenuItem value="KES">KES</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="GBP">GBP</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Receipt Footer"
            name="footer"
            value={settings.footer}
            onChange={handleChange}
            inputProps={{ maxLength: 1000 }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.showLogo}
                onChange={handleSwitch}
                name="showLogo"
              />
            }
            label="Show Business Logo on Receipt"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoPrint}
                onChange={handleSwitch}
                name="autoPrint"
              />
            }
            label="Automatically Print Receipt After Payment"
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
            {saving ? "Saving..." : "Save Receipt Settings"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ReceiptSettings;
