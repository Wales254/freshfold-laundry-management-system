import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";

import { stockOut } from "../../redux/inventorySlice";

function StockOutDialog({
  open,
  handleClose,
  item,
}) {
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (open) {
      setQuantity("");
    }
  }, [open]);

  const handleSubmit = () => {
    const qty = Number(quantity);

    if (!qty || qty <= 0) return;

    if (qty > item.quantity) {
      alert("Not enough stock available.");
      return;
    }

    dispatch(
      stockOut({
        id: item.id,
        quantity: qty,
      })
    );

    handleClose();
  };

  if (!item) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        Stock Out
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Item"
            value={item.name}
            disabled
            fullWidth
          />

          <TextField
            label="Current Quantity"
            value={`${item.quantity} ${item.unit}`}
            disabled
            fullWidth
          />

          <TextField
            label="Quantity to Remove"
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button
          color="warning"
          variant="contained"
          onClick={handleSubmit}
        >
          Stock Out
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StockOutDialog;