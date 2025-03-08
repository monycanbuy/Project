// permissionController.js
const Permission = require("../models/permissionModel");
const Role = require("../models/roleModel");
const {
  createPermissionSchema,
  updatePermissionSchema,
} = require("../middlewares/validator");

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().select("name description");
    res.status(200).json({
      success: true,
      permissions: permissions.map((perm) => ({
        _id: perm._id,
        name: perm.name,
        description: perm.description,
      })),
      message: "Permissions fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching permissions",
      error: error.message,
    });
  }
};

exports.createPermission = async (req, res) => {
  const { name, description } = req.body;

  try {
    const { error } = createPermissionSchema.validate({ name, description });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Check if permission already exists
    const existingPermission = await Permission.findOne({
      name: name.toLowerCase(),
    });
    if (existingPermission) {
      return res.status(409).json({
        success: false,
        message: "Permission already exists",
      });
    }

    // Create new permission
    const newPermission = new Permission({
      name: name.toLowerCase(),
      description: description || "",
    });
    const savedPermission = await newPermission.save();

    res.status(201).json({
      success: true,
      message: "Permission created successfully",
      permission: savedPermission,
    });
  } catch (error) {
    console.error("Error creating permission:", error);
    res.status(500).json({
      success: false,
      message: "Error creating permission",
      error: error.message,
    });
  }
};

exports.updatePermission = async (req, res) => {
  const { permissionId } = req.params;
  const { name, description } = req.body;

  try {
    const { error } = updatePermissionSchema.validate({ name, description });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const updateData = {};
    if (name) updateData.name = name.toLowerCase();
    if (description !== undefined) updateData.description = description;

    const updatedPermission = await Permission.findByIdAndUpdate(
      permissionId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedPermission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Permission updated successfully",
      permission: updatedPermission,
    });
  } catch (error) {
    console.error("Error updating permission:", error);
    res.status(500).json({
      success: false,
      message: "Error updating permission",
      error: error.message,
    });
  }
};

exports.deletePermission = async (req, res) => {
  const { permissionId } = req.params;

  try {
    // Find and delete the permission
    const deletedPermission = await Permission.findByIdAndDelete(permissionId);
    if (!deletedPermission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    // Optional: Remove the permission from all roles that reference it
    await Role.updateMany(
      { permissions: deletedPermission.name },
      { $pull: { permissions: deletedPermission.name } }
    );

    res.status(200).json({
      success: true,
      message: "Permission deleted successfully",
      permission: {
        _id: deletedPermission._id,
        name: deletedPermission.name,
        description: deletedPermission.description,
      },
    });
  } catch (error) {
    console.error("Error deleting permission:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting permission",
      error: error.message,
    });
  }
};
