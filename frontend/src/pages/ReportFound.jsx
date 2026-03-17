// ─────────────────────────────────────────────
// pages/ReportFound.jsx  –  Report a Found Item
// ─────────────────────────────────────────────

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CATEGORIES = [
  "Electronics", "Clothing", "Bags", "Documents",
  "Jewellery", "Keys", "Wallet", "Other",
];

function ReportFound() {
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
      const formData = new FormData();
      formData.append("type", "found");
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

  if (submitted) {
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: "600px" }}>
          <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", marginBottom: "8px" }}>
              Thank You for Helping!
            </h2>
            <p style={{ color: "#64748b", marginBottom: "24px" }}>
              Your found item report has been submitted. If someone is looking for it, we'll connect you both.
            </p>

            {matches.length > 0 && (
              <div className="alert alert-success" style={{ textAlign: "left" }}>
                🎯 <strong>We found {matches.length} possible owner(s)!</strong>
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
              <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
                My Reports
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
          <div style={styles.pageHeader}>
            <span style={styles.pageIcon}>📦</span>
            <div>
              <h1 style={styles.pageTitle}>Report a Found Item</h1>
              <p style={{ color: "#64748b", fontSize: "14px" }}>
                Help someone find their lost belonging
              </p>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Item Name / Title *</label>
              <input
                type="text"
                name="title"
                placeholder='e.g. "Black Wallet" or "Student ID Card"'
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                placeholder="Describe the item in detail – color, brand, contents if visible, any identifying features"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Where did you find it? *</label>
              <input
                type="text"
                name="location"
                placeholder='e.g. "Parking Lot C" or "Cafeteria Table 5"'
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>When did you find it? *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

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
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "13px", fontSize: "16px", background: "#22c55e" }}
              disabled={loading}
            >
              {loading ? "Submitting..." : "📦 Submit Found Item Report"}
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
    background: "#d1fae5",
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
    border: "1px solid #e2e8f0",
  },
};

export default ReportFound;