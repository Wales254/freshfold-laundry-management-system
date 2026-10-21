
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchOrdersFromApi } from "./redux/orderSlice";

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
    dispatch(fetchOrdersFromApi());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <RoleProtectedRoute
                roles={["admin", "manager", "cashier", "attendant"]}
              >
                <Dashboard />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="orders"
            element={
              <RoleProtectedRoute
                roles={["admin", "manager", "cashier", "attendant"]}
              >
                <Orders />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="customers"
            element={
              <RoleProtectedRoute
                roles={["admin", "manager", "cashier"]}
              >
                <Customers />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="inventory"
            element={
              <RoleProtectedRoute roles={["admin", "manager"]}>
                <Inventory />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="pricing"
            element={
              <RoleProtectedRoute roles={["admin", "manager"]}>
                <Pricing />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="payments"
            element={
              <RoleProtectedRoute
                roles={["admin", "manager", "cashier"]}
              >
                <Payments />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="receipts"
            element={
              <RoleProtectedRoute
                roles={["admin", "manager", "cashier"]}
              >
                <Receipts />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="reports"
            element={
              <RoleProtectedRoute roles={["admin", "manager"]}>
                <Reports />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="users"
            element={
              <RoleProtectedRoute roles={["admin"]}>
                <Users />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="settings"
            element={
              <RoleProtectedRoute roles={["admin"]}>
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
