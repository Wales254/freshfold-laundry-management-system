import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./redux/authSlice";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/auth/Login";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";
import Pricing from "./pages/Pricing";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Receipts from "./pages/Receipts";

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
          <Route index element={<Dashboard />} />

          <Route
            path="orders"
            element={<Orders />}
          />

          <Route
            path="customers"
            element={<Customers />}
          />

          <Route
            path="inventory"
            element={<Inventory />}
          />

          <Route
            path="pricing"
            element={<Pricing />}
          />

          <Route
            path="reports"
            element={<Reports />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />

          <Route
            path="receipts"
            element={<Receipts />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;