
import { useEffect } from "react";
import { useSelector } from "react-redux";

import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";

function OrderForm({ form, setForm }) {
  const services = useSelector(
    (state) => state.pricing.services
  );

  // Support existing orders that only have service and quantity.
  useEffect(() => {
    if (!Array.isArray(form.items) || form.items.length === 0) {
      const initialItem = {
        service: form.service || "",
        quantity: Number(form.quantity) || 1,
        unitPrice: 0,
      };

      const matchedService = services.find(
        (service) => service.name === initialItem.service
      );

      initialItem.unitPrice = Number(matchedService?.price) || 0;

      setForm((previous) => ({
        ...previous,
        items: [initialItem],
      }));
    }
  }, [form.id, form.service, form.quantity, form.items, services, setForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const items = Array.isArray(form.items) ? form.items : [];

  const updateItem = (index, field, value) => {
    setForm((previous) => {
      const currentItems = Array.isArray(previous.items)
        ? previous.items
        : [];

      const updatedItems = currentItems.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        if (field === "service") {
          const selectedService = services.find(
            (service) => service.name === value
          );

          return {
            ...item,
            service: value,
            unitPrice: Number(selectedService?.price) || 0,
          };
        }

        return {
          ...item,
          [field]: value === "" ? "" : Number(value),
        };
      });

      return {
        ...previous,
        items: updatedItems,
      };
    });
  };

  const addItem = () => {
    setForm((previous) => ({
      ...previous,
      items: [
        ...(Array.isArray(previous.items) ? previous.items : []),
        {
          service: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setForm((previous) => {
      const currentItems = Array.isArray(previous.items)
        ? previous.items
        : [];

      if (currentItems.length <= 1) return previous;

      return {
        ...previous,
        items: currentItems.filter(
          (_, itemIndex) => itemIndex !== index
        ),
      };
    });
  };

  const lineTotal = (item) =>
    (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);

  const total = items.reduce(
    (sum, item) => sum + lineTotal(item),
    0
  );

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Customer Name"
          name="customer"
          value={form.customer || ""}
          onChange={handleChange}
          required
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Typography variant="h6">
            Services
          </Typography>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addItem}
            type="button"
          >
            Add Service
          </Button>
        </Stack>
      </Grid>

      {items.map((item, index) => (
        <Grid size={{ xs: 12 }} key={index}>
          <Paper
            variant="outlined"
            sx={{ p: 2 }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Typography fontWeight={600}>
                Service {index + 1}
              </Typography>

              <IconButton
                color="error"
                aria-label={`Remove service ${index + 1}`}
                disabled={items.length <= 1}
                onClick={() => removeItem(index)}
              >
                <DeleteOutlinedIcon />
              </IconButton>
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Service"
                  value={item.service || ""}
                  onChange={(e) =>
                    updateItem(index, "service", e.target.value)
                  }
                  required
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

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  value={item.quantity ?? 1}
                  onChange={(e) =>
                    updateItem(index, "quantity", e.target.value)
                  }
                  inputProps={{ min: 1, step: 1 }}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary">
                  Unit price: KES {formatMoney(item.unitPrice)}
                </Typography>

                <Typography fontWeight={600}>
                  Subtotal: KES {formatMoney(lineTotal(item))}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          type="date"
          label="Delivery Date"
          name="deliveryDate"
          value={form.deliveryDate || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Paper
          variant="outlined"
          sx={{ p: 2 }}
        >
          <Typography variant="body2" color="text.secondary">
            Order Total
          </Typography>

          <Typography variant="h5" fontWeight={700}>
            KES {formatMoney(total)}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default OrderForm;
