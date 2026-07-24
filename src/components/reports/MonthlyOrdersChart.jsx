import { useSelector } from "react-redux";

import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function MonthlyOrdersChart() {
  const orders = useSelector((state) => state.orders.orders);

  const months = {};

  orders.forEach((order) => {
    const month = new Date(
      order.deliveryDate
    ).toLocaleString("default", {
      month: "short",
    });

    months[month] = (months[month] || 0) + 1;
  });

  const data = Object.keys(months).map((month) => ({
    month,
    orders: months[month],
  }));

  return (
    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
        >
          Monthly Orders
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="orders"
              stroke="#2e7d32"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default MonthlyOrdersChart;