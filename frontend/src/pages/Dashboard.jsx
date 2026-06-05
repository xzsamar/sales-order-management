import { useEffect, useState } from "react";
import API from "../services/api";
import StatCard from "../components/StatCard";
import {
  FaUsers, FaBox, FaShoppingCart, FaMoneyBillWave, FaExclamationTriangle,
} from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({ customers: 0, products: 0, orders: 0, revenue: 0 });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const [customers, products, orders] = await Promise.all([
        API.get("/customers"),
        API.get("/products"),
        API.get("/orders"),
      ]);
      const revenue = orders.data.reduce((t, o) => t + (o.grandTotal || 0), 0);
      setLowStockProducts(products.data.filter((p) => p.availableQty < 20));
      setRecentOrders(orders.data.slice().reverse().slice(0, 5));
      setStats({ customers: customers.data.length, products: products.data.length, orders: orders.data.length, revenue });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <div style={styles.liveChip}>
            <span style={styles.liveDot} />
            Live
          </div>
        </div>
        <h1 style={styles.pageTitle}>Business Overview</h1>
        <p style={styles.pageSub}>Real-time insights across customers, inventory, and revenue.</p>
      </div>

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        <StatCard title="Total Customers" value={stats.customers} icon={<FaUsers />} accent="blue" />
        <StatCard title="Products Listed" value={stats.products}  icon={<FaBox />}   accent="green" />
        <StatCard title="Orders Placed"   value={stats.orders}    icon={<FaShoppingCart />} accent="orange" />
        <StatCard title="Total Revenue"   value={`OMR ${stats.revenue.toFixed(3)}`} icon={<FaMoneyBillWave />} accent="purple" />
      </div>

      {/* Main grid */}
      <div style={styles.mainGrid}>
        {/* Recent Orders */}
        <div className="card">
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Recent Orders</h2>
            <span style={{ fontSize: "12px", color: "#475569" }}>Last 5</span>
          </div>
          {recentOrders.length === 0 ? (
            <p style={{ color: "#475569", fontSize: "13px", padding: "20px 0" }}>No orders found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Booking No</th>
                  <th>Customer</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span style={styles.mono}>{order.bookingNumber}</span>
                    </td>
                    <td style={{ color: "#94a3b8" }}>{order.customer?.customerName || "—"}</td>
                    <td style={{ textAlign: "right", color: "#10b981", fontWeight: 600 }}>
                      OMR {Number(order.grandTotal).toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Low Stock */}
        <div className="card">
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Low Stock Alert</h2>
            {lowStockProducts.length > 0 && (
              <span style={{ ...styles.badge, background: "rgba(244,63,94,0.12)", color: "#f43f5e" }}>
                {lowStockProducts.length} items
              </span>
            )}
          </div>
          {lowStockProducts.length === 0 ? (
            <div style={styles.allGood}>
              <span style={{ fontSize: "24px" }}>✅</span>
              <p>All products well stocked</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {lowStockProducts.map((product) => (
                <div key={product._id} style={styles.stockRow}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#e2e8f0" }}>
                      {product.productName}
                    </p>
                    <p style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>
                      {product.brand}
                    </p>
                  </div>
                  <span style={{
                    ...styles.badge,
                    background: product.availableQty < 5 ? "rgba(244,63,94,0.12)" : "rgba(245,158,11,0.12)",
                    color: product.availableQty < 5 ? "#f43f5e" : "#f59e0b",
                    fontFamily: "'DM Mono', monospace",
                  }}>
                    {product.availableQty} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="card" style={{ marginTop: "20px", borderColor: "rgba(59,130,246,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px", flexShrink: 0,
            borderRadius: "10px",
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px",
          }}>💊</div>
          <div>
            <h3 style={{ fontSize: "14px", color: "#e2e8f0", fontWeight: 600 }}>About This System</h3>
            <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px", lineHeight: 1.6 }}>
              Pharmaceutical sales management for Oman healthcare distributors — customers, inventory, orders, PDF invoices, and email notifications in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  liveChip: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
    color: "#10b981", fontSize: "11px", fontWeight: 600,
    padding: "3px 10px", borderRadius: "99px",
  },
  liveDot: {
    display: "inline-block", width: "6px", height: "6px",
    borderRadius: "50%", background: "#10b981",
  },
  pageTitle: { fontSize: "26px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.02em" },
  pageSub: { fontSize: "13px", color: "#475569", marginTop: "4px" },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "16px",
  },
  cardHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: "16px",
  },
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#e2e8f0" },
  mono: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "12.5px",
    color: "#60a5fa",
  },
  badge: {
    display: "inline-flex", alignItems: "center",
    padding: "3px 9px", borderRadius: "99px",
    fontSize: "11.5px", fontWeight: 600,
  },
  allGood: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: "10px", padding: "24px 0", color: "#475569", fontSize: "13px",
  },
  stockRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
};

export default Dashboard;
