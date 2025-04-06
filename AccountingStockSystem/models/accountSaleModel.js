const mongoose = require("mongoose");

const accountSaleSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
      index: true, // Improve query performance
    },
    amount: {
      type: Number,
      required: [true, "Sale amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    isCreditSale: {
      type: Boolean,
      default: false,
      description:
        "Indicates if the sale is on credit, potentially creating a debtor invoice",
    },
    ledgerTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LedgerTransaction",
      required: false,
      //required: [true, "Ledger transaction is required"],
      index: true,
    },
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true, // Ensure uniqueness across sales
      trim: true,
      description: "Links to Debtor.invoices for credit sales",
    },
    date: {
      type: Date,
      required: [true, "Sale date is required"],
      default: Date.now,
      description: "Date the sale occurred",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
      description: "Tracks sale lifecycle",
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

module.exports = mongoose.model("AccountSale", accountSaleSchema);
