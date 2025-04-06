// const mongoose = require("mongoose");

// // const paymentSchema = new mongoose.Schema({
// //   amount: {
// //     type: Number,
// //     required: [true, "Payment amount is required"],
// //     min: [0, "Amount cannot be negative"],
// //   },
// //   method: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "PaymentMethod",
// //     required: [true, "Payment method is required"],
// //   },
// //   date: {
// //     type: Date,
// //     required: [true, "Payment date is required"],
// //     default: Date.now,
// //   },
// //   whtRate: {
// //     type: Number,
// //     enum: [0, 5, 10],
// //     default: 0,
// //   },
// //   whtAmount: {
// //     type: Number,
// //     default: 0,
// //     min: [0, "WHT amount cannot be negative"],
// //   },
// //   ledgerTransactionId: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "LedgerTransaction",
// //     required: [true, "Ledger transaction is required"],
// //   },
// // });
// const paymentSchema = new mongoose.Schema({
//   amount: {
//     type: Number,
//     required: [true, "Payment amount is required"],
//     min: [0, "Amount cannot be negative"],
//   },
//   method: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "PaymentMethod",
//     required: [true, "Payment method is required"],
//   },
//   date: {
//     type: Date,
//     required: [true, "Payment date is required"],
//     default: Date.now,
//   },
//   whtRate: { type: Number, enum: [0, 5, 10], default: 0 },
//   whtAmount: {
//     type: Number,
//     default: 0,
//     min: [0, "WHT amount cannot be negative"],
//   },
//   ledgerTransactionId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "LedgerTransaction",
//   }, // Optional
// });
// const initialPaymentSchema = new mongoose.Schema({
//   amount: {
//     type: Number,
//     required: [true, "Initial payment amount is required"],
//     min: [0, "Amount cannot be negative"],
//   },
//   method: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "PaymentMethod",
//     required: [true, "Payment method is required"],
//   },
//   date: {
//     type: Date,
//     required: [true, "Payment date is required"],
//     default: Date.now,
//   },
//   whtRate: {
//     type: Number,
//     enum: [0, 5, 10],
//     default: 0,
//   },
//   whtAmount: {
//     type: Number,
//     default: 0,
//     min: [0, "WHT amount cannot be negative"],
//   },
//   ledgerTransactionId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "LedgerTransaction",
//     //required: [true, "Ledger transaction is required"],
//   },
// });

// const invoiceSchema = new mongoose.Schema({
//   invoiceNumber: {
//     type: String,
//     required: [true, "Invoice number is required"],
//     //unique: true,
//     trim: true,
//   },
//   saleId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "AccountSale", // Updated to AccountSale from Sale
//   },
//   amount: {
//     type: Number,
//     required: [true, "Invoice amount is required"],
//     min: [0, "Amount cannot be negative"],
//   },
//   issuedDate: {
//     type: Date,
//     required: [true, "Issued date is required"],
//     default: Date.now,
//   },
//   dueDate: {
//     type: Date,
//     required: [true, "Due date is required"],
//   },
//   initialPayment: initialPaymentSchema,
//   payments: [paymentSchema],
//   cashRefund: {
//     type: Number,
//     default: 0,
//     min: [0, "Cash refund cannot be negative"],
//   },
//   badDebtWriteOff: {
//     type: Number,
//     default: 0,
//     min: [0, "Bad debt write-off cannot be negative"],
//   },
//   status: {
//     type: String,
//     enum: ["Pending", "Partially Paid", "Paid", "Overdue"],
//     default: "Pending",
//   },
// });

// const debtorSchema = new mongoose.Schema(
//   {
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Customer",
//       required: [true, "Customer is required"],
//       unique: true,
//     },
//     openingBalance: {
//       type: Number,
//       default: 0,
//       min: [0, "Opening balance cannot be negative"],
//     },
//     totalDebt: {
//       type: Number,
//       default: 0,
//       min: [0, "Total debt cannot be negative"],
//     },
//     totalCreditReceived: {
//       type: Number,
//       default: 0,
//       min: [0, "Total credit received cannot be negative"],
//     },
//     totalDeduction: {
//       type: Number,
//       default: 0,
//       min: [0, "Total deduction cannot be negative"],
//     },
//     closingBalance: {
//       type: Number,
//       default: 0,
//       min: [0, "Closing balance cannot be negative"],
//     },
//     invoices: [invoiceSchema],
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: [true, "Creator is required"],
//     },
//     status: {
//       type: String,
//       enum: ["active", "deleted"],
//       default: "active",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// debtorSchema.index(
//   { "invoices.invoiceNumber": 1 },
//   {
//     unique: true,
//     sparse: true,
//     partialFilterExpression: { "invoices.invoiceNumber": { $exists: true } },
//   }
// );

// module.exports = mongoose.model("Debtor", debtorSchema);

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, "Payment amount is required"],
    min: [0, "Amount cannot be negative"],
  },
  method: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentMethod",
    required: [true, "Payment method is required"],
  },
  date: {
    type: Date,
    required: [true, "Payment date is required"],
    default: Date.now,
  },
  whtRate: {
    type: Number,
    enum: [0, 5, 10],
    default: 0,
  },
  whtAmount: {
    type: Number,
    default: 0,
    min: [0, "WHT amount cannot be negative"],
  },
  ledgerTransactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LedgerTransaction", // Removed required: true
  },
});

const initialPaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, "Initial payment amount is required"],
    min: [0, "Amount cannot be negative"],
  },
  method: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentMethod",
    required: [true, "Payment method is required"],
  },
  date: {
    type: Date,
    required: [true, "Payment date is required"],
    default: Date.now,
  },
  whtRate: {
    type: Number,
    enum: [0, 5, 10],
    default: 0,
  },
  whtAmount: {
    type: Number,
    default: 0,
    min: [0, "WHT amount cannot be negative"],
  },
  ledgerTransactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LedgerTransaction", // Removed required: true
  },
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, "Invoice number is required"],
    trim: true,
  },
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AccountSale",
  },
  amount: {
    type: Number,
    required: [true, "Invoice amount is required"],
    min: [0, "Amount cannot be negative"],
  },
  issuedDate: {
    type: Date,
    required: [true, "Issued date is required"],
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"],
  },
  initialPayment: initialPaymentSchema,
  payments: [paymentSchema],
  cashRefund: {
    type: Number,
    default: 0,
    min: [0, "Cash refund cannot be negative"],
  },
  badDebtWriteOff: {
    type: Number,
    default: 0,
    min: [0, "Bad debt write-off cannot be negative"],
  },
  status: {
    type: String,
    enum: ["Pending", "Partially Paid", "Paid", "Overdue"],
    default: "Pending",
  },
});

const debtorSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
      unique: true,
    },
    openingBalance: {
      type: Number,
      default: 0,
      min: [0, "Opening balance cannot be negative"],
    },
    totalDebt: {
      type: Number,
      default: 0,
      min: [0, "Total debt cannot be negative"],
    },
    totalCreditReceived: {
      type: Number,
      default: 0,
      min: [0, "Total credit received cannot be negative"],
    },
    totalDeduction: {
      type: Number,
      default: 0,
      min: [0, "Total deduction cannot be negative"],
    },
    closingBalance: {
      type: Number,
      default: 0,
      min: [0, "Closing balance cannot be negative"],
    },
    invoices: [invoiceSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

debtorSchema.index(
  { "invoices.invoiceNumber": 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { "invoices.invoiceNumber": { $exists: true } },
  }
);

module.exports = mongoose.model("Debtor", debtorSchema);
