// ─────────────────────────────────────────────
// components/Navbar.jsx  –  Top Navigation Bar
// Shows on every page
// ─────────────────────────────────────────────

import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Get user info from localStorage (saved at login)
  const user = JSON.parse(localStorage.getItem("trackback_user") || "null");

  const handleLogout = () => {
    // Clear saved login data
    localStorage.removeItem("trackback_token");
    localStorage.removeItem("trackback_user");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          🎒 TRACKBACK
        </Link>

        {/* Navigation Links */}
        <div style={styles.links}>
          <Link to="/lost-items" style={styles.link}>Lost Items</Link>
          <Link to="/found-items" style={styles.link}>Found Items</Link>

          {user ? (
            <>
              <Link to="/dashboard" style={styles.link}>My Reports</Link>
              {user.role === "admin" && (
                <Link to="/admin" style={{ ...styles.link, color: "#f59e0b" }}>
                  ⚙ Admin
                </Link>
              )}
              <span style={styles.userName}>Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// Inline styles for the navbar
const styles = {
  nav: {
    background: "#1e293b",
    padding: "14px 0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "10px",
  },
  logo: {
    color: "white",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "22px",
    textDecoration: "none",
    letterSpacing: "1px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "15px",
    fontFamily: "'Inter', sans-serif",
    transition: "color 0.2s",
  },
  userName: {
    color: "#94a3b8",
    fontSize: "14px",
  },
  logoutBtn: {
    background: "transparent",
    border: "1.5px solid #ef4444",
    color: "#ef4444",
    padding: "6px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
  },
  registerBtn: {
    background: "#2563eb",
    color: "white",
    padding: "7px 18px",
    borderRadius: "7px",
    textDecoration: "none",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: "14px",
  },
};

export default Navbar;