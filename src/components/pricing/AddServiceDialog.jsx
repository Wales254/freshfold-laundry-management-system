import { useState } from "react";
import { useDispatch } from "react-redux";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { addService } from "../../redux/pricingSlice";
import ServiceForm from "./ServiceForm";

function AddServiceDialog({ open, handleClose }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    category: "Laundry",
    unit: "Per Item",
    price: 0,
    status: "Active",
  });

  const handleSave = () => {
    dispatch(
      addService({
        id: Date.now(),
        ...form,
      })
    );

    setForm({
      name: "",
      category: "Laundry",
      unit: "Per Item",
      price: 0,
      status: "Active",
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
      <DialogTitle>Add Service</DialogTitle>

      <DialogContent>
        <ServiceForm
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

export default AddServiceDialog;