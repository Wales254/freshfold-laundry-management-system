import { useState } from "react";

import {
  Box,
  Typography,
  Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import PaymentSummary from "../components/payment/PaymentSummary";
import PaymentFilters from "../components/payment/PaymentFilters";
import PaymentTable from "../components/payment/PaymentTable";
import AddPaymentDialog from "../components/payment/AddPaymentDialog";

function Payments() {
  const [openAdd, setOpenAdd] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
        >
          Payments
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
        >
          Record Payment
        </Button>
      </Box>

      {/* Payment Summary */}
      <PaymentSummary />

      {/* Filters */}
      <Box mt={4}>
        <PaymentFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          methodFilter={methodFilter}
          setMethodFilter={setMethodFilter}
        />
      </Box>

      {/* Payment Table */}
      <Box mt={4}>
        <PaymentTable
          search={search}
          statusFilter={statusFilter}
          methodFilter={methodFilter}
        />
      </Box>

      {/* Add Payment Dialog */}
      <AddPaymentDialog
        open={openAdd}
        handleClose={() => setOpenAdd(false)}
      />
    </Box>
  );
}

export default Payments;