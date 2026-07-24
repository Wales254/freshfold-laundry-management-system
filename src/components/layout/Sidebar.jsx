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

import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 250;

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/",
  },
  {
    text: "Orders",
    icon: <LocalLaundryServiceIcon />,
    path: "/orders",
  },
  {
    text: "Customers",
    icon: <PeopleIcon />,
    path: "/customers",
  },
  {
    text: "Inventory",
    icon: <Inventory2Icon />,
    path: "/inventory",
  },
  {
    text: "Pricing",
    icon: <AttachMoneyIcon />,
    path: "/pricing",
  },
  {
    text: "Receipts",
    icon: <ReceiptLongIcon />,
    path: "/receipts",
  },
  {
    text: "Reports",
    icon: <AssessmentIcon />,
    path: "/reports",
  },
  {
    text: "Settings",
    icon: <SettingsIcon />,
    path: "/settings",
  },
];

function Sidebar() {
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
        </Box>
      </Toolbar>

      <Divider />

      <List
        sx={{
          px: 1.5,
          py: 2,
        }}
      >
        {menuItems.map((item) => (
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