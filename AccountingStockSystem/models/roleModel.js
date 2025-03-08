const { required } = require("joi");
const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required!"],
      trim: true,
      unique: [true, "Role name must be unique"],
      minLength: [4, "Email must have minimum of 4 characters!"],
      lowercase: true,
    },
    permissions: [
      {
        type: String, // e.g., "read:auditLogs", "write:purchaseOrders"
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Role", roleSchema);
