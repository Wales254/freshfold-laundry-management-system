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
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  // Open Profile Menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close Profile Menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Logout
  const handleLogout = () => {
    handleClose();

    dispatch(logout());

    navigate("/login");
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>

          {/* System Name */}
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
            }}
          >
            FreshFold Laundry
          </Typography>

          {/* Notifications */}
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>

          {/* Avatar */}
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "A"}
            </Avatar>
          </IconButton>

          {/* Profile Menu */}
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
            <Box
              sx={{
                px: 2,
                py: 1,
                minWidth: 220,
              }}
            >
              <Typography
                fontWeight="bold"
                variant="subtitle1"
              >
                {user?.name || "Administrator"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {user?.email || "admin@freshfold.com"}
              </Typography>

              <Typography
                variant="caption"
                color="primary"
              >
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
                <LogoutIcon
                  fontSize="small"
                  color="error"
                />
              </ListItemIcon>

              Logout
            </MenuItem>
          </Menu>

        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;