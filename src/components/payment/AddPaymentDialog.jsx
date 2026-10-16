
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchOrdersFromApi } from "../../redux/orderSlice";

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

function AddPaymentDialog({ open, handleClose }) {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.orders.orders);

  const [form, setForm] = useState({
    orderId: "",
    paymentMethod: "Cash",
    amountPaid: "",
    transactionCode: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const resetForm = () => {
    setForm({
      orderId: "",
      paymentMethod: "Cash",
      amountPaid: "",
      transactionCode: "",
    });
    setError("");
  };

  const handleSave = async () => {
    if (saving) return;

    const order = orders.find(
      (item) => String(item.id) === String(form.orderId)
    );

    const paymentAmount = Number(form.amountPaid);

    if (!order) {
      setError("Please select a valid order.");
      return;
    }

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      setError("Enter a payment amount greater than zero.");
      return;
    }

    if (
      form.paymentMethod !== "Cash" &&
      !form.transactionCode.trim()
    ) {
      setError("Enter the transaction code.");
      return;
    }

    const currentPaid = Number(order.amountPaid) || 0;
    const total = Number(order.total) || 0;
    const newAmountPaid =
      Math.round((currentPaid + paymentAmount) * 100) / 100;

    const balance =
      Math.max(0, Math.round((total - newAmountPaid) * 100) / 100);

    const change =
      Math.max(0, Math.round((newAmountPaid - total) * 100) / 100);

    const paymentStatus =
      newAmountPaid >= total
        ? "Paid"
        : newAmountPaid > 0
        ? "Partial"
        : "Unpaid";

    setSaving(true);
    setError("");

    try {
  const response = await fetch(
    `http://localhost:5000/api/orders/${order.id}/payments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: paymentAmount,
        method: form.paymentMethod,
        transactionReference: form.transactionCode.trim() || null,
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
    typeof err === "string"
      ? err
      : err?.message || "Failed to save the payment. Please try again."
  );
} finally {
  setSaving(false);
}
};

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : handleClose}
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
              label="Amount Paid"
              name="amountPaid"
              value={form.amountPaid}
              onChange={handleChange}
              inputProps={{ min: 0.01, step: 0.01 }}
              disabled={saving}
              required
            />
          </Grid>

          {form.paymentMethod !== "Cash" && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Transaction Code"
                name="transactionCode"
                value={form.transactionCode}
                onChange={handleChange}
                disabled={saving}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
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
