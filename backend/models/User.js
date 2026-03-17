// ─────────────────────────────────────────────
// models/User.js  –  User Database Schema
// Defines what a "User" looks like in MongoDB
// ─────────────────────────────────────────────

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the shape of a User document in the database
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // name is mandatory
      trim: true,     // removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,   // no two users can have same email
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"], // only these two values allowed
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Before saving, automatically hash the password
userSchema.pre("save", async function (next) {
  // Only hash if password was changed
  if (!this.isModified("password")) return next();
  // bcrypt converts plain text password → secure hash
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if a given password matches the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model so other files can use it
module.exports = mongoose.model("User", userSchema);