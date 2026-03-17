// ─────────────────────────────────────────────
// components/Footer.jsx  –  Footer Bar
// ─────────────────────────────────────────────

import React from "react";

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>
          🎒 <strong>TRACKBACK</strong> – Lost & Found Item Tracker
        </p>
        <p style={styles.sub}>
          Helping people reconnect with their belongings · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#1e293b",
    color: "#94a3b8",
    padding: "30px 20px",
    marginTop: "60px",
    textAlign: "center",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  text: {
    color: "white",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "16px",
    marginBottom: "6px",
  },
  sub: {
    fontSize: "13px",
    color: "#64748b",
  },
};

export default Footer;