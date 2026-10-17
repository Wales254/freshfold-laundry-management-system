
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

function RoleProtectedRoute({ roles = [], children }) {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = String(user.role || "").toLowerCase();

  const allowedRoles = roles.map((role) =>
    String(role).toLowerCase()
  );

  if (!allowedRoles.includes(currentRole)) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 2,
          p: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          403 - Access Denied
        </Typography>

        <Typography color="text.secondary">
          Your account does not have permission to access this page.
        </Typography>

        <Button
          variant="contained"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return children;
}

export default RoleProtectedRoute;
