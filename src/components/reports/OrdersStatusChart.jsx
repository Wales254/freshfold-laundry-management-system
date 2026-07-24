import { useSelector } from "react-redux";

import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#d32f2f",
  "#7b1fa2",
  "#0288d1",
];

function OrdersStatusChart() {
  const orders = useSelector((state) => state.orders.orders);

  const statuses = {};

  orders.forEach((order) => {
    statuses[order.status] =
      (statuses[order.status] || 0) + 1;
  });

  const data = Object.keys(statuses).map((status) => ({
    name: status,
    value: statuses[status],
  }));

  return (
    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
        >
          Orders by Status
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[index % COLORS.length]
                  }
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default OrdersStatusChart;