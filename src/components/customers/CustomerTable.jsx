
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";

import {
  Alert,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  TablePagination,
} from "@mui/material";

import CustomerDetailsDialog from "./CustomerDetailsDialog";
import LoyaltyBadge from "./LoyaltyBadge";

function CustomerTable({ search = "" }) {
  const customers = useSelector(
    (state) => state.customers?.customers || []
  );

  const orders = useSelector(
    (state) => state.orders?.orders || []
  );

  const loading = useSelector(
    (state) => state.customers?.loading || false
  );

  const error = useSelector(
    (state) => state.customers?.error || null
  );

  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const customersWithStats = useMemo(() => {
    return customers.map((customer) => {
      const customerOrders = orders.filter((order) => {
        if (
          order.customer_id != null &&
          customer.id != null &&
          String(order.customer_id) === String(customer.id)
        ) {
          return true;
        }

        return (
          String(order.phone || "") === String(customer.phone || "") &&
          Boolean(customer.phone)
        );
      });

      const totalSpent = customerOrders.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0
      );

      const visitDates = customerOrders
        .map((order) => order.deliveryDate || order.delivery_date || order.created_at)
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a));

      return {
        ...customer,
        orders: customerOrders,
        totalSpent,
        lastVisit: visitDates[0] || "—",
      };
    });
  }, [customers, orders]);

  const term = search.trim().toLowerCase();

  const filteredCustomers = customersWithStats.filter((customer) => {
    return (
      String(customer.name || "").toLowerCase().includes(term) ||
      String(customer.phone || "").toLowerCase().includes(term) ||
      String(customer.email || "").toLowerCase().includes(term)
    );
  });

  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  const formatDate = (value) => {
    if (!value || value === "—") return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? "—"
      : date.toLocaleDateString();
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load customers: {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Customer</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Total Orders</strong></TableCell>
              <TableCell><strong>Total Spent</strong></TableCell>
              <TableCell><strong>Loyalty</strong></TableCell>
              <TableCell><strong>Last Visit</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.name || "—"}</TableCell>
                  <TableCell>{customer.phone || "—"}</TableCell>
                  <TableCell>{customer.orders.length}</TableCell>
                  <TableCell>
                    KES {customer.totalSpent.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <LoyaltyBadge spent={customer.totalSpent} />
                  </TableCell>
                  <TableCell>{formatDate(customer.lastVisit)}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleView(customer)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredCustomers.length}
          page={Math.min(
            page,
            Math.max(0, Math.ceil(filteredCustomers.length / rowsPerPage) - 1)
          )}
          rowsPerPage={rowsPerPage}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </TableContainer>

      <CustomerDetailsDialog
        open={open}
        handleClose={() => setOpen(false)}
        customer={selectedCustomer}
      />
    </>
  );
}

export default CustomerTable;
