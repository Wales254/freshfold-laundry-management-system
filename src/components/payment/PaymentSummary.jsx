import { useSelector } from "react-redux";

import {
  Grid,
  Paper,
  Typography,
} from "@mui/material";

function PaymentSummary() {
  const orders = useSelector(
    (state) => state.orders.orders
  );

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const totalPaid = orders.reduce(
    (sum, order) => sum + Number(order.amountPaid),
    0
  );

  const totalBalance = orders.reduce(
    (sum, order) => sum + Number(order.balance),
    0
  );

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "Paid"
  ).length;

  const partialOrders = orders.filter(
    (order) => order.paymentStatus === "Partial"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.paymentStatus === "Pending"
  ).length;

  const cards = [
    {
      title: "Total Revenue",
      value: `KES ${totalRevenue.toLocaleString()}`,
      color: "#1976d2",
    },
    {
      title: "Amount Paid",
      value: `KES ${totalPaid.toLocaleString()}`,
      color: "#2e7d32",
    },
    {
      title: "Outstanding Balance",
      value: `KES ${totalBalance.toLocaleString()}`,
      color: "#ed6c02",
    },
    {
      title: "Paid Orders",
      value: paidOrders,
      color: "#2e7d32",
    },
    {
      title: "Partial Payments",
      value: partialOrders,
      color: "#ed6c02",
    },
    {
      title: "Pending Payments",
      value: pendingOrders,
      color: "#d32f2f",
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{ xs: 12, sm: 6, md: 4 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderLeft: `6px solid ${card.color}`,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {card.title}
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mt: 1 }}
            >
              {card.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default PaymentSummary;