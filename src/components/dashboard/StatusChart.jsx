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

const STATUS_COLORS = {
  Received: "#42A5F5",
  Washing: "#FFA726",
  Drying: "#AB47BC",
  Ironing: "#26C6DA",
  Ready: "#66BB6A",
  Delivered: "#5C6BC0",
};

const ORDER_STATUS = [
  "Received",
  "Washing",
  "Drying",
  "Ironing",
  "Ready",
  "Delivered",
];

function StatusChart() {
  const orders = useSelector((state) => state.orders.orders);

  const data = ORDER_STATUS.map((status) => ({
    name: status,
    value: orders.filter(
      (order) => order.status === status
    ).length,
  })).filter((item) => item.value > 0);

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
        sx={{ mb: 1 }}
      >
        Order Status Distribution
      </Typography>

      {data.length === 0 ? (
        <Typography
          color="text.secondary"
          sx={{
            height: "85%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          No orders available
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={130}
              label
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={STATUS_COLORS[entry.name]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}

export default StatusChart;
