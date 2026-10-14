import { useSelector } from "react-redux";

import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Avatar,
  Chip,
} from "@mui/material";

import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDeliveryDate(dateString, today) {
  if (dateString === today) {
    return "Today";
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateString === getLocalDateKey(tomorrow)) {
    return "Tomorrow";
  }

  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function UpcomingDeliveries() {
  const orders = useSelector(
    (state) => state.orders.orders
  );

  const today = getLocalDateKey();

  const upcomingDeliveries = orders
    .filter((order) => {
      return (
        order.deliveryDate &&
        /^\d{4}-\d{2}-\d{2}$/.test(order.deliveryDate) &&
        order.deliveryDate >= today &&
        order.status !== "Delivered"
      );
    })
    .sort((a, b) => {
      return a.deliveryDate.localeCompare(b.deliveryDate);
    })
    .slice(0, 5);

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
            Upcoming Deliveries
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#8994a7",
              mt: 0.5,
              fontSize: "0.8rem",
            }}
          >
            Your next scheduled deliveries
          </Typography>
        </Box>

        <Avatar
          variant="rounded"
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            bgcolor: "#eaf3ff",
            color: "#1976d2",
            borderRadius: 2.5,
          }}
        >
          <LocalShippingOutlinedIcon />
        </Avatar>
      </Box>

      <Divider sx={{ my: 2, borderColor: "#edf0f5" }} />

      {/* Real deliveries from Redux */}
      {upcomingDeliveries.length > 0 ? (
        <List disablePadding>
          {upcomingDeliveries.map((order, index) => {
            const isToday = order.deliveryDate === today;
            const isReady = order.status === "Ready";

            return (
              <Box key={order.id ?? `${order.phone}-${order.deliveryDate}-${index}`}>
                <ListItem
                  disableGutters
                  sx={{
                    py: 1.75,
                    px: 0.5,
                    gap: 1.25,
                    alignItems: "center",
                    borderRadius: 2,
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      bgcolor: "#f8fafd",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 42,
                      height: 42,
                      flexShrink: 0,
                      bgcolor: "#f0f5ff",
                      color: "#315da8",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                    }}
                  >
                    {(order.customer || "C")
                      .charAt(0)
                      .toUpperCase()}
                  </Avatar>

                  <ListItemText
                    sx={{ minWidth: 0, my: 0, mr: 0.5 }}
                    primary={
                      <Typography
                        sx={{
                          color: "#344256",
                          fontWeight: 700,
                          fontSize: "0.86rem",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {order.customer || "Unknown customer"}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography
                          component="div"
                          sx={{
                            color: "#8994a7",
                            fontSize: "0.75rem",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {order.service || "Laundry service"}
                          {order.id != null ? ` · Order #${order.id}` : ""}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mt: 0.6,
                            color: "#758198",
                          }}
                        >
                          <CalendarTodayOutlinedIcon
                            sx={{ fontSize: 13 }}
                          />

                          <Typography
                            component="span"
                            sx={{ fontSize: "0.73rem" }}
                          >
                            {formatDeliveryDate(
                              order.deliveryDate,
                              today
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 0.6,
                      flexShrink: 0,
                    }}
                  >
                    <Chip
                      label={isToday ? "Today" : formatDeliveryDate(
                        order.deliveryDate,
                        today
                      )}
                      size="small"
                      sx={{
                        maxWidth: 120,
                        bgcolor: isToday ? "#fff3df" : "#eaf3ff",
                        color: isToday ? "#a96300" : "#315da8",
                        fontWeight: 700,
                        fontSize: "0.68rem",
                        "& .MuiChip-label": {
                          px: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: isReady ? "#16835b" : "#758198",
                      }}
                    >
                      {order.status || "Received"}
                    </Typography>
                  </Box>
                </ListItem>

                {index !== upcomingDeliveries.length - 1 && (
                  <Divider sx={{ borderColor: "#edf0f5" }} />
                )}
              </Box>
            );
          })}
        </List>
      ) : (
        <Box
          sx={{
            py: 4,
            px: 1,
            textAlign: "center",
          }}
        >
          <LocalShippingOutlinedIcon
            sx={{
              fontSize: 40,
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
            No upcoming deliveries
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#8994a7",
              mt: 0.75,
              fontSize: "0.8rem",
            }}
          >
            Orders scheduled for today or later will appear here.
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default UpcomingDeliveries;