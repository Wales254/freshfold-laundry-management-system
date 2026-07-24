import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
  Stack,
  Chip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentsIcon from "@mui/icons-material/Payments";

import { deleteOrder } from "../../redux/orderSlice";

import EditOrderDialog from "./EditOrderDialog";
import StatusWorkflow from "./StatusWorkflow";
import ReceiptDialog from "../receipt/ReceiptDialog";
import PaymentDialog from "./PaymentDialog";

function OrderTable({
  search,
  statusFilter,
  serviceFilter,
  sortBy,
}) {
  const orders = useSelector((state) => state.orders.orders);

  const dispatch = useDispatch();

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [openReceipt, setOpenReceipt] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setOpenEdit(true);
  };

  const handleReceipt = (order) => {
    setSelectedOrder(order);
    setOpenReceipt(true);
  };

  const handlePayment = (order) => {
    setSelectedOrder(order);
    setOpenPayment(true);
  };

  // ============================
  // SEARCH
  // ============================

  let filteredOrders = orders.filter((order) => {
    const term = search.toLowerCase();

    return (
      order.customer.toLowerCase().includes(term) ||
      order.phone.toLowerCase().includes(term) ||
      order.service.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term) ||
      order.id.toString().includes(term)
    );
  });

  // ============================
  // STATUS FILTER
  // ============================

  if (statusFilter !== "All") {
    filteredOrders = filteredOrders.filter(
      (order) => order.status === statusFilter
    );
  }

  // ============================
  // SERVICE FILTER
  // ============================

  if (serviceFilter !== "All") {
    filteredOrders = filteredOrders.filter(
      (order) => order.service === serviceFilter
    );
  }

  // ============================
  // SORTING
  // ============================

  switch (sortBy) {
    case "Newest":
      filteredOrders.sort((a, b) => b.id - a.id);
      break;

    case "Oldest":
      filteredOrders.sort((a, b) => a.id - b.id);
      break;

    case "A-Z":
      filteredOrders.sort((a, b) =>
        a.customer.localeCompare(b.customer)
      );
      break;

    case "Z-A":
      filteredOrders.sort((a, b) =>
        b.customer.localeCompare(a.customer)
      );
      break;

    default:
      break;
  }

  // ============================
  // PAGINATION
  // ============================

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TableContainer component={Paper} elevation={3}>
        <Table>

          <TableHead>
            <TableRow>

              <TableCell>
                <strong>ID</strong>
              </TableCell>

              <TableCell>
                <strong>Customer</strong>
              </TableCell>

              <TableCell>
                <strong>Phone</strong>
              </TableCell>

              <TableCell>
                <strong>Service</strong>
              </TableCell>

              <TableCell>
                <strong>Quantity</strong>
              </TableCell>

              <TableCell>
                <strong>Status</strong>
              </TableCell>

              <TableCell>
                <strong>Total</strong>
              </TableCell>

              <TableCell>
                <strong>Payment</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>

            </TableRow>
          </TableHead>

          <TableBody>

            {paginatedOrders.length > 0 ? (

              paginatedOrders.map((order) => (

                <TableRow key={order.id} hover>

                  <TableCell>{order.id}</TableCell>

                  <TableCell>{order.customer}</TableCell>

                  <TableCell>{order.phone}</TableCell>

                  <TableCell>{order.service}</TableCell>

                  <TableCell>{order.quantity}</TableCell>

                  <TableCell>
                    <StatusWorkflow order={order} />
                  </TableCell>

                  <TableCell>
                    <strong>KES {order.total}</strong>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={order.paymentStatus}
                      size="small"
                      color={
                        order.paymentStatus === "Paid"
                          ? "success"
                          : order.paymentStatus === "Partial"
                          ? "warning"
                          : "error"
                      }
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                    >

                      <IconButton
                        color="success"
                        title="Receive Payment"
                        onClick={() => handlePayment(order)}
                        disabled={order.paymentStatus === "Paid"}
                      >
                        <PaymentsIcon />
                      </IconButton>

                      <IconButton
                        color="primary"
                        title="Edit Order"
                        onClick={() => handleEdit(order)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="secondary"
                        title="Receipt"
                        onClick={() => handleReceipt(order)}
                      >
                        <ReceiptLongIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        title="Delete Order"
                        onClick={() =>
                          dispatch(deleteOrder(order.id))
                        }
                      >
                        <DeleteIcon />
                      </IconButton>

                    </Stack>
                  </TableCell>

                </TableRow>

              ))

            ) : (

              <TableRow>
                <TableCell colSpan={9} align="center">
                  No orders found.
                </TableCell>
              </TableRow>

            )}

          </TableBody>

        </Table>

        <TablePagination
          component="div"
          count={filteredOrders.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          onPageChange={(event, newPage) =>
            setPage(newPage)
          }
          onRowsPerPageChange={(event) => {
            setRowsPerPage(
              parseInt(event.target.value, 10)
            );
            setPage(0);
          }}
        />

      </TableContainer>

      <PaymentDialog
        open={openPayment}
        handleClose={() => setOpenPayment(false)}
        order={selectedOrder}
      />

      <ReceiptDialog
        open={openReceipt}
        handleClose={() => setOpenReceipt(false)}
        order={selectedOrder}
      />

      <EditOrderDialog
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        order={selectedOrder}
      />
    </>
  );
}

export default OrderTable;