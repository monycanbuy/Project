// exports.authenticateUser = async (req, res, next) => {
//   console.log("Middleware - Path:", req.path);
//   console.log("Cookies received:", req.cookies);
//   console.log("Headers:", req.headers);
//   if (req.cookies && req.cookies.Authorization) {
//     const token = req.cookies.Authorization.split(" ")[1];
//     try {
//       const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
//       const user = await User.findById(decoded.userId).populate(
//         "roles",
//         "name"
//       );
//       if (!user || user.status !== "active" || user.isLocked) {
//         return res
//           .status(403)
//           .json({ success: false, message: "Unauthorized: Access denied" });
//       }
//       req.user = {
//         id: user._id.toString(),
//         fullName: user.fullName,
//         email: user.email,
//         verified: user.verified,
//         status: user.status,
//         roles: user.roles.map((role) => role.name),
//       };
//       console.log("User authenticated:", req.user);
//       next();
//     } catch (error) {
//       console.error("Token verification error:", error);
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized: Invalid token" });
//     }
//   } else {
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized: No token provided in cookies",
//     });
//   }
// };

// authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Role = require("../models/roleModel");

// Existing authentication middleware
// exports.authenticateUser = async (req, res, next) => {
//   console.log("Middleware - Path:", req.path);
//   console.log("Cookies received:", req.cookies);
//   console.log("Headers:", req.headers);

//   const token = req.cookies.token; // Standardize to 'token'
//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized: No token provided in cookies",
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
//     const user = await User.findById(decoded.userId).populate(
//       "roles",
//       "name permissions"
//     );
//     if (!user || user.status !== "active" || user.isLocked) {
//       return res
//         .status(403)
//         .json({ success: false, message: "Unauthorized: Access denied" });
//     }
//     req.user = {
//       userId: user._id.toString(),
//       fullName: user.fullName,
//       email: user.email,
//       verified: user.verified,
//       status: user.status,
//       roles: user.roles.map((role) => ({
//         name: role.name,
//         permissions: role.permissions,
//       })),
//     };
//     console.log("User authenticated:", req.user);
//     next();
//   } catch (error) {
//     console.error("Token verification error:", error);
//     return res
//       .status(401)
//       .json({ success: false, message: "Unauthorized: Invalid token" });
//   }
// };
// exports.authenticateUser = async (req, res, next) => {
//   console.log("Middleware - Path:", req.path);
//   console.log("Cookies received:", req.cookies);
//   console.log("Headers:", req.headers);
//   if (req.cookies && req.cookies.Authorization) {
//     const token = req.cookies.Authorization.split(" ")[1];
//     try {
//       const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
//       const user = await User.findById(decoded.userId).populate(
//         "roles",
//         "name permissions"
//       ); // Include permissions
//       if (!user || user.status !== "active" || user.isLocked) {
//         return res
//           .status(403)
//           .json({ success: false, message: "Unauthorized: Access denied" });
//       }
//       req.user = {
//         userId: user._id.toString(), // Renamed id to userId for clarity
//         fullName: user.fullName,
//         email: user.email,
//         verified: user.verified,
//         status: user.status,
//         roles: user.roles.map((role) => ({
//           name: role.name,
//           permissions: role.permissions,
//         })), // Include permissions
//       };
//       console.log("User authenticated:", req.user);
//       next();
//     } catch (error) {
//       console.error("Token verification error:", error);
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized: Invalid token" });
//     }
//   } else {
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized: No token provided in cookies",
//     });
//   }
// };

// // Check if user has a specific permission
// exports.hasPermission = (userRoles, requiredPermission) => {
//   return userRoles.some(
//     (role) =>
//       role.permissions.includes(requiredPermission) ||
//       role.permissions.includes(`${requiredPermission.split(":")[0]}:*`) // Wildcard support
//   );
// };

// // Authorization middleware
// exports.authorize = (permission) => async (req, res, next) => {
//   try {
//     if (!req.user || !req.user.userId) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Authentication required" });
//     }
//     if (exports.hasPermission(req.user.roles, permission)) {
//       return next();
//     }
//     return res.status(403).json({
//       success: false,
//       message: "Unauthorized: Insufficient permissions",
//     });
//   } catch (error) {
//     console.error("Authorization error:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Server error during authorization" });
//   }
// };

// // module.exports = { authenticateUser, hasPermission, authorize };

exports.authenticateUser = async (req, res, next) => {
  console.log("Middleware - Path:", req.path);
  console.log("Cookies received:", req.cookies);
  console.log("Headers:", req.headers);
  if (req.cookies && req.cookies.Authorization) {
    const token = req.cookies.Authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      const user = await User.findById(decoded.userId).populate(
        "roles",
        "name permissions"
      );
      if (!user || user.status !== "active" || user.isLocked) {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized: Access denied" });
      }
      req.user = {
        userId: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        verified: user.verified,
        status: user.status,
        roles: user.roles.map((role) => ({
          name: role.name,
          permissions: role.permissions,
        })),
      };
      console.log("User authenticated:", req.user);
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid token" });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided in cookies",
    });
  }
};

exports.hasPermission = (userRoles, requiredPermission) => {
  return userRoles.some(
    (role) =>
      role.permissions.includes(requiredPermission) ||
      role.permissions.includes(`${requiredPermission.split(":")[0]}:*`)
  );
};

exports.authorize = (permission) => async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }
    if (exports.hasPermission(req.user.roles, permission)) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: "Unauthorized: Insufficient permissions",
    });
  } catch (error) {
    console.error("Authorization error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during authorization" });
  }
};
