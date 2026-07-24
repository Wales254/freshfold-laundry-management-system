import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrder } from "../../redux/orderSlice";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import OrderForm from "./OrderForm";
import { calculateTotal } from "../../utils/pricing";

function AddOrderDialog({ open, handleClose }) {
  const dispatch = useDispatch();

  // Get services from Redux
  const services = useSelector(
    (state) => state.pricing.services
  );

  // Default service
  const defaultService =
    services.length > 0 ? services[0].name : "";

  const initialForm = {
    id: "",
    customer: "",
    phone: "",
    service: defaultService,
    quantity: 1,
    deliveryDate: "",
    status: "Received",

    total: calculateTotal(
      services,
      defaultService,
      1
    ),

    // Payment Information
    paymentStatus: "Pending",
    paymentMethod: "",
    amountPaid: 0,

    balance: calculateTotal(
      services,
      defaultService,
      1
    ),

    change: 0,
    paymentDate: "",
  };

  const [form, setForm] = useState(initialForm);

  const handleSave = () => {
    const total = calculateTotal(
      services,
      form.service,
      Number(form.quantity)
    );

    dispatch(
      addOrder({
        ...form,
        id: Date.now(),
        total,

        paymentStatus: "Pending",
        paymentMethod: "",
        amountPaid: 0,
        balance: total,
        change: 0,
        paymentDate: "",
      })
    );

    setForm({
      ...initialForm,
      service: defaultService,
      total: calculateTotal(
        services,
        defaultService,
        1
      ),
      balance: calculateTotal(
        services,
        defaultService,
        1
      ),
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
      <DialogTitle>Add New Order</DialogTitle>

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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddOrderDialog;