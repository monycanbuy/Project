const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true, // Ensures no duplicate emails
      lowercase: true, // Normalizes to lowercase
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      index: true, // Improves query performance for signin
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Excluded from queries by default for security
    },
    phoneNumber: {
      type: String,
      unique: true, // Ensures no duplicate phone numbers
      trim: true,
      match: [/^[0-9]{10,15}$/, "Please provide a valid phone number"], // E.164 format
      index: true, // Improves query performance for signin
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true, // Every user must have at least one role
      },
    ],
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"], // More granular than isActive boolean
      default: "active",
      index: true, // Improves queries for filtering by status
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
      index: true, // Improves queries for locked account checks
    },
    loginAttempts: {
      type: Number,
      default: 0,
      min: [0, "Login attempts cannot be negative"],
    },
    verificationCode: {
      type: String,
      select: false, // Hidden by default
    },
    verificationCodeValidation: {
      type: Date,
      select: false,
    },
    forgotPasswordCode: {
      type: String,
      select: false,
    },
    forgotPasswordCodeValidation: {
      type: Date,
      select: false,
    },
    profileImage: {
      type: String,
      default: null, // URL or path to image
    },
    lastLogin: {
      type: Date, // Tracks the most recent successful login
      default: null,
      index: true, // Improves queries for login activity
    },
    loginHistory: [
      {
        timestamp: {
          type: Date,
          required: true,
          default: Date.now,
        },
        ip: {
          type: String, // Tracks IP address of login
          required: true,
        },
        device: {
          type: String, // e.g., "Chrome on Windows"
          default: "Unknown",
        },
      },
    ],
    workMetrics: {
      tasksCompleted: {
        type: Number,
        default: 0,
        min: [0, "Tasks completed cannot be negative"],
      },
      salesGenerated: {
        type: Number,
        default: 0,
        min: [0, "Sales generated cannot be negative"],
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        expiry: {
          type: Date,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password; // Remove password from JSON output
        delete ret.verificationCode;
        delete ret.verificationCodeValidation;
        delete ret.forgotPasswordCode;
        delete ret.forgotPasswordCodeValidation;
        return ret;
      },
    },
  }
);

// Custom validation: At least one of email or phoneNumber must be provided
userSchema.pre("validate", function (next) {
  if (!this.email && !this.phoneNumber) {
    this.invalidate("email", "Either email or phone number is required");
    this.invalidate("phoneNumber", "Either email or phone number is required");
  }
  next();
});

// Pre-save hook to ensure at least one role exists
userSchema.pre("save", async function (next) {
  if (this.isNew && (!this.roles || this.roles.length === 0)) {
    const defaultRole = await mongoose.model("Role").findOne({ name: "user" });
    if (defaultRole) {
      this.roles = [{ _id: defaultRole._id, name: defaultRole.name }];
    }
  }
  next();
});

// Index for efficient querying by login activity
userSchema.index({ "loginHistory.timestamp": 1 });

// Method to calculate work ratio
userSchema.methods.getWorkRatio = function () {
  return this.workMetrics.tasksCompleted > 0
    ? this.workMetrics.salesGenerated / this.workMetrics.tasksCompleted
    : 0;
};

module.exports = mongoose.model("User", userSchema);
