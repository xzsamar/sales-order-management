import { useEffect, useState } from "react";
import API from "../services/api";
import { FaSearch } from "react-icons/fa";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customers");
      setCustomers(res.data);
    } catch (err) { console.log(err); }
  };

  const viewPurchaseHistory = async (customerId) => {
    try {
      const res = await API.get(`/customers/${customerId}/history`);
      setPurchaseHistory(res.data);
      setShowHistory(true);
    } catch { alert("Purchase history not available"); }
  };

  const filtered = customers.filter((c) =>
    c.customerName.toLowerCase().includes(search.toLowerCase()) ||
    c.customerCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Customers</h1>
          <p style={styles.pageSub}>{customers.length} total records</p>
        </div>
        <div style={styles.searchWrap}>
          <FaSearch style={styles.searchIcon} size={12} />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Customer</th>
              <th>Contact Person</th>
              <th>Credit Limit</th>
              <th>Outstanding</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: "center", color: "#475569", padding: "40px" }}>No customers found</td></tr>
            ) : filtered.map((c) => (
              <tr key={c._id}>
                <td><span style={styles.codeChip}>{c.customerCode}</span></td>
                <td style={{ color: "#e2e8f0", fontWeight: 500 }}>{c.customerName}</td>
                <td>{c.contactPerson}</td>
                <td style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>OMR {c.creditLimit}</td>
                <td style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>
                  <span style={{ color: c.outstandingAmount > 0 ? "#f59e0b" : "#94a3b8" }}>
                    OMR {c.outstandingAmount}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${c.status === "Active" ? "green" : "red"}`}>
                    <span style={styles.statusDot(c.status)} />
                    {c.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={styles.btnBlue} onClick={() => { setSelectedCustomer(c); setShowDetails(true); }}>
                      Details
                    </button>
                    <button style={styles.btnGreen} onClick={() => viewPurchaseHistory(c._id)}>
                      History
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showDetails && selectedCustomer && (
        <div className="modal" onClick={() => setShowDetails(false)}>
          <div className="card" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Customer Profile</h2>
                <p style={{ fontSize: "12px", color: "#475569", marginTop: "2px" }}>
                  {selectedCustomer.customerCode}
                </p>
              </div>
              <span className={`badge badge-${selectedCustomer.status === "Active" ? "green" : "red"}`}>
                {selectedCustomer.status}
              </span>
            </div>
            <div style={styles.fieldGrid}>
              {[
                ["Customer Name", selectedCustomer.customerName],
                ["Contact Person", selectedCustomer.contactPerson],
                ["Mobile", selectedCustomer.mobileNumber],
                ["Credit Limit", `OMR ${selectedCustomer.creditLimit}`],
                ["Outstanding", `OMR ${selectedCustomer.outstandingAmount}`],
                ["Address", [
                  selectedCustomer.address?.area,
                  selectedCustomer.address?.city,
                  selectedCustomer.address?.country,
                ].filter(Boolean).join(", ") || "—"],
              ].map(([label, value]) => (
                <div key={label} style={styles.field}>
                  <span style={styles.fieldLabel}>{label}</span>
                  <span style={styles.fieldValue}>{value}</span>
                </div>
              ))}
            </div>
            {selectedCustomer.address?.googleMapUrl && (
              <a href={selectedCustomer.address.googleMapUrl} target="_blank" rel="noreferrer" style={styles.mapLink}>
                📍 View on Google Maps
              </a>
            )}
            <button style={{ ...styles.btnBlue, marginTop: "20px", width: "100%", justifyContent: "center" }}
              onClick={() => setShowDetails(false)}>Close</button>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="modal" onClick={() => setShowHistory(false)}>
          <div className="card" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Purchase History</h2>
              <span style={{ fontSize: "12px", color: "#475569" }}>{purchaseHistory.length} orders</span>
            </div>
            {purchaseHistory.length === 0 ? (
              <p style={{ color: "#475569", fontSize: "13px" }}>No purchase history found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Booking No</th>
                    <th style={{ textAlign: "right" }}>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistory.map((order) => (
                    <tr key={order._id}>
                      <td><span style={{ fontFamily: "'DM Mono', monospace", color: "#60a5fa", fontSize: "13px" }}>{order.bookingNumber}</span></td>
                      <td style={{ textAlign: "right", color: "#10b981", fontWeight: 600 }}>OMR {order.grandTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button style={{ ...styles.btnGreen, marginTop: "20px", width: "100%", justifyContent: "center" }}
              onClick={() => setShowHistory(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  pageTitle: { fontSize: "22px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.015em" },
  pageSub: { fontSize: "12px", color: "#475569", marginTop: "3px" },
  searchWrap: { position: "relative", width: "280px" },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#475569" },
  searchInput: { paddingLeft: "34px", background: "#111827", border: "1px solid rgba(255,255,255,0.08)" },
  codeChip: {
    fontFamily: "'DM Mono', monospace", fontSize: "12px",
    background: "rgba(59,130,246,0.08)", color: "#60a5fa",
    padding: "3px 8px", borderRadius: "6px", border: "1px solid rgba(59,130,246,0.15)",
  },
  statusDot: (status) => ({
    display: "inline-block", width: "5px", height: "5px",
    borderRadius: "50%", background: status === "Active" ? "#10b981" : "#f43f5e",
  }),
  btnBlue: {
    background: "rgba(37,99,235,0.12)", color: "#60a5fa",
    border: "1px solid rgba(59,130,246,0.2)", padding: "7px 14px",
    borderRadius: "8px", fontSize: "12.5px", fontWeight: 500,
  },
  btnGreen: {
    background: "rgba(16,185,129,0.1)", color: "#34d399",
    border: "1px solid rgba(16,185,129,0.2)", padding: "7px 14px",
    borderRadius: "8px", fontSize: "12.5px", fontWeight: 500,
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: "20px",
  },
  modalTitle: { fontSize: "17px", fontWeight: "700", color: "#f1f5f9" },
  fieldGrid: { display: "flex", flexDirection: "column", gap: "12px" },
  field: {
    display: "flex", justifyContent: "space-between", alignItems: "baseline",
    padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  fieldLabel: { fontSize: "12px", color: "#475569", fontWeight: 500 },
  fieldValue: { fontSize: "13.5px", color: "#e2e8f0", textAlign: "right", maxWidth: "60%" },
  mapLink: {
    display: "block", marginTop: "16px", color: "#60a5fa",
    fontSize: "13px", textDecoration: "none",
  },
};

export default Customers;
