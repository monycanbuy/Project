const mongoose = require("mongoose");
const Role = require("../models/roleModel");
const User = require("../models/userModel");
const hasPermission = async (userRoles, requiredPermission) => {
  const roles = await Role.find({ _id: { $in: userRoles } });
  return roles.some(
    (role) =>
      role.permissions.includes(requiredPermission) ||
      role.permissions.includes(`${requiredPermission.split(":")[0]}:*`)
  );
};

const authorize = (permission) => async (req, res, next) => {
  const user = await User.findById(req.user.userId).populate("roles");
  const userRoles = user.roles.map((role) => role._id);
  if (await hasPermission(userRoles, permission)) {
    return next();
  }
  return res.status(403).json({ success: false, message: "Unauthorized" });
};
