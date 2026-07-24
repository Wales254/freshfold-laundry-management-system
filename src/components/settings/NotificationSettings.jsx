import { useState } from "react";

import {
  Paper,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  Button,
  Stack,
  Divider,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import SaveIcon from "@mui/icons-material/Save";

function NotificationSettings() {
  const [settings, setSettings] = useState({
    smsReady: true,
    smsPayment: false,
    smsReminder: true,

    emailReceipt: true,
    emailPromotion: false,

    lowStockAlert: true,
    dailySalesReport: false,
  });

  const handleChange = (event) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSave = () => {
    alert("Notification settings saved successfully.");
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
        <NotificationsIcon
          color="primary"
          fontSize="large"
        />

        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Notification Settings
        </Typography>
      </Stack>

      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{ mb: 2 }}
      >
        SMS Notifications
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.smsReady}
                onChange={handleChange}
                name="smsReady"
              />
            }
            label="Notify customer when order is ready"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.smsPayment}
                onChange={handleChange}
                name="smsPayment"
              />
            }
            label="Notify customer after payment"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.smsReminder}
                onChange={handleChange}
                name="smsReminder"
              />
            }
            label="Pickup reminder notifications"
          />
        </Grid>
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
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailReceipt}
                onChange={handleChange}
                name="emailReceipt"
              />
            }
            label="Email receipt after payment"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailPromotion}
                onChange={handleChange}
                name="emailPromotion"
              />
            }
            label="Send promotional emails"
          />
        </Grid>
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
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.lowStockAlert}
                onChange={handleChange}
                name="lowStockAlert"
              />
            }
            label="Low inventory alerts"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.dailySalesReport}
                onChange={handleChange}
                name="dailySalesReport"
              />
            }
            label="Daily sales summary"
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        sx={{ mt: 4 }}
        onClick={handleSave}
      >
        Save Notification Settings
      </Button>
    </Paper>
  );
}

export default NotificationSettings;