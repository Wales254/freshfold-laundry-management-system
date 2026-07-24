import { Grid, Card, CardContent, Typography } from "@mui/material";
import {
  ShoppingBag,
  AttachMoney,
  People,
  CheckCircle,
} from "@mui/icons-material";

import { useSelector } from "react-redux";

function ReportCards() {
  const orders = useSelector((state) => state.orders.orders);

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const totalCustomers = new Set(
    orders.map((order) => order.phone)
  ).size;

  const completedOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const cards = [
    {
      title: "Orders",
      value: totalOrders,
      icon: <ShoppingBag fontSize="large" />,
      color: "#1976d2",
    },
    {
      title: "Revenue",
      value: `KES ${totalRevenue}`,
      icon: <AttachMoney fontSize="large" />,
      color: "#2e7d32",
    },
    {
      title: "Customers",
      value: totalCustomers,
      icon: <People fontSize="large" />,
      color: "#ed6c02",
    },
    {
      title: "Completed",
      value: completedOrders,
      icon: <CheckCircle fontSize="large" />,
      color: "#9c27b0",
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              transition: ".3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 8,
              },
            }}
          >
            <CardContent>
              <Typography color="text.secondary">
                {card.title}
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ my: 1 }}
              >
                {card.value}
              </Typography>

              <Typography sx={{ color: card.color }}>
                {card.icon}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ReportCards;