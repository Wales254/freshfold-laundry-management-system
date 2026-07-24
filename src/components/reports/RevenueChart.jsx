import { useSelector } from "react-redux";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function RevenueChart() {
  const orders = useSelector((state) => state.orders.orders);

  const revenueData = orders.map((order) => ({
    date: order.deliveryDate,
    revenue: Number(order.total),
  }));

  const totalRevenue = revenueData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        height: "100%",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Revenue Trend
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Total Revenue
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              sx={{ mt: 1 }}
            >
              KES {totalRevenue.toLocaleString()}
            </Typography>
          </Box>

          <Box textAlign="right">
            <Chip
              icon={<TrendingUpIcon />}
              label="+12%"
              color="success"
            />

            <AttachMoneyIcon
              sx={{
                mt: 2,
                fontSize: 42,
                color: "#1976d2",
              }}
            />
          </Box>
        </Box>

        {/* Chart */}
        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#1976d2"
                  stopOpacity={0.7}
                />

                <stop
                  offset="95%"
                  stopColor="#1976d2"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tick={{ fontSize: 12 }}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#1976d2"
              strokeWidth={3}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default RevenueChart;