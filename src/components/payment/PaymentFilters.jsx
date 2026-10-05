import {
  Box,
  Grid,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

function PaymentFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
}) {
  const handleReset = () => {
    setSearch("");
    setStatusFilter("All");
    setMethodFilter("All");
  };

  return (
    <Box
      sx={{
        mt: 4,
        mb: 3,
        pt: 1,
      }}
    >
      <Grid
        container
        spacing={2}
        alignItems="center"
      >
        {/* Search */}
        <Grid size={{ xs: 12, md: 5 }}>
          <TextField
            fullWidth
            size="small"
            label="Search Payments"
            placeholder="Customer, Phone, Transaction..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </Grid>

        {/* Status */}
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Partial">Partial</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </TextField>
        </Grid>

        {/* Method */}
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Method"
            value={methodFilter}
            onChange={(e) =>
              setMethodFilter(e.target.value)
            }
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="M-Pesa">M-Pesa</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Bank">Bank</MenuItem>
          </TextField>
        </Grid>

        {/* Reset */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FilterAltOffIcon />}
            onClick={handleReset}
            sx={{
              height: 40,
            }}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PaymentFilters;