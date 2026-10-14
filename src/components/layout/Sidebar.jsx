import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SellIcon from "@mui/icons-material/Sell";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";

const drawerWidth = 250;

function Sidebar({ mobileOpen, onClose, onNavigate }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const user = useSelector((state) => state.auth.user);
  const role = user?.role || "Guest";

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/",
      roles: ["Admin", "Manager", "Cashier", "Attendant"],
    },
    {
      text: "Orders",
      icon: <LocalLaundryServiceIcon />,
      path: "/orders",
      roles: ["Admin", "Manager", "Cashier", "Attendant"],
    },
    {
      text: "Customers",
      icon: <PeopleIcon />,
      path: "/customers",
      roles: ["Admin", "Manager", "Cashier"],
    },
    {
      text: "Inventory",
      icon: <Inventory2Icon />,
      path: "/inventory",
      roles: ["Admin", "Manager"],
    },
    {
      text: "Pricing",
      icon: <SellIcon />,
      path: "/pricing",
      roles: ["Admin", "Manager"],
    },
    {
      text: "Payments",
      icon: <PaymentsIcon />,
      path: "/payments",
      roles: ["Admin", "Manager", "Cashier"],
    },
    {
      text: "Receipts",
      icon: <ReceiptLongIcon />,
      path: "/receipts",
      roles: ["Admin", "Manager", "Cashier"],
    },
    {
      text: "Reports",
      icon: <AssessmentIcon />,
      path: "/reports",
      roles: ["Admin", "Manager"],
    },
    {
      text: "Users",
      icon: <GroupIcon />,
      path: "/users",
      roles: ["Admin"],
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      path: "/settings",
      roles: ["Admin"],
    },
  ];

  const allowedMenus = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #e5eaf2",
          bgcolor: "#ffffff",
        },
      }}
    >
      <Toolbar sx={{ minHeight: "64px !important", px: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "#1565c0",
            }}
          >
            FreshFold
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Laundry Management
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      <Box sx={{ px: 2, py: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: "#f1f6fd",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="body2"
            fontWeight={700}
            noWrap
            title={user?.name || ""}
          >
            {user?.name || "User"}
          </Typography>

          <Typography
            variant="caption"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            {role}
          </Typography>
        </Box>
      </Box>

      <Typography
        variant="overline"
        sx={{
          px: 3,
          color: "#8792a2",
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        WORKSPACE
      </Typography>

      <List sx={{ px: 1.5, py: 1 }}>
        {allowedMenus.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ mb: 0.5 }}
          >
            <ListItemButton
              component={NavLink}
              to={item.path}
              end={item.path === "/"}
              onClick={onNavigate}
              sx={{
                minHeight: 46,
                borderRadius: 2,
                px: 2,
                color: "#536176",
                transition: "background-color 0.2s ease, color 0.2s ease",

                "&:hover": {
                  bgcolor: "#f1f6fd",
                  color: "#1565c0",
                },

                "&.active": {
                  bgcolor: "#1565c0",
                  color: "#ffffff",
                  boxShadow: "0 4px 10px rgba(21, 101, 192, 0.18)",
                },

                "&.active .MuiListItemIcon-root": {
                  color: "#ffffff",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;