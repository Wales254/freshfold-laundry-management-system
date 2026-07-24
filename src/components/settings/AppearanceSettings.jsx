import { useState } from "react";

import {
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";

import PaletteIcon from "@mui/icons-material/Palette";
import SaveIcon from "@mui/icons-material/Save";

function AppearanceSettings() {
  const [settings, setSettings] = useState({
    theme: "Light",
    primaryColor: "Blue",
    layout: "Comfortable",
    fontSize: "Medium",
    language: "English",
  });

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    alert("Appearance settings saved successfully.");
  };

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
        <PaletteIcon
          color="primary"
          fontSize="large"
        />

        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Appearance Settings
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Theme</InputLabel>

            <Select
              name="theme"
              value={settings.theme}
              label="Theme"
              onChange={handleChange}
            >
              <MenuItem value="Light">
                Light
              </MenuItem>

              <MenuItem value="Dark">
                Dark
              </MenuItem>

              <MenuItem value="System">
                System Default
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Primary Color</InputLabel>

            <Select
              name="primaryColor"
              value={settings.primaryColor}
              label="Primary Color"
              onChange={handleChange}
            >
              <MenuItem value="Blue">Blue</MenuItem>
              <MenuItem value="Green">Green</MenuItem>
              <MenuItem value="Purple">Purple</MenuItem>
              <MenuItem value="Orange">Orange</MenuItem>
              <MenuItem value="Red">Red</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Layout</InputLabel>

            <Select
              name="layout"
              value={settings.layout}
              label="Layout"
              onChange={handleChange}
            >
              <MenuItem value="Comfortable">
                Comfortable
              </MenuItem>

              <MenuItem value="Compact">
                Compact
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Font Size</InputLabel>

            <Select
              name="fontSize"
              value={settings.fontSize}
              label="Font Size"
              onChange={handleChange}
            >
              <MenuItem value="Small">
                Small
              </MenuItem>

              <MenuItem value="Medium">
                Medium
              </MenuItem>

              <MenuItem value="Large">
                Large
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>

            <Select
              name="language"
              value={settings.language}
              label="Language"
              onChange={handleChange}
            >
              <MenuItem value="English">
                English
              </MenuItem>

              <MenuItem value="Swahili">
                Swahili
              </MenuItem>

              <MenuItem value="French">
                French
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Appearance Settings
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AppearanceSettings;