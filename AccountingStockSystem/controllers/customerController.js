const mongoose = require("mongoose");
const Customer = require("../models/customerModel"); // Adjust path to your Customer model
const {
  createCustomerSchema,
  updateCustomerSchema,
} = require("../middlewares/validator");

// GET: Retrieve a single customer by ID
exports.getCustomer = async (req, res) => {
  try {
    const customers = await Customer.find().populate(
      "createdBy",
      "fullName email"
    );

    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching customers",
      error: error.message,
    });
  }
};

// POST: Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res
        .status(401)
        .json({ success: false, message: "No authenticated user found" });
    }

    const { error, value } = createCustomerSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const { name, email, phoneNumber, address, status } = value;

    // Enhanced validations
    if (!phoneNumber.match(/^[0-9]{10,15}$/)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10-15 digits",
      });
    }

    const customerData = {
      name,
      email,
      phoneNumber,
      address,
      status: status || "active",
      createdBy: req.user.userId,
    };

    const newCustomer = await Customer.create(customerData);
    const populatedCustomer = await Customer.findById(newCustomer._id).populate(
      "createdBy",
      "fullName email"
    );

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: populatedCustomer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or phone number already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating customer",
      error: error.message,
    });
  }
};

// PUT: Update an existing customer
exports.updateCustomer = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res
        .status(401)
        .json({ success: false, message: "No authenticated user found" });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Customer ID" });
    }

    const { error, value } = updateCustomerSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const { name, email, phoneNumber, address, status } = value;

    const oldCustomer = await Customer.findById(id);
    if (!oldCustomer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    // Enhanced validation
    if (phoneNumber && !phoneNumber.match(/^[0-9]{10,15}$/)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10-15 digits",
      });
    }

    const updateData = {
      name,
      email,
      phoneNumber,
      address,
      status,
    };
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("createdBy", "fullName email");

    if (!updatedCustomer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found after update" });
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: updatedCustomer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or phone number already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating customer",
      error: error.message,
    });
  }
};

// DELETE: Delete a customer (soft delete)
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Customer ID" });
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    if (customer.status === "deleted") {
      return res
        .status(400)
        .json({ success: false, message: "Customer already deleted" });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { $set: { status: "deleted" } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
      data: updatedCustomer,
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting customer",
      error: error.message,
    });
  }
};

// GET /api/customers/:id/debtors: List all debtors for a customer
exports.getCustomerDebtors = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Customer ID",
      });
    }

    const customer = await Customer.findById(id);
    if (!customer || customer.status === "deleted") {
      return res.status(404).json({
        success: false,
        message: "Customer not found or deleted",
      });
    }

    const debtors = await Debtor.find({
      customer: id,
      status: { $ne: "deleted" },
    })
      .populate("customer", "name email phoneNumber")
      .populate("createdBy", "fullName email");

    res.status(200).json({
      success: true,
      data: debtors,
    });
  } catch (error) {
    console.error("Error fetching customer debtors:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching customer debtors",
      error: error.message,
    });
  }
};
