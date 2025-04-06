const mongoose = require("mongoose");
const Account = require("../models/accountModel");
const {
  createAccountSchema,
  updateAccountSchema,
} = require("../middlewares/validator");

// GET /api/accounts: Retrieve all active accounts
// exports.getAccounts = async (req, res) => {
//   try {
//     const accounts = await Account.find({ status: "active" })
//       .populate("createdBy", "fullName email")
//       .sort({ accountCode: 1 }); // Sort by accountCode for consistency

//     res.status(200).json({
//       success: true,
//       data: accounts,
//     });
//   } catch (error) {
//     console.error("Error fetching accounts:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching accounts",
//       error: error.message,
//     });
//   }
// };
exports.getAccounts = async (req, res) => {
  try {
    const { type } = req.query;
    const query = { status: "active" };
    if (type) {
      query.type = type;
    }

    const accounts = await Account.find(query)
      .populate("createdBy", "fullName email")
      .sort({ accountCode: 1 });

    res.status(200).json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching accounts",
      error: error.message,
    });
  }
};

// POST /api/accounts: Create a new account
exports.createAccount = async (req, res) => {
  try {
    const { error, value } = createAccountSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const accountData = {
      ...value,
      createdBy: req.user.userId, // From auth middleware
    };

    const newAccount = await Account.create(accountData);
    const populatedAccount = await Account.findById(newAccount._id).populate(
      "createdBy",
      "fullName email"
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: populatedAccount,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({
      success: false,
      message: "Error creating account",
      error: error.message,
    });
  }
};

// PUT /api/accounts/:id: Update an existing account
exports.updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Account ID",
      });
    }

    const { error, value } = updateAccountSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const account = await Account.findById(id);
    if (!account || account.status === "inactive") {
      return res.status(404).json({
        success: false,
        message: "Account not found or inactive",
      });
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { $set: value },
      { new: true, runValidators: true }
    ).populate("createdBy", "fullName email");

    res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: updatedAccount,
    });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({
      success: false,
      message: "Error updating account",
      error: error.message,
    });
  }
};

// DELETE /api/accounts/:id: Deactivate an account (soft delete)
exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Account ID",
      });
    }

    const account = await Account.findById(id);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }
    if (account.status === "inactive") {
      return res.status(400).json({
        success: false,
        message: "Account already inactive",
      });
    }

    account.status = "inactive";
    const deactivatedAccount = await account.save();
    const populatedAccount = await Account.findById(id).populate(
      "createdBy",
      "fullName email"
    );

    res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
      data: populatedAccount,
    });
  } catch (error) {
    console.error("Error deactivating account:", error);
    res.status(500).json({
      success: false,
      message: "Error deactivating account",
      error: error.message,
    });
  }
};
