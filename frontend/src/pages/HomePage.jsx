import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

const HomePage = () => {
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");

  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  // =========================
  // TOKEN
  // =========================

  const getToken = () => {
    return localStorage.getItem("accessToken");
  };

  // =========================
  // AUTH CHECK
  // =========================

  useEffect(() => {
    const token = getToken();

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // =========================
  // FETCH ALL PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      let url = `${API_URL}/products/`;
      let allProducts = [];

      while (url) {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          handleLogout();
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || data.message || "Failed to fetch products"
          );
        }

        // DRF pagination
        if (Array.isArray(data.results)) {
          allProducts = [...allProducts, ...data.results];
          url = data.next;
        } else if (Array.isArray(data)) {
          allProducts = data;
          url = null;
        } else {
          allProducts = [];
          url = null;
        }
      }

      setProducts(allProducts);
    } catch (err) {
      console.error("Product error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH CART
  // =========================

  const fetchCart = async () => {
    try {
      const token = getToken();

      if (!token) return;

      const response = await fetch(`${API_URL}/cart/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      const data = await response.json();

      if (response.ok) {
        if (Array.isArray(data)) {
          setCartItems(data);
        } else {
          setCartItems(data.results || []);
        }
      }
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  // =========================
  // ADD TO CART
  // =========================
const addToCart = async (product) => {
  try {
    setCartLoading(true);
    setCartMessage("");

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    // Always get the latest cart before deciding POST or PATCH
    const cartResponse = await fetch(`${API_URL}/cart/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (cartResponse.status === 401) {
      handleLogout();
      return;
    }

    const cartData = await cartResponse.json();

    const latestCartItems = Array.isArray(cartData)
      ? cartData
      : cartData.results || [];

    setCartItems(latestCartItems);

    // Find existing product
    const existingItem = latestCartItems.find((item) => {
      const productId =
        item.product?.id ||
        item.product_id ||
        item.product;

      return Number(productId) === Number(product.id);
    });

    let response;

    if (existingItem) {
      // =========================
      // PRODUCT ALREADY EXISTS
      // =========================

      const currentQuantity = Number(
        existingItem.quantity || 1
      );

      response = await fetch(
        `${API_URL}/cart/items/${existingItem.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: currentQuantity + 1,
          }),
        }
      );
    } else {
      // =========================
      // NEW PRODUCT
      // =========================

      response = await fetch(
        `${API_URL}/cart/items/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product: product.id,
            quantity: 1,
          }),
        }
      );
    }

    // =========================
    // HANDLE RESPONSE SAFELY
    // =========================

    const contentType =
      response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();

      console.error(
        "Server returned non-JSON response:",
        text
      );

      throw new Error(
        `Server error: ${response.status}`
      );
    }

    if (response.status === 401) {
      handleLogout();
      return;
    }

    if (!response.ok) {
      throw new Error(
        data?.detail ||
        data?.message ||
        JSON.stringify(data) ||
        "Unable to add product to cart"
      );
    }

    // Refresh cart after successful operation
    await fetchCart();

    setCartMessage(
      `✓ ${product.name} added to cart`
    );

    setTimeout(() => {
      setCartMessage("");
    }, 2500);

  } catch (error) {
    console.error("Add cart error:", error);

    setCartMessage(
      error.message || "Failed to add product"
    );
  } finally {
    setCartLoading(false);
  }
};
  // =========================
  // CART COUNT
  // =========================

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + Number(item.quantity || 1);
    }, 0);
  }, [cartItems]);

  // =========================
  // CATEGORIES
  // =========================

  const categories = useMemo(() => {
    const categorySet = new Set();

    products.forEach((product) => {
      let categoryValue = product.category;

      if (typeof categoryValue === "object" && categoryValue !== null) {
        categoryValue =
          categoryValue.name ||
          categoryValue.title ||
          categoryValue.category;
      }

      if (categoryValue) {
        categorySet.add(String(categoryValue));
      }
    });

    return ["All", ...Array.from(categorySet)];
  }, [products]);

  // =========================
  // FILTER + SEARCH + SORT
  // =========================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const searchText = search.toLowerCase();

      result = result.filter((product) => {
        const name = String(product.name || "").toLowerCase();
        const description = String(
          product.description || ""
        ).toLowerCase();

        let categoryName = product.category;

        if (
          typeof categoryName === "object" &&
          categoryName !== null
        ) {
          categoryName =
            categoryName.name ||
            categoryName.title ||
            categoryName.category ||
            "";
        }

        categoryName = String(categoryName || "").toLowerCase();

        return (
          name.includes(searchText) ||
          description.includes(searchText) ||
          categoryName.includes(searchText)
        );
      });
    }

    // Category
    if (category !== "All") {
      result = result.filter((product) => {
        let productCategory = product.category;

        if (
          typeof productCategory === "object" &&
          productCategory !== null
        ) {
          productCategory =
            productCategory.name ||
            productCategory.title ||
            productCategory.category;
        }

        return String(productCategory) === String(category);
      });
    }

    // Sorting
    if (sort === "price-low") {
      result.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    if (sort === "name-asc") {
      result.sort((a, b) =>
        String(a.name).localeCompare(String(b.name))
      );
    }

    if (sort === "name-desc") {
      result.sort((a, b) =>
        String(b.name).localeCompare(String(a.name))
      );
    }

    return result;
  }, [products, search, category, sort]);

  // =========================
  // GET CATEGORY NAME
  // =========================

  const getCategoryName = (product) => {
    if (!product.category) {
      return "General";
    }

    if (typeof product.category === "object") {
      return (
        product.category.name ||
        product.category.title ||
        product.category.category ||
        "General"
      );
    }

    return product.category;
  };

  // =========================
  // PRODUCT IMAGE
  // =========================

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `http://127.0.0.1:8000${image}`;
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  };

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <div className="loading-page">
          <div className="spinner"></div>
          <h2>Loading products...</h2>
          <p>Please wait</p>
        </div>
      </>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <>
      <style>{styles}</style>

      <div className="home-page">

        {/* ================= NAVBAR ================= */}

        <nav className="navbar">

          <div
            className="logo"
            onClick={() => navigate("/home")}
          >
            <span>🛍️</span>
            MyShop
          </div>

          <div className="nav-links">

            <button
              className="nav-link active"
              onClick={() => navigate("/home")}
            >
              🏠 Home
            </button>

            <button
              className="nav-link cart-nav"
              onClick={() => navigate("/cart")}
            >
              🛒 Cart

              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="nav-link"
              onClick={() => navigate("/orders")}
            >
              📦 Orders
            </button>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        </nav>

        {/* ================= MAIN ================= */}

        <main className="main-container">

          {/* HERO */}

          <section className="hero">

            <div className="hero-content">

              <span className="hero-label">
                ✨ Welcome to MyShop
              </span>

              <h1>
                Find Your
                <span> Favorite Products</span>
              </h1>

              <p>
                Discover amazing products at the best
                prices. Shop easily and securely.
              </p>

              <button
                className="shop-btn"
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                Shop Now →
              </button>

            </div>

            <div className="hero-icon">
              🛍️
            </div>

          </section>

          {/* ================= MESSAGE ================= */}

          {cartMessage && (
            <div className="cart-message">
              <span>✓</span>
              {cartMessage}
            </div>
          )}

          {/* ================= ERROR ================= */}

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}

              <button onClick={fetchProducts}>
                Try Again
              </button>
            </div>
          )}

          {/* ================= PRODUCTS HEADER ================= */}

          <section
            className="products-section"
            id="products"
          >

            <div className="section-header">

              <div>
                <h2>Our Products</h2>

                <p>
                  {filteredProducts.length} products
                  available
                </p>
              </div>

              <button
                className="view-cart-btn"
                onClick={() => navigate("/cart")}
              >
                🛒 View Cart
                {cartCount > 0 && (
                  <span>{cartCount}</span>
                )}
              </button>

            </div>

            {/* ================= FILTERS ================= */}

            <div className="filters">

              {/* SEARCH */}

              <div className="search-box">

                <span>🔍</span>

                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

                {search && (
                  <button
                    className="clear-search"
                    onClick={() => setSearch("")}
                  >
                    ×
                  </button>
                )}

              </div>

              {/* CATEGORY */}

              <div className="filter-group">

                <label>Category</label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                >
                  {categories.map((item) => (
                    <option
                      value={item}
                      key={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>

              </div>

              {/* SORT */}

              <div className="filter-group">

                <label>Sort By</label>

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                >
                  <option value="">
                    Default
                  </option>

                  <option value="price-low">
                    Price: Low → High
                  </option>

                  <option value="price-high">
                    Price: High → Low
                  </option>

                  <option value="name-asc">
                    Name: A → Z
                  </option>

                  <option value="name-desc">
                    Name: Z → A
                  </option>
                </select>

              </div>

              {(search ||
                category !== "All" ||
                sort) && (
                <button
                  className="clear-filter-btn"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}

            </div>

            {/* ================= CATEGORY CHIPS ================= */}

            {categories.length > 1 && (
              <div className="category-chips">

                {categories.map((item) => (
                  <button
                    key={item}
                    className={
                      category === item
                        ? "category-chip active"
                        : "category-chip"
                    }
                    onClick={() =>
                      setCategory(item)
                    }
                  >
                    {item}
                  </button>
                ))}

              </div>
            )}

            {/* ================= PRODUCTS ================= */}

            {filteredProducts.length === 0 ? (

              <div className="no-products">

                <div>🔍</div>

                <h3>
                  No products found
                </h3>

                <p>
                  Try changing your search or
                  filters.
                </p>

                <button
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              <div className="products-grid">

                {filteredProducts.map((item) => {

                  const isAvailable =
                    item.available !== false &&
                    Number(item.stock || 0) > 0;

                  const imageUrl =
                    getImageUrl(item.image);

                  return (
                    <article
                      className="product-card"
                      key={item.id}
                      onClick={() =>
                        navigate(
                          `/products/${item.id}`
                        )
                      }
                    >

                      {/* IMAGE */}

                      <div className="image-wrapper">

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="product-image"
                          />
                        ) : (
                          <div className="no-image">
                            🛍️
                          </div>
                        )}

                        {/* CATEGORY */}

                        <span className="category-tag">
                          {getCategoryName(item)}
                        </span>

                        {/* STOCK */}

                        {!isAvailable && (
                          <span className="out-stock">
                            Out of Stock
                          </span>
                        )}

                      </div>

                      {/* CONTENT */}

                      <div className="product-content">

                        <h3>
                          {item.name}
                        </h3>

                        <p className="description">
                          {item.description ||
                            "No description available."}
                        </p>

                        {/* PRICE */}

                        <div className="price-row">

                          <span className="price">
                            ₹
                            {Number(
                              item.price || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </span>

                          <span
                            className={
                              isAvailable
                                ? "stock available"
                                : "stock unavailable"
                            }
                          >
                            {isAvailable
                              ? `${item.stock} left`
                              : "Unavailable"}
                          </span>

                        </div>

                        {/* BUTTONS */}

                        <div className="product-actions">

                          <button
                            className="details-btn"
                            onClick={(e) => {
                              e.stopPropagation();

                              navigate(
                                `/products/${item.id}`
                              );
                            }}
                          >
                            View Details
                          </button>

                          <button
                            className="add-cart-btn"
                            disabled={
                              !isAvailable ||
                              cartLoading
                            }
                            onClick={(e) => {
                              e.stopPropagation();

                              addToCart(item);
                            }}
                          >
                            {cartLoading
                              ? "Adding..."
                              : isAvailable
                              ? "🛒 Add to Cart"
                              : "Out of Stock"}
                          </button>

                        </div>

                      </div>

                    </article>
                  );
                })}

              </div>

            )}

          </section>

        </main>

        {/* ================= FOOTER ================= */}

        <footer className="footer">

          <div>
            <strong>🛍️ MyShop</strong>
            <p>
              Your trusted online shopping
              destination.
            </p>
          </div>

          <div>
            <p>
              © {new Date().getFullYear()}
              {" "}MyShop. All rights reserved.
            </p>
          </div>

        </footer>

      </div>
    </>
  );
};

export default HomePage;


// =====================================================
// CSS
// =====================================================

const styles = `

* {
  box-sizing: border-box;
}

.home-page {
  min-height: 100vh;
  background: #f7f8fc;
  color: #1f2937;
  font-family:
    Inter,
    Arial,
    Helvetica,
    sans-serif;
}


/* ================= NAVBAR ================= */

.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;

  height: 70px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 6%;

  background: rgba(255,255,255,0.97);

  border-bottom: 1px solid #e5e7eb;

  box-shadow:
    0 2px 15px rgba(0,0,0,0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 9px;

  font-size: 24px;
  font-weight: 800;

  cursor: pointer;

  color: #111827;
}

.logo span {
  font-size: 27px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  position: relative;

  border: none;
  background: transparent;

  padding: 10px 15px;

  border-radius: 8px;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  color: #4b5563;

  transition: 0.2s;
}

.nav-link:hover,
.nav-link.active {
  background: #f1f5f9;
  color: #111827;
}

.cart-nav {
  display: flex;
  align-items: center;
  gap: 7px;
}

.cart-badge {
  min-width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0 5px;

  border-radius: 20px;

  background: #ef4444;
  color: white;

  font-size: 11px;
  font-weight: 700;
}

.logout-btn {
  border: none;

  padding: 10px 17px;

  border-radius: 8px;

  background: #111827;
  color: white;

  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;
}

.logout-btn:hover {
  background: #374151;
}


/* ================= MAIN ================= */

.main-container {
  width: 90%;
  max-width: 1400px;

  margin: auto;
}


/* ================= HERO ================= */

.hero {
  margin-top: 35px;

  min-height: 300px;

  padding: 50px;

  border-radius: 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background:
    linear-gradient(
      135deg,
      #eef2ff,
      #f8fafc
    );

  overflow: hidden;
}

.hero-content {
  max-width: 650px;
}

.hero-label {
  display: inline-block;

  margin-bottom: 15px;

  padding: 7px 13px;

  border-radius: 20px;

  background: white;

  color: #6366f1;

  font-size: 13px;
  font-weight: 700;
}

.hero h1 {
  margin: 0;

  font-size: clamp(34px, 5vw, 58px);

  line-height: 1.05;

  color: #111827;
}

.hero h1 span {
  display: block;
  color: #6366f1;
}

.hero p {
  max-width: 560px;

  margin: 18px 0 25px;

  color: #6b7280;

  font-size: 17px;
  line-height: 1.6;
}

.shop-btn {
  border: none;

  padding: 13px 24px;

  border-radius: 10px;

  background: #6366f1;
  color: white;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.shop-btn:hover {
  background: #4f46e5;
  transform: translateY(-2px);
}

.hero-icon {
  width: 190px;
  height: 190px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: white;

  font-size: 85px;

  box-shadow:
    0 20px 50px rgba(99,102,241,0.15);
}


/* ================= MESSAGE ================= */

.cart-message {
  margin-top: 20px;

  padding: 13px 18px;

  border-radius: 10px;

  background: #ecfdf5;

  color: #047857;

  font-weight: 600;
}

.cart-message span {
  margin-right: 8px;
}

.error-message {
  margin-top: 20px;

  padding: 15px 18px;

  border-radius: 10px;

  background: #fef2f2;

  color: #b91c1c;

  display: flex;
  align-items: center;
  gap: 12px;
}

.error-message button {
  margin-left: auto;

  border: none;

  padding: 8px 14px;

  border-radius: 7px;

  background: #dc2626;
  color: white;

  cursor: pointer;
}


/* ================= PRODUCTS SECTION ================= */

.products-section {
  margin-top: 50px;
  padding-bottom: 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 25px;
}

.section-header h2 {
  margin: 0;

  font-size: 30px;
  color: #111827;
}

.section-header p {
  margin: 6px 0 0;

  color: #6b7280;
}

.view-cart-btn {
  display: flex;
  align-items: center;
  gap: 8px;

  border: none;

  padding: 11px 17px;

  border-radius: 9px;

  background: #111827;
  color: white;

  font-weight: 600;

  cursor: pointer;
}

.view-cart-btn span {
  min-width: 20px;
  height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  background: #6366f1;

  border-radius: 20px;

  font-size: 11px;
}


/* ================= FILTERS ================= */

.filters {
  display: flex;
  align-items: end;
  gap: 14px;

  margin-bottom: 18px;

  flex-wrap: wrap;
}

.search-box {
  position: relative;

  flex: 1;
  min-width: 230px;

  display: flex;
  align-items: center;

  padding: 0 14px;

  height: 45px;

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 9px;
}

.search-box span {
  margin-right: 9px;
}

.search-box input {
  width: 100%;

  border: none;
  outline: none;

  font-size: 14px;
}

.clear-search {
  border: none;
  background: transparent;

  font-size: 20px;

  cursor: pointer;

  color: #9ca3af;
}

.filter-group {
  display: flex;
  flex-direction: column;

  gap: 5px;
}

.filter-group label {
  font-size: 12px;
  font-weight: 700;

  color: #6b7280;
}

.filter-group select {
  min-width: 165px;

  height: 45px;

  padding: 0 12px;

  border: 1px solid #e5e7eb;

  border-radius: 9px;

  background: white;

  outline: none;

  cursor: pointer;
}

.clear-filter-btn {
  height: 45px;

  padding: 0 15px;

  border: none;

  border-radius: 9px;

  background: #fee2e2;
  color: #b91c1c;

  font-weight: 600;

  cursor: pointer;
}


/* ================= CATEGORY CHIPS ================= */

.category-chips {
  display: flex;
  gap: 9px;

  margin-bottom: 25px;

  overflow-x: auto;

  padding-bottom: 5px;
}

.category-chip {
  white-space: nowrap;

  padding: 8px 15px;

  border: 1px solid #e5e7eb;

  border-radius: 20px;

  background: white;

  color: #6b7280;

  cursor: pointer;

  transition: 0.2s;
}

.category-chip:hover,
.category-chip.active {
  background: #6366f1;
  color: white;

  border-color: #6366f1;
}


/* ================= PRODUCT GRID ================= */

.products-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 22px;
}


/* ================= PRODUCT CARD ================= */

.product-card {
  overflow: hidden;

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 15px;

  cursor: pointer;

  transition:
    transform 0.25s,
    box-shadow 0.25s;
}

.product-card:hover {
  transform: translateY(-5px);

  box-shadow:
    0 15px 35px rgba(0,0,0,0.09);
}


/* ================= IMAGE ================= */

.image-wrapper {
  position: relative;

  height: 230px;

  background: #f8fafc;

  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;

  object-fit: contain;

  padding: 20px;

  transition: transform 0.3s;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.no-image {
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 60px;

  color: #cbd5e1;
}

.category-tag {
  position: absolute;

  top: 12px;
  left: 12px;

  padding: 5px 9px;

  border-radius: 6px;

  background: rgba(255,255,255,0.95);

  color: #4f46e5;

  font-size: 11px;
  font-weight: 700;
}

.out-stock {
  position: absolute;

  top: 12px;
  right: 12px;

  padding: 5px 9px;

  border-radius: 6px;

  background: #fee2e2;
  color: #b91c1c;

  font-size: 11px;
  font-weight: 700;
}


/* ================= CONTENT ================= */

.product-content {
  padding: 18px;
}

.product-content h3 {
  margin: 0 0 8px;

  font-size: 18px;

  color: #111827;
}

.description {
  height: 44px;

  margin: 0 0 14px;

  overflow: hidden;

  color: #6b7280;

  font-size: 13px;

  line-height: 1.6;

  display: -webkit-box;

  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price-row {
  display: flex;

  align-items: center;
  justify-content: space-between;

  margin-bottom: 15px;
}

.price {
  font-size: 21px;

  font-weight: 800;

  color: #111827;
}

.stock {
  font-size: 12px;

  font-weight: 700;
}

.stock.available {
  color: #059669;
}

.stock.unavailable {
  color: #dc2626;
}


/* ================= ACTIONS ================= */

.product-actions {
  display: grid;

  grid-template-columns:
    1fr 1.4fr;

  gap: 8px;
}

.details-btn,
.add-cart-btn {
  min-height: 40px;

  border-radius: 8px;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;
}

.details-btn {
  border: 1px solid #e5e7eb;

  background: white;

  color: #374151;
}

.details-btn:hover {
  background: #f9fafb;
}

.add-cart-btn {
  border: none;

  background: #6366f1;
  color: white;
}

.add-cart-btn:hover:not(:disabled) {
  background: #4f46e5;
}

.add-cart-btn:disabled {
  background: #cbd5e1;

  cursor: not-allowed;
}


/* ================= NO PRODUCTS ================= */

.no-products {
  padding: 70px 20px;

  text-align: center;

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 15px;
}

.no-products div {
  font-size: 55px;
}

.no-products h3 {
  margin: 15px 0 5px;

  font-size: 20px;
}

.no-products p {
  color: #6b7280;
}

.no-products button {
  border: none;

  padding: 10px 18px;

  border-radius: 8px;

  background: #6366f1;
  color: white;

  cursor: pointer;
}


/* ================= LOADING ================= */

.loading-page {
  min-height: 100vh;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  background: #f7f8fc;
}

.loading-page h2 {
  margin: 18px 0 5px;
}

.loading-page p {
  margin: 0;

  color: #6b7280;
}

.spinner {
  width: 45px;
  height: 45px;

  border: 4px solid #e5e7eb;

  border-top-color: #6366f1;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


/* ================= FOOTER ================= */

.footer {
  margin-top: 30px;

  padding: 35px 6%;

  display: flex;

  justify-content: space-between;

  gap: 20px;

  background: #111827;

  color: white;
}

.footer strong {
  font-size: 20px;
}

.footer p {
  margin: 8px 0 0;

  color: #9ca3af;

  font-size: 13px;
}


/* ================= TABLET ================= */

@media (max-width: 1000px) {

  .products-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .hero {
    padding: 40px;
  }

  .hero-icon {
    width: 150px;
    height: 150px;

    font-size: 65px;
  }

}


/* ================= MOBILE ================= */

@media (max-width: 700px) {

  .navbar {
    height: auto;

    padding: 15px 5%;

    flex-direction: column;

    gap: 12px;
  }

  .nav-links {
    width: 100%;

    justify-content: center;

    flex-wrap: wrap;
  }

  .nav-link {
    padding: 8px 10px;

    font-size: 12px;
  }

  .logout-btn {
    padding: 8px 12px;

    font-size: 12px;
  }

  .main-container {
    width: 92%;
  }

  .hero {
    min-height: auto;

    padding: 30px 22px;

    border-radius: 18px;
  }

  .hero h1 {
    font-size: 36px;
  }

  .hero p {
    font-size: 14px;
  }

  .hero-icon {
    display: none;
  }

  .section-header {
    align-items: flex-start;

    flex-direction: column;

    gap: 15px;
  }

  .section-header h2 {
    font-size: 25px;
  }

  .view-cart-btn {
    width: 100%;

    justify-content: center;
  }

  .filters {
    align-items: stretch;

    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }

  .filter-group {
    width: 100%;
  }

  .filter-group select {
    width: 100%;
  }

  .clear-filter-btn {
    width: 100%;
  }

  .products-grid {
    grid-template-columns: 1fr;

    gap: 18px;
  }

  .image-wrapper {
    height: 240px;
  }

  .footer {
    flex-direction: column;

    text-align: center;
  }

}


/* ================= SMALL MOBILE ================= */

@media (max-width: 400px) {

  .logo {
    font-size: 21px;
  }

  .nav-links {
    gap: 3px;
  }

  .nav-link {
    padding: 7px;
  }

  .hero h1 {
    font-size: 31px;
  }

  .product-actions {
    grid-template-columns: 1fr;
  }

}

`;