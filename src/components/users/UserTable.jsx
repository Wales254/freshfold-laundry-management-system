
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";
import BlockIcon from "@mui/icons-material/Block";

import {
  deleteUser,
  setUserStatus,
} from "../../redux/userSlice";

import EditUserDialog from "./EditUserDialog";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function UserTable({
  search: externalSearch,
  setSearch: setExternalSearch,
  roleFilter: externalRoleFilter,
  setRoleFilter: setExternalRoleFilter,
  statusFilter: externalStatusFilter,
  setStatusFilter: setExternalStatusFilter,
}) {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users.users);
  const token = useSelector((state) => state.auth.token);

  const [localSearch, setLocalSearch] = useState("");
  const [localRoleFilter, setLocalRoleFilter] = useState("All");
  const [localStatusFilter, setLocalStatusFilter] = useState("All");

  const search = externalSearch ?? localSearch;
  const setSearch = setExternalSearch ?? setLocalSearch;

  const roleFilter = externalRoleFilter ?? localRoleFilter;
  const setRoleFilter = setExternalRoleFilter ?? setLocalRoleFilter;

  const statusFilter = externalStatusFilter ?? localStatusFilter;
  const setStatusFilter = setExternalStatusFilter ?? setLocalStatusFilter;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [busyUserId, setBusyUserId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setPage(0);
  }, [search, roleFilter, statusFilter]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const request = async (path, options = {}) => {
    if (!token) {
      throw new Error("Please log in again.");
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "The request failed.");
    }

    return data;
  };

  const handleDelete = async (user) => {
    if (
      !window.confirm(
        `Permanently delete the account for ${user.name}? This cannot be undone.`
      )
    ) {
      return;
    }

    setError("");
    setNotice("");
    setBusyUserId(user.id);

    try {
      await request(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      dispatch(deleteUser(user.id));
      setNotice(`${user.name}'s account was deleted.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyUserId(null);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus =
      user.status === "Active" ? "Suspended" : "Active";

    setError("");
    setNotice("");
    setBusyUserId(user.id);

    try {
      const data = await request(`/api/users/${user.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });

      dispatch(
        setUserStatus({
          id: user.id,
          status: data.user?.status || nextStatus,
        })
      );

      setNotice(`${user.name}'s account is now ${nextStatus.toLowerCase()}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyUserId(null);
    }
  };

  const handleResetPassword = async (user) => {
    const password = window.prompt(
      `Enter a new temporary password for ${user.name}.\n\nUse at least 12 characters, including uppercase and lowercase letters, a number, and a symbol.`
    );

    if (password === null) return;

    if (
      password.length < 12 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setError(
        "Password must have at least 12 characters, uppercase and lowercase letters, a number, and a symbol."
      );
      return;
    }

    setError("");
    setNotice("");
    setBusyUserId(user.id);

    try {
      await request(`/api/users/${user.id}/password`, {
        method: "PATCH",
        body: JSON.stringify({ password }),
      });

      setNotice(
        `Password updated for ${user.name}. Share the temporary password securely.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyUserId(null);
    }
  };

  let filteredUsers = users.filter((user) => {
    const term = search.trim().toLowerCase();

    return (
      String(user.name || "").toLowerCase().includes(term) ||
      String(user.username || "").toLowerCase().includes(term) ||
      String(user.email || "").toLowerCase().includes(term) ||
      String(user.phone || "").toLowerCase().includes(term) ||
      String(user.role || "").toLowerCase().includes(term)
    );
  });

  if (roleFilter !== "All") {
    filteredUsers = filteredUsers.filter(
      (user) =>
        String(user.role || "").toLowerCase() ===
        roleFilter.toLowerCase()
    );
  }

  if (statusFilter !== "All") {
    filteredUsers = filteredUsers.filter(
      (user) => user.status === statusFilter
    );
  }

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          mt: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Search employee"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          size="small"
        />

        <TextField
          select
          label="Role"
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          size="small"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="All">All roles</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Manager">Manager</MenuItem>
          <MenuItem value="Cashier">Cashier</MenuItem>
          <MenuItem value="Attendant">Attendant</MenuItem>
        </TextField>

        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          size="small"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="All">All statuses</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Suspended">Suspended</MenuItem>
        </TextField>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {notice && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setNotice("")}
        >
          {notice}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedUsers.map((user) => {
              const isBusy = String(busyUserId) === String(user.id);

              return (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username || "—"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "—"}</TableCell>
                  <TableCell>
                    {String(user.role || "").charAt(0).toUpperCase() +
                      String(user.role || "").slice(1).toLowerCase()}
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={user.status}
                      color={
                        user.status === "Active" ? "success" : "error"
                      }
                    />
                  </TableCell>

                  <TableCell align="center">
                    {isBusy ? (
                      <CircularProgress size={22} />
                    ) : (
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                      >
                        <Tooltip title="Edit employee">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(user)}
                            aria-label={`Edit ${user.name}`}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete employee">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(user)}
                            aria-label={`Delete ${user.name}`}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={
                            user.status === "Active"
                              ? "Suspend employee"
                              : "Activate employee"
                          }
                        >
                          <IconButton
                            color="warning"
                            onClick={() => handleToggleStatus(user)}
                            aria-label={`Change status for ${user.name}`}
                          >
                            <BlockIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Reset password">
                          <IconButton
                            color="secondary"
                            onClick={() => handleResetPassword(user)}
                            aria-label={`Reset password for ${user.name}`}
                          >
                            <LockResetIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  No employees match your search or filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
        />
      </TableContainer>

      <EditUserDialog
        open={openEdit}
        handleClose={() => {
          setOpenEdit(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </>
  );
}

export default UserTable;
