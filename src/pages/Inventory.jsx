import { useState } from "react";

import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import InventoryStats from "../components/inventory/InventoryStats";
import InventoryTable from "../components/inventory/InventoryTable";
import AddInventoryDialog from "../components/inventory/AddInventoryDialog";
import TransactionHistory from "../components/inventory/TransactionHistory";

function Inventory() {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("A-Z");

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Inventory Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Item
        </Button>
      </Box>

      {/* Statistics */}
      <InventoryStats />

      {/* Search & Filters */}
      <Grid container spacing={2} sx={{ my: 3 }}>
        {/* Search */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Category Filter */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>

            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Cleaning Chemical">
                Cleaning Chemical
              </MenuItem>
              <MenuItem value="Packaging">
                Packaging
              </MenuItem>
              <MenuItem value="Equipment">
                Equipment
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Stock Status Filter */}
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <FormControl fullWidth>
            <InputLabel>Stock Status</InputLabel>

            <Select
              value={statusFilter}
              label="Stock Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Sort */}
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>

            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="A-Z">A-Z</MenuItem>
              <MenuItem value="Z-A">Z-A</MenuItem>
              <MenuItem value="Quantity High-Low">
                Quantity High-Low
              </MenuItem>
              <MenuItem value="Quantity Low-High">
                Quantity Low-High
              </MenuItem>
              <MenuItem value="Cost High-Low">
                Cost High-Low
              </MenuItem>
              <MenuItem value="Cost Low-High">
                Cost Low-High
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Inventory Table */}
      <InventoryTable
        search={search}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        sortBy={sortBy}
      />

      {/* Transaction History */}
      <TransactionHistory />

      {/* Add Inventory Dialog */}
      <AddInventoryDialog
        open={open}
        handleClose={() => setOpen(false)}
      />
    </Box>
  );
}

export default Inventory;