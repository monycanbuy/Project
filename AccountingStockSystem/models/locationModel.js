const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Kitchen", "Storeroom A", "Shelf 3"
    type: {
      type: String,
      enum: ["Kitchen", "Storeroom", "Shelf", "Other"],
      required: true,
    },
    capacity: { type: Number }, // Optional, could represent shelf space, fridge space, etc.
    // Add other fields relevant to your inventory management, like security level, temperature, etc.
  },
  { timestamps: true }
);

const Location =
  mongoose.models.Location || mongoose.model("Location", locationSchema); // Check if already compiled!
module.exports = Location;
