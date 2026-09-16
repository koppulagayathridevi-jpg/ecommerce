

import React, { useEffect, useRef, useState } from "react";
import "./AdminProducts.css";

const API_BASE = "http://127.0.0.1:8000";
const API = `${API_BASE}/api`;

export default function AdminProducts() {
  const fileInputRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    available: true,
    image: null,
    imagePreview: "",
  });

  // =====================================================
  // GET CURRENT ACCESS TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("accessToken");
  };

  // =====================================================
  // AUTH HEADERS
  // =====================================================

  const getHeaders = () => {
    const token = getToken();

    if (!token) {
      console.error("No access token found.");
      return null;
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // =====================================================
  // LOAD PRODUCTS + CATEGORIES
  // =====================================================

  const loadData = async () => {
    try {
      setLoading(true);

      const headers = getHeaders();

      if (!headers) {
        alert("Please login again.");
        return;
      }

      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${API}/products/`, {
          method: "GET",
          headers,
        }),

        fetch(`${API}/categories/`, {
          method: "GET",
          headers,
        }),
      ]);

      // -----------------------------
      // PRODUCTS RESPONSE
      // -----------------------------

      const productData = await productsRes
        .json()
        .catch(() => ({}));

      if (!productsRes.ok) {
        console.error(
          "Products API Error:",
          productsRes.status,
          productData
        );

        if (productsRes.status === 401) {
          alert("Your login session expired. Please login again.");
        } else {
          alert(
            `Failed to load products.\n\n${JSON.stringify(
              productData,
              null,
              2
            )}`
          );
        }

        return;
      }

      // -----------------------------
      // CATEGORIES RESPONSE
      // -----------------------------

      const categoryData = await categoriesRes
        .json()
        .catch(() => ({}));

      if (!categoriesRes.ok) {
        console.error(
          "Categories API Error:",
          categoriesRes.status,
          categoryData
        );

        if (categoriesRes.status === 401) {
          alert("Your login session expired. Please login again.");
        } else {
          alert(
            `Failed to load categories.\n\n${JSON.stringify(
              categoryData,
              null,
              2
            )}`
          );
        }

        return;
      }

      // -----------------------------
      // SET PRODUCTS
      // -----------------------------

      setProducts(
        Array.isArray(productData)
          ? productData
          : productData.results || []
      );

      // -----------------------------
      // SET CATEGORIES
      // -----------------------------

      setCategories(
        Array.isArray(categoryData)
          ? categoryData
          : categoryData.results || []
      );

      console.log("Products loaded:", productData);
      console.log("Categories loaded:", categoryData);

    } catch (error) {
      console.error("Load error:", error);
      alert("Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA ON PAGE LOAD
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Check image type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");

      e.target.value = "";

      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");

      e.target.value = "";

      return;
    }

    // Remove old blob URL
    if (form.imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(form.imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: previewUrl,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    if (form.imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(form.imagePreview);
    }

    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      available: true,
      image: null,
      imagePreview: "",
    });

    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_BASE}${image}`;
  };

  // =====================================================
  // SUBMIT PRODUCT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!form.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!form.description.trim()) {
      alert("Please enter product description.");
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    if (!form.category) {
      alert("Please select a category.");
      return;
    }

    // -----------------------------
    // TOKEN
    // -----------------------------

    const token = getToken();

    if (!token) {
      alert("Please login again.");
      return;
    }

    setSaving(true);

    try {
      // -----------------------------
      // FORM DATA
      // -----------------------------

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append(
        "description",
        form.description.trim()
      );
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("category", form.category);
      formData.append(
        "available",
        String(form.available)
      );

      // Add image only when selected
      if (form.image) {
        formData.append("image", form.image);
      }

      // -----------------------------
      // URL
      // -----------------------------

      const url = editingId
        ? `${API}/products/${editingId}/`
        : `${API}/products/`;

      // -----------------------------
      // METHOD
      // -----------------------------

      const method = editingId ? "PATCH" : "POST";

      console.log("=================================");
      console.log("PRODUCT REQUEST");
      console.log("Method:", method);
      console.log("URL:", url);
      console.log("Token exists:", Boolean(token));
      console.log("=================================");

      // -----------------------------
      // API REQUEST
      // -----------------------------

      const response = await fetch(url, {
        method,

        headers: {
          Authorization: `Bearer ${token}`,
        },

        // IMPORTANT:
        // Do NOT add Content-Type here.
        // Browser automatically sets multipart/form-data.
        body: formData,
      });

      const data = await response
        .json()
        .catch(() => ({}));

      // -----------------------------
      // ERROR
      // -----------------------------

      if (!response.ok) {
        console.error(
          "========== BACKEND ERROR =========="
        );

        console.error("Status:", response.status);
        console.error("Response:", data);

        if (response.status === 401) {
          alert(
            "Authentication failed.\n\nPlease logout and login again."
          );

          return;
        }

        alert(
          "Product Error:\n\n" +
            JSON.stringify(data, null, 2)
        );

        return;
      }

      // -----------------------------
      // SUCCESS
      // -----------------------------

      console.log("Product saved:", data);

      alert(
        editingId
          ? "Product updated successfully!"
          : "Product created successfully!"
      );

      resetForm();

      await loadData();

    } catch (error) {
      console.error("Save error:", error);

      alert(
        "Something went wrong while saving the product."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock ?? "",
      category: product.category || "",
      available: product.available ?? true,
      image: null,
      imagePreview: product.image
        ? getImageUrl(product.image)
        : "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    const token = getToken();

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      const response = await fetch(
        `${API}/products/${id}/`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Product deleted successfully.");

        await loadData();

        return;
      }

      const data = await response
        .json()
        .catch(() => ({}));

      console.error("Delete error:", data);

      if (response.status === 401) {
        alert(
          "Authentication failed. Please login again."
        );

        return;
      }

      alert(
        data?.detail ||
          JSON.stringify(data) ||
          "Unable to delete product."
      );

    } catch (error) {
      console.error("Delete error:", error);

      alert("Something went wrong.");
    }
  };

  // =====================================================
  // CATEGORY NAME
  // =====================================================

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) =>
        String(item.id) === String(categoryId)
    );

    return category
      ? category.name
      : categoryId;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-page">

      <h1>Products</h1>

      <p>
        Manage your store products and product images.
      </p>

      {/* ============================================= */}
      {/* PRODUCT FORM */}
      {/* ============================================= */}

      <form
        onSubmit={handleSubmit}
        className="admin-form"
      >

        {/* PRODUCT NAME */}

        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* DESCRIPTION */}

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        {/* PRICE */}

        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        {/* STOCK */}

        <input
          name="stock"
          type="number"
          min="0"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
        />

        {/* CATEGORY */}

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >

          <option value="">
            Select category
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}

        </select>

        {/* IMAGE */}

        <div className="image-upload-section">

          <label>
            Product Image
          </label>

          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />

          <small>
            JPG, JPEG, PNG, WEBP — maximum 5 MB
          </small>

          {/* IMAGE PREVIEW */}

          {form.imagePreview && (
            <div className="image-preview">

              <img
                src={form.imagePreview}
                alt="Product preview"
              />

            </div>
          )}

        </div>

        {/* AVAILABLE */}

        <label className="available-checkbox">

          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
          />

          Available

        </label>

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : editingId
            ? "Update Product"
            : "Add Product"}
        </button>

        {/* CANCEL */}

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}

      </form>

      {/* ============================================= */}
      {/* PRODUCTS TABLE */}
      {/* ============================================= */}

      {loading ? (
        <p>Loading products...</p>

      ) : products.length === 0 ? (

        <p>No products found.</p>

      ) : (

        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>

                <th>Image</th>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Available</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {products.map((product) => (

                <tr key={product.id}>

                  {/* IMAGE */}

                  <td>

                    {product.image ? (

                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="product-table-image"
                      />

                    ) : (

                      <span>
                        No Image
                      </span>

                    )}

                  </td>

                  {/* ID */}

                  <td>
                    {product.id}
                  </td>

                  {/* NAME */}

                  <td>
                    {product.name}
                  </td>

                  {/* PRICE */}

                  <td>
                    ₹{product.price}
                  </td>

                  {/* STOCK */}

                  <td>
                    {product.stock}
                  </td>

                  {/* CATEGORY */}

                  <td>
                    {getCategoryName(
                      product.category
                    )}
                  </td>

                  {/* AVAILABLE */}

                  <td>
                    {product.available
                      ? "Yes"
                      : "No"}
                  </td>

                  {/* ACTIONS */}

                  <td>

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(product)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(product.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}