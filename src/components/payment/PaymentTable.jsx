
import { useState } from "react";
import { useSelector } from "react-redux";

import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import ReceiptDialog from "../receipt/ReceiptDialog";

function PaymentTable({ search, statusFilter, methodFilter }) {
  const orders = useSelector((state) => state.orders.orders);

  const [selectedOrder, setSelectedOrder] = useState(null);

  // Search orders
  const term = (search || "").toLowerCase();

  let filteredOrders = orders.filter((order) => {
    const latestPayment =
      order.payments?.[order.payments.length - 1];

    const transactionCode =
      latestPayment?.transactionCode || "";

    return (
      (order.customer || "").toLowerCase().includes(term) ||
      (order.phone || "").toLowerCase().includes(term) ||
      String(order.id).includes(term) ||
      transactionCode.toLowerCase().includes(term)
    );
  });

  // Normalize older payment statuses
  const getPaymentStatus = (order) => {
    const status = order.paymentStatus;

    if (!status || status === "Pending") {
      return "Unpaid";
    }

    if (
      status === "Partial Payment" ||
      status === "Partially Paid"
    ) {
      return "Partial";
    }

    return status;
  };

  // Filter by payment status
  if (statusFilter !== "All") {
    filteredOrders = filteredOrders.filter(
      (order) => getPaymentStatus(order) === statusFilter
    );
  }

  // Filter by payment method
  if (methodFilter !== "All") {
    filteredOrders = filteredOrders.filter((order) => {
      const latestPayment =
        order.payments?.[order.payments.length - 1];

      return latestPayment?.method === methodFilter;
    });
  }

  return (
    <>
      <Paper elevation={3} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Order #</strong></TableCell>
              <TableCell><strong>Customer</strong></TableCell>
              <TableCell><strong>Method</strong></TableCell>
              <TableCell align="right"><strong>Total</strong></TableCell>
              <TableCell align="right"><strong>Paid</strong></TableCell>
              <TableCell align="right"><strong>Balance</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Transaction</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell align="center"><strong>Receipt</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const latestPayment =
                  order.payments?.[order.payments.length - 1];

                const paymentStatus = getPaymentStatus(order);

                return (
                  <TableRow key={order.id} hover>
                    <TableCell>#{order.id}</TableCell>

                    <TableCell>{order.customer || "-"}</TableCell>

                    <TableCell>
                      {latestPayment?.method || "-"}
                    </TableCell>

                    <TableCell align="right">
                      KES {Number(order.total || 0).toLocaleString()}
                    </TableCell>

                    <TableCell align="right">
                      KES {Number(order.amountPaid || 0).toLocaleString()}
                    </TableCell>

                    <TableCell align="right">
                      KES {Number(order.balance || 0).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={paymentStatus}
                        size="small"
                        color={
                          paymentStatus === "Paid"
                            ? "success"
                            : paymentStatus === "Partial"
                            ? "warning"
                            : "error"
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {latestPayment?.transactionCode || "-"}
                    </TableCell>

                    <TableCell>
                      {latestPayment?.date || "-"}
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="View Receipt">
                        <IconButton
                          color="primary"
                          aria-label={`View receipt for order ${order.id}`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <ReceiptLongIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <ReceiptDialog
        open={Boolean(selectedOrder)}
        order={selectedOrder}
        handleClose={() => setSelectedOrder(null)}
      />
    </>
  );
}

export default PaymentTable;
