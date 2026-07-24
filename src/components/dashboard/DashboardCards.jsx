import { Grid, Paper, Typography, Box } from "@mui/material";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { useSelector } from "react-redux";

function DashboardCards() {
  const orders = useSelector((state) => state.orders.orders);

  const totalOrders = orders.length;

  const totalCustomers = new Set(
    orders.map((order) => order.phone)
  ).size;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.status !== "Delivered"
  ).length;

  const cards = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingBasketIcon sx={{ fontSize: 34 }} />,
      color: "#1976d2",
      trend: "+8%",
    },
    {
      title: "Customers",
      value: totalCustomers,
      icon: <PeopleIcon sx={{ fontSize: 34 }} />,
      color: "#2e7d32",
      trend: "+5%",
    },
    {
      title: "Revenue",
      value: `KES ${totalRevenue}`,
      icon: <AttachMoneyIcon sx={{ fontSize: 34 }} />,
      color: "#ed6c02",
      trend: "+12%",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: <HourglassEmptyIcon sx={{ fontSize: 34 }} />,
      color: "#9c27b0",
      trend: "-2%",
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{ xs: 12, sm: 6, lg: 3 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              borderLeft: `6px solid ${card.color}`,
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 18px 35px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {card.title}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ mt: 1 }}
                >
                  {card.value}
                </Typography>

                <Box
                  display="flex"
                  alignItems="center"
                  mt={1}
                >
                  <TrendingUpIcon
                    sx={{
                      fontSize: 18,
                      color: "success.main",
                      mr: 0.5,
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="success.main"
                  >
                    {card.trend} this month
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  bgcolor: `${card.color}15`,
                  color: card.color,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {card.icon}
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default DashboardCards;