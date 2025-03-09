const Joi = require("joi");
// authentication validation goes here
exports.signupSchema = Joi.object({
  fullName: Joi.string()
    .min(5) // Adjust based on your minimum length requirement
    .max(100) // Adjust based on your maximum length requirement
    .required(),
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")), // Corrected regex for digit
  phoneNumber: Joi.string()
    .min(10) // Adjust based on expected length
    .max(15) // Adjust based on expected length
    .required()
    .pattern(new RegExp("^[0-9]+$")) // Ensures only numbers
    .message("Phone number must only contain digits"),
  roles: Joi.array().items(Joi.string()).optional().default(["user"]),
});

exports.signinSchema = Joi.object({
  emailOrPhone: Joi.alternatives()
    .try(
      Joi.string().email({
        tlds: { allow: ["com", "net"] },
      }),
      Joi.string().regex(/^\d{8,15}$/) // Adjust this regex to match your phone number format
    )
    .required(),
  password: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});

exports.acceptCodeSchema = Joi.object({
  email: Joi.string()
    .email({
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  providedCode: Joi.string().length(6).required(),
});

exports.changePasswordSchema = Joi.object({
  newPassword: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$")),
  oldPassword: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$")),
});

exports.acceptFPCodeSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Token is required",
    "any.required": "Token is required",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 8 characters long",
    "any.required": "New password is required",
  }),
});

exports.updateProfileSchema = Joi.object({
  fullName: Joi.string().min(5).max(100).optional(),
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net"] } })
    .optional(),
  phoneNumber: Joi.string()
    .regex(/^\d{11}$/)
    .optional(),
});

exports.updateImageSchema = Joi.object({
  profileImage: Joi.object()
    .keys({
      filename: Joi.string().required(),
      mimetype: Joi.string()
        .valid("image/jpeg", "image/png", "image/gif")
        .required(),
      size: Joi.number()
        .max(5 * 1024 * 1024)
        .required(),
      fieldname: Joi.string().valid("profileImage").optional(),
      originalname: Joi.string().required(), // Add this line
    })
    .optional(),
});

exports.updateUserSchema = Joi.object({
  fullName: Joi.string().min(5).max(100).optional().messages({
    "string.min": "Full name must be at least 5 characters long",
    "string.max": "Full name cannot exceed 100 characters",
  }),
  email: Joi.string().email({ tlds: { allow: ["com", "net"] } }),
  phoneNumber: Joi.string()
    .min(10)
    .max(15)
    .pattern(/^[0-9]+$/),
  status: Joi.string().valid("active", "suspended", "deleted"),
  roles: Joi.array().items(Joi.string().hex().length(24)).required(),
  _id: Joi.string().hex().length(24).optional(), // Allow but don’t require
}).min(1); // At least one field must be provided

// roles validation goes here
exports.createRoleSchema = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .min(4)
    .max(50) // Assuming a reasonable max length for role names
    .lowercase()
    .messages({
      "string.base": "Role name must be a string",
      "string.empty": "Role name cannot be empty",
      "string.min": "Role name should have at least 4 characters",
      "string.max": "Role name should not exceed 50 characters",
      "any.required": "Role name is required",
    }),
  permissions: Joi.array().items(Joi.string()).required(),
});

exports.updateRoleSchema = Joi.object({
  name: Joi.string().trim().min(4).max(50).lowercase().messages({
    "string.base": "Role name must be a string",
    "string.empty": "Role name cannot be empty",
    "string.min": "Role name should have at least 4 characters",
    "string.max": "Role name should not exceed 50 characters",
  }),
  permissions: Joi.array().items(Joi.string()),
}).min(1); // This ensures at least one key is present in the object

// Permission Schemas

exports.createPermissionSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(3)
    .pattern(/^[a-z]+:[a-z*]+$/i) // Allow "action:resource" or "action:*"
    .messages({
      "string.pattern.base":
        "Permission name must follow 'action:resource' format (e.g., 'read:users') or 'action:*' (e.g., 'void:*')",
      "string.min": "Permission name must be at least 3 characters",
      "any.required": "Permission name is required",
    }),
  description: Joi.string().optional().allow("").default(""),
});

exports.updatePermissionSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .pattern(/^[a-z]+:[a-z*]+$/i) // Allow "action:resource" or "action:*"
    .messages({
      "string.pattern.base":
        "Permission name must follow 'action:resource' format (e.g., 'read:users') or 'action:*' (e.g., 'void:*')",
      "string.min": "Permission name must be at least 3 characters",
    }),
  description: Joi.string().optional().allow(""),
}).or("name", "description");

// exports.updateRoleSchema = Joi.object({
//   name: Joi.string()
//     .required()
//     .trim()
//     .min(4)
//     .max(50) // Adjust based on your needs for role name length
//     .lowercase()
//     .messages({
//       "string.base": "Role name must be a string",
//       "string.empty": "Role name cannot be empty",
//       "string.min": "Role name should have at least 4 characters",
//       "string.max": "Role name should not exceed 50 characters",
//       "any.required": "Role name is required",
//     }),
// });
// category validation goes here
exports.createCategorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.base": "Category name must be a string",
    "string.min": "Category name should have at least {#limit} characters",
    "string.max": "Category name should not exceed {#limit} characters",
    "string.empty": "Category name is required",
    "any.required": "Category name is required",
  }),
});

exports.updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).messages({
    "string.base": "Category name must be a string",
    "string.min": "Category name should have at least {#limit} characters",
    "string.max": "Category name should not exceed {#limit} characters",
  }),
});
// dish validation goes here

exports.createDishSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().trim().max(200),
  price: Joi.number().positive().required(),
  category: Joi.string().hex().length(24).required(), // Assuming MongoDB ObjectId format
});

exports.updateDishSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100),
  description: Joi.string().trim().max(200),
  price: Joi.number().positive(),
  category: Joi.string().hex().length(24),
});

// sales validation goes here
exports.createSaleSchema = Joi.object({
  dish: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).required(),
  unitPrice: Joi.number().positive().required(),
  totalAmount: Joi.number().positive().required(),
  paymentType: Joi.string().hex().length(24).required(),
});

exports.updateSaleSchema = Joi.object({
  dish: Joi.string().hex().length(24),
  quantity: Joi.number().integer().min(1),
  unitPrice: Joi.number().positive(),
  totalAmount: Joi.number().positive(),
  paymentType: Joi.string().hex().length(24),
});
// payment method type validation goes here
exports.createPaymentMethodSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
});

exports.updatePaymentMethodSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
}).or("name");

// Schema for creating a new dish
exports.createDishSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().max(500),
  price: Joi.number().positive().required(),
  categoryName: Joi.string().required(), // Assuming category name should be validated for existence
});

// Schema for updating an existing dish
exports.updateDishSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().max(500),
  price: Joi.number().positive(),
  category: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  categoryName: Joi.string(), // Add this line for accepting category by name
}).or("name", "description", "price", "category", "categoryName");

exports.createSaleSchema = Joi.object({
  paymentMethod: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

// ... other schemas
exports.addSaleItemSchema = Joi.object({
  dish: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  quantity: Joi.number().integer().positive().required(),
});

exports.updateSaleSchema = Joi.object({
  paymentMethod: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  totalAmount: Joi.number().positive(),
  discount: Joi.number().min(0).max(100),
}).or("paymentMethod", "totalAmount"); // At least one field must be present for an update

// exports.createHallTransactionSchema = Joi.object({
//   // transactionId is auto-generated, so don't validate it here
//   hall: Joi.array()
//     .items(
//       Joi.object({
//         name: Joi.string().required(),
//         qty: Joi.number().integer().positive().required(),
//         price: Joi.number().positive().required(),
//       })
//     )
//     .required(),
//   // hall: Joi.object({
//   //   _id: Joi.string()
//   //     .regex(/^[0-9a-fA-F]{24}$/)
//   //     .required(),
//   //   name: Joi.string().required(),
//   //   price: Joi.number().positive().required(),
//   // }).required(),
//   customerName: Joi.string().required(),
//   contactPhone: Joi.string(),
//   eventType: Joi.string()
//     .valid("conference", "workshop", "webinar", "Wedding")
//     .required(),
//   startTime: Joi.date().required(),
//   endTime: Joi.date().greater(Joi.ref("startTime")).required(),
//   price: Joi.number().positive().required(),
//   discount: Joi.number().min(0).max(100),
//   totalAmount: Joi.number().positive().required(),
//   paymentMethod: Joi.string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required(),
//   paymentStatus: Joi.string()
//     .valid("Paid", "Pending", "Cancelled", "Refund")
//     .required(),
//   notes: Joi.string(),
//   totalAmount: Joi.number().min(0),
//   staffInvolved: Joi.string().allow(""),
// });
exports.createHallTransactionSchema = Joi.object({
  // transactionId is auto-generated, so don't validate it here
  halls: Joi.array() // Changed from 'hall' to 'halls' to indicate multiple halls
    .items(
      Joi.object({
        hallId: Joi.string() // Assuming hallId is a string representation of ObjectId
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        name: Joi.string().required(),
        qty: Joi.number().integer().positive().required(),
        price: Joi.number().positive().required(),
      })
    )
    .required(),
  customerName: Joi.string().required(),
  contactPhone: Joi.string().allow("", null), // Added 'null' for optional fields
  eventType: Joi.string()
    .valid("conference", "workshop", "webinar", "Wedding")
    .required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().greater(Joi.ref("startTime")).required(),
  discount: Joi.number().min(0).max(100).optional(), // Optional but with constraints if provided

  // Remove 'totalAmount' as it's repeated, keep only one if necessary
  //totalAmount: Joi.number().positive().required(),

  paymentMethod: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  paymentStatus: Joi.string()
    .valid("Paid", "Pending", "Cancelled", "Refund")
    .required(),
  notes: Joi.string().allow("", null), // Allow empty string or null for optional fields
  staffInvolved: Joi.string().allow("", null), // Same here for optional field
});

exports.updateHallTransactionSchema = Joi.object({
  customerName: Joi.string(),
  contactPhone: Joi.string(),
  eventType: Joi.string().valid("conference", "workshop", "webinar", "Wedding"),
  startTime: Joi.date(),
  endTime: Joi.date(),
  discount: Joi.number().min(0).max(100).optional(),
  paymentMethod: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  halls: Joi.array()
    .items(
      Joi.object({
        hallId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        name: Joi.string().required(),
        qty: Joi.number().integer().positive().required(),
        price: Joi.number().positive().required(),
      })
    )
    .optional(),
  paymentStatus: Joi.string().valid("Paid", "Pending", "Cancelled", "Refund"),
  notes: Joi.string(),
  totalAmount: Joi.number().min(0),
});
// .or(
//   "customerName",
//   "contactPhone",
//   "eventType",
//   "startTime",
//   "endTime",
//   "discount",
//   "paymentMethod",
//   "paymentStatus",
//   "notes",
//   "halls"
//   "staffInvolved",
//   "totalAmount"
// );

exports.createHallTypesSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(50).messages({
    "string.base": "Hall name must be a string",
    "string.empty": "Hall name cannot be empty",
    "string.min": "Hall name should have at least 3 characters",
    "string.max": "Hall name should not exceed 50 characters",
    "any.required": "Hall name is required",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be positive",
    "any.required": "Price is required",
  }),
});

exports.updateHallTypeSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).messages({
    "string.base": "Hall name must be a string",
    "string.empty": "Hall name cannot be empty",
    "string.min": "Hall name should have at least 3 characters",
    "string.max": "Hall name should not exceed 50 characters",
  }),
  price: Joi.number().positive().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be positive",
  }),
}).min(1); // Ensure at least one field is provided for update

exports.createUnifiedSaleSchema = Joi.object({
  saleType: Joi.string().valid("restaurant", "minimart").required(),
  paymentMethod: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  totalAmount: Joi.number().positive().required(),
});

exports.addSaleItemSchema = Joi.object({
  item: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  quantity: Joi.number().integer().positive().required(),
  itemType: Joi.string().valid("Dish", "Product").required(),
});

exports.updateUnifiedSaleSchema = Joi.object({
  saleType: Joi.string().valid("restaurant", "minimart"),
  paymentMethod: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  totalAmount: Joi.number().positive(),
  items: Joi.array().items(
    Joi.object({
      item: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      quantity: Joi.number().integer().positive().required(),
      priceAtSale: Joi.number().positive().required(),
      itemType: Joi.string().valid("Dish", "Product").required(),
    })
  ),
}).or("saleType", "paymentMethod", "totalAmount", "items");

exports.createLaundrySchema = Joi.object({
  customer: Joi.string().required(),
  receiptNo: Joi.string().required(),
  discount: Joi.number().min(0).default(0),
  status: Joi.string()
    .valid("Paid", "Pending", "Cancelled")
    .default("Pending")
    .messages({
      "string.base": "Status must be a string.",
      "any.only": "Status must be one of Paid, Pending, or Cancelled.",
    }),
  services: Joi.array()
    .items(
      Joi.object({
        qty: Joi.number().min(1).required(),
        unitPrice: Joi.number().positive().required(),
        serviceType: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
  paymentMethod: Joi.string().required(), // Assuming ObjectId is sent as a string
  phoneNo: Joi.string().required(),
});

exports.updateLaundrySchema = Joi.object({
  customer: Joi.string(),
  receiptNo: Joi.string(),
  phoneNo: Joi.string(),
  paymentMethod: Joi.string(),
  discount: Joi.number().min(0).max(100), // Discount in percentage
  status: Joi.string()
    .valid("Paid", "Pending", "Cancelled")
    .default("Pending")
    .messages({
      "string.base": "Status must be a string.",
      "any.only": "Status must be one of Paid, Pending, or Cancelled.",
    }),
  services: Joi.array().items(
    Joi.object({
      serviceType: Joi.string().required(), // Reference to LaundryService
      qty: Joi.number().min(1).required(),
      unitPrice: Joi.number().min(0).required(),
    })
  ),
});

exports.LaundryServiceSchema = Joi.object({
  price: Joi.number().positive().required(),
  serviceType: Joi.string().required(),
});

exports.updateLaundryServiceSchema = Joi.object({
  serviceType: Joi.string().min(3).max(100),
  price: Joi.number().min(0),
}).min(1);

// Validator for Order Item (Food/Drinks)
exports.createOrderItemSchema = Joi.object({
  itemName: Joi.string().min(3).required().messages({
    "string.base": "Item name must be a string",
    "string.min": "Item name must have at least 3 characters",
    "any.required": "Item name is required",
  }),
  unitPrice: Joi.number().positive().required().messages({
    "number.base": "Unit price must be a number",
    "number.positive": "Unit price must be a positive number",
    "any.required": "Unit price is required",
  }),
});

exports.updateOrderItemSchema = Joi.object({
  _id: Joi.string().required().messages({
    "string.base": "_id must be a string",
    "any.required": "_id is required for updates",
  }),
  itemName: Joi.string().optional(), // Item name is optional in case the item is not being updated
  //qty: Joi.number().min(1).optional(), // Quantity should be a positive number (optional)
  unitPrice: Joi.number().min(0).optional(), // Price should be a non-negative number (optional)
}).min(1);

exports.createSeminarSchema = Joi.object({
  organizationName: Joi.string().required(),
  contactPhone: Joi.string().required(),
  seminarDate: Joi.date().required(),
  orderItems: Joi.array()
    .items(
      Joi.object({
        itemName: Joi.string().required(),
        qty: Joi.number().integer().positive().required(),
        unitPrice: Joi.number().positive().required(),
      })
    )
    .required(),
  address: Joi.string().required(),
  eventType: Joi.string()
    .valid("conference", "workshop", "webinar", "Wedding")
    .default("conference"), // Updated to match schema
  paymentMethod: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  status: Joi.string()
    .valid("Pending", "Paid", "Cancelled", "Refund")
    .default("Pending"), // Updated to match schema
  additionalNotes: Joi.string(),
  totalAmount: Joi.number().min(0), // If you want to enforce or validate this field
  discount: Joi.number().min(0).default(0),
  salesBy: Joi.string().allow(""), // Updated to allow empty string as per schema
});

exports.updateSeminarSchema = Joi.object({
  organizationName: Joi.string(),
  contactPhone: Joi.string(),
  seminarDate: Joi.date(),
  orderItems: Joi.array().items(
    Joi.object({
      itemName: Joi.string(),
      qty: Joi.number().integer().positive(),
      unitPrice: Joi.number().positive(),
    })
  ),
  discount: Joi.number().min(0), // Updated to allow empty string as per schema
  address: Joi.string(),
  eventType: Joi.string().valid("conference", "workshop", "webinar", "Wedding"),
  //paymentMethod: Joi.string(), // Changed from string enum to ObjectId validation
  paymentMethod: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  status: Joi.string().valid("Pending", "Paid", "Cancelled", "Refund"),
  additionalNotes: Joi.string(),
  totalAmount: Joi.number().min(0), // If you want to enforce or validate this field
}).or(
  "organizationName",
  "contactPhone",
  "seminarDate",
  "orderItems",
  "discount",
  "address",
  "eventType",
  "paymentMethod",
  "status",
  "additionalNotes",
  "totalAmount"
); // At least one field must be provided for an update

// Create Kabasa Schema
exports.createKabasaSchema = Joi.object({
  orderItems: Joi.array()
    .items(
      Joi.object({
        itemName: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(), // Now an ObjectId string
        qty: Joi.number().integer().positive().required(),
        unitPrice: Joi.number().positive().required(),
      })
    )
    .required(),
  discount: Joi.number().min(0).default(0).messages({
    "number.base": "Discount must be a number.",
    "number.min": "Discount cannot be less than 0.",
  }),
  status: Joi.string()
    .valid("Paid", "Pending", "Cancelled")
    .default("Pending")
    .messages({
      "string.base": "Status must be a string.",
      "any.only": "Status must be one of Paid, Pending, or Cancelled.",
    }),
  paymentMethod: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  additionalNotes: Joi.string().allow(null, "").messages({
    "string.base": "Additional notes must be a string.",
  }),
});

exports.updateKabasaSchema = Joi.object({
  // orderItems: Joi.array()
  //   .items(
  //     Joi.object({
  //       itemName: Joi.string()
  //         .regex(/^[0-9a-fA-F]{24}$/)
  //         .required(), // Now an ObjectId string
  //       qty: Joi.number().required(),
  //       unitPrice: Joi.number().optional(), // Optional since we're fetching it from OrderItem
  //     })
  //   )
  //   .optional(),
  orderItems: Joi.array()
    .items(
      Joi.object({
        itemId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        itemName: Joi.string().required(), // For display, not for validation against pattern
        qty: Joi.number().required(),
        unitPrice: Joi.number().optional(),
      })
    )
    .optional(),
  discount: Joi.number().min(0).optional().messages({
    "number.base": "Discount must be a number.",
    "number.min": "Discount cannot be less than 0.",
  }),
  status: Joi.string()
    .valid("Paid", "Pending", "Cancelled")
    .optional()
    .messages({
      "string.base": "Status must be a string.",
      "any.only": "Status must be one of Paid, Pending, or Cancelled.",
    }),
  paymentMethod: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  additionalNotes: Joi.string().allow(null, "").optional().messages({
    "string.base": "Additional notes must be a string.",
  }),
  isVoided: Joi.boolean().optional(),
  totalAmount: Joi.number().optional(),
});

exports.createFrontOfficeSaleSchema = Joi.object({
  date: Joi.date().required().label("Sale Date"),
  amount: Joi.number().required().label("Sale Amount"),
  assignedPersonnel: Joi.string().optional().label("Assigned Personnel"),
  notes: Joi.string().optional().max(500).label("Notes").messages({
    "string.max": '"Notes" cannot exceed 500 characters',
  }),
});

exports.updateFrontOfficeSaleSchema = Joi.object({
  date: Joi.date().optional().label("Sale Date"), // Add date if it's updatable
  amount: Joi.number().optional().label("amount"),
  assignedPersonnel: Joi.string().optional().label("Assigned Personnel"),
  notes: Joi.string().optional().max(500).label("Notes").messages({
    "string.max": '"Notes" cannot exceed 500 characters',
  }),
}).or("amount", "assignedPersonnel", "date", "notes"); // Ensure the .or() matches the schema

exports.createSupplierSchema = Joi.object({
  address: Joi.string().optional().allow("").messages({
    "string.base": "Address should be a type of 'text'",
  }),
  contactPhone: Joi.string().required().messages({
    "string.base": "Contact Phone should be a type of 'text'",
    "string.empty": "Contact Phone cannot be an empty field",
    "any.required": "Contact Phone is a required field",
  }),
  contactEmail: Joi.string().email().optional().allow("").messages({
    "string.base": "Contact Email should be a type of 'text'",
    "string.email": "Contact Email must be a valid email",
  }),
  contactPerson: Joi.string().required().messages({
    "string.base": "Contact Person should be a type of 'text'",
    "string.empty": "Contact Person cannot be an empty field",
    "any.required": "Contact Person is a required field",
  }),
});

exports.updateSupplierSchema = Joi.object({
  address: Joi.string().optional().allow("").messages({
    "string.base": "Address should be a type of 'text'",
  }),
  contactPhone: Joi.string().optional().messages({
    "string.base": "Contact Phone should be a type of 'text'",
  }),
  contactEmail: Joi.string().email().optional().allow("").messages({
    "string.base": "Contact Email should be a type of 'text'",
    "string.email": "Contact Email must be a valid email",
  }),
  contactPerson: Joi.string().optional().messages({
    "string.base": "Contact Person should be a type of 'text'",
  }),
});

exports.createInventoryValidator = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.min": '"name" must be at least {#limit} characters long',
    "any.required": '"name" is required',
  }),

  description: Joi.string().allow(""), // Allow empty string as per schema default

  price: Joi.number().required().messages({
    "any.required": '"price" is required',
  }),

  category: Joi.object({
    _id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
    name: Joi.string().required(),
  })
    .required()
    .messages({
      "any.required": '"category" is required',
    }),

  stockQuantity: Joi.number().required().messages({
    "any.required": '"stockQuantity" is required',
  }),

  supplier: Joi.object({
    _id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
    contactPerson: Joi.string().required(),
  })
    .required()
    .messages({
      "any.required": '"supplier" is required',
    }),

  expiryDate: Joi.date()
    .iso()
    .min("now")
    .allow(null) // Since in your schema expiryDate can be null or not set
    .messages({
      "date.min": "Expiry date cannot be in the past!",
    }),

  imageUrl: Joi.string().uri().allow(""), // Allow empty string as per schema default

  reorderLevel: Joi.number().required().messages({
    "any.required": '"reorderLevel" is required',
  }),

  reorderQuantity: Joi.number().required().messages({
    "any.required": '"reorderQuantity" is required',
  }),

  locationName: Joi.object({
    _id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
    name: Joi.string().required(),
  })
    .required()
    .messages({
      "any.required": '"locationName" is required',
    }),

  unit: Joi.string().required().messages({
    "any.required": '"unit" is required',
  }),
  isPerishable: Joi.boolean().default(false),

  lastRestocked: Joi.date().iso().allow(null), // Since in your schema lastRestocked can be null or not set
});

exports.updateProductSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Name should be a type of 'text'",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Description should be a type of 'text'",
  }),
  price: Joi.number().optional().positive().messages({
    "number.base": "Price should be a type of 'number'",
    "number.positive": "Price must be a positive number",
  }),
  category: Joi.string().optional().messages({
    "string.base": "Category should be a type of 'string'",
  }),
  // location: Joi.array()
  //   .items(
  //     Joi.object({
  //       locations: Joi.string().required(), // Assuming 'locations' is the ID of a Location document
  //       name: Joi.string().required(),
  //     })
  //   )
  //   .required(),
  stockQuantity: Joi.number().optional().integer().positive().messages({
    "number.base": "Stock Quantity should be a type of 'number'",
    "number.integer": "Stock Quantity must be an integer",
    "number.positive": "Stock Quantity must be a positive number",
  }),
  supplier: Joi.string().optional().messages({
    "string.base": "Supplier should be a type of 'string'",
  }),
  expiryDate: Joi.date().optional().allow("").messages({
    "date.base": "Expiry Date should be a valid date",
  }),
  imageUrl: Joi.string().optional().allow("").messages({
    "string.base": "Image URL should be a type of 'text'",
  }),
  reorderLevel: Joi.number().optional().integer().positive().messages({
    "number.base": "Reorder Level should be a type of 'number'",
    "number.integer": "Reorder Level must be an integer",
    "number.positive": "Reorder Level must be a positive number",
  }),
  reorderQuantity: Joi.number().optional().integer().positive().messages({
    "number.base": "Reorder Quantity should be a type of 'number'",
    "number.integer": "Reorder Quantity must be an integer",
    "number.positive": "Reorder Quantity must be a positive number",
  }),
  unit: Joi.string().optional().messages({
    "string.base": "Unit should be a type of 'string'",
  }),
  isPerishable: Joi.boolean().optional().messages({
    "boolean.base": "isPerishable should be a type of 'boolean'",
  }),
  lastRestocked: Joi.date().optional().allow("").messages({
    "date.base": "Last Restocked should be a valid date",
  }),
});

// exports.updateProductSchema = Joi.object({
//   name: Joi.string().optional().messages({
//     "string.base": "Name should be a type of 'text'",
//   }),
//   description: Joi.string().optional().allow("").messages({
//     "string.base": "Description should be a type of 'text'",
//   }),
//   price: Joi.number().optional().positive().messages({
//     "number.base": "Price should be a type of 'number'",
//     "number.positive": "Price must be a positive number",
//   }),
//   category: Joi.string().optional().messages({
//     "string.base": "Category should be a type of 'string'",
//   }),
//   stockQuantity: Joi.number().optional().integer().positive().messages({
//     "number.base": "Stock Quantity should be a type of 'number'",
//     "number.integer": "Stock Quantity must be an integer",
//     "number.positive": "Stock Quantity must be a positive number",
//   }),
//   // barcode: Joi.string().optional().allow("").messages({
//   //   "string.base": "Barcode should be a type of 'text'",
//   // }),
//   supplier: Joi.string().optional().allow("").messages({
//     "string.base": "Supplier should be a type of 'string'",
//   }),
//   expiryDate: Joi.date().optional().allow("").messages({
//     "date.base": "Expiry Date should be a valid date",
//   }),
//   imageUrl: Joi.string().optional().allow("").messages({
//     "string.base": "Image URL should be a type of 'text'",
//   }),
// });

exports.createSalesUnifiedSchema = Joi.object({
  saleType: Joi.string().valid("restaurant", "minimart").required(),
  paymentMethod: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  discount: Joi.number().min(0).max(100).default(0),
  totalAmount: Joi.number().positive().required(),
  dishItems: Joi.array().items(
    Joi.object({
      item: Joi.string().required(),
      quantity: Joi.number().required(),
      priceAtSale: Joi.number().required(),
      subTotal: Joi.number().required(),
    })
  ),
  productItems: Joi.array().items(
    Joi.object({
      item: Joi.string().required(),
      quantity: Joi.number().required(),
      priceAtSale: Joi.number().required(),
      subTotal: Joi.number().required(),
    })
  ),
});

exports.addSaleItemSchema = Joi.object({
  item: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  quantity: Joi.number().integer().positive().required(),
  itemType: Joi.string().valid("Dish", "Product").required(),
});

exports.updateSalesUnifiedSchema = Joi.object({
  saleType: Joi.string().valid("restaurant", "minimart"),
  paymentMethod: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  totalAmount: Joi.number().positive(),
  discount: Joi.number().min(0).max(100).default(0),
  items: Joi.array().items(
    Joi.object({
      item: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      quantity: Joi.number().integer().positive().required(),
      priceAtSale: Joi.number().positive().required(),
      itemType: Joi.string().valid("Dish", "Product").required(),
    })
  ),
}).or("saleType", "paymentMethod", "totalAmount", "items", "discount");

exports.createAlertSchema = Joi.object({
  type: Joi.string().valid("lowStock", "nearExpiry", "other").required(),
  message: Joi.string().required(),
  action: Joi.string().required(),
  data: Joi.object().required(), // You can be more specific about the 'data' object structure if needed
  //user: Joi.string().required(), // Require the user ID (as a string, since it will be a string in req.body)
  read: Joi.boolean().default(false), // Allow and set a default
  status: Joi.string().valid("active", "archived").default("active"), // Allow, set default, and restrict values
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().default(Date.now),
});

exports.updateAlertSchema = Joi.object({
  type: Joi.string().valid("lowStock", "nearExpiry", "other").optional(),
  message: Joi.string().optional(),
  action: Joi.string().optional(),
  data: Joi.object().optional(), // Again, you can be more specific with the 'data' structure
  user: Joi.string().forbidden(), // Prevent updates to the 'user' field
  read: Joi.boolean().optional(),
  status: Joi.string().valid("active", "archived").optional(),
  createdAt: Joi.date().forbidden(),
  updatedAt: Joi.date().optional(),
});

const validTypes = ["Issue", "Return", "Adjustment"];

const validReasons = ["Damage", "Theft", "Expiry", "Error", "Other"];
const validReferenceTypes = [
  "SaleTransaction",
  "Laundry",
  "HallTransaction",
  "FrontOfficeSale",
  "Seminar",
  null,
]; // Removed "Kabasa"
const validStatuses = ["Pending", "Approved", "Rejected"];

// createInventoryAdjustmentSchema.js
exports.createInventoryAdjustmentSchema = Joi.object({
  product: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  type: Joi.string().valid("Issue", "Return", "Adjustment").required(),
  adjustmentReason: Joi.string()
    .valid("Damage", "Theft", "Expiry", "Error", "Other")
    .required(),
  changeInQuantity: Joi.number().integer().required(),
  previousQuantity: Joi.number().integer().min(0).required(),
  newQuantity: Joi.number().integer().min(0).required(),
  adjustmentCost: Joi.number().default(0),
  reason: Joi.string().allow(""),
  status: Joi.string()
    .valid("Pending", "Approved", "Cancelled")
    .default("Pending"),
  approvedBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null),
  adjustmentLocation: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null),
  transactionDate: Joi.date().iso().allow(null),
});

// updateInventoryAdjustmentSchema.js
exports.updateInventoryAdjustmentSchema = Joi.object({
  product: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  type: Joi.string().valid("Issue", "Return", "Adjustment"),
  adjustmentReason: Joi.string().valid(
    "Damage",
    "Theft",
    "Expiry",
    "Error",
    "Other"
  ),
  changeInQuantity: Joi.number().integer(),
  previousQuantity: Joi.number().integer().min(0),
  newQuantity: Joi.number().integer().min(0),
  adjustmentCost: Joi.number(),
  reason: Joi.string().allow(""),
  status: Joi.string().valid("Pending", "Approved", "Cancelled"),
  approvedBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null),
  adjustmentLocation: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null),
  transactionDate: Joi.date().iso().allow(null),
}).min(1);

// Ensure at least one field is being updated

// exports.updatePurchaseOrderSchema = Joi.object({
//   expectedDelivery: Joi.date().iso().allow(null).messages({
//     "date.base": "Expected delivery date must be a valid date.",
//   }),
//   items: Joi.array()
//     .items(
//       Joi.object({
//         inventory: Joi.string()
//           .pattern(/^[0-9a-fA-F]{24}$/)
//           .required()
//           .messages({
//             "any.required": '"inventory" is required for each item',
//             "string.pattern.base": '"inventory" must be a valid ObjectId',
//           }),
//         quantityOrdered: Joi.number().integer().min(1).required().messages({
//           "any.required": '"quantityOrdered" is required for each item',
//           "number.base": '"quantityOrdered" must be a number',
//           "number.integer": '"quantityOrdered" must be an integer',
//           "number.min": '"quantityOrdered" must be at least 1',
//         }),
//         unitPrice: Joi.number().positive().required().messages({
//           "any.required": '"unitPrice" is required for each item',
//           "number.base": '"unitPrice" must be a number',
//           "number.positive": '"unitPrice" must be a positive number',
//         }),
//       })
//     )
//     .messages({
//       "array.base": '"items" must be an array',
//     }),
//   status: Joi.string()
//     .valid(...validStatuses)
//     .messages({
//       "string.only": '"status" must be one of ' + validStatuses.join(", "),
//     }),
// }).min(1); // Ensure at least one field is being updated
exports.updatePurchaseOrderSchema = Joi.object({
  supplier: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(), // Assuming supplier is an ObjectId
  orderDate: Joi.date().optional(),
  expectedDelivery: Joi.date().optional(),
  items: Joi.array()
    .items(
      Joi.object({
        inventory: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(), // Assuming inventory is an ObjectId
        quantityOrdered: Joi.number().integer().min(1).required(),
        unitPrice: Joi.number().min(0).required(),
      })
    )
    .optional(),
  status: Joi.string().valid("Pending", "Received", "Cancelled").optional(),
});

exports.createStockMovementSchema = Joi.object({
  inventory: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "any.required": '"inventory" is required',
      "string.pattern.base": '"inventory" must be a valid ObjectId',
    }),
  type: Joi.string()
    .valid(...validTypes)
    .required()
    .messages({
      "any.required": '"type" is required',
      "string.only": '"type" must be one of ' + validTypes.join(", "),
    }),
  quantity: Joi.number().integer().min(1).required().messages({
    "any.required": '"quantity" is required',
    "number.base": '"quantity" must be a number',
    "number.integer": '"quantity" must be an integer',
    "number.min": '"quantity" must be at least 1',
  }),
  fromLocation: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow("")
    .messages({
      "string.pattern.base": '"fromLocation" must be a valid ObjectId',
    }),
  toLocation: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow("")
    .messages({
      "string.pattern.base": '"toLocation" must be a valid ObjectId',
    }),
  reason: Joi.string().allow(""),
  // staff: Joi.string()
  //   .pattern(/^[0-9a-fA-F]{24}$/)
  //   .required()
  //   .messages({
  //     "any.required": '"staff" is required',
  //     "string.pattern.base": '"staff" must be a valid ObjectId',
  //   }),
  transactionDate: Joi.date().iso().allow(null),
});

exports.updateStockMovementSchema = Joi.object({
  inventory: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": '"inventory" must be a valid ObjectId',
    }),
  type: Joi.string()
    .valid(...validTypes)
    .messages({
      "string.only": '"type" must be one of ' + validTypes.join(", "),
    }),
  quantity: Joi.number().integer().min(1).messages({
    "number.base": '"quantity" must be a number',
    "number.integer": '"quantity" must be an integer',
    "number.min": '"quantity" must be at least 1',
  }),
  fromLocation: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow("")
    .messages({
      "string.pattern.base": '"fromLocation" must be a valid ObjectId',
    }),
  toLocation: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow("")
    .messages({
      "string.pattern.base": '"toLocation" must be a valid ObjectId',
    }),
  reason: Joi.string().allow(""),
  // staff: Joi.string()
  //   .pattern(/^[0-9a-fA-F]{24}$/)
  //   .messages({
  //     "string.pattern.base": '"staff" must be a valid ObjectId',
  //   }),
  transactionDate: Joi.date().iso().allow(null),
}).min(1); // Ensure at least one field is being updated

exports.createInventorySchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.min": '"name" must be at least {#limit} characters long',
    "any.required": '"name" is required',
  }),

  description: Joi.string().allow("").default(""), // Matches schema default

  costPrice: Joi.number().min(0).required().messages({
    "number.min": '"costPrice" must be a non-negative number',
    "any.required": '"costPrice" is required',
  }),

  sellingPrice: Joi.number().min(0).required().messages({
    "number.min": '"sellingPrice" must be a non-negative number',
    "any.required": '"sellingPrice" is required',
  }),

  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "any.required": '"category" is required',
      "string.pattern.base": '"category" must be a valid ObjectId',
    }),

  stockQuantity: Joi.number().integer().min(0).required().messages({
    "number.integer": '"stockQuantity" must be an integer',
    "number.min": '"stockQuantity" must be at least 0',
    "any.required": '"stockQuantity" is required',
  }),

  supplier: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "any.required": '"supplier" is required',
      "string.pattern.base": '"supplier" must be a valid ObjectId',
    }),

  batches: Joi.array()
    .items(
      Joi.object({
        batchNumber: Joi.string().required().messages({
          "any.required": '"batchNumber" is required in each batch',
        }),
        quantity: Joi.number().integer().min(0).required().messages({
          "number.integer": '"quantity" in batch must be an integer',
          "number.min": '"quantity" in batch must be at least 0',
          "any.required": '"quantity" is required in each batch',
        }),
        expiryDate: Joi.date()
          .iso()
          .min("now")
          .when(Joi.ref("....isPerishable"), {
            is: true,
            then: Joi.required(),
            otherwise: Joi.optional().allow(null),
          })
          .messages({
            "date.min": '"expiryDate" in batch cannot be in the past',
            "any.required": '"expiryDate" is required for perishable items',
          }),
        receivedDate: Joi.date().iso().default(Date.now).messages({
          "date.iso": '"receivedDate" must be in ISO 8601 format',
        }),
      })
    )
    .when("isPerishable", {
      is: true,
      then: Joi.array().min(1).required(),
      otherwise: Joi.array().default([]),
    })
    .messages({
      "array.min":
        '"batches" must contain at least one item for perishable products',
      "any.required": '"batches" is required for perishable items',
    }),

  imageUrl: Joi.string()
    .uri()
    .allow("")
    .default("/utils/images/default.png")
    .messages({
      "string.uri": '"imageUrl" must be a valid URI or empty',
    }),

  reorderLevel: Joi.number().integer().min(0).required().messages({
    "number.integer": '"reorderLevel" must be an integer',
    "number.min": '"reorderLevel" must be at least 0',
    "any.required": '"reorderLevel" is required',
  }),

  reorderQuantity: Joi.number().integer().min(0).required().messages({
    "number.integer": '"reorderQuantity" must be an integer',
    "number.min": '"reorderQuantity" must be at least 0',
    "any.required": '"reorderQuantity" is required',
  }),

  locationName: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "any.required": '"locationName" is required',
      "string.pattern.base": '"locationName" must be a valid ObjectId',
    }),

  unit: Joi.string().required().messages({
    "any.required": '"unit" is required',
  }),

  isPerishable: Joi.boolean().default(false),

  lastRestocked: Joi.date().iso().allow(null).default(Date.now).messages({
    "date.iso": '"lastRestocked" must be in ISO 8601 format',
  }),

  isActive: Joi.boolean().default(true),
});

exports.updateInventorySchema = Joi.object({
  name: Joi.string().min(3).messages({
    "string.min": '"name" must be at least {#limit} characters long',
  }),

  description: Joi.string().allow(""),

  costPrice: Joi.number().min(0).messages({
    "number.min": '"costPrice" must be a non-negative number',
  }),

  sellingPrice: Joi.number().min(0).messages({
    "number.min": '"sellingPrice" must be a non-negative number',
  }),

  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": '"category" must be a valid ObjectId',
    }),

  stockQuantity: Joi.number().integer().min(0).messages({
    "number.integer": '"stockQuantity" must be an integer',
    "number.min": '"stockQuantity" must be at least 0',
  }),

  supplier: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": '"supplier" must be a valid ObjectId',
    }),

  batches: Joi.array()
    .items(
      Joi.object({
        batchNumber: Joi.string().required().messages({
          "any.required": '"batchNumber" is required in each batch',
        }),
        quantity: Joi.number().integer().min(0).required().messages({
          "number.integer": '"quantity" in batch must be an integer',
          "number.min": '"quantity" in batch must be at least 0',
          "any.required": '"quantity" is required in each batch',
        }),
        expiryDate: Joi.date()
          .iso()
          .min("now")
          .when(Joi.ref("....isPerishable"), {
            is: true,
            then: Joi.required(),
            otherwise: Joi.optional().allow(null),
          })
          .messages({
            "date.min": '"expiryDate" in batch cannot be in the past',
            "any.required": '"expiryDate" is required for perishable items',
          }),
        receivedDate: Joi.date().iso().messages({
          "date.iso": '"receivedDate" must be in ISO 8601 format',
        }),
      })
    )
    .when("isPerishable", {
      is: true,
      then: Joi.array().min(1),
    })
    .messages({
      "array.min":
        '"batches" must contain at least one item for perishable products',
    }),

  imageUrl: Joi.string().uri().allow("").messages({
    "string.uri": '"imageUrl" must be a valid URI or empty',
  }),

  reorderLevel: Joi.number().integer().min(0).messages({
    "number.integer": '"reorderLevel" must be an integer',
    "number.min": '"reorderLevel" must be at least 0',
  }),

  reorderQuantity: Joi.number().integer().min(0).messages({
    "number.integer": '"reorderQuantity" must be an integer',
    "number.min": '"reorderQuantity" must be at least 0',
  }),

  locationName: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": '"locationName" must be a valid ObjectId',
    }),

  unit: Joi.string(),

  isPerishable: Joi.boolean(),

  lastRestocked: Joi.date().iso().allow(null).messages({
    "date.iso": '"lastRestocked" must be in ISO 8601 format',
  }),

  isActive: Joi.boolean(),
}).min(1); // Ensure at least one field is provided for update

exports.createDishSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
    "string.base": "Name must be a string",
  }),
  description: Joi.string().allow("").messages({
    "string.base": "Description must be a string",
  }),
  price: Joi.number().required().positive().messages({
    "any.required": "Price is required",
    "number.base": "Price must be a number",
    "number.positive": "Price must be a positive number",
  }),
  category: Joi.string().required(),
  ingredients: Joi.array()
    .items(
      Joi.object({
        inventoryItem: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        // Validates that it's a string of 24 hexadecimal characters, which is the format of a MongoDB ObjectId
        quantity: Joi.number().required(),
      })
    )
    .required(),
});

exports.updateDishSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": "Name must be a string",
  }),
  description: Joi.string().allow("").messages({
    "string.base": "Description must be a string",
  }),
  price: Joi.number().positive().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be a positive number",
  }),
  category: Joi.string().required(),
  ingredients: Joi.array()
    .items(
      Joi.object({
        inventoryItem: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        // Validates that it's a string of 24 hexadecimal characters, which is the format of a MongoDB ObjectId
        quantity: Joi.number().required(),
      })
    )
    .required(),
}).min(1);

exports.createSaleTransactionSchema = Joi.object({
  date: Joi.date().iso().default(new Date()),
  totalAmount: Joi.number().required().min(0),
  paymentMethod: Joi.string().hex().length(24).required(),
  saleType: Joi.string().valid("restaurant", "minimart", "kabasa").required(),
  items: Joi.array()
    .items(
      Joi.object({
        item: Joi.string().hex().length(24).required(),
        itemType: Joi.string()
          .valid("Dish", "Inventory", "OrderItem")
          .required(),
        quantity: Joi.number().required().min(1),
        priceAtSale: Joi.number().required().min(0),
      })
    )
    .required(),
  inventoryChanges: Joi.array()
    .items(
      Joi.object({
        inventoryId: Joi.string().hex().length(24).required(),
        quantityChange: Joi.number().required(),
      })
    )
    .required(),
  isVoided: Joi.boolean().default(false),
  discount: Joi.number().min(0).max(100).default(0),
  location: Joi.string().hex().length(24).required(),
});

exports.updateSaleTransactionSchema = Joi.object({
  // Most fields are optional on update
  date: Joi.date().iso(),
  totalAmount: Joi.number().min(0),
  paymentMethod: Joi.string().hex().length(24),
  saleType: Joi.string().valid("restaurant", "minimart", "kabasa"), // Added "kabasa"
  items: Joi.array().items(
    Joi.object({
      item: Joi.string().hex().length(24),
      itemType: Joi.string().valid("Dish", "Inventory", "OrderItem"), // Ensure this includes OrderItem
      quantity: Joi.number().min(1),
      priceAtSale: Joi.number().min(0),
    })
  ),
  inventoryChanges: Joi.array().items(
    Joi.object({
      inventoryId: Joi.string().hex().length(24),
      quantityChange: Joi.number(),
    })
  ),
  isVoided: Joi.boolean(),
  discount: Joi.number().min(0).max(100),
  location: Joi.string().hex().length(24),
}).min(1); // At least one field must be present for an update

exports.forgotPasswordSchema = Joi.object({
  //<-- Define the schema HERE
  email: Joi.string().email().required(),
});

function hmacProcess(value, secret) {
  return require("crypto")
    .createHmac("sha256", secret)
    .update(value)
    .digest("hex");
}
