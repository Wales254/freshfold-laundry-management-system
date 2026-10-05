import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { updateUser } from "../../redux/userSlice";
import UserForm from "./UserForm";

function EditUserDialog({
  open,
  handleClose,
  user,
}) {
  const dispatch = useDispatch();

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

  if (!form) return null;

  const handleSave = () => {
    dispatch(updateUser(form));
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit User</DialogTitle>

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
          Update User
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditUserDialog;