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

import { updatePayment } from "../../redux/orderSlice";

function PaymentDialog({
  open,
  handleClose,
  order,
}) {
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState("");

  useEffect(() => {
    if (order) {
      setPaymentMethod(order.paymentMethod || "Cash");
      setAmountPaid(order.amountPaid || "");
    }
  }, [order]);

  if (!order) return null;

  const total = Number(order.total);
  const paid = Number(amountPaid) || 0;

  // Remaining balance
  const balance = paid >= total ? 0 : total - paid;

  // Change to return
  const change = paid > total ? paid - total : 0;

  const handleSave = () => {
    dispatch(
      updatePayment({
        id: order.id,
        paymentMethod,
        amountPaid: paid,
      })
    );

    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Receive Payment</DialogTitle>

      <DialogContent>
        <Typography
          variant="h6"
          sx={{ mb: 2 }}
        >
          {order.customer}
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Payment Method"
          select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
        >
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="M-Pesa">M-Pesa</MenuItem>
          <MenuItem value="Card">Card</MenuItem>
        </TextField>

        <TextField
          fullWidth
          margin="normal"
          type="number"
          label="Amount Paid"
          value={amountPaid}
          onChange={(e) =>
            setAmountPaid(e.target.value)
          }
        />

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            p: 2,
            bgcolor: "#f8f9fa",
            borderRadius: 2,
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography sx={{ mb: 1 }}>
            <strong>Total Amount:</strong> KES {total}
          </Typography>

          <Typography
            color="primary.main"
            sx={{ mb: 1 }}
          >
            <strong>Amount Paid:</strong> KES {paid}
          </Typography>

          <Typography
            color={
              balance === 0
                ? "success.main"
                : "error.main"
            }
            sx={{ mb: 1 }}
          >
            <strong>Balance:</strong> KES {balance}
          </Typography>

          <Typography
            color="info.main"
            sx={{ mb: 1 }}
          >
            <strong>Change:</strong> KES {change}
          </Typography>

          <Typography
            color={
              paid >= total
                ? "success.main"
                : paid > 0
                ? "warning.main"
                : "error.main"
            }
            fontWeight="bold"
          >
            Status:{" "}
            {paid >= total
              ? "Paid"
              : paid > 0
              ? "Partial Payment"
              : "Pending"}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
        >
          Save Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentDialog;