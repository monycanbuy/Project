const mongoose = require("mongoose");
const LedgerTransaction = require("../models/ledgerTransactionModel");
const Debtor = require("../models/debtorModel");
const {
  createLedgerTransactionSchema,
  updateLedgerTransactionSchema,
} = require("../middlewares/validator");

// GET /api/ledger-transactions: Retrieve all ledger transactions
// exports.getLedgerTransactions = async (req, res) => {
//   try {
//     const transactions = await LedgerTransaction.find({
//       status: { $ne: "Voided" },
//     })
//       .populate("createdBy", "fullName email")
//       .populate({
//         path: "referenceId",
//         select: "customer invoices invoiceNumber amount", // Adjusted fields for Debtor
//         match: { referenceType: { $in: ["AccountSale", "Debtor"] } },
//         populate: { path: "customer", select: "name email" },
//       })
//       .populate("entries.account", "name type");

//     res.status(200).json({
//       success: true,
//       data: transactions,
//     });
//   } catch (error) {
//     console.error("Error fetching ledger transactions:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching ledger transactions",
//       error: error.message,
//     });
//   }
// };
// exports.getLedgerTransactions = async (req, res) => {
//   try {
//     const transactions = await LedgerTransaction.find({
//       status: { $ne: "Voided" },
//     })
//       .populate("createdBy", "fullName email")
//       .populate({
//         path: "referenceId",
//         populate: {
//           path: "customer", // Populate customer within Debtor
//           select: "name email", // Fields from Customer model
//         },
//       }) // Include invoices by default
//       .populate("entries.account", "name type");

//     res.status(200).json({
//       success: true,
//       data: transactions,
//     });
//   } catch (error) {
//     console.error("Error fetching ledger transactions:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching ledger transactions",
//       error: error.message,
//     });
//   }
// };
exports.getLedgerTransactions = async (req, res) => {
  try {
    const transactions = await LedgerTransaction.find({
      status: { $ne: "Voided" },
    })
      .populate("createdBy", "fullName email")
      .populate({
        path: "referenceId",
        populate: {
          path: "customer",
          select: "name email",
          strictPopulate: false, // Allow population even if not in all schemas
        },
      })
      .populate("entries.account", "name type");

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching ledger transactions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching ledger transactions",
      error: error.message,
    });
  }
};

// GET /api/account-ledger: Fetch summarized ledger data
exports.getAccountLedger = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; // Optional date range filter

    // Build aggregation pipeline
    const pipeline = [
      // Filter by date range if provided
      ...(startDate || endDate
        ? [
            {
              $match: {
                date: {
                  ...(startDate && { $gte: new Date(startDate) }),
                  ...(endDate && { $lte: new Date(endDate) }),
                },
                status: { $ne: "Voided" }, // Exclude voided transactions
              },
            },
          ]
        : [{ $match: { status: { $ne: "Voided" } } }]),

      // Unwind entries array to process each entry individually
      { $unwind: "$entries" },

      // Group by date and account, summing debits and credits
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // Group by day
            account: "$entries.account",
          },
          sumOfDebit: { $sum: "$entries.debit" },
          sumOfCredit: { $sum: "$entries.credit" },
        },
      },

      // Project to shape the output
      {
        $project: {
          date: "$_id.date",
          account: "$_id.account",
          sumOfDebit: 1,
          sumOfCredit: 1,
          _id: 0,
        },
      },

      // Populate account details
      {
        $lookup: {
          from: "accounts", // Your accounts collection name
          localField: "account",
          foreignField: "_id",
          as: "accountDetails",
        },
      },
      {
        $unwind: "$accountDetails",
      },
      {
        $project: {
          date: 1,
          account: "$accountDetails.name",
          sumOfDebit: 1,
          sumOfCredit: 1,
        },
      },

      // Sort by date and account for consistency
      { $sort: { date: 1, account: 1 } },
    ];

    const accountLedger = await LedgerTransaction.aggregate(pipeline);

    // Calculate totals for the footer
    const totals = accountLedger.reduce(
      (acc, entry) => ({
        totalDebit: acc.totalDebit + entry.sumOfDebit,
        totalCredit: acc.totalCredit + entry.sumOfCredit,
      }),
      { totalDebit: 0, totalCredit: 0 }
    );

    res.status(200).json({
      success: true,
      data: accountLedger,
      totals,
    });
  } catch (error) {
    console.error("Error fetching account ledger:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching account ledger",
      error: error.message,
    });
  }
};

// POST /api/ledger-transactions: Create a new ledger transaction
exports.createLedgerTransaction = async (req, res) => {
  try {
    const { error, value } = createLedgerTransactionSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    // Add createdBy from authenticated user
    const transactionData = {
      ...value,
      createdBy: req.user.userId,
    };

    const newTransaction = await LedgerTransaction.create(transactionData);

    // Populate response
    const populatedTransaction = await LedgerTransaction.findById(
      newTransaction._id
    )
      .populate("createdBy", "fullName email")
      .populate({
        path: "referenceId",
        select: "invoiceNumber amount customer",
        match: { referenceType: { $in: ["AccountSale", "Debtor"] } },
        populate: { path: "customer", select: "name email" },
      })
      .populate("entries.account", "name type");

    res.status(201).json({
      success: true,
      message: "Ledger transaction created successfully",
      data: populatedTransaction,
    });
  } catch (error) {
    console.error("Error creating ledger transaction:", error);
    res.status(500).json({
      success: false,
      message: "Error creating ledger transaction",
      error: error.message,
    });
  }
};

// PUT /api/ledger-transactions/:id: Update an existing ledger transaction
exports.updateLedgerTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Ledger Transaction ID",
      });
    }

    const { error, value } = updateLedgerTransactionSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const transaction = await LedgerTransaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Ledger transaction not found",
      });
    }

    if (transaction.status === "Posted") {
      return res.status(400).json({
        success: false,
        message: "Cannot update a posted transaction",
      });
    }

    if (transaction.status === "Voided") {
      return res.status(400).json({
        success: false,
        message: "Cannot update a voided transaction",
      });
    }

    const updatedTransaction = await LedgerTransaction.findByIdAndUpdate(
      id,
      { $set: value },
      { new: true, runValidators: true }
    )
      .populate("createdBy", "fullName email")
      .populate({
        path: "referenceId",
        select: "invoiceNumber amount customer",
        match: { referenceType: { $in: ["AccountSale", "Debtor"] } },
        populate: { path: "customer", select: "name email" },
      })
      .populate("entries.account", "name type");

    res.status(200).json({
      success: true,
      message: "Ledger transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    console.error("Error updating ledger transaction:", error);
    res.status(500).json({
      success: false,
      message: "Error updating ledger transaction",
      error: error.message,
    });
  }
};

// DELETE /api/ledger-transactions/:id: Void a ledger transaction (soft delete)
exports.deleteLedgerTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Ledger Transaction ID",
      });
    }

    const transaction = await LedgerTransaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Ledger transaction not found",
      });
    }

    if (transaction.status === "Posted") {
      return res.status(400).json({
        success: false,
        message: "Cannot void a posted transaction",
      });
    }

    if (transaction.status === "Voided") {
      return res.status(400).json({
        success: false,
        message: "Transaction already voided",
      });
    }

    transaction.status = "Voided";
    const voidedTransaction = await transaction.save();

    const populatedTransaction = await LedgerTransaction.findById(id)
      .populate("createdBy", "fullName email")
      .populate({
        path: "referenceId",
        select: "invoiceNumber amount customer",
        match: { referenceType: { $in: ["AccountSale", "Debtor"] } },
        populate: { path: "customer", select: "name email" },
      })
      .populate("entries.account", "name type");

    res.status(200).json({
      success: true,
      message: "Ledger transaction voided successfully",
      data: populatedTransaction,
    });
  } catch (error) {
    console.error("Error voiding ledger transaction:", error);
    res.status(500).json({
      success: false,
      message: "Error voiding ledger transaction",
      error: error.message,
    });
  }
};

exports.getTransactionsByAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Account ID" });
    }

    const transactions = await LedgerTransaction.find({
      "entries.account": accountId,
      status: { $ne: "Voided" },
    })
      .populate("createdBy", "fullName email")
      .populate("referenceId", "invoiceNumber amount customer")
      .populate("entries.account", "name type");

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions by account:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transactions by account",
      error: error.message,
    });
  }
};
