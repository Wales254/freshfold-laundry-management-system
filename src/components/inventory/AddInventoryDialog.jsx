import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";

import { addInventoryItem } from "../../redux/inventorySlice";

function AddInventoryDialog({ open, handleClose }) {
  const dispatch = useDispatch();

  const inventory = useSelector(
    (state) => state.inventory.inventory
  );

  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "Pieces",
    minStock: "",
    unitCost: "",
    supplier: "",
    lastRestocked: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    dispatch(
      addInventoryItem({
        id:
          inventory.length > 0
            ? Math.max(...inventory.map((i) => i.id)) + 1
            : 1,

        ...form,

        quantity: Number(form.quantity),
        minStock: Number(form.minStock),
        unitCost: Number(form.unitCost),
      })
    );

    setForm({
      name: "",
      category: "",
      quantity: "",
      unit: "Pieces",
      minStock: "",
      unitCost: "",
      supplier: "",
      lastRestocked: "",
    });

    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Add Inventory Item</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Item Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="Unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
            >
              <MenuItem value="Pieces">Pieces</MenuItem>
              <MenuItem value="Litres">Litres</MenuItem>
              <MenuItem value="Kg">Kg</MenuItem>
              <MenuItem value="Boxes">Boxes</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Minimum Stock"
              name="minStock"
              value={form.minStock}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Unit Cost (KES)"
              name="unitCost"
              value={form.unitCost}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Supplier"
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="date"
              label="Last Restocked"
              name="lastRestocked"
              value={form.lastRestocked}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          Add Item
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddInventoryDialog;