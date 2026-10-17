
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";

import UserForm from "./UserForm";
import { addUser } from "../../redux/userSlice";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialForm = {
  name: "",
  username: "",
  email: "",
  phone: "",
  role: "cashier",
  status: "Active",
  password: "",
};

function AddUserDialog({ open, handleClose }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [form, setForm] = useState({ ...initialForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setForm({ ...initialForm });
    setError("");
  };

  const handleDialogClose = () => {
    if (saving) return;

    resetForm();
    handleClose();
  };

  const handleSave = async () => {
    setError("");

    if (
      !form.name.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      setError(
        "Please complete the name, username, email, and password fields."
      );
      return;
    }

    if (!/^[a-zA-Z0-9_.-]{3,50}$/.test(form.username.trim())) {
      setError(
        "Username must be 3–50 characters and contain only letters, numbers, dots, underscores, or hyphens."
      );
      return;
    }

    if (
      form.password.length < 12 ||
      !/[a-z]/.test(form.password) ||
      !/[A-Z]/.test(form.password) ||
      !/[0-9]/.test(form.password) ||
      !/[^A-Za-z0-9]/.test(form.password)
    ) {
      setError(
        "Use at least 12 characters with uppercase and lowercase letters, a number, and a special character."
      );
      return;
    }

    if (!token) {
      setError("Your login session is missing. Please log in again.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          username: form.username.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role.toLowerCase(),
          status: form.status,
          password: form.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create the employee account."
        );
      }

      if (!data.user) {
        throw new Error(
          "The server did not return the new employee account."
        );
      }

      // Only the public employee record is stored; never the password.
      dispatch(addUser(data.user));

      resetForm();
      handleClose();
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Add New Employee Account</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
            {error}
          </Alert>
        )}

        <UserForm form={form} setForm={setForm} />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleDialogClose} disabled={saving}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <CircularProgress size={18} sx={{ mr: 1 }} />
              Creating...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddUserDialog;
