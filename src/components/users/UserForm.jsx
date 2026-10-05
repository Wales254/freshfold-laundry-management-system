import { Grid, TextField, MenuItem } from "@mui/material";

function UserForm({ form, setForm }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
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

      <Grid size={{ xs: 6 }}>
        <TextField
          select
          fullWidth
          label="Role"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Manager">Manager</MenuItem>
          <MenuItem value="Cashier">Cashier</MenuItem>
          <MenuItem value="Attendant">Attendant</MenuItem>
        </TextField>
      </Grid>

      <Grid size={{ xs: 6 }}>
        <TextField
          select
          fullWidth
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Suspended">Suspended</MenuItem>
        </TextField>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
}

export default UserForm;