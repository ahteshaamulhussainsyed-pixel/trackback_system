// ─────────────────────────────────────────────
// models/Item.js  –  Item Database Schema
// Defines what a "Lost" or "Found" item looks like
// ─────────────────────────────────────────────

const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    // Is this a LOST item or a FOUND item?
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },

    // Who submitted this report
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId, // references User._id
      ref: "User",
      required: true,
    },

    // Basic item details
    title: {
      type: String,
      required: true,  // e.g. "Blue Backpack"
      trim: true,
    },
    description: {
      type: String,
      required: true,  // e.g. "Has a red keychain, contains books"
    },
    category: {
      type: String,
      enum: ["Electronics", "Clothing", "Bags", "Documents", "Jewellery", "Keys", "Wallet", "Other"],
      default: "Other",
    },

    // Where and when
    location: {
      type: String,
      required: true,  // e.g. "Library, 2nd Floor"
    },
    date: {
      type: Date,
      required: true,
    },

    // Optional image upload
    image: {
      type: String,   // stores the file path, e.g. "/uploads/abc123.jpg"
      default: "",
    },

    // Current status of this report
    status: {
      type: String,
      enum: ["pending", "matched", "recovered", "closed"],
      default: "pending",
    },

    // If matched, store the ID of the matched item
    matchedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      default: null,
    },

    // Keywords extracted for matching (auto-generated)
    keywords: {
      type: [String],
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model("Item", itemSchema);