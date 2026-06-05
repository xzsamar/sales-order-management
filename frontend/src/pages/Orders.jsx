import { useEffect, useState } from "react";
import API from "../services/api";
import { FaFilePdf, FaTrash, FaFilter } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customers");
      setCustomers(res.data);
    } catch (err) { console.log(err); }
  };

  const downloadPDF = (id) => {
    window.open(`${import.meta.env.VITE_API_URL}/orders/pdf/${id}`, "_blank");
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order? This cannot be undone.")) return;
    try {
      await API.delete(`/orders/${id}`);
      fetchOrders();
    } catch { alert("Delete failed"); }
  };

  const filtered = orders.filter((o) => {
    const matchSearch = o.bookingNumber?.toLowerCase().includes(search.toLowerCase());
    const matchCustomer = !selectedCustomer || o.customer?._id === selectedCustomer;
    return matchSearch && matchCustomer;
  });

  const clearFilters = () => { setSearch(""); setSelectedCustomer(""); };

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Orders</h1>
          <p style={styles.pageSub}>{orders.length} total · {filtered.length} shown</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={styles.filterCard}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569" }}>
          <FaFilter size={11} />
          <span style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Filters</span>
        </div>
        <input
          type="text"
          placeholder="Search booking number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.filterInput}
        />
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          style={styles.filterInput}
        >
          <option value="">All Customers</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>{c.customerName}</option>
          ))}
        </select>
        {(search || selectedCustomer) && (
          <button onClick={clearFilters} style={styles.clearBtn}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Booking No</th>
              <th>Customer</th>
              <th>Sales Person</th>
              <th>Delivery Date</th>
              <th style={{ textAlign: "right" }}>Grand Total</th>
              <th style={{ textAlign: "center" }}>PDF</th>
              <th style={{ textAlign: "center" }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", color: "#475569", padding: "48px" }}>
                  No orders match your filters
                </td>
              </tr>
            ) : filtered.map((order) => (
              <tr key={order._id}>
                <td>
                  <span style={styles.bookingNum}>{order.bookingNumber}</span>
                </td>
                <td style={{ color: "#e2e8f0", fontWeight: 500 }}>{order.customer?.customerName || "—"}</td>
                <td style={{ color: "#94a3b8" }}>{order.salesPerson}</td>
                <td style={{ color: "#64748b" }}>
                  {new Date(order.deliveryDate).toLocaleDateString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </td>
                <td style={{ textAlign: "right" }}>
                  <span style={styles.totalAmount}>OMR {Number(order.grandTotal).toFixed(3)}</span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <button style={styles.pdfBtn} onClick={() => downloadPDF(order._id)} title="Download PDF">
                    <FaFilePdf size={13} />
                  </button>
                </td>
                <td style={{ textAlign: "center" }}>
                  <button style={styles.deleteBtn} onClick={() => deleteOrder(order._id)} title="Delete order">
                    <FaTrash size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  pageTitle: { fontSize: "22px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.015em" },
  pageSub: { fontSize: "12px", color: "#475569", marginTop: "3px" },
  filterCard: {
    display: "flex", alignItems: "center", gap: "14px",
    padding: "14px 18px", marginBottom: "16px",
    flexWrap: "wrap",
  },
  filterInput: {
    width: "220px", flex: "0 0 220px",
    background: "#07090f", border: "1px solid rgba(255,255,255,0.08)",
    fontSize: "13px", padding: "9px 12px",
  },
  clearBtn: {
    background: "rgba(244,63,94,0.08)", color: "#f43f5e",
    border: "1px solid rgba(244,63,94,0.2)",
    padding: "8px 14px", borderRadius: "8px",
    fontSize: "12.5px", fontWeight: 500,
  },
  bookingNum: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "12.5px", color: "#60a5fa",
    background: "rgba(59,130,246,0.08)",
    padding: "3px 9px", borderRadius: "6px",
    border: "1px solid rgba(59,130,246,0.15)",
  },
  totalAmount: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "13px", fontWeight: 600, color: "#10b981",
  },
  pdfBtn: {
    width: "32px", height: "32px",
    background: "rgba(245,158,11,0.1)", color: "#f59e0b",
    border: "1px solid rgba(245,158,11,0.2)",
    borderRadius: "8px", padding: 0,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
  },
  deleteBtn: {
    width: "32px", height: "32px",
    background: "rgba(244,63,94,0.08)", color: "#f43f5e",
    border: "1px solid rgba(244,63,94,0.15)",
    borderRadius: "8px", padding: 0,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
  },
};

export default Orders;
