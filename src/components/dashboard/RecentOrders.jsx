import { useSelector } from "react-redux";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
} from "@mui/material";

function statusColor(status) {
  switch (status) {
    case "Received":
      return "default";

    case "Washing":
      return "info";

    case "Drying":
      return "secondary";

    case "Ironing":
      return "warning";

    case "Ready":
      return "success";

    case "Delivered":
      return "primary";

    default:
      return "default";
  }
}

function RecentOrders() {
  const orders = useSelector(
    (state) => state.orders.orders
  );

  // Show the most recent orders first
  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);

      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          mt: 5,
          mb: 2,
          fontWeight: "bold",
        }}
      >
        Recent Orders
      </Typography>

      <TableContainer
        component={Paper}
        elevation={3}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Order ID</strong>
              </TableCell>

              <TableCell>
                <strong>Customer</strong>
              </TableCell>

              <TableCell>
                <strong>Service</strong>
              </TableCell>

              <TableCell>
                <strong>Status</strong>
              </TableCell>

              <TableCell align="right">
                <strong>Total</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {recentOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                >
                  <Typography
                    color="text.secondary"
                    sx={{ py: 3 }}
                  >
                    No orders available
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              recentOrders.map((order) => (
                <TableRow
                  key={order.id}
                  hover
                >
                  <TableCell>
                    {order.id}
                  </TableCell>

                  <TableCell>
                    {order.customer}
                  </TableCell>

                  <TableCell>
                    {order.service}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={order.status}
                      color={statusColor(
                        order.status
                      )}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="right">
                    KES{" "}
                    {Number(
                      order.total
                    ).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default RecentOrders;
