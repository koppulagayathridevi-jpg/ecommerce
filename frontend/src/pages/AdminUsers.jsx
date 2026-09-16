import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetch(`${API}/admin/users/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : data.results || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="admin-page">
      <h1>Users</h1>
      <p>View registered customers and staff users.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Staff</th>
            <th>Superuser</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.is_staff ? "Yes" : "No"}</td>
              <td>{user.is_superuser ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}