// import React, { useEffect, useState } from "react";
// import "./AdminDashboard.css";

// const API_URL = "http://127.0.0.1:8000/api";

// function AdminDashboard() {
//   const [stats, setStats] = useState({
//     products: 0,
//     categories: 0,
//     orders: 0,
//     users: 0,
//     payments: 0,
//     carts: 0,
//   });

//   const [recentOrders, setRecentOrders] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     const token = localStorage.getItem("accessToken");

//     if (!token) {
//       setError("Admin session expired. Please login again.");
//       setLoading(false);
//       return;
//     }

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     };

//     try {
//       setLoading(true);
//       setError("");

//       const [
//         productsResponse,
//         categoriesResponse,
//         ordersResponse,
//         usersResponse,
//         paymentsResponse,
//         cartsResponse,
//       ] = await Promise.all([
//         fetch(`${API_URL}/products/`, { headers }),
//         fetch(`${API_URL}/categories/`, { headers }),
//         fetch(`${API_URL}/admin/orders/`, { headers }),
//         fetch(`${API_URL}/admin/users/`, { headers }),
//         fetch(`${API_URL}/admin/payments/`, { headers }),
//         fetch(`${API_URL}/admin/carts/`, { headers }),
//       ]);

//       // Check authentication
//       if (
//         productsResponse.status === 401 ||
//         categoriesResponse.status === 401 ||
//         ordersResponse.status === 401 ||
//         usersResponse.status === 401 ||
//         paymentsResponse.status === 401 ||
//         cartsResponse.status === 401
//       ) {
//         throw new Error("Unauthorized. Please login again.");
//       }

//       // Check other errors
//       if (
//         !productsResponse.ok ||
//         !categoriesResponse.ok ||
//         !ordersResponse.ok ||
//         !usersResponse.ok ||
//         !paymentsResponse.ok ||
//         !cartsResponse.ok
//       ) {
//         throw new Error("Unable to load dashboard data.");
//       }

//       const productsData = await productsResponse.json();
//       const categoriesData = await categoriesResponse.json();
//       const ordersData = await ordersResponse.json();
//       const usersData = await usersResponse.json();
//       const paymentsData = await paymentsResponse.json();
//       const cartsData = await cartsResponse.json();

//       const products = getResults(productsData);
//       const categories = getResults(categoriesData);
//       const orders = getResults(ordersData);
//       const users = getResults(usersData);
//       const payments = getResults(paymentsData);
//       const carts = getResults(cartsData);

//       setStats({
//         products: products.length,
//         categories: categories.length,
//         orders: orders.length,
//         users: users.length,
//         payments: payments.length,
//         carts: carts.length,
//       });

//       // Show latest 5 orders
//       setRecentOrders(orders.slice(0, 5));
//     } catch (err) {
//       console.error("Dashboard Error:", err);
//       setError(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getResults = (data) => {
//     if (Array.isArray(data)) {
//       return data;
//     }

//     if (Array.isArray(data.results)) {
//       return data.results;
//     }

//     return [];
//   };

//   const getOrderUser = (order) => {
//     if (!order?.user) {
//       return "Unknown";
//     }

//     if (typeof order.user === "object") {
//       return (
//         order.user.username ||
//         order.user.email ||
//         `User #${order.user.id || ""}`
//       );
//     }

//     return `User #${order.user}`;
//   };

//   const getOrderStatusClass = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return "status-pending";

//       case "confirmed":
//         return "status-confirmed";

//       case "shipped":
//         return "status-shipped";

//       case "delivered":
//         return "status-delivered";

//       case "cancelled":
//         return "status-cancelled";

//       default:
//         return "status-default";
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) {
//       return "N/A";
//     }

//     return new Date(date).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const formatAmount = (amount) => {
//     if (amount === undefined || amount === null) {
//       return "₹0.00";
//     }

//     return `₹${Number(amount).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;
//   };

//   if (loading) {
//     return (
//       <div className="admin-dashboard-page">
//         <div className="admin-dashboard-loading">
//           <div className="admin-loading-spinner"></div>
//           <h2>Loading Dashboard...</h2>
//           <p>Please wait while we fetch your store data.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-dashboard-page">

//       {/* HEADER */}
//       <div className="admin-dashboard-header">
//         <div>
//           <h1>Dashboard</h1>

//           <p>
//             Welcome to your E-Commerce Administration Panel
//           </p>
//         </div>
        

//         <button
//           className="admin-refresh-btn"
//           onClick={fetchDashboardData}
//         >
//           🔄 Refresh
//         </button>
//       </div>

//       {/* ERROR */}
//       {error && (
//         <div className="admin-dashboard-error">
//           <div>
//             <strong>⚠️ Unable to load dashboard</strong>
//             <p>{error}</p>
//           </div>

//           <button onClick={fetchDashboardData}>
//             Try Again
//           </button>
//         </div>
//       )}

//       {/* STAT CARDS */}
//       <div className="admin-stats-grid">

//         {/* PRODUCTS */}
//         <div className="admin-stat-card">
//           <div className="admin-stat-icon">
//             🛍️
//           </div>

//           <div className="admin-stat-info">
//             <span>Total Products</span>

//             <h2>{stats.products}</h2>

//             <small>
//               Products in store
//             </small>
//           </div>
//         </div>

//         {/* CATEGORIES */}
//         <div className="admin-stat-card">
//           <div className="admin-stat-icon">
//             🏷️
//           </div>

//           <div className="admin-stat-info">
//             <span>Total Categories</span>

//             <h2>{stats.categories}</h2>

//             <small>
//               Product categories
//             </small>
//           </div>
//         </div>

//         {/* ORDERS */}
//         <div className="admin-stat-card">
//           <div className="admin-stat-icon">
//             📦
//           </div>

//           <div className="admin-stat-info">
//             <span>Total Orders</span>

//             <h2>{stats.orders}</h2>

//             <small>
//               Customer orders
//             </small>
//           </div>
//         </div>

//         {/* USERS */}
//         <div className="admin-stat-card">
//           <div className="admin-stat-icon">
//             👥
//           </div>

//           <div className="admin-stat-info">
//             <span>Total Users</span>

//             <h2>{stats.users}</h2>

//             <small>
//               Registered users
//             </small>
//           </div>
//         </div>

//         {/* PAYMENTS */}
//         <div className="admin-stat-card">
//           <div className="admin-stat-icon">
//             💰
//           </div>

//           <div className="admin-stat-info">
//             <span>Total Payments</span>

//             <h2>{stats.payments}</h2>

//             <small>
//               Payment records
//             </small>
//           </div>
//         </div>

//         {/* CARTS */}
//         <div className="admin-stat-card">
//           <div className="admin-stat-icon">
//             🛒
//           </div>

//           <div className="admin-stat-info">
//             <span>Total Carts</span>

//             <h2>{stats.carts}</h2>

//             <small>
//               Customer carts
//             </small>
//           </div>
//         </div>

//       </div>

//       {/* RECENT ORDERS */}
//       <div className="admin-dashboard-section">

//         <div className="admin-section-card">

//           <div className="admin-section-header">
//             <div>
//               <h2>Recent Orders</h2>

//               <p>
//                 Latest customer orders from your store
//               </p>
//             </div>
//           </div>

//           {recentOrders.length === 0 ? (
//             <div className="admin-empty-state">
//               <div className="admin-empty-icon">
//                 📦
//               </div>

//               <h3>No Orders Available</h3>

//               <p>
//                 There are currently no customer orders.
//               </p>
//             </div>
//           ) : (
//             <div className="admin-orders-table-wrapper">

//               <table className="admin-orders-table">

//                 <thead>
//                   <tr>
//                     <th>Order ID</th>
//                     <th>User</th>
//                     <th>Total</th>
//                     <th>Status</th>
//                     <th>Date</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {recentOrders.map((order) => (
//                     <tr key={order.id}>

//                       <td>
//                         <strong>
//                           #{order.id}
//                         </strong>
//                       </td>

//                       <td>
//                         {getOrderUser(order)}
//                       </td>

//                       <td>
//                         <strong>
//                           {formatAmount(order.total_amount)}
//                         </strong>
//                       </td>

//                       <td>
//                         <span
//                           className={`admin-order-status ${getOrderStatusClass(
//                             order.status
//                           )}`}
//                         >
//                           {order.status || "Unknown"}
//                         </span>
//                       </td>

//                       <td>
//                         {formatDate(
//                           order.created_at
//                         )}
//                       </td>

//                     </tr>
//                   ))}
//                 </tbody>

//               </table>

//             </div>
//           )}

//         </div>

//       </div>

//       {/* QUICK OVERVIEW */}
//       <div className="admin-dashboard-section">

//         <div className="admin-section-card">

//           <h2>Quick Overview</h2>

//           <p className="admin-section-description">
//             Manage your complete e-commerce store from
//             the administration panel.
//           </p>

//           <div className="admin-overview-list">

//             <div className="admin-overview-item">
//               <span>🛍️</span>

//               <div>
//                 <strong>Products</strong>

//                 <p>
//                   Add, edit and delete products.
//                 </p>
//               </div>
//             </div>

//             <div className="admin-overview-item">
//               <span>🏷️</span>

//               <div>
//                 <strong>Categories</strong>

//                 <p>
//                   Organize products into categories.
//                 </p>
//               </div>
//             </div>

//             <div className="admin-overview-item">
//               <span>📦</span>

//               <div>
//                 <strong>Orders</strong>

//                 <p>
//                   View and manage customer orders.
//                 </p>
//               </div>
//             </div>

//             <div className="admin-overview-item">
//               <span>💰</span>

//               <div>
//                 <strong>Payments</strong>

//                 <p>
//                   Monitor customer payment records.
//                 </p>
//               </div>
//             </div>

//             <div className="admin-overview-item">
//               <span>🛒</span>

//               <div>
//                 <strong>Carts</strong>

//                 <p>
//                   View customer shopping carts.
//                 </p>
//               </div>
//             </div>

//             <div className="admin-overview-item">
//               <span>👥</span>

//               <div>
//                 <strong>Users</strong>

//                 <p>
//                   View registered users and admin accounts.
//                 </p>
//               </div>
//             </div>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default AdminDashboard;

import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API_URL = "http://127.0.0.1:8000/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    payments: 0,
    carts: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ===============================
  // FETCH DASHBOARD DATA
  // ===============================
  const fetchDashboardData = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Admin session expired. Please login again.");
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      setLoading(true);
      setError("");

      const [
        productsResponse,
        categoriesResponse,
        ordersResponse,
        usersResponse,
        paymentsResponse,
        cartsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/products/`, { headers }),
        fetch(`${API_URL}/categories/`, { headers }),
        fetch(`${API_URL}/admin/orders/`, { headers }),
        fetch(`${API_URL}/admin/users/`, { headers }),
        fetch(`${API_URL}/admin/payments/`, { headers }),
        fetch(`${API_URL}/admin/carts/`, { headers }),
      ]);

      // ===============================
      // CHECK AUTHENTICATION
      // ===============================
      if (
        productsResponse.status === 401 ||
        categoriesResponse.status === 401 ||
        ordersResponse.status === 401 ||
        usersResponse.status === 401 ||
        paymentsResponse.status === 401 ||
        cartsResponse.status === 401
      ) {
        throw new Error("Unauthorized. Please login again.");
      }

      // ===============================
      // CHECK OTHER ERRORS
      // ===============================
      if (
        !productsResponse.ok ||
        !categoriesResponse.ok ||
        !ordersResponse.ok ||
        !usersResponse.ok ||
        !paymentsResponse.ok ||
        !cartsResponse.ok
      ) {
        throw new Error("Unable to load dashboard data.");
      }

      // ===============================
      // CONVERT RESPONSE TO JSON
      // ===============================
      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();
      const ordersData = await ordersResponse.json();
      const usersData = await usersResponse.json();
      const paymentsData = await paymentsResponse.json();
      const cartsData = await cartsResponse.json();

      // ===============================
      // GET RESULTS
      // ===============================
      const products = getResults(productsData);
      const categories = getResults(categoriesData);
      const orders = getResults(ordersData);
      const users = getResults(usersData);
      const payments = getResults(paymentsData);
      const carts = getResults(cartsData);

      // ===============================
      // UPDATE STATISTICS
      // ===============================
      setStats({
        products: products.length,
        categories: categories.length,
        orders: orders.length,
        users: users.length,
        payments: payments.length,
        carts: carts.length,
      });

      // ===============================
      // LATEST 5 ORDERS
      // ===============================
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // HANDLE API RESULTS
  // ===============================
  const getResults = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.results)) {
      return data.results;
    }

    return [];
  };

  // ===============================
  // GET ORDER USER
  // ===============================
  const getOrderUser = (order) => {
    if (!order?.user) {
      return "Unknown";
    }

    if (typeof order.user === "object") {
      return (
        order.user.username ||
        order.user.email ||
        `User #${order.user.id || ""}`
      );
    }

    return `User #${order.user}`;
  };

  // ===============================
  // ORDER STATUS CLASS
  // ===============================
  const getOrderStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";

      case "confirmed":
        return "status-confirmed";

      case "shipped":
        return "status-shipped";

      case "delivered":
        return "status-delivered";

      case "cancelled":
        return "status-cancelled";

      default:
        return "status-default";
    }
  };

  // ===============================
  // FORMAT DATE
  // ===============================
  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ===============================
  // FORMAT AMOUNT
  // ===============================
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) {
      return "₹0.00";
    }

    return `₹${Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ===============================
  // LOADING SCREEN
  // ===============================
  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-loading">
          <div className="admin-loading-spinner"></div>

          <h2>Loading Dashboard...</h2>

          <p>
            Please wait while we fetch your store data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">

      {/* ===============================
          HEADER
      =============================== */}
      <div className="admin-dashboard-header">

        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome to your E-Commerce Administration Panel
          </p>
        </div>

        {/* HEADER BUTTONS */}
        <div className="admin-header-actions">

          {/* HOME BUTTON */}
          <button
            className="admin-home-btn"
            onClick={() => {
              window.location.href = "/home";
            }}
          >
            🏠 Home
          </button>

          {/* REFRESH BUTTON */}
          <button
            className="admin-refresh-btn"
            onClick={fetchDashboardData}
          >
            🔄 Refresh
          </button>

        </div>
      </div>

      {/* ===============================
          ERROR
      =============================== */}
      {error && (
        <div className="admin-dashboard-error">

          <div>
            <strong>
              ⚠️ Unable to load dashboard
            </strong>

            <p>
              {error}
            </p>
          </div>

          <button onClick={fetchDashboardData}>
            Try Again
          </button>

        </div>
      )}

      {/* ===============================
          STAT CARDS
      =============================== */}
      <div className="admin-stats-grid">

        {/* PRODUCTS */}
        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🛍️
          </div>

          <div className="admin-stat-info">

            <span>
              Total Products
            </span>

            <h2>
              {stats.products}
            </h2>

            <small>
              Products in store
            </small>

          </div>
        </div>

        {/* CATEGORIES */}
        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🏷️
          </div>

          <div className="admin-stat-info">

            <span>
              Total Categories
            </span>

            <h2>
              {stats.categories}
            </h2>

            <small>
              Product categories
            </small>

          </div>
        </div>

        {/* ORDERS */}
        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            📦
          </div>

          <div className="admin-stat-info">

            <span>
              Total Orders
            </span>

            <h2>
              {stats.orders}
            </h2>

            <small>
              Customer orders
            </small>

          </div>
        </div>

        {/* USERS */}
        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            👥
          </div>

          <div className="admin-stat-info">

            <span>
              Total Users
            </span>

            <h2>
              {stats.users}
            </h2>

            <small>
              Registered users
            </small>

          </div>
        </div>

        {/* PAYMENTS */}
        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            💰
          </div>

          <div className="admin-stat-info">

            <span>
              Total Payments
            </span>

            <h2>
              {stats.payments}
            </h2>

            <small>
              Payment records
            </small>

          </div>
        </div>

        {/* CARTS */}
        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🛒
          </div>

          <div className="admin-stat-info">

            <span>
              Total Carts
            </span>

            <h2>
              {stats.carts}
            </h2>

            <small>
              Customer carts
            </small>

          </div>
        </div>

      </div>

      {/* ===============================
          RECENT ORDERS
      =============================== */}
      <div className="admin-dashboard-section">

        <div className="admin-section-card">

          <div className="admin-section-header">

            <div>

              <h2>
                Recent Orders
              </h2>

              <p>
                Latest customer orders from your store
              </p>

            </div>

          </div>

          {recentOrders.length === 0 ? (

            <div className="admin-empty-state">

              <div className="admin-empty-icon">
                📦
              </div>

              <h3>
                No Orders Available
              </h3>

              <p>
                There are currently no customer orders.
              </p>

            </div>

          ) : (

            <div className="admin-orders-table-wrapper">

              <table className="admin-orders-table">

                <thead>

                  <tr>

                    <th>
                      Order ID
                    </th>

                    <th>
                      User
                    </th>

                    <th>
                      Total
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentOrders.map((order) => (

                    <tr key={order.id}>

                      <td>
                        <strong>
                          #{order.id}
                        </strong>
                      </td>

                      <td>
                        {getOrderUser(order)}
                      </td>

                      <td>
                        <strong>
                          {formatAmount(order.total_amount)}
                        </strong>
                      </td>

                      <td>

                        <span
                          className={`admin-order-status ${getOrderStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status || "Unknown"}
                        </span>

                      </td>

                      <td>
                        {formatDate(order.created_at)}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* ===============================
          QUICK OVERVIEW
      =============================== */}
      <div className="admin-dashboard-section">

        <div className="admin-section-card">

          <h2>
            Quick Overview
          </h2>

          <p className="admin-section-description">
            Manage your complete e-commerce store from
            the administration panel.
          </p>

          <div className="admin-overview-list">

            {/* PRODUCTS */}
            <div className="admin-overview-item">

              <span>
                🛍️
              </span>

              <div>

                <strong>
                  Products
                </strong>

                <p>
                  Add, edit and delete products.
                </p>

              </div>

            </div>

            {/* CATEGORIES */}
            <div className="admin-overview-item">

              <span>
                🏷️
              </span>

              <div>

                <strong>
                  Categories
                </strong>

                <p>
                  Organize products into categories.
                </p>

              </div>

            </div>

            {/* ORDERS */}
            <div className="admin-overview-item">

              <span>
                📦
              </span>

              <div>

                <strong>
                  Orders
                </strong>

                <p>
                  View and manage customer orders.
                </p>

              </div>

            </div>

            {/* PAYMENTS */}
            <div className="admin-overview-item">

              <span>
                💰
              </span>

              <div>

                <strong>
                  Payments
                </strong>

                <p>
                  Monitor customer payment records.
                </p>

              </div>

            </div>

            {/* CARTS */}
            <div className="admin-overview-item">

              <span>
                🛒
              </span>

              <div>

                <strong>
                  Carts
                </strong>

                <p>
                  View customer shopping carts.
                </p>

              </div>

            </div>

            {/* USERS */}
            <div className="admin-overview-item">

              <span>
                👥
              </span>

              <div>

                <strong>
                  Users
                </strong>

                <p>
                  View registered users and admin accounts.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;