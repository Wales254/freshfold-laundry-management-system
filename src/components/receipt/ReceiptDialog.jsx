
import { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";

import ReceiptContent from "./ReceiptContent";
import generateReceiptPDF from "./ReceiptPDF";
import { generateReceiptNumber } from "../../utils/receiptUtils";

function ReceiptDialog({ open, handleClose, order }) {
  const latestOrder = useSelector((state) =>
    state.orders.orders.find(
      (item) => String(item.id) === String(order?.id)
    )
  );

  const currentUser = useSelector((state) => state.auth.user);

  const receiptOrder = latestOrder || order;

  const receiptNumber = useMemo(() => {
    if (!receiptOrder) return "";

    return (
      receiptOrder.receiptNo ||
      generateReceiptNumber(receiptOrder.id)
    );
  }, [receiptOrder]);

  const payments = Array.isArray(receiptOrder?.payments)
    ? [...receiptOrder.payments].sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || 0).getTime();
        const dateB = new Date(b.date || b.createdAt || 0).getTime();
        return dateA - dateB;
      })
    : [];

  const staffName =
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.email ||
    "Unknown staff member";

  const handlePrint = () => {
    const receipt = document.getElementById("receipt-content");
    if (!receipt) return;

    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

    if (!printWindow) {
      window.alert("Please allow pop-ups to print the receipt.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${receiptNumber}</title>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            background: #fff;
            color: #222;
            padding: 24px;
          }
          #receipt-content {
            max-width: 800px;
            margin: auto;
            background: #fff;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th {
            background: #f2f5f9;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          hr {
            margin: 18px 0;
          }
          h1, h2, h3, h4, h5 {
            margin: 5px 0;
          }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        ${receipt.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (!receiptOrder) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            FreshFold Laundry Receipt
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Receipt No: {receiptNumber}
          </Typography>
        </Box>

        <Button
          color="inherit"
          onClick={handleClose}
          sx={{ minWidth: 40, p: 1 }}
          aria-label="Close receipt"
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Review the order and all recorded installments before printing
          or downloading the receipt.
        </Typography>

        <ReceiptContent
          order={receiptOrder}
          payments={payments}
          staffName={staffName}
        />
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<PictureAsPdfIcon />}
            onClick={() =>
              generateReceiptPDF(receiptOrder, payments, staffName)
            }
          >
            Download PDF
          </Button>

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print Receipt
          </Button>
        </Box>

        <Button
          variant="text"
          color="inherit"
          startIcon={<CloseIcon />}
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReceiptDialog;
