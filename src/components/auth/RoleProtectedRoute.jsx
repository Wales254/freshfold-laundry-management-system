import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function RoleProtectedRoute({ roles, children }) {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but role not allowed
  if (!roles.includes(user?.role)) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <h1>403 - Access Denied</h1>

        <p>
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return children;
}

export default RoleProtectedRoute;