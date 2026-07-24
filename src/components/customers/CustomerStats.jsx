import { Grid, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";

function CustomerStats() {
  const orders = useSelector((state) => state.orders.orders);

  // Unique customers
  const customers = [
    ...new Map(
      orders.map((order) => [order.phone, order])
    ).values(),
  ];

  const totalCustomers = customers.length;

  const returningCustomers = customers.filter((customer) => {
    return (
      orders.filter((o) => o.phone === customer.phone).length > 1
    );
  }).length;

  const activeCustomers = orders.filter(
    (order) => order.status !== "Delivered"
  ).length;

  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const cards = [
    {
      title: "Total Customers",
      value: totalCustomers,
    },
    {
      title: "Active Orders",
      value: activeCustomers,
    },
    {
      title: "Returning Customers",
      value: returningCustomers,
    },
    {
      title: "Revenue",
      value: `KES ${revenue}`,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{ xs: 12, sm: 6, md: 3 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">
              {card.title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {card.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default CustomerStats;