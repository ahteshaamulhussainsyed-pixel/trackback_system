// ─────────────────────────────────────────────
// routes/authRoutes.js
// Handles: Register, Login, Get Profile
// Base URL: /api/auth
// ─────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// Helper: Create a JWT token for a user
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // token expires in 7 days
  );
};

// ── POST /api/auth/register ───────────────────
// Create a new user account
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create the new user (password gets hashed automatically by the model)
    const user = await User.create({ name, email, password, phone });

    // Return user info + token
    res.status(201).json({
      message: "Account created successfully!",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ── POST /api/auth/login ──────────────────────
// Log in with email + password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Return user info + token
    res.json({
      message: "Login successful!",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ── GET /api/auth/profile ─────────────────────
// Get the currently logged-in user's profile
// Requires: Authorization header with Bearer token
router.get("/profile", protect, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
  });
});

module.exports = router;