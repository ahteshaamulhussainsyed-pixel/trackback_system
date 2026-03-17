// ─────────────────────────────────────────────
// pages/Dashboard.jsx  –  User Dashboard
// Shows user's reports and quick actions
// ─────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ItemCard from "../components/ItemCard";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("trackback_user") || "null");
  const token = localStorage.getItem("trackback_token");

  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const res = await axios.get("/api/items/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await axios.delete(`/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Report deleted.");
      setMyItems(myItems.filter((i) => i._id !== itemId));
    } catch (err) {
      setMessage("Could not delete. Try again.");
    }
  };

  // Split into lost and found
  const lostItems = myItems.filter((i) => i.type === "lost");
  const foundItems = myItems.filter((i) => i.type === "found");

  return (
    <div className="page">
      <div className="container">
        {/* Welcome header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>👋 Welcome, {user?.name}</h1>
            <p style={{ color: "#64748b" }}>
              Manage your lost & found reports from here
            </p>
          </div>
          <div style={styles.headerButtons}>
            <Link to="/report-lost" className="btn btn-danger btn-sm">
              📋 Report Lost
            </Link>
            <Link to="/report-found" className="btn btn-primary btn-sm">
              📦 Report Found
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {[
            { label: "Total Reports", value: myItems.length, color: "#2563eb" },
            { label: "Lost Items", value: lostItems.length, color: "#ef4444" },
            { label: "Found Items", value: foundItems.length, color: "#22c55e" },
            {
              label: "Recovered",
              value: myItems.filter((i) => i.status === "recovered").length,
              color: "#f59e0b",
            },
          ].map((stat, i) => (
            <div key={i} className="card" style={styles.statCard}>
              <div style={{ ...styles.statValue, color: stat.color }}>
                {stat.value}
              </div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className="alert alert-info" style={{ marginBottom: "16px" }}>
            {message}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: "center", color: "#64748b", marginTop: "40px" }}>
            Loading your reports...
          </p>
        ) : myItems.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>📭</div>
            <h3>No reports yet</h3>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>
              You haven't submitted any lost or found reports.
            </p>
            <Link to="/report-lost" className="btn btn-primary">
              Submit Your First Report
            </Link>
          </div>
        ) : (
          <>
            {/* Lost Items */}
            {lostItems.length > 0 && (
              <section style={{ marginBottom: "40px" }}>
                <h2 style={styles.sectionTitle}>
                  🔍 My Lost Item Reports ({lostItems.length})
                </h2>
                <div className="items-grid">
                  {lostItems.map((item) => (
                    <ItemCard
                      key={item._id}
                      item={item}
                      showDelete={true}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Found Items */}
            {foundItems.length > 0 && (
              <section>
                <h2 style={styles.sectionTitle}>
                  📦 My Found Item Reports ({foundItems.length})
                </h2>
                <div className="items-grid">
                  {foundItems.map((item) => (
                    <ItemCard
                      key={item._id}
                      item={item}
                      showDelete={true}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "28px",
  },
  title: {
    fontSize: "28px",
    fontFamily: "'Space Grotesk', sans-serif",
    marginBottom: "4px",
  },
  headerButtons: { display: "flex", gap: "10px", flexWrap: "wrap" },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  },
  statCard: { textAlign: "center", padding: "20px" },
  statValue: {
    fontSize: "36px",
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
    marginBottom: "4px",
  },
  statLabel: { color: "#64748b", fontSize: "13px" },
  sectionTitle: {
    fontSize: "20px",
    fontFamily: "'Space Grotesk', sans-serif",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "2px solid #e2e8f0",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "white",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    marginTop: "30px",
  },
};

export default Dashboard;