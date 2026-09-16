// import React, { useEffect, useState } from "react";

// const API = "http://127.0.0.1:8000/api";

// export default function AdminOrders() {
//   const [orders, setOrders] = useState([]);

//   const token = localStorage.getItem("accessToken");

//   const headers = {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   };

//   const loadOrders = async () => {
//     try {
//       const response = await fetch(`${API}/admin/orders/`, { headers });
//       const data = await response.json();

//       setOrders(Array.isArray(data) ? data : data.results || []);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   const updateStatus = async (id, status) => {
//     try {
//       const response = await fetch(`${API}/admin/orders/${id}/`, {
//         method: "PATCH",
//         headers,
//         body: JSON.stringify({ status }),
//       });

//       if (response.ok) {
//         loadOrders();
//       } else {
//         alert("Unable to update order");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="admin-page">
//       <h1>Orders</h1>
//       <p>Manage customer orders.</p>

//       <div className="admin-table-wrapper">
//         <table className="admin-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>User</th>
//               <th>Total</th>
//               <th>Status</th>
//               <th>Address</th>
//               <th>Update</th>
//             </tr>
//           </thead>

//           <tbody>
//             {orders.map((order) => (
//               <tr key={order.id}>
//                 <td>{order.id}</td>
//                 <td>{order.user}</td>
//                 <td>₹{order.total_amount}</td>
//                 <td>{order.status}</td>
//                 <td>{order.address}</td>

//                 <td>
//                   <select
//                     value={order.status}
//                     onChange={(e) =>
//                       updateStatus(order.id, e.target.value)
//                     }
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="confirmed">Confirmed</option>
//                     <option value="shipped">Shipped</option>
//                     <option value="delivered">Delivered</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("accessToken");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const loadOrders = async () => {
    try {
      const response = await fetch(`${API}/admin/orders/`, { headers });
      const data = await response.json();

      setOrders(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API}/admin/orders/${id}/`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        loadOrders();
      } else {
        alert("Unable to update order");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Format date and time
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="admin-page">
      <h1>Orders</h1>

      <p>Manage customer orders.</p>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Address</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                {/* ID */}
                <td>{order.id}</td>

                {/* USER */}
                <td>{order.user}</td>

                {/* TOTAL */}
                <td>₹{order.total_amount}</td>

                {/* STATUS */}
                <td>{order.status}</td>

                {/* ADDRESS */}
                <td>{order.address}</td>

                {/* CREATED AT */}
                <td>{formatDate(order.created_at)}</td>

                {/* UPDATED AT */}
                <td>{formatDate(order.updated_at)}</td>

                {/* UPDATE STATUS */}
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}