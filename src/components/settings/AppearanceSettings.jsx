
import { useEffect, useState } from "react";
import {
  Alert,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Stack,
  CircularProgress,
} from "@mui/material";

import PaletteIcon from "@mui/icons-material/Palette";
import SaveIcon from "@mui/icons-material/Save";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://freshfold-laundry-management-system.onrender.com"
).replace(/\/$/, "");

const DEFAULT_SETTINGS = {
  theme: "Light",
  primaryColor: "Blue",
  layout: "Comfortable",
  fontSize: "Medium",
  language: "English",
};

function getAuthToken() {
  try {
    const savedAuth = localStorage.getItem("auth");

    if (!savedAuth) return null;

    const parsedAuth = JSON.parse(savedAuth);
    return parsedAuth?.token || null;
  } catch (error) {
    console.error("Unable to read authentication information:", error);
    return null;
  }
}

export default function AppearanceSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      setLoading(true);
      setError("");

      try {
        const token = getAuthToken();

        if (!token) {
          throw new Error("Your session has expired. Please log in again.");
        }

        const response = await fetch(
          `${API_URL}/api/settings/appearance`,
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
            data.message || "Failed to load appearance settings."
          );
        }

        if (active && data.settings) {
          setSettings({
            theme: data.settings.theme || DEFAULT_SETTINGS.theme,
            primaryColor:
              data.settings.primaryColor || DEFAULT_SETTINGS.primaryColor,
            layout: data.settings.layout || DEFAULT_SETTINGS.layout,
            fontSize: data.settings.fontSize || DEFAULT_SETTINGS.fontSize,
            language: data.settings.language || DEFAULT_SETTINGS.language,
          });
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load appearance settings.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await fetch(
        `${API_URL}/api/settings/appearance`,
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
          data.message || "Failed to save appearance settings."
        );
      }

      if (data.settings) {
        setSettings({
          theme: data.settings.theme || settings.theme,
          primaryColor:
            data.settings.primaryColor || settings.primaryColor,
          layout: data.settings.layout || settings.layout,
          fontSize: data.settings.fontSize || settings.fontSize,
          language: data.settings.language || settings.language,
        });
      }

      setSuccess(
        data.message || "Appearance settings saved successfully."
      );
    } catch (err) {
      setError(err.message || "Unable to save appearance settings.");
    } finally {
      setSaving(false);
    }
  }

  const fields = [
    {
      name: "theme",
      label: "Theme",
      options: ["Light", "Dark", "System"],
    },
    {
      name: "primaryColor",
      label: "Primary Color",
      options: ["Blue", "Green", "Purple", "Orange", "Red"],
    },
    {
      name: "layout",
      label: "Layout",
      options: ["Comfortable", "Compact"],
    },
    {
      name: "fontSize",
      label: "Font Size",
      options: ["Small", "Medium", "Large"],
    },
    {
      name: "language",
      label: "Language",
      options: ["English", "Swahili", "French"],
    },
  ];

  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress size={24} />
          <Typography>Loading appearance settings...</Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <PaletteIcon color="primary" fontSize="large" />

          <div>
            <Typography variant="h5" fontWeight={700}>
              Appearance Settings
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Customize how your FreshFold dashboard looks.
            </Typography>
          </div>
        </Stack>

        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <TextField
                select
                fullWidth
                name={field.name}
                label={field.label}
                value={settings[field.name]}
                onChange={handleChange}
                disabled={saving}
              >
                {field.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}
        </Grid>

        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={
              saving ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Appearance Settings"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}