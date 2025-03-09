const Supplier = require("../models/supplierModel");
const {
  createSupplierSchema,
  updateSupplierSchema,
} = require("../middlewares/validator");

// Get all suppliers
exports.getSuppliers = async (req, res) => {
  try {
    // Populate staffInvolved to get the user's full name
    const suppliers = await Supplier.find()
      .populate("staffInvolved", "fullName") // Only fetch 'fullName' from the User model
      .select(
        "address contactPhone contactEmail contactPerson staffInvolved createdAt"
      ); // Include fields you want to return

    res.status(200).json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching suppliers",
      error: error.message,
    });
  }
};

// Create a new supplier
// Create a new supplier
exports.createSupplier = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createSupplierSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { address, contactPhone, contactEmail, contactPerson } = value;

    const newSupplier = await Supplier.create({
      address,
      contactPhone,
      contactEmail,
      contactPerson,
      staffInvolved: req.user.userId,
      //staffInvolved: [req.user.fullName], // Dynamically set staffInvolved to the user who created the supplier
    });

    res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: newSupplier,
    });
  } catch (error) {
    console.error("Error creating supplier:", error);
    res.status(500).json({
      success: false,
      message: "Error creating supplier",
    });
  }
};

// Update an existing supplier
exports.updateSupplier = async (req, res) => {
  const { error } = updateSupplierSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: updatedSupplier,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating supplier",
      error: error.message,
    });
  }
};

// Delete a supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
      data: deletedSupplier,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting supplier",
      error: error.message,
    });
  }
};
