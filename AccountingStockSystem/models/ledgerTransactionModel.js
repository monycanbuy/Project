const mongoose = require("mongoose");

const ledgerEntrySchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "Account is required"],
  },
  debit: {
    type: Number,
    default: 0,
    min: [0, "Debit cannot be negative"],
  },
  credit: {
    type: Number,
    default: 0,
    min: [0, "Credit cannot be negative"],
  },
});

const ledgerTransactionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Transaction date is required"],
      default: Date.now,
      index: true, // Improve sorting/querying by date
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    // referenceType: {
    //   type: String,
    //   enum: ["AccountSale", "Debtor", "PettyCash", "Other"],
    //   required: [true, "Reference type is required"],
    // },
    // referenceId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: [true, "Reference ID is required"],
    //   refPath: "referenceType", // Dynamic referencing
    //   index: true, // Improve lookup performance
    // },
    referenceType: {
      type: String,
      enum: ["AccountSale", "Debtor", "PettyCash", "Other"],
      required: [true, "Reference type is required"],
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Reference ID is required"],
      refPath: "referenceType",
      index: true,
    },
    entries: {
      type: [ledgerEntrySchema],
      required: [true, "Entries are required"],
      validate: {
        validator: (entries) => entries.length >= 2,
        message:
          "At least two entries are required for double-entry bookkeeping",
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Posted", "Voided"],
      default: "Pending",
      description:
        "Transaction status: Pending (draft), Posted (recorded), Voided (cancelled)",
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [100, "Comment cannot exceed 100 characters"],
      default: "",
      description:
        "Optional short note or comment about the transaction entries",
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

// Ensure debit and credit balance
ledgerTransactionSchema.pre("save", function (next) {
  const totalDebit = this.entries.reduce(
    (sum, entry) => sum + (Number(entry.debit) || 0),
    0
  );
  const totalCredit = this.entries.reduce(
    (sum, entry) => sum + (Number(entry.credit) || 0),
    0
  );
  if (totalDebit !== totalCredit) {
    return next(new Error("Debits and credits must balance"));
  }
  next();
});

module.exports = mongoose.model("LedgerTransaction", ledgerTransactionSchema);
