import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";
const API_BASE = "http://127.0.0.1:8000";

export default function Homes() {
  const navigate = useNavigate();

  // =========================================================
  // AUTH
  // =========================================================

  const token = localStorage.getItem("accessToken");

  const isAdmin =
    localStorage.getItem("isStaff") === "true" ||
    localStorage.getItem("isSuperuser") === "true";

  const username =
    localStorage.getItem("username") || "User";

  // =========================================================
  // STATES
  // =========================================================

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [error, setError] = useState("");

  // =========================================================
  // AUTH HEADERS
  // =========================================================

  const getHeaders = () => {
    const currentToken = localStorage.getItem("accessToken");

    return {
      Authorization: `Bearer ${currentToken}`,
      "Content-Type": "application/json",
    };
  };

  // =========================================================
  // CHECK LOGIN
  // =========================================================

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/products/`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to load products");
      }

      const data = await response.json();

      const productList = Array.isArray(data)
        ? data
        : data.results || [];

      setProducts(productList);
    } catch (err) {
      console.error("Products error:", err);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD CART
  // =========================================================

  const loadCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart/`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        navigate("/login");
        return;
      }

      if (!response.ok) {
        console.log("Cart request failed");
        return;
      }

      const data = await response.json();

      const cartList = Array.isArray(data)
        ? data
        : data.results || data.items || [];

      setCart(cartList);
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    if (token) {
      loadProducts();
      loadCart();
    }
  }, []);

  // =========================================================
  // GET IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_BASE}${image}`;
  };

  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = useMemo(() => {
    const categorySet = new Set();

    products.forEach((product) => {
      if (typeof product.category === "string") {
        categorySet.add(product.category);
      }

      if (
        typeof product.category === "object" &&
        product.category?.name
      ) {
        categorySet.add(product.category.name);
      }
    });

    return ["All", ...Array.from(categorySet)];
  }, [products]);

  // =========================================================
  // CATEGORY NAME
  // =========================================================

  const getCategoryName = (product) => {
    if (!product?.category) {
      return "Category";
    }

    if (typeof product.category === "string") {
      return product.category;
    }

    if (typeof product.category === "object") {
      return product.category.name || "Category";
    }

    return "Category";
  };

  // =========================================================
  // FILTER PRODUCTS
  // =========================================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName =
        product.name?.toLowerCase() || "";

      const productDescription =
        product.description?.toLowerCase() || "";

      const category =
        getCategoryName(product).toLowerCase();

      const searchText = search.toLowerCase();

      const matchesSearch =
        productName.includes(searchText) ||
        productDescription.includes(searchText) ||
        category.includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        getCategoryName(product) === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  // =========================================================
  // CART COUNT
  // =========================================================

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => {
      return (
        total +
        Number(
          item.quantity ||
          item.qty ||
          1
        )
      );
    }, 0);
  }, [cart]);

  // =========================================================
  // ADD TO CART
  // =========================================================

  const addToCart = async (product) => {
    try {
      setCartLoading(true);

      /*
        IMPORTANT:
        GET /api/cart/
        POST /api/cart/items/
      */

      const response = await fetch(`${API_URL}/cart/items/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          product: product.id,
          quantity: 1,
        }),
      });

      const data = await response.json().catch(() => ({}));

      console.log("Add cart response:", data);

      // =====================================================
      // TOKEN EXPIRED
      // =====================================================

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        navigate("/login");
        return;
      }

      // =====================================================
      // OTHER ERRORS
      // =====================================================

      if (!response.ok) {
        console.error(
          "Add cart failed:",
          response.status,
          data
        );

        alert(
          data?.detail ||
          data?.message ||
          "Unable to add product to cart."
        );

        return;
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      alert("Product added to cart!");

      // Refresh cart count
      await loadCart();

    } catch (error) {
      console.error("Add cart error:", error);

      alert("Something went wrong.");
    } finally {
      setCartLoading(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    localStorage.removeItem("username");
    localStorage.removeItem("email");

    localStorage.removeItem("isStaff");
    localStorage.removeItem("isSuperuser");

    navigate("/login");
  };

  // =========================================================
  // ADMIN DASHBOARD
  // =========================================================

  const goToAdminDashboard = () => {
    if (!isAdmin) {
      return;
    }

    navigate("/admin-dashboard");
  };

  // =========================================================
  // PRODUCT DETAILS
  // =========================================================

  const openProduct = (id) => {
    navigate(`/products/${id}`);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="homes-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="homes-navbar">

        {/* LOGO */}

        <div
          className="homes-logo"
          onClick={() => navigate("/homes")}
        >
          <span className="logo-icon">🛍️</span>
          <span>MyShop</span>
        </div>

        {/* NAVIGATION */}

        <div className="homes-nav-links">

          <button
            className="homes-nav-button active"
            onClick={() => navigate("/homes")}
          >
            🏠 Home
          </button>

          {/* ADMIN DASHBOARD - ADMIN ONLY */}

          {isAdmin && (
            <button
              className="homes-nav-button admin-button"
              onClick={goToAdminDashboard}
            >
              👑 Admin Dashboard
            </button>
          )}

          {/* CART */}

          <button
            className="homes-nav-button cart-button"
            onClick={() => navigate("/cart")}
          >
            🛒 Cart

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </button>

          {/* ORDERS */}

          <button
            className="homes-nav-button"
            onClick={() => navigate("/orders")}
          >
            📦 Orders
          </button>

          {/* LOGOUT */}

          <button
            className="homes-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      </nav>

      {/* =====================================================
          WELCOME SECTION
      ===================================================== */}

      <section className="homes-welcome">

        <div>
          <h1>
            Welcome{username ? `, ${username}` : ""}! 👋
          </h1>

          <p>
            Discover amazing products at great prices.
          </p>
        </div>

        {isAdmin && (
          <div className="admin-welcome">
            👑 Admin Account
          </div>
        )}

      </section>

      {/* =====================================================
          SEARCH + CATEGORY
      ===================================================== */}

      <section className="homes-controls">

        <div className="search-wrapper">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

        </div>

        <div className="category-wrapper">

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
            className="category-select"
          >

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}

          </select>

        </div>

      </section>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="homes-error">
          {error}
        </div>
      )}

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <main className="homes-products-section">

        <div className="products-heading">

          <div>
            <h2>Products</h2>

            <p>
              {filteredProducts.length} products found
            </p>
          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="homes-loading">

            <div className="loader"></div>

            <p>
              Loading products...
            </p>

          </div>

        ) : filteredProducts.length === 0 ? (

          <div className="homes-empty">

            <div className="empty-icon">
              🔍
            </div>

            <h3>
              No products found
            </h3>

            <p>
              Try another search or category.
            </p>

          </div>

        ) : (

          <div className="products-grid">

            {filteredProducts.map((product) => (

              <div
                className="product-card"
                key={product.id}
              >

                {/* PRODUCT IMAGE */}

                <div
                  className="product-image-container"
                  onClick={() =>
                    openProduct(product.id)
                  }
                >

                  {product.image ? (

                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="product-image"
                    />

                  ) : (

                    <div className="no-image">
                      🛍️
                    </div>

                  )}

                  {product.available === false && (
                    <span className="out-of-stock">
                      Out of Stock
                    </span>
                  )}

                </div>

                {/* PRODUCT DETAILS */}

                <div className="product-content">

                  <span className="product-category">
                    {getCategoryName(product)}
                  </span>

                  <h3
                    className="product-name"
                    onClick={() =>
                      openProduct(product.id)
                    }
                  >
                    {product.name}
                  </h3>

                  <p className="product-description">
                    {product.description}
                  </p>

                  {/* PRICE */}

                  <div className="product-price-row">

                    <span className="product-price">
                      ₹{product.price}
                    </span>

                    {product.stock !== undefined && (
                      <span className="stock-text">
                        {product.stock} left
                      </span>
                    )}

                  </div>

                  {/* ADD CART */}

                  <button
                    className="add-cart-button"
                    onClick={() =>
                      addToCart(product)
                    }
                    disabled={
                      product.available === false ||
                      product.stock === 0 ||
                      cartLoading
                    }
                  >
                    {cartLoading
                      ? "Adding..."
                      : "🛒 Add to Cart"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="homes-footer">

        <p>
          © 2026 MyShop. All rights reserved.
        </p>

      </footer>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family:
            Arial,
            Helvetica,
            sans-serif;

          background: #f5f7fb;
          color: #222;
        }

        .homes-page {
          min-height: 100vh;
          background: #f5f7fb;
        }

        /* ==========================================
           NAVBAR
        ========================================== */

        .homes-navbar {
          position: sticky;
          top: 0;
          z-index: 100;

          width: 100%;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 15px 5%;

          background: #ffffff;

          border-bottom: 1px solid #e5e7eb;

          box-shadow:
            0 3px 15px
            rgba(0, 0, 0, 0.06);
        }

        .homes-logo {
          display: flex;
          align-items: center;

          gap: 8px;

          font-size: 25px;
          font-weight: 800;

          color: #2563eb;

          cursor: pointer;
        }

        .logo-icon {
          font-size: 27px;
        }

        .homes-nav-links {
          display: flex;
          align-items: center;

          gap: 8px;
        }

        .homes-nav-button {
          position: relative;

          border: none;

          background: transparent;

          padding: 10px 14px;

          border-radius: 9px;

          color: #555;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;

          transition: 0.2s;
        }

        .homes-nav-button:hover {
          background: #eef2ff;
          color: #2563eb;
        }

        .homes-nav-button.active {
          background: #eef2ff;
          color: #2563eb;
        }

        /* ==========================================
           ADMIN BUTTON
        ========================================== */

        .admin-button {
          background: #f0f0ff;

          color: #4f46e5;

          font-weight: 700;

          border: 1px solid #dddfff;
        }

        .admin-button:hover {
          background: #4f46e5;

          color: #ffffff;
        }

        .cart-button {
          display: flex;
          align-items: center;

          gap: 6px;
        }

        .cart-badge {
          position: absolute;

          top: -3px;
          right: -2px;

          min-width: 19px;
          height: 19px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0 5px;

          background: #ef4444;

          color: white;

          border-radius: 50px;

          font-size: 11px;
          font-weight: 700;
        }

        .homes-logout-button {
          border: none;

          background: #ef4444;

          color: #ffffff;

          padding: 10px 17px;

          border-radius: 9px;

          font-size: 14px;
          font-weight: 700;

          cursor: pointer;

          transition: 0.2s;
        }

        .homes-logout-button:hover {
          background: #dc2626;

          transform: translateY(-1px);
        }

        /* ==========================================
           WELCOME
        ========================================== */

        .homes-welcome {
          width: 90%;

          max-width: 1300px;

          margin: 35px auto 25px;

          display: flex;

          justify-content: space-between;
          align-items: center;

          padding: 28px 30px;

          border-radius: 18px;

          background:
            linear-gradient(
              135deg,
              #eef2ff,
              #ffffff
            );

          border: 1px solid #e1e7ff;
        }

        .homes-welcome h1 {
          margin: 0 0 8px;

          font-size: 30px;

          color: #222;
        }

        .homes-welcome p {
          margin: 0;

          color: #777;

          font-size: 15px;
        }

        .admin-welcome {
          padding: 10px 16px;

          border-radius: 10px;

          background: #eef2ff;

          color: #4f46e5;

          font-size: 14px;

          font-weight: 700;
        }

        /* ==========================================
           CONTROLS
        ========================================== */

        .homes-controls {
          width: 90%;

          max-width: 1300px;

          margin: 0 auto 30px;

          display: flex;

          gap: 15px;
        }

        .search-wrapper {
          flex: 1;

          position: relative;
        }

        .search-icon {
          position: absolute;

          left: 15px;
          top: 50%;

          transform:
            translateY(-50%);

          font-size: 17px;
        }

        .search-input {
          width: 100%;

          height: 48px;

          padding:
            0 15px 0 45px;

          border:
            1px solid #ddd;

          border-radius: 10px;

          background: white;

          outline: none;

          font-size: 15px;
        }

        .search-input:focus {
          border-color: #6366f1;

          box-shadow:
            0 0 0 3px
            rgba(99, 102, 241, 0.10);
        }

        .category-wrapper {
          width: 220px;
        }

        .category-select {
          width: 100%;

          height: 48px;

          padding: 0 14px;

          border:
            1px solid #ddd;

          border-radius: 10px;

          background: white;

          outline: none;

          font-size: 14px;

          cursor: pointer;
        }

        /* ==========================================
           PRODUCTS
        ========================================== */

        .homes-products-section {
          width: 90%;

          max-width: 1300px;

          margin: 0 auto;

          min-height: 500px;
        }

        .products-heading {
          display: flex;

          justify-content: space-between;

          margin-bottom: 20px;
        }

        .products-heading h2 {
          margin: 0 0 5px;

          font-size: 25px;
        }

        .products-heading p {
          margin: 0;

          color: #777;

          font-size: 14px;
        }

        .products-grid {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fill,
              minmax(240px, 1fr)
            );

          gap: 22px;
        }

        /* ==========================================
           PRODUCT CARD
        ========================================== */

        .product-card {
          background: #ffffff;

          border-radius: 15px;

          overflow: hidden;

          border:
            1px solid #e8e8e8;

          box-shadow:
            0 5px 20px
            rgba(0, 0, 0, 0.05);

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .product-card:hover {
          transform:
            translateY(-4px);

          box-shadow:
            0 12px 30px
            rgba(0, 0, 0, 0.10);
        }

        /* ==========================================
           IMAGE
        ========================================== */

        .product-image-container {
          height: 220px;

          background: #f8fafc;

          position: relative;

          display: flex;

          align-items: center;
          justify-content: center;

          overflow: hidden;

          cursor: pointer;
        }

        .product-image {
          width: 100%;
          height: 100%;

          object-fit: cover;

          transition:
            transform 0.3s;
        }

        .product-card:hover
        .product-image {
          transform: scale(1.04);
        }

        .no-image {
          font-size: 55px;

          opacity: 0.35;
        }

        .out-of-stock {
          position: absolute;

          top: 12px;
          right: 12px;

          padding: 6px 10px;

          border-radius: 7px;

          background: #ef4444;

          color: #ffffff;

          font-size: 11px;

          font-weight: 700;
        }

        /* ==========================================
           PRODUCT CONTENT
        ========================================== */

        .product-content {
          padding: 17px;
        }

        .product-category {
          display: inline-block;

          margin-bottom: 8px;

          padding: 5px 9px;

          border-radius: 6px;

          background: #eef2ff;

          color: #4f46e5;

          font-size: 11px;

          font-weight: 700;
        }

        .product-name {
          margin: 0 0 8px;

          font-size: 18px;

          line-height: 1.3;

          cursor: pointer;
        }

        .product-name:hover {
          color: #2563eb;
        }

        .product-description {
          height: 42px;

          margin: 0 0 15px;

          color: #777;

          font-size: 13px;

          line-height: 1.5;

          overflow: hidden;
        }

        .product-price-row {
          display: flex;

          align-items: center;
          justify-content: space-between;

          margin-bottom: 14px;
        }

        .product-price {
          font-size: 21px;

          font-weight: 800;

          color: #111827;
        }

        .stock-text {
          color: #16a34a;

          font-size: 12px;

          font-weight: 600;
        }

        /* ==========================================
           ADD CART
        ========================================== */

        .add-cart-button {
          width: 100%;

          height: 43px;

          border: none;

          border-radius: 9px;

          background: #2563eb;

          color: white;

          font-size: 14px;

          font-weight: 700;

          cursor: pointer;

          transition: 0.2s;
        }

        .add-cart-button:hover:not(:disabled) {
          background: #1d4ed8;

          transform:
            translateY(-1px);
        }

        .add-cart-button:disabled {
          background: #cbd5e1;

          cursor: not-allowed;
        }

        /* ==========================================
           LOADING
        ========================================== */

        .homes-loading {
          min-height: 400px;

          display: flex;

          flex-direction: column;

          align-items: center;
          justify-content: center;

          color: #777;
        }

        .loader {
          width: 40px;
          height: 40px;

          border:
            4px solid #e5e7eb;

          border-top-color:
            #2563eb;

          border-radius: 50%;

          animation:
            spin 0.8s linear infinite;

          margin-bottom: 15px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ==========================================
           EMPTY
        ========================================== */

        .homes-empty {
          min-height: 350px;

          display: flex;

          flex-direction: column;

          align-items: center;
          justify-content: center;

          text-align: center;
        }

        .empty-icon {
          font-size: 50px;

          margin-bottom: 10px;

          opacity: 0.5;
        }

        .homes-empty h3 {
          margin: 5px 0;

          font-size: 20px;
        }

        .homes-empty p {
          color: #777;

          font-size: 14px;
        }

        /* ==========================================
           ERROR
        ========================================== */

        .homes-error {
          width: 90%;

          max-width: 1300px;

          margin:
            0 auto 20px;

          padding: 13px 16px;

          border-radius: 9px;

          background: #fff1f1;

          border: 1px solid #ffd0d0;

          color: #dc2626;

          font-size: 14px;
        }

        /* ==========================================
           FOOTER
        ========================================== */

        .homes-footer {
          margin-top: 50px;

          padding: 25px;

          text-align: center;

          background: #ffffff;

          border-top:
            1px solid #e5e7eb;

          color: #777;

          font-size: 13px;
        }

        /* ==========================================
           RESPONSIVE
        ========================================== */

        @media (max-width: 900px) {

          .homes-navbar {
            flex-direction: column;

            gap: 15px;

            padding: 15px;
          }

          .homes-nav-links {
            width: 100%;

            justify-content: center;

            flex-wrap: wrap;
          }

          .homes-controls {
            flex-direction: column;
          }

          .category-wrapper {
            width: 100%;
          }

        }

        @media (max-width: 600px) {

          .homes-welcome {
            width: 94%;

            flex-direction: column;

            align-items: flex-start;

            gap: 15px;
          }

          .homes-controls,
          .homes-products-section {
            width: 94%;
          }

          .homes-welcome h1 {
            font-size: 24px;
          }

          .products-grid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );

            gap: 12px;
          }

          .product-image-container {
            height: 160px;
          }

          .product-content {
            padding: 12px;
          }

          .product-name {
            font-size: 15px;
          }

          .product-price {
            font-size: 17px;
          }

        }

        @media (max-width: 430px) {

          .products-grid {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

    </div>
  );
}