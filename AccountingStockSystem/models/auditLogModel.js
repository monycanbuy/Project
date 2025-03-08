// const mongoose = require("mongoose");

// const AuditLogSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // Assuming there's a User model
//     required: true,
//   },
//   action: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
//   // Additional fields as needed, e.g., for the resource affected:
//   resourceId: {
//     type: mongoose.Schema.Types.ObjectId,
//     refPath: "resourceType",
//   },
//   resourceType: {
//     type: String,
//     enum: ["Inventory", "Sale", "User", "Location"], // Or any other relevant types
//   },
// });

// module.exports = mongoose.model("AuditLog", AuditLogSchema);

const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  action: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "resourceType",
  },
  resourceType: {
    type: String,
    enum: ["Inventory", "Sale", "User", "Location", "PurchaseOrder"], // Added PurchaseOrder
  },
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);
