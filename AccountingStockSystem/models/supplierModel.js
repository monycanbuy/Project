const mongoose = require("mongoose");
//const Schema = mongoose.Schema;

const supplierSchema = new mongoose.Schema(
  {
    address: { type: String },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String }, // Optional but useful for communication
    contactPerson: { type: String, required: true }, // Required field
    staffInvolved: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplier", supplierSchema);
