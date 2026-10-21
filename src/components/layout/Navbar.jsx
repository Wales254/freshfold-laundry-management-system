
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../../redux/authSlice";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Box,
  Tooltip,
  Badge,
  ListItemText,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EventIcon from "@mui/icons-material/Event";

function Navbar({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const user = useSelector((state) => state.auth.user);
  const orders = useSelector((state) => state.orders.orders);

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const accountOpen = Boolean(anchorEl);
  const notificationsOpen = Boolean(notificationAnchor);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
    navigate("/login");
  };

  const today = [
    new Date().getFullYear(),
    String(new Date().getMonth() + 1).padStart(2, "0"),
    String(new Date().getDate()).padStart(2, "0"),
  ].join("-");

  const notifications = [];

  (Array.isArray(orders) ? orders : []).forEach((order) => {
    const customer = order.customer || "A customer";
    const deliveryDate = order.deliveryDate || order.delivery_date;

    if (order.status === "Ready") {
      notifications.push({
        id: `ready-${order.id}`,
        message: `${customer}'s order is ready for pickup.`,
        label: "Ready for pickup",
        icon: <CheckCircleIcon />,
        color: "#16835b",
        priority: 1,
      });
    }

    if (deliveryDate === today && order.status !== "Delivered") {
      notifications.push({
        id: `due-${order.id}`,
        message: `${customer}'s order is due today.`,
        label: "Due today",
        icon: <EventIcon />,
        color: "#1976d2",
        priority: 2,
      });
    }

    if (
      deliveryDate &&
      deliveryDate < today &&
      order.status !== "Delivered"
    ) {
      notifications.push({
        id: `overdue-${order.id}`,
        message: `${customer}'s order is overdue.`,
        label: "Overdue",
        icon: <WarningAmberIcon />,
        color: "#d14343",
        priority: 0,
      });
    }
  });

  notifications.sort((a, b) => a.priority - b.priority);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "divider",
        backgroundImage: "none",
        transition: theme.transitions.create(
          ["background-color", "color", "border-color"],
          { duration: theme.transitions.duration.short }
        ),
      }}
    >
      <Toolbar
        sx={{
          minHeight: "64px !important",
          px: { xs: 1.5, sm: 3 },
          gap: 1,
        }}
      >
        <Tooltip title="Open navigation">
          <IconButton
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            sx={{
              display: { xs: "inline-flex", md: "none" },
              color: "text.primary",
            }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            fontWeight: 800,
            fontSize: { xs: "1rem", sm: "1.2rem" },
            letterSpacing: "-0.4px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          FreshFold
          <Box
            component="span"
            sx={{
              display: { xs: "none", sm: "inline" },
              ml: 0.75,
              color: "text.secondary",
              fontWeight: 500,
              fontSize: "0.85rem",
            }}
          >
            Laundry Management
          </Box>
        </Typography>

        <Tooltip title="Notifications">
          <IconButton
            onClick={handleNotificationsOpen}
            aria-label={`Open notifications (${notifications.length})`}
            aria-haspopup="true"
            aria-expanded={notificationsOpen}
            sx={{ color: "text.secondary" }}
          >
            <Badge
              badgeContent={notifications.length}
              color="error"
              max={99}
              overlap="circular"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={notificationAnchor}
          open={notificationsOpen}
          onClose={handleNotificationsClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{
            paper: {
              sx: {
                width: { xs: 300, sm: 360 },
                maxWidth: "calc(100vw - 24px)",
                maxHeight: 420,
                borderRadius: 2,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography fontWeight={800}>Notifications</Typography>
            <Typography variant="body2" color="text.secondary">
              {notifications.length
                ? `${notifications.length} order alert${notifications.length === 1 ? "" : "s"}`
                : "No outstanding order alerts"}
            </Typography>
          </Box>

          <Divider />

          {notifications.length === 0 ? (
            <Box sx={{ px: 2, py: 3, textAlign: "center" }}>
              <CheckCircleIcon
                sx={{ color: "#16835b", fontSize: 34, mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                All caught up! There are no outstanding order alerts.
              </Typography>
            </Box>
          ) : (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => {
                  handleNotificationsClose();
                  navigate("/orders");
                }}
                sx={{
                  alignItems: "flex-start",
                  whiteSpace: "normal",
                  py: 1.5,
                  gap: 1.25,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 30,
                    mt: 0.5,
                    color: notification.color,
                  }}
                >
                  {notification.icon}
                </ListItemIcon>

                <ListItemText
                  primary={notification.message}
                  secondary={notification.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        whiteSpace: "normal",
                      },
                    },
                    secondary: {
                      sx: {
                        mt: 0.25,
                        fontSize: "0.75rem",
                      },
                    },
                  }}
                />
              </MenuItem>
            ))
          )}
        </Menu>

        <Tooltip title="Account menu">
          <IconButton
            onClick={handleMenuOpen}
            aria-label="Open account menu"
            sx={{ p: 0.5, ml: 0.5 }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={accountOpen}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Box sx={{ px: 2, py: 1.5, minWidth: 220 }}>
            <Typography fontWeight={700} variant="subtitle1">
              {user?.name || "Administrator"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {user?.email || "admin@freshfold.com"}
            </Typography>

            <Typography variant="caption" color="primary">
              {user?.role || "Admin"}
            </Typography>
          </Box>

          <Divider />

          <MenuItem
            onClick={() => {
              navigate("/settings");
              handleClose();
            }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate("/settings");
              handleClose();
            }}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Account Settings
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
