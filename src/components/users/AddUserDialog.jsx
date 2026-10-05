import { useState } from "react";
import { useDispatch } from "react-redux";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { addUser } from "../../redux/userSlice";
import UserForm from "./UserForm";

function AddUserDialog({ open, handleClose }) {
  const dispatch = useDispatch();

  const initialForm = {
    name: "",
    email: "",
    phone: "",
    role: "Cashier",
    status: "Active",
    password: "123456",
  };

  const [form, setForm] = useState(initialForm);

  const handleSave = () => {
    dispatch(
      addUser({
        id: Date.now(),
        ...form,
      })
    );

    setForm(initialForm);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Add New User</DialogTitle>

      <DialogContent>
        <UserForm
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
          Save User
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddUserDialog;