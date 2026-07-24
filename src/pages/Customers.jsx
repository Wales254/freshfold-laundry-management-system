import { useState } from "react";

import {
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import CustomerTable from "../components/customers/CustomerTable";
import CustomerStats from "../components/customers/CustomerStats";

function Customers() {
  const [search, setSearch] = useState("");

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 3 }}
      >
        Customer Management
      </Typography>

      <CustomerStats />

      <TextField
        fullWidth
        placeholder="Search customer by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
    </Box>
  );
}

export default Customers;