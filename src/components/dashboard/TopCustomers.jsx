import { useSelector } from "react-redux";

import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Chip,
  Divider,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

function TopCustomers() {
  const orders = useSelector((state) => state.orders.orders);

  const customerTotals = {};

  orders.forEach((order, index) => {
    const customerKey =
      order.phone || order.customer || `unknown-${index}`;

    if (!customerTotals[customerKey]) {
      customerTotals[customerKey] = {
        name: order.customer || "Unknown Customer",
        phone: order.phone || "",
        spent: 0,
      };
    }

    customerTotals[customerKey].spent += Number(order.total) || 0;
  });

  const topCustomers = Object.values(customerTotals)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  const formatCurrency = (amount) =>
    `KES ${amount.toLocaleString("en-KE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

  const rankColors = [
    { background: "#fff3d6", color: "#b77908" },
    { background: "#edf1f7", color: "#64748b" },
    { background: "#fbe9df", color: "#b76538" },
    { background: "#edf5ff", color: "#3478c5" },
    { background: "#f1eaff", color: "#8051c7" },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: 3,
        height: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        border: "1px solid #e8edf4",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 18px rgba(30, 55, 90, 0.04)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 1,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              color: "#243247",
              fontWeight: 800,
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            Top Customers
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#8994a7", mt: 0.5, fontSize: "0.8rem" }}
          >
            Customers ranked by total spending
          </Typography>
        </Box>

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
          <PeopleAltIcon sx={{ fontSize: 25 }} />
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: "#edf0f5" }} />

      {/* Customer list */}
      {topCustomers.length > 0 ? (
        <List disablePadding>
          {topCustomers.map((customer, index) => {
            const rank = rankColors[index];

            return (
              <ListItem
                key={customer.phone || customer.name}
                disableGutters
                sx={{
                  py: 1.5,
                  px: 0.5,
                  borderRadius: 2,
                  alignItems: "center",
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    bgcolor: "#f7f9fc",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 25,
                    height: 25,
                    mr: 1,
                    flexShrink: 0,
                    borderRadius: "50%",
                    bgcolor: rank.background,
                    color: rank.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                  }}
                >
                  {index + 1}
                </Box>

                <ListItemAvatar sx={{ minWidth: 48 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "#eaf3ff",
                      color: "#1976d2",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                    }}
                  >
                    {(customer.name || "C").charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  sx={{ minWidth: 0, mr: 1 }}
                  primary={
                    <Typography
                      sx={{
                        color: "#344256",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {customer.name}
                    </Typography>
                  }
                  secondary={
                    customer.phone || "Phone not provided"
                  }
                  slotProps={{
                    secondary: {
                      sx: {
                        color: "#8994a7",
                        fontSize: "0.75rem",
                        mt: 0.35,
                        overflowWrap: "anywhere",
                      },
                    },
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    flexShrink: 0,
                    maxWidth: "45%",
                  }}
                >
                  {index === 0 && (
                    <EmojiEventsIcon
                      sx={{
                        fontSize: 17,
                        color: "#d49a19",
                        mb: 0.25,
                      }}
                    />
                  )}

                  <Typography
                    sx={{
                      color: "#16835b",
                      fontWeight: 800,
                      fontSize: { xs: "0.75rem", sm: "0.85rem" },
                      overflowWrap: "anywhere",
                      textAlign: "right",
                    }}
                  >
                    {formatCurrency(customer.spent)}
                  </Typography>
                </Box>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Box
          sx={{
            py: 5,
            px: 2,
            textAlign: "center",
            color: "#8994a7",
          }}
        >
          <PeopleAltIcon sx={{ fontSize: 42, color: "#cbd5e1", mb: 1 }} />

          <Typography
            sx={{
              color: "#344256",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            No customers yet
          </Typography>

          <Typography
            variant="body2"
            sx={{ mt: 0.75, fontSize: "0.8rem" }}
          >
            Customer rankings will appear when orders are recorded.
          </Typography>
        </Box>
      )}

      {/* Footer */}
      {topCustomers.length > 0 && (
        <>
          <Divider sx={{ my: 1.5, borderColor: "#edf0f5" }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#8994a7", fontSize: "0.75rem" }}
            >
              Showing up to 5 customers
            </Typography>

            <Chip
              label={`${topCustomers.length} customers`}
              size="small"
              sx={{
                bgcolor: "#eaf3ff",
                color: "#1976d2",
                fontWeight: 700,
                fontSize: "0.7rem",
              }}
            />
          </Box>
        </>
      )}
    </Paper>
  );
}

export default TopCustomers;