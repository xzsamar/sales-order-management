import {
  FaHome,
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaPlusCircle,
  FaCapsules,
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    {
      path: "/",
      icon: <FaHome />,
      label: "Dashboard",
    },
    {
      path: "/customers",
      icon: <FaUsers />,
      label: "Customers",
    },
    {
      path: "/products",
      icon: <FaBox />,
      label: "Products",
    },
    {
      path: "/orders",
      icon: <FaShoppingCart />,
      label: "Orders",
    },
    {
      path: "/create-order",
      icon: <FaPlusCircle />,
      label: "Create Order",
    },
  ];

  return (
<div
  style={{
    width: "270px",

    position: "fixed",

    top: 0,
    left: 0,

    height: "100vh",

    overflowY: "auto",

    background:
      "linear-gradient(180deg,#0f172a,#1e293b)",

    color: "white",

    padding: "24px",

    borderRight:
      "1px solid rgba(255,255,255,0.08)",

    zIndex: 1000,
  }}
>
      {/* Logo Section */}
      <div
        style={{
          marginBottom: "40px",
          paddingBottom: "20px",
          borderBottom:
            "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "12px",
              background: "#2563eb",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FaCapsules size={22} />
          </div>

          <div>
  <h2
    style={{
      fontSize: "20px",
      margin: 0,
    }}
  >
    Oman Pharma
  </h2>

  <p
    style={{
      margin: 0,
      color: "#94a3b8",
      fontSize: "12px",
    }}
  >
    Sales Management
  </p>

  
</div>
        </div>
      </div>

      {/* Navigation */}
      <div>
        {links.map((link) => {
          const active =
            location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 16px",
                marginBottom: "10px",
                borderRadius: "14px",
                textDecoration: "none",

                background: active
                  ? "#2563eb"
                  : "transparent",

                color: "white",

                transition: "0.2s ease",
              }}
            >
              <span
                style={{
                  fontSize: "18px",
                }}
              >
                {link.icon}
              </span>

              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "25px",
          left: "24px",
          right: "24px",
        }}
      >
    
      </div>
    </div>
  );
  
};

export default Sidebar;