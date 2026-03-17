// ─────────────────────────────────────────────
// pages/ReportLost.jsx  –  Report a Lost Item
// ─────────────────────────────────────────────

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// List of categories user can choose from
const CATEGORIES = [
  "Electronics", "Clothing", "Bags", "Documents",
  "Jewellery", "Keys", "Wallet", "Other",
];

function ReportLost() {
  const navigate = useNavigate();
  const token = localStorage.getItem("trackback_token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    location: "",
    date: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // When user selects an image, show a preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use FormData to send text + file together
      const formData = new FormData();
      formData.append("type", "lost");
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("location", form.location);
      formData.append("date", form.date);
      if (image) formData.append("image", image);

      const res = await axios.post("/api/items/report", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMatches(res.data.possibleMatches || []);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success screen after submission
  if (submitted) {
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: "600px" }}>
          <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", marginBottom: "8px" }}>
              Report Submitted!
            </h2>
            <p style={{ color: "#64748b", marginBottom: "24px" }}>
              Your lost item report has been filed. We'll notify you when a match is found.
            </p>

            {/* Show matches if any were found immediately */}
            {matches.length > 0 && (
              <div className="alert alert-success" style={{ textAlign: "left" }}>
                🎉 <strong>Great news!</strong> We found {matches.length} possible match(es) already!
                <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                  {matches.map((m) => (
                    <li key={m._id}>
                      {m.title} – {m.location}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/dashboard")}
              >
                Go to My Reports
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ title: "", description: "", category: "Other", location: "", date: "" });
                  setImage(null);
                  setImagePreview(null);
                }}
              >
                Report Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: "620px" }}>
        <div className="card">
          {/* Page header */}
          <div style={styles.pageHeader}>
            <span style={styles.pageIcon}>🔍</span>
            <div>
              <h1 style={styles.pageTitle}>Report a Lost Item</h1>
              <p style={{ color: "#64748b", fontSize: "14px" }}>
                Fill in as many details as possible to help us find it
              </p>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Item Title */}
            <div className="form-group">
              <label>Item Name / Title *</label>
              <input
                type="text"
                name="title"
                placeholder='e.g. "Blue Nike Backpack" or "iPhone 14 Pro"'
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                placeholder="Describe the item in detail – color, brand, any unique marks, what was inside it, etc."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label>Where did you lose it? *</label>
              <input
                type="text"
                name="location"
                placeholder='e.g. "Library Block B, 2nd Floor" or "Near College Canteen"'
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            {/* Date */}
            <div className="form-group">
              <label>When did you lose it? *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]} // can't be in future
                required
              />
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label>Upload an Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ padding: "6px 0" }}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={styles.imagePreview}
                />
              )}
              <small style={{ color: "#64748b" }}>
                A clear photo greatly improves your chances of recovery
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-danger"
              style={{ width: "100%", padding: "13px", fontSize: "16px" }}
              disabled={loading}
            >
              {loading ? "Submitting..." : "📋 Submit Lost Item Report"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
    paddingBottom: "20px",
    borderBottom: "2px solid #f1f5f9",
  },
  pageIcon: {
    fontSize: "48px",
    background: "#fee2e2",
    borderRadius: "12px",
    padding: "8px 12px",
  },
  pageTitle: {
    fontSize: "22px",
    fontFamily: "'Space Grotesk', sans-serif",
    marginBottom: "2px",
  },
  imagePreview: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "cover",
    borderRadius: "8px",
    marginTop: "10px",
    marginBottom: "6px",
    border: "1px solid #e2e8f0",
  },
};

export default ReportLost;