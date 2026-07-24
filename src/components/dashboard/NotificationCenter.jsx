import { useSelector } from "react-redux";

import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EventIcon from "@mui/icons-material/Event";

function NotificationCenter() {
  const orders = useSelector((state) => state.orders.orders);

  const today = new Date().toISOString().split("T")[0];

  const notifications = [];

  orders.forEach((order) => {
    // Ready for pickup
    if (order.status === "Ready") {
      notifications.push({
        icon: <CheckCircleIcon color="success" />,
        message: `${order.customer}'s order is ready for pickup.`,
      });
    }

    // Due today
    if (order.deliveryDate === today) {
      notifications.push({
        icon: <EventIcon color="primary" />,
        message: `${order.customer}'s order is due today.`,
      });
    }

    // Overdue
    if (
      order.deliveryDate < today &&
      order.status !== "Delivered"
    ) {
      notifications.push({
        icon: <WarningAmberIcon color="error" />,
        message: `${order.customer}'s order is overdue.`,
      });
    }
  });

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
      >
        Notifications
      </Typography>

      {notifications.length === 0 ? (
        <Typography color="text.secondary">
          No notifications.
        </Typography>
      ) : (
        <List>
          {notifications.map((notification, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {notification.icon}
              </ListItemIcon>

              <ListItemText
                primary={notification.message}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default NotificationCenter;