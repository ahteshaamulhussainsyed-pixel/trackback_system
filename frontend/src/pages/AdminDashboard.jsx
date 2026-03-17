// ─────────────────────────────────────────────
// pages/AdminDashboard.jsx  –  Admin Control Panel
// Only accessible by users with role = "admin"
// ─────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("trackback_user") || "null");
  const token = localStorage.getItem("trackback_token");

  // Active tab in the admin panel
  const [tab, setTab] = useState("overview");

  // Data state
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Auth guard – redirect if not admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, usersRes, itemsRes] = await Promise.all([
        axios.get("/api/admin/stats", { headers }),
        axios.get("/api/admin/users", { headers }),
        axios.get("/api/admin/items", { headers }),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setItems(itemsRes.data);
    } catch (err) {
      setMessage("Error loading admin data.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user and all their reports?")) return;
    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
      setMessage("User deleted.");
      fetchAll(); // refresh stats
    } catch {
      setMessage("Failed to delete user.");
    }
  };

  // Change item status
  const updateItemStatus = async (id, status) => {
    try {
      await axios.put(
        `/api/admin/items/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(items.map((i) => (i._id === id ? { ...i, status } : i)));
      setMessage(`Item marked as ${status}`);
    } catch {
      setMessage("Failed to update status.");
    }
  };

  // Delete an item report
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item report?")) return;
    try {
      await axios.delete(`/api/admin/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((i) => i._id !== id));
      setMessage("Item deleted.");
    } catch {
      setMessage("Failed to delete item.");
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  if (loading) {
    return (
      <div className="page" style={{ textAlign: "center" }}>
        <p style={{ color: "#64748b", marginTop: "80px" }}>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        {/* Admin Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>⚙️ Admin Dashboard</h1>
            <p style={{ color: "#64748b" }}>TRACKBACK platform management</p>
          </div>
          <span style={styles.adminBadge}>ADMIN</span>
        </div>

        {/* Message */}
        {message && (
          <div className="alert alert-info" style={{ marginBottom: "16px" }}>
            {message}
            <button
              onClick={() => setMessage("")}
              style={{ float: "right", background: "none", border: "none", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Buttons */}
        <div style={styles.tabs}>
          {["overview", "users", "items"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                ...styles.tabBtn,
                background: tab === t ? "#2563eb" : "white",
                color: tab === t ? "white" : "#64748b",
                border: tab === t ? "none" : "1.5px solid #e2e8f0",
              }}
            >
              {t === "overview" ? "📊 Overview" : t === "users" ? "👥 Users" : "📋 All Items"}
            </button>
          ))}
        </div>

        {/* ── TAB: OVERVIEW ── */}
        {tab === "overview" && stats && (
          <div>
            <div style={styles.statsGrid}>
              {[
                { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "#2563eb" },
                { label: "Lost Reports", value: stats.totalLost, icon: "🔍", color: "#ef4444" },
                { label: "Found Reports", value: stats.totalFound, icon: "📦", color: "#22c55e" },
                { label: "Matched", value: stats.totalMatched, icon: "🔗", color: "#8b5cf6" },
                { label: "Recovered", value: stats.totalRecovered, icon: "✅", color: "#f59e0b" },
              ].map((s, i) => (
                <div key={i} className="card" style={styles.statCard}>
                  <div style={styles.statIcon}>{s.icon}</div>
                  <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ marginTop: "24px", padding: "24px" }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", marginBottom: "16px" }}>
                Quick Actions
              </h3>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button className="btn btn-primary btn-sm" onClick={() => setTab("users")}>
                  Manage Users
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => setTab("items")}>
                  Manage Items
                </button>
                <button
                  className="btn btn-sm"
                  style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}
                  onClick={fetchAll}
                >
                  🔄 Refresh Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: USERS ── */}
        {tab === "users" && (
          <div>
            <h2 style={styles.sectionTitle}>👥 Registered Users ({users.length})</h2>
            {users.length === 0 ? (
              <p style={{ color: "#64748b" }}>No users registered yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Phone</th>
                      <th style={styles.th}>Joined</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} style={styles.tr}>
                        <td style={styles.td}>{u.name}</td>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>{u.phone || "—"}</td>
                        <td style={styles.td}>{formatDate(u.createdAt)}</td>
                        <td style={styles.td}>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteUser(u._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: ITEMS ── */}
        {tab === "items" && (
          <div>
            <h2 style={styles.sectionTitle}>📋 All Item Reports ({items.length})</h2>
            {items.length === 0 ? (
              <p style={{ color: "#64748b" }}>No item reports yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Title</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Location</th>
                      <th style={styles.th}>Reported By</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item._id} style={styles.tr}>
                        <td style={styles.td}>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: 700,
                              background: item.type === "lost" ? "#fee2e2" : "#d1fae5",
                              color: item.type === "lost" ? "#dc2626" : "#059669",
                            }}
                          >
                            {item.type.toUpperCase()}
                          </span>
                        </td>
                        <td style={styles.td}>{item.title}</td>
                        <td style={styles.td}>{item.category}</td>
                        <td style={styles.td}>{item.location}</td>
                        <td style={styles.td}>
                          {item.reportedBy?.name || "Unknown"}
                        </td>
                        <td style={styles.td}>
                          <select
                            value={item.status}
                            onChange={(e) => updateItemStatus(item._id, e.target.value)}
                            style={styles.statusSelect}
                          >
                            <option value="pending">Pending</option>
                            <option value="matched">Matched</option>
                            <option value="recovered">Recovered</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td style={styles.td}>{formatDate(item.createdAt)}</td>
                        <td style={styles.td}>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteItem(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: { fontSize: "28px", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "4px" },
  adminBadge: {
    background: "#f59e0b",
    color: "white",
    padding: "6px 16px",
    borderRadius: "20px",
    fontWeight: 700,
    fontSize: "13px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  tabs: { display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" },
  tabBtn: {
    padding: "9px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.2s",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "16px",
  },
  statCard: { textAlign: "center", padding: "24px 16px" },
  statIcon: { fontSize: "28px", marginBottom: "8px" },
  statValue: { fontSize: "36px", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" },
  statLabel: { color: "#64748b", fontSize: "13px", marginTop: "4px" },
  sectionTitle: {
    fontSize: "20px",
    fontFamily: "'Space Grotesk', sans-serif",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "2px solid #e2e8f0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    fontSize: "14px",
  },
  thead: { background: "#f8fafc" },
  th: {
    padding: "12px 14px",
    textAlign: "left",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    color: "#475569",
    fontSize: "13px",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 14px", color: "#374151", verticalAlign: "middle" },
  statusSelect: {
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    fontSize: "13px",
    background: "white",
  },
};

export default AdminDashboard;