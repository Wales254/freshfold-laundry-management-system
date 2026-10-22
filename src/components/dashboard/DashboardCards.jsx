import { Grid, Paper, Typography, Box, useTheme } from "@mui/material";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { useSelector } from "react-redux";

function DashboardCards() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const orders = useSelector((state) => state.orders.orders);

  const totalOrders = orders.length;

  const totalCustomers = new Set(
    orders.map((order) => order.phone).filter(Boolean)
  ).size;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.status !== "Delivered"
  ).length;

  const cards = [
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: <ShoppingBasketIcon />,
      color: "#1976d2",
      background: isDark ? "#17365c" : "#eaf3ff",
      trend: "+8%",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString(),
      icon: <PeopleIcon />,
      color: "#16835b",
      background: isDark ? "#153f30" : "#e8f7ef",
      trend: "+5%",
    },
    {
      title: "Total Revenue",
      value: `KES ${totalRevenue.toLocaleString("en-KE", {
        maximumFractionDigits: 2,
      })}`,
      icon: <AttachMoneyIcon />,
      color: "#c77708",
      background: isDark ? "#493519" : "#fff4df",
      trend: "+12%",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toLocaleString(),
      icon: <HourglassEmptyIcon />,
      color: "#a985e8",
      background: isDark ? "#34244e" : "#f2eaff",
      trend: "-2%",
    },
  ];

  return (
    <Grid container spacing={{ xs: 2, md: 2.5 }}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{ xs: 12, sm: 6, lg: 3 }}
          sx={{ minWidth: 0 }}
        >
          <Paper
            elevation={0}
            sx={{
              position: "relative",
              height: "100%",
              minWidth: 0,
              p: { xs: 2.25, sm: 2.5, md: 3 },
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              boxShadow: isDark
                ? "0 4px 18px rgba(0, 0, 0, 0.16)"
                : "0 4px 18px rgba(30, 55, 90, 0.04)",
              overflow: "hidden",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: isDark
                  ? "0 12px 28px rgba(0, 0, 0, 0.28)"
                  : "0 12px 28px rgba(30, 55, 90, 0.10)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    fontSize: { xs: "0.82rem", sm: "0.85rem" },
                    letterSpacing: "0.1px",
                  }}
                >
                  {card.title}
                </Typography>

                <Typography
                  component="div"
                  sx={{
                    mt: 1.5,
                    color: theme.palette.text.primary,
                    fontWeight: 800,
                    fontSize:
                      card.title === "Total Revenue"
                        ? {
                            xs: "1.35rem",
                            sm: "1.3rem",
                            md: "1.45rem",
                          }
                        : {
                            xs: "2rem",
                            sm: "2rem",
                            md: "2.15rem",
                          },
                    lineHeight: 1.2,
                    overflowWrap: "anywhere",
                  }}
                >
                  {card.value}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: { xs: 46, sm: 50 },
                  height: { xs: 46, sm: 50 },
                  flexShrink: 0,
                  borderRadius: 2.5,
                  bgcolor: card.background,
                  color: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "& svg": {
                    fontSize: { xs: 25, sm: 28 },
                  },
                }}
              >
                {card.icon}
              </Box>
            </Box>

            <Box
              sx={{
                mt: 2.5,
                pt: 1.75,
                borderTop: `1px solid ${theme.palette.divider}`,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 0.75,
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.25,
                  px: 0.8,
                  py: 0.35,
                  borderRadius: 1.5,
                  bgcolor: isDark ? "#153f30" : "#eaf7ef",
                  color: isDark ? "#81d9a8" : "#218653",
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 15 }} />

                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    lineHeight: 1.4,
                    color: "inherit",
                  }}
                >
                  {card.trend}
                </Typography>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.75rem",
                }}
              >
                this month
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default DashboardCards;