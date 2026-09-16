// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API_URL = "http://127.0.0.1:8000/api";

// function OrdersPage() {
//   const navigate = useNavigate();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");

//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const response = await fetch(`${API_URL}/orders/`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.status === 401) {
//         localStorage.removeItem("accessToken");
//         navigate("/login");
//         return;
//       }

//       if (!response.ok) {
//         throw new Error("Failed to fetch orders");
//       }

//       const data = await response.json();

//       // Supports paginated and normal responses
//       if (Array.isArray(data)) {
//         setOrders(data);
//       } else if (Array.isArray(data.results)) {
//         setOrders(data.results);
//       } else if (Array.isArray(data.orders)) {
//         setOrders(data.orders);
//       } else {
//         setOrders([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Unable to load your orders.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusClass = (status) => {
//     const value = String(status || "").toLowerCase();

//     if (value === "confirmed" || value === "delivered") {
//       return "status success";
//     }

//     if (value === "pending") {
//       return "status pending";
//     }

//     if (value === "cancelled" || value === "failed") {
//       return "status danger";
//     }

//     return "status";
//   };

// const formatDateTime = (date) => {
//   if (!date) return "N/A";

//   return new Date(date).toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: true,
//     timeZone: "Asia/Kolkata",
//   });
// };

//   if (loading) {
//     return (
//       <div className="orders-page">
//         <div className="orders-container">
//           <div className="orders-loading">
//             <div className="spinner"></div>
//             <p>Loading your orders...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="orders-page">
//       <div className="orders-container">

//         {/* Header */}
//         <div className="orders-header">
//           <div>
//             <h1>My Orders</h1>
//             <p>View and track your recent orders</p>
//           </div>

//           <button
//             className="continue-shopping"
//             onClick={() => navigate("/home")}
//           >
//             Continue Shopping
//           </button>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="orders-error">
//             {error}
//           </div>
//         )}

//         {/* Empty Orders */}
//         {!error && orders.length === 0 && (
//           <div className="empty-orders">
//             <div className="empty-icon">📦</div>

//             <h2>No Orders Yet</h2>

//             <p>
//               You haven't placed any orders yet.
//             </p>

//             <button
//               onClick={() => navigate("/home")}
//               className="shop-now-btn"
//             >
//               Start Shopping
//             </button>
//           </div>
//         )}

//         {/* Orders */}
//         {orders.length > 0 && (
//           <div className="orders-list">

//             {orders.map((order) => (
//               <div className="order-card" key={order.id}>

//                 {/* Order Top */}
//                 <div className="order-top">

//                   <div>
//                     <span className="order-label">
//                       Order ID
//                     </span>

//                     <h3>
//                       #{order.id}
//                     </h3>
//                   </div>

//                   <div className="order-date">
//                     <span className="order-label">
//                       Ordered On
//                     </span>
// <strong>
//   {formatDateTime(
//     order.created_at ||
//     order.created ||
//     order.order_date
//   )}
// </strong>
//                   </div>

//                 </div>

//                 {/* Order Information */}
//                 <div className="order-info">

//                   <div className="info-box">
//                     <span>💰 Total Amount</span>

//                     <strong>
//                       ₹
//                       {Number(
//                         order.total_amount || 0
//                       ).toFixed(2)}
//                     </strong>
//                   </div>

//                   <div className="info-box">
//                     <span>📦 Order Status</span>

//                     <span
//                       className={getStatusClass(
//                         order.status
//                       )}
//                     >
//                       {order.status || "Pending"}
//                     </span>
//                   </div>

//                   <div className="info-box">
//                     <span>💳 Payment</span>

//                     <span
//                       className={getStatusClass(
//                         order.payment_status
//                       )}
//                     >
//                       {order.payment_status ||
//                         (order.status === "confirmed"
//                           ? "Paid"
//                           : "Pending")}
//                     </span>
//                   </div>

//                 </div>

//                 {/* Address */}
//                 {order.address && (
//                   <div className="order-address">
//                     <span>📍 Delivery Address</span>

//                     <p>
//                       {order.address}
//                     </p>
//                   </div>
//                 )}

//                 {/* Bottom */}
//                 <div className="order-bottom">

//                   <span>
//                     {order.items?.length || 0} item
//                     {(order.items?.length || 0) !== 1
//                       ? "s"
//                       : ""}
//                   </span>

//                   <button
//                     className="view-order-btn"
//                     onClick={() =>
//                       navigate(`/orders/${order.id}`)
//                     }
//                   >
//                     View Details →
//                   </button>

//                 </div>

//               </div>
//             ))}

//           </div>
//         )}

//       </div>

//       <style>{`
//         * {
//           box-sizing: border-box;
//         }

//         .orders-page {
//           min-height: 100vh;
//           background: #f6f7fb;
//           padding: 40px 20px;
//         }

//         .orders-container {
//           width: 100%;
//           max-width: 1100px;
//           margin: 0 auto;
//         }

//         .orders-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           gap: 20px;
//           margin-bottom: 30px;
//         }

//         .orders-header h1 {
//           margin: 0 0 8px;
//           font-size: 32px;
//           color: #222;
//         }

//         .orders-header p {
//           margin: 0;
//           color: #777;
//           font-size: 15px;
//         }

//         .continue-shopping {
//           border: none;
//           background: #111827;
//           color: white;
//           padding: 12px 20px;
//           border-radius: 8px;
//           cursor: pointer;
//           font-size: 14px;
//         }

//         .continue-shopping:hover {
//           opacity: 0.9;
//         }

//         .orders-list {
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//         }

//         .order-card {
//           background: white;
//           border-radius: 14px;
//           padding: 24px;
//           box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
//           border: 1px solid #eee;
//         }

//         .order-top {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding-bottom: 18px;
//           border-bottom: 1px solid #eee;
//         }

//         .order-label {
//           display: block;
//           color: #888;
//           font-size: 12px;
//           margin-bottom: 5px;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .order-top h3 {
//           margin: 0;
//           font-size: 18px;
//           color: #222;
//         }

//         .order-date {
//           text-align: right;
//         }

//         .order-date strong {
//           color: #333;
//           font-size: 14px;
//         }

//         .order-info {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 15px;
//           padding: 20px 0;
//         }

//         .info-box {
//           background: #f8f9fc;
//           padding: 15px;
//           border-radius: 9px;
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }

//         .info-box > span:first-child {
//           color: #777;
//           font-size: 13px;
//         }

//         .info-box strong {
//           color: #222;
//           font-size: 18px;
//         }

//         .status {
//           width: fit-content;
//           padding: 5px 10px;
//           border-radius: 20px;
//           font-size: 12px;
//           font-weight: 600;
//           background: #eee;
//           color: #555;
//           text-transform: capitalize;
//         }

//         .status.success {
//           background: #e8f8ee;
//           color: #168044;
//         }

//         .status.pending {
//           background: #fff5d8;
//           color: #9a6900;
//         }

//         .status.danger {
//           background: #ffe7e7;
//           color: #c62828;
//         }

//         .order-address {
//           padding: 15px 0;
//           border-top: 1px solid #eee;
//           border-bottom: 1px solid #eee;
//         }

//         .order-address span {
//           display: block;
//           color: #777;
//           font-size: 13px;
//           margin-bottom: 6px;
//         }

//         .order-address p {
//           margin: 0;
//           color: #333;
//           font-size: 14px;
//           line-height: 1.5;
//         }

//         .order-bottom {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding-top: 18px;
//           color: #777;
//           font-size: 14px;
//         }

//         .view-order-btn {
//           border: none;
//           background: #111827;
//           color: white;
//           padding: 10px 18px;
//           border-radius: 7px;
//           cursor: pointer;
//           font-size: 14px;
//         }

//         .view-order-btn:hover {
//           opacity: 0.9;
//         }

//         .empty-orders {
//           background: white;
//           border-radius: 14px;
//           padding: 70px 20px;
//           text-align: center;
//           box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
//         }

//         .empty-icon {
//           font-size: 55px;
//           margin-bottom: 15px;
//         }

//         .empty-orders h2 {
//           margin: 0 0 10px;
//           color: #222;
//         }

//         .empty-orders p {
//           color: #777;
//           margin-bottom: 25px;
//         }

//         .shop-now-btn {
//           border: none;
//           background: #111827;
//           color: white;
//           padding: 12px 25px;
//           border-radius: 8px;
//           cursor: pointer;
//         }

//         .orders-error {
//           background: #ffe9e9;
//           color: #c62828;
//           padding: 15px;
//           border-radius: 8px;
//           margin-bottom: 20px;
//         }

//         .orders-loading {
//           min-height: 400px;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           align-items: center;
//           color: #777;
//         }

//         .spinner {
//           width: 35px;
//           height: 35px;
//           border: 4px solid #ddd;
//           border-top-color: #111827;
//           border-radius: 50%;
//           animation: spin 0.8s linear infinite;
//           margin-bottom: 15px;
//         }

//         @keyframes spin {
//           to {
//             transform: rotate(360deg);
//           }
//         }

//         @media (max-width: 768px) {
//           .orders-page {
//             padding: 25px 15px;
//           }

//           .orders-header {
//             flex-direction: column;
//             align-items: flex-start;
//           }

//           .continue-shopping {
//             width: 100%;
//           }

//           .orders-header h1 {
//             font-size: 27px;
//           }

//           .order-card {
//             padding: 18px;
//           }

//           .order-info {
//             grid-template-columns: 1fr;
//           }

//           .order-top {
//             align-items: flex-start;
//             gap: 15px;
//           }

//           .order-date {
//             text-align: left;
//           }
//         }

//         @media (max-width: 480px) {
//           .orders-page {
//             padding: 20px 10px;
//           }

//           .order-card {
//             padding: 15px;
//             border-radius: 10px;
//           }

//           .order-top {
//             flex-direction: column;
//           }

//           .order-bottom {
//             flex-direction: column;
//             align-items: stretch;
//             gap: 12px;
//           }

//           .view-order-btn {
//             width: 100%;
//           }

//           .empty-orders {
//             padding: 50px 15px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default OrdersPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

function OrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check whether logged-in user is admin
  const isAdmin =
    localStorage.getItem("isStaff") === "true" ||
    localStorage.getItem("isSuperuser") === "true";

  // Navigate to correct home page
  const goToHome = () => {
    if (isAdmin) {
      navigate("/homes");
    } else {
      navigate("/home");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/orders/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      // Supports paginated and normal responses
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.results)) {
        setOrders(data.results);
      } else if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "confirmed" || value === "delivered") {
      return "status success";
    }

    if (value === "pending") {
      return "status pending";
    }

    if (value === "cancelled" || value === "failed") {
      return "status danger";
    }

    return "status";
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-loading">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">

        {/* Header */}
        <div className="orders-header">
          <div>
            <h1>My Orders</h1>
            <p>View and track your recent orders</p>
          </div>

          <button
            className="continue-shopping"
            onClick={goToHome}
          >
            Continue Shopping
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="orders-error">
            {error}
          </div>
        )}

        {/* Empty Orders */}
        {!error && orders.length === 0 && (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <button
              onClick={goToHome}
              className="shop-now-btn"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders */}
        {orders.length > 0 && (
          <div className="orders-list">

            {orders.map((order) => (
              <div className="order-card" key={order.id}>

                {/* Order Top */}
                <div className="order-top">

                  <div>
                    <span className="order-label">
                      Order ID
                    </span>

                    <h3>
                      #{order.id}
                    </h3>
                  </div>

                  <div className="order-date">
                    <span className="order-label">
                      Ordered On
                    </span>

                    <strong>
                      {formatDateTime(
                        order.created_at ||
                        order.created ||
                        order.order_date
                      )}
                    </strong>
                  </div>

                </div>

                {/* Order Information */}
                <div className="order-info">

                  <div className="info-box">
                    <span>💰 Total Amount</span>

                    <strong>
                      ₹
                      {Number(
                        order.total_amount || 0
                      ).toFixed(2)}
                    </strong>
                  </div>

                  <div className="info-box">
                    <span>📦 Order Status</span>

                    <span
                      className={getStatusClass(
                        order.status
                      )}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>

                  <div className="info-box">
                    <span>💳 Payment</span>

                    <span
                      className={getStatusClass(
                        order.payment_status
                      )}
                    >
                      {order.payment_status ||
                        (order.status === "confirmed"
                          ? "Paid"
                          : "Pending")}
                    </span>
                  </div>

                </div>

                {/* Address */}
                {order.address && (
                  <div className="order-address">
                    <span>📍 Delivery Address</span>

                    <p>
                      {order.address}
                    </p>
                  </div>
                )}

                {/* Bottom */}
                <div className="order-bottom">

                  <span>
                    {order.items?.length || 0} item
                    {(order.items?.length || 0) !== 1
                      ? "s"
                      : ""}
                  </span>

                  <button
                    className="view-order-btn"
                    onClick={() =>
                      navigate(`/orders/${order.id}`)
                    }
                  >
                    View Details →
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .orders-page {
          min-height: 100vh;
          background: #f6f7fb;
          padding: 40px 20px;
        }

        .orders-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .orders-header h1 {
          margin: 0 0 8px;
          font-size: 32px;
          color: #222;
        }

        .orders-header p {
          margin: 0;
          color: #777;
          font-size: 15px;
        }

        .continue-shopping {
          border: none;
          background: #111827;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .continue-shopping:hover {
          opacity: 0.9;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .order-card {
          background: white;
          border-radius: 14px;
          padding: 24px;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
          border: 1px solid #eee;
        }

        .order-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 18px;
          border-bottom: 1px solid #eee;
        }

        .order-label {
          display: block;
          color: #888;
          font-size: 12px;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .order-top h3 {
          margin: 0;
          font-size: 18px;
          color: #222;
        }

        .order-date {
          text-align: right;
        }

        .order-date strong {
          color: #333;
          font-size: 14px;
        }

        .order-info {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          padding: 20px 0;
        }

        .info-box {
          background: #f8f9fc;
          padding: 15px;
          border-radius: 9px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-box > span:first-child {
          color: #777;
          font-size: 13px;
        }

        .info-box strong {
          color: #222;
          font-size: 18px;
        }

        .status {
          width: fit-content;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: #eee;
          color: #555;
          text-transform: capitalize;
        }

        .status.success {
          background: #e8f8ee;
          color: #168044;
        }

        .status.pending {
          background: #fff5d8;
          color: #9a6900;
        }

        .status.danger {
          background: #ffe7e7;
          color: #c62828;
        }

        .order-address {
          padding: 15px 0;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }

        .order-address span {
          display: block;
          color: #777;
          font-size: 13px;
          margin-bottom: 6px;
        }

        .order-address p {
          margin: 0;
          color: #333;
          font-size: 14px;
          line-height: 1.5;
        }

        .order-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 18px;
          color: #777;
          font-size: 14px;
        }

        .view-order-btn {
          border: none;
          background: #111827;
          color: white;
          padding: 10px 18px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 14px;
        }

        .view-order-btn:hover {
          opacity: 0.9;
        }

        .empty-orders {
          background: white;
          border-radius: 14px;
          padding: 70px 20px;
          text-align: center;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
        }

        .empty-icon {
          font-size: 55px;
          margin-bottom: 15px;
        }

        .empty-orders h2 {
          margin: 0 0 10px;
          color: #222;
        }

        .empty-orders p {
          color: #777;
          margin-bottom: 25px;
        }

        .shop-now-btn {
          border: none;
          background: #111827;
          color: white;
          padding: 12px 25px;
          border-radius: 8px;
          cursor: pointer;
        }

        .orders-error {
          background: #ffe9e9;
          color: #c62828;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .orders-loading {
          min-height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #777;
        }

        .spinner {
          width: 35px;
          height: 35px;
          border: 4px solid #ddd;
          border-top-color: #111827;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .orders-page {
            padding: 25px 15px;
          }

          .orders-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .continue-shopping {
            width: 100%;
          }

          .orders-header h1 {
            font-size: 27px;
          }

          .order-card {
            padding: 18px;
          }

          .order-info {
            grid-template-columns: 1fr;
          }

          .order-top {
            align-items: flex-start;
            gap: 15px;
          }

          .order-date {
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .orders-page {
            padding: 20px 10px;
          }

          .order-card {
            padding: 15px;
            border-radius: 10px;
          }

          .order-top {
            flex-direction: column;
          }

          .order-bottom {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .view-order-btn {
            width: 100%;
          }

          .empty-orders {
            padding: 50px 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default OrdersPage;