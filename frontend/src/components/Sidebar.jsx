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
    { path: "/",             icon: <FaHome />,        label: "Dashboard",    group: "main"  },
    { path: "/customers",    icon: <FaUsers />,       label: "Customers",    group: "main"  },
    { path: "/products",     icon: <FaBox />,         label: "Products",     group: "main"  },
    { path: "/orders",       icon: <FaShoppingCart />,label: "Orders",       group: "main"  },
    { path: "/create-order", icon: <FaPlusCircle />,  label: "Create Order", group: "action"},
  ];

  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoWrap}>
        <div style={styles.logoIcon}>
          <FaCapsules size={18} color="#3b82f6" />
        </div>
        <div>
          <div style={styles.logoTitle}>Oman Pharma</div>
          <div style={styles.logoSub}>Sales Management</div>
        </div>
      </div>

      {/* Nav label */}
      <div style={styles.navLabel}>Navigation</div>

      {/* Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {links.map((link) => {
          const active = location.pathname === link.path;
          const isAction = link.group === "action";
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.link,
                ...(active ? styles.linkActive : {}),
                ...(isAction && !active ? styles.linkAction : {}),
              }}
            >
              <span style={{ ...styles.linkIcon, ...(active ? { color: "#fff" } : {}) }}>
                {link.icon}
              </span>
              <span style={styles.linkLabel}>{link.label}</span>
              {active && <span style={styles.activeDot} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerDot} />
        <span style={styles.footerText}>System Online</span>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "268px",
    position: "fixed",
    top: 0, left: 0,
    height: "100vh",
    overflowY: "auto",
    background: "#0d1117",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    zIndex: 1000,
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 10px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    marginBottom: "20px",
  },
  logoIcon: {
    width: "40px", height: "40px",
    borderRadius: "10px",
    background: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  logoTitle: {
    fontSize: "15px", fontWeight: "700",
    color: "#f1f5f9", letterSpacing: "-0.01em",
  },
  logoSub: {
    fontSize: "11px", color: "#475569",
    marginTop: "1px",
  },
  navLabel: {
    fontSize: "10px", fontWeight: "600",
    color: "#334155", letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "0 10px",
    marginBottom: "8px",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#64748b",
    fontSize: "13.5px",
    fontWeight: "500",
    transition: "all 0.15s ease",
    position: "relative",
    border: "1px solid transparent",
  },
  linkActive: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    border: "1px solid rgba(59,130,246,0.4)",
    boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
  },
  linkAction: {
    border: "1px dashed rgba(59,130,246,0.2)",
    color: "#3b82f6",
  },
  linkIcon: {
    fontSize: "14px",
    color: "#475569",
    transition: "color 0.15s",
    flexShrink: 0,
  },
  linkLabel: { flex: 1 },
  activeDot: {
    width: "6px", height: "6px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.5)",
  },
  footer: {
    marginTop: "auto",
    paddingTop: "24px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
  },
  footerDot: {
    width: "7px", height: "7px",
    borderRadius: "50%",
    background: "#10b981",
    animation: "pulse-dot 2s ease infinite",
    flexShrink: 0,
  },
  footerText: {
    fontSize: "12px",
    color: "#475569",
  },
};

export default Sidebar;
