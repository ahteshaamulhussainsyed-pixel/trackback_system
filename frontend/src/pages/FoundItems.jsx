// ─────────────────────────────────────────────
// pages/FoundItems.jsx  –  Browse All Found Items
// Public page – anyone can view
// ─────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";

const CATEGORIES = ["All", "Electronics", "Clothing", "Bags", "Documents", "Jewellery", "Keys", "Wallet", "Other"];

function FoundItems() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    let result = items;
    if (category !== "All") {
      result = result.filter((i) => i.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [items, search, category]);

  const fetchItems = async () => {
    try {
      const res = await axios.get("/api/items/found");
      setItems(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching found items");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div style={styles.header}>
          <h1 style={styles.title}>📦 Found Items</h1>
          <p style={{ color: "#64748b" }}>
            Someone turned these in! Is one of them yours?
          </p>
        </div>

        <div style={styles.filterBar}>
          <input
            type="text"
            placeholder="Search by name, description or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.categorySelect}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {!loading && (
          <p style={styles.count}>
            Showing <strong>{filtered.length}</strong> found item{filtered.length !== 1 ? "s" : ""}
          </p>
        )}

        {loading ? (
          <p style={styles.loadingText}>Loading found items...</p>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: "56px", marginBottom: "12px" }}>📭</div>
            <h3>No items found</h3>
            <p style={{ color: "#64748b" }}>Try a different search or category</p>
          </div>
        ) : (
          <div className="items-grid">
            {filtered.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: { marginBottom: "28px" },
  title: {
    fontSize: "30px",
    fontFamily: "'Space Grotesk', sans-serif",
    marginBottom: "6px",
  },
  filterBar: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  searchInput: {
    flex: 1,
    minWidth: "220px",
    padding: "10px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "15px",
  },
  categorySelect: {
    padding: "10px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "15px",
    background: "white",
    minWidth: "140px",
  },
  count: { color: "#64748b", fontSize: "14px", marginBottom: "12px" },
  loadingText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: "60px",
    fontSize: "16px",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "white",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    marginTop: "20px",
  },
};

export default FoundItems;