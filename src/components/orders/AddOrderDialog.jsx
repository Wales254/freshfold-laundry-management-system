
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

function AddOrderDialog({ open, handleClose }) {
  const dispatch = useDispatch();

  const services = useSelector(
    (state) => state.pricing.services
  );

  const defaultService =
    services.length > 0 ? services[0].name : "";

  const getInitialForm = () => ({
    id: "",
    customer: "",
    phone: "",
    service: defaultService,
    quantity: 1,
    items: [],
    deliveryDate: "",
    status: "Received",
    total: 0,
    paymentStatus: "Unpaid",
    paymentMethod: "",
    amountPaid: 0,
    balance: 0,
    change: 0,
    paymentDate: "",
  });

  const [form, setForm] = useState(getInitialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (saving) return;

    if (
      !String(form.customer || "").trim() ||
      !String(form.phone || "").trim()
    ) {
      setError(
        "Please enter the customer name and phone number."
      );
      return;
    }

    // Read every service selected in the form.
    const selectedItems = Array.isArray(form.items)
      ? form.items
      : [];

    if (selectedItems.length === 0) {
      setError("Please add at least one service.");
      return;
    }

    // Resolve prices from the current pricing settings.
    const items = selectedItems.map((item) => {
      const selectedService = services.find(
        (service) => service.name === item.service
      );

      const unitPrice = selectedService
        ? Number(selectedService.price)
        : Number(item.unitPrice);

      return {
        service: String(item.service || "").trim(),
        quantity: Number(item.quantity),
        unitPrice,
      };
    });

    // Validate every service before sending the order.
    for (const item of items) {
      if (!item.service) {
        setError("Please select a service for every item.");
        return;
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        setError(
          `Enter a valid whole-number quantity for ${item.service}.`
        );
        return;
      }

      if (
        !Number.isFinite(item.unitPrice) ||
        item.unitPrice < 0
      ) {
        setError(
          `The price for ${item.service} is invalid. Check your pricing settings.`
        );
        return;
      }
    }

    // Calculate the total using ALL selected services.
    const total = Math.round(
      items.reduce(
        (sum, item) =>
          sum + item.quantity * item.unitPrice,
        0
      ) * 100
    ) / 100;

    const totalQuantity = items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const serviceNames = items
      .map((item) => item.service)
      .join(", ");

    const newOrder = {
      customer: String(form.customer).trim(),
      phone: String(form.phone).trim(),

      // Keep summary fields for compatibility.
      service: serviceNames,
      quantity: totalQuantity,
      total,

      // Send every selected service to the backend.
      items,

      deliveryDate: form.deliveryDate || null,
      status: form.status || "Received",

      // A new order starts with no payments.
      paymentStatus: "Unpaid",
      paymentMethod: null,
      amountPaid: 0,
      balance: total,
      change: 0,
      paymentDate: null,
    };

    setSaving(true);
    setError("");

    try {
      // Create the complete order in one request.
      await dispatch(addOrderToApi(newOrder)).unwrap();

      setForm(getInitialForm());
      setError("");
      handleClose();
    } catch (err) {
      console.error("Failed to save order:", err);

      setError(
        typeof err === "string"
          ? err
          : err?.message ||
            "Failed to save the order. Check your connection and try again."
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
          <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
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
