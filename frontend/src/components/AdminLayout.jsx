import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Admin";

  // ============================
  // LOGOUT
  // ============================
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("isStaff");
    localStorage.removeItem("isSuperuser");

    navigate("/login", { replace: true });
  };

  // ============================
  // ADMIN MENU
  // ============================
  const menuItems = [
    {
      path: "/admin-dashboard",
      label: "Dashboard",
      icon: "📊",
      end: true,
    },
    {
      path: "/admin-dashboard/products",
      label: "Products",
      icon: "🛍️",
    },
    {
      path: "/admin-dashboard/categories",
      label: "Categories",
      icon: "🏷️",
    },
    {
      path: "/admin-dashboard/orders",
      label: "Orders",
      icon: "📦",
    },
    {
      path: "/admin-dashboard/cart-items",
      label: "my Cart Items",
      icon: "🛒",
    },
    {
      path: "/admin-dashboard/carts",
      label: "Carts",
      icon: "🛒",
    },
    {
      path: "/admin-dashboard/order-items",
      label: "my Order Items",
      icon: "📋",
    },
    {
      path: "/admin-dashboard/payments",
      label: "Payments",
      icon: "💳",
    },
    {
      path: "/admin-dashboard/users",
      label: "Users",
      icon: "👥",
    },
  ];

  return (
    <>
      <style>{`

        /* ========================================
           RESET
        ======================================== */

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
        }

        /* ========================================
           MAIN LAYOUT
        ======================================== */

        .admin-layout {
          min-height: 100vh;
          background: #f5f7fb;
          font-family: Arial, Helvetica, sans-serif;
          color: #111827;
        }

        /* ========================================
           HEADER
        ======================================== */

        .admin-layout-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;

          height: 70px;

          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 25px;

          z-index: 1000;
        }

        /* ========================================
           BRAND
        ======================================== */

        .admin-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .admin-brand-icon {
          width: 42px;
          height: 42px;

          flex-shrink: 0;

          background: #111827;
          color: #ffffff;

          border-radius: 9px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 21px;
        }

        .admin-brand-info {
          min-width: 0;
        }

        .admin-brand h2 {
          margin: 0;

          font-size: 18px;
          font-weight: 700;

          color: #111827;

          white-space: nowrap;
        }

        .admin-brand span {
          display: block;

          margin-top: 2px;

          font-size: 11px;
          color: #6b7280;

          white-space: nowrap;
        }

        /* ========================================
           HEADER RIGHT
        ======================================== */

        .admin-header-right {
          display: flex;
          align-items: center;
          gap: 18px;

          flex-shrink: 0;
        }

        /* ========================================
           USER
        ======================================== */

        .admin-header-user {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .admin-header-avatar {
          width: 38px;
          height: 38px;

          flex-shrink: 0;

          border-radius: 50%;

          background: #111827;
          color: #ffffff;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 14px;
          font-weight: 700;
        }

        .admin-header-user-info {
          min-width: 0;
        }

        .admin-header-user strong {
          display: block;

          font-size: 13px;
          font-weight: 700;

          color: #111827;

          max-width: 120px;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-header-user span {
          display: block;

          margin-top: 2px;

          font-size: 10px;
          color: #6b7280;
        }

        /* ========================================
           LOGOUT
        ======================================== */

        .admin-layout-logout {
          border: none;

          background: #fee2e2;
          color: #dc2626;

          padding: 9px 14px;

          border-radius: 7px;

          cursor: pointer;

          font-size: 12px;
          font-weight: 600;

          transition: all 0.2s ease;
        }

        .admin-layout-logout:hover {
          background: #fecaca;
          transform: translateY(-1px);
        }

        .admin-layout-logout:active {
          transform: translateY(0);
        }

        /* ========================================
           BODY
        ======================================== */

        .admin-layout-body {
          min-height: 100vh;
          padding-top: 70px;
        }

        /* ========================================
           SIDEBAR
        ======================================== */

        .admin-layout-sidebar {
          position: fixed;

          top: 70px;
          left: 0;
          bottom: 0;

          width: 240px;

          background: #111827;

          overflow-y: auto;

          padding: 20px 12px;

          z-index: 900;
        }

        /* ========================================
           SIDEBAR TITLE
        ======================================== */

        .admin-menu-title {
          padding: 10px 12px;

          margin-bottom: 6px;

          color: #9ca3af;

          font-size: 10px;
          font-weight: 700;

          letter-spacing: 1px;
        }

        /* ========================================
           MENU
        ======================================== */

        .admin-menu {
          display: flex;
          flex-direction: column;

          gap: 3px;
        }

        /* ========================================
           MENU LINK
        ======================================== */

        .admin-menu-link {
          width: 100%;

          display: flex;
          align-items: center;

          gap: 12px;

          padding: 11px 13px;

          border-radius: 7px;

          color: #d1d5db;

          text-decoration: none;

          font-size: 13px;
          font-weight: 500;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .admin-menu-link:hover {
          background: #1f2937;
          color: #ffffff;
        }

        .admin-menu-link.active {
          background: #374151;
          color: #ffffff;
        }

        .admin-menu-icon {
          width: 22px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 16px;
        }

        .admin-menu-label {
          flex: 1;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ========================================
           MAIN CONTENT
        ======================================== */

        .admin-layout-content {
          min-height: calc(100vh - 70px);

          margin-left: 240px;

          padding: 25px;

          overflow-x: hidden;
        }

        /* ========================================
           SIDEBAR SCROLLBAR
        ======================================== */

        .admin-layout-sidebar::-webkit-scrollbar {
          width: 5px;
        }

        .admin-layout-sidebar::-webkit-scrollbar-track {
          background: #111827;
        }

        .admin-layout-sidebar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }

        .admin-layout-sidebar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }

        /* ========================================
           TABLET
        ======================================== */

        @media (max-width: 1000px) {

          .admin-layout-sidebar {
            width: 210px;
          }

          .admin-layout-content {
            margin-left: 210px;
            padding: 20px;
          }

          .admin-brand h2 {
            font-size: 16px;
          }

          .admin-header-right {
            gap: 10px;
          }

        }

        /* ========================================
           SMALL TABLET
        ======================================== */

        @media (max-width: 800px) {

          .admin-layout-header {
            padding: 0 15px;
          }

          .admin-header-user-info {
            display: none;
          }

          .admin-header-user {
            gap: 0;
          }

          .admin-layout-sidebar {
            width: 70px;
          }

          .admin-layout-content {
            margin-left: 70px;
            padding: 16px;
          }

          .admin-menu-title {
            display: none;
          }

          .admin-menu-link {
            justify-content: center;

            padding: 12px 5px;
          }

          .admin-menu-icon {
            width: auto;
            font-size: 18px;
          }

          .admin-menu-label {
            display: none;
          }

        }

        /* ========================================
           MOBILE
        ======================================== */

        @media (max-width: 600px) {

          .admin-layout-header {
            height: 62px;

            padding: 0 10px;
          }

          .admin-layout-body {
            padding-top: 62px;
          }

          .admin-layout-sidebar {
            top: 62px;

            width: 58px;

            padding: 12px 6px;
          }

          .admin-layout-content {
            margin-left: 58px;

            min-height: calc(100vh - 62px);

            padding: 12px;
          }

          .admin-brand {
            gap: 8px;
          }

          .admin-brand-icon {
            width: 35px;
            height: 35px;

            border-radius: 8px;

            font-size: 17px;
          }

          .admin-brand h2 {
            font-size: 13px;
          }

          .admin-brand span {
            display: none;
          }

          .admin-header-avatar {
            width: 34px;
            height: 34px;

            font-size: 12px;
          }

          .admin-layout-logout {
            padding: 7px 9px;

            font-size: 11px;
          }

          .admin-menu {
            gap: 5px;
          }

          .admin-menu-link {
            min-height: 40px;

            padding: 9px 3px;

            border-radius: 7px;
          }

          .admin-menu-icon {
            font-size: 17px;
          }

        }

        /* ========================================
           VERY SMALL MOBILE
        ======================================== */

        @media (max-width: 400px) {

          .admin-layout-header {
            padding: 0 7px;
          }

          .admin-brand h2 {
            font-size: 12px;
          }

          .admin-brand-icon {
            width: 32px;
            height: 32px;

            font-size: 15px;
          }

          .admin-layout-sidebar {
            width: 52px;

            padding-left: 4px;
            padding-right: 4px;
          }

          .admin-layout-content {
            margin-left: 52px;

            padding: 9px;
          }

          .admin-layout-logout {
            padding: 6px 7px;

            font-size: 10px;
          }

        }

      `}</style>

      <div className="admin-layout">

        {/* ========================================
            HEADER
        ======================================== */}

        <header className="admin-layout-header">

          {/* BRAND */}

          <div className="admin-brand">

            <div className="admin-brand-icon">
              🛍️
            </div>

            <div className="admin-brand-info">

              <h2>
                E-Commerce Admin
              </h2>

              <span>
                Administration Panel
              </span>

            </div>

          </div>


          {/* HEADER RIGHT */}

          <div className="admin-header-right">

            <div className="admin-header-user">

              <div className="admin-header-avatar">
                {username.charAt(0).toUpperCase()}
              </div>

              <div className="admin-header-user-info">

                <strong>
                  {username}
                </strong>

                <span>
                  Administrator
                </span>

              </div>

            </div>


            <button
              type="button"
              className="admin-layout-logout"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>

          </div>

        </header>


        {/* ========================================
            BODY
        ======================================== */}

        <div className="admin-layout-body">

          {/* ======================================
              SIDEBAR
          ====================================== */}

          <aside className="admin-layout-sidebar">

            <div className="admin-menu-title">
              ADMIN MENU
            </div>

            <nav className="admin-menu">

              {menuItems.map((item) => (

                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `admin-menu-link ${
                      isActive ? "active" : ""
                    }`
                  }
                  title={item.label}
                >

                  <span className="admin-menu-icon">
                    {item.icon}
                  </span>

                  <span className="admin-menu-label">
                    {item.label}
                  </span>

                </NavLink>

              ))}

            </nav>

          </aside>


          {/* ======================================
              PAGE CONTENT
          ====================================== */}

          <main className="admin-layout-content">

            <Outlet />

          </main>

        </div>

      </div>
    </>
  );
}

export default AdminLayout;