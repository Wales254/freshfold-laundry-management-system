import { useState } from "react";

import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import PricingCards from "../components/pricing/PricingCards";
import PricingTable from "../components/pricing/PricingTable";
import AddServiceDialog from "../components/pricing/AddServiceDialog";

function Pricing() {
  const [openAdd, setOpenAdd] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Pricing Management
          </Typography>

          <Typography color="text.secondary">
            Manage laundry services and pricing.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
        >
          Add Service
        </Button>
      </Box>

      {/* Summary Cards */}
      <PricingCards />

      {/* Filters */}
      <Grid container spacing={2} sx={{ mt: 3, mb: 3 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            fullWidth
            label="Category"
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Laundry">Laundry</MenuItem>
            <MenuItem value="Dry Cleaning">
              Dry Cleaning
            </MenuItem>
            <MenuItem value="Bedding">Bedding</MenuItem>
            <MenuItem value="Curtains">Curtains</MenuItem>
            <MenuItem value="Carpets">Carpets</MenuItem>
            <MenuItem value="Footwear">Footwear</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            fullWidth
            label="Status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            fullWidth
            label="Sort By"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <MenuItem value="Newest">Newest</MenuItem>
            <MenuItem value="Oldest">Oldest</MenuItem>
            <MenuItem value="A-Z">A-Z</MenuItem>
            <MenuItem value="Z-A">Z-A</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Pricing Table */}
      <PricingTable
        search={search}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        sortBy={sortBy}
      />

      {/* Add Service Dialog */}
      <AddServiceDialog
        open={openAdd}
        handleClose={() => setOpenAdd(false)}
      />
    </Box>
  );
}

export default Pricing;