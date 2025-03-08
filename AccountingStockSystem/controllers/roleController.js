// const Role = require("../models/roleModel"); // Adjust the path according to your project structure
// const {
//   createRoleSchema,
//   updateRoleSchema,
// } = require("../middlewares/validator"); // Adjust the path

// exports.getAllRoles = async (req, res) => {
//   try {
//     // Fetch roles with only _id and name, optimizing for performance and data privacy
//     const roles = await Role.find().select("_id name");
//     res.status(200).json({
//       success: true,
//       roles: roles.map((role) => ({
//         _id: role._id,
//         name: role.name,
//       })),
//     });
//   } catch (error) {
//     console.error("Error fetching roles:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching roles",
//       error: error.message, // Include the error message for better debugging
//     });
//   }
// };

// exports.createRole = async (req, res) => {
//   const { name } = req.body;

//   try {
//     const { error } = createRoleSchema.validate({ name });
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details[0].message,
//       });
//     }

//     // Check if the role already exists
//     const existingRole = await Role.findOne({ name: name.toLowerCase() });
//     if (existingRole) {
//       return res.status(409).json({
//         success: false,
//         message: "Role already exists",
//       });
//     }

//     // Create new role
//     const newRole = new Role({ name: name.toLowerCase() });
//     const savedRole = await newRole.save();

//     res.status(201).json({
//       success: true,
//       message: "Role created successfully",
//       role: savedRole,
//     });
//   } catch (error) {
//     console.error("Error creating role:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating role",
//     });
//   }
// };

// exports.updateRole = async (req, res) => {
//   const { roleId } = req.params;
//   const { name } = req.body;

//   try {
//     // Validate input
//     const { error } = updateRoleSchema.validate({ name });
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details.map((detail) => detail.message).join(", "),
//       });
//     }

//     const updatedRole = await Role.findByIdAndUpdate(
//       roleId,
//       { name: name.toLowerCase() },
//       { new: true, runValidators: true }
//     );
//     if (!updatedRole) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Role not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Role updated successfully",
//       role: updatedRole,
//     });
//   } catch (error) {
//     console.error("Error updating role:", error);
//     res.status(500).json({ success: false, message: "Error updating role" });
//   }
// };

// exports.deleteRole = async (req, res) => {
//   const { roleId } = req.params;

//   try {
//     const deletedRole = await Role.findByIdAndDelete(roleId);
//     if (!deletedRole) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Role not found" });
//     }

//     // Optionally, handle the removal of this role from all users if needed
//     // await User.updateMany({ roles: roleId }, { $pull: { roles: roleId } });

//     res.status(200).json({
//       success: true,
//       message: "Role deleted successfully",
//       role: deletedRole,
//     });
//   } catch (error) {
//     console.error("Error deleting role:", error);
//     res.status(500).json({ success: false, message: "Error deleting role" });
//   }
// };

// roleController.js
const Role = require("../models/roleModel");
const {
  createRoleSchema,
  updateRoleSchema,
} = require("../middlewares/validator");

exports.getAllRoles = async (req, res) => {
  try {
    // Fetch roles with _id, name, and permissions
    const roles = await Role.find().select("_id name permissions");
    res.status(200).json({
      success: true,
      roles: roles.map((role) => ({
        _id: role._id,
        name: role.name,
        permissions: role.permissions,
      })),
      message: "Roles fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching roles",
      error: error.message,
    });
  }
};

exports.createRole = async (req, res) => {
  const { name, permissions } = req.body;

  try {
    const { error } = createRoleSchema.validate({ name, permissions });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const existingRole = await Role.findOne({ name: name.toLowerCase() });
    if (existingRole) {
      return res.status(409).json({
        success: false,
        message: "Role already exists",
      });
    }

    const newRole = new Role({
      name: name.toLowerCase(),
      permissions: permissions || [], // Default to empty if not provided
    });
    const savedRole = await newRole.save();

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      role: savedRole,
    });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({
      success: false,
      message: "Error creating role",
      error: error.message,
    });
  }
};

exports.updateRole = async (req, res) => {
  const { roleId } = req.params;
  const { name, permissions } = req.body;

  try {
    // Update validation schema to include permissions
    const { error } = updateRoleSchema.validate({ name, permissions });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    const updateData = {};
    if (name) updateData.name = name.toLowerCase();
    if (permissions) updateData.permissions = permissions;

    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedRole) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      role: updatedRole,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({
      success: false,
      message: "Error updating role",
      error: error.message,
    });
  }
};

exports.deleteRole = async (req, res) => {
  const { roleId } = req.params;

  try {
    const deletedRole = await Role.findByIdAndDelete(roleId);
    if (!deletedRole) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Optionally remove role from users (uncomment if needed)
    // await User.updateMany({ roles: roleId }, { $pull: { roles: roleId } });

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
      role: deletedRole,
    });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting role",
      error: error.message,
    });
  }
};

exports.getPermissions = async (req, res) => {
  try {
    const roles = await Role.find({}, "permissions");
    const permissions = [...new Set(roles.flatMap((role) => role.permissions))];
    res.status(200).json({
      success: true,
      permissions,
      message: "Permissions fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching permissions" });
  }
};
