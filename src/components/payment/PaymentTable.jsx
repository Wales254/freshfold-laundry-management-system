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

function PaymentTable({
  search,
  statusFilter,
  methodFilter,
}) {
  const orders = useSelector(
    (state) => state.orders.orders
  );

  // ==========================
  // Search
  // ==========================

  let filteredOrders = orders.filter((order) => {
    const latestPayment =
      order.payments?.[order.payments.length - 1];

    const transactionCode =
      latestPayment?.transactionCode || "";

    const term = search.toLowerCase();

    return (
      order.customer.toLowerCase().includes(term) ||
      order.phone.toLowerCase().includes(term) ||
      order.id.toString().includes(term) ||
      transactionCode.toLowerCase().includes(term)
    );
  });

  // ==========================
  // Status Filter
  // ==========================

  if (statusFilter !== "All") {
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.paymentStatus === statusFilter
    );
  }

  // ==========================
  // Payment Method Filter
  // ==========================

  if (methodFilter !== "All") {
    filteredOrders = filteredOrders.filter((order) => {
      const latestPayment =
        order.payments?.[order.payments.length - 1];

      return (
        latestPayment?.method === methodFilter
      );
    });
  }

  return (
    <Paper elevation={3}>
      <Table>

        <TableHead>
          <TableRow>

            <TableCell>
              <strong>Order #</strong>
            </TableCell>

            <TableCell>
              <strong>Customer</strong>
            </TableCell>

            <TableCell>
              <strong>Method</strong>
            </TableCell>

            <TableCell align="right">
              <strong>Total</strong>
            </TableCell>

            <TableCell align="right">
              <strong>Paid</strong>
            </TableCell>

            <TableCell align="right">
              <strong>Balance</strong>
            </TableCell>

            <TableCell>
              <strong>Status</strong>
            </TableCell>

            <TableCell>
              <strong>Transaction</strong>
            </TableCell>

            <TableCell>
              <strong>Date</strong>
            </TableCell>

            <TableCell align="center">
              <strong>Receipt</strong>
            </TableCell>

          </TableRow>
        </TableHead>

        <TableBody>

          {filteredOrders.length > 0 ? (

            filteredOrders.map((order) => {

              const latestPayment =
                order.payments?.[
                  order.payments.length - 1
                ];

              return (

                <TableRow
                  key={order.id}
                  hover
                >

                  <TableCell>
                    #{order.id}
                  </TableCell>

                  <TableCell>
                    {order.customer}
                  </TableCell>

                  <TableCell>
                    {latestPayment?.method || "-"}
                  </TableCell>

                  <TableCell align="right">
                    KES {order.total}
                  </TableCell>

                  <TableCell align="right">
                    KES {order.amountPaid}
                  </TableCell>

                  <TableCell align="right">
                    KES {order.balance}
                  </TableCell>

                  <TableCell>

                    <Chip
                      label={order.paymentStatus}
                      size="small"
                      color={
                        order.paymentStatus === "Paid"
                          ? "success"
                          : order.paymentStatus ===
                            "Partial"
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

                      <IconButton color="primary">

                        <ReceiptLongIcon />

                      </IconButton>

                    </Tooltip>

                  </TableCell>

                </TableRow>

              );
            })

          ) : (

            <TableRow>

              <TableCell
                colSpan={10}
                align="center"
              >
                No payments found.
              </TableCell>

            </TableRow>

          )}

        </TableBody>

      </Table>
    </Paper>
  );
}

export default PaymentTable;