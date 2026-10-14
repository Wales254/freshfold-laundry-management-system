import { useSelector } from "react-redux";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function ServiceChart() {
  const orders = useSelector((state) => state.orders.orders);

  const services = {};

  orders.forEach((order) => {
    const service = order.service || "Other";

    services[service] = (services[service] || 0) + 1;
  });

  const data = Object.entries(services)
    .map(([service, count]) => ({
      service,
      orders: count,
    }))
    .sort((a, b) => b.orders - a.orders);

  const totalServiceOrders = data.reduce(
    (sum, item) => sum + item.orders,
    0
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: 3,
        height: { xs: 380, sm: 400 },
        minWidth: 0,
        border: "1px solid #e8edf4",
        boxShadow: "0 4px 18px rgba(30, 55, 90, 0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 1,
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#243247",
              fontSize: { xs: "1rem", sm: "1.15rem" },
            }}
          >
            Most Popular Services
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              color: "#8994a7",
              fontSize: "0.8rem",
            }}
          >
            Orders grouped by laundry service
          </Typography>
        </Box>

        <Box
          sx={{
            px: 1.25,
            py: 0.75,
            borderRadius: 2,
            bgcolor: "#eef5ff",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              color: "#1976d2",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {totalServiceOrders} orders
          </Typography>
        </Box>
      </Box>

      {data.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
          }}
        >
          <Box>
            <Typography
              sx={{ fontWeight: 700, color: "#526078" }}
            >
              No service data available
            </Typography>

            <Typography
              variant="body2"
              sx={{ mt: 0.75, color: "#8994a7" }}
            >
              Service statistics will appear when orders are added.
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 8,
                right: 8,
                left: -18,
                bottom: 5,
              }}
              barCategoryGap="30%"
            >
              <CartesianGrid
                vertical={false}
                stroke="#edf1f6"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="service"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#758198",
                  fontSize: 11,
                }}
                interval={0}
                tickMargin={10}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#758198",
                  fontSize: 11,
                }}
                width={38}
              />

              <Tooltip
                cursor={{ fill: "#f3f7fc" }}
                formatter={(value) => [
                  `${value} ${value === 1 ? "order" : "orders"}`,
                  "Total",
                ]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e8edf4",
                  boxShadow: "0 6px 20px rgba(30, 55, 90, 0.08)",
                  fontSize: 13,
                }}
              />

              <Bar
                dataKey="orders"
                name="Orders"
                fill="#1976d2"
                maxBarSize={48}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}

export default ServiceChart;