import { useSelector } from "react-redux";

import { Grid, TextField, MenuItem } from "@mui/material";

import { calculateTotal } from "../../utils/pricing";

function OrderForm({ form, setForm }) {
  // Get services from Redux
  const services = useSelector(
    (state) => state.pricing.services
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "quantity" ? Number(value) : value,
    });
  };

  // Calculate total dynamically using Redux services
  const total = calculateTotal(
    services,
    form.service,
    Number(form.quantity)
  );

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Customer Name"
          name="customer"
          value={form.customer}
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
          label="Service"
          name="service"
          value={form.service}
          onChange={handleChange}
        >
          {services.map((service) => (
            <MenuItem
              key={service.id}
              value={service.name}
            >
              {service.name} (KES {service.price})
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 6 }}>
        <TextField
          fullWidth
          type="number"
          label="Quantity"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          inputProps={{ min: 1 }}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          type="date"
          label="Delivery Date"
          name="deliveryDate"
          value={form.deliveryDate}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Total Amount"
          value={`KES ${total}`}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
    </Grid>
  );
}

export default OrderForm;