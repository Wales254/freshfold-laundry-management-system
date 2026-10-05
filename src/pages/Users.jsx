import { useState } from "react";

import { Box, Typography, Stack, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import UserCards from "../components/users/UserCards";
import UserTable from "../components/users/UserTable";
import AddUserDialog from "../components/users/AddUserDialog";

function Users() {
  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");

  const [statusFilter, setStatusFilter] = useState("All");

  const [openAdd, setOpenAdd] = useState(false);

  return (
    <Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
        >
          User Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
        >
          Add User
        </Button>
      </Stack>

      <UserCards />

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