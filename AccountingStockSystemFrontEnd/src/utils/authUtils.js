export const hasPermission = (user, permission) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    //console.log("hasPermission: Invalid user or roles", { user });
    return false;
  }

  const hasPerm = user.roles.some((role) => {
    if (role.name === "admin") return true; // Admin wildcard
    if (Array.isArray(role.permissions)) {
      return (
        role.permissions.includes(permission) ||
        role.permissions.includes(`${permission.split(":")[0]}:*`) // Wildcard support
      );
    }
    return false;
  });

  return hasPerm;
};

export const getAuthorizedRoute = (user, isAuthenticated) => {
  if (!user || !isAuthenticated || !user.roles || !Array.isArray(user.roles)) {
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
    {
      permission: "read:profile",
      route: "/admin/profile",
    },
    {
      permission: "write:profile",
      route: "/admin/profile",
    },
    {
      permission: "update:profile",
      route: "/admin/profile",
    },
  ];

  if (user.roles.some((role) => (role.name || role) === "admin")) {
    return "/admin/users"; // Default for admin
  }

  for (const { permission, route } of permissionRoutes) {
    if (hasPermission(user, permission)) {
      return route;
    }
  }

  return "/admin/profile";
  //return "/unauthorized";
};
