import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Stack,
  TextField,
  MenuItem,
  Box,
  Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";
import BlockIcon from "@mui/icons-material/Block";

import {
  deleteUser,
  toggleUserStatus,
  resetPassword,
} from "../../redux/userSlice";

import EditUserDialog from "./EditUserDialog";

function UserTable() {
  const users = useSelector((state) => state.users.users);

  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedUser, setSelectedUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  let filteredUsers = users.filter((user) => {
    const term = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phone.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  });

  if (roleFilter !== "All") {
    filteredUsers = filteredUsers.filter(
      (user) => user.role === roleFilter
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
          label="Search User"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TextField
          select
          label="Role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Manager">Manager</MenuItem>
          <MenuItem value="Cashier">Cashier</MenuItem>
          <MenuItem value="Attendant">Attendant</MenuItem>
        </TextField>

        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Suspended">Suspended</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} hover>

                <TableCell>{user.name}</TableCell>

                <TableCell>{user.email}</TableCell>

                <TableCell>{user.phone}</TableCell>

                <TableCell>{user.role}</TableCell>

                <TableCell>
                  <Chip
                    label={user.status}
                    color={
                      user.status === "Active"
                        ? "success"
                        : "error"
                    }
                  />
                </TableCell>

                <TableCell align="center">
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(user)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() =>
                          dispatch(deleteUser(user.id))
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Suspend / Activate">
                      <IconButton
                        color="warning"
                        onClick={() =>
                          dispatch(toggleUserStatus(user.id))
                        }
                      >
                        <BlockIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Reset Password">
                      <IconButton
                        color="secondary"
                        onClick={() =>
                          dispatch(resetPassword(user.id))
                        }
                      >
                        <LockResetIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          onPageChange={(e, newPage) =>
            setPage(newPage)
          }
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      <EditUserDialog
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        user={selectedUser}
      />
    </>
  );
}

export default UserTable;