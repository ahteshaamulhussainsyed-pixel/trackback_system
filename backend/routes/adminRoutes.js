// ─────────────────────────────────────────────
// routes/adminRoutes.js
// Admin-only routes for managing the platform
// Base URL: /api/admin
// ─────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Item = require("../models/Item");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// All routes in this file require:
// 1. protect  → must be logged in
// 2. adminOnly → must be an admin

// ── GET /api/admin/stats ──────────────────────
// Dashboard overview numbers
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalLost = await Item.countDocuments({ type: "lost" });
    const totalFound = await Item.countDocuments({ type: "found" });
    const totalMatched = await Item.countDocuments({ status: "matched" });
    const totalRecovered = await Item.countDocuments({ status: "recovered" });

    res.json({ totalUsers, totalLost, totalFound, totalMatched, totalRecovered });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/admin/users ──────────────────────
// List all users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE /api/admin/users/:id ───────────────
// Remove a user account
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Also delete their item reports
    await Item.deleteMany({ reportedBy: req.params.id });
    res.json({ message: "User and their reports deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/admin/items ──────────────────────
// List all items (lost + found)
router.get("/items", protect, adminOnly, async (req, res) => {
  try {
    const items = await Item.find()
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/admin/items/:id/status ──────────
// Update item status (e.g. mark as recovered)
router.put("/items/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: `Item marked as ${status}`, item });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE /api/admin/items/:id ───────────────
// Remove an item report
router.delete("/items/:id", protect, adminOnly, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item report deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/admin/seed ──────────────────────
// Create the default admin account (run once!)
router.post("/seed", async (req, res) => {
  try {
    const existing = await User.findOne({ email: "admin@trackback.com" });
    if (existing) {
      return res.json({ message: "Admin already exists" });
    }
    await User.create({
      name: "Admin",
      email: "admin@trackback.com",
      password: "admin123",
      role: "admin",
    });
    res.json({ message: "✅ Admin created: admin@trackback.com / admin123" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;