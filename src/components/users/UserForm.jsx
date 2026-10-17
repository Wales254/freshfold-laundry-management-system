
import { Grid, TextField, MenuItem, Typography } from "@mui/material";

function UserForm({ form, setForm, showPassword = true }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          required
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          required
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          helperText="Each employee must have a unique username."
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          required
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          fullWidth
          required
          label="Role"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="cashier">Cashier</MenuItem>
          <MenuItem value="attendant">Attendant</MenuItem>
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          fullWidth
          required
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Suspended">Suspended</MenuItem>
        </TextField>
      </Grid>

      {showPassword && (
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Temporary Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            helperText="Use at least 12 characters, including uppercase, lowercase, a number, and a special character."
          />
        </Grid>
      )}

      {showPassword && (
        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" color="text.secondary">
            Passwords must meet the security requirements. Never reuse a
            shared default password.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default UserForm;
