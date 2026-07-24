import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

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

import { updateInventoryItem } from "../../redux/inventorySlice";

function EditInventoryDialog({
  open,
  handleClose,
  item,
}) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({});

  useEffect(() => {
    setForm(item || {});
  }, [item]);

  if (!item) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    dispatch(
      updateInventoryItem({
        ...form,
        quantity: Number(form.quantity),
        minStock: Number(form.minStock),
        unitCost: Number(form.unitCost),
      })
    );

    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Edit Inventory Item</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Item Name"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={form.category || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              name="quantity"
              value={form.quantity || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="Unit"
              name="unit"
              value={form.unit || ""}
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
              value={form.minStock || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Unit Cost (KES)"
              name="unitCost"
              value={form.unitCost || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Supplier"
              name="supplier"
              value={form.supplier || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="date"
              label="Last Restocked"
              name="lastRestocked"
              value={form.lastRestocked || ""}
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
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditInventoryDialog;