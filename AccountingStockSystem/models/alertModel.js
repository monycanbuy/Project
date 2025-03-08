const mongoose = require("mongoose");
const { EventEmitter } = require("events"); // Import EventEmitter

const AlertSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["lowStock", "nearExpiry", "other"],
  },
  message: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Changed to false to allow null
    default: null,
  },
  read: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "archived"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

AlertSchema.index({ user: 1, read: 1, createdAt: -1 });

AlertSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = new Date();
  next();
});

// Add the event emitter to your Model
Object.assign(AlertSchema.statics, EventEmitter.prototype);

module.exports = mongoose.model("Alert", AlertSchema);
