// import React, { useEffect, useState } from "react";

// const API = "http://127.0.0.1:8000/api";

// export default function AdminPayments() {
//   const [payments, setPayments] = useState([]);

//   const token = localStorage.getItem("accessToken");

//   useEffect(() => {
//     fetch(`${API}/admin/payments/`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setPayments(Array.isArray(data) ? data : data.results || []);
//       })
//       .catch(console.error);
//   }, []);

//   return (
//     <div className="admin-page">
//       <h1>Payments</h1>
//       <p>View payment information.</p>

//       <table className="admin-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Order</th>
//             <th>Amount</th>
//             <th>Status</th>
//             <th>Razorpay Payment</th>
//           </tr>
//         </thead>

//         <tbody>
//           {payments.map((payment) => (
//             <tr key={payment.id}>
//               <td>{payment.id}</td>
//               <td>{payment.order}</td>
//               <td>₹{payment.amount}</td>
//               <td>{payment.status}</td>
//               <td>{payment.razorpay_payment_id || "-"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Fetch Payments
      const paymentsResponse = await fetch(
        `${API}/admin/payments/`,
        {
          headers,
        }
      );

      if (!paymentsResponse.ok) {
        throw new Error("Failed to fetch payments");
      }

      const paymentsData = await paymentsResponse.json();

      // Fetch Orders
      const ordersResponse = await fetch(
        `${API}/admin/orders/`,
        {
          headers,
        }
      );

      if (!ordersResponse.ok) {
        throw new Error("Failed to fetch orders");
      }

      const ordersData = await ordersResponse.json();

      const paymentsList = Array.isArray(paymentsData)
        ? paymentsData
        : paymentsData.results || [];

      const ordersList = Array.isArray(ordersData)
        ? ordersData
        : ordersData.results || [];

      console.log("========== PAYMENTS ==========");
      console.log("Payments:", paymentsList);

      console.log("========== ORDERS ==========");
      console.log("Orders:", ordersList);

      console.log("========== FIRST PAYMENT ==========");
      console.log(paymentsList[0]);

      console.log("========== FIRST ORDER ==========");
      console.log(ordersList[0]);

      setPayments(paymentsList);
      setOrders(ordersList);
    } catch (error) {
      console.error("Payment fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get user ID from order
  const getUserIdFromOrder = (orderId) => {
    const order = orders.find(
      (item) => String(item.id) === String(orderId)
    );

    if (!order) {
      return "-";
    }

    // Possible API formats
    if (order.user_id !== undefined && order.user_id !== null) {
      return order.user_id;
    }

    if (
      order.user !== undefined &&
      order.user !== null
    ) {
      // If user is an object
      if (typeof order.user === "object") {
        return (
          order.user.id ??
          order.user.user_id ??
          "-"
        );
      }

      // If user is directly an ID
      return order.user;
    }

    return "-";
  };

  // Format date
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-IN");
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Payments</h1>
        <p>Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1>Payments</h1>
          <p>View payment information.</p>
        </div>

        <button
          className="admin-btn"
          onClick={fetchData}
        >
          Refresh
        </button>
      </div>

      {/* Payments Table */}
      <div className="admin-table-wrapper">

        <table className="admin-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Order</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Razorpay Order</th>
              <th>Razorpay Payment</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>

          <tbody>

            {payments.length === 0 ? (
              <tr>
                <td colSpan="9">
                  No payments found.
                </td>
              </tr>
            ) : (
              payments.map((payment) => {

                const userId = getUserIdFromOrder(
                  payment.order
                );

                return (
                  <tr key={payment.id}>

                    {/* Payment ID */}
                    <td>
                      {payment.id}
                    </td>

                    {/* User ID */}
                    <td>
                      <strong>
                        {userId}
                      </strong>
                    </td>

                    {/* Order ID */}
                    <td>
                      {payment.order ?? "-"}
                    </td>

                    {/* Amount */}
                    <td>
                      ₹{payment.amount ?? "0"}
                    </td>

                    {/* Status */}
                    <td>
                      {payment.status ?? "-"}
                    </td>

                    {/* Razorpay Order ID */}
                    <td>
                      {payment.razorpay_order_id || "-"}
                    </td>

                    {/* Razorpay Payment ID */}
                    <td>
                      {payment.razorpay_payment_id || "-"}
                    </td>

                    {/* Created */}
                    <td>
                      {formatDate(payment.created_at)}
                    </td>

                    {/* Updated */}
                    <td>
                      {formatDate(payment.updated_at)}
                    </td>

                  </tr>
                );
              })
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}