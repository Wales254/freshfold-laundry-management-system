import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { updatePayment } from "../../redux/orderSlice";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";

function AddPaymentDialog({
  open,
  handleClose,
}) {
  const dispatch = useDispatch();

  const orders = useSelector(
    (state) => state.orders.orders
  );

  const [form, setForm] = useState({
    orderId: "",
    paymentMethod: "Cash",
    amountPaid: "",
    transactionCode: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (!form.orderId || !form.amountPaid) return;

    dispatch(
      updatePayment({
        id: Number(form.orderId),
        paymentMethod: form.paymentMethod,
        amountPaid: Number(form.amountPaid),
        transactionCode: form.transactionCode,
      })
    );

    setForm({
      orderId: "",
      paymentMethod: "Cash",
      amountPaid: "",
      transactionCode: "",
    });

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
        Add Payment
      </DialogTitle>

      <DialogContent>

        <Grid container spacing={2} sx={{ mt: 1 }}>

          <Grid size={{ xs: 12 }}>

            <TextField
              select
              fullWidth
              label="Order"
              name="orderId"
              value={form.orderId}
              onChange={handleChange}
            >
              {orders.map((order) => (
                <MenuItem
                  key={order.id}
                  value={order.id}
                >
                  #{order.id} - {order.customer}
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
              name="amountPaid"
              value={form.amountPaid}
              onChange={handleChange}
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
              />

            </Grid>

          )}

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

export default AddPaymentDialog;