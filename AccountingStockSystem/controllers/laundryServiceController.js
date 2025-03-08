// controllers/laundryServiceController.js
const LaundryService = require("../models/laundryServiceModel");
const {
  LaundryServiceSchema,
  updateLaundryServiceSchema,
} = require("../middlewares/validator");

// Get all Laundry Services
exports.getAllLaundryServices = async (req, res) => {
  try {
    const laundryServices = await LaundryService.find();
    res.status(200).json({
      success: true,
      data: laundryServices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching laundry services",
    });
  }
};

// Create a new Laundry Service
exports.createLaundryService = async (req, res) => {
  // Validate the request body using the imported schema
  const { error } = LaundryServiceSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details, // Return the detailed validation error
    });
  }

  try {
    const { serviceType, price } = req.body;

    // Create new Laundry Service object (assuming you are using a model to save to DB)
    const newLaundryService = new LaundryService({
      serviceType,
      price,
    });

    // Save to the database
    await newLaundryService.save();

    // Respond with success message
    res.status(201).json({
      success: true,
      message: "Laundry service created successfully",
      data: newLaundryService,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating laundry service",
    });
  }
};

// Update an existing Laundry Service
exports.updateLaundryService = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL
    const { error, value } = updateLaundryServiceSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details,
      });
    }

    const updatedService = await LaundryService.findByIdAndUpdate(
      id,
      { $set: value }, // Only update provided fields
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Laundry service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedService,
      message: "Laundry service updated successfully",
    });
  } catch (error) {
    console.error("Error updating laundry service:", error);
    res.status(500).json({
      success: false,
      message: "Error updating laundry service: " + error.message,
    });
  }
};

// Delete an existing Laundry Service
exports.deleteLaundryService = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the laundry service by ID and delete it
    const deletedLaundryService = await LaundryService.findByIdAndDelete(id);

    // If service not found
    if (!deletedLaundryService) {
      return res.status(404).json({
        success: false,
        message: "Laundry service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Laundry service deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting laundry service",
    });
  }
};
