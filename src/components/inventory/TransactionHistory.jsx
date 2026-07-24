import { useSelector } from "react-redux";

import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  TableContainer,
} from "@mui/material";

function TransactionHistory() {
  const transactions = useSelector(
    (state) => state.inventory.transactions
  );

  return (
    <Paper sx={{ mt: 4, p: 2 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 2 }}
      >
        Inventory Transaction History
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Date</strong>
              </TableCell>

              <TableCell>
                <strong>Item</strong>
              </TableCell>

              <TableCell>
                <strong>Transaction</strong>
              </TableCell>

              <TableCell>
                <strong>Quantity</strong>
              </TableCell>

              <TableCell>
                <strong>Performed By</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>

                  <TableCell>{transaction.itemName}</TableCell>

                  <TableCell>
                    <Chip
                      label={transaction.type}
                      color={
                        transaction.type === "Stock In"
                          ? "success"
                          : "warning"
                      }
                    />
                  </TableCell>

                  <TableCell>
                    {transaction.type === "Stock In"
                      ? "+"
                      : "-"}
                    {transaction.quantity}
                  </TableCell>

                  <TableCell>
                    {transaction.performedBy}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                >
                  No transactions recorded.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default TransactionHistory;