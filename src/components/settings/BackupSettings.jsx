
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
  MenuItem,
  TextField,
  Chip,
  CircularProgress,
} from "@mui/material";

import BackupIcon from "@mui/icons-material/Backup";
import RestoreIcon from "@mui/icons-material/Restore";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://freshfold-laundry-management-system.onrender.com"
).replace(/\/$/, "");

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

async function getErrorMessage(response) {
  try {
    const data = await response.json();
    return data.message || `Request failed (${response.status}).`;
  } catch {
    return `Request failed (${response.status}).`;
  }
}

function BackupSettings() {
  const [settings, setSettings] = useState({
    autoBackup: true,
    frequency: "Daily",
  });

  const [lastBackup, setLastBackup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [message, setMessage] = useState(null);

  const getHeaders = () => {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Your login session has expired. Please log in again.");
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/settings/backup`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = await response.json();
      const saved = data.settings;

      setSettings({
        autoBackup: saved.autoBackup,
        frequency: saved.frequency,
      });

      setLastBackup(saved.lastBackupAt || null);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Could not load backup settings.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSwitch = (event) => {
    setSettings((previous) => ({
      ...previous,
      autoBackup: event.target.checked,
    }));
  };

  const handleFrequencyChange = (event) => {
    setSettings((previous) => ({
      ...previous,
      frequency: event.target.value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/settings/backup`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = await response.json();

      setSettings({
        autoBackup: data.settings.autoBackup,
        frequency: data.settings.frequency,
      });

      setLastBackup(data.settings.lastBackupAt || null);

      setMessage({
        type: "success",
        text: data.message || "Backup preferences saved.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Could not save backup settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    setBackingUp(true);
    setMessage(null);

    let objectUrl;

    try {
      const response = await fetch(
        `${API_URL}/api/settings/backup/download`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("The server returned an empty backup file.");
      }

      objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `freshfold-backup-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.json`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setLastBackup(new Date().toISOString());

      setMessage({
        type: "success",
        text: "The database data export was generated and downloaded.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Could not generate the backup export.",
      });
    } finally {
      if (objectUrl) {
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      }

      setBackingUp(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "No successful export recorded";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? "Date unavailable"
      : date.toLocaleString();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 4 },
        borderRadius: 3,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <BackupIcon color="primary" fontSize="large" />

        <Typography variant="h5" fontWeight="bold">
          Backup & Restore
        </Typography>
      </Stack>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Manage backup preferences and download a data export of your FreshFold
        database.
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
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
          <Typography>Loading backup settings...</Typography>
        </Stack>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoBackup}
                    onChange={handleSwitch}
                    disabled={saving}
                  />
                }
                label="Enable Automatic Backups"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                select
                fullWidth
                label="Backup Frequency"
                value={settings.frequency}
                onChange={handleFrequencyChange}
                disabled={saving}
              >
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={1} justifyContent="center" sx={{ height: "100%" }}>
                <Typography fontWeight="bold">
                  Last Successful Export
                </Typography>

                <Chip
                  variant="outlined"
                  color={lastBackup ? "success" : "default"}
                  label={formatDate(lastBackup)}
                  sx={{ alignSelf: "flex-start", maxWidth: "100%" }}
                />
              </Stack>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            Automatic scheduling is not active yet. These settings save your
            preferences only. The download is a JSON data export, not a full
            PostgreSQL schema backup.
          </Alert>

          <Divider sx={{ my: 4 }} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              startIcon={
                backingUp ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <BackupIcon />
                )
              }
              onClick={handleBackup}
              disabled={backingUp || saving}
            >
              {backingUp ? "Creating Export..." : "Backup Now"}
            </Button>

            <Button
              variant="outlined"
              color="success"
              startIcon={<DownloadIcon />}
              onClick={handleBackup}
              disabled={backingUp || saving}
            >
              Download Backup
            </Button>

            <Button
              variant="outlined"
              color="warning"
              startIcon={<RestoreIcon />}
              disabled
            >
              Restore Backup (Unavailable)
            </Button>
          </Stack>

          <Button
            variant="contained"
            sx={{ mt: 4 }}
            startIcon={
              saving ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            onClick={handleSave}
            disabled={saving || backingUp}
          >
            {saving ? "Saving..." : "Save Backup Settings"}
          </Button>
        </>
      )}
    </Paper>
  );
}

export default BackupSettings;
