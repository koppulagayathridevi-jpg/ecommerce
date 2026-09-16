// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// const API_URL = "http://127.0.0.1:8000/api";

// function OrderDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const token = localStorage.getItem("accessToken");

//   useEffect(() => {
//     fetchOrder();
//   }, [id]);

//   const fetchOrder = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const response = await fetch(`${API_URL}/orders/${id}/`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.detail || data.message || "Failed to load order details"
//         );
//       }

//       setOrder(data);
//     } catch (err) {
//       console.error("Order details error:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get order items from different possible serializer formats
//   const getItems = () => {
//     if (!order) return [];

//     if (Array.isArray(order.items)) {
//       return order.items;
//     }

//     if (Array.isArray(order.order_items)) {
//       return order.order_items;
//     }

//     if (Array.isArray(order.products)) {
//       return order.products;
//     }

//     return [];
//   };

//   // Get product name
//   const getProductName = (item) => {
//     if (item.product_name) {
//       return item.product_name;
//     }

//     if (item.product?.name) {
//       return item.product.name;
//     }

//     if (item.product?.title) {
//       return item.product.title;
//     }

//     if (typeof item.product === "string") {
//       return item.product;
//     }

//     return `Product #${item.product || ""}`;
//   };

//   // Get product price
//   const getProductPrice = (item) => {
//     return Number(
//       item.price ??
//         item.product_price ??
//         item.product?.price ??
//         0
//     );
//   };

//   // Get quantity
//   const getQuantity = (item) => {
//     return Number(item.quantity ?? 1);
//   };

//   // Get product image
//   const getProductImage = (item) => {
//     const image =
//       item.product_image ||
//       item.image ||
//       item.product?.image ||
//       item.product?.image_url;

//     if (!image) return null;

//     if (image.startsWith("http")) {
//       return image;
//     }

//     return `http://127.0.0.1:8000${image}`;
//   };

//   // Format date
//   const formatDate = (date) => {
//     if (!date) return "N/A";

//     return new Date(date).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // Status class
//   const getStatusClass = (status) => {
//     const value = String(status || "").toLowerCase();

//     if (
//       value === "confirmed" ||
//       value === "paid" ||
//       value === "delivered"
//     ) {
//       return "status-success";
//     }

//     if (
//       value === "pending" ||
//       value === "created" ||
//       value === "processing"
//     ) {
//       return "status-pending";
//     }

//     if (
//       value === "cancelled" ||
//       value === "failed"
//     ) {
//       return "status-danger";
//     }

//     return "status-default";
//   };

//   if (loading) {
//     return (
//       <div className="order-page">
//         <div className="order-loading">
//           <div className="spinner"></div>
//           <p>Loading order details...</p>
//         </div>

//         <style>{styles}</style>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="order-page">
//         <div className="order-error">
//           <h2>Unable to load order</h2>
//           <p>{error}</p>

//           <button onClick={() => navigate("/orders")}>
//             ← Back to Orders
//           </button>
//         </div>

//         <style>{styles}</style>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="order-page">
//         <div className="order-error">
//           <h2>Order not found</h2>

//           <button onClick={() => navigate("/orders")}>
//             ← Back to Orders
//           </button>
//         </div>

//         <style>{styles}</style>
//       </div>
//     );
//   }

//   const items = getItems();

//   const totalAmount = Number(
//     order.total_amount ??
//       order.total ??
//       order.amount ??
//       0
//   );

//   const orderStatus = order.status || "Pending";

//   const paymentStatus =
//     order.payment_status ||
//     order.payment?.status ||
//     (orderStatus.toLowerCase() === "confirmed"
//       ? "Paid"
//       : "Pending");

//   return (
//     <div className="order-page">
//       <div className="order-container">

//         {/* Header */}
//         <div className="order-header">
//           <button
//             className="back-button"
//             onClick={() => navigate("/orders")}
//           >
//             ← Back to Orders
//           </button>

//           <div>
//             <h1>Order Details</h1>
//             <p>
//               Order #{order.id}
//             </p>
//           </div>
//         </div>

//         {/* Order Information */}
//         <div className="info-grid">

//           <div className="info-card">
//             <span>Order ID</span>
//             <strong>#{order.id}</strong>
//           </div>

//           <div className="info-card">
//             <span>Order Date</span>
//             <strong>
//               {formatDate(
//                 order.created_at ||
//                   order.created ||
//                   order.date
//               )}
//             </strong>
//           </div>

//           <div className="info-card">
//             <span>Order Status</span>
//             <strong
//               className={`status ${getStatusClass(orderStatus)}`}
//             >
//               {String(orderStatus).toUpperCase()}
//             </strong>
//           </div>

//           <div className="info-card">
//             <span>Payment Status</span>
//             <strong
//               className={`status ${getStatusClass(paymentStatus)}`}
//             >
//               {String(paymentStatus).toUpperCase()}
//             </strong>
//           </div>

//         </div>

//         {/* Delivery Address */}
//         <div className="section-card">
//           <div className="section-title">
//             <h2>Delivery Address</h2>
//           </div>

//           <div className="address-box">
//             {order.address || "Address not available"}
//           </div>
//         </div>

//         {/* Products */}
//         <div className="section-card">
//           <div className="section-title">
//             <h2>Order Items</h2>
//             <span>
//               {items.length} item{items.length !== 1 ? "s" : ""}
//             </span>
//           </div>

//           {items.length === 0 ? (
//             <div className="empty-items">
//               No items found for this order.
//             </div>
//           ) : (
//             <div className="items-list">
//               {items.map((item, index) => {
//                 const price = getProductPrice(item);
//                 const quantity = getQuantity(item);
//                 const image = getProductImage(item);

//                 return (
//                   <div
//                     className="order-item"
//                     key={item.id || index}
//                   >

//                     {/* Product Image */}
//                     <div className="product-image">
//                       {image ? (
//                         <img
//                           src={image}
//                           alt={getProductName(item)}
//                         />
//                       ) : (
//                         <div className="image-placeholder">
//                           📦
//                         </div>
//                       )}
//                     </div>

//                     {/* Product Information */}
//                     <div className="product-info">
//                       <h3>
//                         {getProductName(item)}
//                       </h3>

//                       <p>
//                         Price: ₹{price.toFixed(2)}
//                       </p>

//                       <p>
//                         Quantity: {quantity}
//                       </p>
//                     </div>

//                     {/* Item Total */}
//                     <div className="item-total">
//                       ₹{(price * quantity).toFixed(2)}
//                     </div>

//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Order Summary */}
//         <div className="summary-card">

//           <div className="summary-row">
//             <span>Items</span>
//             <span>{items.length}</span>
//           </div>

//           <div className="summary-row">
//             <span>Subtotal</span>
//             <span>₹{totalAmount.toFixed(2)}</span>
//           </div>

//           <div className="summary-row">
//             <span>Delivery</span>
//             <span>Free</span>
//           </div>

//           <div className="summary-divider"></div>

//           <div className="summary-total">
//             <span>Total Amount</span>
//             <strong>
//               ₹{totalAmount.toFixed(2)}
//             </strong>
//           </div>

//         </div>

//         {/* Actions */}
//         <div className="order-actions">

//           <button
//             className="continue-button"
//             onClick={() => navigate("/home")}
//           >
//             Continue Shopping
//           </button>

//           <button
//             className="orders-button"
//             onClick={() => navigate("/orders")}
//           >
//             View All Orders
//           </button>

//         </div>

//       </div>

//       <style>{styles}</style>
//     </div>
//   );
// }

// const styles = `
// .order-page {
//   min-height: 100vh;
//   background: #f5f6f8;
//   padding: 30px 20px;
//   box-sizing: border-box;
// }

// .order-container {
//   width: 100%;
//   max-width: 1000px;
//   margin: 0 auto;
// }

// .order-header {
//   display: flex;
//   align-items: center;
//   gap: 20px;
//   margin-bottom: 25px;
// }

// .order-header h1 {
//   margin: 0;
//   font-size: 30px;
//   color: #222;
// }

// .order-header p {
//   margin: 5px 0 0;
//   color: #777;
// }

// .back-button {
//   border: none;
//   background: white;
//   color: #333;
//   padding: 11px 16px;
//   border-radius: 8px;
//   cursor: pointer;
//   font-size: 14px;
//   box-shadow: 0 2px 8px rgba(0,0,0,0.08);
// }

// .back-button:hover {
//   background: #eeeeee;
// }

// /* Information */

// .info-grid {
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 15px;
//   margin-bottom: 20px;
// }

// .info-card {
//   background: white;
//   border-radius: 10px;
//   padding: 18px;
//   box-shadow: 0 2px 8px rgba(0,0,0,0.06);
// }

// .info-card span {
//   display: block;
//   color: #777;
//   font-size: 13px;
//   margin-bottom: 8px;
// }

// .info-card strong {
//   font-size: 15px;
//   color: #222;
// }

// /* Status */

// .status {
//   font-size: 12px !important;
//   font-weight: 700;
// }

// .status-success {
//   color: #16803c !important;
// }

// .status-pending {
//   color: #c77700 !important;
// }

// .status-danger {
//   color: #d62828 !important;
// }

// .status-default {
//   color: #555 !important;
// }

// /* Cards */

// .section-card,
// .summary-card {
//   background: white;
//   border-radius: 12px;
//   padding: 22px;
//   margin-bottom: 20px;
//   box-shadow: 0 2px 10px rgba(0,0,0,0.06);
// }

// .section-title {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 18px;
// }

// .section-title h2 {
//   margin: 0;
//   font-size: 20px;
//   color: #222;
// }

// .section-title span {
//   color: #777;
//   font-size: 14px;
// }

// /* Address */

// .address-box {
//   background: #f7f7f7;
//   border-radius: 8px;
//   padding: 15px;
//   line-height: 1.6;
//   color: #444;
// }

// /* Items */

// .items-list {
//   display: flex;
//   flex-direction: column;
// }

// .order-item {
//   display: flex;
//   align-items: center;
//   gap: 18px;
//   padding: 16px 0;
//   border-bottom: 1px solid #eeeeee;
// }

// .order-item:last-child {
//   border-bottom: none;
// }

// .product-image {
//   width: 85px;
//   height: 85px;
//   flex-shrink: 0;
//   border-radius: 8px;
//   overflow: hidden;
//   background: #f3f3f3;
// }

// .product-image img {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// }

// .image-placeholder {
//   width: 100%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 32px;
// }

// .product-info {
//   flex: 1;
// }

// .product-info h3 {
//   margin: 0 0 8px;
//   font-size: 17px;
//   color: #222;
// }

// .product-info p {
//   margin: 3px 0;
//   color: #777;
//   font-size: 14px;
// }

// .item-total {
//   font-size: 17px;
//   font-weight: 700;
//   color: #222;
// }

// /* Summary */

// .summary-card {
//   max-width: 500px;
//   margin-left: auto;
// }

// .summary-row {
//   display: flex;
//   justify-content: space-between;
//   padding: 8px 0;
//   color: #555;
// }

// .summary-divider {
//   border-top: 1px solid #eeeeee;
//   margin: 12px 0;
// }

// .summary-total {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   font-size: 20px;
// }

// .summary-total strong {
//   color: #111;
// }

// /* Buttons */

// .order-actions {
//   display: flex;
//   justify-content: flex-end;
//   gap: 12px;
// }

// .continue-button,
// .orders-button {
//   padding: 12px 18px;
//   border: none;
//   border-radius: 8px;
//   cursor: pointer;
//   font-size: 14px;
//   font-weight: 600;
// }

// .continue-button {
//   background: #222;
//   color: white;
// }

// .orders-button {
//   background: white;
//   color: #222;
//   border: 1px solid #ddd;
// }

// /* Loading */

// .order-loading {
//   min-height: 70vh;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   color: #666;
// }

// .spinner {
//   width: 35px;
//   height: 35px;
//   border: 4px solid #ddd;
//   border-top: 4px solid #333;
//   border-radius: 50%;
//   animation: spin 0.8s linear infinite;
// }

// @keyframes spin {
//   to {
//     transform: rotate(360deg);
//   }
// }

// /* Error */

// .order-error {
//   background: white;
//   max-width: 500px;
//   margin: 80px auto;
//   padding: 35px;
//   text-align: center;
//   border-radius: 12px;
//   box-shadow: 0 2px 10px rgba(0,0,0,0.08);
// }

// .order-error h2 {
//   margin-top: 0;
// }

// .order-error p {
//   color: #777;
// }

// .order-error button {
//   border: none;
//   background: #222;
//   color: white;
//   padding: 11px 18px;
//   border-radius: 7px;
//   cursor: pointer;
// }

// .empty-items {
//   text-align: center;
//   color: #777;
//   padding: 30px;
// }

// /* Tablet */

// @media (max-width: 800px) {

//   .info-grid {
//     grid-template-columns: repeat(2, 1fr);
//   }

//   .order-header {
//     align-items: flex-start;
//     flex-direction: column;
//   }

// }

// /* Mobile */

// @media (max-width: 550px) {

//   .order-page {
//     padding: 20px 12px;
//   }

//   .order-header h1 {
//     font-size: 25px;
//   }

//   .info-grid {
//     grid-template-columns: 1fr;
//   }

//   .section-card,
//   .summary-card {
//     padding: 16px;
//   }

//   .order-item {
//     align-items: flex-start;
//     flex-wrap: wrap;
//   }

//   .product-image {
//     width: 70px;
//     height: 70px;
//   }

//   .product-info {
//     min-width: 0;
//   }

//   .product-info h3 {
//     font-size: 15px;
//   }

//   .item-total {
//     width: 100%;
//     text-align: right;
//     margin-top: -5px;
//   }

//   .order-actions {
//     flex-direction: column;
//   }

//   .continue-button,
//   .orders-button {
//     width: 100%;
//   }

//   .summary-total {
//     font-size: 18px;
//   }
// }
// `;

// export default OrderDetails;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get fresh token
  const getToken = () => localStorage.getItem("accessToken");

  // Check admin
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
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/orders/${id}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || "Failed to load order details"
        );
      }

      setOrder(data);
    } catch (err) {
      console.error("Order details error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get order items from different possible serializer formats
  const getItems = () => {
    if (!order) return [];

    if (Array.isArray(order.items)) {
      return order.items;
    }

    if (Array.isArray(order.order_items)) {
      return order.order_items;
    }

    if (Array.isArray(order.products)) {
      return order.products;
    }

    return [];
  };

  // Get product name
  const getProductName = (item) => {
    if (item.product_name) {
      return item.product_name;
    }

    if (item.product?.name) {
      return item.product.name;
    }

    if (item.product?.title) {
      return item.product.title;
    }

    if (typeof item.product === "string") {
      return item.product;
    }

    return `Product #${item.product || ""}`;
  };

  // Get product price
  const getProductPrice = (item) => {
    return Number(
      item.price ??
        item.product_price ??
        item.product?.price ??
        0
    );
  };

  // Get quantity
  const getQuantity = (item) => {
    return Number(item.quantity ?? 1);
  };

  // Get product image
  const getProductImage = (item) => {
    const image =
      item.product_image ||
      item.image ||
      item.product?.image ||
      item.product?.image_url;

    if (!image) return null;

    if (image.startsWith("http")) {
      return image;
    }

    return `http://127.0.0.1:8000${image}`;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status class
  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value === "confirmed" ||
      value === "paid" ||
      value === "delivered"
    ) {
      return "status-success";
    }

    if (
      value === "pending" ||
      value === "created" ||
      value === "processing"
    ) {
      return "status-pending";
    }

    if (
      value === "cancelled" ||
      value === "failed"
    ) {
      return "status-danger";
    }

    return "status-default";
  };

  if (loading) {
    return (
      <div className="order-page">
        <div className="order-loading">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-page">
        <div className="order-error">
          <h2>Unable to load order</h2>
          <p>{error}</p>

          <button onClick={() => navigate("/orders")}>
            ← Back to Orders
          </button>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-page">
        <div className="order-error">
          <h2>Order not found</h2>

          <button onClick={() => navigate("/orders")}>
            ← Back to Orders
          </button>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  const items = getItems();

  const totalAmount = Number(
    order.total_amount ??
      order.total ??
      order.amount ??
      0
  );

  const orderStatus = order.status || "Pending";

  const paymentStatus =
    order.payment_status ||
    order.payment?.status ||
    (orderStatus.toLowerCase() === "confirmed"
      ? "Paid"
      : "Pending");

  return (
    <div className="order-page">
      <div className="order-container">

        {/* Header */}
        <div className="order-header">
          <button
            className="back-button"
            onClick={() => navigate("/orders")}
          >
            ← Back to Orders
          </button>

          <div>
            <h1>Order Details</h1>
            <p>
              Order #{order.id}
            </p>
          </div>
        </div>

        {/* Order Information */}
        <div className="info-grid">

          <div className="info-card">
            <span>Order ID</span>
            <strong>#{order.id}</strong>
          </div>

          <div className="info-card">
            <span>Order Date</span>
            <strong>
              {formatDate(
                order.created_at ||
                  order.created ||
                  order.date
              )}
            </strong>
          </div>

          <div className="info-card">
            <span>Order Status</span>
            <strong
              className={`status ${getStatusClass(orderStatus)}`}
            >
              {String(orderStatus).toUpperCase()}
            </strong>
          </div>

          <div className="info-card">
            <span>Payment Status</span>
            <strong
              className={`status ${getStatusClass(paymentStatus)}`}
            >
              {String(paymentStatus).toUpperCase()}
            </strong>
          </div>

        </div>

        {/* Delivery Address */}
        <div className="section-card">
          <div className="section-title">
            <h2>Delivery Address</h2>
          </div>

          <div className="address-box">
            {order.address || "Address not available"}
          </div>
        </div>

        {/* Products */}
        <div className="section-card">
          <div className="section-title">
            <h2>Order Items</h2>

            <span>
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="empty-items">
              No items found for this order.
            </div>
          ) : (
            <div className="items-list">
              {items.map((item, index) => {
                const price = getProductPrice(item);
                const quantity = getQuantity(item);
                const image = getProductImage(item);

                return (
                  <div
                    className="order-item"
                    key={item.id || index}
                  >

                    {/* Product Image */}
                    <div className="product-image">
                      {image ? (
                        <img
                          src={image}
                          alt={getProductName(item)}
                        />
                      ) : (
                        <div className="image-placeholder">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Product Information */}
                    <div className="product-info">
                      <h3>
                        {getProductName(item)}
                      </h3>

                      <p>
                        Price: ₹{price.toFixed(2)}
                      </p>

                      <p>
                        Quantity: {quantity}
                      </p>
                    </div>

                    {/* Item Total */}
                    <div className="item-total">
                      ₹{(price * quantity).toFixed(2)}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="summary-card">

          <div className="summary-row">
            <span>Items</span>
            <span>{items.length}</span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>Free</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total Amount</span>
            <strong>
              ₹{totalAmount.toFixed(2)}
            </strong>
          </div>

        </div>

        {/* Actions */}
        <div className="order-actions">

          <button
            className="continue-button"
            onClick={goToHome}
          >
            Continue Shopping
          </button>

          <button
            className="orders-button"
            onClick={() => navigate("/orders")}
          >
            View All Orders
          </button>

        </div>

      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
.order-page {
  min-height: 100vh;
  background: #f5f6f8;
  padding: 30px 20px;
  box-sizing: border-box;
}

.order-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.order-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.order-header h1 {
  margin: 0;
  font-size: 30px;
  color: #222;
}

.order-header p {
  margin: 5px 0 0;
  color: #777;
}

.back-button {
  border: none;
  background: white;
  color: #333;
  padding: 11px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.back-button:hover {
  background: #eeeeee;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.info-card {
  background: white;
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.info-card span {
  display: block;
  color: #777;
  font-size: 13px;
  margin-bottom: 8px;
}

.info-card strong {
  font-size: 15px;
  color: #222;
}

.status {
  font-size: 12px !important;
  font-weight: 700;
}

.status-success {
  color: #16803c !important;
}

.status-pending {
  color: #c77700 !important;
}

.status-danger {
  color: #d62828 !important;
}

.status-default {
  color: #555 !important;
}

.section-card,
.summary-card {
  background: white;
  border-radius: 12px;
  padding: 22px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.section-title h2 {
  margin: 0;
  font-size: 20px;
  color: #222;
}

.section-title span {
  color: #777;
  font-size: 14px;
}

.address-box {
  background: #f7f7f7;
  border-radius: 8px;
  padding: 15px;
  line-height: 1.6;
  color: #444;
}

.items-list {
  display: flex;
  flex-direction: column;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 0;
  border-bottom: 1px solid #eeeeee;
}

.order-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 85px;
  height: 85px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f3f3;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.product-info {
  flex: 1;
}

.product-info h3 {
  margin: 0 0 8px;
  font-size: 17px;
  color: #222;
}

.product-info p {
  margin: 3px 0;
  color: #777;
  font-size: 14px;
}

.item-total {
  font-size: 17px;
  font-weight: 700;
  color: #222;
}

.summary-card {
  max-width: 500px;
  margin-left: auto;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: #555;
}

.summary-divider {
  border-top: 1px solid #eeeeee;
  margin: 12px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
}

.summary-total strong {
  color: #111;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.continue-button,
.orders-button {
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.continue-button {
  background: #222;
  color: white;
}

.orders-button {
  background: white;
  color: #222;
  border: 1px solid #ddd;
}

.order-loading {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
}

.spinner {
  width: 35px;
  height: 35px;
  border: 4px solid #ddd;
  border-top: 4px solid #333;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.order-error {
  background: white;
  max-width: 500px;
  margin: 80px auto;
  padding: 35px;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.order-error h2 {
  margin-top: 0;
}

.order-error p {
  color: #777;
}

.order-error button {
  border: none;
  background: #222;
  color: white;
  padding: 11px 18px;
  border-radius: 7px;
  cursor: pointer;
}

.empty-items {
  text-align: center;
  color: #777;
  padding: 30px;
}

@media (max-width: 800px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .order-header {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 550px) {
  .order-page {
    padding: 20px 12px;
  }

  .order-header h1 {
    font-size: 25px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .section-card,
  .summary-card {
    padding: 16px;
  }

  .order-item {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .product-image {
    width: 70px;
    height: 70px;
  }

  .product-info {
    min-width: 0;
  }

  .product-info h3 {
    font-size: 15px;
  }

  .item-total {
    width: 100%;
    text-align: right;
    margin-top: -5px;
  }

  .order-actions {
    flex-direction: column;
  }

  .continue-button,
  .orders-button {
    width: 100%;
  }

  .summary-total {
    font-size: 18px;
  }
}
`;

export default OrderDetails;