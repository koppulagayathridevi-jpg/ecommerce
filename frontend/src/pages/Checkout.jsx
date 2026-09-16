import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/cart/`, {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load cart"
        );
      }

      setCart(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getItems = () => {
    if (!cart) return [];

    if (Array.isArray(cart)) {
      return cart;
    }

    if (Array.isArray(cart.items)) {
      return cart.items;
    }

    if (Array.isArray(cart.results)) {
      return cart.results;
    }

    if (Array.isArray(cart.cart_items)) {
      return cart.cart_items;
    }

    return [];
  };

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

  const getName = (item) => {
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

  const items = getItems();

  const total = items.reduce((sum, item) => {
    const price = getPrice(item);
    const quantity = Number(item.quantity || 1);

    return sum + price * quantity;
  }, 0);

  const placeOrder = async () => {
    if (!address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      // -----------------------------------------
      // CREATE ORDER
      // -----------------------------------------

      const checkoutResponse = await fetch(
        `${API_URL}/checkout/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: address.trim(),
          }),
        }
      );

      const orderData =
        await checkoutResponse.json();

      if (!checkoutResponse.ok) {
        throw new Error(
          orderData.error ||
            orderData.detail ||
            "Failed to create order"
        );
      }

      console.log(
        "Order created:",
        orderData
      );

      const orderId = orderData.id;

      // -----------------------------------------
      // CREATE RAZORPAY ORDER
      // -----------------------------------------

      const paymentResponse = await fetch(
        `${API_URL}/payment/create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
          }),
        }
      );

      const paymentData =
        await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.error ||
            "Failed to create payment"
        );
      }

      console.log(
        "Payment created:",
        paymentData
      );

      // -----------------------------------------
      // RAZORPAY CHECKOUT
      // -----------------------------------------

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK is not loaded."
        );
      }

      const options = {
        key: paymentData.razorpay_key_id,

        amount: Math.round(
          Number(paymentData.amount) * 100
        ),

        currency: paymentData.currency,

        name: "My Ecommerce Store",

        description:
          `Payment for Order #${orderId}`,

        order_id:
          paymentData.razorpay_order_id,

        handler: async function (response) {
          try {
            // -----------------------------------
            // VERIFY PAYMENT
            // -----------------------------------

            const verifyResponse =
              await fetch(
                `${API_URL}/payment/verify/`,
                {
                  method: "POST",

                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify({
                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,
                  }),
                }
              );

            const verifyData =
              await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.error ||
                  "Payment verification failed"
              );
            }

            console.log(
              "Payment verified:",
              verifyData
            );

            alert(
              "Payment successful! 🎉"
            );

            navigate(
              `/orders/${orderId}`
            );
          } catch (err) {
            console.error(err);

            setError(
              err.message ||
                "Payment verification failed"
            );

            setPlacingOrder(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPlacingOrder(false);
          },
        },

        prefill: {
          name:
            localStorage.getItem(
              "username"
            ) || "",

          email:
            localStorage.getItem(
              "email"
            ) || "",
        },

        theme: {
          color: "#111827",
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();

    } catch (err) {
      console.error(
        "Checkout error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong"
      );

      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{checkoutStyles}</style>

        <div className="checkout-loading">
          <div className="checkout-spinner"></div>
          <h3>Loading checkout...</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{checkoutStyles}</style>

      <div className="checkout-page">

        {/* HEADER */}

        <div className="checkout-header">

          <button
            className="checkout-back"
            onClick={() => navigate("/cart")}
          >
            ← Back to Cart
          </button>

          <div>
            <h1>Checkout</h1>
            <p>
              Complete your order
            </p>
          </div>

        </div>

        {error && (
          <div className="checkout-error">
            ⚠ {error}
          </div>
        )}

        <div className="checkout-container">

          {/* LEFT SIDE */}

          <div className="checkout-left">

            {/* ADDRESS */}

            <div className="checkout-card">

              <div className="card-title">
                <span className="card-icon">
                  📍
                </span>

                <div>
                  <h2>
                    Delivery Address
                  </h2>

                  <p>
                    Where should we deliver
                    your order?
                  </p>
                </div>
              </div>

              <label>
                Address
              </label>

              <textarea
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                placeholder="Enter your complete delivery address"
                rows="5"
              />

            </div>

            {/* PAYMENT */}

            <div className="checkout-card">

              <div className="card-title">
                <span className="card-icon">
                  💳
                </span>

                <div>
                  <h2>
                    Payment Method
                  </h2>

                  <p>
                    Pay securely using
                    Razorpay
                  </p>
                </div>
              </div>

              <div className="razorpay-box">

                <div className="payment-symbol">
                  💳
                </div>

                <div>
                  <strong>
                    Razorpay
                  </strong>

                  <p>
                    UPI, Cards, Net Banking
                    & more
                  </p>
                </div>

                <span className="secure-badge">
                  🔒 Secure
                </span>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="checkout-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-items">

              {items.map((item) => {

                const price =
                  getPrice(item);

                const quantity =
                  Number(
                    item.quantity || 1
                  );

                return (
                  <div
                    className="summary-item"
                    key={item.id}
                  >

                    <div>
                      <strong>
                        {getName(item)}
                      </strong>

                      <span>
                        Qty: {quantity}
                      </span>
                    </div>

                    <strong>
                      ₹
                      {(
                        price *
                        quantity
                      ).toFixed(2)}
                    </strong>

                  </div>
                );
              })}

            </div>

            <hr />

            <div className="summary-row">
              <span>
                Subtotal
              </span>

              <strong>
                ₹{total.toFixed(2)}
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Delivery
              </span>

              <strong className="free">
                FREE
              </strong>
            </div>

            <div className="grand-total">

              <span>
                Total
              </span>

              <strong>
                ₹{total.toFixed(2)}
              </strong>

            </div>

            <button
              className="place-order-btn"
              onClick={placeOrder}
              disabled={
                placingOrder ||
                items.length === 0
              }
            >
              {placingOrder
                ? "Processing..."
                : `Pay ₹${total.toFixed(2)}`}
            </button>

            <p className="secure-text">
              🔒 Secure payment powered by
              Razorpay
            </p>

          </div>

        </div>

      </div>
    </>
  );
}

const checkoutStyles = `
.checkout-page,
.checkout-page * {
  box-sizing: border-box;
}

.checkout-page {
  min-height: 100vh;
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

.checkout-header {
  max-width: 1200px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  gap: 25px;
}

.checkout-back {
  border: none;
  background: white;
  padding: 11px 17px;
  border-radius: 9px;
  cursor: pointer;
  font-weight: 600;
}

.checkout-header h1 {
  margin: 0;
  font-size: 30px;
  color: #111827;
}

.checkout-header p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.checkout-container {
  max-width: 1200px;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 370px;
  gap: 25px;
  align-items: start;
}

.checkout-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.checkout-card,
.checkout-summary {
  background: white;
  border-radius: 15px;
  box-shadow:
    0 5px 25px rgba(0,0,0,.05);
}

.checkout-card {
  padding: 25px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 25px;
}

.card-icon {
  width: 43px;
  height: 43px;
  background: #f3f4f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title h2 {
  margin: 0;
  font-size: 18px;
}

.card-title p {
  margin: 4px 0 0;
  color: #9ca3af;
  font-size: 12px;
}

.checkout-card label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
}

.checkout-card textarea {
  width: 100%;
  resize: vertical;
  border: 1px solid #dfe3e8;
  border-radius: 9px;
  padding: 13px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
}

.checkout-card textarea:focus {
  border-color: #111827;
}

.razorpay-box {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 17px;
  display: flex;
  align-items: center;
  gap: 13px;
}

.payment-symbol {
  font-size: 25px;
}

.razorpay-box strong {
  font-size: 14px;
}

.razorpay-box p {
  margin: 4px 0 0;
  color: #9ca3af;
  font-size: 11px;
}

.secure-badge {
  margin-left: auto;
  color: #059669;
  font-size: 11px;
  font-weight: 700;
}

.checkout-summary {
  padding: 25px;
  position: sticky;
  top: 25px;
}

.checkout-summary h2 {
  margin: 0 0 22px;
  font-size: 19px;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.summary-item div {
  min-width: 0;
}

.summary-item strong {
  font-size: 13px;
}

.summary-item div strong {
  display: block;
}

.summary-item span {
  display: block;
  margin-top: 4px;
  color: #9ca3af;
  font-size: 11px;
}

.checkout-summary hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 22px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #6b7280;
  font-size: 14px;
}

.free {
  color: #059669;
}

.grand-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 22px 0;
}

.grand-total span {
  font-weight: 700;
}

.grand-total strong {
  font-size: 24px;
}

.place-order-btn {
  width: 100%;
  border: none;
  background: #111827;
  color: white;
  padding: 14px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.place-order-btn:hover:not(:disabled) {
  background: #000;
}

.place-order-btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.secure-text {
  text-align: center;
  color: #9ca3af;
  font-size: 10px;
  margin: 15px 0 0;
}

.checkout-error {
  max-width: 1200px;
  margin: 0 auto 20px;
  padding: 13px;
  border-radius: 9px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 13px;
}

.checkout-loading {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.checkout-spinner {
  width: 42px;
  height: 42px;
  border: 4px solid #e5e7eb;
  border-top-color: #111827;
  border-radius: 50%;
  animation: checkoutSpin .8s linear infinite;
}

@keyframes checkoutSpin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .checkout-container {
    grid-template-columns: 1fr;
  }

  .checkout-summary {
    position: static;
  }
}

@media (max-width: 600px) {
  .checkout-page {
    padding: 20px 14px;
  }

  .checkout-header {
    flex-direction: column;
    align-items: stretch;
  }

  .checkout-header h1 {
    font-size: 24px;
  }

  .checkout-back {
    width: 100%;
  }

  .checkout-card,
  .checkout-summary {
    padding: 18px;
  }

  .razorpay-box {
    align-items: flex-start;
  }

  .secure-badge {
    margin-left: auto;
  }
}

@media (max-width: 430px) {
  .checkout-page {
    padding: 15px 10px;
  }

  .checkout-card,
  .checkout-summary {
    border-radius: 12px;
  }

  .checkout-header h1 {
    font-size: 21px;
  }

  .grand-total strong {
    font-size: 21px;
  }
}
`;

export default Checkout;