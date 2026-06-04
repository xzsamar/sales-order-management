const StatCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#ffffff,#f8fafc)",
        padding: "24px",
        borderRadius: "20px",

        border:
          "1px solid rgba(0,0,0,0.05)",

        boxShadow:
          "0 10px 30px rgba(0,0,0,0.08)",

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-5px)";
        e.currentTarget.style.boxShadow =
          "0 15px 35px rgba(37,99,235,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0px)";
        e.currentTarget.style.boxShadow =
          "0 10px 30px rgba(0,0,0,0.08)";
      }}
    >
      <div>
        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            marginBottom: "8px",
            fontWeight: "500",
          }}
        >
          {title}
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: "700",
            color: "#0f172a",
          }}
        >
          {value}
        </h1>
      </div>
<div
  style={{
    fontSize: "42px",
    opacity: 0.85,
  }}
>
  {icon}
</div>
    </div>
  );
};

export default StatCard;