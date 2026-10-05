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
} from "@mui/material";

import { QRCodeSVG } from "qrcode.react";

import {
  generateReceiptNumber,
  formatCurrency,
  formatDateTime,
} from "../../utils/receiptUtils";

import "./Receipt.css";

function ReceiptContent({
  order,
  payment,
}) {
  if (!order) return null;

  const receiptNumber =
    order.receiptNo ||
    generateReceiptNumber(order.id);

  return (
    <Box
      id="receipt-content"
      sx={{
        width: "100%",
        maxWidth: 800,
        bgcolor: "background.paper",
        color: "text.primary",
        p: 4,
        fontFamily: "Roboto, sans-serif",
        mx: "auto",
      }}
    >
      {/* ================= HEADER ================= */}

      <Box
        className="receipt-header"
        textAlign="center"
        mb={2}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          className="receipt-title"
        >
          FreshFold Laundry
        </Typography>

        <Typography>
          Professional Laundry & Dry Cleaning Services
        </Typography>

        <Typography className="receipt-subtitle">
          Nairobi, Kenya
        </Typography>

        <Typography className="receipt-subtitle">
          Tel: +254 700 000 000
        </Typography>

        <Typography className="receipt-subtitle">
          Email: info@freshfold.co.ke
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* ================= RECEIPT DETAILS ================= */}

      <Typography
        fontWeight="bold"
        gutterBottom
      >
        Receipt Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>
            <strong>Receipt No:</strong>{" "}
            {receiptNumber}
          </Typography>

          <Typography>
            <strong>Order No:</strong> #{order.id}
          </Typography>

          <Typography>
            <strong>Date:</strong>{" "}
            {formatDateTime(
              payment?.date || new Date()
            )}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>
            <strong>Status:</strong>{" "}
            {order.status}
          </Typography>

          <Typography>
            <strong>Delivery Date:</strong>{" "}
            {order.deliveryDate}
          </Typography>

          <Typography>
            <strong>Attendant:</strong>{" "}
            {order.attendant || "Front Desk"}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* ================= CUSTOMER ================= */}

      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
      >
        Customer Information
      </Typography>

      <Stack spacing={1}>
        <Typography>
          <strong>Name:</strong>{" "}
          {order.customer}
        </Typography>

        <Typography>
          <strong>Phone:</strong>{" "}
          {order.phone}
        </Typography>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* ================= ORDER ================= */}

      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
      >
        Order Details
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
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
          {(order.services || [order]).map(
            (item, index) => {
              const unitPrice =
                item.quantity > 0
                  ? item.total / item.quantity
                  : item.total;

              return (
                <TableRow key={index}>
                  <TableCell>
                    {item.service}
                  </TableCell>

                  <TableCell align="center">
                    {item.quantity}
                  </TableCell>

                  <TableCell align="right">
                    {formatCurrency(unitPrice)}
                  </TableCell>

                  <TableCell align="right">
                    {formatCurrency(item.total)}
                  </TableCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>

      <Divider sx={{ my: 3 }} />

      {/* ================= PAYMENT ================= */}

      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
      >
        Payment Information
      </Typography>

      <Stack spacing={1}>
        <Typography>
          <strong>Total Amount:</strong>{" "}
          {formatCurrency(order.total)}
        </Typography>

        <Typography color="primary.main">
          <strong>Amount Paid:</strong>{" "}
          {formatCurrency(order.amountPaid)}
        </Typography>

        <Typography
          color={
            order.balance === 0
              ? "success.main"
              : "error.main"
          }
        >
          <strong>Balance:</strong>{" "}
          {formatCurrency(order.balance)}
        </Typography>

        <Typography color="info.main">
          <strong>Change:</strong>{" "}
          {formatCurrency(order.change)}
        </Typography>

        <Typography
          color={
            order.paymentStatus === "Paid"
              ? "success.main"
              : order.paymentStatus ===
                "Partial"
              ? "warning.main"
              : "error.main"
          }
        >
          <strong>Payment Status:</strong>{" "}
          {order.paymentStatus}
        </Typography>

        <Typography>
          <strong>Payment Method:</strong>{" "}
          {payment?.method || "N/A"}
        </Typography>

        <Typography>
          <strong>Transaction Code:</strong>{" "}
          {payment?.transactionCode || "N/A"}
        </Typography>

        <Typography>
          <strong>Payment Date:</strong>{" "}
          {payment?.date || "N/A"}
        </Typography>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* ================= QR ================= */}

      <Box textAlign="center">
        <QRCodeSVG
          size={120}
          value={`https://freshfold.co.ke/verify?receipt=${receiptNumber}&order=${order.id}`}
        />

        <Typography
          variant="caption"
          display="block"
          mt={1}
        >
          Scan to verify receipt
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* ================= TERMS ================= */}

      <Typography
        variant="subtitle1"
        fontWeight="bold"
      >
        Terms & Conditions
      </Typography>

      <Typography variant="body2">
        • Please present this receipt when
        collecting your garments.
      </Typography>

      <Typography variant="body2">
        • Customers should inspect garments
        before leaving.
      </Typography>

      <Typography variant="body2">
        • Items not collected within 30 days
        may attract storage charges.
      </Typography>

      <Typography variant="body2">
        • FreshFold is not responsible for
        damage caused by incorrect care labels.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* ================= SIGNATURES ================= */}

      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Typography>
            __________________________
          </Typography>

          <Typography>
            Customer Signature
          </Typography>
        </Grid>

        <Grid item xs={6} textAlign="right">
          <Typography>
            __________________________
          </Typography>

          <Typography>
            Cashier Signature
          </Typography>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={4}>
        <Typography fontWeight="bold">
          Thank you for choosing FreshFold
          Laundry
        </Typography>

        <Typography color="primary">
          Building trust, one clean garment at
          a time.
        </Typography>

        <Typography
          variant="body2"
          mt={1}
        >
          Please retain this receipt for
          garment collection.
        </Typography>
      </Box>
    </Box>
  );
}

export default ReceiptContent;