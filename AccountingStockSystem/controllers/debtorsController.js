const mongoose = require("mongoose");
const Debtor = require("../models/debtorModel"); // Adjust path to your Debtor model
const PaymentMethod = require("../models/PaymentMethodModel");
const LedgerTransaction = require("../models/ledgerTransactionModel");
const Account = require("../models/accountModel");
const {
  createDebtorSchema,
  updateDebtorSchema,
  invoiceSchema,
  paymentSchema,
  initialPaymentSchema,
} = require("../middlewares/validator"); // Adjust path

// GET /api/debtors: List all debtors (excluding soft-deleted ones)
exports.getDebtors = async (req, res) => {
  try {
    const debtors = await Debtor.find({ status: { $ne: "deleted" } })
      .populate("customer", "name email phoneNumber")
      .populate("createdBy", "fullName email")
      .populate("invoices.initialPayment.method", "name") // Add this
      .populate("invoices.payments.method", "name");

    res.status(200).json({
      success: true,
      data: debtors,
    });
  } catch (error) {
    console.error("Error fetching debtors:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching debtors",
      error: error.message,
    });
  }
};

// POST /api/debtors: Create a debtor
exports.createDebtor = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "No authenticated user found",
      });
    }

    const { error, value } = createDebtorSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const debtorData = {
      ...value,
      createdBy: req.user.userId,
    };

    const existingDebtor = await Debtor.findOne({
      customer: debtorData.customer,
    });
    if (existingDebtor) {
      return res.status(409).json({
        success: false,
        message: "Debtor already exists for this customer",
      });
    }

    const newDebtor = await Debtor.create(debtorData);
    const populatedDebtor = await Debtor.findById(newDebtor._id)
      .populate("customer", "name email phoneNumber")
      .populate("createdBy", "fullName email");

    res.status(201).json({
      success: true,
      message: "Debtor created successfully",
      data: populatedDebtor,
    });
  } catch (error) {
    console.error("Error creating debtor:", error);
    res.status(500).json({
      success: false,
      message: "Error creating debtor",
      error: error.message,
    });
  }
};

// PUT /api/debtors/:id: Update debtor or nested invoices/payments
exports.updateDebtor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Debtor ID",
      });
    }

    const { error, value } = updateDebtorSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const debtor = await Debtor.findById(id);
    if (!debtor) {
      return res.status(404).json({
        success: false,
        message: "Debtor not found",
      });
    }

    if (debtor.status === "deleted") {
      return res.status(400).json({
        success: false,
        message: "Cannot update a deleted debtor",
      });
    }

    // Check for customer uniqueness if updating customer field
    if (value.customer && value.customer !== debtor.customer.toString()) {
      const existingDebtor = await Debtor.findOne({ customer: value.customer });
      if (existingDebtor) {
        return res.status(409).json({
          success: false,
          message: "Another debtor already exists for this customer",
        });
      }
    }

    const updatedDebtor = await Debtor.findByIdAndUpdate(
      id,
      { $set: value },
      { new: true, runValidators: true }
    )
      .populate("customer", "name email phoneNumber")
      .populate("createdBy", "fullName email");

    res.status(200).json({
      success: true,
      message: "Debtor updated successfully",
      data: updatedDebtor,
    });
  } catch (error) {
    console.error("Error updating debtor:", error);
    res.status(500).json({
      success: false,
      message: "Error updating debtor",
      error: error.message,
    });
  }
};

// DELETE /api/debtors/:id: Soft delete debtor
exports.deleteDebtor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Debtor ID",
      });
    }

    const debtor = await Debtor.findById(id);
    if (!debtor) {
      return res.status(404).json({
        success: false,
        message: "Debtor not found",
      });
    }

    if (debtor.status === "deleted") {
      return res.status(400).json({
        success: false,
        message: "Debtor already deleted",
      });
    }

    const updatedDebtor = await Debtor.findByIdAndUpdate(
      id,
      { $set: { status: "deleted" } }, // Soft delete by setting status
      { new: true }
    )
      .populate("customer", "name email phoneNumber")
      .populate("createdBy", "fullName email");

    res.status(200).json({
      success: true,
      message: "Debtor deleted successfully",
      data: updatedDebtor,
    });
  } catch (error) {
    console.error("Error deleting debtor:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting debtor",
      error: error.message,
    });
  }
};

// Optional: POST /api/debtors/:id/invoices: Add an invoice to a debtor
exports.addInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Debtor ID",
      });
    }

    const { error, value } = invoiceSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const debtor = await Debtor.findById(id);
    if (!debtor) {
      return res.status(404).json({
        success: false,
        message: "Debtor not found",
      });
    }

    if (debtor.status === "deleted") {
      return res.status(400).json({
        success: false,
        message: "Cannot add invoice to a deleted debtor",
      });
    }

    // Check for duplicate invoiceNumber
    if (
      debtor.invoices.some((inv) => inv.invoiceNumber === value.invoiceNumber)
    ) {
      return res.status(409).json({
        success: false,
        message: "Invoice number already exists for this debtor",
      });
    }

    debtor.invoices.push(value);
    const updatedDebtor = await debtor.save();

    // Recalculate totals with enhanced logic
    updatedDebtor.totalDebt = updatedDebtor.invoices.reduce(
      (sum, inv) => sum + (Number(inv.amount) || 0), // Ensure numeric addition
      0
    );
    const totalPayments = updatedDebtor.invoices.reduce(
      (sum, inv) =>
        sum +
        (inv.payments?.reduce((pSum, p) => pSum + (Number(p.amount) || 0), 0) ||
          0),
      0
    );
    updatedDebtor.totalCreditReceived = totalPayments; // Sync with payments in invoices
    updatedDebtor.closingBalance =
      (Number(updatedDebtor.openingBalance) || 0) + // Handle potential null/undefined
      updatedDebtor.totalDebt -
      updatedDebtor.totalCreditReceived -
      (Number(updatedDebtor.totalDeduction) || 0); // Ensure numeric deduction
    await updatedDebtor.save();

    const populatedDebtor = await Debtor.findById(id)
      .populate("customer", "name email phoneNumber")
      .populate("createdBy", "fullName email")
      .populate("invoices.initialPayment.method", "name")
      .populate("invoices.payments.method", "name");

    res.status(201).json({
      success: true,
      message: "Invoice added successfully",
      data: populatedDebtor,
    });
  } catch (error) {
    console.error("Error adding invoice:", error);
    res.status(500).json({
      success: false,
      message: "Error adding invoice",
      error: error.message,
    });
  }
};

// PUT /api/debtors/:id/invoices/:invoiceId: Update a specific invoice
exports.updateInvoice = async (req, res) => {
  try {
    const { id, invoiceId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Debtor ID",
      });
    }

    const { error, value } = invoiceSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const debtor = await Debtor.findById(id);
    if (!debtor || debtor.status === "deleted") {
      return res.status(404).json({
        success: false,
        message: "Debtor not found or deleted",
      });
    }

    const invoice = debtor.invoices.id(invoiceId);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Check for duplicate invoiceNumber if changed
    if (value.invoiceNumber && value.invoiceNumber !== invoice.invoiceNumber) {
      if (
        debtor.invoices.some((inv) => inv.invoiceNumber === value.invoiceNumber)
      ) {
        return res.status(409).json({
          success: false,
          message: "Invoice number already exists for this debtor",
        });
      }
    }

    invoice.set(value);
    const updatedDebtor = await debtor.save();

    // Recalculate totals
    updatedDebtor.totalDebt = updatedDebtor.invoices.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    updatedDebtor.closingBalance =
      updatedDebtor.openingBalance +
      updatedDebtor.totalDebt -
      updatedDebtor.totalCreditReceived -
      updatedDebtor.totalDeduction;
    await updatedDebtor.save();

    const populatedDebtor = await Debtor.findById(id)
      .populate("customer", "name email phoneNumber")
      .populate("createdBy", "fullName email");

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: populatedDebtor,
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({
      success: false,
      message: "Error updating invoice",
      error: error.message,
    });
  }
};

// exports.addInitialPayment = async (req, res) => {
//   try {
//     const { id, invoiceId } = req.params;
//     if (
//       !mongoose.Types.ObjectId.isValid(id) ||
//       !mongoose.Types.ObjectId.isValid(invoiceId)
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid Debtor or Invoice ID" });
//     }

//     const { error, value } = initialPaymentSchema.validate(req.body, {
//       abortEarly: false,
//     });
//     if (error) {
//       return res
//         .status(400)
//         .json({ success: false, message: error.details.map((d) => d.message) });
//     }

//     const paymentMethod = await PaymentMethod.findById(value.method);
//     if (!paymentMethod) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid Payment Method ID" });
//     }

//     const debtor = await Debtor.findById(id);
//     if (!debtor || debtor.status === "deleted") {
//       return res
//         .status(404)
//         .json({ success: false, message: "Debtor not found or deleted" });
//     }

//     const invoice = debtor.invoices.id(invoiceId);
//     if (!invoice) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Invoice not found" });
//     }

//     const cashAccount = await Account.findOne({
//       name: "Cash",
//       status: "active",
//     });
//     const accountsReceivable = await Account.findOne({
//       name: "Accounts Receivable",
//       status: "active",
//     });

//     if (!cashAccount || !accountsReceivable) {
//       return res.status(400).json({
//         success: false,
//         message: "Required accounts (Cash or Accounts Receivable) not found",
//       });
//     }

//     const ledgerTransaction = await LedgerTransaction.create({
//       date: value.date || Date.now(),
//       description: `Initial payment for invoice ${invoice.invoiceNumber}`,
//       referenceType: "DebtorPayment",
//       referenceId: debtor._id,
//       entries: [
//         { account: cashAccount._id, debit: value.amount, credit: 0 }, // Debit Cash
//         { account: accountsReceivable._id, debit: 0, credit: value.amount }, // Credit Accounts Receivable
//       ],
//       createdBy: req.user.userId,
//     });

//     if (ledgerTransaction.status !== "Pending") {
//       return res.status(400).json({
//         success: false,
//         message: "Ledger transaction must be in Pending status",
//       });
//     }

//     value.ledgerTransactionId = ledgerTransaction._id;
//     invoice.initialPayment = value;

//     debtor.totalCreditReceived = debtor.invoices.reduce(
//       (sum, inv) =>
//         sum +
//         (inv.initialPayment?.amount || 0) +
//         (inv.payments?.reduce((pSum, p) => pSum + p.amount, 0) || 0),
//       0
//     );
//     debtor.closingBalance =
//       debtor.openingBalance +
//       debtor.totalDebt -
//       debtor.totalCreditReceived -
//       debtor.totalDeduction;
//     await debtor.save();

//     const populatedDebtor = await Debtor.findById(id)
//       .populate("customer", "name email phoneNumber")
//       .populate("createdBy", "fullName email")
//       .populate("invoices.initialPayment.method", "name")
//       .populate("invoices.payments.method", "name");

//     res.status(201).json({
//       success: true,
//       message: "Initial payment added successfully",
//       data: populatedDebtor,
//     });
//   } catch (error) {
//     console.error("Error adding initial payment:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error adding initial payment",
//       error: error.message,
//     });
//   }
// };

// exports.addPayment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       invoiceId,
//       amount,
//       method,
//       date,
//       whtRate,
//       whtAmount,
//       ledgerTransactionId,
//     } = req.body;

//     console.log("Received:", { id, invoiceId, amount, method, date });

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid Debtor ID" });
//     }
//     if (invoiceId && !mongoose.Types.ObjectId.isValid(invoiceId)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid Invoice ID" });
//     }

//     const { error, value } = paymentSchema.validate(req.body, {
//       abortEarly: false,
//     });
//     if (error) {
//       return res
//         .status(400)
//         .json({ success: false, message: error.details.map((d) => d.message) });
//     }

//     const paymentMethod = await PaymentMethod.findById(value.method);
//     if (!paymentMethod) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid Payment Method ID" });
//     }

//     const debtor = await Debtor.findById(id);
//     if (!debtor || debtor.status === "deleted") {
//       return res
//         .status(404)
//         .json({ success: false, message: "Debtor not found or deleted" });
//     }

//     let invoice;
//     if (invoiceId) {
//       invoice = debtor.invoices.id(invoiceId);
//       if (!invoice) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Invoice not found" });
//       }
//     }

//     const cashAccount = await Account.findOne({
//       name: "Cash",
//       status: "active",
//     });
//     const accountsReceivable = await Account.findOne({
//       name: "Accounts Receivable",
//       status: "active",
//     });

//     if (!cashAccount || !accountsReceivable) {
//       return res.status(400).json({
//         success: false,
//         message: "Required accounts (Cash or Accounts Receivable) not found",
//       });
//     }

//     const ledgerTransaction = await LedgerTransaction.create({
//       date: value.date || Date.now(),
//       description: invoice
//         ? `Payment for invoice ${invoice.invoiceNumber}`
//         : `General payment for debtor ${debtor._id}`,
//       referenceType: "DebtorPayment",
//       referenceId: debtor._id,
//       entries: [
//         { account: cashAccount._id, debit: value.amount, credit: 0 },
//         { account: accountsReceivable._id, debit: 0, credit: value.amount },
//       ],
//       createdBy: req.user.userId,
//     });

//     if (ledgerTransaction.status !== "Pending") {
//       return res.status(400).json({
//         success: false,
//         message: "Ledger transaction must be in Pending status",
//       });
//     }

//     value.ledgerTransactionId = ledgerTransaction._id;

//     if (invoice) {
//       invoice.payments.push(value);
//     } else {
//       debtor.totalCreditReceived += value.amount;
//     }

//     debtor.totalCreditReceived = debtor.invoices.reduce(
//       (sum, inv) =>
//         sum +
//         (inv.initialPayment?.amount || 0) +
//         (inv.payments?.reduce((pSum, p) => pSum + p.amount, 0) || 0),
//       0
//     );
//     debtor.closingBalance =
//       debtor.openingBalance +
//       debtor.totalDebt -
//       debtor.totalCreditReceived -
//       debtor.totalDeduction;
//     await debtor.save();

//     const populatedDebtor = await Debtor.findById(id)
//       .populate("customer", "name email phoneNumber")
//       .populate("createdBy", "fullName email")
//       .populate("invoices.initialPayment.method", "name")
//       .populate("invoices.payments.method", "name");

//     res.status(201).json({
//       success: true,
//       message: "Payment added successfully",
//       data: populatedDebtor,
//     });
//   } catch (error) {
//     console.error("Error adding payment:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error adding payment",
//       error: error.message,
//     });
//   }
// };
exports.addInitialPayment = async (req, res) => {
  try {
    const { id, invoiceId } = req.params;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(invoiceId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Debtor or Invoice ID" });
    }

    // Validate request body against initialPaymentSchema
    const { error, value } = initialPaymentSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    // Verify payment method exists
    const paymentMethod = await PaymentMethod.findById(value.method);
    if (!paymentMethod) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Payment Method ID" });
    }

    // Find debtor
    const debtor = await Debtor.findById(id);
    if (!debtor || debtor.status === "deleted") {
      return res
        .status(404)
        .json({ success: false, message: "Debtor not found or deleted" });
    }

    // Find invoice
    const invoice = debtor.invoices.id(invoiceId);
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    // Check for existing initial payment (optional: prevent overwrite or allow update)
    if (invoice.initialPayment) {
      return res.status(400).json({
        success: false,
        message:
          "Initial payment already exists for this invoice. Use update if intended.",
      });
    }

    // Verify required accounts
    const cashAccount = await Account.findOne({
      name: "Cash",
      status: "active",
    });
    const accountsReceivable = await Account.findOne({
      name: "Accounts Receivable",
      status: "active",
    });
    if (!cashAccount || !accountsReceivable) {
      return res.status(400).json({
        success: false,
        message: "Required accounts (Cash or Accounts Receivable) not found",
      });
    }

    // Create ledger transaction
    const ledgerTransaction = await LedgerTransaction.create({
      date: value.date || Date.now(),
      description: `Initial payment for invoice ${invoice.invoiceNumber}`,
      referenceType: "DebtorPayment",
      referenceId: debtor._id,
      entries: [
        { account: cashAccount._id, debit: value.amount, credit: 0 }, // Debit Cash
        { account: accountsReceivable._id, debit: 0, credit: value.amount }, // Credit Accounts Receivable
      ],
      status: "Pending", // Ensure default status is Pending
      createdBy: req.user.userId,
    });

    // Assign ledger transaction ID to payment
    value.ledgerTransactionId = ledgerTransaction._id;

    // Set initial payment
    invoice.initialPayment = value;

    // Update invoice status
    const totalPaid =
      (invoice.initialPayment?.amount || 0) +
      (invoice.payments?.reduce((sum, p) => sum + p.amount, 0) || 0);
    invoice.status =
      totalPaid >= invoice.amount
        ? "Paid"
        : totalPaid > 0
        ? "Partially Paid"
        : new Date(invoice.dueDate) < new Date()
        ? "Overdue"
        : "Pending";

    // Recalculate debtor totals
    debtor.totalCreditReceived = debtor.invoices.reduce(
      (sum, inv) =>
        sum +
        (inv.initialPayment?.amount || 0) +
        (inv.payments?.reduce((pSum, p) => pSum + p.amount, 0) || 0),
      0
    );
    debtor.totalDeduction = debtor.invoices.reduce(
      (sum, inv) => sum + (inv.cashRefund || 0) + (inv.badDebtWriteOff || 0),
      0
    );
    debtor.closingBalance =
      debtor.openingBalance +
      debtor.totalDebt -
      debtor.totalCreditReceived -
      debtor.totalDeduction;

    // Save changes
    await debtor.save();

    // Populate response
    const populatedDebtor = await Debtor.findById(id)
      .populate("customer", "name email phoneNumber")
      .populate("createdBy", "fullName email")
      .populate("invoices.initialPayment.method", "name")
      .populate("invoices.payments.method", "name");

    res.status(201).json({
      success: true,
      message: "Initial payment added successfully",
      data: populatedDebtor,
    });
  } catch (error) {
    console.error("Error adding initial payment:", error);
    res.status(500).json({
      success: false,
      message: "Error adding initial payment",
      error: error.message,
    });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { invoiceId, amount, method, date, whtRate, whtAmount } = req.body;

    console.log("Received:", { id, invoiceId, amount, method, date });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Debtor ID" });
    }
    if (invoiceId && !mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Invoice ID" });
    }

    const { error, value } = paymentSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details.map((d) => d.message) });
    }

    const paymentMethod = await PaymentMethod.findById(value.method);
    if (!paymentMethod) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Payment Method ID" });
    }

    const debtor = await Debtor.findById(id);
    if (!debtor || debtor.status === "deleted") {
      return res
        .status(404)
        .json({ success: false, message: "Debtor not found or deleted" });
    }

    let invoice;
    if (invoiceId) {
      invoice = debtor.invoices.id(invoiceId);
      if (!invoice) {
        return res
          .status(404)
          .json({ success: false, message: "Invoice not found" });
      }
    }

    const cashAccount = await Account.findOne({
      name: "Cash",
      status: "active",
    });
    const accountsReceivable = await Account.findOne({
      name: "Accounts Receivable",
      status: "active",
    });

    if (!cashAccount || !accountsReceivable) {
      return res.status(400).json({
        success: false,
        message: "Required accounts (Cash or Accounts Receivable) not found",
      });
    }

    const ledgerTransaction = await LedgerTransaction.create({
      date: value.date || Date.now(),
      description: invoice
        ? `Payment for invoice ${invoice.invoiceNumber}`
        : `General payment for debtor ${debtor._id}`,
      referenceType: "Debtor",
      referenceId: debtor._id,
      entries: [
        { account: cashAccount._id, debit: value.amount, credit: 0 },
        { account: accountsReceivable._id, debit: 0, credit: value.amount },
      ],
      status: "Pending",
      createdBy: req.user.userId,
    });

    value.ledgerTransactionId = ledgerTransaction._id;

    if (invoice) {
      invoice.payments.push(value);
    } else {
      debtor.totalCreditReceived += value.amount;
    }

    debtor.totalCreditReceived = debtor.invoices.reduce(
      (sum, inv) =>
        sum +
        (inv.initialPayment?.amount || 0) +
        (inv.payments?.reduce((pSum, p) => pSum + p.amount, 0) || 0),
      0
    );
    debtor.closingBalance =
      debtor.openingBalance +
      debtor.totalDebt -
      debtor.totalCreditReceived -
      debtor.totalDeduction;
    await debtor.save();

    const populatedDebtor = await Debtor.findById(id)
      .populate("customer", "name email phoneNumber")
      .populate("createdBy", "fullName email")
      .populate("invoices.initialPayment.method", "name")
      .populate("invoices.payments.method", "name");

    res.status(201).json({
      success: true,
      message: "Payment added successfully",
      data: populatedDebtor,
    });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({
      success: false,
      message: "Error adding payment",
      error: error.message,
    });
  }
};

exports.recalculateDebtorBalance = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Debtor ID" });
    }

    const debtor = await Debtor.findById(id);
    if (!debtor || debtor.status === "deleted") {
      return res
        .status(404)
        .json({ success: false, message: "Debtor not found or deleted" });
    }

    debtor.totalDebt = debtor.invoices.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    debtor.totalCreditReceived = debtor.invoices.reduce(
      (sum, inv) =>
        sum +
        (inv.initialPayment?.amount || 0) +
        (inv.payments?.reduce((pSum, p) => pSum + p.amount, 0) || 0),
      0
    );
    debtor.totalDeduction = debtor.invoices.reduce(
      (sum, inv) => sum + (inv.cashRefund || 0) + (inv.badDebtWriteOff || 0),
      0
    );
    debtor.closingBalance =
      debtor.openingBalance +
      debtor.totalDebt -
      debtor.totalCreditReceived -
      debtor.totalDeduction;

    await debtor.save();

    const populatedDebtor = await Debtor.findById(id)
      .populate("customer", "name email phoneNumber")
      .populate("createdBy", "fullName email")
      .populate("invoices.initialPayment.method", "name")
      .populate("invoices.payments.method", "name");

    res.status(200).json({
      success: true,
      message: "Debtor balance recalculated successfully",
      data: populatedDebtor,
    });
  } catch (error) {
    console.error("Error recalculating debtor balance:", error);
    res.status(500).json({
      success: false,
      message: "Error recalculating debtor balance",
      error: error.message,
    });
  }
};

exports.getDebtorInvoices = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Debtor ID" });
    }

    const debtor = await Debtor.findById(id)
      .populate("customer", "name email phoneNumber")
      .populate("invoices.initialPayment.method", "name")
      .populate("invoices.payments.method", "name");
    if (!debtor || debtor.status === "deleted") {
      return res
        .status(404)
        .json({ success: false, message: "Debtor not found or deleted" });
    }

    res.status(200).json({
      success: true,
      data: debtor.invoices,
    });
  } catch (error) {
    console.error("Error fetching debtor invoices:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching debtor invoices",
      error: error.message,
    });
  }
};

// GET /api/debtors/payments: List all payments added via addPayment
exports.getPaymentHistory = async (req, res) => {
  try {
    const debtors = await Debtor.find({ status: { $ne: "deleted" } })
      .populate("customer", "name email phoneNumber")
      .populate("invoices.payments.method", "name");

    // Flatten all payments from invoices across debtors
    const paymentHistory = debtors
      .flatMap((debtor) =>
        debtor.invoices
          .filter((invoice) => invoice.payments && invoice.payments.length > 0)
          .map((invoice) =>
            invoice.payments.map((payment) => ({
              debtorId: debtor._id,
              customerName: debtor.customer?.name || "N/A",
              invoiceNumber: invoice.invoiceNumber || "N/A",
              amount: payment.amount || 0,
              date: payment.date || new Date(),
              method: payment.method?.name || "N/A",
              paymentId: payment._id, // Unique ID for each payment
            }))
          )
          .flat()
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

    res.status(200).json({
      success: true,
      data: paymentHistory,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payment history",
      error: error.message,
    });
  }
};
