import { useState } from "react";

import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  Divider,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";

function AccountSettings() {
  const [account, setAccount] = useState({
    fullName: "Administrator",
    email: "admin@freshfold.com",
    phone: "0712345678",
    username: "admin",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (
      account.newPassword &&
      account.newPassword !== account.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    alert("Account settings saved successfully.");
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
        <PersonIcon
          color="primary"
          fontSize="large"
        />

        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Account Settings
        </Typography>
      </Stack>

      <Typography
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Update your personal account information and password.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={account.fullName}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={account.username}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={account.email}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={account.phone}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
      >
        Change Password
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            name="currentPassword"
            value={account.currentPassword}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="password"
            label="New Password"
            name="newPassword"
            value={account.newPassword}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            name="confirmPassword"
            value={account.confirmPassword}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Account Settings
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AccountSettings;