import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOrder } from "../../redux/orderSlice";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import OrderForm from "./OrderForm";
import { calculateTotal } from "../../utils/pricing";

function EditOrderDialog({
  open,
  handleClose,
  order,
}) {
  const dispatch = useDispatch();

  const services = useSelector(
    (state) => state.pricing.services
  );

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (order) {
      setForm(order);
    }
  }, [order]);

  if (!form) return null;

  const handleSave = () => {
    const total = calculateTotal(
      services,
      form.service,
      Number(form.quantity)
    );

    dispatch(
      updateOrder({
        ...form,
        total,
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
      <DialogTitle>Edit Order</DialogTitle>

      <DialogContent>
        <OrderForm
          form={form}
          setForm={setForm}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditOrderDialog;