
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { fetchOrdersFromApi } from "../../redux/orderSlice";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Divider,
  Box,
  Chip,
} from "@mui/material";

function PaymentDialog({ open, handleClose, order }) {
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [transactionCode, setTransactionCode] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order && open) {
      setPaymentMethod(order.paymentMethod || "Cash");
      setAmountPaid("");
      setTransactionCode("");
    }
  }, [order, open]);

  if (!order) return null;

  const total = Number(order.total) || 0;
  const previouslyPaid = Number(order.amountPaid) || 0;
  const newPayment = Number(amountPaid) || 0;
  const totalAfterPayment = previouslyPaid + newPayment;
  const balance = Math.max(total - totalAfterPayment, 0);
  const change = Math.max(totalAfterPayment - total, 0);

  const paymentStatus =
    totalAfterPayment >= total
      ? "Paid"
      : totalAfterPayment > 0
        ? "Partial"
        : "Unpaid";

  const handleSave = async () => {
    if (saving) return;

    if (!Number.isFinite(newPayment) || newPayment <= 0) {
      window.alert("Enter a payment amount greater than zero.");
      return;
    }

    if (previouslyPaid >= total) {
      window.alert("This order has already been fully paid.");
      return;
    }

    if (paymentMethod !== "Cash" && !transactionCode.trim()) {
      window.alert("Enter the transaction reference.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${order.id}/payments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: newPayment,
            method: paymentMethod,
            transactionReference: transactionCode.trim() || null,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Could not save payment.");
      }

      await dispatch(fetchOrdersFromApi()).unwrap();

      console.log("PAYMENT API RESPONSE:", data);

      window.alert("Payment saved successfully.");
      handleClose();
    } catch (error) {
      console.error("Save payment error:", error);
      window.alert(
        error.message || "Payment could not be saved. Please try again."
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
      <DialogTitle>Receive Payment</DialogTitle>

      <DialogContent>
        <Box mb={2}>
          <Typography variant="h6">{order.customer}</Typography>
          <Typography color="text.secondary">{order.phone}</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">Service</Typography>
            <Typography fontWeight="bold">{order.service}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">Quantity</Typography>
            <Typography fontWeight="bold">{order.quantity}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">Total Bill</Typography>
            <Typography color="primary" fontWeight="bold">
              KES {total.toLocaleString()}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">Previously Paid</Typography>
            <Typography color="success.main" fontWeight="bold">
              KES {previouslyPaid.toLocaleString()}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">Remaining After This Payment</Typography>
            <Typography color="error.main" fontWeight="bold">
              KES {balance.toLocaleString()}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">Status After Payment</Typography>
            <Chip
              label={paymentStatus}
              color={
                paymentStatus === "Paid"
                  ? "success"
                  : paymentStatus === "Partial"
                    ? "warning"
                    : "error"
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              fullWidth
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={saving}
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="M-Pesa">M-Pesa</MenuItem>
              <MenuItem value="Card">Card</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="number"
              label="New Installment Amount"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              slotProps={{ htmlInput: { min: 0.01, step: "0.01" } }}
              disabled={saving}
            />
          </Grid>

          {paymentMethod !== "Cash" && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Transaction Reference"
                value={transactionCode}
                onChange={(e) => setTransactionCode(e.target.value)}
                disabled={saving}
              />
            </Grid>
          )}

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">Change</Typography>
            <Typography color="success.main" fontWeight="bold">
              KES {change.toLocaleString()}
            </Typography>
          </Grid>
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

export default PaymentDialog;
