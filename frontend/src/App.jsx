

import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// =========================
// CUSTOMER PAGES
// =========================
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import OrdersPage from "./pages/OrdersPage";
import OrderDetails from "./pages/OrderDetails";

// =========================
// ADMIN PAGES
// =========================
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
import AdminCartItems from "./pages/AdminCartItems";
import AdminCarts from "./pages/AdminCarts";
import AdminOrderItems from "./pages/AdminOrderItems";
import AdminPayments from "./pages/AdminPayments";
import AdminUsers from "./pages/AdminUsers";

// =========================
// ADMIN COMPONENTS
// =========================
import AdminLayout from "./components/AdminLayout";
import Homes from "./pages/Homes";


// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}


// =====================================================
// ADMIN PROTECTED ROUTE
// =====================================================

function AdminRoute() {
  const token = localStorage.getItem("accessToken");

  const isAdmin =
    localStorage.getItem("isStaff") === "true" ||
    localStorage.getItem("isSuperuser") === "true";

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}


// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        {/* Login - Public */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Register - Public */}
        <Route
          path="/register"
          element={<RegisterPage />}
        />


        {/* =================================================
            ALL PROTECTED ROUTES
        ================================================= */}

        <Route element={<ProtectedRoute />}>

          {/* Default */}
          <Route
            path="/"
            element={<Navigate to="/home" replace />}
          />

          {/* =========================
              CUSTOMER HOME
          ========================= */}

          <Route
            path="/home"
            element={<HomePage />}
          />

          {/* Admin Home */}
          <Route
            path="/homes"
            element={<Homes />}
          />


          {/* =========================
              PRODUCTS
          ========================= */}

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />


          {/* =========================
              CART
          ========================= */}

          <Route
            path="/cart"
            element={<CartPage />}
          />


          {/* =========================
              CHECKOUT
          ========================= */}

          <Route
            path="/checkout"
            element={<Checkout />}
          />


          {/* =========================
              ORDERS
          ========================= */}

          <Route
            path="/orders"
            element={<OrdersPage />}
          />

          <Route
            path="/orders/:id"
            element={<OrderDetails />}
          />


          {/* =================================================
              ADMIN PANEL
          ================================================= */}

          <Route element={<AdminRoute />}>

            <Route
              path="/admin-dashboard"
              element={<AdminLayout />}
            >

              {/* Dashboard */}
              <Route
                index
                element={<AdminDashboard />}
              />

              {/* Products */}
              <Route
                path="products"
                element={<AdminProducts />}
              />

              {/* Categories */}
              <Route
                path="categories"
                element={<AdminCategories />}
              />

              {/* Orders */}
              <Route
                path="orders"
                element={<AdminOrders />}
              />

              {/* Cart Items */}
              <Route
                path="cart-items"
                element={<AdminCartItems />}
              />

              {/* Carts */}
              <Route
                path="carts"
                element={<AdminCarts />}
              />

              {/* Order Items */}
              <Route
                path="order-items"
                element={<AdminOrderItems />}
              />

              {/* Payments */}
              <Route
                path="payments"
                element={<AdminPayments />}
              />

              {/* Users */}
              <Route
                path="users"
                element={<AdminUsers />}
              />

            </Route>

          </Route>


          {/* =================================================
              404 PAGE
          ================================================= */}

          <Route
            path="*"
            element={
              <div
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px",
                  textAlign: "center",
                }}
              >

                <h1
                  style={{
                    fontSize: "64px",
                    margin: "0 0 10px",
                  }}
                >
                  404
                </h1>

                <h2>
                  Page Not Found
                </h2>

                <p
                  style={{
                    color: "#666",
                    marginBottom: "25px",
                  }}
                >
                  The page you are looking for does not exist.
                </p>

                <button
                  onClick={() => {
                    const isAdmin =
                      localStorage.getItem("isStaff") === "true" ||
                      localStorage.getItem("isSuperuser") === "true";

                    if (isAdmin) {
                      window.location.href = "/homes";
                    } else {
                      window.location.href = "/home";
                    }
                  }}
                  style={{
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#111827",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Go to Home
                </button>

              </div>
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;