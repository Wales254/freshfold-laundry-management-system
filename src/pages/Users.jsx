
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import UserCards from "../components/users/UserCards";
import UserTable from "../components/users/UserTable";
import AddUserDialog from "../components/users/AddUserDialog";
import {
  setUsers,
  setUsersLoading,
  setUsersError,
} from "../redux/userSlice";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Users() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);
  const error = useSelector((state) => state.users.error);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchUsers() {
      if (!token) {
        dispatch(setUsersError("Please log in to view employee accounts."));
        return;
      }

      dispatch(setUsersLoading(true));
      dispatch(setUsersError(null));

      try {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load employee accounts."
          );
        }

        if (!cancelled) {
          dispatch(setUsers(data.users || []));
        }
      } catch (err) {
        if (!cancelled) {
          dispatch(
            setUsersError(err.message || "Unable to connect to the server.")
          );
        }
      } finally {
        if (!cancelled) {
          dispatch(setUsersLoading(false));
        }
      }
    }

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [dispatch, token]);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
      >
        <Typography variant="h4" fontWeight={700}>
          User Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
          disabled={!token}
        >
          Add User
        </Button>
      </Stack>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && users.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No employee accounts were found. Once your first Admin account is
          created, you can add employees here.
        </Alert>
      )}

      <Box sx={{ mt: 3 }}>
        <UserCards />
      </Box>

      <Box sx={{ mt: 4 }}>
        <UserTable
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </Box>

      <AddUserDialog
        open={openAdd}
        handleClose={() => setOpenAdd(false)}
      />
    </Box>
  );
}

export default Users;
