import { useSelector } from "react-redux";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Box,
  Divider,
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

function statusColor(status) {
  switch (status) {
    case "Received":
      return {
        background: "#edf1f7",
        color: "#526176",
      };

    case "Washing":
      return {
        background: "#e3f2fd",
        color: "#1565c0",
      };

    case "Drying":
      return {
        background: "#f0eaff",
        color: "#7041b5",
      };

    case "Ironing":
      return {
        background: "#fff3df",
        color: "#a96300",
      };

    case "Ready":
      return {
        background: "#e5f6ec",
        color: "#187747",
      };

    case "Delivered":
      return {
        background: "#e5efff",
        color: "#2459a9",
      };

    default:
      return {
        background: "#f1f3f5",
        color: "#606b7a",
      };
  }
}

function RecentOrders() {
  const orders = useSelector(
    (state) => state.orders.orders
  );

  // Show the most recent orders first.
  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();

      return (
        (Number.isFinite(dateB) ? dateB : 0) -
        (Number.isFinite(dateA) ? dateA : 0)
      );
    })
    .slice(0, 5);

  const formatCurrency = (amount) =>
    `KES ${(
      Number(amount) || 0
    ).toLocaleString("en-KE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

  return (
    <Paper
      elevation={0}
      sx={{
        mt: { xs: 3, md: 4 },
        borderRadius: 3,
        overflow: "hidden",
        minWidth: 0,
        border: "1px solid #e8edf4",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 18px rgba(30, 55, 90, 0.04)",
      }}
    >
      {/* Section heading */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: 2.5,
              bgcolor: "#eaf3ff",
              color: "#1976d2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReceiptLongIcon sx={{ fontSize: 25 }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#243247",
                fontWeight: 800,
                fontSize: { xs: "1rem", sm: "1.1rem" },
              }}
            >
              Recent Orders
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.4,
                color: "#8994a7",
                fontSize: "0.8rem",
              }}
            >
              Latest laundry orders and their status
            </Typography>
          </Box>
        </Box>

        <Chip
          label={`${recentOrders.length} of ${orders.length}`}
          size="small"
          sx={{
            flexShrink: 0,
            bgcolor: "#f0f5ff",
            color: "#315da8",
            fontWeight: 700,
            fontSize: "0.72rem",
          }}
        />
      </Box>

      <Divider sx={{ borderColor: "#edf0f5" }} />

      {/* Responsive table */}
      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#d7deea",
            borderRadius: 10,
          },
        }}
      >
        <Table
          size="medium"
          aria-label="Recent laundry orders"
          sx={{
            minWidth: 650,
            "& .MuiTableCell-root": {
              borderBottom: "1px solid #edf0f5",
              px: { xs: 1.5, sm: 2.5 },
              py: 2,
            },
            "& .MuiTableBody-root .MuiTableRow:last-child .MuiTableCell-root": {
              borderBottom: "none",
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "#f8fafd",
                "& .MuiTableCell-root": {
                  color: "#758198",
                  fontSize: "0.73rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                  py: 1.75,
                },
              }}
            >
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {recentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Box sx={{ py: 5, px: 2 }}>
                    <ReceiptLongIcon
                      sx={{
                        fontSize: 42,
                        color: "#cbd5e1",
                        mb: 1,
                      }}
                    />

                    <Typography
                      sx={{
                        color: "#344256",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                      }}
                    >
                      No orders yet
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#8994a7",
                        mt: 0.75,
                        fontSize: "0.8rem",
                      }}
                    >
                      New laundry orders will appear here.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              recentOrders.map((order, index) => {
                const statusStyle = statusColor(order.status);

                return (
                  <TableRow
                    key={order.id ?? `${order.phone}-${index}`}
                    hover
                    sx={{
                      transition: "background-color 0.2s ease",
                      "&:hover": {
                        bgcolor: "#f8fafd",
                      },
                    }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          color: "#315da8",
                          fontWeight: 700,
                          fontSize: "0.83rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order.id ?? "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          color: "#344256",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        {order.customer || "Unknown customer"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          color: "#647187",
                          fontSize: "0.83rem",
                        }}
                      >
                        {order.service || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={order.status || "Unknown"}
                        size="small"
                        sx={{
                          bgcolor: statusStyle.background,
                          color: statusStyle.color,
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          borderRadius: 1.5,
                          maxWidth: "100%",
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Typography
                        sx={{
                          color: "#243247",
                          fontWeight: 800,
                          fontSize: "0.83rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatCurrency(order.total)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ borderColor: "#edf0f5" }} />

      <Box
        sx={{
          px: { xs: 2, sm: 2.5, md: 3 },
          py: 1.75,
          bgcolor: "#fcfdff",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#8994a7",
            fontSize: "0.75rem",
          }}
        >
          Showing the 5 most recent orders, or fewer when there are fewer orders.
        </Typography>
      </Box>
    </Paper>
  );
}

export default RecentOrders;