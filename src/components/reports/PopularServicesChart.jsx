import { useSelector } from "react-redux";

import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function PopularServicesChart() {
  const orders = useSelector((state) => state.orders.orders);

  const services = {};

  orders.forEach((order) => {
    services[order.service] =
      (services[order.service] || 0) + order.quantity;
  });

  const data = Object.keys(services).map((service) => ({
    service,
    orders: services[service],
  }));

  return (
    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
        >
          Popular Services
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="service" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="orders"
              fill="#1976d2"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default PopularServicesChart;