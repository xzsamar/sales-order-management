import { useLocation } from "react-router-dom";
import { FaBell } from "react-icons/fa";

const pageTitles = {
  "/":             { title: "Dashboard",    sub: "Overview & key metrics" },
  "/customers":    { title: "Customers",    sub: "Manage customer records" },
  "/products":     { title: "Products",     sub: "Product catalog & inventory" },
  "/orders":       { title: "Orders",       sub: "Sales order management" },
  "/create-order": { title: "Create Order", sub: "New sales booking" },
};

const Navbar = () => {
  const location = useLocation();
  const page = pageTitles[location.pathname] || { title: "Page", sub: "" };
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <header style={styles.navbar}>
      {/* Page info */}
      <div>
        <h1 style={styles.title}>{page.title}</h1>
        <p style={styles.sub}>{page.sub}</p>
      </div>

      {/* Right cluster */}
      <div style={styles.right}>
        {/* Clock */}
        <div style={styles.clock}>
          <span style={styles.time}>{timeStr}</span>
          <span style={styles.date}>{dateStr}</span>
        </div>

        {/* Bell */}
        <button style={styles.iconBtn} title="Notifications">
          <FaBell size={15} />
          <span style={styles.notifDot} />
        </button>

        {/* Avatar */}
        <div style={styles.avatar}>
          <div style={styles.avatarInner}>A</div>
          <div>
            <div style={styles.avatarName}>Admin User</div>
            <div style={styles.avatarRole}>Sales Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
};

const styles = {
  navbar: {
    background: "#0d1117",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    padding: "16px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(8px)",
  },
  title: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#f1f5f9",
    letterSpacing: "-0.01em",
    lineHeight: 1.2,
  },
  sub: {
    fontSize: "12px",
    color: "#475569",
    marginTop: "2px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  clock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  time: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#94a3b8",
    fontFamily: "'DM Mono', monospace",
  },
  date: {
    fontSize: "11px",
    color: "#475569",
  },
  iconBtn: {
    width: "36px", height: "36px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#64748b",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
    position: "relative",
    padding: 0,
  },
  notifDot: {
    position: "absolute",
    top: "8px", right: "8px",
    width: "6px", height: "6px",
    borderRadius: "50%",
    background: "#f43f5e",
    border: "1.5px solid #0d1117",
  },
  avatar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "6px 12px 6px 6px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    cursor: "pointer",
  },
  avatarInner: {
    width: "30px", height: "30px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "white",
    fontWeight: "700",
    fontSize: "13px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  avatarName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#e2e8f0",
    lineHeight: 1.2,
  },
  avatarRole: {
    fontSize: "11px",
    color: "#475569",
  },
};

export default Navbar;
