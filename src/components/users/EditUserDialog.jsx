
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { updateUser } from "../../redux/userSlice";
import UserForm from "./UserForm";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function EditUserDialog({ open, handleClose, user }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && user) {
      setForm({
        id: user.id,
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        role: String(user.role || "cashier").toLowerCase(),
        status: user.status || "Active",
        password: "",
      });

      setError("");
    }
  }, [open, user]);

  const handleSave = async () => {
    if (!form || saving) return;

    if (!form.name.trim() || !form.username.trim() || !form.email.trim()) {
      setError("Name, username, and email are required.");
      return;
    }

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${form.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name.trim(),
            username: form.username.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            role: form.role,
            status: form.status,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to update employee.");
      }

      dispatch(updateUser(data.user));
      handleClose();
    } catch (err) {
      setError(err.message || "Unable to update employee.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!saving) handleClose();
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit Employee</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
            {error}
          </Alert>
        )}

        {form && (
          <UserForm
            form={form}
            setForm={setForm}
            showPassword={false}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !form}
        >
          {saving ? (
            <>
              <CircularProgress size={18} sx={{ mr: 1 }} />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditUserDialog;
