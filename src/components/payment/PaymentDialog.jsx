import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { updatePayment } from "../../redux/orderSlice";

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

function PaymentDialog({
  open,
  handleClose,
  order,
}) {
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] =
    useState("Cash");

  const [amountPaid, setAmountPaid] =
    useState("");

  const [transactionCode, setTransactionCode] =
    useState("");

  useEffect(() => {
    if (order) {
      setPaymentMethod(
        order.paymentMethod || "Cash"
      );

      setAmountPaid(
        order.amountPaid || ""
      );

      setTransactionCode(
        order.transactionCode || ""
      );
    }
  }, [order]);

  if (!order) return null;

  const total = Number(order.total);

  const paid = Number(amountPaid || 0);

  const balance =
    paid >= total ? 0 : total - paid;

  const change =
    paid > total ? paid - total : 0;

  const handleSave = () => {
    dispatch(
      updatePayment({
        id: order.id,
        paymentMethod,
        amountPaid: paid,
        transactionCode,
      })
    );

    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Receive Payment
      </DialogTitle>

      <DialogContent>

        <Box mb={2}>
          <Typography variant="h6">
            {order.customer}
          </Typography>

          <Typography color="text.secondary">
            {order.phone}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">
              Service
            </Typography>

            <Typography fontWeight="bold">
              {order.service}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">
              Quantity
            </Typography>

            <Typography fontWeight="bold">
              {order.quantity}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">
              Total Bill
            </Typography>

            <Typography
              color="primary"
              fontWeight="bold"
            >
              KES {order.total}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">
              Already Paid
            </Typography>

            <Typography
              color="success.main"
              fontWeight="bold"
            >
              KES {order.amountPaid}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">
              Balance
            </Typography>

            <Typography
              color="error.main"
              fontWeight="bold"
            >
              KES {balance}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">
              Status
            </Typography>

            <Chip
              label={order.paymentStatus}
              color={
                order.paymentStatus === "Paid"
                  ? "success"
                  : order.paymentStatus ===
                    "Partial"
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
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
            >
              <MenuItem value="Cash">
                Cash
              </MenuItem>

              <MenuItem value="M-Pesa">
                M-Pesa
              </MenuItem>

              <MenuItem value="Card">
                Card
              </MenuItem>

              <MenuItem value="Bank">
                Bank
              </MenuItem>

            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="number"
              label="Amount Paid"
              value={amountPaid}
              onChange={(e) =>
                setAmountPaid(
                  e.target.value
                )
              }
            />
          </Grid>

          {paymentMethod !== "Cash" && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Transaction Code"
                value={transactionCode}
                onChange={(e) =>
                  setTransactionCode(
                    e.target.value
                  )
                }
              />
            </Grid>
          )}

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">
              Remaining Balance
            </Typography>

            <Typography
              color="error.main"
              fontWeight="bold"
            >
              KES {balance}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2">
              Change
            </Typography>

            <Typography
              color="success.main"
              fontWeight="bold"
            >
              KES {change}
            </Typography>
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
          Save Payment
        </Button>

      </DialogActions>
    </Dialog>
  );
}

export default PaymentDialog;