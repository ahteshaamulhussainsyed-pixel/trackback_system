// ─────────────────────────────────────────────
// routes/itemRoutes.js
// Handles: Submit/View/Edit Lost & Found Items + Matching
// Base URL: /api/items
// ─────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Item = require("../models/Item");
const { protect } = require("../middleware/authMiddleware");

// ── Multer Setup (for image uploads) ─────────
// Create uploads folder if it doesn't exist
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    // Create unique filename: timestamp + original extension
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  },
});
const upload = multer({ storage });

// ── Helper: Extract keywords from text ───────
// Simple keyword extractor for matching
const extractKeywords = (text) => {
  const stopWords = ["the", "a", "an", "is", "it", "in", "on", "at", "to", "and", "or", "of", "my", "was"];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .split(" ")
    .filter((word) => word.length > 2 && !stopWords.includes(word));
};

// ── Helper: Find matches for a given item ────
const findMatches = async (item) => {
  // Look for items of opposite type with shared keywords or location
  const oppositeType = item.type === "lost" ? "found" : "lost";
  const candidates = await Item.find({
    type: oppositeType,
    status: "pending",
    category: item.category,
  }).populate("reportedBy", "name email");

  // Score each candidate by how many keywords they share
  const scored = candidates.map((candidate) => {
    const sharedKeywords = item.keywords.filter((kw) =>
      candidate.keywords.includes(kw)
    );
    const locationMatch =
      candidate.location.toLowerCase().includes(item.location.toLowerCase()) ||
      item.location.toLowerCase().includes(candidate.location.toLowerCase());
    const score = sharedKeywords.length + (locationMatch ? 2 : 0);
    return { item: candidate, score };
  });

  // Return only items with score > 1 (at least some match)
  return scored
    .filter((s) => s.score > 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5) // top 5 matches
    .map((s) => s.item);
};

// ── POST /api/items/report ────────────────────
// Submit a lost OR found item report
router.post("/report", protect, upload.single("image"), async (req, res) => {
  try {
    const { type, title, description, category, location, date } = req.body;
    const keywords = extractKeywords(title + " " + description + " " + category);

    const item = await Item.create({
      type,
      reportedBy: req.user._id,
      title,
      description,
      category,
      location,
      date,
      keywords,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    // Try to find matches immediately after submission
    const matches = await findMatches(item);

    res.status(201).json({
      message: `${type === "lost" ? "Lost" : "Found"} item reported successfully!`,
      item,
      possibleMatches: matches,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ── GET /api/items/lost ───────────────────────
// Get all lost item reports (public)
router.get("/lost", async (req, res) => {
  try {
    const items = await Item.find({ type: "lost" })
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 }); // newest first
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/items/found ──────────────────────
// Get all found item reports (public)
router.get("/found", async (req, res) => {
  try {
    const items = await Item.find({ type: "found" })
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/items/mine ───────────────────────
// Get all reports submitted by the logged-in user
router.get("/mine", protect, async (req, res) => {
  try {
    const items = await Item.find({ reportedBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/items/matches/:id ────────────────
// Get potential matches for a specific item
router.get("/matches/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const matches = await findMatches(item);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/items/:id ────────────────────────
// Update a report (only by owner)
router.put("/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Only the person who submitted can edit it
    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this item" });
    }

    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Item updated!", item: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE /api/items/:id ─────────────────────
// Delete a report (only by owner)
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await item.deleteOne();
    res.json({ message: "Item report deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;