import { useSelector } from "react-redux";

import {
  Box,
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

  const totalOrders = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: 3,
        height: { xs: 380, sm: 420 },
        minWidth: 0,
        border: "1px solid #e8edf4",
        boxShadow: "0 4px 18px rgba(30, 55, 90, 0.04)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
          mb: 1,
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
            Order Status Distribution
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              color: "#8994a7",
              fontSize: "0.8rem",
            }}
          >
            Overview of orders by processing stage
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
            {totalOrders} orders
          </Typography>
        </Box>
      </Box>

      {data.length === 0 ? (
        <Box
          sx={{
            height: "75%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#526078",
              }}
            >
              No orders available
            </Typography>

            <Typography
              variant="body2"
              sx={{ mt: 0.75, color: "#8994a7" }}
            >
              Order status information will appear here.
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: "100%", height: "82%", minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius="65%"
                innerRadius="42%"
                paddingAngle={3}
                cornerRadius={4}
                stroke="none"
                labelLine={false}
                label={({ percent }) =>
                  percent >= 0.08
                    ? `${(percent * 100).toFixed(0)}%`
                    : ""
                }
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={STATUS_COLORS[entry.name] || "#90A4AE"}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  `${value} ${value === 1 ? "order" : "orders"}`,
                  name,
                ]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e8edf4",
                  boxShadow: "0 6px 20px rgba(30,55,90,0.08)",
                  fontSize: 13,
                }}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: 11,
                  paddingTop: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}

export default StatusChart;