const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Updated expenseBreakdownSchema
const expenseBreakdownSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: "ExpenseCategory",
    required: false,
    //required: [true, "Expense category is required"],
  },
  amount: {
    type: Number,
    required: [true, "Expense breakdown amount is required"],
    min: [0, "Amount cannot be negative"],
  },
});

// Updated pettyCashTransactionSchema
const pettyCashTransactionSchema = new Schema({
  date: {
    type: Date,
    required: [true, "Transaction date is required"],
    default: Date.now,
  },
  details: {
    type: String,
    required: [true, "Details are required"],
    trim: true,
    maxlength: [200, "Details cannot exceed 200 characters"],
  },
  voucherNo: {
    type: String,
    // required: [true, "Voucher number is required"], // Commented out per your change
    trim: true,
    default: null,
  },
  checkNo: {
    type: String,
    trim: true,
    default: null, // Explicitly optional
  },
  totalPayment: {
    type: Number,
    required: [true, "Total payment is required"],
    min: [0, "Total payment cannot be negative"],
  },
  expenseBreakdowns: [expenseBreakdownSchema],
  ledgerTransactionId: {
    type: Schema.Types.ObjectId,
    ref: "LedgerTransaction",
    required: [true, "Ledger transaction is required"],
  },
  ledgerTransactionDescription: {
    type: String,
    trim: true,
    maxlength: [
      500,
      "Ledger transaction description cannot exceed 500 characters",
    ],
  },
});

// Validator for totalPayment consistency
pettyCashTransactionSchema.pre("validate", function (next) {
  const total = this.expenseBreakdowns.reduce((sum, b) => sum + b.amount, 0);
  if (total !== this.totalPayment) {
    next(new Error("Total payment must equal the sum of expense breakdowns"));
  } else {
    next();
  }
});

// Updated pettyCashSchema
const pettyCashSchema = new Schema(
  {
    balance: {
      type: Number,
      required: [true, "Balance is required"],
      min: [0, "Balance cannot be negative"],
    },
    replenishments: [
      {
        amount: {
          type: Number,
          required: [true, "Replenishment amount is required"],
          min: [0, "Amount cannot be negative"],
        },
        date: {
          type: Date,
          default: Date.now,
        },
        by: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: [true, "Replenisher is required"],
        },
      },
    ],
    transactions: [pettyCashTransactionSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Virtuals
pettyCashSchema.virtual("totalReceived").get(function () {
  return this.replenishments.reduce((sum, r) => sum + r.amount, 0);
});

pettyCashSchema.virtual("calculatedBalance").get(function () {
  const totalPayments = this.transactions.reduce(
    (sum, t) => sum + t.totalPayment,
    0
  );
  return this.totalReceived - totalPayments;
});

pettyCashSchema.set("toJSON", { virtuals: true });
pettyCashSchema.set("toObject", { virtuals: true });

// Index (unchanged)
pettyCashSchema.index({ "transactions.voucherNo": 1 }, { unique: true });

module.exports = mongoose.model("PettyCash", pettyCashSchema);
