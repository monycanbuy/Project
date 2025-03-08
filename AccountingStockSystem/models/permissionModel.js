const mongoose = require("mongoose");

const permissionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true, // e.g., "read:users"
    },
    description: {
      type: String,
      default: "", // e.g., "Allows reading user data"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", permissionSchema);
