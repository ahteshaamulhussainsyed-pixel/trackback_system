// ─────────────────────────────────────────────
// App.jsx  –  Main App with Page Routing
// This connects all pages together
// ─────────────────────────────────────────────

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import global styles
import "./styles/global.css";

// Import layout components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Import all pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import AdminDashboard from "./pages/AdminDashboard";

// ── Protected Route Helper ────────────────────
// Wraps pages that require login
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("trackback_token");
  if (!token) {
    // If not logged in, send to login page
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ── Main App Component ────────────────────────
function App() {
  return (
    <BrowserRouter>
      {/* Navbar appears on all pages */}
      <Navbar />

      {/* Page routes */}
      <Routes>
        {/* Public pages (anyone can visit) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lost-items" element={<LostItems />} />
        <Route path="/found-items" element={<FoundItems />} />

        {/* Protected pages (must be logged in) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-lost"
          element={
            <ProtectedRoute>
              <ReportLost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-found"
          element={
            <ProtectedRoute>
              <ReportFound />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: redirect unknown URLs to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Footer appears on all pages */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;