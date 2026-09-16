import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api";

export default function AdminOrderItems() {
  const [items, setItems] = useState([]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetch(`${API}/admin/order-items/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : data.results || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="admin-page">
      <h1>Order Items</h1>
      <p>View individual items inside customer orders.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Order</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.order}</td>
              <td>{item.product}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}