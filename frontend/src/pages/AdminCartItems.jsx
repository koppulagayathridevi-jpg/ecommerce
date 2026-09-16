import React, { useEffect, useState } from "react";
import "./AdminCartItems.css";
const API = "http://127.0.0.1:8000/api";

export default function AdminCartItems() {
  const [items, setItems] = useState([]);

  const token = localStorage.getItem("accessToken");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetch(`${API}/admin/cart-items/`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : data.results || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="admin-page">
      <h1>Cart Items</h1>
      <p>View customer cart items.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cart</th>
            <th>Product</th>
            <th>Quantity</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.cart}</td>
              <td>{item.product}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}