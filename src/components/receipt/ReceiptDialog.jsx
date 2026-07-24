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

function ReceiptDialog({
  open,
  handleClose,
  order,
}) {
  // Always get the latest version of the order
  const latestOrder = useSelector((state) =>
    state.orders.orders.find((o) => o.id === order?.id)
  );

  const receiptNumber = useMemo(() => {
    if (!latestOrder) return "";
    return (
      latestOrder.receiptNo ||
      generateReceiptNumber(latestOrder.id)
    );
  }, [latestOrder]);

  if (!latestOrder) return null;

  const handlePrint = () => {
    const receipt = document.getElementById(
      "receipt-content"
    );

    if (!receipt) return;

    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${receiptNumber}</title>

        <style>
          body{
            font-family: Arial, Helvetica, sans-serif;
            background:#ffffff;
            color:#000;
            padding:30px;
          }

          #receipt-content{
            max-width:800px;
            margin:auto;
          }

          table{
            width:100%;
            border-collapse:collapse;
            margin-top:10px;
          }

          th{
            background:#f4f4f4;
          }

          th,td{
            border:1px solid #ddd;
            padding:8px;
            text-align:left;
          }

          hr{
            margin:18px 0;
          }

          h1,h2,h3,h4,h5{
            margin:5px 0;
          }

          @media print{
            body{
              padding:0;
            }

            button{
              display:none;
            }
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      {/* Header */}

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

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Receipt No: {receiptNumber}
          </Typography>
        </Box>

        <Button
          color="inherit"
          onClick={handleClose}
          sx={{
            minWidth: "40px",
            p: 1,
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      {/* Preview */}

      <DialogContent dividers>
        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
        >
          Preview the receipt before printing or
          downloading it as a PDF.
        </Typography>

        <ReceiptContent order={latestOrder} />
      </DialogContent>

      {/* Footer Buttons */}

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
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            startIcon={<PictureAsPdfIcon />}
            onClick={() =>
              generateReceiptPDF(latestOrder)
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