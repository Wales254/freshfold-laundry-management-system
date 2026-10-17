
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchOrdersFromApi } from "../../redux/orderSlice";
import API_BASE_URL from "../../services/api";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Alert,
} from "@mui/material";

const getTodayDate = () => {
  const now = new Date();
  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 10);
};

const initialForm = () => ({
  orderId: "",
  paymentMethod: "Cash",
  amountPaid: "",
  transactionCode: "",
  paymentDate: getTodayDate(),
});

function AddPaymentDialog({ open, handleClose }) {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const resetForm = () => {
    setForm(initialForm());
    setError("");
  };

  const handleDialogClose = () => {
    if (saving) return;
    resetForm();
    handleClose();
  };

  const handleSave = async () => {
    if (saving) return;

    const order = orders.find(
      (item) => String(item.id) === String(form.orderId)
    );

    const paymentAmount = Number(form.amountPaid);
    const transactionCode = form.transactionCode.trim();

    if (!order) {
      setError("Please select a valid order.");
      return;
    }

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      setError("Enter a payment amount greater than zero.");
      return;
    }

    if (!form.paymentDate) {
      setError("Please select the payment date.");
      return;
    }

    if (
      form.paymentMethod !== "Cash" &&
      !transactionCode
    ) {
      setError("Enter the transaction code.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orders/${order.id}/payments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: paymentAmount,
            method: form.paymentMethod,
            paymentDate: form.paymentDate,
            transactionReference: transactionCode || null,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to save payment.");
      }

      await dispatch(fetchOrdersFromApi()).unwrap();

      resetForm();
      handleClose();
    } catch (err) {
      console.error("Failed to save payment:", err);

      setError(
        err?.message ||
          "Failed to save the payment. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Add Payment</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              select
              fullWidth
              label="Order"
              name="orderId"
              value={form.orderId}
              onChange={handleChange}
              disabled={saving}
              required
            >
              {orders.map((order) => (
                <MenuItem key={order.id} value={order.id}>
                  #{order.id} - {order.customer}
                  {" | Balance: KES "}
                  {Number(order.balance || 0).toLocaleString("en-KE")}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              fullWidth
              label="Payment Method"
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              disabled={saving}
              required
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="M-Pesa">M-Pesa</MenuItem>
              <MenuItem value="Card">Card</MenuItem>
              <MenuItem value="Bank">Bank</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="number"
              label="Amount Paid (KES)"
              name="amountPaid"
              value={form.amountPaid}
              onChange={handleChange}
              slotProps={{
                htmlInput: { min: 0.01, step: 0.01 },
              }}
              disabled={saving}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="date"
              label="Payment Date"
              name="paymentDate"
              value={form.paymentDate}
              onChange={handleChange}
              disabled={saving}
              required
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Grid>

          {form.paymentMethod !== "Cash" && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Transaction Code / Reference"
                name="transactionCode"
                value={form.transactionCode}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleDialogClose} disabled={saving}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddPaymentDialog;
