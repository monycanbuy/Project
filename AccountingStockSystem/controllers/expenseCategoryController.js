const mongoose = require("mongoose");
const ExpenseCategory = require("../models/expenseCategoryModel"); // Adjust path as needed
const {
  createExpenseSchema,
  updateExpenseSchema,
} = require("../middlewares/validator"); // Adjust path as needed

// Get all expense categories
exports.getAllExpenseCategories = async (req, res) => {
  try {
    const categories = await ExpenseCategory.find({ active: true }) // Only active categories
      .select("name code active createdAt updatedAt")
      .sort({ name: 1 }); // Sort alphabetically by name

    return res.status(200).json({
      success: true,
      message: "Expense categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving expense categories",
      errors: [error.message],
    });
  }
};

// Create a new expense category
exports.createExpenseCategory = async (req, res) => {
  try {
    // Validate request body with createExpenseSchema
    const { error, value } = createExpenseSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const { name, code, active } = value;

    // Check for existing name or code
    const existingName = await ExpenseCategory.findOne({ name });
    if (existingName) {
      return res.status(409).json({
        success: false,
        message: "Expense category with this name already exists",
        errors: ["Duplicate name"],
      });
    }

    const existingCode = await ExpenseCategory.findOne({ code });
    if (existingCode) {
      return res.status(409).json({
        success: false,
        message: "Expense category with this code already exists",
        errors: ["Duplicate code"],
      });
    }

    // Create new category
    const newCategory = new ExpenseCategory({
      name,
      code,
      active: active !== undefined ? active : true, // Default to true if not provided
    });

    await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Expense category created successfully",
      data: newCategory,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error while creating expense category",
      errors: [error.message],
    });
  }
};

// Update an existing expense category
exports.updateExpenseCategory = async (req, res) => {
  try {
    // Validate request body with updateExpenseSchema
    const { error, value } = updateExpenseSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const { id } = req.params;
    const { name, code, active } = value;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
        errors: ["ID must be a valid ObjectId"],
      });
    }

    // Find existing category
    const category = await ExpenseCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Expense category not found",
        errors: ["Category does not exist"],
      });
    }

    // Check for duplicate name or code if updated
    if (name && name !== category.name) {
      const existingName = await ExpenseCategory.findOne({ name });
      if (existingName) {
        return res.status(409).json({
          success: false,
          message: "Another category with this name already exists",
          errors: ["Duplicate name"],
        });
      }
    }

    if (code && code !== category.code) {
      const existingCode = await ExpenseCategory.findOne({ code });
      if (existingCode) {
        return res.status(409).json({
          success: false,
          message: "Another category with this code already exists",
          errors: ["Duplicate code"],
        });
      }
    }

    // Update fields (only if provided)
    if (name) category.name = name;
    if (code) category.code = code;
    if (active !== undefined) category.active = active;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Expense category updated successfully",
      data: category,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error while updating expense category",
      errors: [error.message],
    });
  }
};

// Delete an expense category (soft delete by setting active: false)
exports.deleteExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
        errors: ["ID must be a valid ObjectId"],
      });
    }

    // Find and soft delete
    const category = await ExpenseCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Expense category not found",
        errors: ["Category does not exist"],
      });
    }

    if (!category.active) {
      return res.status(400).json({
        success: false,
        message: "Expense category is already inactive",
        errors: ["Category already deleted"],
      });
    }

    category.active = false;
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Expense category deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting expense category",
      errors: [error.message],
    });
  }
};
