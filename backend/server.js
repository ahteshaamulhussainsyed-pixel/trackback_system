// ─────────────────────────────────────────────
// server.js  –  TRACKBACK Main Server File
// This is the starting point of the backend.
// Run it with:  node server.js
// ─────────────────────────────────────────────

// 1. Load environment variables from .env file
require("dotenv").config();

// 2. Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// 3. Import our route files
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const adminRoutes = require("./routes/adminRoutes");

// 4. Create the Express app
const app = express();

// 5. Middleware – these run before every request
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Parse JSON request bodies
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// 6. Connect to MongoDB database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// 7. Register API routes
// All auth routes start with /api/auth  (e.g. /api/auth/login)
app.use("/api/auth", authRoutes);
// All item routes start with /api/items (e.g. /api/items/lost)
app.use("/api/items", itemRoutes);
// All admin routes start with /api/admin (e.g. /api/admin/users)
app.use("/api/admin", adminRoutes);

// 8. Simple test route – visit http://localhost:5000 to check if server is running
app.get("/", (req, res) => {
  res.json({ message: "🎒 TRACKBACK API is running!" });
});

// 9. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});