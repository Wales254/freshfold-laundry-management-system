import { useSelector } from "react-redux";

import {
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
    services[order.service] =
      (services[order.service] || 0) + 1;
  });

  const data = Object.keys(services).map((service) => ({
    service,
    orders: services[service],
  }));

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        height: 400,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
      >
        Most Popular Services
      </Typography>

      <ResponsiveContainer
        width="100%"
        height="90%"
      >
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="service" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="orders"
            fill="#1976d2"
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default ServiceChart;