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
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

function Navbar({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "#ffffff",
        color: "#243247",
        borderBottom: "1px solid #e5eaf2",
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
              color: "#243247",
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
              color: "#7a8799",
              fontWeight: 500,
              fontSize: "0.85rem",
            }}
          >
            Laundry Management
          </Box>
        </Typography>

        <Tooltip title="Notifications">
          <IconButton
            aria-label="Notifications"
            sx={{ color: "#536176" }}
          >
            <NotificationsIcon />
          </IconButton>
        </Tooltip>

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
                bgcolor: "#1565c0",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "A"}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={open}
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