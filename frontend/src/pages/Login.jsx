// ─────────────────────────────────────────────
// pages/Login.jsx  –  Login Page
// ─────────────────────────────────────────────

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form field as user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send login request to backend
      const res = await axios.post("/api/auth/login", form);

      // Save token and user info to localStorage
      localStorage.setItem("trackback_token", res.data.token);
      localStorage.setItem("trackback_user", JSON.stringify(res.data.user));

      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🎒 TRACKBACK</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {/* Error message */}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register">Create one free</Link>
        </p>

        {/* Quick demo hint */}
        <div style={styles.hint}>
          <strong>Demo Admin:</strong> admin@trackback.com / admin123
          <br />
          <small>(Run /api/admin/seed once to create the admin account)</small>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
    padding: "20px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 40px rgba(37,99,235,0.12)",
  },
  header: { textAlign: "center", marginBottom: "28px" },
  title: {
    fontSize: "28px",
    fontFamily: "'Space Grotesk', sans-serif",
    color: "#1e293b",
    marginBottom: "6px",
  },
  subtitle: { color: "#64748b", fontSize: "15px" },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#64748b",
  },
  hint: {
    marginTop: "20px",
    padding: "12px",
    background: "#f0f9ff",
    borderRadius: "8px",
    fontSize: "12px",
    color: "#0369a1",
    textAlign: "center",
    lineHeight: 1.6,
  },
};

export default Login;