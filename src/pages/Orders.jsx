import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import OrderTable from "../components/orders/OrderTable";
import AddOrderDialog from "../components/orders/AddOrderDialog";

function Orders() {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Orders
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          New Order
        </Button>
      </Box>

      {/* Search & Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Search customer, phone, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>

            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Received">Received</MenuItem>
              <MenuItem value="Washing">Washing</MenuItem>
              <MenuItem value="Drying">Drying</MenuItem>
              <MenuItem value="Ironing">Ironing</MenuItem>
              <MenuItem value="Ready">Ready</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Service</InputLabel>

            <Select
              value={serviceFilter}
              label="Service"
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Wash">Wash</MenuItem>
              <MenuItem value="Wash & Fold">Wash & Fold</MenuItem>
              <MenuItem value="Dry Cleaning">Dry Cleaning</MenuItem>
              <MenuItem value="Ironing">Ironing</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Sort</InputLabel>

            <Select
              value={sortBy}
              label="Sort"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="Newest">Newest</MenuItem>
              <MenuItem value="Oldest">Oldest</MenuItem>
              <MenuItem value="A-Z">Customer A-Z</MenuItem>
              <MenuItem value="Z-A">Customer Z-A</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Orders Table */}
      <OrderTable
        search={search}
        statusFilter={statusFilter}
        serviceFilter={serviceFilter}
        sortBy={sortBy}
      />

      {/* Add Order Dialog */}
      <AddOrderDialog
        open={open}
        handleClose={() => setOpen(false)}
      />
    </Box>
  );
}

export default Orders;