// ─────────────────────────────────────────────
// pages/Home.jsx  –  Landing / Home Page
// First page users see when visiting the site
// ─────────────────────────────────────────────

import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const user = JSON.parse(localStorage.getItem("trackback_user") || "null");

  return (
    <div>
      {/* ── Hero Section ── */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🎒 Smart Lost & Found System</div>
          <h1 style={styles.heroTitle}>
            Lost Something?
            <br />
            <span style={{ color: "#f59e0b" }}>We'll Help You Find It.</span>
          </h1>
          <p style={styles.heroDesc}>
            TRACKBACK is a smart platform that connects people who have lost
            items with those who have found them — using intelligent matching
            and instant notifications.
          </p>
          <div style={styles.heroButtons}>
            {user ? (
              <>
                <Link to="/report-lost" style={styles.btnPrimary}>
                  📋 Report Lost Item
                </Link>
                <Link to="/report-found" style={styles.btnAccent}>
                  📦 Report Found Item
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" style={styles.btnPrimary}>
                  Get Started – It's Free
                </Link>
                <Link to="/lost-items" style={styles.btnOutline}>
                  Browse Lost Items
                </Link>
              </>
            )}
          </div>
        </div>
        <div style={styles.heroImage}>🔍</div>
      </section>

      {/* ── Stats Row ── */}
      <section style={styles.statsRow}>
        {[
          { icon: "📋", label: "Items Reported", value: "500+" },
          { icon: "🔗", label: "Matches Found", value: "200+" },
          { icon: "✅", label: "Items Recovered", value: "150+" },
          { icon: "👥", label: "Happy Users", value: "300+" },
        ].map((stat, i) => (
          <div key={i} style={styles.statCard}>
            <span style={styles.statIcon}>{stat.icon}</span>
            <span style={styles.statValue}>{stat.value}</span>
            <span style={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* ── How It Works ── */}
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>How TRACKBACK Works</h2>
          <p style={styles.sectionSub}>Three simple steps to recover your belongings</p>

          <div style={styles.stepsGrid}>
            {[
              {
                step: "1",
                icon: "📝",
                title: "Submit a Report",
                desc: "Fill in details about your lost or found item — description, location, date, and a photo.",
              },
              {
                step: "2",
                icon: "🤖",
                title: "Smart Matching",
                desc: "Our system automatically compares reports and finds potential matches using keywords and location.",
              },
              {
                step: "3",
                icon: "🔔",
                title: "Get Notified",
                desc: "You'll receive instant notifications when a match is found. Confirm and recover your item!",
              },
            ].map((step, i) => (
              <div key={i} style={styles.stepCard}>
                <div style={styles.stepNum}>{step.step}</div>
                <div style={styles.stepIcon}>{step.icon}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ ...styles.section, background: "#f8fafc" }}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Item Categories</h2>
          <div style={styles.categoriesGrid}>
            {[
              { icon: "💻", name: "Electronics" },
              { icon: "👜", name: "Bags" },
              { icon: "👗", name: "Clothing" },
              { icon: "📄", name: "Documents" },
              { icon: "💍", name: "Jewellery" },
              { icon: "🔑", name: "Keys" },
              { icon: "👛", name: "Wallet" },
              { icon: "📦", name: "Other" },
            ].map((cat, i) => (
              <Link to="/lost-items" key={i} style={styles.catCard}>
                <span style={styles.catIcon}>{cat.icon}</span>
                <span style={styles.catName}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call to Action ── */}
      {!user && (
        <section style={styles.cta}>
          <h2 style={styles.ctaTitle}>Ready to Find What You Lost?</h2>
          <p style={styles.ctaDesc}>
            Join TRACKBACK today. It's completely free.
          </p>
          <Link to="/register" style={styles.ctaBtn}>
            Create Free Account →
          </Link>
        </section>
      )}
    </div>
  );
}

const styles = {
  // Hero
  hero: {
    background: "linear-gradient(135deg, #1e293b 0%, #2563eb 100%)",
    color: "white",
    padding: "80px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "40px",
  },
  heroContent: { flex: 1, minWidth: "280px", maxWidth: "600px" },
  heroBadge: {
    display: "inline-block",
    background: "rgba(245,158,11,0.2)",
    color: "#fcd34d",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "20px",
    border: "1px solid rgba(245,158,11,0.3)",
  },
  heroTitle: {
    fontSize: "clamp(32px, 5vw, 52px)",
    fontFamily: "'Space Grotesk', sans-serif",
    lineHeight: 1.2,
    marginBottom: "20px",
  },
  heroDesc: {
    fontSize: "17px",
    color: "#cbd5e1",
    lineHeight: 1.7,
    marginBottom: "32px",
  },
  heroButtons: { display: "flex", gap: "16px", flexWrap: "wrap" },
  heroImage: {
    fontSize: "120px",
    opacity: 0.3,
    flex: "0 0 auto",
  },
  btnPrimary: {
    background: "#f59e0b",
    color: "white",
    padding: "13px 28px",
    borderRadius: "10px",
    textDecoration: "none",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "16px",
  },
  btnAccent: {
    background: "#22c55e",
    color: "white",
    padding: "13px 28px",
    borderRadius: "10px",
    textDecoration: "none",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "16px",
  },
  btnOutline: {
    background: "transparent",
    border: "2px solid rgba(255,255,255,0.4)",
    color: "white",
    padding: "13px 28px",
    borderRadius: "10px",
    textDecoration: "none",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: "16px",
  },

  // Stats
  statsRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "20px",
    padding: "40px 20px",
    background: "white",
    borderBottom: "1px solid #e2e8f0",
  },
  statCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    padding: "20px 32px",
  },
  statIcon: { fontSize: "28px" },
  statValue: {
    fontSize: "32px",
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
    color: "#2563eb",
  },
  statLabel: { color: "#64748b", fontSize: "14px" },

  // Sections
  section: { padding: "60px 20px" },
  container: { maxWidth: "1100px", margin: "0 auto" },
  sectionTitle: {
    textAlign: "center",
    fontSize: "30px",
    marginBottom: "8px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  sectionSub: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: "40px",
    fontSize: "16px",
  },

  // Steps
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },
  stepCard: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "30px 24px",
    textAlign: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  stepNum: {
    width: "36px",
    height: "36px",
    background: "#2563eb",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    margin: "0 auto 12px",
    fontSize: "16px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  stepIcon: { fontSize: "36px", marginBottom: "12px" },
  stepTitle: {
    fontSize: "18px",
    fontFamily: "'Space Grotesk', sans-serif",
    marginBottom: "10px",
  },
  stepDesc: { color: "#64748b", fontSize: "14px", lineHeight: 1.6 },

  // Categories
  categoriesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "16px",
  },
  catCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "20px 12px",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    textDecoration: "none",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  catIcon: { fontSize: "32px" },
  catName: { fontSize: "13px", color: "#475569", fontWeight: 500 },

  // CTA
  cta: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "white",
    padding: "70px 20px",
    textAlign: "center",
  },
  ctaTitle: {
    fontSize: "32px",
    fontFamily: "'Space Grotesk', sans-serif",
    marginBottom: "12px",
  },
  ctaDesc: { color: "#bfdbfe", marginBottom: "30px", fontSize: "17px" },
  ctaBtn: {
    background: "#f59e0b",
    color: "white",
    padding: "14px 32px",
    borderRadius: "10px",
    textDecoration: "none",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "17px",
  },
};

export default Home;