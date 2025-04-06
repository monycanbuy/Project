// const swaggerJsDoc = require("swagger-jsdoc");

// const swaggerOptions = {
//   swaggerDefinition: {
//     openapi: "3.0.0",
//     info: {
//       title: "My API Documentation",
//       description: "API documentation for my Express app",
//       version: "1.0.0",
//     },
//     security: [
//       {
//         bearerAuth: [], // This tells Swagger to expect a Bearer token for authentication
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http", // Changed from 'apiKey' to 'http' for Bearer Authentication
//           scheme: "bearer",
//           bearerFormat: "JWT",
//           name: "Authorization", // This should already be there, but make sure
//           in: "header",
//           description: "JWT Bearer Token Authentication",
//         },
//       },
//       schemas: {
//         UnifiedSale: {
//           type: "object",
//           properties: {
//             _id: {
//               type: "string",
//               description: "The unique identifier for the sale",
//             },
//             date: {
//               type: "string",
//               format: "date-time",
//               description: "The date and time of the sale",
//             },
//             paymentMethod: {
//               type: "object",
//               properties: {
//                 _id: {
//                   type: "string",
//                   description: "The unique identifier for the payment method",
//                 },
//                 name: {
//                   type: "string",
//                   description: "The name of the payment method",
//                 },
//               },
//               description: "The payment method used for this sale",
//             },
//             totalAmount: {
//               type: "number",
//               description: "Total amount of the sale",
//             },
//             saleType: {
//               type: "string",
//               enum: ["restaurant", "minimart"],
//               description: "The type of sale",
//             },
//             items: {
//               type: "array",
//               items: {
//                 type: "object",
//                 properties: {
//                   item: {
//                     type: "string",
//                     description: "The unique identifier for the item",
//                   },
//                   quantity: {
//                     type: "number",
//                     description: "The quantity of the item",
//                   },
//                   priceAtSale: {
//                     type: "number",
//                     description: "The price of the item at the time of sale",
//                   },
//                   subTotal: {
//                     type: "number",
//                     description: "The subtotal for the item",
//                   },
//                   itemType: {
//                     type: "string",
//                     enum: ["Dish", "Product"],
//                     description: "The type of item (Dish or Product)",
//                   },
//                 },
//               },
//               description: "The items included in the sale",
//             },
//             cashier: {
//               type: "object",
//               properties: {
//                 _id: {
//                   type: "string",
//                   description: "The unique identifier for the cashier",
//                 },
//                 name: {
//                   type: "string",
//                   description: "The name of the cashier",
//                 },
//               },
//               description: "The cashier who handled the sale",
//             },
//             isVoided: {
//               type: "boolean",
//               description: "Indicates if the sale is voided",
//             },
//           },
//           required: [
//             "_id",
//             "date",
//             "paymentMethod",
//             "totalAmount",
//             "saleType",
//             "items",
//           ],
//         },
//         AnotherUnifiedSale: {
//           // <--- This is the missing schema definition!
//           type: "object",
//           properties: {
//             _id: { type: "string", description: "Unique ID of the sale" },
//             date: {
//               type: "string",
//               format: "date-time",
//               description: "Date of the sale",
//             },
//             totalAmount: {
//               type: "number",
//               description: "Total amount of the sale",
//             },
//             paymentMethod: {
//               type: "object",
//               properties: {
//                 _id: {
//                   type: "string",
//                   description: "ID of the payment method",
//                 },
//                 name: {
//                   type: "string",
//                   description: "Name of the payment method",
//                 },
//               },
//               description: "Payment method used",
//             },
//             saleType: {
//               type: "string",
//               enum: ["restaurant", "minimart"],
//               description: "Type of sale",
//             },
//             items: {
//               type: "array",
//               items: {
//                 type: "object",
//                 properties: {
//                   item: {
//                     type: "object",
//                     properties: {
//                       _id: { type: "string", description: "ID of the item" },
//                       name: { type: "string", description: "Name of the item" },
//                       price: {
//                         type: "number",
//                         description: "Price of the item",
//                       },
//                     },
//                     description: "The item details",
//                   },
//                   quantity: {
//                     type: "integer",
//                     description: "Quantity of the item",
//                   },
//                   priceAtSale: {
//                     type: "number",
//                     description: "Price at the time of sale",
//                   },
//                   subTotal: {
//                     type: "number",
//                     description: "Subtotal for the item",
//                   },
//                   itemType: {
//                     type: "string",
//                     enum: ["Dish", "Product"],
//                     description: "Type of item",
//                   },
//                 },
//               },
//               description: "Items in the sale",
//             },
//             cashier: {
//               type: "object",
//               properties: {
//                 _id: { type: "string", description: "ID of the cashier" },
//                 name: { type: "string", description: "Name of the cashier" },
//               },
//               description: "Cashier who handled the sale",
//             },
//             isVoided: { type: "boolean", description: "Is the sale voided?" },
//             __v: { type: "integer" },
//           },
//           required: [
//             "_id",
//             "date",
//             "paymentMethod",
//             "totalAmount",
//             "saleType",
//             "items",
//             "cashier",
//           ],
//         },
//         AnotherUnifiedSaleInput: {
//           // Schema for POST request body
//           type: "object",
//           required: [
//             "totalAmount",
//             "paymentMethod",
//             "saleType",
//             "items",
//             "cashier",
//           ],
//           properties: {
//             totalAmount: {
//               type: "number",
//               description: "Total amount of the sale",
//             },
//             paymentMethod: {
//               type: "string",
//               description: "ID of the payment method",
//             },
//             saleType: {
//               type: "string",
//               enum: ["restaurant", "minimart"],
//               description: "Type of sale",
//             },
//             items: {
//               type: "array",
//               items: {
//                 type: "object",
//                 required: [
//                   "item",
//                   "quantity",
//                   "priceAtSale",
//                   "subTotal",
//                   "itemType",
//                 ],
//                 properties: {
//                   item: { type: "string", description: "ID of the item" },
//                   quantity: {
//                     type: "integer",
//                     description: "Quantity of the item",
//                   },
//                   priceAtSale: {
//                     type: "number",
//                     description: "Price at the time of sale",
//                   },
//                   subTotal: {
//                     type: "number",
//                     description: "Subtotal for the item",
//                   },
//                   itemType: {
//                     type: "string",
//                     enum: ["Dish", "Product"],
//                     description: "Type of item",
//                   },
//                 },
//               },
//               description: "Items in the sale",
//             },
//             cashier: { type: "string", description: "ID of the cashier" },
//             isVoided: {
//               type: "boolean",
//               description: "Is the sale voided? (Optional)",
//             },
//           },
//         },
//       },
//     },
//     servers: [{ url: `http://localhost:${process.env.PORT || 5000}` }],
//     // url: "https://accounting-stock-system-backend.onrender.com",
//     // description: "Production Server",
//     schemes: ["http", "https"],
//   },
//   apis: [
//     "./routers/*.js",
//     "./routers/roleRouter.js",
//     "./routers/categoryRouter.js",
//     "./routers/paymentMethodRouter.js",
//     "./routers/dishesRouter.js",
//     "./routers/salesRouter.js",
//     "./routers/hallRouter.js",
//     "./routers/unifiedSaleRouter.js",
//     "./routers/laundryRouter.js",
//     "./routers/laundryServiceRoutes.js",
//     "./routers/orderItemRouter.js",
//     "./routers/seminarRouter.js",
//     "./routers/kabasaRouter.js",
//     "./routers/frontOfficeRouter.js",
//     "./routers/hallTypesRouter.js",
//     "./routers/supplierRouter.js",
//     "./routers/productRouter.js",
//     "./routers/anotherUnifiedSaleRoutes.js",
//     "./routers/aggregateSalesRouter.js",
//     "./routers/locationRouter.js",
//     "./routers/inventoryRouter.js",
//     "./routers/alertsRouter.js",
//     "./routers/auditLogRouter.js",
//     "./routers/inventoryAdjustmentRouter.js",
//     "./routers/purchaseOrderRouter.js",
//     "./routers/stockMovementRouter.js",
//     "./routers/salesTransactionRouter.js",
//     "./routers/customerRouter.js",
//     "./routers/debtorRouter.js",
//     "./routers/accountSaleRoutes.js",
//     "./routers/accountSaleRoutes.js",
//     "./routers/ledgerTransactionRouter.js",
//     "./routers/accountRouter.js",
//     "./routers/pettyCashRouter.js",
//     "./routers/permissionRouter.js",
//     "./routers/expenseCategoryRouter.js", // Ensure the product router file is included
//   ], // Ensure all relevant router files are included
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);

// module.exports = swaggerDocs;

const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "My API Documentation",
      description: "API documentation for my Express app",
      version: "1.0.0",
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          name: "Authorization",
          in: "header",
          description: "JWT Bearer Token Authentication",
        },
      },
      schemas: {
        UnifiedSale: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The unique identifier for the sale",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "The date and time of the sale",
            },
            paymentMethod: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  description: "The unique identifier for the payment method",
                },
                name: {
                  type: "string",
                  description: "The name of the payment method",
                },
              },
              description: "The payment method used for this sale",
            },
            totalAmount: {
              type: "number",
              description: "Total amount of the sale",
            },
            saleType: {
              type: "string",
              enum: ["restaurant", "minimart"],
              description: "The type of sale",
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  item: {
                    type: "string",
                    description: "The unique identifier for the item",
                  },
                  quantity: {
                    type: "number",
                    description: "The quantity of the item",
                  },
                  priceAtSale: {
                    type: "number",
                    description: "The price of the item at the time of sale",
                  },
                  subTotal: {
                    type: "number",
                    description: "The subtotal for the item",
                  },
                  itemType: {
                    type: "string",
                    enum: ["Dish", "Product"],
                    description: "The type of item (Dish or Product)",
                  },
                },
              },
              description: "The items included in the sale",
            },
            cashier: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  description: "The unique identifier for the cashier",
                },
                name: {
                  type: "string",
                  description: "The name of the cashier",
                },
              },
              description: "The cashier who handled the sale",
            },
            isVoided: {
              type: "boolean",
              description: "Indicates if the sale is voided",
            },
          },
          required: [
            "_id",
            "date",
            "paymentMethod",
            "totalAmount",
            "saleType",
            "items",
          ],
        },
        AnotherUnifiedSale: {
          type: "object",
          properties: {
            _id: { type: "string", description: "Unique ID of the sale" },
            date: {
              type: "string",
              format: "date-time",
              description: "Date of the sale",
            },
            totalAmount: {
              type: "number",
              description: "Total amount of the sale",
            },
            paymentMethod: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  description: "ID of the payment method",
                },
                name: {
                  type: "string",
                  description: "Name of the payment method",
                },
              },
              description: "Payment method used",
            },
            saleType: {
              type: "string",
              enum: ["restaurant", "minimart"],
              description: "Type of sale",
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  item: {
                    type: "object",
                    properties: {
                      _id: { type: "string", description: "ID of the item" },
                      name: { type: "string", description: "Name of the item" },
                      price: {
                        type: "number",
                        description: "Price of the item",
                      },
                    },
                    description: "The item details",
                  },
                  quantity: {
                    type: "integer",
                    description: "Quantity of the item",
                  },
                  priceAtSale: {
                    type: "number",
                    description: "Price at the time of sale",
                  },
                  subTotal: {
                    type: "number",
                    description: "Subtotal for the item",
                  },
                  itemType: {
                    type: "string",
                    enum: ["Dish", "Product"],
                    description: "Type of item",
                  },
                },
              },
              description: "Items in the sale",
            },
            cashier: {
              type: "object",
              properties: {
                _id: { type: "string", description: "ID of the cashier" },
                name: { type: "string", description: "Name of the cashier" },
              },
              description: "Cashier who handled the sale",
            },
            isVoided: { type: "boolean", description: "Is the sale voided?" },
            __v: { type: "integer" },
          },
          required: [
            "_id",
            "date",
            "paymentMethod",
            "totalAmount",
            "saleType",
            "items",
            "cashier",
          ],
        },
        AnotherUnifiedSaleInput: {
          type: "object",
          required: [
            "totalAmount",
            "paymentMethod",
            "saleType",
            "items",
            "cashier",
          ],
          properties: {
            totalAmount: {
              type: "number",
              description: "Total amount of the sale",
            },
            paymentMethod: {
              type: "string",
              description: "ID of the payment method",
            },
            saleType: {
              type: "string",
              enum: ["restaurant", "minimart"],
              description: "Type of sale",
            },
            items: {
              type: "array",
              items: {
                type: "object",
                required: [
                  "item",
                  "quantity",
                  "priceAtSale",
                  "subTotal",
                  "itemType",
                ],
                properties: {
                  item: { type: "string", description: "ID of the item" },
                  quantity: {
                    type: "integer",
                    description: "Quantity of the item",
                  },
                  priceAtSale: {
                    type: "number",
                    description: "Price at the time of sale",
                  },
                  subTotal: {
                    type: "number",
                    description: "Subtotal for the item",
                  },
                  itemType: {
                    type: "string",
                    enum: ["Dish", "Product"],
                    description: "Type of item",
                  },
                },
              },
              description: "Items in the sale",
            },
            cashier: { type: "string", description: "ID of the cashier" },
            isVoided: {
              type: "boolean",
              description: "Is the sale voided? (Optional)",
            },
          },
        },
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://accounting-stock-system-backend.onrender.com"
            : `http://localhost:${process.env.PORT || 5000}`,
        description:
          process.env.NODE_ENV === "production"
            ? "Production Server"
            : "Local Development Server",
      },
    ],
  },
  apis: [
    "./routers/*.js",
    "./routers/roleRouter.js",
    "./routers/categoryRouter.js",
    "./routers/paymentMethodRouter.js",
    "./routers/dishesRouter.js",
    "./routers/salesRouter.js",
    "./routers/hallRouter.js",
    "./routers/unifiedSaleRouter.js",
    "./routers/laundryRouter.js",
    "./routers/laundryServiceRoutes.js",
    "./routers/orderItemRouter.js",
    "./routers/seminarRouter.js",
    "./routers/kabasaRouter.js",
    "./routers/frontOfficeRouter.js",
    "./routers/hallTypesRouter.js",
    "./routers/supplierRouter.js",
    "./routers/productRouter.js",
    "./routers/anotherUnifiedSaleRoutes.js",
    "./routers/aggregateSalesRouter.js",
    "./routers/locationRouter.js",
    "./routers/inventoryRouter.js",
    "./routers/alertsRouter.js",
    "./routers/auditLogRouter.js",
    "./routers/inventoryAdjustmentRouter.js",
    "./routers/purchaseOrderRouter.js",
    "./routers/stockMovementRouter.js",
    "./routers/salesTransactionRouter.js",
    "./routers/customerRouter.js",
    "./routers/debtorRouter.js",
    "./routers/accountSaleRoutes.js",
    "./routers/ledgerTransactionRouter.js",
    "./routers/accountRouter.js",
    "./routers/pettyCashRouter.js",
    "./routers/permissionRouter.js",
    "./routers/expenseCategoryRouter.js",
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
