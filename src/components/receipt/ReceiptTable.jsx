import { useState } from "react";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import ReceiptDialog from "./ReceiptDialog";
import generateReceiptPDF from "./ReceiptPDF";
import { generateReceiptNumber } from "../../utils/receiptUtils";

function ReceiptTable({ orders }) {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openReceipt, setOpenReceipt] = useState(false);

  const handleView = (order) => {
    setSelectedOrder(order);
    setOpenReceipt(true);
  };

  const handleClose = () => {
    setOpenReceipt(false);
    setSelectedOrder(null);
  };

  const handlePrint = (order) => {
    setSelectedOrder(order);

    setTimeout(() => {
      window.print();
    }, 300);
  };

  const filteredOrders = orders.filter((order) => {
    const term = search.toLowerCase();

    return (
      generateReceiptNumber(order.id)
        .toLowerCase()
        .includes(term) ||
      order.customer.toLowerCase().includes(term) ||
      order.phone.includes(term)
    );
  });

  return (
    <>
      <Stack
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Receipt History
        </Typography>

        <TextField
          label="Search by Receipt No, Customer or Phone"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          fullWidth
        />
      </Stack>

      <TableContainer
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Receipt No
              </TableCell>

              <TableCell>
                Customer
              </TableCell>

              <TableCell>
                Phone
              </TableCell>

              <TableCell>
                Total
              </TableCell>

              <TableCell>
                Payment
              </TableCell>

              <TableCell>
                Date
              </TableCell>

              <TableCell align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                >
                  No receipts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map(
                (order) => (
                  <TableRow
                    key={order.id}
                    hover
                  >
                    <TableCell>
                      {generateReceiptNumber(
                        order.id
                      )}
                    </TableCell>

                    <TableCell>
                      {order.customer}
                    </TableCell>

                    <TableCell>
                      {order.phone}
                    </TableCell>

                    <TableCell>
                      KES {order.total}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          order.paymentStatus
                        }
                        color={
                          order.paymentStatus ===
                          "Paid"
                            ? "success"
                            : order.paymentStatus ===
                              "Partial"
                            ? "warning"
                            : "error"
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      {order.paymentDate ||
                        "-"}
                    </TableCell>

                    <TableCell
                      align="center"
                    >
                      <IconButton
                        color="primary"
                        onClick={() =>
                          handleView(
                            order
                          )
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>

                      <IconButton
                        color="success"
                        onClick={() =>
                          handlePrint(
                            order
                          )
                        }
                      >
                        <PrintIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() =>
                          generateReceiptPDF(
                            order
                          )
                        }
                      >
                        <PictureAsPdfIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ReceiptDialog
        open={openReceipt}
        handleClose={handleClose}
        order={selectedOrder}
      />
    </>
  );
}

export default ReceiptTable;