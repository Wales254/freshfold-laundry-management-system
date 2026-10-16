import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrderToApi } from "../../redux/orderSlice";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
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

  const getInitialForm = () => {
    const total = calculateTotal(
      services,
      defaultService,
      1
    );

    return {
      id: "",
      customer: "",
      phone: "",
      service: defaultService,
      quantity: 1,
      deliveryDate: "",
      status: "Received",
      total,

      // Payment Information
      paymentStatus: "Pending",
      paymentMethod: "",
      amountPaid: 0,
      balance: total,
      change: 0,
      paymentDate: "",
    };
  };

  const [form, setForm] = useState(getInitialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (saving) return;

    if (
      !String(form.customer || "").trim() ||
      !String(form.phone || "").trim() ||
      !form.service ||
      Number(form.quantity) < 1
    ) {
      setError(
        "Please enter the customer name, phone, service, and a valid quantity."
      );
      return;
    }

    const total = calculateTotal(
      services,
      form.service,
      Number(form.quantity)
    );

    if (!Number.isFinite(Number(total)) || Number(total) < 0) {
      setError("The order total is invalid. Please check your pricing.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const newOrder = {
        customer: String(form.customer).trim(),
        phone: String(form.phone).trim(),
        service: form.service,
        quantity: Number(form.quantity),
        deliveryDate: form.deliveryDate || null,
        status: form.status || "Received",
        total: Number(total),

        // Initial payment information
        paymentStatus: "Unpaid",
        paymentMethod: null,
        amountPaid: 0,
        balance: Number(total),
        change: 0,
        paymentDate: null,
      };

      await dispatch(addOrderToApi(newOrder)).unwrap();

      setForm(getInitialForm());
      setError("");
      handleClose();
    } catch (err) {
      console.error("Failed to save order:", err);

      setError(
        typeof err === "string"
          ? err
          : "Failed to save the order. Check that the backend and database are running, then try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDialogClose = () => {
    if (saving) return;

    setError("");
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Add New Order</DialogTitle>

      <DialogContent>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, mt: 1 }}
          >
            {error}
          </Alert>
        )}

        <OrderForm
          form={form}
          setForm={setForm}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleDialogClose}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddOrderDialog;