
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
import { useAppearance } from "../../context/AppearanceContext";

const DEFAULT_SETTINGS = {
  theme: "Light",
  primaryColor: "Blue",
  layout: "Comfortable",
  fontSize: "Medium",
  language: "English",
};

export default function AppearanceSettings() {
  const {
    settings: savedSettings,
    saveAppearance,
    refreshAppearance,
    loaded,
  } = useAppearance();

  const [settings, setSettings] = useState(savedSettings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setSettings({
      ...DEFAULT_SETTINGS,
      ...savedSettings,
    });
  }, [savedSettings]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await saveAppearance(settings);

      setSuccess(
        result.message || "Appearance settings saved successfully."
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

  if (!loaded) {
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
                onChange={(event) => {
                  setSettings((previous) => ({
                    ...previous,
                    [field.name]: event.target.value,
                  }));
                  setError("");
                  setSuccess("");
                }}
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
