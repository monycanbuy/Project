const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true, // Ensures no duplicate category names
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    code: {
      type: String,
      required: [true, "Category code is required"],
      trim: true,
      unique: true, // Ensures no duplicate codes
      maxlength: [50, "Category code cannot exceed 50 characters"],
      lowercase: true, // Standardizes codes (e.g., "fuel" not "Fuel")
    },
    active: {
      type: Boolean,
      default: true, // Allows soft deletion of categories
    },
  },
  { timestamps: true }
);

// Example data: { name: "Gasoline", code: "fuel", active: true }
// Fallback: { name: "Miscellaneous", code: "misc", active: true }

module.exports = mongoose.model("ExpenseCategory", expenseCategorySchema);
