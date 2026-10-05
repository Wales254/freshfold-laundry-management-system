import { useSelector } from "react-redux";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { Paper, Typography } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function RevenueChart() {
  const orders = useSelector(
    (state) => state.orders.orders
  );

  const today = new Date();

  const weekDays = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    weekDays.push({
      dateKey: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("en-GB", {
        weekday: "short",
      }),
    });
  }

  const revenueByDay = weekDays.map((day) => {
    let revenue = 0;

    orders.forEach((order) => {
      if (!order.payments) return;

      order.payments.forEach((payment) => {
        const paymentDate = new Date(payment.date)
          .toISOString()
          .split("T")[0];

        if (paymentDate === day.dateKey) {
          revenue += Number(payment.amount);
        }
      });
    });

    return revenue;
  });

  const data = {
    labels: weekDays.map((day) => day.label),

    datasets: [
      {
        label: "Revenue (KES)",
        data: revenueByDay,
        backgroundColor: "#1976d2",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (context) =>
            `KES ${Number(
              context.raw
            ).toLocaleString()}`,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          callback: (value) =>
            `KES ${Number(value).toLocaleString()}`,
        },
      },
    },
  };

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
        sx={{ mb: 2 }}
      >
        Weekly Revenue
      </Typography>

      <Bar data={data} options={options} />
    </Paper>
  );
}

export default RevenueChart;
