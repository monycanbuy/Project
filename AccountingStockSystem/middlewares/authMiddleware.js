// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
// const Role = require("../models/roleModel");

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
//       );
//       if (!user || user.status !== "active" || user.isLocked) {
//         return res
//           .status(403)
//           .json({ success: false, message: "Unauthorized: Access denied" });
//       }
//       req.user = {
//         userId: user._id.toString(),
//         fullName: user.fullName,
//         email: user.email,
//         verified: user.verified,
//         status: user.status,
//         roles: user.roles.map((role) => ({
//           name: role.name,
//           permissions: role.permissions,
//         })),
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

// exports.hasPermission = (userRoles, requiredPermission) => {
//   return userRoles.some(
//     (role) =>
//       role.permissions.includes(requiredPermission) ||
//       role.permissions.includes(`${requiredPermission.split(":")[0]}:*`)
//   );
// };

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

const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Ensure this is imported

// exports.authenticateUser = async (req, res, next) => {
//   console.log("Middleware - Path:", req.path);
//   console.log("Cookies received:", req.cookies);
//   console.log("Headers:", req.headers);

//   const authHeader = req.headers["authorization"];
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     const token = authHeader.split(" ")[1];
//     try {
//       const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
//       const user = await User.findById(decoded.userId).populate(
//         "roles",
//         "name permissions"
//       );
//       if (!user || user.status !== "active" || user.isLocked) {
//         return res
//           .status(403)
//           .json({ success: false, message: "Unauthorized: Access denied" });
//       }
//       req.user = {
//         userId: user._id.toString(),
//         fullName: user.fullName,
//         email: user.email,
//         verified: user.verified,
//         status: user.status,
//         roles: user.roles.map((role) => ({
//           name: role.name,
//           permissions: role.permissions,
//         })),
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
//       message: "Unauthorized: No token provided in Authorization header",
//     });
//   }
// };
exports.authenticateUser = async (req, res, next) => {
  console.log("Middleware - Path:", req.path);
  console.log("Cookies received:", req.cookies);
  console.log("Headers:", req.headers);

  let token;
  const authCookie = req.cookies?.Authorization; // Primary source in production
  const authHeader = req.headers["authorization"]; // Fallback for testing/Swagger

  // Prioritize cookie-based auth (for frontend)
  if (authCookie && authCookie.startsWith("Bearer ")) {
    token = authCookie.split(" ")[1];
  } else if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message:
        "Unauthorized: No token provided in cookie or Authorization header",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.userId)
      .select("+status +isLocked") // Ensure these fields are included
      .populate("roles", "name permissions");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.status !== "active" || user.isLocked) {
      return res.status(403).json({
        success: false,
        message: `Unauthorized: Account is ${
          user.isLocked ? "locked" : "inactive"
        }`,
      });
    }

    req.user = {
      userId: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      verified: user.verified,
      status: user.status,
      roles: user.roles.map((role) => ({
        name: role.name,
        permissions: role.permissions || [],
      })),
    };

    console.log("User authenticated:", req.user);
    next();
  } catch (error) {
    console.error("Token verification error:", error.name, error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token has expired",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
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
