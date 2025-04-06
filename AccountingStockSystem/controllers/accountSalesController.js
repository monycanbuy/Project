const mongoose = require("mongoose");
const AccountSale = require("../models/accountSaleModel");
const Debtor = require("../models/debtorModel");
const Account = require("../models/accountModel");
const LedgerTransaction = require("../models/ledgerTransactionModel");
const {
  createAccountSaleSchema,
  updateAccountSaleSchema,
} = require("../middlewares/validator");

exports.getAccountSales = async (req, res) => {
  try {
    const sales = await AccountSale.find({ status: { $ne: "Cancelled" } })
      .populate("customer", "name email phoneNumber")
      .populate("ledgerTransactionId", "description entries")
      .populate("createdBy", "fullName email");
    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    console.error("Error fetching account sales:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching account sales",
      error: error.message,
    });
  }
};

exports.createAccountSale = async (req, res) => {
  try {
    const { error, value } = createAccountSaleSchema.validate(req.body, {
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
    const revenue = await Account.findOne({
      name: "Revenue",
      status: "active",
    });
    const accountsReceivable = await Account.findOne({
      name: "Accounts Receivable",
      status: "active",
    });

    const saleData = { ...value, createdBy: req.user.userId };
    const newSale = new AccountSale(saleData);

    // Only require Accounts Receivable for credit sales
    if (
      !cashAccount ||
      !revenue ||
      (newSale.isCreditSale && !accountsReceivable)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required accounts (Cash, Revenue, or Accounts Receivable) not found",
      });
    }

    let ledgerTransaction;
    if (newSale.isCreditSale) {
      ledgerTransaction = await LedgerTransaction.create({
        date: newSale.date,
        description: `Credit sale ${newSale.invoiceNumber}`,
        referenceType: "AccountSale",
        referenceId: newSale._id,
        entries: [
          { account: accountsReceivable._id, debit: newSale.amount, credit: 0 },
          { account: revenue._id, debit: 0, credit: newSale.amount },
        ],
        createdBy: req.user.userId,
      });

      await Debtor.updateOne(
        { customer: newSale.customer },
        {
          $push: {
            invoices: {
              invoiceNumber: newSale.invoiceNumber,
              amount: newSale.amount,
            },
          },
        },
        { upsert: true }
      );
    } else {
      ledgerTransaction = await LedgerTransaction.create({
        date: newSale.date,
        description: `Cash sale ${newSale.invoiceNumber}`,
        referenceType: "AccountSale",
        referenceId: newSale._id,
        entries: [
          { account: cashAccount._id, debit: newSale.amount, credit: 0 },
          { account: revenue._id, debit: 0, credit: newSale.amount },
        ],
        createdBy: req.user.userId,
      });
    }

    newSale.ledgerTransactionId = ledgerTransaction._id;
    await newSale.save();

    const populatedSale = await AccountSale.findById(newSale._id)
      .populate("customer", "name email phoneNumber")
      .populate("ledgerTransactionId", "description entries")
      .populate("createdBy", "fullName email");

    res.status(201).json({
      success: true,
      message: "Account sale created successfully",
      data: populatedSale,
    });
  } catch (error) {
    console.error("Error creating account sale:", error);
    res.status(500).json({
      success: false,
      message: "Error creating account sale",
      error: error.message,
    });
  }
};

exports.updateAccountSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = updateAccountSaleSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const sale = await AccountSale.findById(id);
    if (!sale) {
      return res
        .status(404)
        .json({ success: false, message: "Sale not found" });
    }

    const cashAccount = await Account.findOne({
      name: "Cash",
      status: "active",
    });
    const revenue = await Account.findOne({
      name: "Revenue",
      status: "active",
    });
    const accountsReceivable = await Account.findOne({
      name: "Accounts Receivable",
      status: "active",
    });

    Object.assign(sale, value); // Apply updates before checking isCreditSale
    if (
      !cashAccount ||
      !revenue ||
      (sale.isCreditSale && !accountsReceivable)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required accounts (Cash, Revenue, or Accounts Receivable) not found",
      });
    }

    await sale.save();

    if (sale.ledgerTransactionId) {
      await LedgerTransaction.updateOne(
        { _id: sale.ledgerTransactionId },
        {
          date: sale.date,
          description: `${sale.isCreditSale ? "Credit" : "Cash"} sale ${
            sale.invoiceNumber
          }`,
          entries: sale.isCreditSale
            ? [
                {
                  account: accountsReceivable._id,
                  debit: sale.amount,
                  credit: 0,
                },
                { account: revenue._id, debit: 0, credit: sale.amount },
              ]
            : [
                { account: cashAccount._id, debit: sale.amount, credit: 0 },
                { account: revenue._id, debit: 0, credit: sale.amount },
              ],
        }
      );
    }

    const populatedSale = await AccountSale.findById(id)
      .populate("customer", "name email phoneNumber")
      .populate("ledgerTransactionId", "description entries")
      .populate("createdBy", "fullName email");

    res.status(200).json({
      success: true,
      message: "Account sale updated successfully",
      data: populatedSale,
    });
  } catch (error) {
    console.error("Error updating account sale:", error);
    res.status(500).json({
      success: false,
      message: "Error updating account sale",
      error: error.message,
    });
  }
};

exports.deleteAccountSale = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Account Sale ID" });
    }

    const sale = await AccountSale.findById(id);
    if (!sale || sale.status === "Cancelled") {
      return res.status(404).json({
        success: false,
        message: "Account sale not found or already cancelled",
      });
    }

    sale.status = "Cancelled";
    const cancelledSale = await sale.save();

    // If credit sale, remove related invoice from Debtor
    if (cancelledSale.isCreditSale) {
      const debtor = await Debtor.findOne({ customer: cancelledSale.customer });
      if (debtor) {
        debtor.invoices = debtor.invoices.filter(
          (inv) => inv.saleId.toString() !== cancelledSale._id.toString()
        );
        debtor.totalDebt = debtor.invoices.reduce(
          (sum, inv) => sum + inv.amount,
          0
        );
        debtor.closingBalance =
          debtor.openingBalance +
          debtor.totalDebt -
          debtor.totalCreditReceived -
          debtor.totalDeduction;
        await debtor.save();
      }
    }

    const populatedSale = await AccountSale.findById(id)
      .populate("customer", "name email phoneNumber")
      .populate("createdBy", "fullName email");
    res.status(200).json({
      success: true,
      message: "Account sale cancelled successfully",
      data: populatedSale,
    });
  } catch (error) {
    console.error("Error cancelling account sale:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling account sale",
      error: error.message,
    });
  }
};
