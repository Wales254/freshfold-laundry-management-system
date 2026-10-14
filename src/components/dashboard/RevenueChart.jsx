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
import { Box, Paper, Typography } from "@mui/material";

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
      dateKey: [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-"),
      label: date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
      }),
    });
  }

  const revenueByDay = weekDays.map((day) => {
    let revenue = 0;

    orders.forEach((order) => {
      if (!Array.isArray(order.payments)) return;

      order.payments.forEach((payment) => {
        if (!payment.date) return;

        const paymentDate = new Date(payment.date);

        if (Number.isNaN(paymentDate.getTime())) return;

        const paymentDateKey = [
          paymentDate.getFullYear(),
          String(paymentDate.getMonth() + 1).padStart(2, "0"),
          String(paymentDate.getDate()).padStart(2, "0"),
        ].join("-");

        if (paymentDateKey === day.dateKey) {
          revenue += Number(payment.amount) || 0;
        }
      });
    });

    return revenue;
  });

  const weeklyRevenue = revenueByDay.reduce(
    (sum, revenue) => sum + revenue,
    0
  );

  const formatCurrency = (amount) =>
    `KES ${Number(amount).toLocaleString("en-KE", {
      maximumFractionDigits: 2,
    })}`;

  const data = {
    labels: weekDays.map((day) => day.label),
    datasets: [
      {
        label: "Revenue",
        data: revenueByDay,
        backgroundColor: "#1976d2",
        hoverBackgroundColor: "#1256a0",
        borderRadius: 7,
        borderSkipped: false,
        maxBarThickness: 38,
        categoryPercentage: 0.7,
        barPercentage: 0.85,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      mode: "index",
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#243247",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,

        callbacks: {
          title: (items) => items[0]?.label || "",
          label: (context) =>
            `Revenue: ${formatCurrency(context.raw)}`,
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#758198",
          font: {
            size: 11,
          },
          maxRotation: 0,
          autoSkip: false,
        },
      },

      y: {
        beginAtZero: true,
        border: {
          display: false,
          dash: [4, 4],
        },
        grid: {
          color: "#edf1f6",
          drawTicks: false,
        },
        ticks: {
          color: "#758198",
          padding: 10,
          maxTicksLimit: 6,
          callback: (value) =>
            Number(value).toLocaleString("en-KE"),
        },
      },
    },
  };

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
            Weekly Revenue
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              color: "#8994a7",
              fontSize: "0.8rem",
            }}
          >
            Payments received over the last 7 days
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
              fontSize: "0.7rem",
              fontWeight: 700,
            }}
          >
            7 DAYS
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          mb: 1.5,
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            color: "#243247",
            fontSize: { xs: "1.45rem", sm: "1.7rem" },
            fontWeight: 800,
            lineHeight: 1.3,
            overflowWrap: "anywhere",
          }}
        >
          {formatCurrency(weeklyRevenue)}
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: "#8994a7" }}
        >
          Total payments received this week
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          position: "relative",
        }}
      >
        <Bar data={data} options={options} />
      </Box>
    </Paper>
  );
}

export default RevenueChart;