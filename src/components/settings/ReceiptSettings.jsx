import { useState } from "react";

import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
  Stack,
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SaveIcon from "@mui/icons-material/Save";

function ReceiptSettings() {
  const [settings, setSettings] = useState({
    prefix: "RC-",
    currency: "KES",
    footer:
      "Thank you for choosing FreshFold Laundry. We appreciate your business.",
    showLogo: true,
    autoPrint: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSwitch = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSave = () => {
    alert("Receipt settings saved successfully.");
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
        <ReceiptLongIcon
          color="primary"
          fontSize="large"
        />

        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Receipt Settings
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Receipt Prefix"
            name="prefix"
            value={settings.prefix}
            onChange={handleChange}
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
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Receipt Settings
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ReceiptSettings;