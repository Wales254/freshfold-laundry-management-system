
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  Typography,
  Divider,
  Alert,
} from "@mui/material";

function ReceivePaymentDialog({ open, handleClose, order }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [form, setForm] = useState({
    paymentMethod: "Cash",
    amountPaid: "",
    transactionCode: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && order) {
      setForm({
        paymentMethod: "Cash",
        amountPaid: "",
        transactionCode: "",
      });
      setError("");
    }
  }, [open, order]);

  if (!order) return null;

  const total = Number(order.total || 0);
  const alreadyPaid = Number(order.amountPaid || order.paidAmount || 0);
  const amount = Number(form.amountPaid || 0);

  const balance = Math.max(0, total - alreadyPaid - amount);
  const change = Math.max(0, alreadyPaid + amount - total);

  const handleSave = async () => {
    if (saving) return;

    if (!token) {
      setError("Your login session is missing. Please log in again.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a payment amount greater than zero.");
      return;
    }

    const transactionCode = form.transactionCode.trim();

    if (form.paymentMethod !== "Cash" && !transactionCode) {
      setError("Enter the transaction code or reference.");
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount,
            method: form.paymentMethod,
            transactionReference: transactionCode || null,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to record payment.");
      }

      await dispatch(fetchOrdersFromApi()).unwrap();
      handleClose();
    } catch (err) {
      console.error("Failed to record payment:", err);
      setError(err.message || "Failed to record payment. Please try again.");
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
      <DialogTitle>Receive Payment</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="subtitle1">
          <strong>Customer:</strong> {order.customer}
        </Typography>

        <Typography variant="subtitle1">
          <strong>Service:</strong> {order.service}
        </Typography>

        <Typography variant="subtitle1">
          <strong>Total Bill:</strong> KES {total.toLocaleString("en-KE")}
        </Typography>

        <Typography variant="subtitle1">
          <strong>Already Paid:</strong> KES {alreadyPaid.toLocaleString("en-KE")}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              select
              fullWidth
              label="Payment Method"
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({ ...form, paymentMethod: e.target.value })
              }
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
              value={form.amountPaid}
              onChange={(e) =>
                setForm({ ...form, amountPaid: e.target.value })
              }
              slotProps={{
                htmlInput: { min: 0.01, step: 0.01 },
              }}
              disabled={saving}
              required
            />
          </Grid>

          {form.paymentMethod !== "Cash" && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Transaction Code / Reference"
                value={form.transactionCode}
                onChange={(e) =>
                  setForm({ ...form, transactionCode: e.target.value })
                }
                disabled={saving}
                required
              />
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography>
          Remaining balance: <strong>KES {balance.toLocaleString("en-KE")}</strong>
        </Typography>

        {change > 0 && (
          <Typography>
            Change: <strong>KES {change.toLocaleString("en-KE")}</strong>
          </Typography>
        )}
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

export default ReceivePaymentDialog;
