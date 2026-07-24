import { useState } from "react";
import { useSelector } from "react-redux";

import {
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
  const orders = useSelector((state) => state.orders.orders);

  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Group orders by customer
  const customers = Object.values(
    orders.reduce((acc, order) => {
      const key = order.phone;

      if (!acc[key]) {
        acc[key] = {
          name: order.customer,
          phone: order.phone,
          orders: [],
        };
      }

      acc[key].orders.push(order);

      return acc;
    }, {})
  );

  // Search customers
  const filteredCustomers = customers.filter((customer) => {
    const term = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(term) ||
      customer.phone.includes(term)
    );
  });

  // Pagination
  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  return (
    <>
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
            {paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((customer) => {
                const totalSpent = customer.orders.reduce(
                  (sum, order) => sum + Number(order.total),
                  0
                );

                const lastVisit = customer.orders.reduce(
                  (latest, order) =>
                    order.deliveryDate > latest
                      ? order.deliveryDate
                      : latest,
                  customer.orders[0].deliveryDate
                );

                return (
                  <TableRow key={customer.phone} hover>
                    <TableCell>{customer.name}</TableCell>

                    <TableCell>{customer.phone}</TableCell>

                    <TableCell>{customer.orders.length}</TableCell>

                    <TableCell>KES {totalSpent}</TableCell>

                    <TableCell>
                      <LoyaltyBadge spent={totalSpent} />
                    </TableCell>

                    <TableCell>{lastVisit}</TableCell>

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
                );
              })
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
          page={page}
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