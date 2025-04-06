const mongoose = require("mongoose");
const PettyCash = require("../models/pettyCashModel");
const LedgerTransaction = require("../models/ledgerTransactionModel");
const Account = require("../models/accountModel");
const {
  createPettyCashSchema,
  updatePettyCashSchema,
  pettyCashTransactionSchema,
} = require("../middlewares/validator");

exports.getPettyCashes = async (req, res) => {
  try {
    const pettyCashes = await PettyCash.find({ status: "active" })
      .populate("createdBy", "fullName email")
      .populate("transactions.ledgerTransactionId", "description") // Added population
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: pettyCashes,
    });
  } catch (error) {
    console.error("Error fetching petty cashes:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching petty cashes",
      error: error.message,
    });
  }
};

// exports.getAllPettyCashTransactions = async (req, res) => {
//   try {
//     const pettyCashes = await PettyCash.find({ status: "active" })
//       .select("transactions") // Only fetch transactions
//       .populate("transactions.ledgerTransactionId", "description");

//     // Flatten all transactions into a single array
//     const allTransactions = pettyCashes
//       .flatMap((pettyCash) =>
//         pettyCash.transactions.map((tx) => ({
//           id: tx._id,
//           pettyCashId: pettyCash._id, // Include parent PettyCash ID for reference
//           date: tx.date,
//           details: tx.details,
//           voucherNo: tx.voucherNo,
//           checkNo: tx.checkNo || "N/A",
//           totalPayment: tx.totalPayment,
//           expenseBreakdowns: tx.expenseBreakdowns,
//           ledgerTransactionDescription:
//             tx.ledgerTransactionId?.description || "N/A",
//         }))
//       )
//       .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, descending

//     res.status(200).json({
//       success: true,
//       data: allTransactions,
//     });
//   } catch (error) {
//     console.error("Error fetching all petty cash transactions:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching all petty cash transactions",
//       error: error.message,
//     });
//   }
// };
exports.getAllPettyCashTransactions = async (req, res) => {
  try {
    const pettyCashes = await PettyCash.find({ status: "active" })
      .select("transactions")
      .populate("transactions.ledgerTransactionId", "description")
      .populate("transactions.expenseBreakdowns.category", "name code"); // Populate name and code

    const allTransactions = pettyCashes
      .flatMap((pettyCash) =>
        pettyCash.transactions.map((tx) => ({
          id: tx._id,
          pettyCashId: pettyCash._id,
          date: tx.date,
          details: tx.details,
          voucherNo: tx.voucherNo,
          checkNo: tx.checkNo || "N/A",
          totalPayment: tx.totalPayment,
          expenseBreakdowns: tx.expenseBreakdowns.map((breakdown) => ({
            category: breakdown.category ? breakdown.category.name : "Unknown", // Use name
            amount: breakdown.amount,
          })),
          ledgerTransactionDescription:
            tx.ledgerTransactionId?.description || "N/A",
        }))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      data: allTransactions,
    });
  } catch (error) {
    console.error("Error fetching all petty cash transactions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all petty cash transactions",
      error: error.message,
    });
  }
};

exports.createPettyCash = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { error, value } = createPettyCashSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const cashAccount = await Account.findOne({
      name: "Cash",
      status: "active",
    });
    if (!cashAccount) {
      return res.status(400).json({
        success: false,
        message: "Cash account not found",
      });
    }

    const pettyCashEquityAccount = await Account.findOne({
      name: "Petty Cash Equity",
      status: "active",
    });
    if (!pettyCashEquityAccount) {
      return res.status(400).json({
        success: false,
        message: "Petty Cash Equity account not found",
      });
    }

    // Step 1: Create PettyCash first to get its _id
    const pettyCashData = {
      balance: value.balance,
      initialAmount: value.initialAmount,
      status: value.status || "active",
      createdBy: req.user.userId,
      lastReplenished: Date.now(),
      transactions: [],
    };

    const [newPettyCash] = await PettyCash.create([pettyCashData], { session });

    // Step 2: Create LedgerTransaction with referenceId set to newPettyCash._id
    const [ledgerTransaction] = await LedgerTransaction.create(
      [
        {
          date: Date.now(),
          description: `Initial petty cash funding`,
          referenceType: "PettyCash",
          referenceId: newPettyCash._id, // Add this
          entries: [
            { account: cashAccount._id, debit: value.initialAmount, credit: 0 },
            {
              account: pettyCashEquityAccount._id,
              debit: 0,
              credit: value.initialAmount,
            },
          ],
          createdBy: req.user.userId,
        },
      ],
      { session }
    );

    // Step 3: Populate and return the result
    const populatedPettyCash = await PettyCash.findById(newPettyCash._id)
      .populate("createdBy", "fullName email")
      .session(session);

    await session.commitTransaction();
    res.status(201).json({
      success: true,
      message: "Petty cash created successfully",
      data: populatedPettyCash,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating petty cash:", error);
    res.status(500).json({
      success: false,
      message: "Error creating petty cash",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

exports.updatePettyCash = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Petty Cash ID",
      });
    }

    const { error, value } = updatePettyCashSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const pettyCash = await PettyCash.findById(id);
    if (!pettyCash || pettyCash.status === "inactive") {
      return res.status(404).json({
        success: false,
        message: "Petty cash not found or inactive",
      });
    }

    const updatedPettyCash = await PettyCash.findByIdAndUpdate(
      id,
      { $set: value },
      { new: true, runValidators: true }
    ).populate("createdBy", "fullName email");

    res.status(200).json({
      success: true,
      message: "Petty cash updated successfully",
      data: updatedPettyCash,
    });
  } catch (error) {
    console.error("Error updating petty cash:", error);
    res.status(500).json({
      success: false,
      message: "Error updating petty cash",
      error: error.message,
    });
  }
};

exports.deletePettyCash = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Petty Cash ID",
      });
    }

    const pettyCash = await PettyCash.findById(id);
    if (!pettyCash) {
      return res.status(404).json({
        success: false,
        message: "Petty cash not found",
      });
    }
    if (pettyCash.status === "inactive") {
      return res.status(400).json({
        success: false,
        message: "Petty cash already inactive",
      });
    }

    pettyCash.status = "inactive";
    await pettyCash.save();

    const populatedPettyCash = await PettyCash.findById(id).populate(
      "createdBy",
      "fullName email"
    );

    res.status(200).json({
      success: true,
      message: "Petty cash deactivated successfully",
      data: populatedPettyCash,
    });
  } catch (error) {
    console.error("Error deactivating petty cash:", error);
    res.status(500).json({
      success: false,
      message: "Error deactivating petty cash",
      error: error.message,
    });
  }
};

// exports.addTransaction = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Petty Cash ID",
//       });
//     }

//     const { error, value } = pettyCashTransactionSchema.validate(req.body, {
//       abortEarly: false,
//     });
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details.map((d) => d.message),
//       });
//     }

//     // Validate expenseBreakdowns sum equals totalPayment
//     const breakdownSum = value.expenseBreakdowns.reduce(
//       (sum, b) => sum + b.amount,
//       0
//     );
//     if (breakdownSum !== value.totalPayment) {
//       return res.status(400).json({
//         success: false,
//         message: "Sum of expense breakdowns must equal total payment",
//       });
//     }

//     const pettyCash = await PettyCash.findById(id);
//     if (!pettyCash || pettyCash.status === "inactive") {
//       return res.status(404).json({
//         success: false,
//         message: "Petty cash not found or inactive",
//       });
//     }

//     const cashAccount = await Account.findOne({
//       name: "Cash",
//       status: "active",
//     });
//     if (!cashAccount) {
//       return res.status(400).json({
//         success: false,
//         message: "Cash account not found",
//       });
//     }

//     const ledgerEntries = await Promise.all(
//       value.expenseBreakdowns.map(async (breakdown) => {
//         const expenseAccount = await Account.findOne({
//           name: breakdown.name,
//           status: "active",
//           type: "Expense",
//         });
//         if (!expenseAccount) {
//           throw new Error(`Expense account '${breakdown.name}' not found`);
//         }
//         return {
//           account: expenseAccount._id,
//           debit: breakdown.amount,
//           credit: 0,
//         };
//       })
//     );

//     ledgerEntries.push({
//       account: cashAccount._id,
//       debit: 0,
//       credit: value.totalPayment,
//     });

//     // Use ledgerTransactionDescription in LedgerTransaction if provided
//     const ledgerDescription = value.ledgerTransactionDescription
//       ? `${value.ledgerTransactionDescription} (Voucher: ${value.voucherNo})`
//       : `Petty cash expense - ${value.voucherNo}`;

//     const [ledgerTransaction] = await LedgerTransaction.create(
//       [
//         {
//           date: value.date || Date.now(),
//           description: ledgerDescription, // Updated to include ledgerTransactionDescription
//           referenceType: "PettyCash",
//           referenceId: pettyCash._id,
//           entries: ledgerEntries,
//           createdBy: req.user.userId,
//         },
//       ],
//       { session }
//     );

//     value.ledgerTransactionId = ledgerTransaction._id;
//     pettyCash.transactions.push(value); // ledgerTransactionDescription is included in value

//     pettyCash.balance =
//       pettyCash.initialAmount -
//       pettyCash.transactions.reduce((sum, tx) => sum + tx.totalPayment, 0);
//     if (pettyCash.balance < 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient petty cash balance for this transaction",
//       });
//     }

//     await pettyCash.save({ session });

//     const populatedPettyCash = await PettyCash.findById(id)
//       .populate("createdBy", "fullName email")
//       .populate("transactions.ledgerTransactionId", "description")
//       .session(session);

//     // Ensure ledgerTransactionDescription is in the response
//     const responseData = {
//       ...populatedPettyCash.toObject(),
//       transactions: populatedPettyCash.transactions.map((tx) => ({
//         ...tx,
//         ledgerTransactionDescription: tx.ledgerTransactionDescription || "N/A", // Fallback for old data
//       })),
//     };

//     await session.commitTransaction();
//     res.status(201).json({
//       success: true,
//       message: "Transaction added successfully",
//       data: responseData,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Error adding petty cash transaction:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error adding petty cash transaction",
//       error: error.message,
//     });
//   } finally {
//     session.endSession();
//   }
// };
// exports.addTransaction = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Petty Cash ID",
//       });
//     }

//     const { error, value } = pettyCashTransactionSchema.validate(req.body, {
//       abortEarly: false,
//     });
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details.map((d) => d.message),
//       });
//     }

//     // Validate expenseBreakdowns sum equals totalPayment
//     const breakdownSum = value.expenseBreakdowns.reduce(
//       (sum, b) => sum + b.amount,
//       0
//     );
//     if (breakdownSum !== value.totalPayment) {
//       return res.status(400).json({
//         success: false,
//         message: "Sum of expense breakdowns must equal total payment",
//       });
//     }

//     const pettyCash = await PettyCash.findById(id);
//     if (!pettyCash || pettyCash.status === "inactive") {
//       return res.status(404).json({
//         success: false,
//         message: "Petty cash not found or inactive",
//       });
//     }

//     const cashAccount = await Account.findOne({
//       name: "Cash",
//       status: "active",
//     });
//     if (!cashAccount) {
//       return res.status(400).json({
//         success: false,
//         message: "Cash account not found",
//       });
//     }

//     // Validate and map expense categories to accounts
//     const ledgerEntries = await Promise.all(
//       value.expenseBreakdowns.map(async (breakdown) => {
//         const category = await mongoose.model("ExpenseCategory").findOne({
//           _id: breakdown.category,
//           active: true,
//         });
//         if (!category) {
//           throw new Error(
//             `Expense category with ID '${breakdown.category}' not found or inactive`
//           );
//         }

//         // Find expense account by category name or code (adjust based on your Account setup)
//         const expenseAccount = await Account.findOne({
//           name: category.name, // Or use `category.code` if accounts are named by code
//           status: "active",
//           type: "Expense",
//         });
//         if (!expenseAccount) {
//           throw new Error(`Expense account '${category.name}' not found`);
//         }

//         return {
//           account: expenseAccount._id,
//           debit: breakdown.amount,
//           credit: 0,
//         };
//       })
//     );

//     ledgerEntries.push({
//       account: cashAccount._id,
//       debit: 0,
//       credit: value.totalPayment,
//     });

//     const ledgerDescription = value.ledgerTransactionDescription
//       ? `${value.ledgerTransactionDescription} (Voucher: ${
//           value.voucherNo || "N/A"
//         })`
//       : `Petty cash expense - ${value.voucherNo || "N/A"}`;

//     const [ledgerTransaction] = await LedgerTransaction.create(
//       [
//         {
//           date: value.date || Date.now(),
//           description: ledgerDescription,
//           referenceType: "PettyCash",
//           referenceId: pettyCash._id,
//           entries: ledgerEntries,
//           createdBy: req.user.userId,
//         },
//       ],
//       { session }
//     );

//     value.ledgerTransactionId = ledgerTransaction._id;
//     pettyCash.transactions.push(value);

//     // Update balance (use totalReceived from replenishments)
//     const totalReceived = pettyCash.replenishments.reduce(
//       (sum, r) => sum + r.amount,
//       0
//     );
//     pettyCash.balance =
//       totalReceived -
//       pettyCash.transactions.reduce((sum, tx) => sum + tx.totalPayment, 0);
//     if (pettyCash.balance < 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient petty cash balance for this transaction",
//       });
//     }

//     await pettyCash.save({ session });

//     const populatedPettyCash = await PettyCash.findById(id)
//       .populate("createdBy", "fullName email")
//       .populate("transactions.ledgerTransactionId", "description")
//       .populate("transactions.expenseBreakdowns.category", "name code") // Populate category for DataGrid
//       .session(session);

//     await session.commitTransaction();
//     res.status(201).json({
//       success: true,
//       message: "Transaction added successfully",
//       data: populatedPettyCash,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Error adding petty cash transaction:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error adding petty cash transaction",
//       error: error.message,
//     });
//   } finally {
//     session.endSession();
//   }
// };
// In pettyCashController.js
// exports.addTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { error, value } = pettyCashTransactionSchema.validate(req.body, {
//       abortEarly: false,
//     });
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details.map((d) => d.message),
//       });
//     }

//     const pettyCash = await PettyCash.findById(id);
//     if (!pettyCash) {
//       return res.status(404).json({
//         success: false,
//         message: "Petty cash not found",
//       });
//     }

//     // Check permissions if needed
//     const userId = req.user?.userId;
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     // Validate sufficient balance
//     const totalPayment = value.totalPayment;
//     if (pettyCash.currentBalance < totalPayment) {
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient petty cash balance",
//       });
//     }

//     // Prepare ledger entries
//     const ledgerEntries = await Promise.all(
//       value.expenseBreakdowns.map(async (breakdown) => {
//         const category = await mongoose.model("ExpenseCategory").findOne({
//           _id: breakdown.category,
//           active: true,
//         });
//         if (!category) {
//           throw new Error(
//             `Expense category with ID '${breakdown.category}' not found or inactive`
//           );
//         }

//         const expenseAccount = await Account.findOne({
//           name: category.code, // Changed from category.name to category.code
//           status: "active",
//           type: "Expense",
//         });
//         if (!expenseAccount) {
//           throw new Error(`Expense account '${category.code}' not found`);
//         }

//         return {
//           account: expenseAccount._id,
//           debit: breakdown.amount,
//           credit: 0,
//         };
//       })
//     );

//     // Add petty cash account entry (credit)
//     const pettyCashAccount = await Account.findOne({
//       name: "Petty Cash", // Adjust if your account name differs
//       status: "active",
//       type: "Asset",
//     });
//     if (!pettyCashAccount) {
//       throw new Error("Petty cash account not found");
//     }
//     ledgerEntries.push({
//       account: pettyCashAccount._id,
//       debit: 0,
//       credit: totalPayment,
//     });

//     // Create ledger transaction
//     const ledgerTransaction = await LedgerTransaction.create({
//       date: value.date,
//       description: value.ledgerTransactionDescription || value.details,
//       entries: ledgerEntries,
//       createdBy: userId,
//     });

//     // Add transaction to petty cash
//     const transaction = {
//       date: value.date,
//       details: value.details,
//       voucherNo: value.voucherNo,
//       checkNo: value.checkNo,
//       totalPayment: value.totalPayment,
//       expenseBreakdowns: value.expenseBreakdowns,
//       ledgerTransaction: ledgerTransaction._id,
//     };
//     pettyCash.transactions.push(transaction);
//     pettyCash.currentBalance -= totalPayment;
//     await pettyCash.save();

//     res.status(201).json({
//       success: true,
//       message: "Transaction added successfully",
//       data: transaction,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({
//       success: false,
//       message: "Error adding petty cash transaction",
//       error: error.message,
//     });
//   }
// };
// exports.addTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { error, value } = pettyCashTransactionSchema.validate(req.body, {
//       abortEarly: false,
//     });
//     if (error) {
//       console.log("Validation error:", error.details); // Debug log
//       return res.status(400).json({
//         success: false,
//         message: error.details.map((d) => d.message),
//       });
//     }

//     console.log("Validated request body:", value); // Debug log

//     const pettyCash = await PettyCash.findById(id);
//     if (!pettyCash) {
//       return res.status(404).json({
//         success: false,
//         message: "Petty cash not found",
//       });
//     }

//     const userId = req.user?.userId;
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const totalPayment = value.totalPayment;
//     if (pettyCash.currentBalance < totalPayment) {
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient petty cash balance",
//       });
//     }

//     // Validate expense categories exist and are active
//     await Promise.all(
//       value.expenseBreakdowns.map(async (breakdown) => {
//         console.log("Validating category:", breakdown.category); // Debug log
//         const category = await mongoose.model("ExpenseCategory").findOne({
//           _id: breakdown.category,
//           active: true,
//         });
//         if (!category) {
//           throw new Error(
//             `Expense category with ID '${breakdown.category}' not found or inactive`
//           );
//         }
//       })
//     );

//     const expenseAccount = await Account.findOne({
//       name: "Expenses",
//       status: "active",
//       type: "Expense",
//     });
//     if (!expenseAccount) {
//       throw new Error("Generic expense account 'Expenses' not found");
//     }

//     const ledgerEntries = value.expenseBreakdowns.map((breakdown) => ({
//       account: expenseAccount._id,
//       debit: breakdown.amount,
//       credit: 0,
//       description: `Expense: ${breakdown.category}`,
//     }));

//     const pettyCashAccount = await Account.findOne({
//       name: "Petty Cash",
//       status: "active",
//       type: "Asset",
//     });
//     if (!pettyCashAccount) {
//       throw new Error("Petty cash account not found");
//     }
//     ledgerEntries.push({
//       account: pettyCashAccount._id,
//       debit: 0,
//       credit: totalPayment,
//     });

//     const ledgerTransaction = await LedgerTransaction.create({
//       date: value.date,
//       description: value.ledgerTransactionDescription || value.details,
//       entries: ledgerEntries,
//       referenceId: id,
//       referenceType: "PettyCash",
//       createdBy: userId,
//     });

//     const transaction = {
//       date: value.date,
//       details: value.details,
//       voucherNo: value.voucherNo,
//       checkNo: value.checkNo,
//       totalPayment: value.totalPayment,
//       expenseBreakdowns: value.expenseBreakdowns,
//       ledgerTransactionId: ledgerTransaction._id,
//     };

//     console.log("Transaction to be saved:", transaction); // Debug log

//     pettyCash.transactions.push(transaction);
//     pettyCash.currentBalance -= totalPayment;
//     await pettyCash.save();

//     res.status(201).json({
//       success: true,
//       message: "Transaction added successfully",
//       data: transaction,
//     });
//   } catch (error) {
//     console.error("Error in addTransaction:", error); // Debug log
//     res.status(400).json({
//       success: false,
//       message: "Error adding petty cash transaction",
//       error: error.message,
//     });
//   }
// };
// exports.addTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { error, value } = pettyCashTransactionSchema.validate(req.body, {
//       abortEarly: false,
//     });
//     if (error) {
//       console.log("Validation error:", error.details); // Debug log
//       return res.status(400).json({
//         success: false,
//         message: error.details.map((d) => d.message),
//       });
//     }

//     console.log("Validated request body:", value); // Debug log

//     const pettyCash = await PettyCash.findById(id);
//     if (!pettyCash) {
//       return res.status(404).json({
//         success: false,
//         message: "Petty cash not found",
//       });
//     }

//     const userId = req.user?.userId;
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const totalPayment = value.totalPayment;
//     if (pettyCash.currentBalance < totalPayment) {
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient petty cash balance",
//       });
//     }

//     // Validate expense categories exist and are active
//     await Promise.all(
//       value.expenseBreakdowns.map(async (breakdown) => {
//         console.log("Validating category:", breakdown.category); // Debug log
//         const category = await mongoose.model("ExpenseCategory").findOne({
//           _id: breakdown.category,
//           active: true,
//         });
//         if (!category) {
//           throw new Error(
//             `Expense category with ID '${breakdown.category}' not found or inactive`
//           );
//         }
//       })
//     );

//     const expenseAccount = await Account.findOne({
//       name: "Expenses",
//       status: "active",
//       type: "Expense",
//     });
//     if (!expenseAccount) {
//       throw new Error("Generic expense account 'Expenses' not found");
//     }

//     const ledgerEntries = value.expenseBreakdowns.map((breakdown) => ({
//       account: expenseAccount._id,
//       debit: breakdown.amount,
//       credit: 0,
//       description: `Expense: ${breakdown.category}`,
//     }));

//     const pettyCashAccount = await Account.findOne({
//       name: "Petty Cash",
//       status: "active",
//       type: "Asset",
//     });
//     if (!pettyCashAccount) {
//       throw new Error("Petty cash account not found");
//     }
//     ledgerEntries.push({
//       account: pettyCashAccount._id,
//       debit: 0,
//       credit: totalPayment,
//     });

//     const ledgerTransaction = await LedgerTransaction.create({
//       date: value.date,
//       description: value.ledgerTransactionDescription || value.details,
//       entries: ledgerEntries,
//       referenceId: id,
//       referenceType: "PettyCash",
//       createdBy: userId,
//     });

//     const transaction = {
//       date: value.date,
//       details: value.details,
//       voucherNo: value.voucherNo,
//       checkNo: value.checkNo,
//       totalPayment: value.totalPayment,
//       expenseBreakdowns: value.expenseBreakdowns,
//       ledgerTransactionId: ledgerTransaction._id,
//     };

//     console.log("Transaction to be saved:", transaction); // Debug log

//     pettyCash.transactions.push(transaction);
//     pettyCash.currentBalance -= totalPayment;
//     await pettyCash.save();

//     res.status(201).json({
//       success: true,
//       message: "Transaction added successfully",
//       data: transaction,
//     });
//   } catch (error) {
//     console.error("Error in addTransaction:", error); // Debug log
//     res.status(400).json({
//       success: false,
//       message: "Error adding petty cash transaction",
//       error: error.message,
//     });
//   }
// };
exports.addTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("PettyCash ID:", id);
    console.log("Raw request body:", JSON.stringify(req.body, null, 2));

    const { error, value } = pettyCashTransactionSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      console.log("Validation error:", error.details);
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    console.log("Validated request body:", JSON.stringify(value, null, 2));

    const pettyCash = await PettyCash.findById(id);
    if (!pettyCash) {
      return res.status(404).json({
        success: false,
        message: "Petty cash not found",
      });
    }

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const totalPayment = value.totalPayment;
    if (pettyCash.currentBalance < totalPayment) {
      return res.status(400).json({
        success: false,
        message: "Insufficient petty cash balance",
      });
    }

    await Promise.all(
      value.expenseBreakdowns.map(async (breakdown) => {
        console.log("Validating category:", breakdown.category);
        const category = await mongoose.model("ExpenseCategory").findOne({
          _id: breakdown.category,
          active: true,
        });
        if (!category) {
          throw new Error(
            `Expense category with ID '${breakdown.category}' not found or inactive`
          );
        }
      })
    );

    const expenseAccount = await Account.findOne({
      name: "Expenses",
      status: "active",
      type: "Expense",
    });
    if (!expenseAccount) {
      throw new Error("Generic expense account 'Expenses' not found");
    }

    const ledgerEntries = value.expenseBreakdowns.map((breakdown) => ({
      account: expenseAccount._id,
      debit: breakdown.amount,
      credit: 0,
      description: `Expense: ${breakdown.category}`,
    }));

    const pettyCashAccount = await Account.findOne({
      name: "Petty Cash",
      status: "active",
      type: "Asset",
    });
    if (!pettyCashAccount) {
      throw new Error("Petty cash account not found");
    }
    ledgerEntries.push({
      account: pettyCashAccount._id,
      debit: 0,
      credit: totalPayment,
    });

    const ledgerTransaction = await LedgerTransaction.create({
      date: value.date,
      description: value.ledgerTransactionDescription || value.details,
      entries: ledgerEntries,
      referenceId: id,
      referenceType: "PettyCash",
      createdBy: userId,
    });

    const transaction = {
      date: value.date,
      details: value.details,
      voucherNo: value.voucherNo,
      checkNo: value.checkNo,
      totalPayment: value.totalPayment,
      expenseBreakdowns: value.expenseBreakdowns.map((breakdown) => {
        console.log("Converting category:", breakdown.category);
        return {
          category: new mongoose.Types.ObjectId(breakdown.category), // Fixed: Added 'new'
          amount: breakdown.amount,
        };
      }),
      ledgerTransactionId: ledgerTransaction._id,
    };

    console.log(
      "Transaction to be saved:",
      JSON.stringify(transaction, null, 2)
    );
    console.log(
      "PettyCash before save:",
      JSON.stringify(pettyCash.toObject(), null, 2)
    );
    pettyCash.transactions.push(transaction);
    pettyCash.currentBalance -= totalPayment;
    await pettyCash.save();

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error in addTransaction:", error);
    res.status(400).json({
      success: false,
      message: "Error adding petty cash transaction",
      error: error.message,
    });
  }
};

exports.recalculatePettyCashBalance = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Petty Cash ID",
      });
    }

    const pettyCash = await PettyCash.findById(id);
    if (!pettyCash || pettyCash.status === "inactive") {
      return res.status(404).json({
        success: false,
        message: "Petty cash not found or inactive",
      });
    }

    pettyCash.balance =
      pettyCash.initialAmount -
      pettyCash.transactions.reduce((sum, tx) => sum + tx.totalPayment, 0);
    if (pettyCash.balance < 0) {
      pettyCash.balance = 0;
    }

    await pettyCash.save();

    const populatedPettyCash = await PettyCash.findById(id)
      .populate("createdBy", "fullName email")
      .populate("transactions.ledgerTransactionId", "description"); // Added population

    res.status(200).json({
      success: true,
      message: "Petty cash balance recalculated successfully",
      data: populatedPettyCash,
    });
  } catch (error) {
    console.error("Error recalculating petty cash balance:", error);
    res.status(500).json({
      success: false,
      message: "Error recalculating petty cash balance",
      error: error.message,
    });
  }
};
