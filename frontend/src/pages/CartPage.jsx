// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API_URL = "http://127.0.0.1:8000/api";

// function CartPage() {
//   const navigate = useNavigate();

//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingId, setUpdatingId] = useState(null);
//   const [removingId, setRemovingId] = useState(null);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // =====================================================
//   // TOKEN
//   // =====================================================
//   const getToken = () => {
//     return localStorage.getItem("accessToken");
//   };

//   // =====================================================
//   // UNAUTHORIZED
//   // =====================================================
//   const handleUnauthorized = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     navigate("/login");
//   };

//   // =====================================================
//   // FETCH CART
//   // =====================================================
//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = getToken();

//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const response = await fetch(`${API_URL}/cart/`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const contentType =
//         response.headers.get("content-type") || "";

//       let data = {};

//       if (contentType.includes("application/json")) {
//         data = await response.json();
//       } else {
//         const text = await response.text();

//         console.error("Cart API response:", text);

//         throw new Error(
//           `Server returned ${response.status}`
//         );
//       }

//       console.log("🛒 Cart API response:", data);

//       if (response.status === 401) {
//         handleUnauthorized();
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(
//           data.detail ||
//             data.message ||
//             "Failed to load cart"
//         );
//       }

//       let items = [];

//       // Array response
//       if (Array.isArray(data)) {
//         items = data;
//       }

//       // { items: [] }
//       else if (Array.isArray(data.items)) {
//         items = data.items;
//       }

//       // { results: [] }
//       else if (Array.isArray(data.results)) {
//         items = data.results;
//       }

//       // { cart_items: [] }
//       else if (Array.isArray(data.cart_items)) {
//         items = data.cart_items;
//       }

//       console.log("🛒 Cart items:", items);

//       setCartItems(items);
//     } catch (err) {
//       console.error("Fetch cart error:", err);

//       setCartItems([]);
//       setError(
//         err.message || "Unable to load cart"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // LOAD CART
//   // =====================================================
//   useEffect(() => {
//     fetchCart();
//   }, []);

//   // =====================================================
//   // PRODUCT NAME
//   // =====================================================
//   const getProductName = (item) => {
//     if (item.product_name) {
//       return item.product_name;
//     }

//     if (
//       item.product &&
//       typeof item.product === "object"
//     ) {
//       return (
//         item.product.name ||
//         item.product.title ||
//         "Product"
//       );
//     }

//     return "Product";
//   };

//   // =====================================================
//   // PRODUCT PRICE
//   // =====================================================
//   const getPrice = (item) => {
//     if (item.product_price !== undefined) {
//       return Number(item.product_price);
//     }

//     if (item.price !== undefined) {
//       return Number(item.price);
//     }

//     if (
//       item.product &&
//       typeof item.product === "object"
//     ) {
//       return Number(item.product.price || 0);
//     }

//     return 0;
//   };

//   // =====================================================
//   // PRODUCT IMAGE
//   // =====================================================
//   const getImage = (item) => {
//     let image = null;

//     image =
//       item.product_image ||
//       item.image ||
//       item.image_url ||
//       null;

//     if (
//       !image &&
//       item.product &&
//       typeof item.product === "object"
//     ) {
//       image =
//         item.product.image ||
//         item.product.image_url ||
//         item.product.thumbnail ||
//         null;
//     }

//     if (!image) {
//       return "https://via.placeholder.com/180";
//     }

//     if (
//       image.startsWith("http://") ||
//       image.startsWith("https://")
//     ) {
//       return image;
//     }

//     if (image.startsWith("/")) {
//       return `http://127.0.0.1:8000${image}`;
//     }

//     return `http://127.0.0.1:8000/${image}`;
//   };

//   // =====================================================
//   // PRODUCT ID
//   // =====================================================
//   const getProductId = (item) => {
//     if (
//       item.product &&
//       typeof item.product === "object"
//     ) {
//       return item.product.id;
//     }

//     return item.product;
//   };

//   // =====================================================
//   // UPDATE QUANTITY
//   // =====================================================
//   const updateQuantity = async (
//     item,
//     newQuantity
//   ) => {
//     if (newQuantity < 1) {
//       return;
//     }

//     const token = getToken();

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       setUpdatingId(item.id);
//       setMessage("");
//       setError("");

//       const response = await fetch(
//         `${API_URL}/cart/items/${item.id}/`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             quantity: newQuantity,
//           }),
//         }
//       );

//       const contentType =
//         response.headers.get("content-type") || "";

//       let data = {};

//       if (contentType.includes("application/json")) {
//         data = await response.json();
//       }

//       if (response.status === 401) {
//         handleUnauthorized();
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(
//           data.detail ||
//             data.message ||
//             "Failed to update quantity"
//         );
//       }

//       await fetchCart();

//       setMessage("Quantity updated");

//       setTimeout(() => {
//         setMessage("");
//       }, 2000);
//     } catch (err) {
//       console.error(
//         "Quantity update error:",
//         err
//       );

//       setError(
//         err.message ||
//           "Failed to update quantity"
//       );
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   // =====================================================
//   // REMOVE ITEM
//   // =====================================================
//   const removeItem = async (itemId) => {
//     const token = getToken();

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       setRemovingId(itemId);
//       setMessage("");
//       setError("");

//       const response = await fetch(
//         `${API_URL}/cart/items/${itemId}/`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const contentType =
//         response.headers.get("content-type") || "";

//       let data = {};

//       if (contentType.includes("application/json")) {
//         data = await response.json();
//       }

//       if (response.status === 401) {
//         handleUnauthorized();
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(
//           data.detail ||
//             data.message ||
//             "Failed to remove item"
//         );
//       }

//       await fetchCart();

//       setMessage("Item removed from cart");

//       setTimeout(() => {
//         setMessage("");
//       }, 2000);
//     } catch (err) {
//       console.error(
//         "Remove item error:",
//         err
//       );

//       setError(
//         err.message ||
//           "Failed to remove item"
//       );
//     } finally {
//       setRemovingId(null);
//     }
//   };

//   // =====================================================
//   // TOTAL ITEMS
//   // =====================================================
//   const totalItems = cartItems.reduce(
//     (total, item) => {
//       return (
//         total +
//         Number(item.quantity || 1)
//       );
//     },
//     0
//   );

//   // =====================================================
//   // CART TOTAL
//   // =====================================================
//   const cartTotal = cartItems.reduce(
//     (total, item) => {
//       const price = getPrice(item);
//       const quantity = Number(
//         item.quantity || 1
//       );

//       return total + price * quantity;
//     },
//     0
//   );

//   // =====================================================
//   // LOADING
//   // =====================================================
//   if (loading) {
//     return (
//       <>
//         <style>{cartStyles}</style>

//         <div className="cart-page">
//           <div className="cart-loading">
//             <div className="loading-spinner"></div>
//             <h3>Loading your cart...</h3>
//             <p>Please wait</p>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // =====================================================
//   // PAGE
//   // =====================================================
//   return (
//     <>
//       <style>{cartStyles}</style>

//       <div className="cart-page">

//         {/* =================================================
//             HEADER
//         ================================================= */}
//         <div className="cart-header">

//           <button
//             className="back-btn"
//             onClick={() => navigate("/home")}
//           >
//             <span className="back-arrow">←</span>
//             Continue Shopping
//           </button>

//           <div className="cart-title-wrapper">
//             <div className="cart-title-icon">
//               🛒
//             </div>

//             <div>
//               <h1>Shopping Cart</h1>

//               {cartItems.length > 0 && (
//                 <p>
//                   {totalItems}{" "}
//                   {totalItems === 1
//                     ? "item"
//                     : "items"}{" "}
//                   in your cart
//                 </p>
//               )}
//             </div>
//           </div>

//         </div>

//         {/* =================================================
//             MESSAGES
//         ================================================= */}
//         {message && (
//           <div className="cart-message">
//             <span>✓</span>
//             {message}
//           </div>
//         )}

//         {error && (
//           <div className="cart-error">
//             <span>⚠</span>
//             {error}
//           </div>
//         )}

//         {/* =================================================
//             EMPTY CART
//         ================================================= */}
//         {cartItems.length === 0 ? (
//           <div className="empty-cart">

//             <div className="empty-cart-icon">
//               🛒
//             </div>

//             <h2>
//               Your cart is empty
//             </h2>

//             <p>
//               Looks like you haven't added
//               anything to your cart yet.
//             </p>

//             <button
//               className="shop-btn"
//               onClick={() => navigate("/home")}
//             >
//               Start Shopping
//             </button>

//           </div>
//         ) : (

//           /* =================================================
//              CART CONTENT
//           ================================================= */
//           <div className="cart-container">

//             {/* =============================================
//                 LEFT - CART ITEMS
//             ============================================= */}
//             <div className="cart-items">

//               <div className="cart-items-header">

//                 <div>
//                   <h2>Cart Items</h2>

//                   <p>
//                     Review your selected products
//                   </p>
//                 </div>

//                 <span className="items-count">
//                   {totalItems}{" "}
//                   {totalItems === 1
//                     ? "Item"
//                     : "Items"}
//                 </span>

//               </div>

//               {/* ===========================================
//                   ITEMS
//               =========================================== */}
//               <div className="cart-items-list">

//                 {cartItems.map((item) => {

//                   const price =
//                     getPrice(item);

//                   const quantity =
//                     Number(
//                       item.quantity || 1
//                     );

//                   const itemTotal =
//                     price * quantity;

//                   const isUpdating =
//                     updatingId === item.id;

//                   const isRemoving =
//                     removingId === item.id;

//                   return (
//                     <div
//                       className="cart-item"
//                       key={item.id}
//                     >

//                       {/* PRODUCT IMAGE */}
//                       <div className="cart-item-image">

//                         <img
//                           src={getImage(item)}
//                           alt={getProductName(item)}
//                           onError={(e) => {
//                             e.currentTarget.src =
//                               "https://via.placeholder.com/180";
//                           }}
//                         />

//                       </div>

//                       {/* PRODUCT DETAILS */}
//                       <div className="cart-item-details">

//                         <div className="product-info">

//                           <h3>
//                             {getProductName(item)}
//                           </h3>

//                           <p className="product-id">
//                             Product ID:{" "}
//                             {getProductId(item)}
//                           </p>

//                         </div>

//                         <div className="price-section">

//                           <span className="price-label">
//                             Price
//                           </span>

//                           <strong className="cart-item-price">
//                             ₹{price.toFixed(2)}
//                           </strong>

//                         </div>

//                         {/* QUANTITY */}
//                         <div className="quantity-section">

//                           <span className="quantity-label">
//                             Quantity
//                           </span>

//                           <div className="quantity-controls">

//                             <button
//                               className="quantity-btn"
//                               onClick={() =>
//                                 updateQuantity(
//                                   item,
//                                   quantity - 1
//                                 )
//                               }
//                               disabled={
//                                 quantity <= 1 ||
//                                 isUpdating ||
//                                 isRemoving
//                               }
//                             >
//                               −
//                             </button>

//                             <span className="quantity-value">
//                               {isUpdating
//                                 ? "..."
//                                 : quantity}
//                             </span>

//                             <button
//                               className="quantity-btn"
//                               onClick={() =>
//                                 updateQuantity(
//                                   item,
//                                   quantity + 1
//                                 )
//                               }
//                               disabled={
//                                 isUpdating ||
//                                 isRemoving
//                               }
//                             >
//                               +
//                             </button>

//                           </div>

//                         </div>

//                       </div>

//                       {/* ITEM TOTAL */}
//                       <div className="cart-item-total">

//                         <div className="total-label">
//                           Total
//                         </div>

//                         <strong>
//                           ₹{itemTotal.toFixed(2)}
//                         </strong>

//                         <button
//                           className="remove-btn"
//                           onClick={() =>
//                             removeItem(item.id)
//                           }
//                           disabled={
//                             isRemoving ||
//                             isUpdating
//                           }
//                         >
//                           {isRemoving
//                             ? "Removing..."
//                             : "Remove"}
//                         </button>

//                       </div>

//                     </div>
//                   );
//                 })}

//               </div>

//             </div>

//             {/* =============================================
//                 RIGHT - ORDER SUMMARY
//             ============================================= */}
//             <div className="cart-summary">

//               <div className="summary-header">
//                 <div className="summary-icon">
//                   🧾
//                 </div>

//                 <div>
//                   <h2>
//                     Order Summary
//                   </h2>

//                   <p>
//                     Your order details
//                   </p>
//                 </div>
//               </div>

//               <div className="summary-content">

//                 <div className="summary-row">
//                   <span>
//                     Items
//                   </span>

//                   <span>
//                     {totalItems}
//                   </span>
//                 </div>

//                 <div className="summary-row">
//                   <span>
//                     Subtotal
//                   </span>

//                   <span>
//                     ₹{cartTotal.toFixed(2)}
//                   </span>
//                 </div>

//                 <div className="summary-row">
//                   <span>
//                     Delivery
//                   </span>

//                   <span className="free-text">
//                     FREE
//                   </span>
//                 </div>

//                 <div className="delivery-note">
//                   🚚 Free delivery on your order
//                 </div>

//                 <hr />

//                 <div className="summary-total">

//                   <span>
//                     Total
//                   </span>

//                   <strong>
//                     ₹{cartTotal.toFixed(2)}
//                   </strong>

//                 </div>

//                 {/* CHECKOUT */}
//                 <button
//                   className="checkout-btn"
//                   onClick={() =>
//                     navigate("/checkout")
//                   }
//                 >
//                   <span>
//                     Proceed to Checkout
//                   </span>

//                   <span className="checkout-arrow">
//                     →
//                   </span>
//                 </button>

//                 {/* CONTINUE SHOPPING */}
//                 <button
//                   className="continue-btn"
//                   onClick={() =>
//                     navigate("/home")
//                   }
//                 >
//                   ← Continue Shopping
//                 </button>

//               </div>

//               <div className="secure-checkout">
//                 <span>🔒</span>

//                 <div>
//                   <strong>
//                     Secure Checkout
//                   </strong>

//                   <small>
//                     Your information is protected
//                   </small>
//                 </div>
//               </div>

//             </div>

//           </div>
//         )}

//       </div>
//     </>
//   );
// }

// /* =========================================================
//    INTERNAL CSS
// ========================================================= */

// const cartStyles = `
// /* ========================================================
//    RESET
// ======================================================== */

// .cart-page,
// .cart-page * {
//   box-sizing: border-box;
// }

// .cart-page {
//   min-height: 100vh;
//   width: 100%;
//   background: #f7f8fc;
//   padding: 35px 6%;
//   color: #1f2937;
//   font-family:
//     Inter,
//     -apple-system,
//     BlinkMacSystemFont,
//     "Segoe UI",
//     sans-serif;
// }

// /* ========================================================
//    HEADER
// ======================================================== */

// .cart-header {
//   max-width: 1250px;
//   margin: 0 auto 30px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 25px;
// }

// .back-btn {
//   border: none;
//   background: #ffffff;
//   color: #374151;
//   padding: 12px 18px;
//   border-radius: 10px;
//   font-size: 14px;
//   font-weight: 600;
//   cursor: pointer;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
//   transition: 0.2s ease;
// }

// .back-btn:hover {
//   transform: translateY(-1px);
//   box-shadow: 0 5px 16px rgba(0, 0, 0, 0.1);
// }

// .back-arrow {
//   margin-right: 7px;
//   font-size: 17px;
// }

// .cart-title-wrapper {
//   display: flex;
//   align-items: center;
//   gap: 14px;
// }

// .cart-title-icon {
//   width: 48px;
//   height: 48px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 13px;
//   background: #111827;
//   font-size: 23px;
// }

// .cart-header h1 {
//   margin: 0;
//   font-size: 30px;
//   font-weight: 750;
//   color: #111827;
// }

// .cart-header p {
//   margin: 4px 0 0;
//   color: #6b7280;
//   font-size: 13px;
// }

// /* ========================================================
//    MESSAGES
// ======================================================== */

// .cart-message,
// .cart-error {
//   max-width: 1250px;
//   margin: 0 auto 20px;
//   padding: 13px 17px;
//   border-radius: 10px;
//   font-size: 14px;
//   font-weight: 600;
// }

// .cart-message {
//   background: #ecfdf3;
//   color: #047857;
//   border: 1px solid #bbf7d0;
// }

// .cart-error {
//   background: #fef2f2;
//   color: #dc2626;
//   border: 1px solid #fecaca;
// }

// .cart-message span,
// .cart-error span {
//   margin-right: 8px;
// }

// /* ========================================================
//    LOADING
// ======================================================== */

// .cart-loading {
//   min-height: 70vh;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   text-align: center;
// }

// .cart-loading h3 {
//   margin: 15px 0 5px;
//   font-size: 18px;
// }

// .cart-loading p {
//   margin: 0;
//   color: #6b7280;
// }

// .loading-spinner {
//   width: 45px;
//   height: 45px;
//   border: 4px solid #e5e7eb;
//   border-top-color: #111827;
//   border-radius: 50%;
//   animation: cartSpin 0.8s linear infinite;
// }

// @keyframes cartSpin {
//   to {
//     transform: rotate(360deg);
//   }
// }

// /* ========================================================
//    EMPTY CART
// ======================================================== */

// .empty-cart {
//   max-width: 650px;
//   min-height: 55vh;
//   margin: 30px auto;
//   background: #ffffff;
//   border-radius: 18px;
//   padding: 70px 30px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   text-align: center;
//   box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
// }

// .empty-cart-icon {
//   width: 90px;
//   height: 90px;
//   border-radius: 50%;
//   background: #f3f4f6;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 42px;
//   margin-bottom: 22px;
// }

// .empty-cart h2 {
//   margin: 0 0 10px;
//   color: #111827;
//   font-size: 25px;
// }

// .empty-cart p {
//   max-width: 400px;
//   margin: 0 0 25px;
//   line-height: 1.6;
//   color: #6b7280;
//   font-size: 14px;
// }

// .shop-btn {
//   border: none;
//   background: #111827;
//   color: white;
//   padding: 13px 25px;
//   border-radius: 9px;
//   font-size: 14px;
//   font-weight: 700;
//   cursor: pointer;
//   transition: 0.2s ease;
// }

// .shop-btn:hover {
//   background: #000000;
//   transform: translateY(-1px);
// }

// /* ========================================================
//    CART CONTAINER
// ======================================================== */

// .cart-container {
//   max-width: 1250px;
//   margin: 0 auto;
//   display: grid;
//   grid-template-columns: minmax(0, 1fr) 370px;
//   gap: 25px;
//   align-items: start;
// }

// /* ========================================================
//    CART ITEMS
// ======================================================== */

// .cart-items {
//   background: #ffffff;
//   border-radius: 16px;
//   overflow: hidden;
//   box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
// }

// .cart-items-header {
//   padding: 22px 24px;
//   border-bottom: 1px solid #e5e7eb;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 15px;
// }

// .cart-items-header h2 {
//   margin: 0;
//   font-size: 19px;
//   color: #111827;
// }

// .cart-items-header p {
//   margin: 5px 0 0;
//   font-size: 12px;
//   color: #9ca3af;
// }

// .items-count {
//   background: #f3f4f6;
//   color: #374151;
//   padding: 7px 12px;
//   border-radius: 20px;
//   font-size: 12px;
//   font-weight: 700;
// }

// .cart-items-list {
//   width: 100%;
// }

// /* ========================================================
//    CART ITEM
// ======================================================== */

// .cart-item {
//   padding: 23px 24px;
//   display: grid;
//   grid-template-columns: 120px minmax(0, 1fr) 130px;
//   gap: 20px;
//   border-bottom: 1px solid #edf0f4;
//   transition: background 0.2s ease;
// }

// .cart-item:last-child {
//   border-bottom: none;
// }

// .cart-item:hover {
//   background: #fafafa;
// }

// /* ========================================================
//    PRODUCT IMAGE
// ======================================================== */

// .cart-item-image {
//   width: 120px;
//   height: 120px;
//   background: #f8fafc;
//   border-radius: 12px;
//   overflow: hidden;
//   border: 1px solid #eef0f3;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }

// .cart-item-image img {
//   width: 100%;
//   height: 100%;
//   object-fit: contain;
//   padding: 8px;
// }

// /* ========================================================
//    PRODUCT DETAILS
// ======================================================== */

// .cart-item-details {
//   min-width: 0;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   gap: 15px;
// }

// .product-info h3 {
//   margin: 0 0 6px;
//   font-size: 17px;
//   line-height: 1.35;
//   color: #111827;
//   font-weight: 700;
// }

// .product-id {
//   margin: 0;
//   color: #9ca3af;
//   font-size: 11px;
// }

// .price-section {
//   display: flex;
//   align-items: center;
//   gap: 9px;
// }

// .price-label,
// .quantity-label {
//   color: #9ca3af;
//   font-size: 12px;
// }

// .cart-item-price {
//   margin: 0;
//   color: #111827;
//   font-size: 16px;
//   font-weight: 700;
// }

// /* ========================================================
//    QUANTITY
// ======================================================== */

// .quantity-section {
//   display: flex;
//   align-items: center;
//   gap: 12px;
// }

// .quantity-controls {
//   display: flex;
//   align-items: center;
//   height: 34px;
//   border: 1px solid #dfe3e8;
//   border-radius: 8px;
//   overflow: hidden;
//   background: #ffffff;
// }

// .quantity-btn {
//   width: 34px;
//   height: 34px;
//   border: none;
//   background: #f8fafc;
//   color: #111827;
//   font-size: 18px;
//   font-weight: 700;
//   cursor: pointer;
//   transition: 0.15s ease;
// }

// .quantity-btn:hover:not(:disabled) {
//   background: #e5e7eb;
// }

// .quantity-btn:disabled {
//   opacity: 0.4;
//   cursor: not-allowed;
// }

// .quantity-value {
//   min-width: 40px;
//   text-align: center;
//   font-size: 14px;
//   font-weight: 700;
// }

// /* ========================================================
//    ITEM TOTAL
// ======================================================== */

// .cart-item-total {
//   display: flex;
//   flex-direction: column;
//   align-items: flex-end;
//   justify-content: space-between;
//   gap: 15px;
// }

// .total-label {
//   color: #9ca3af;
//   font-size: 11px;
// }

// .cart-item-total strong {
//   font-size: 17px;
//   color: #111827;
// }

// .remove-btn {
//   border: none;
//   background: transparent;
//   color: #dc2626;
//   font-size: 12px;
//   font-weight: 600;
//   cursor: pointer;
//   padding: 5px 0;
//   transition: 0.2s ease;
// }

// .remove-btn:hover:not(:disabled) {
//   color: #991b1b;
//   text-decoration: underline;
// }

// .remove-btn:disabled {
//   opacity: 0.5;
//   cursor: not-allowed;
// }

// /* ========================================================
//    ORDER SUMMARY
// ======================================================== */

// .cart-summary {
//   background: #ffffff;
//   border-radius: 16px;
//   overflow: hidden;
//   box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
//   position: sticky;
//   top: 25px;
// }

// .summary-header {
//   padding: 22px;
//   display: flex;
//   align-items: center;
//   gap: 13px;
//   border-bottom: 1px solid #edf0f4;
// }

// .summary-icon {
//   width: 42px;
//   height: 42px;
//   border-radius: 10px;
//   background: #f3f4f6;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 20px;
// }

// .summary-header h2 {
//   margin: 0;
//   font-size: 18px;
//   color: #111827;
// }

// .summary-header p {
//   margin: 4px 0 0;
//   color: #9ca3af;
//   font-size: 12px;
// }

// .summary-content {
//   padding: 22px;
// }

// .summary-row {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 16px;
//   color: #6b7280;
//   font-size: 14px;
// }

// .summary-row span:last-child {
//   color: #374151;
//   font-weight: 600;
// }

// .free-text {
//   color: #059669 !important;
//   font-weight: 700 !important;
// }

// .delivery-note {
//   margin: 18px 0;
//   padding: 11px 12px;
//   background: #f0fdf4;
//   color: #047857;
//   border-radius: 8px;
//   font-size: 12px;
//   font-weight: 600;
// }

// .cart-summary hr {
//   border: none;
//   border-top: 1px solid #e5e7eb;
//   margin: 20px 0;
// }

// .summary-total {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 22px;
// }

// .summary-total span {
//   color: #111827;
//   font-size: 16px;
//   font-weight: 700;
// }

// .summary-total strong {
//   color: #111827;
//   font-size: 24px;
//   font-weight: 800;
// }

// /* ========================================================
//    CHECKOUT BUTTON
// ======================================================== */

// .checkout-btn {
//   width: 100%;
//   border: none;
//   background: #111827;
//   color: #ffffff;
//   min-height: 48px;
//   padding: 13px 17px;
//   border-radius: 9px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   font-size: 14px;
//   font-weight: 700;
//   cursor: pointer;
//   transition: 0.2s ease;
// }

// .checkout-btn:hover {
//   background: #000000;
//   transform: translateY(-1px);
// }

// .checkout-arrow {
//   font-size: 19px;
// }

// /* ========================================================
//    CONTINUE BUTTON
// ======================================================== */

// .continue-btn {
//   width: 100%;
//   margin-top: 10px;
//   min-height: 44px;
//   border: 1px solid #dfe3e8;
//   background: #ffffff;
//   color: #374151;
//   border-radius: 9px;
//   font-size: 13px;
//   font-weight: 600;
//   cursor: pointer;
//   transition: 0.2s ease;
// }

// .continue-btn:hover {
//   background: #f9fafb;
//   border-color: #cbd5e1;
// }

// /* ========================================================
//    SECURE CHECKOUT
// ======================================================== */

// .secure-checkout {
//   padding: 15px 22px;
//   border-top: 1px solid #edf0f4;
//   background: #fafafa;
//   display: flex;
//   align-items: center;
//   gap: 10px;
// }

// .secure-checkout > span {
//   font-size: 17px;
// }

// .secure-checkout div {
//   display: flex;
//   flex-direction: column;
//   gap: 2px;
// }

// .secure-checkout strong {
//   color: #374151;
//   font-size: 11px;
// }

// .secure-checkout small {
//   color: #9ca3af;
//   font-size: 10px;
// }

// /* ========================================================
//    TABLET
// ======================================================== */

// @media (max-width: 1000px) {

//   .cart-page {
//     padding: 28px 4%;
//   }

//   .cart-container {
//     grid-template-columns: 1fr;
//   }

//   .cart-summary {
//     position: static;
//     width: 100%;
//   }

// }

// /* ========================================================
//    MOBILE
// ======================================================== */

// @media (max-width: 700px) {

//   .cart-page {
//     padding: 20px 15px;
//   }

//   .cart-header {
//     flex-direction: column-reverse;
//     align-items: stretch;
//     gap: 18px;
//     margin-bottom: 22px;
//   }

//   .cart-title-wrapper {
//     justify-content: center;
//   }

//   .cart-title-icon {
//     width: 43px;
//     height: 43px;
//     font-size: 20px;
//   }

//   .cart-header h1 {
//     font-size: 24px;
//   }

//   .back-btn {
//     width: 100%;
//     text-align: center;
//   }

//   .cart-items-header {
//     padding: 18px;
//   }

//   .cart-items-header h2 {
//     font-size: 17px;
//   }

//   .cart-item {
//     grid-template-columns: 90px 1fr;
//     gap: 14px;
//     padding: 18px;
//   }

//   .cart-item-image {
//     width: 90px;
//     height: 90px;
//   }

//   .cart-item-details {
//     gap: 10px;
//   }

//   .product-info h3 {
//     font-size: 15px;
//   }

//   .price-section {
//     gap: 5px;
//   }

//   .quantity-section {
//     gap: 7px;
//     flex-wrap: wrap;
//   }

//   .quantity-controls {
//     height: 32px;
//   }

//   .quantity-btn {
//     width: 32px;
//     height: 32px;
//   }

//   .cart-item-total {
//     grid-column: 1 / -1;
//     flex-direction: row;
//     align-items: center;
//     justify-content: space-between;
//     padding-top: 12px;
//     border-top: 1px solid #f0f1f3;
//   }

//   .cart-item-total strong {
//     font-size: 16px;
//   }

//   .total-label {
//     display: none;
//   }

//   .remove-btn {
//     font-size: 12px;
//   }

//   .cart-summary {
//     border-radius: 14px;
//   }

//   .summary-header {
//     padding: 18px;
//   }

//   .summary-content {
//     padding: 18px;
//   }

//   .empty-cart {
//     min-height: 55vh;
//     padding: 50px 20px;
//   }

// }

// /* ========================================================
//    SMALL MOBILE
// ======================================================== */

// @media (max-width: 430px) {

//   .cart-page {
//     padding: 15px 10px;
//   }

//   .cart-header h1 {
//     font-size: 21px;
//   }

//   .cart-title-icon {
//     width: 38px;
//     height: 38px;
//     font-size: 18px;
//   }

//   .cart-item {
//     grid-template-columns: 75px 1fr;
//     gap: 11px;
//     padding: 15px;
//   }

//   .cart-item-image {
//     width: 75px;
//     height: 75px;
//   }

//   .product-info h3 {
//     font-size: 14px;
//   }

//   .product-id {
//     font-size: 10px;
//   }

//   .cart-item-price {
//     font-size: 14px;
//   }

//   .quantity-label,
//   .price-label {
//     font-size: 10px;
//   }

//   .summary-total strong {
//     font-size: 21px;
//   }

//   .checkout-btn {
//     min-height: 46px;
//   }

// }
// `;

// export default CartPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

function CartPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // ADMIN CHECK
  // =====================================================
  const isAdmin =
    localStorage.getItem("isStaff") === "true" ||
    localStorage.getItem("isSuperuser") === "true";

  // =====================================================
  // GO TO CORRECT HOME
  // =====================================================
  const goToHome = () => {
    if (isAdmin) {
      navigate("/homes");
    } else {
      navigate("/home");
    }
  };

  // =====================================================
  // TOKEN
  // =====================================================
  const getToken = () => {
    return localStorage.getItem("accessToken");
  };

  // =====================================================
  // UNAUTHORIZED
  // =====================================================
  const handleUnauthorized = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  // =====================================================
  // FETCH CART
  // =====================================================
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/cart/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const contentType =
        response.headers.get("content-type") || "";

      let data = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error("Cart API response:", text);

        throw new Error(`Server returned ${response.status}`);
      }

      console.log("🛒 Cart API response:", data);

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Failed to load cart"
        );
      }

      let items = [];

      if (Array.isArray(data)) {
        items = data;
      } else if (Array.isArray(data.items)) {
        items = data.items;
      } else if (Array.isArray(data.results)) {
        items = data.results;
      } else if (Array.isArray(data.cart_items)) {
        items = data.cart_items;
      }

      console.log("🛒 Cart items:", items);

      setCartItems(items);
    } catch (err) {
      console.error("Fetch cart error:", err);

      setCartItems([]);
      setError(
        err.message || "Unable to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD CART
  // =====================================================
  useEffect(() => {
    fetchCart();
  }, []);

  // =====================================================
  // PRODUCT NAME
  // =====================================================
  const getProductName = (item) => {
    if (item.product_name) {
      return item.product_name;
    }

    if (
      item.product &&
      typeof item.product === "object"
    ) {
      return (
        item.product.name ||
        item.product.title ||
        "Product"
      );
    }

    return "Product";
  };

  // =====================================================
  // PRODUCT PRICE
  // =====================================================
  const getPrice = (item) => {
    if (item.product_price !== undefined) {
      return Number(item.product_price);
    }

    if (item.price !== undefined) {
      return Number(item.price);
    }

    if (
      item.product &&
      typeof item.product === "object"
    ) {
      return Number(item.product.price || 0);
    }

    return 0;
  };

  // =====================================================
  // PRODUCT IMAGE
  // =====================================================
  const getImage = (item) => {
    let image = null;

    image =
      item.product_image ||
      item.image ||
      item.image_url ||
      null;

    if (
      !image &&
      item.product &&
      typeof item.product === "object"
    ) {
      image =
        item.product.image ||
        item.product.image_url ||
        item.product.thumbnail ||
        null;
    }

    if (!image) {
      return "https://via.placeholder.com/180";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `http://127.0.0.1:8000${image}`;
    }

    return `http://127.0.0.1:8000/${image}`;
  };

  // =====================================================
  // PRODUCT ID
  // =====================================================
  const getProductId = (item) => {
    if (
      item.product &&
      typeof item.product === "object"
    ) {
      return item.product.id;
    }

    return item.product;
  };

  // =====================================================
  // UPDATE QUANTITY
  // =====================================================
  const updateQuantity = async (
    item,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setUpdatingId(item.id);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/cart/items/${item.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: newQuantity,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Failed to update quantity"
        );
      }

      await fetchCart();

      setMessage("Quantity updated");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (err) {
      console.error(
        "Quantity update error:",
        err
      );

      setError(
        err.message ||
          "Failed to update quantity"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================
  const removeItem = async (itemId) => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setRemovingId(itemId);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/cart/items/${itemId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Failed to remove item"
        );
      }

      await fetchCart();

      setMessage("Item removed from cart");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (err) {
      console.error(
        "Remove item error:",
        err
      );

      setError(
        err.message ||
          "Failed to remove item"
      );
    } finally {
      setRemovingId(null);
    }
  };

  // =====================================================
  // TOTAL ITEMS
  // =====================================================
  const totalItems = cartItems.reduce(
    (total, item) => {
      return (
        total +
        Number(item.quantity || 1)
      );
    },
    0
  );

  // =====================================================
  // CART TOTAL
  // =====================================================
  const cartTotal = cartItems.reduce(
    (total, item) => {
      const price = getPrice(item);
      const quantity = Number(
        item.quantity || 1
      );

      return total + price * quantity;
    },
    0
  );

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <>
        <style>{cartStyles}</style>

        <div className="cart-page">
          <div className="cart-loading">
            <div className="loading-spinner"></div>
            <h3>Loading your cart...</h3>
            <p>Please wait</p>
          </div>
        </div>
      </>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================
  return (
    <>
      <style>{cartStyles}</style>

      <div className="cart-page">

        {/* HEADER */}
        <div className="cart-header">

          <button
            className="back-btn"
            onClick={goToHome}
          >
            <span className="back-arrow">←</span>
            Continue Shopping
          </button>

          <div className="cart-title-wrapper">

            <div className="cart-title-icon">
              🛒
            </div>

            <div>
              <h1>Shopping Cart</h1>

              {cartItems.length > 0 && (
                <p>
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "item"
                    : "items"}{" "}
                  in your cart
                </p>
              )}
            </div>

          </div>

        </div>

        {/* MESSAGES */}
        {message && (
          <div className="cart-message">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="cart-error">
            <span>⚠</span>
            {error}
          </div>
        )}

        {/* EMPTY CART */}
        {cartItems.length === 0 ? (
          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Looks like you haven't added
              anything to your cart yet.
            </p>

            <button
              className="shop-btn"
              onClick={goToHome}
            >
              Start Shopping
            </button>

          </div>
        ) : (

          /* CART CONTENT */
          <div className="cart-container">

            {/* LEFT */}
            <div className="cart-items">

              <div className="cart-items-header">

                <div>
                  <h2>Cart Items</h2>

                  <p>
                    Review your selected products
                  </p>
                </div>

                <span className="items-count">
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "Item"
                    : "Items"}
                </span>

              </div>

              <div className="cart-items-list">

                {cartItems.map((item) => {

                  const price =
                    getPrice(item);

                  const quantity =
                    Number(
                      item.quantity || 1
                    );

                  const itemTotal =
                    price * quantity;

                  const isUpdating =
                    updatingId === item.id;

                  const isRemoving =
                    removingId === item.id;

                  return (
                    <div
                      className="cart-item"
                      key={item.id}
                    >

                      {/* IMAGE */}
                      <div className="cart-item-image">

                        <img
                          src={getImage(item)}
                          alt={getProductName(item)}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/180";
                          }}
                        />

                      </div>

                      {/* DETAILS */}
                      <div className="cart-item-details">

                        <div className="product-info">

                          <h3>
                            {getProductName(item)}
                          </h3>

                          <p className="product-id">
                            Product ID:{" "}
                            {getProductId(item)}
                          </p>

                        </div>

                        <div className="price-section">

                          <span className="price-label">
                            Price
                          </span>

                          <strong className="cart-item-price">
                            ₹{price.toFixed(2)}
                          </strong>

                        </div>

                        {/* QUANTITY */}
                        <div className="quantity-section">

                          <span className="quantity-label">
                            Quantity
                          </span>

                          <div className="quantity-controls">

                            <button
                              className="quantity-btn"
                              onClick={() =>
                                updateQuantity(
                                  item,
                                  quantity - 1
                                )
                              }
                              disabled={
                                quantity <= 1 ||
                                isUpdating ||
                                isRemoving
                              }
                            >
                              −
                            </button>

                            <span className="quantity-value">
                              {isUpdating
                                ? "..."
                                : quantity}
                            </span>

                            <button
                              className="quantity-btn"
                              onClick={() =>
                                updateQuantity(
                                  item,
                                  quantity + 1
                                )
                              }
                              disabled={
                                isUpdating ||
                                isRemoving
                              }
                            >
                              +
                            </button>

                          </div>

                        </div>

                      </div>

                      {/* TOTAL */}
                      <div className="cart-item-total">

                        <div className="total-label">
                          Total
                        </div>

                        <strong>
                          ₹{itemTotal.toFixed(2)}
                        </strong>

                        <button
                          className="remove-btn"
                          onClick={() =>
                            removeItem(item.id)
                          }
                          disabled={
                            isRemoving ||
                            isUpdating
                          }
                        >
                          {isRemoving
                            ? "Removing..."
                            : "Remove"}
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            {/* RIGHT */}
            <div className="cart-summary">

              <div className="summary-header">

                <div className="summary-icon">
                  🧾
                </div>

                <div>
                  <h2>
                    Order Summary
                  </h2>

                  <p>
                    Your order details
                  </p>
                </div>

              </div>

              <div className="summary-content">

                <div className="summary-row">
                  <span>
                    Items
                  </span>

                  <span>
                    {totalItems}
                  </span>
                </div>

                <div className="summary-row">
                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="summary-row">
                  <span>
                    Delivery
                  </span>

                  <span className="free-text">
                    FREE
                  </span>
                </div>

                <div className="delivery-note">
                  🚚 Free delivery on your order
                </div>

                <hr />

                <div className="summary-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹{cartTotal.toFixed(2)}
                  </strong>

                </div>

                {/* CHECKOUT */}
                <button
                  className="checkout-btn"
                  onClick={() =>
                    navigate("/checkout")
                  }
                >
                  <span>
                    Proceed to Checkout
                  </span>

                  <span className="checkout-arrow">
                    →
                  </span>
                </button>

                {/* CONTINUE SHOPPING */}
                <button
                  className="continue-btn"
                  onClick={goToHome}
                >
                  ← Continue Shopping
                </button>

              </div>

              <div className="secure-checkout">

                <span>🔒</span>

                <div>
                  <strong>
                    Secure Checkout
                  </strong>

                  <small>
                    Your information is protected
                  </small>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </>
  );
}

/* =========================================================
   CSS
   ========================================================= */

const cartStyles = `
.cart-page,
.cart-page * {
  box-sizing: border-box;
}

.cart-page {
  min-height: 100vh;
  width: 100%;
  background: #f7f8fc;
  padding: 35px 6%;
  color: #1f2937;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.cart-header {
  max-width: 1250px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
}

.back-btn {
  border: none;
  background: #ffffff;
  color: #374151;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  transition: 0.2s ease;
}

.back-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.1);
}

.back-arrow {
  margin-right: 7px;
  font-size: 17px;
}

.cart-title-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
}

.cart-title-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  background: #111827;
  font-size: 23px;
}

.cart-header h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 750;
  color: #111827;
}

.cart-header p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.cart-message,
.cart-error {
  max-width: 1250px;
  margin: 0 auto 20px;
  padding: 13px 17px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
}

.cart-message {
  background: #ecfdf3;
  color: #047857;
  border: 1px solid #bbf7d0;
}

.cart-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.cart-message span,
.cart-error span {
  margin-right: 8px;
}

.cart-loading {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.cart-loading h3 {
  margin: 15px 0 5px;
  font-size: 18px;
}

.cart-loading p {
  margin: 0;
  color: #6b7280;
}

.loading-spinner {
  width: 45px;
  height: 45px;
  border: 4px solid #e5e7eb;
  border-top-color: #111827;
  border-radius: 50%;
  animation: cartSpin 0.8s linear infinite;
}

@keyframes cartSpin {
  to {
    transform: rotate(360deg);
  }
}

.empty-cart {
  max-width: 650px;
  min-height: 55vh;
  margin: 30px auto;
  background: #ffffff;
  border-radius: 18px;
  padding: 70px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.empty-cart-icon {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  margin-bottom: 22px;
}

.empty-cart h2 {
  margin: 0 0 10px;
  color: #111827;
  font-size: 25px;
}

.empty-cart p {
  max-width: 400px;
  margin: 0 0 25px;
  line-height: 1.6;
  color: #6b7280;
  font-size: 14px;
}

.shop-btn {
  border: none;
  background: #111827;
  color: white;
  padding: 13px 25px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.shop-btn:hover {
  background: #000000;
  transform: translateY(-1px);
}

.cart-container {
  max-width: 1250px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 370px;
  gap: 25px;
  align-items: start;
}

.cart-items {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
}

.cart-items-header {
  padding: 22px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.cart-items-header h2 {
  margin: 0;
  font-size: 19px;
  color: #111827;
}

.cart-items-header p {
  margin: 5px 0 0;
  font-size: 12px;
  color: #9ca3af;
}

.items-count {
  background: #f3f4f6;
  color: #374151;
  padding: 7px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.cart-items-list {
  width: 100%;
}

.cart-item {
  padding: 23px 24px;
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) 130px;
  gap: 20px;
  border-bottom: 1px solid #edf0f4;
  transition: background 0.2s ease;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item:hover {
  background: #fafafa;
}

.cart-item-image {
  width: 120px;
  height: 120px;
  background: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eef0f3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.cart-item-details {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 15px;
}

.product-info h3 {
  margin: 0 0 6px;
  font-size: 17px;
  line-height: 1.35;
  color: #111827;
  font-weight: 700;
}

.product-id {
  margin: 0;
  color: #9ca3af;
  font-size: 11px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 9px;
}

.price-label,
.quantity-label {
  color: #9ca3af;
  font-size: 12px;
}

.cart-item-price {
  margin: 0;
  color: #111827;
  font-size: 16px;
  font-weight: 700;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  height: 34px;
  border: 1px solid #dfe3e8;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
}

.quantity-btn {
  width: 34px;
  height: 34px;
  border: none;
  background: #f8fafc;
  color: #111827;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.15s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.quantity-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity-value {
  min-width: 40px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
}

.cart-item-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 15px;
}

.total-label {
  color: #9ca3af;
  font-size: 11px;
}

.cart-item-total strong {
  font-size: 17px;
  color: #111827;
}

.remove-btn {
  border: none;
  background: transparent;
  color: #dc2626;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 5px 0;
  transition: 0.2s ease;
}

.remove-btn:hover:not(:disabled) {
  color: #991b1b;
  text-decoration: underline;
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-summary {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 25px;
}

.summary-header {
  padding: 22px;
  display: flex;
  align-items: center;
  gap: 13px;
  border-bottom: 1px solid #edf0f4;
}

.summary-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.summary-header h2 {
  margin: 0;
  font-size: 18px;
  color: #111827;
}

.summary-header p {
  margin: 4px 0 0;
  color: #9ca3af;
  font-size: 12px;
}

.summary-content {
  padding: 22px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  color: #6b7280;
  font-size: 14px;
}

.summary-row span:last-child {
  color: #374151;
  font-weight: 600;
}

.free-text {
  color: #059669 !important;
  font-weight: 700 !important;
}

.delivery-note {
  margin: 18px 0;
  padding: 11px 12px;
  background: #f0fdf4;
  color: #047857;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.cart-summary hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 20px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.summary-total span {
  color: #111827;
  font-size: 16px;
  font-weight: 700;
}

.summary-total strong {
  color: #111827;
  font-size: 24px;
  font-weight: 800;
}

.checkout-btn {
  width: 100%;
  border: none;
  background: #111827;
  color: #ffffff;
  min-height: 48px;
  padding: 13px 17px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.checkout-btn:hover {
  background: #000000;
  transform: translateY(-1px);
}

.checkout-arrow {
  font-size: 19px;
}

.continue-btn {
  width: 100%;
  margin-top: 10px;
  min-height: 44px;
  border: 1px solid #dfe3e8;
  background: #ffffff;
  color: #374151;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.continue-btn:hover {
  background: #f9fafb;
  border-color: #cbd5e1;
}

.secure-checkout {
  padding: 15px 22px;
  border-top: 1px solid #edf0f4;
  background: #fafafa;
  display: flex;
  align-items: center;
  gap: 10px;
}

.secure-checkout > span {
  font-size: 17px;
}

.secure-checkout div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.secure-checkout strong {
  color: #374151;
  font-size: 11px;
}

.secure-checkout small {
  color: #9ca3af;
  font-size: 10px;
}

@media (max-width: 1000px) {
  .cart-page {
    padding: 28px 4%;
  }

  .cart-container {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
    width: 100%;
  }
}

@media (max-width: 700px) {
  .cart-page {
    padding: 20px 15px;
  }

  .cart-header {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 18px;
    margin-bottom: 22px;
  }

  .cart-title-wrapper {
    justify-content: center;
  }

  .cart-title-icon {
    width: 43px;
    height: 43px;
    font-size: 20px;
  }

  .cart-header h1 {
    font-size: 24px;
  }

  .back-btn {
    width: 100%;
    text-align: center;
  }

  .cart-items-header {
    padding: 18px;
  }

  .cart-items-header h2 {
    font-size: 17px;
  }

  .cart-item {
    grid-template-columns: 90px 1fr;
    gap: 14px;
    padding: 18px;
  }

  .cart-item-image {
    width: 90px;
    height: 90px;
  }

  .cart-item-details {
    gap: 10px;
  }

  .product-info h3 {
    font-size: 15px;
  }

  .price-section {
    gap: 5px;
  }

  .quantity-section {
    gap: 7px;
    flex-wrap: wrap;
  }

  .quantity-controls {
    height: 32px;
  }

  .quantity-btn {
    width: 32px;
    height: 32px;
  }

  .cart-item-total {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid #f0f1f3;
  }

  .cart-item-total strong {
    font-size: 16px;
  }

  .total-label {
    display: none;
  }

  .remove-btn {
    font-size: 12px;
  }

  .cart-summary {
    border-radius: 14px;
  }

  .summary-header {
    padding: 18px;
  }

  .summary-content {
    padding: 18px;
  }

  .empty-cart {
    min-height: 55vh;
    padding: 50px 20px;
  }
}

@media (max-width: 430px) {
  .cart-page {
    padding: 15px 10px;
  }

  .cart-header h1 {
    font-size: 21px;
  }

  .cart-title-icon {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }

  .cart-item {
    grid-template-columns: 75px 1fr;
    gap: 11px;
    padding: 15px;
  }

  .cart-item-image {
    width: 75px;
    height: 75px;
  }

  .product-info h3 {
    font-size: 14px;
  }

  .product-id {
    font-size: 10px;
  }

  .cart-item-price {
    font-size: 14px;
  }

  .quantity-label,
  .price-label {
    font-size: 10px;
  }

  .summary-total strong {
    font-size: 21px;
  }

  .checkout-btn {
    min-height: 46px;
  }
}
`;

export default CartPage;