import { Grid, TextField, MenuItem } from "@mui/material";

const categories = [
  "Laundry",
  "Dry Cleaning",
  "Bedding",
  "Curtains",
  "Carpets",
  "Footwear",
  "Household",
  "Others",
];

const units = [
  "Per Item",
  "Per Kg",
  "Each",
  "Pair",
  "Square Meter",
];

function ServiceForm({ form, setForm }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "price" ? Number(value) : value,
    });
  };

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Service Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          select
          fullWidth
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <MenuItem
              key={category}
              value={category}
            >
              {category}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          select
          fullWidth
          label="Unit"
          name="unit"
          value={form.unit}
          onChange={handleChange}
        >
          {units.map((unit) => (
            <MenuItem
              key={unit}
              value={unit}
            >
              {unit}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          type="number"
          label="Price (KES)"
          name="price"
          value={form.price}
          onChange={handleChange}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          select
          fullWidth
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <MenuItem value="Active">
            Active
          </MenuItem>

          <MenuItem value="Inactive">
            Inactive
          </MenuItem>
        </TextField>
      </Grid>
    </Grid>
  );
}

export default ServiceForm;