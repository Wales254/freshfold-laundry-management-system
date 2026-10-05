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

function Sidebar() {
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
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #e0e0e0",
          bgcolor: "#fafafa",
        },
      }}
    >
      <Toolbar>
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="primary"
          >
            FreshFold
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Laundry Management
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              fontWeight: "bold",
            }}
          >
            {user?.name}
          </Typography>

          <Typography
            variant="caption"
            color="primary"
          >
            {role}
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      <List
        sx={{
          px: 1.5,
          py: 2,
        }}
      >
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
              sx={{
                borderRadius: 2,
                px: 2,
                transition: "all .25s ease",

                "&:hover": {
                  bgcolor: "#E3F2FD",
                },

                "&.active": {
                  bgcolor: "#1976d2",
                  color: "#fff",
                  boxShadow: 2,
                },

                "&.active .MuiListItemIcon-root": {
                  color: "#fff",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 42,
                  color: "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
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