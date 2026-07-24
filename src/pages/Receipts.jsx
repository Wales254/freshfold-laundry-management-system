import { Box, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";

import ReceiptTable from "../components/receipt/ReceiptTable";

function Receipts() {
  const orders = useSelector(
    (state) => state.orders.orders
  );

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        Receipt Management
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        View, print and download customer receipts.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <ReceiptTable orders={orders} />
      </Paper>
    </Box>
  );
}

export default Receipts;