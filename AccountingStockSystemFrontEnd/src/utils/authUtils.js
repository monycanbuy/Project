// // authUtils.js
// export const hasPermission = (user, permission) => {
//   if (!user || !user.roles || !Array.isArray(user.roles)) return false;
//   return user.roles.some((role) => {
//     if (typeof role === "string") {
//       return role === "admin"; // Assume 'admin' has all permissions
//     }
//     return (
//       role.permissions &&
//       Array.isArray(role.permissions) &&
//       role.permissions.includes(permission)
//     );
//   });
// };

// // Pass isAuthenticated explicitly to avoid relying on user.isAuthenticated
// export const getAuthorizedRoute = (user, isAuthenticated) => {
//   if (!user || !isAuthenticated || !user.roles || !Array.isArray(user.roles)) {
//     return "/login";
//   }
//   if (user.roles.includes("admin")) return "/admin/users"; // Direct check for 'admin'
//   if (hasPermission(user, "read:users")) return "/admin/users";
//   if (hasPermission(user, "read:roles")) return "/admin/roles";
//   return "/unauthorized";
// };

// authUtils.js
// export const hasPermission = (user, permission) => {
//   if (!user || !user.roles || !Array.isArray(user.roles)) return false;
//   return user.roles.some((role) => {
//     if (typeof role === "string") {
//       return role === "admin"; // 'admin' has all permissions
//     }
//     return (
//       role.permissions &&
//       Array.isArray(role.permissions) &&
//       role.permissions.includes(permission)
//     );
//   });
// };
// export const hasPermission = (user, permission) => {
//   if (!user || !user.roles || !Array.isArray(user.roles)) return false;
//   console.log(
//     "Can read dashboard?",
//     user.roles[0].permissions.includes("read:dashboard")
//   );
//   return user.roles.some((role) => {
//     if (typeof role === "string") {
//       return role === "admin"; // Admin has all permissions
//     }
//     // Ensure role.permissions exists and is an array
//     return (
//       role.permissions &&
//       Array.isArray(role.permissions) &&
//       role.permissions.includes(permission)
//     );
//   });
// };

// export const getAuthorizedRoute = (user, isAuthenticated) => {
//   if (!user || !isAuthenticated || !user.roles || !Array.isArray(user.roles)) {
//     console.log("Redirecting to /login: invalid user or auth state", {
//       user,
//       isAuthenticated,
//     });
//     return "/login";
//   }

//   // Define permission-to-route mapping
//   const permissionRoutes = [
//     { permission: "read:users", route: "/admin/users" },
//     { permission: "read:roles", route: "/admin/roles" },
//     { permission: "read:dashboard", route: "/admin/dashboard" }, // Example additional permission
//     { permission: "read:daily", route: "/admin/dashboard" }, // Default for daily sales
//     { permission: "read:dailyreport", route: "/admin/dashboard" },
//     { permission: "read:paymentmethodsreport", route: "/admin/dashboard" },
//     { permission: "read:totalrevenue", route: "/admin/dashboard" },
//     { permission: "read:monthlysales", route: "/admin/dashboard" },
//     { permission: "read:dailysalesalltime", route: "/admin/dashboard" },
//     { permission: "read:alltimetotal", route: "/admin/dashboard" },
//     { permission: "read:auditlogs", route: "/admin/audit-logs" },
//     { permission: "read:purchaseorders", route: "/admin/purchase-order" },
//     { permission: "write:purchaseorders", route: "/admin/purchase-order" },
//     { permission: "read:purchaseorders", route: "/admin/purchase-order" },
//     { permission: "read:inventory", route: "/admin/inventory" },
//     { permission: "write:purchaseorders", route: "/admin/inventory" },
//     { permission: "update:purchaseorders", route: "/admin/inventory" },
//     { permission: "delete:purchaseorders", route: "/admin/inventory" },
//     { permission: "read:alerts", route: "/admin/alerts" },
//     { permission: "create:alerts", route: "/admin/alerts" },
//     { permission: "update:alerts", route: "/admin/alerts" },
//     { permission: "delete:alerts", route: "/admin/alerts" },
//     { permission: "read:categories", route: "/admin/category" },
//     { permission: "write:categories", route: "/admin/category" },
//     { permission: "update:categories", route: "/admin/category" },
//     { permission: "delete:categories", route: "/admin/category" },
//     { permission: "update:frontoffice", route: "/admin/front-office" },
//     { permission: "read:frontoffice", route: "/admin/front-office" },
//     { permission: "write:frontoffice", route: "/admin/front-office" },
//     { permission: "write:hall", route: "/admin/hall" },
//     { permission: "read:hall", route: "/admin/hall" },
//     { permission: "update:hall", route: "/admin/hall" },
//     { permission: "delete:hall", route: "/admin/hall" },
//     // Add more mappings as needed: { permission: "read:inventory", route: "/admin/inventory" }
//   ];

//   // Check for 'admin' role first (string or object)
//   if (user.roles.some((role) => role === "admin" || role.name === "admin")) {
//     console.log("Redirecting to /admin/users: admin role found");
//     return "/admin/users"; // Default for admin
//   }

//   // Find the first matching permission
//   for (const { permission, route } of permissionRoutes) {
//     if (hasPermission(user, permission)) {
//       console.log(`Redirecting to ${route}: ${permission} permission found`);
//       return route;
//     }
//   }

//   console.log("Redirecting to /unauthorized: no matching permissions");
//   return "/unauthorized";
// };

// export const getAuthorizedRoute = (user, isAuthenticated) => {
//   if (!user || !isAuthenticated || !user.roles || !Array.isArray(user.roles)) {
//     console.log("Redirecting to /login: invalid user or auth state", {
//       user,
//       isAuthenticated,
//     });
//     return "/login";
//   }

//   // Define permission-to-route mapping
//   const permissionRoutes = [
//     { permission: "read:users", route: "/admin/users" },
//     { permission: "read:roles", route: "/admin/roles" },
//     { permission: "read:dashboard", route: "/admin/dashboard" }, // Example additional permission
//     { permission: "read:daily", route: "/admin/dashboard" }, // Default for daily sales
//     { permission: "read:dailyreport", route: "/admin/dashboard" },
//     { permission: "read:paymentmethodsreport", route: "/admin/dashboard" },
//     { permission: "read:totalrevenue", route: "/admin/dashboard" },
//     { permission: "read:monthlysales", route: "/admin/dashboard" },
//     { permission: "read:dailysalesalltime", route: "/admin/dashboard" },
//     { permission: "read:alltimetotal", route: "/admin/dashboard" },
//     // Add more mappings as needed: { permission: "read:inventory", route: "/admin/inventory" }
//   ];

//   // Check for 'admin' role first (string or object)
//   if (user.roles.some((role) => role === "admin" || role.name === "admin")) {
//     console.log("Redirecting to /admin/users: admin role found");
//     return "/admin/users"; // Default for admin
//   }

//   // Find the first matching permission
//   for (const { permission, route } of permissionRoutes) {
//     if (hasPermission(user, permission)) {
//       console.log(`Redirecting to ${route}: ${permission} permission found`);
//       return route;
//     }
//   }

//   console.log("Redirecting to /unauthorized: no matching permissions");
//   return "/unauthorized";
// };

export const hasPermission = (user, permission) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    console.log("hasPermission: Invalid user or roles", { user });
    return false;
  }

  const hasPerm = user.roles.some((role) => {
    if (role.name && Array.isArray(role.permissions)) {
      if (role.name === "admin") return true; // Admin gets all permissions
      return role.permissions.includes(permission);
    }
    if (typeof role === "string") {
      return role === "admin";
    }
    return false;
  });

  console.log(`Checking permission '${permission}' for user:`, {
    roles: user.roles,
    result: hasPerm,
  });
  return hasPerm;
};

export const getAuthorizedRoute = (user, isAuthenticated) => {
  if (!user || !isAuthenticated || !user.roles || !Array.isArray(user.roles)) {
    console.log("Redirecting to /login: invalid user or auth state", {
      user,
      isAuthenticated,
    });
    return "/login";
  }

  const permissionRoutes = [
    { permission: "read:users", route: "/admin/users" }, // First match for accountant
    { permission: "write:users", route: "/admin/users" },
    { permission: "update:users", route: "/admin/users" },
    { permission: "delete:users", route: "/admin/users" },
    { permission: "read:roles", route: "/admin/roles" },
    { permission: "write:roles", route: "/admin/roles" },
    { permission: "update:roles", route: "/admin/roles" },
    { permission: "delete:roles", route: "/admin/roles" },
    { permission: "read:permissions", route: "/admin/roles" },
    { permission: "write:permissions", route: "/admin/roles" },
    { permission: "update:permissions", route: "/admin/roles" },
    { permission: "delete:permissions", route: "/admin/roles" },
    { permission: "read:dashboard", route: "/admin/dashboard" },
    { permission: "read:auditlogs", route: "/admin/audit-logs" },
    { permission: "read:purchaseorders", route: "/admin/purchase-order" }, // Matches accountant
    { permission: "update:purchaseorders", route: "/admin/purchase-order" },
    { permission: "read:inventory", route: "/admin/inventory" }, // Matches accountant
    { permission: "write:inventory", route: "/admin/inventory" },
    { permission: "update:inventory", route: "/admin/inventory" },
    { permission: "delete:purchaseorders", route: "/admin/inventory" },
    { permission: "read:alerts", route: "/admin/alerts" },
    { permission: "create:alerts", route: "/admin/alerts" },
    { permission: "update:alerts", route: "/admin/alerts" },
    { permission: "delete:alerts", route: "/admin/alerts" },
    { permission: "read:categories", route: "/admin/category" },
    { permission: "write:categories", route: "/admin/category" },
    { permission: "update:categories", route: "/admin/category" },
    { permission: "delete:categories", route: "/admin/category" },
    { permission: "update:frontoffice", route: "/admin/front-office" },
    { permission: "read:frontoffice", route: "/admin/front-office" },
    { permission: "write:frontoffice", route: "/admin/front-office" },
    { permission: "write:hall", route: "/admin/hall" },
    { permission: "read:hall", route: "/admin/hall" },
    { permission: "update:hall", route: "/admin/hall" },
    { permission: "delete:hall", route: "/admin/hall" },
    { permission: "read:halltypes", route: "/admin/hall-types" },
    { permission: "write:halltypes", route: "/admin/hall-types" },
    { permission: "update:halltypes", route: "/admin/hall-types" },
    { permission: "delete:halltypes", route: "/admin/hall-types" },
    { permission: "read:paymentmethod", route: "/admin/payment-methods" },
    { permission: "write:paymentmethod", route: "/admin/payment-methods" },
    { permission: "update:paymentmethod", route: "/admin/payment-methods" },
    { permission: "delete:paymentmethod", route: "/admin/payment-methods" },
    { permission: "read:dishes", route: "/admin/dishes" },
    { permission: "write:dishes", route: "/admin/dishes" },
    { permission: "update:dishes", route: "/admin/dishes" },
    { permission: "delete:dishes", route: "/admin/dishes" },
    { permission: "read:kabsa", route: "/admin/kabsa" },
    { permission: "write:kabsa", route: "/admin/kabsa" },
    { permission: "update:kabsa", route: "/admin/kabsa" },
    { permission: "void:kabsa", route: "/admin/kabsa" },
    { permission: "read:laundryService", route: "/admin/laundryservice" },
    { permission: "write:laundryService", route: "/admin/laundryservice" },
    { permission: "update:laundryService", route: "/admin/laundryservice" },
    { permission: "delete:laundryService", route: "/admin/laundryservice" },
    { permission: "read:laundries", route: "/admin/laundries" },
    { permission: "write:laundries", route: "/admin/laundries" },
    { permission: "update:laundries", route: "/admin/laundries" },
    { permission: "void:laundries", route: "/admin/laundries" },
    { permission: "read:orderitems", route: "/admin/orderitem" },
    { permission: "write:orderitems", route: "/admin/orderitem" },
    { permission: "update:orderitems", route: "/admin/orderitem" },
    { permission: "delete:orderitems", route: "/admin/orderitem" },
    { permission: "read:seminars", route: "/admin/seminar" },
    { permission: "write:seminars", route: "/admin/seminar" },
    { permission: "update:seminars", route: "/admin/seminar" },
    { permission: "void:seminars", route: "/admin/seminar" },
    { permission: "read:stockMovement", route: "/admin/stock-movement" },
    { permission: "write:stockMovement", route: "/admin/stock-movement" },
    { permission: "update:stockMovement", route: "/admin/stock-movement" },
    { permission: "delete:stockMovement", route: "/admin/stock-movement" },
    {
      permission: "read:inventoryAdjustment",
      route: "/admin/inventory-adjustment",
    },
    {
      permission: "write:inventoryAdjustment",
      route: "/admin/inventory-adjustment",
    },
    {
      permission: "update:inventoryAdjustment",
      route: "/admin/inventory-adjustment",
    },
    {
      permission: "delete:inventoryAdjustment",
      route: "/admin/inventory-adjustment",
    },
    {
      permission: "read:salestransactions",
      route: "/admin/unified-transaction",
    },
    {
      permission: "write:salestransactions",
      route: "/admin/unified-transaction",
    },
    {
      permission: "update:salestransactions",
      route: "/admin/unified-transaction",
    },
    {
      permission: "void:salestransactions",
      route: "/admin/unified-transaction",
    },
    {
      permission: "read:dashboard",
      route: "/admin/dashboard",
    },
    { permission: "read:locations", route: "/admin/locations" },
    { permission: "write:locations", route: "/admin/locations" },
    { permission: "update:locations", route: "/admin/locations" },
    { permission: "delete:locations", route: "/admin/locations" },
    { permission: "read:suppliers", route: "/admin/suppliers" },
    { permission: "write:suppliers", route: "/admin/suppliers" },
    { permission: "update:suppliers", route: "/admin/suppliers" },
    { permission: "delete:suppliers", route: "/admin/suppliers" },
    {
      permission: "read:salestransactions",
      route: "/admin/unified-transaction",
    },
    {
      permission: "write:salestransactions",
      route: "/admin/unified-transaction",
    },
    {
      permission: "update:salestransactions",
      route: "/admin/unified-transaction",
    },
    {
      permission: "void:salestransactions",
      route: "/admin/unified-transaction",
    },
  ];

  if (user.roles.some((role) => (role.name || role) === "admin")) {
    console.log("Redirecting to /admin/users: admin role found");
    return "/admin/users"; // Default for admin
  }

  for (const { permission, route } of permissionRoutes) {
    if (hasPermission(user, permission)) {
      console.log(`Redirecting to ${route}: ${permission} permission found`);
      return route;
    }
  }

  console.log("Redirecting to /unauthorized: no matching permissions");
  return "/unauthorized";
};
