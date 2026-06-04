const Navbar = () => {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px 30px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h2>Sales Order Management</h2>

        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            marginTop: "4px",
          }}
        >
          Manage customers, products and orders
        </p>
      </div>

      <div
        style={{
          background: "#2563eb",
          color: "white",
          padding: "10px 16px",
          borderRadius: "10px",
          fontWeight: "600",
        }}
      >
        Admin User
      </div>
    </div>
  );
};

export default Navbar;