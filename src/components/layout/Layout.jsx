import { useState } from "react";
import { Box, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((previous) => !previous);
  };

  const handleNavigate = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        transition: "background-color 0.25s ease, color 0.25s ease",
      }}
    >
      <Navbar onMenuClick={handleDrawerToggle} />

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNavigate={handleNavigate}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { xs: "100%", md: "calc(100% - 250px)" },
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          p: { xs: 2, sm: 2.5, md: 3 },
          pt: { xs: 10, sm: 11, md: 12 },
          transition: theme.transitions.create(
            ["background-color", "color", "padding"],
            {
              duration: theme.transitions.duration.short,
            }
          ),
        }}
      >
        <Toolbar sx={{ display: "none" }} />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
