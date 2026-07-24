import { Chip, Stack, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateStatus } from "../../redux/orderSlice";
import { getNextStatus } from "../../utils/orderStatus";

function getChipColor(status) {
  switch (status) {
    case "Received":
      return "default";

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

  const nextStatus = getNextStatus(order.status);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Chip
        label={order.status}
        color={getChipColor(order.status)}
      />

      {order.status !== "Delivered" && (
        <Button
          size="small"
          variant="contained"
          onClick={() =>
            dispatch(
              updateStatus({
                id: order.id,
                status: nextStatus,
              })
            )
          }
        >
          Next
        </Button>
      )}
    </Stack>
  );
}

export default StatusWorkflow;