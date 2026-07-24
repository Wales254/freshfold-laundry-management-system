import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { updateService } from "../../redux/pricingSlice";
import ServiceForm from "./ServiceForm";

function EditServiceDialog({
  open,
  handleClose,
 service,
}) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "Laundry",
    unit: "Per Item",
    price: 0,
    status: "Active",
  });

  useEffect(() => {
    if (service) {
      setForm(service);
    }
  }, [service]);

  const handleSave = () => {
    dispatch(updateService(form));
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit Service</DialogTitle>

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
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditServiceDialog;