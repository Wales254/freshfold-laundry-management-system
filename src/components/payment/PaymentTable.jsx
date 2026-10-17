
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
  Typography,
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import ReceiptDialog from "../receipt/ReceiptDialog";

const formatAmount = (amount) =>
  `KES ${Number(amount || 0).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatPaymentDate = (value) => {
  if (!value) return "-";

  // Preserve date-only values without timezone conversion.
  const dateOnly = String(value).match(/^\d{4}-\d{2}-\d{2}$/);

  if (dateOnly) {
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(date);
};

function PaymentTable({ search, statusFilter, methodFilter }) {
  const orders = useSelector((state) => state.orders.orders);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const term = (search || "").trim().toLowerCase();

  const getPaymentStatus = (order) => {
    const status = String(order.paymentStatus || "")
      .trim()
      .toLowerCase();

    if (
      !status ||
      status === "pending" ||
      status === "unpaid"
    ) {
      return "Unpaid";
    }

    if (
      status === "partial" ||
      status === "partial payment" ||
      status === "partially paid"
    ) {
      return "Partial";
    }

    if (status === "paid") {
      return "Paid";
    }

    return order.paymentStatus;
  };

  // Flatten the orders into individual installment rows.
  const paymentRows = orders.flatMap((order) => {
    const payments = Array.isArray(order.payments)
      ? order.payments
      : [];

    // Keep unpaid orders visible when no installment exists.
    if (payments.length === 0) {
      return [{
        rowId: `order-${order.id}-unpaid`,
        order,
        payment: null,
      }];
    }

    return payments.map((payment, index) => ({
      rowId: `order-${order.id}-payment-${payment.id ?? index}`,
      order,
      payment,
    }));
  });

  const filteredRows = paymentRows.filter(({ order, payment }) => {
    const paymentStatus = getPaymentStatus(order);
    const paymentMethod =
      payment?.method || order.paymentMethod || "";
    const transactionCode =
      payment?.transactionCode ||
      payment?.transactionReference ||
      "";
    const paymentDate =
      payment?.date ||
      payment?.paymentDate ||
      payment?.createdAt ||
      "";

    const matchesSearch =
      !term ||
      String(order.id).toLowerCase().includes(term) ||
      String(order.customer || "").toLowerCase().includes(term) ||
      String(order.phone || "").toLowerCase().includes(term) ||
      String(paymentMethod).toLowerCase().includes(term) ||
      String(transactionCode).toLowerCase().includes(term) ||
      String(paymentDate).toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" ||
      paymentStatus === statusFilter;

    const matchesMethod =
      methodFilter === "All" ||
      paymentMethod === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <>
      <Paper elevation={3} sx={{ width: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 1150 }}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Order #</strong></TableCell>
              <TableCell><strong>Customer</strong></TableCell>
              <TableCell><strong>Method</strong></TableCell>
              <TableCell align="right"><strong>Installment</strong></TableCell>
              <TableCell align="right"><strong>Order Total</strong></TableCell>
              <TableCell align="right"><strong>Total Paid</strong></TableCell>
              <TableCell align="right"><strong>Balance</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Transaction Code</strong></TableCell>
              <TableCell><strong>Payment Date</strong></TableCell>
              <TableCell align="center"><strong>Receipt</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map(({ rowId, order, payment }) => {
                const paymentStatus = getPaymentStatus(order);

                const method =
                  payment?.method ||
                  order.paymentMethod ||
                  "-";

                const transactionCode =
                  payment?.transactionCode ||
                  payment?.transactionReference ||
                  "-";

                const paymentDate =
                  payment?.date ||
                  payment?.paymentDate ||
                  payment?.createdAt ||
                  (!payment ? order.paymentDate : null);

                return (
                  <TableRow key={rowId} hover>
                    <TableCell>#{order.id}</TableCell>

                    <TableCell>
                      {order.customer || "-"}
                    </TableCell>

                    <TableCell>{method}</TableCell>

                    <TableCell align="right">
                      {payment
                        ? formatAmount(payment.amount)
                        : "-"}
                    </TableCell>

                    <TableCell align="right">
                      {formatAmount(order.total)}
                    </TableCell>

                    <TableCell align="right">
                      {formatAmount(order.amountPaid)}
                    </TableCell>

                    <TableCell align="right">
                      {formatAmount(order.balance)}
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

                    <TableCell
                      sx={{
                        maxWidth: 180,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {transactionCode}
                    </TableCell>

                    <TableCell>
                      {formatPaymentDate(paymentDate)}
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
                <TableCell colSpan={11} align="center">
                  <Typography sx={{ py: 2 }}>
                    No payments found.
                  </Typography>
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
