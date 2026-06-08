import { useEffect, useState } from "react";
import API from "../services/api";
import { FaSearch } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [variations, setVariations] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productName, setProductName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [stock, setStock] = useState("");
  const ITEMS_PER_PAGE = 10;

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) { console.log(err); }
  };

  const viewAlternatives = async (id) => {
    try {
      const res = await API.get(`/products/${id}/similar`);
      setSimilarProducts(res.data);
      setShowAlternatives(true);
    } catch (err) { console.log(err); }
  };

  const viewVariations = async (id) => {
    try {
      const res = await API.get(`/products/${id}/variations`);
      setVariations(res.data);
      setShowVariations(true);
    } catch (err) { console.log(err); }
  };

  const addProduct = async () => {
    try {
      await API.post("/products", {
        productName,
        unitPrice,
        stock,
      });
      alert("Product added successfully!");
      setProductName("");
      setUnitPrice("");
      setStock("");
    } catch (error) {
      console.log(error);
      alert("Failed to add product. Please try again.");
    }
    };
  

  const filtered = products.filter((p) =>
    p.productName?.toLowerCase().includes(search.toLowerCase()) ||
    p.productCode?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.genericName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build page number range (show at most 5 pages around current)
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);
    for (let i = left; i <= right; i++) pages.push(i);
    return pages;
  };

  const stockLevel = (qty) => {
    if (qty < 5) return { color: "#f43f5e", bg: "rgba(244,63,94,0.1)", label: "Out of Stock" };
    if (qty < 20) return { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", label: "Low Stock" };
    return { color: "#10b981", bg: "rgba(16,185,129,0.1)", label: "In Stock" };
  };

  return (
    <div>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Products</h1>
          <p style={styles.pageSub}>
            {filtered.length === products.length
              ? `${products.length} products in catalog`
              : `${filtered.length} results · showing ${Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–${Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}`}
          </p>
        </div>
        <div style={styles.searchWrap}>
          <FaSearch style={styles.searchIcon} size={12} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Grid */}
      <div style={styles.grid}>
        {paginated.map((product) => {
          const stock = stockLevel(product.availableQty);
          return (
            
            <div key={product._id} className="card" style={styles.productCard}>
              {/* Top */}
              <div style={styles.cardTop}>
                <div style={styles.productIcon}>💊</div>
                <span style={{ ...styles.stockBadge, color: stock.color, background: stock.bg }}>
                  {stock.label}
                </span>
              </div>
              {/* Add Product Form */}
<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  }}
>
  <input
    type="text"
    placeholder="Product Name"
    value={productName}
    onChange={(e) => setProductName(e.target.value)}
    style={{
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #374151",
      background: "#111827",
      color: "#fff",
    }}
  />

  <input
    type="number"
    placeholder="Unit Price"
    value={unitPrice}
    onChange={(e) => setUnitPrice(e.target.value)}
    style={{
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #374151",
      background: "#111827",
      color: "#fff",
    }}
  />

  <input
    type="number"
    placeholder="Stock"
    value={stock}
    onChange={(e) => setStock(e.target.value)}
    style={{
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #374151",
      background: "#111827",
      color: "#fff",
    }}
  />

  <button
    onClick={addProduct}
    style={{
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      background: "#2563eb",
      color: "#fff",
      cursor: "pointer",
    }}
  >
    Add Product
  </button>
</div>

              <h3 style={styles.productName}>{product.productName}</h3>

              <div style={styles.metaRow}>
                <span style={styles.codeTag}>{product.productCode}</span>
                <span style={styles.brandTag}>{product.brand}</span>
              </div>

              <p style={styles.generic}>{product.genericName}</p>

              {/* Stats */}
              
              <div style={styles.statsGrid}>
                <div style={styles.statBlock}>
                  <span style={styles.statLabel}>Price</span>
                  <span style={styles.statValue}>OMR {product.unitPrice}</span>
                </div>
                <div style={styles.statBlock}>
                  <span style={styles.statLabel}>Stock</span>
                  <span style={{ ...styles.statValue, color: stock.color }}>{product.availableQty}</span>
                </div>
                <div style={styles.statBlock}>
                  <span style={styles.statLabel}>Discount</span>
                  <span style={styles.statValue}>{product.discountPercentage}%</span>
                </div>
                <div style={styles.statBlock}>
                  <span style={styles.statLabel}>FOC</span>
                  <span style={styles.statValue}>Buy{product.focBuyQty} Get{product.focFreeQty}</span>
                </div>
              </div>

              <div style={styles.actions}>
                <button style={styles.btnBlue} onClick={() => { setSelectedProduct(product); setShowDetails(true); }}>Details</button>
                <button style={styles.btnGreen} onClick={() => viewAlternatives(product._id)}>Alternatives</button>
                <button style={styles.btnPurple} onClick={() => viewVariations(product._id)}>Variations</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <span style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <div style={styles.pageControls}>
            <button
              style={{ ...styles.pageBtn, ...(currentPage === 1 ? styles.pageBtnDisabled : {}) }}
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >«</button>
            <button
              style={{ ...styles.pageBtn, ...(currentPage === 1 ? styles.pageBtnDisabled : {}) }}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >‹</button>

            {getPageNumbers()[0] > 1 && (
              <>
                <button style={styles.pageBtn} onClick={() => goToPage(1)}>1</button>
                {getPageNumbers()[0] > 2 && <span style={styles.pageDots}>…</span>}
              </>
            )}

            {getPageNumbers().map((page) => (
              <button
                key={page}
                style={{ ...styles.pageBtn, ...(page === currentPage ? styles.pageBtnActive : {}) }}
                onClick={() => goToPage(page)}
              >{page}</button>
            ))}

            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
              <>
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && <span style={styles.pageDots}>…</span>}
                <button style={styles.pageBtn} onClick={() => goToPage(totalPages)}>{totalPages}</button>
              </>
            )}

            <button
              style={{ ...styles.pageBtn, ...(currentPage === totalPages ? styles.pageBtnDisabled : {}) }}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >›</button>
            <button
              style={{ ...styles.pageBtn, ...(currentPage === totalPages ? styles.pageBtnDisabled : {}) }}
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >»</button>
          </div>
        </div>
      )}
      {showDetails && selectedProduct && (
        <div className="modal" onClick={() => setShowDetails(false)}>
          <div className="card" onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Product Details</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
              {[
                ["Product", selectedProduct.productName],
                ["Code", selectedProduct.productCode],
                ["Brand", selectedProduct.brand],
                ["Generic Name", selectedProduct.genericName],
                ["Price", `OMR ${selectedProduct.unitPrice}`],
                ["Available Stock", selectedProduct.availableQty],
                ["Discount", `${selectedProduct.discountPercentage}%`],
              ].map(([label, value]) => (
                <div key={label} style={styles.detailRow}>
                  <span style={styles.detailLabel}>{label}</span>
                  <span style={styles.detailValue}>{value}</span>
                </div>
              ))}
            </div>
            <button style={{ ...styles.btnBlue, width: "100%", justifyContent: "center", marginTop: "20px" }}
              onClick={() => setShowDetails(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Alternatives Modal */}
      {showAlternatives && (
        <div className="modal" onClick={() => setShowAlternatives(false)}>
          <div className="card" onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Alternative Brands</h2>
            <div style={{ marginTop: "16px" }}>
              {similarProducts.length === 0 ? (
                <p style={{ color: "#475569", fontSize: "13px" }}>No alternatives found.</p>
              ) : similarProducts.map((p) => (
                <div key={p._id} style={styles.altRow}>
                  <div>
                    <p style={{ fontWeight: 600, color: "#e2e8f0", fontSize: "13.5px" }}>{p.productName}</p>
                    <p style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>{p.brand}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#10b981", fontWeight: 600, fontSize: "13px" }}>{p.availableQty} in stock</p>
                  </div>
                </div>
              ))}
            </div>
            <button style={{ ...styles.btnBlue, width: "100%", justifyContent: "center", marginTop: "20px" }}
              onClick={() => setShowAlternatives(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Variations Modal */}
      {showVariations && (
        <div className="modal" onClick={() => setShowVariations(false)}>
          <div className="card" onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Product Variations</h2>
            <div style={{ marginTop: "16px" }}>
              {variations.length === 0 ? (
                <p style={{ color: "#475569", fontSize: "13px" }}>No variations found.</p>
              ) : variations.map((p) => (
                <div key={p._id} style={styles.altRow}>
                  <div>
                    <p style={{ fontWeight: 600, color: "#e2e8f0", fontSize: "13.5px" }}>{p.productName}</p>
                    <p style={{ color: "#64748b", fontSize: "12px" }}>{p.brand}</p>
                  </div>
                </div>
              ))}
            </div>
            <button style={{ ...styles.btnPurple, width: "100%", justifyContent: "center", marginTop: "20px" }}
              onClick={() => setShowVariations(false)}>Close</button>
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "16px",
  },
  productCard: { display: "flex", flexDirection: "column", gap: "12px", background: "#161d2b", borderColor: "rgba(255,255,255,0.08)" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  productIcon: {
    width: "36px", height: "36px", borderRadius: "10px",
    background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
  },
  stockBadge: {
    fontSize: "11px", fontWeight: 600,
    padding: "3px 9px", borderRadius: "99px",
  },
  productName: { fontSize: "14px", fontWeight: "700", color: "#e2e8f0", lineHeight: 1.3 },
  metaRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  codeTag: {
    fontFamily: "'DM Mono', monospace", fontSize: "11px",
    background: "rgba(59,130,246,0.12)", color: "#93c5fd",
    padding: "2px 8px", borderRadius: "5px", border: "1px solid rgba(59,130,246,0.2)",
  },
  brandTag: {
    fontSize: "11px", background: "rgba(255,255,255,0.07)",
    color: "#94a3b8", padding: "2px 8px", borderRadius: "5px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  generic: { fontSize: "12px", color: "#64748b" },
  statsGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "1px", background: "rgba(255,255,255,0.06)",
    borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)",
  },
  statBlock: {
    display: "flex", flexDirection: "column", gap: "2px",
    padding: "10px 12px", background: "#0f1520",
  },
  statLabel: { fontSize: "10px", color: "#4b5e7a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" },
  statValue: { fontSize: "14px", fontWeight: "600", color: "#cbd5e1", fontVariantNumeric: "tabular-nums" },
  actions: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" },
  btnBlue: {
    flex: 1, justifyContent: "center",
    background: "rgba(37,99,235,0.12)", color: "#60a5fa",
    border: "1px solid rgba(59,130,246,0.2)", padding: "8px 12px",
    borderRadius: "8px", fontSize: "12px", fontWeight: 500,
  },
  btnGreen: {
    flex: 1, justifyContent: "center",
    background: "rgba(16,185,129,0.1)", color: "#34d399",
    border: "1px solid rgba(16,185,129,0.2)", padding: "8px 12px",
    borderRadius: "8px", fontSize: "12px", fontWeight: 500,
  },
  btnPurple: {
    flex: 1, justifyContent: "center",
    background: "rgba(139,92,246,0.1)", color: "#a78bfa",
    border: "1px solid rgba(139,92,246,0.2)", padding: "8px 12px",
    borderRadius: "8px", fontSize: "12px", fontWeight: 500,
  },
  modalTitle: { fontSize: "17px", fontWeight: "700", color: "#f1f5f9" },
  detailRow: {
    display: "flex", justifyContent: "space-between",
    padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  detailLabel: { fontSize: "12px", color: "#475569" },
  detailValue: { fontSize: "13px", color: "#e2e8f0", fontWeight: 500 },
  altRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  pagination: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginTop: "28px", paddingTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
  pageInfo: { fontSize: "12px", color: "#475569" },
  pageControls: { display: "flex", alignItems: "center", gap: "4px" },
  pageBtn: {
    minWidth: "32px", height: "32px", padding: "0 8px",
    borderRadius: "8px", fontSize: "13px", fontWeight: 500,
    background: "rgba(255,255,255,0.05)", color: "#94a3b8",
    border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.15s",
  },
  pageBtnActive: {
    background: "rgba(37,99,235,0.2)", color: "#60a5fa",
    border: "1px solid rgba(59,130,246,0.4)",
  },
  pageBtnDisabled: {
    opacity: 0.3, cursor: "not-allowed",
  },
  pageDots: { fontSize: "13px", color: "#475569", padding: "0 4px" },
};

export default Products;
