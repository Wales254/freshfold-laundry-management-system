
import { useState } from "react";
import { Chip, Stack, Button } from "@mui/material";
import { useDispatch } from "react-redux";

import { updateOrderInApi } from "../../redux/orderSlice";
import { getNextStatus } from "../../utils/orderStatus";

function getChipColor(status) {
  switch (status) {
    case "Washing":
      return "primary";
    case "Drying":
      return "info";
    case "Ironing":
      return "warning";
    case "Ready":
      return "success";
    case "Delivered":
      return "secondary";
    default:
      return "default";
  }
}

function StatusWorkflow({ order }) {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);

  const nextStatus = getNextStatus(order.status);

  const handleNextStatus = async () => {
    if (saving) return;

    setSaving(true);

    try {
      await dispatch(
        updateOrderInApi({
          ...order,
          status: nextStatus,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update order status:", error);
      window.alert(
        typeof error === "string"
          ? error
          : "Could not save the new status. Check that the backend is running and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Chip
        label={order.status || "Received"}
        color={getChipColor(order.status)}
      />

      {order.status !== "Delivered" && (
        <Button
          size="small"
          variant="contained"
          onClick={handleNextStatus}
          disabled={saving}
        >
          {saving ? "Saving..." : "Next"}
        </Button>
      )}
    </Stack>
  );
}

export default StatusWorkflow;
