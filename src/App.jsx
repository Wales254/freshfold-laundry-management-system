import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { loginSuccess } from "./redux/authSlice";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";

import Login from "./pages/auth/Login";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";
import Pricing from "./pages/Pricing";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Receipts from "./pages/Receipts";
import Users from "./pages/Users";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = localStorage.getItem("auth");

    if (auth) {
      dispatch(loginSuccess(JSON.parse(auth)));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route
            index
            element={
              <RoleProtectedRoute
                roles={[
                  "Admin",
                  "Manager",
                  "Cashier",
                  "Attendant",
                ]}
              >
                <Dashboard />
              </RoleProtectedRoute>
            }
          />

          {/* Orders */}
          <Route
            path="orders"
            element={
              <RoleProtectedRoute
                roles={[
                  "Admin",
                  "Manager",
                  "Cashier",
                  "Attendant",
                ]}
              >
                <Orders />
              </RoleProtectedRoute>
            }
          />

          {/* Customers */}
          <Route
            path="customers"
            element={
              <RoleProtectedRoute
                roles={[
                  "Admin",
                  "Manager",
                  "Cashier",
                ]}
              >
                <Customers />
              </RoleProtectedRoute>
            }
          />

          {/* Inventory */}
          <Route
            path="inventory"
            element={
              <RoleProtectedRoute
                roles={[
                  "Admin",
                  "Manager",
                ]}
              >
                <Inventory />
              </RoleProtectedRoute>
            }
          />

          {/* Pricing */}
          <Route
            path="pricing"
            element={
              <RoleProtectedRoute
                roles={[
                  "Admin",
                  "Manager",
                ]}
              >
                <Pricing />
              </RoleProtectedRoute>
            }
          />

          {/* Payments */}
          <Route
            path="payments"
            element={
              <RoleProtectedRoute
                roles={[
                  "Admin",
                  "Manager",
                  "Cashier",
                ]}
              >
                <Payments />
              </RoleProtectedRoute>
            }
          />

          {/* Receipts */}
          <Route
            path="receipts"
            element={
              <RoleProtectedRoute
                roles={[
                  "Admin",
                  "Manager",
                  "Cashier",
                ]}
              >
                <Receipts />
              </RoleProtectedRoute>
            }
          />

          {/* Reports */}
          <Route
            path="reports"
            element={
              <RoleProtectedRoute
                roles={[
                  "Admin",
                  "Manager",
                ]}
              >
                <Reports />
              </RoleProtectedRoute>
            }
          />

          {/* Users */}
          <Route
            path="users"
            element={
              <RoleProtectedRoute roles={["Admin"]}>
                <Users />
              </RoleProtectedRoute>
            }
          />

          {/* Settings */}
          <Route
            path="settings"
            element={
              <RoleProtectedRoute roles={["Admin"]}>
                <Settings />
              </RoleProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;