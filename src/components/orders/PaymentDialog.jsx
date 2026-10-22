
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
  Alert,
} from "@mui/material";

import { fetchOrdersFromApi } from "../../redux/orderSlice";

function PaymentDialog({ open, handleClose, order }) {
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (order && open) {
      setPaymentMethod("Cash");
      setAmountPaid("");
      setTransactionReference("");
      setError("");
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
      setError("Enter a payment amount greater than zero.");
      return;
    }

    if (previouslyPaid >= total) {
      setError("This order has already been fully paid.");
      return;
    }

    if (newPayment > balance) {
      setError(
        "The payment exceeds the remaining balance. Please enter an amount within the balance."
      );
      return;
    }

    if (
      paymentMethod !== "Cash" &&
      !transactionReference.trim()
    ) {
      setError("Enter the transaction reference for this payment.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const savedAuth = sessionStorage.getItem("auth");
      const auth = savedAuth ? JSON.parse(savedAuth) : null;
      const token = auth?.token;

      if (!token) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      const baseUrl = (
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000"
      ).replace(/\/+$/, "");

      const response = await fetch(
        `${baseUrl}/api/orders/${order.id}/payments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: newPayment,
            method: paymentMethod,
            transactionReference:
              transactionReference.trim() || null,
            paymentDate: new Date().toISOString(),
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to save payment."
        );
      }

      await dispatch(fetchOrdersFromApi()).unwrap();

      handleClose();
    } catch (err) {
      console.error("Failed to save payment:", err);

      setError(
        err?.message ||
          "Payment could not be saved. Please try again."
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          margin="normal"
          label="Payment Method"
          select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          disabled={saving}
        >
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="M-Pesa">M-Pesa</MenuItem>
          <MenuItem value="Card">Card</MenuItem>
          <MenuItem value="Bank">Bank</MenuItem>
        </TextField>

        <TextField
          fullWidth
          margin="normal"
          type="number"
          label="New Payment Amount"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          inputProps={{
            min: 0.01,
            max: balance,
            step: "0.01",
          }}
          disabled={saving}
        />

        {paymentMethod !== "Cash" && (
          <TextField
            fullWidth
            margin="normal"
            label="Transaction Reference"
            value={transactionReference}
            onChange={(e) =>
              setTransactionReference(e.target.value)
            }
            inputProps={{ maxLength: 100 }}
            required
            disabled={saving}
          />
        )}

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            p: 2,
            bgcolor: "background.default",
            borderRadius: 2,
          }}
        >
          <Typography sx={{ mb: 1 }}>
            <strong>Order Total:</strong>{" "}
            KES {total.toLocaleString()}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            <strong>Previously Paid:</strong>{" "}
            KES {previouslyPaid.toLocaleString()}
          </Typography>

          <Typography color="primary.main" sx={{ mb: 1 }}>
            <strong>Total Paid After This Payment:</strong>{" "}
            KES {totalPaid.toLocaleString()}
          </Typography>

          <Typography
            color={
              balance === 0 ? "success.main" : "error.main"
            }
            sx={{ mb: 1 }}
          >
            <strong>Remaining Balance:</strong>{" "}
            KES {balance.toLocaleString()}
          </Typography>

          <Typography color="info.main" sx={{ mb: 1 }}>
            <strong>Change:</strong>{" "}
            KES {change.toLocaleString()}
          </Typography>

          <Typography fontWeight="bold">
            Payment Status: {paymentStatus}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !amountPaid}
        >
          {saving ? "Saving..." : "Save Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentDialog;
