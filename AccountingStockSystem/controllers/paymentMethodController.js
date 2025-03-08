// Adjust the path as needed
const AnotherUnifiedSale = require("../models/anotherUnifiedSaleModel");
const PaymentMethod = require("../models/PaymentMethodModel");
const {
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
} = require("../middlewares/validator");

// Create a new payment method
// Create a new payment method
exports.createPaymentMethod = async (req, res) => {
  const { name } = req.body;

  try {
    // Validate the input data
    const { error } = createPaymentMethodSchema.validate({ name });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Check if the payment method already exists
    const existingPaymentMethod = await PaymentMethod.findOne({
      name: name.toLowerCase(),
    });
    if (existingPaymentMethod) {
      return res.status(409).json({
        success: false,
        message: "Payment method already exists",
      });
    }

    // Create new payment method
    const newPaymentMethod = new PaymentMethod({ name: name.toLowerCase() });
    const savedPaymentMethod = await newPaymentMethod.save();

    res.status(201).json({
      success: true,
      message: "Payment method created successfully",
      paymentMethod: savedPaymentMethod,
    });
  } catch (error) {
    console.error("Error creating payment method:", error);
    res.status(500).json({
      success: false,
      message: "Error creating payment method",
    });
  }
};

// Get all payment methods
exports.getAllPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find();
    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({
      error: "Error fetching payment methods",
      details: error.message,
    });
  }
};

// Update a payment method
exports.updatePaymentMethod = async (req, res) => {
  const { paymentMethodId } = req.params;
  const { name } = req.body;

  try {
    // Validate input
    const { error } = updatePaymentMethodSchema.validate({ name });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
      paymentMethodId,
      { name: name.toLowerCase() },
      { new: true, runValidators: true }
    );
    if (!updatedPaymentMethod) {
      return res
        .status(404)
        .json({ success: false, message: "Payment method not found" });
    }

    res.status(200).json({
      success: true,
      message: "Payment method updated successfully",
      paymentMethod: updatedPaymentMethod,
    });
  } catch (error) {
    console.error("Error updating payment method:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating payment method" });
  }
};

// Delete a payment method
exports.deletePaymentMethod = async (req, res) => {
  const { paymentMethodId } = req.params;

  try {
    const deletedPaymentMethod = await PaymentMethod.findByIdAndDelete(
      paymentMethodId
    );
    if (!deletedPaymentMethod) {
      return res
        .status(404)
        .json({ success: false, message: "Payment method not found" });
    }

    res.status(200).json({
      success: true,
      message: "Payment method deleted successfully",
      paymentMethod: deletedPaymentMethod,
    });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting payment method" });
  }
};
