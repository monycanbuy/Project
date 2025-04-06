const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    accountCode: {
      type: String,
      required: [true, "Account code is required"],
      unique: true,
      trim: true,
      match: [
        /^[A-Za-z0-9-]+$/,
        "Account code must be alphanumeric with dashes",
      ],
      index: true, // Added for query performance
    },
    name: {
      type: String,
      required: [true, "Account name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    type: {
      type: String,
      enum: ["Asset", "Liability", "Equity", "Revenue", "Expense"],
      required: [true, "Account type is required"],
      index: true, // Added for filtering by type
    },
    subType: {
      type: String,
      trim: true,
      maxlength: [50, "Sub-type cannot exceed 50 characters"],
      description:
        "Optional sub-category (e.g., Current Asset, Operating Expense)",
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      description: "Account status for enabling/disabling",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", accountSchema);
