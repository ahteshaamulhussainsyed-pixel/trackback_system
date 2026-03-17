// ─────────────────────────────────────────────
// middleware/authMiddleware.js
// Protects routes – only logged-in users can access them
// ─────────────────────────────────────────────

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── protect ──────────────────────────────────
// Use this on any route that requires login.
// It checks the Authorization header for a JWT token.
const protect = async (req, res, next) => {
  let token;

  // Token is sent as:  Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract the token part (after "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token is valid and not expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to the request object (without password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Continue to the actual route handler
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// ── adminOnly ─────────────────────────────────
// Use this on admin-only routes.
// Must be used AFTER the protect middleware.
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // User is admin, allow access
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

module.exports = { protect, adminOnly };