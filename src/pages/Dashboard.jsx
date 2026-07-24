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

  if (currentHour < 12) greeting = "Good Morning";
  else if (currentHour < 17) greeting = "Good Afternoon";

  return (
    <Box sx={{ p: 1 }}>
      {/* Dashboard Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "#fff",
        }}
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {greeting} 👋
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mt: 1,
                opacity: 0.9,
              }}
            >
              Welcome back to FreshFold Laundry
              Management System.
            </Typography>

            <Typography
              sx={{
                mt: 1,
                opacity: 0.8,
              }}
            >
              Monitor orders, customers, payments,
              inventory and revenue in real time.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                textAlign: {
                  xs: "left",
                  md: "right",
                },
                mt: {
                  xs: 3,
                  md: 0,
                },
              }}
            >
              <Chip
                label={new Date().toLocaleDateString(
                  "en-GB",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 15,
                  p: 2,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Box sx={{ mb: 4 }}>
        <DashboardCards />
      </Box>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <StatusChart />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <RevenueChart />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <ServiceChart />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <NotificationCenter />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TopCustomers />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <UpcomingDeliveries />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Recent Orders
            </Typography>

            <RecentOrders />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;