
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Stack,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import CustomerTable from "../components/customers/CustomerTable";
import CustomerStats from "../components/customers/CustomerStats";
import AddCustomerDialog from "../components/customers/AddCustomerDialog";

import { fetchCustomersFromApi } from "../redux/customerSlice";
import { fetchOrdersFromApi } from "../redux/orderSlice";

function Customers() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomersFromApi());
    dispatch(fetchOrdersFromApi());
  }, [dispatch]);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" fontWeight="bold">
          Customer Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<PersonAddAlt1Icon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Customer
        </Button>
      </Stack>

      <CustomerStats />

      <TextField
        fullWidth
        placeholder="Search customer by name or phone..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <CustomerTable search={search} />

      <AddCustomerDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
      />
    </Box>
  );
}

export default Customers;
