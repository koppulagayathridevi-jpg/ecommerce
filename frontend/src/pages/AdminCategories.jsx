import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api";

export default function AdminCategories() {
  const token = localStorage.getItem("accessToken");

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API}/categories/`, { headers });
      const data = await response.json();

      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `${API}/categories/${editingId}/`
      : `${API}/categories/`;

    const response = await fetch(url, {
      method: editingId ? "PATCH" : "POST",
      headers,
      body: JSON.stringify({
        name,
        description,
      }),
    });

    if (response.ok) {
      alert(editingId ? "Category updated" : "Category created");

      setName("");
      setDescription("");
      setEditingId(null);

      loadCategories();
    } else {
      alert("Unable to save category");
    }
  };

  const editCategory = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || "");
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    const response = await fetch(`${API}/categories/${id}/`, {
      method: "DELETE",
      headers,
    });

    if (response.ok) {
      loadCategories();
    }
  };

  return (
    <div className="admin-page">
      <h1>Categories</h1>
      <p>Manage product categories.</p>

      <form onSubmit={submit} className="admin-form">
        <input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">
          {editingId ? "Update Category" : "Add Category"}
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button onClick={() => editCategory(category)}>
                  Edit
                </button>

                <button onClick={() => deleteCategory(category.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}