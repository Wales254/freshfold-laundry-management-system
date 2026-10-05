import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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
  Typography,
  Divider,
} from "@mui/material";

function ReceivePaymentDialog({
  open,
  handleClose,
  order,
}) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    paymentMethod: "Cash",
    amountPaid: "",
    transactionCode: "",
  });

  useEffect(() => {
    if (order) {
      setForm({
        paymentMethod: "Cash",
        amountPaid: order.amountPaid || "",
        transactionCode: order.transactionCode || "",
      });
    }
  }, [order]);

  if (!order) return null;

  const total = Number(order.total);
  const paid = Number(form.amountPaid || 0);

  const balance =
    paid >= total ? 0 : total - paid;

  const change =
    paid > total ? paid - total : 0;

  const handleSave = () => {
    dispatch(
      updatePayment({
        id: order.id,
        paymentMethod: form.paymentMethod,
        amountPaid: paid,
        transactionCode: form.transactionCode,
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

        <Typography variant="subtitle1">
          <strong>Customer:</strong>{" "}
          {order.customer}
        </Typography>

        <Typography variant="subtitle1">
          <strong>Service:</strong>{" "}
          {order.service}
        </Typography>

        <Typography variant="subtitle1">
          <strong>Total Bill:</strong> KES {total}
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
                setForm({
                  ...form,
                  paymentMethod:
                    e.target.value,
                })
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
              value={form.amountPaid}
              onChange={(e) =>
                setForm({
                  ...form,
                  amountPaid:
                    e.target.value,
                })
              }
            />

          </Grid>

          {form.paymentMethod !== "Cash" && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Transaction Code"
                value={
                  form.transactionCode
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    transactionCode:
                      e.target.value,
                  })
                }
              />
            </Grid>
          )}

        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography>
          Balance:
          <strong>
            {" "}
            KES {balance}
          </strong>
        </Typography>

        <Typography>
          Change:
          <strong>
            {" "}
            KES {change}
          </strong>
        </Typography>

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

export default ReceivePaymentDialog;