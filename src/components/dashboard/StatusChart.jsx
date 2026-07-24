import { useSelector } from "react-redux";

import {
  Paper,
  Typography,
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#42A5F5", // Received
  "#FFA726", // Washing
  "#AB47BC", // Drying
  "#26C6DA", // Ironing
  "#66BB6A", // Ready
  "#5C6BC0", // Delivered
];

function StatusChart() {
  const orders = useSelector((state) => state.orders.orders);

  const statusCounts = {};

  orders.forEach((order) => {
    statusCounts[order.status] =
      (statusCounts[order.status] || 0) + 1;
  });

  const data = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        height: 420,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
      >
        Order Status Distribution
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={130}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default StatusChart;