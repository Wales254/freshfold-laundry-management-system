import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Grid,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import LoyaltyBadge from "./LoyaltyBadge";

function CustomerDetailsDialog({
  open,
  handleClose,
  customer,
}) {
  if (!customer) return null;

  const totalSpent = customer.orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const completedOrders = customer.orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const activeOrders = customer.orders.length - completedOrders;

  const averageOrder =
    customer.orders.length > 0
      ? Math.round(totalSpent / customer.orders.length)
      : 0;

  // Favorite Service
  const services = {};

  customer.orders.forEach((order) => {
    services[order.service] =
      (services[order.service] || 0) + 1;
  });

  const favoriteService =
    Object.keys(services).length > 0
      ? Object.keys(services).reduce((a, b) =>
          services[a] > services[b] ? a : b
        )
      : "-";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Customer Profile
      </DialogTitle>

      <DialogContent>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: 30,
              mb: 2,
            }}
          >
            {customer.name.charAt(0)}
          </Avatar>

          <Typography variant="h5">
            {customer.name}
          </Typography>

          <Typography color="text.secondary">
            {customer.phone}
          </Typography>

          <Box mt={2}>
            <LoyaltyBadge spent={totalSpent} />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>

          <Grid size={{ xs: 6, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Typography>Total Orders</Typography>
              <Typography variant="h5">
                {customer.orders.length}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Typography>Completed</Typography>
              <Typography variant="h5">
                {completedOrders}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Typography>Active</Typography>
              <Typography variant="h5">
                {activeOrders}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Typography>Total Spent</Typography>
              <Typography variant="h6">
                KES {totalSpent}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Typography>Average Order</Typography>
              <Typography variant="h6">
                KES {averageOrder}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Typography>Favorite Service</Typography>
              <Typography variant="h6">
                {favoriteService}
              </Typography>
            </Paper>
          </Grid>

        </Grid>

        <Typography
          variant="h6"
          sx={{ mt: 4, mb: 2 }}
        >
          Order History
        </Typography>

        <Table>

          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Delivery Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {customer.orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>

                <TableCell>{order.service}</TableCell>

                <TableCell>
                  <Chip
                    label={order.status}
                    color={
                      order.status === "Delivered"
                        ? "success"
                        : "warning"
                    }
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  KES {order.total}
                </TableCell>

                <TableCell>
                  {order.deliveryDate}
                </TableCell>
              </TableRow>
            ))}

          </TableBody>

        </Table>

      </DialogContent>

      <DialogActions>
        <Button variant="outlined">
          Print
        </Button>

        <Button variant="outlined">
          Export PDF
        </Button>

        <Button
          variant="contained"
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomerDetailsDialog;