const accentMap = {
  blue:   { bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.2)",  color: "#60a5fa" },
  green:  { bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.2)",  color: "#34d399" },
  orange: { bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.2)",  color: "#fb923c" },
  purple: { bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.2)",  color: "#a78bfa" },
};

const StatCard = ({ title, value, icon, accent = "blue", trend }) => {
  const colors = accentMap[accent] || accentMap.blue;

  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        transition: "all 0.2s ease",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px ${colors.border}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: "-20px", right: "-20px",
        width: "80px", height: "80px",
        borderRadius: "50%",
        background: colors.bg,
        filter: "blur(20px)",
        pointerEvents: "none",
      }} />

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p style={{
          fontSize: "11.5px", fontWeight: "600",
          color: "#475569", letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>
          {title}
        </p>
        <div style={{
          width: "36px", height: "36px",
          borderRadius: "10px",
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: colors.color,
          fontSize: "15px",
        }}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
        <span style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#f1f5f9",
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}>
          {value}
        </span>
        {trend && (
          <span style={{
            fontSize: "12px", fontWeight: "500",
            color: trend > 0 ? "#10b981" : "#f43f5e",
          }}>
            {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
