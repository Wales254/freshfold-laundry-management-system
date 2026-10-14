import { useSelector } from "react-redux";

import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EventIcon from "@mui/icons-material/Event";

function NotificationCenter() {
  const orders = useSelector((state) => state.orders.orders);

  const today = [
    new Date().getFullYear(),
    String(new Date().getMonth() + 1).padStart(2, "0"),
    String(new Date().getDate()).padStart(2, "0"),
  ].join("-");

  const notifications = [];

  orders.forEach((order) => {
    const customer = order.customer || "A customer";

    if (order.status === "Ready") {
      notifications.push({
        type: "ready",
        icon: <CheckCircleIcon />,
        message: `${customer}'s order is ready for pickup.`,
        label: "Ready",
        color: "#16835b",
        background: "#e8f7ef",
        priority: 2,
      });
    }

    if (order.deliveryDate === today) {
      notifications.push({
        type: "due",
        icon: <EventIcon />,
        message: `${customer}'s order is due today.`,
        label: "Due today",
        color: "#1976d2",
        background: "#eaf3ff",
        priority: 1,
      });
    }

    if (
      order.deliveryDate &&
      order.deliveryDate < today &&
      order.status !== "Delivered"
    ) {
      notifications.push({
        type: "overdue",
        icon: <WarningAmberIcon />,
        message: `${customer}'s order is overdue.`,
        label: "Overdue",
        color: "#d14343",
        background: "#fff0f0",
        priority: 0,
      });
    }
  });

  notifications.sort((a, b) => a.priority - b.priority);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: 3,
        height: "100%",
        minWidth: 0,
        border: "1px solid #e8edf4",
        boxShadow: "0 4px 18px rgba(30, 55, 90, 0.04)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
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
            Notifications
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              color: "#8994a7",
              fontSize: "0.8rem",
            }}
          >
            Important order updates
          </Typography>
        </Box>

        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: 2.5,
            bgcolor: "#eef5ff",
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NotificationsIcon />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "#758198", fontWeight: 600 }}
        >
          Current alerts
        </Typography>

        <Chip
          label={notifications.length}
          size="small"
          sx={{
            height: 24,
            minWidth: 28,
            fontWeight: 700,
            bgcolor: notifications.length
              ? "#fff0f0"
              : "#edf1f6",
            color: notifications.length
              ? "#d14343"
              : "#758198",
          }}
        />
      </Box>

      {notifications.length === 0 ? (
        <Box
          sx={{
            py: 5,
            px: 1,
            textAlign: "center",
          }}
        >
          <CheckCircleIcon
            sx={{ fontSize: 38, color: "#16835b", mb: 1 }}
          />

          <Typography
            sx={{ fontWeight: 700, color: "#526078" }}
          >
            All caught up!
          </Typography>

          <Typography
            variant="body2"
            sx={{ mt: 0.5, color: "#8994a7" }}
          >
            There are no outstanding order alerts.
          </Typography>
        </Box>
      ) : (
        <List
          disablePadding
          sx={{
            maxHeight: 285,
            overflowY: "auto",
            pr: 0.5,
          }}
        >
          {notifications.map((notification, index) => (
            <ListItem
              key={`${notification.type}-${index}`}
              alignItems="flex-start"
              sx={{
                px: 1.25,
                py: 1.5,
                mb: 1,
                borderRadius: 2.5,
                bgcolor: "#fafbfd",
                border: "1px solid #f0f2f6",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mt: 0.25,
                  color: notification.color,
                }}
              >
                {notification.icon}
              </ListItemIcon>

              <ListItemText
                primary={notification.message}
                primaryTypographyProps={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  lineHeight: 1.5,
                  color: "#344258",
                  overflowWrap: "anywhere",
                }}
                secondary={
                  <Chip
                    label={notification.label}
                    size="small"
                    sx={{
                      mt: 1,
                      height: 22,
                      bgcolor: notification.background,
                      color: notification.color,
                      fontWeight: 700,
                      fontSize: "0.68rem",
                    }}
                  />
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default NotificationCenter;