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

import { stockIn } from "../../redux/inventorySlice";

function StockInDialog({
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
    if (!quantity || Number(quantity) <= 0) return;

    dispatch(
      stockIn({
        id: item.id,
        quantity: Number(quantity),
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
        Stock In
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Item"
            value={item.name}
            fullWidth
            disabled
          />

          <TextField
            label="Current Quantity"
            value={`${item.quantity} ${item.unit}`}
            fullWidth
            disabled
          />

          <TextField
            label="Quantity to Add"
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
          variant="contained"
          onClick={handleSubmit}
        >
          Stock In
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StockInDialog;