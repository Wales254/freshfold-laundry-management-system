
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";

import { addCustomerToApi } from "../../redux/customerSlice";

function AddCustomerDialog({ open, onClose }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.customers?.loading || false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleClose = () => {
    if (saving) return;
    setError("");
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter the customer's name.");
      return;
    }

    setSaving(true);

    try {
      await dispatch(
        addCustomerToApi({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
        })
      ).unwrap();

      setForm({ name: "", phone: "", email: "" });
      onClose();
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : "Unable to save the customer. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Add New Customer</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Customer Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
            />

            <TextField
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={saving}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={saving || loading}
          >
            {saving ? "Saving..." : "Save Customer"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddCustomerDialog;
