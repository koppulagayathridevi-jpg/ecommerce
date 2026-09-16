// import React, { useEffect, useState } from "react";

// const API = "http://127.0.0.1:8000/api";

// export default function AdminCarts() {
//   const [carts, setCarts] = useState([]);

//   const token = localStorage.getItem("accessToken");

//   useEffect(() => {
//     fetch(`${API}/admin/carts/`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setCarts(Array.isArray(data) ? data : data.results || []);
//       })
//       .catch(console.error);
//   }, []);

//   return (
//     <div className="admin-page">
//       <h1>Carts</h1>
//       <p>View customer shopping carts.</p>

//       <table className="admin-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>User</th>
//             <th>Created</th>
//           </tr>
//         </thead>

//         <tbody>
//           {carts.map((cart) => (
//             <tr key={cart.id}>
//               <td>{cart.id}</td>
//               <td>{cart.user}</td>
//               <td>{cart.created_at || "-"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api";

export default function AdminCarts() {
  const [carts, setCarts] = useState([]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetch(`${API}/admin/carts/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCarts(Array.isArray(data) ? data : data.results || []);
      })
      .catch(console.error);
  }, []);

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

  const getItemCount = (cart) => {
    if (cart.items_count !== undefined) {
      return cart.items_count;
    }

    if (Array.isArray(cart.items)) {
      return cart.items.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
    }

    return 0;
  };

  return (
    <div className="admin-page">
      <h1>Carts</h1>

      <p>View customer shopping carts.</p>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Items</th>
              <th>Cart Total</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>

          <tbody>
            {carts.length > 0 ? (
              carts.map((cart) => (
                <tr key={cart.id}>
                  <td>{cart.id}</td>

                  {/* Show username instead of user ID */}
                  <td>{cart.username || cart.user || "-"}</td>

                  <td>{getItemCount(cart)}</td>

                  <td>
                    ₹
                    {cart.cart_total !== undefined
                      ? cart.cart_total
                      : cart.total_amount !== undefined
                      ? cart.total_amount
                      : "0.00"}
                  </td>

                  <td>{formatDate(cart.created_at)}</td>

                  <td>{formatDate(cart.updated_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No carts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}