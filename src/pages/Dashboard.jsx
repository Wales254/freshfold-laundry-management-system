import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
} from "@mui/material";

import DashboardCards from "../components/dashboard/DashboardCards";
import StatusChart from "../components/dashboard/StatusChart";
import RevenueChart from "../components/dashboard/RevenueChart";
import ServiceChart from "../components/dashboard/ServiceChart";
import NotificationCenter from "../components/dashboard/NotificationCenter";
import TopCustomers from "../components/dashboard/TopCustomers";
import UpcomingDeliveries from "../components/dashboard/UpcomingDeliveries";
import RecentOrders from "../components/dashboard/RecentOrders";

function Dashboard() {
  const currentHour = new Date().getHours();

  let greeting = "Good Evening";

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 17) {
    greeting = "Good Afternoon";
  }

  const formattedDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1600,
        mx: "auto",
        minWidth: 0,
      }}
    >
      {/* Welcome Header */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 2.5, sm: 3.5, md: 4 },
          mb: { xs: 3, md: 4 },
          borderRadius: { xs: 3, md: 4 },
          background:
            "linear-gradient(120deg, #123f78 0%, #1976d2 58%, #42a5f5 100%)",
          color: "#ffffff",
          boxShadow: "0 10px 30px rgba(25, 118, 210, 0.15)",
          "&::after": {
            content: '""',
            position: "absolute",
            width: { xs: 130, md: 220 },
            height: { xs: 130, md: 220 },
            borderRadius: "50%",
            border: "35px solid rgba(255,255,255,0.07)",
            right: { xs: -65, md: -55 },
            top: { xs: -60, md: -90 },
            pointerEvents: "none",
          },
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography
              variant="overline"
              sx={{
                letterSpacing: 1.5,
                fontWeight: 700,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              FRESHFOLD WORKSPACE
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 0.5,
                fontWeight: 800,
                fontSize: {
                  xs: "1.7rem",
                  sm: "2rem",
                  md: "2.35rem",
                },
                lineHeight: 1.2,
                letterSpacing: "-0.7px",
              }}
            >
              {greeting} 👋
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                fontWeight: 500,
                color: "rgba(255,255,255,0.95)",
              }}
            >
              Welcome back to FreshFold Laundry Management.
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                maxWidth: 600,
                fontSize: { xs: "0.85rem", md: "0.95rem" },
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Track orders, manage customers, monitor payments,
              and keep daily operations running smoothly.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "flex-start",
                  md: "flex-end",
                },
                mt: { xs: 1, md: 0 },
              }}
            >
              <Chip
                label={formattedDate}
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  py: 1,
                  px: 0.5,
                  border: "1px solid rgba(255,255,255,0.25)",
                  bgcolor: "rgba(255,255,255,0.13)",
                  color: "#ffffff",
                  fontWeight: 600,
                  "& .MuiChip-label": {
                    whiteSpace: "normal",
                    textAlign: "center",
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Box sx={{ mb: { xs: 3, md: 4 }, minWidth: 0 }}>
        <DashboardCards />
      </Box>

      {/* Analytics and Activity */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, lg: 6 }} sx={{ minWidth: 0 }}>
          <StatusChart />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }} sx={{ minWidth: 0 }}>
          <RevenueChart />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }} sx={{ minWidth: 0 }}>
          <ServiceChart />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }} sx={{ minWidth: 0 }}>
          <NotificationCenter />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0 }}>
          <TopCustomers />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0 }}>
          <UpcomingDeliveries />
        </Grid>

        {/* Recent Orders */}
        <Grid size={{ xs: 12 }} sx={{ minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: { xs: 2.5, md: 3 },
              border: "1px solid #e8edf4",
              boxShadow: "0 4px 18px rgba(30, 55, 90, 0.04)",
              overflow: "hidden",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                flexWrap: "wrap",
                mb: 2.5,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.05rem", sm: "1.2rem" },
                    color: "#243247",
                  }}
                >
                  Recent Orders
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, color: "#7a8799" }}
                >
                  Latest laundry activity
                </Typography>
              </Box>
            </Box>

            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <RecentOrders />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;