// hallTypesController.js

const Hall = require("../models/hallTypesModel");
const {
  createHallTypesSchema,
  updateHallTypeSchema,
} = require("../middlewares/validator");
const Joi = require("joi");

exports.getAllHallTypes = async (req, res) => {
  try {
    const hallTypes = await Hall.find().select("name price"); // Retrieve both name and price fields
    res.status(200).json({
      success: true,
      halls: hallTypes, // Changed to 'halls' to reflect the model name
    });
  } catch (error) {
    console.error("Error fetching hall types:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hall types",
    });
  }
};

exports.createHallType = async (req, res) => {
  const { name, price } = req.body;

  try {
    // Validate the incoming request body using the schema
    const { error } = createHallTypesSchema.validate({ name, price });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    // Check if the hall name already exists (if you want to ensure uniqueness)
    const existingHall = await Hall.findOne({ name: name.toLowerCase() });
    if (existingHall) {
      return res.status(409).json({
        success: false,
        message: "Hall name already exists",
      });
    }

    // Create new hall
    const newHall = new Hall({
      name: name.toLowerCase(),
      price: price,
    });
    const savedHall = await newHall.save();

    res.status(201).json({
      success: true,
      message: "Hall created successfully",
      hall: savedHall,
    });
  } catch (error) {
    console.error("Error creating hall:", error);
    res.status(500).json({
      success: false,
      message: "Error creating hall",
    });
  }
};

exports.updateHallType = async (req, res) => {
  const { hallId } = req.params;
  const { name, price } = req.body;

  try {
    // Validate input
    const { error } = updateHallTypeSchema.validate({ name, price });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    const updateData = {
      name: name ? name.trim().toLowerCase() : undefined,
      price: price !== undefined ? price : undefined,
    };

    // Remove any undefined fields from updateData to prevent overwriting existing values with undefined
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedHall = await Hall.findByIdAndUpdate(hallId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedHall) {
      return res
        .status(404)
        .json({ success: false, message: "Hall not found" });
    }

    res.status(200).json({
      success: true,
      message: "Hall updated successfully",
      hall: updatedHall,
    });
  } catch (error) {
    console.error("Error updating hall:", error);
    res.status(500).json({ success: false, message: "Error updating hall" });
  }
};

exports.deleteHallType = async (req, res) => {
  const { hallId } = req.params;

  try {
    const deletedHall = await Hall.findByIdAndDelete(hallId);
    if (!deletedHall) {
      return res
        .status(404)
        .json({ success: false, message: "Hall not found" });
    }

    // Here you might want to handle any references to this hall type in transactions or other models

    res.status(200).json({
      success: true,
      message: "Hall type deleted successfully",
      hall: deletedHall,
    });
  } catch (error) {
    console.error("Error deleting hall type:", error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting hall type" });
  }
};
