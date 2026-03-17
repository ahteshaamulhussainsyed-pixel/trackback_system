// ─────────────────────────────────────────────
// components/ItemCard.jsx  –  Single Item Card
// Displays one lost or found item
// ─────────────────────────────────────────────

import React from "react";

function ItemCard({ item, onDelete, showDelete }) {
  // Format date nicely
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Badge colors by status
  const statusColors = {
    pending:   { bg: "#fef3c7", color: "#d97706" },
    matched:   { bg: "#dbeafe", color: "#2563eb" },
    recovered: { bg: "#d1fae5", color: "#059669" },
    closed:    { bg: "#f1f5f9", color: "#64748b" },
  };

  const statusStyle = statusColors[item.status] || statusColors.pending;

  return (
    <div style={styles.card}>
      {/* Item image or placeholder */}
      {item.image ? (
        <img
          src={`http://localhost:5000${item.image}`}
          alt={item.title}
          style={styles.image}
        />
      ) : (
        <div style={styles.imagePlaceholder}>
          {item.type === "lost" ? "🔍" : "📦"}
        </div>
      )}

      <div style={styles.body}>
        {/* Type badge */}
        <span
          style={{
            ...styles.typeBadge,
            background: item.type === "lost" ? "#fee2e2" : "#d1fae5",
            color: item.type === "lost" ? "#dc2626" : "#059669",
          }}
        >
          {item.type === "lost" ? "LOST" : "FOUND"}
        </span>

        {/* Title */}
        <h3 style={styles.title}>{item.title}</h3>

        {/* Description (truncated) */}
        <p style={styles.desc}>
          {item.description.length > 80
            ? item.description.slice(0, 80) + "..."
            : item.description}
        </p>

        {/* Details */}
        <div style={styles.details}>
          <span>📍 {item.location}</span>
          <span>📅 {formatDate(item.date)}</span>
          <span>🏷️ {item.category}</span>
        </div>

        {/* Reporter name */}
        {item.reportedBy && (
          <p style={styles.reporter}>
            Reported by: <strong>{item.reportedBy.name}</strong>
          </p>
        )}

        {/* Status badge */}
        <span
          style={{
            ...styles.statusBadge,
            background: statusStyle.bg,
            color: statusStyle.color,
          }}
        >
          {item.status.toUpperCase()}
        </span>

        {/* Delete button (shown only on My Reports page) */}
        {showDelete && onDelete && (
          <button
            onClick={() => onDelete(item._id)}
            style={styles.deleteBtn}
          >
            🗑 Delete
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
    fontSize: "48px",
  },
  body: {
    padding: "16px",
  },
  typeBadge: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    marginBottom: "8px",
  },
  title: {
    fontSize: "17px",
    fontFamily: "'Space Grotesk', sans-serif",
    marginBottom: "6px",
    color: "#1e293b",
  },
  desc: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "10px",
    lineHeight: "1.5",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "13px",
    color: "#475569",
    marginBottom: "10px",
  },
  reporter: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "10px",
  },
  statusBadge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    marginRight: "8px",
  },
  deleteBtn: {
    background: "#fee2e2",
    color: "#dc2626",
    border: "none",
    padding: "5px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    marginTop: "8px",
    display: "block",
    width: "100%",
  },
};

export default ItemCard;