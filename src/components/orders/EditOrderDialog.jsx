
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateOrderInApi } from "../../redux/orderSlice";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";

import OrderForm from "./OrderForm";

function EditOrderDialog({ open, handleClose, order }) {
  const dispatch = useDispatch();

  const services = useSelector(
    (state) => state.pricing.services
  );

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !order) {
      setForm(null);
      return;
    }

    let items = Array.isArray(order.items)
      ? order.items.map((item) => {
          const serviceDetails = services.find(
            (service) => service.name === item.service
          );

          return {
            service: item.service,
            quantity: Number(item.quantity) || 1,
            unitPrice: Number(
              item.unitPrice ??
                item.unit_price ??
                serviceDetails?.price ??
                0
            ),
          };
        })
      : [];

    // Support older orders that only have one service.
    if (items.length === 0 && order.service) {
      const serviceDetails = services.find(
        (service) => service.name === order.service
      );

      const quantity = Number(order.quantity) || 1;

      items = [
        {
          service: order.service,
          quantity,
          unitPrice: Number(
            serviceDetails?.price ??
              Number(order.total) / quantity ??
              0
          ),
        },
      ];
    }

    setForm({
      ...order,
      items,
      deliveryDate:
        order.deliveryDate ??
        order.delivery_date ??
        "",
    });

    setError("");
  }, [open, order, services]);

  const handleSave = async () => {
    if (!form || saving) return;

    const items = Array.isArray(form.items)
      ? form.items
      : [];

    if (!String(form.customer || "").trim()) {
      setError("Please enter the customer's name.");
      return;
    }

    if (!String(form.phone || "").trim()) {
      setError("Please enter the customer's phone number.");
      return;
    }

    if (items.length === 0) {
      setError("Please add at least one service.");
      return;
    }

    const invalidItem = items.some(
      (item) =>
        !item.service ||
        !Number.isFinite(Number(item.quantity)) ||
        Number(item.quantity) <= 0 ||
        !Number.isFinite(Number(item.unitPrice)) ||
        Number(item.unitPrice) < 0
    );

    if (invalidItem) {
      setError(
        "Please check each service, quantity, and price."
      );
      return;
    }

    const total = items.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity) * Number(item.unitPrice),
      0
    );

    setSaving(true);
    setError("");

    try {
      await dispatch(
        updateOrderInApi({
          ...form,
          customer: String(form.customer).trim(),
          phone: String(form.phone).trim(),
          service: items
            .map((item) => item.service)
            .join(", "),
          quantity: items.reduce(
            (sum, item) => sum + Number(item.quantity),
            0
          ),
          items: items.map((item) => ({
            service: item.service,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })),
          total,
        })
      ).unwrap();

      handleClose();
    } catch (err) {
      console.error("Failed to update order:", err);

      setError(
        typeof err === "string"
          ? err
          : err?.message ||
              "Failed to update the order. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open || !form) return null;

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit Order</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
            {error}
          </Alert>
        )}

        <OrderForm form={form} setForm={setForm} />
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
          disabled={saving}
        >
          {saving ? "Saving..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditOrderDialog;
