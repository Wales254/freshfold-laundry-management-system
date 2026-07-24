import { useState } from "react";

import {
  Paper,
  Typography,
  Grid,
  Button,
  Stack,
  FormControlLabel,
  Switch,
  MenuItem,
  TextField,
  Divider,
  Chip,
} from "@mui/material";

import BackupIcon from "@mui/icons-material/Backup";
import RestoreIcon from "@mui/icons-material/Restore";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";

function BackupSettings() {
  const [settings, setSettings] = useState({
    autoBackup: true,
    frequency: "Daily",
  });

  const lastBackup = "24 Jul 2026 09:30 AM";

  const handleSwitch = (event) => {
    setSettings({
      ...settings,
      autoBackup: event.target.checked,
    });
  };

  const handleChange = (event) => {
    setSettings({
      ...settings,
      frequency: event.target.value,
    });
  };

  const handleSave = () => {
    alert("Backup settings saved successfully.");
  };

  const handleBackup = () => {
    alert("Database backup created successfully.");
  };

  const handleRestore = () => {
    alert("Restore functionality will be connected to the backend.");
  };

  const handleDownload = () => {
    alert("Downloading latest backup...");
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
        <BackupIcon
          color="primary"
          fontSize="large"
        />

        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Backup & Restore
        </Typography>
      </Stack>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Manage automatic backups and restore your business data when needed.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoBackup}
                onChange={handleSwitch}
              />
            }
            label="Enable Automatic Backups"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            label="Backup Frequency"
            value={settings.frequency}
            onChange={handleChange}
          >
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ height: "100%" }}
          >
            <Typography fontWeight="bold">
              Last Backup:
            </Typography>

            <Chip
              color="success"
              label={lastBackup}
            />
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Stack
        direction="row"
        spacing={2}
        flexWrap="wrap"
      >
        <Button
          variant="contained"
          startIcon={<BackupIcon />}
          onClick={handleBackup}
        >
          Backup Now
        </Button>

        <Button
          variant="outlined"
          color="warning"
          startIcon={<RestoreIcon />}
          onClick={handleRestore}
        >
          Restore Backup
        </Button>

        <Button
          variant="outlined"
          color="success"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
        >
          Download Backup
        </Button>
      </Stack>

      <Button
        variant="contained"
        sx={{ mt: 4 }}
        startIcon={<SaveIcon />}
        onClick={handleSave}
      >
        Save Backup Settings
      </Button>
    </Paper>
  );
}

export default BackupSettings;