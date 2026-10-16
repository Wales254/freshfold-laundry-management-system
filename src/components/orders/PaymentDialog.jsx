
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  Divider,
} from "@mui/material";

import { updateOrderInApi } from "../../redux/orderSlice";

function PaymentDialog({ open, handleClose, order }) {
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order && open) {
      setPaymentMethod(order.paymentMethod || "Cash");
      setAmountPaid("");
    }
  }, [order, open]);

  if (!order) return null;

  const total = Number(order.total) || 0;
  const previouslyPaid = Number(order.amountPaid) || 0;
  const newPayment = Number(amountPaid) || 0;

  const totalPaid = previouslyPaid + newPayment;
  const balance = Math.max(total - totalPaid, 0);
  const change = Math.max(totalPaid - total, 0);

  const paymentStatus =
    totalPaid >= total
      ? "Paid"
      : totalPaid > 0
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

    setSaving(true);

    try {
      await dispatch(
        updateOrderInApi({
          ...order,
          paymentMethod,
          amountPaid: totalPaid,
          balance,
          change,
          paymentStatus,
          paymentDate: new Date().toISOString(),
        })
      ).unwrap();

      handleClose();
    } catch (error) {
      console.error("Failed to save payment:", error);
      window.alert(
        typeof error === "string"
          ? error
          : "Payment could not be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Receive Payment</DialogTitle>

      <DialogContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {order.customer}
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Payment Method"
          select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="M-Pesa">M-Pesa</MenuItem>
          <MenuItem value="Card">Card</MenuItem>
        </TextField>

        <TextField
          fullWidth
          margin="normal"
          type="number"
          label="New Payment Amount"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          inputProps={{ min: 0.01, step: "0.01" }}
        />

        <Divider sx={{ my: 2 }} />

        <Box sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
          <Typography sx={{ mb: 1 }}>
            <strong>Order Total:</strong> KES {total.toLocaleString()}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            <strong>Previously Paid:</strong> KES {previouslyPaid.toLocaleString()}
          </Typography>

          <Typography color="primary.main" sx={{ mb: 1 }}>
            <strong>Total Paid After This Payment:</strong>{" "}
            KES {totalPaid.toLocaleString()}
          </Typography>

          <Typography
            color={balance === 0 ? "success.main" : "error.main"}
            sx={{ mb: 1 }}
          >
            <strong>Remaining Balance:</strong> KES {balance.toLocaleString()}
          </Typography>

          <Typography color="info.main" sx={{ mb: 1 }}>
            <strong>Change:</strong> KES {change.toLocaleString()}
          </Typography>

          <Typography fontWeight="bold">
            Payment Status: {paymentStatus}
          </Typography>
        </Box>
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
