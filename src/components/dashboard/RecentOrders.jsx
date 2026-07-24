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

const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    service: "Wash & Fold",
    status: "Washing",
    total: "$25",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    service: "Dry Cleaning",
    status: "Ready",
    total: "$40",
  },
  {
    id: "ORD-003",
    customer: "Michael Lee",
    service: "Ironing",
    status: "Pending",
    total: "$18",
  },
  {
    id: "ORD-004",
    customer: "Sarah Kim",
    service: "Wash",
    status: "Delivered",
    total: "$30",
  },
];

function statusColor(status) {
  switch (status) {
    case "Pending":
      return "warning";
    case "Washing":
      return "info";
    case "Ready":
      return "success";
    case "Delivered":
      return "secondary";
    default:
      return "default";
  }
}

function RecentOrders() {
  return (
    <>
      <Typography variant="h6" sx={{ mt: 5, mb: 2, fontWeight: "bold" }}>
        Recent Orders
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Order ID</strong></TableCell>
              <TableCell><strong>Customer</strong></TableCell>
              <TableCell><strong>Service</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Total</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.service}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={statusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">{order.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default RecentOrders;