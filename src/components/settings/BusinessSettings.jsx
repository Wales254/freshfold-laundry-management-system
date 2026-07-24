import { useState } from "react";

import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Stack,
} from "@mui/material";

import BusinessIcon from "@mui/icons-material/Business";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function BusinessSettings() {
  const [business, setBusiness] = useState({
    name: "FreshFold Laundry",
    phone: "0712345678",
    email: "info@freshfold.co.ke",
    website: "www.freshfold.co.ke",
    address: "Nairobi, Kenya",
  });

  const handleChange = (e) => {
    setBusiness({
      ...business,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    alert("Business information saved successfully.");
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
        <BusinessIcon color="primary" fontSize="large" />

        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Business Information
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Business Name"
            name="name"
            value={business.name}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={business.phone}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={business.email}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={business.website}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Business Address"
            name="address"
            value={business.address}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
              }}
            >
              <BusinessIcon fontSize="large" />
            </Avatar>

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload Logo

              <input
                hidden
                type="file"
                accept="image/*"
              />
            </Button>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default BusinessSettings;