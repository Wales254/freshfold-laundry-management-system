
import {
  Box,
  Divider,
  Typography,
  Stack,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";

import { QRCodeSVG } from "qrcode.react";

import {
  generateReceiptNumber,
  formatCurrency,
  formatDateTime,
} from "../../utils/receiptUtils";

import "./Receipt.css";

const formatReceiptDate = (value) => {
  if (!value) return "N/A";

  try {
    return formatDateTime(value);
  } catch {
    return String(value);
  }
};

const toAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

function ReceiptContent({ order, payments = [], staffName }) {
  if (!order) return null;

  const receiptNumber =
    order.receiptNo || generateReceiptNumber(order.id);

  const allPayments = Array.isArray(payments) ? payments : [];

  // Use the recorded installments when available.
  // Otherwise, fall back to the order's recorded amountPaid.
  const totalPaid =
    allPayments.length > 0
      ? allPayments.reduce(
          (sum, payment) => sum + toAmount(payment.amount),
          0
        )
      : toAmount(order.amountPaid);

  const orderTotal = Math.max(0, toAmount(order.total));

  // Always calculate the receipt balance from the order total
  // and payments, rather than trusting a possibly stale order.balance.
  const balance = Math.max(0, orderTotal - totalPaid);

  // Calculate payment status using the same figures shown on the receipt.
  const paymentStatus =
    balance <= 0
      ? "Paid"
      : totalPaid > 0
        ? "Partial"
        : "Unpaid";

  const services =
    Array.isArray(order.services) && order.services.length
      ? order.services
      : [order];

  const sortedPayments = [...allPayments].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt || 0).getTime();
    const dateB = new Date(b.date || b.createdAt || 0).getTime();

    if (dateA !== dateB) return dateA - dateB;

    return toAmount(a.id) - toAmount(b.id);
  });

  const latestPayment =
    sortedPayments.length > 0
      ? sortedPayments[sortedPayments.length - 1]
      : null;

  return (
    <Box
      id="receipt-content"
      sx={{
        width: "100%",
        maxWidth: 800,
        bgcolor: "#fff",
        color: "#222",
        p: { xs: 2, sm: 4 },
        fontFamily: "Roboto, Arial, sans-serif",
        mx: "auto",
        boxSizing: "border-box",
        "& .receipt-label": {
          color: "#666",
          fontSize: "0.8rem",
          mb: 0.3,
        },
        "& .receipt-value": {
          fontWeight: 600,
          overflowWrap: "anywhere",
        },
      }}
    >
      {/* BUSINESS HEADER */}
      <Box textAlign="center" mb={3}>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{ color: "#1976d2", mb: 0.5 }}
        >
          FreshFold Laundry
        </Typography>

        <Typography variant="body2">
          Professional Laundry &amp; Dry Cleaning Services
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Nairobi, Kenya
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Tel: +254 700 000 000
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Email: info@freshfold.co.ke
        </Typography>

        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mt: 2, letterSpacing: 1 }}
        >
          PAYMENT RECEIPT
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* RECEIPT AND ORDER INFORMATION */}
      <Typography fontWeight={700} gutterBottom>
        Receipt Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography className="receipt-label">
            Receipt Number
          </Typography>
          <Typography className="receipt-value">
            {receiptNumber}
          </Typography>

          <Typography className="receipt-label" sx={{ mt: 1 }}>
            Order Number
          </Typography>
          <Typography className="receipt-value">
            #{order.id}
          </Typography>

          <Typography className="receipt-label" sx={{ mt: 1 }}>
            Order Status
          </Typography>
          <Typography className="receipt-value">
            {order.status || "N/A"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography className="receipt-label">
            Receipt Date
          </Typography>
          <Typography className="receipt-value">
            {formatReceiptDate(
              latestPayment?.date ||
                latestPayment?.createdAt ||
                new Date()
            )}
          </Typography>

          <Typography className="receipt-label" sx={{ mt: 1 }}>
            Delivery Date
          </Typography>
          <Typography className="receipt-value">
            {order.deliveryDate || "N/A"}
          </Typography>

          <Typography className="receipt-label" sx={{ mt: 1 }}>
            Attended By
          </Typography>
          <Typography className="receipt-value">
            {staffName || "Staff name unavailable"}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* CUSTOMER INFORMATION */}
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Customer Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography className="receipt-label">
            Customer Name
          </Typography>
          <Typography className="receipt-value">
            {order.customer || "N/A"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography className="receipt-label">
            Phone Number
          </Typography>
          <Typography className="receipt-value">
            {order.phone || "N/A"}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* ORDER DETAILS */}
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Order Details
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label="Order services">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f2f5f9" }}>
              <TableCell>
                <strong>Service</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Qty</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Unit Price</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Total</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {services.map((item, index) => {
              const quantity = toAmount(item.quantity);
              const itemTotal = toAmount(item.total);
              const unitPrice =
                quantity > 0 ? itemTotal / quantity : itemTotal;

              return (
                <TableRow key={item.id || index}>
                  <TableCell>{item.service || "Service"}</TableCell>
                  <TableCell align="center">
                    {quantity || "—"}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(unitPrice)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(itemTotal)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 3 }} />

      {/* INSTALLMENT HISTORY */}
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Payment History
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={1.5}>
        Each row represents an individual payment recorded for this order.
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label="Installment payment history">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f2f5f9" }}>
              <TableCell>
                <strong>#</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Method</strong>
              </TableCell>
              <TableCell>
                <strong>Transaction Code</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Amount</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedPayments.length > 0 ? (
              sortedPayments.map((item, index) => (
                <TableRow key={item.id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {formatReceiptDate(item.date || item.createdAt)}
                  </TableCell>
                  <TableCell>{item.method || "N/A"}</TableCell>
                  <TableCell sx={{ overflowWrap: "anywhere" }}>
                    {item.method &&
                    item.method.toLowerCase() !== "cash"
                      ? item.transactionCode ||
                        item.transactionReference ||
                        item.transaction_reference ||
                        "Not recorded"
                      : "—"}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(toAmount(item.amount))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No individual payment records are available for this order.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAYMENT SUMMARY */}
      <Box
        sx={{
          mt: 2,
          ml: "auto",
          maxWidth: 360,
          p: 2,
          border: "1px solid #ddd",
          borderRadius: 1,
        }}
      >
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Typography>Total Order Cost</Typography>
            <Typography fontWeight={600}>
              {formatCurrency(orderTotal)}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Typography>Total Paid</Typography>
            <Typography fontWeight={700} color="success.main">
              {formatCurrency(totalPaid)}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Typography>Outstanding Balance</Typography>
            <Typography
              fontWeight={700}
              color={balance > 0 ? "error.main" : "success.main"}
            >
              {formatCurrency(balance)}
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Typography fontWeight={700}>Payment Status</Typography>
            <Typography
              fontWeight={700}
              color={
                paymentStatus === "Paid"
                  ? "success.main"
                  : paymentStatus === "Partial"
                    ? "warning.main"
                    : "error.main"
              }
            >
              {paymentStatus}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* QR CODE */}
      <Box textAlign="center">
        <QRCodeSVG
          size={110}
          value={`https://freshfold.co.ke/verify?receipt=${encodeURIComponent(
            receiptNumber
          )}&order=${encodeURIComponent(order.id)}`}
        />

        <Typography variant="caption" display="block" mt={1}>
          Scan to verify receipt
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* TERMS */}
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        Terms &amp; Conditions
      </Typography>

      <Stack spacing={0.75}>
        <Typography variant="body2">
          • Please present this receipt when collecting your garments.
        </Typography>
        <Typography variant="body2">
          • Customers should inspect garments before leaving.
        </Typography>
        <Typography variant="body2">
          • Items not collected within 30 days may attract storage charges.
        </Typography>
        <Typography variant="body2">
          • FreshFold is not responsible for damage caused by incorrect care labels.
        </Typography>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* SIGNATURES */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mt: 4, borderTop: "1px solid #777", pt: 1 }}>
            <Typography variant="body2">
              Customer Signature
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ mt: 4, borderTop: "1px solid #777", pt: 1 }}>
            <Typography variant="body2">
              Attended By: {staffName || "Staff name unavailable"}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* FOOTER */}
      <Box textAlign="center" mt={4}>
        <Typography fontWeight={700}>
          Thank you for choosing FreshFold Laundry
        </Typography>

        <Typography color="primary.main">
          Building trust, one clean garment at a time.
        </Typography>

        <Typography variant="body2" mt={1}>
          Please retain this receipt for garment collection.
        </Typography>
      </Box>
    </Box>
  );
}

export default ReceiptContent;
