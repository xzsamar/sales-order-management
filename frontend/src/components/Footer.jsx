const Footer = () => {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "16px 24px",
        textAlign: "center",
        color: "#64748b",
        fontSize: "13px",
      }}
    >
      <p>
        © {new Date().getFullYear()} Sales Order Management System
      </p>

      <p style={{ marginTop: "4px" }}>
        Developed by{" "}
        <span style={{ color: "#60a5fa" }}>
          Samar Ahmed
        </span>
      </p>
    </footer>
  );
};

export default Footer;