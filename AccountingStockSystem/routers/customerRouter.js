const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware"); // Adjust path
const {
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerDebtors,
} = require("../controllers/customerController"); // Adjust path

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags:
 *       - Customers
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *             example:
 *               success: true
 *               data:
 *                 - _id: "507f1f77bcf86cd799439011"
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   phoneNumber: "12345678901"
 *                   address: "123 Main St"
 *                   status: "active"
 *                   createdBy:
 *                     _id: "507f1f77bcf86cd799439012"
 *                     fullName: "Admin User"
 *                     email: "admin@example.com"
 *                   createdAt: "2025-03-21T10:00:00Z"
 *                   updatedAt: "2025-03-21T10:00:00Z"
 *                 - _id: "507f1f77bcf86cd799439013"
 *                   name: "Jane Smith"
 *                   email: "jane.smith@example.com"
 *                   phoneNumber: "98765432109"
 *                   address: "456 Oak Ave"
 *                   status: "active"
 *                   createdBy:
 *                     _id: "507f1f77bcf86cd799439012"
 *                     fullName: "Admin User"
 *                     email: "admin@example.com"
 *                   createdAt: "2025-03-22T12:00:00Z"
 *                   updatedAt: "2025-03-22T12:00:00Z"
 *       '401':
 *         description: Unauthorized - No token or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: Invalid token"
 *       '403':
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: Insufficient permissions"
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error fetching customers"
 */
router.get("/", authenticateUser, authorize("read:customers"), getCustomer);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags:
 *       - Customers
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerInput'
 *           example:
 *             name: "John Doe"
 *             email: "john.doe@example.com"
 *             phoneNumber: "12345678901"
 *             address: "123 Main St"
 *             status: "active"
 *     responses:
 *       '201':
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Customer created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       '400':
 *         description: Bad request - validation error
 *       '409':
 *         description: Email or phone number already exists
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:customers"),
  createCustomer
);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update an existing customer
 *     tags:
 *       - Customers
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the customer to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerUpdateInput'
 *     responses:
 *       '200':
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Customer updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       '400':
 *         description: Bad request - validation error
 *       '404':
 *         description: Customer not found
 *       '409':
 *         description: Email or phone number already exists
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.put(
  "/:id",
  authenticateUser,
  authorize("write:customers"),
  updateCustomer
);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer (soft delete)
 *     tags:
 *       - Customers
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the customer to delete
 *     responses:
 *       '200':
 *         description: Customer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Customer deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       '400':
 *         description: Invalid ID or customer already deleted
 *       '404':
 *         description: Customer not found
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.delete(
  "/:id",
  authenticateUser,
  authorize("write:customers"),
  deleteCustomer
);

/**
 * @swagger
 * /api/customers/{id}/debtors:
 *   get:
 *     summary: Get all debtors for a specific customer
 *     tags:
 *       - Customers
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the customer
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Debtor'
 *       '400':
 *         description: Invalid Customer ID
 *       '404':
 *         description: Customer not found
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.get(
  "/:id/debtors",
  authenticateUser,
  authorize("read:debtors"),
  getCustomerDebtors
);

module.exports = router;

// Swagger component schemas
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: Authorization
 *       description: JWT token in the format "Bearer <token>"
 *   schemas:
 *     CustomerInput:
 *       type: object
 *       required:
 *         - name
 *         - phoneNumber
 *         - address
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: The name of the customer
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the customer
 *         phoneNumber:
 *           type: string
 *           pattern: ^[0-9]{10,15}$
 *           description: The phone number of the customer (10-15 digits)
 *         address:
 *           type: string
 *           maxLength: 200
 *           description: The address of the customer
 *         status:
 *           type: string
 *           enum: ["active", "inactive", "deleted"]
 *           default: "active"
 *           description: The status of the customer
 *       example:
 *         name: "John Doe"
 *         email: "john.doe@example.com"
 *         phoneNumber: "12345678901"
 *         address: "123 Main St"
 *         status: "active"
 *     CustomerUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: The name of the customer
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the customer
 *         phoneNumber:
 *           type: string
 *           pattern: ^[0-9]{10,15}$
 *           description: The phone number of the customer (10-15 digits)
 *         address:
 *           type: string
 *           maxLength: 200
 *           description: The address of the customer
 *         status:
 *           type: string
 *           enum: ["active", "inactive", "deleted"]
 *           description: The status of the customer
 *       example:
 *         email: "john.doe.new@example.com"
 *         status: "inactive"
 *     Customer:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The MongoDB document ID
 *         name:
 *           type: string
 *           description: The name of the customer
 *         email:
 *           type: string
 *           description: The email address of the customer
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the customer
 *         address:
 *           type: string
 *           description: The address of the customer
 *         status:
 *           type: string
 *           description: The status of the customer
 *         createdBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *           description: The user who created the customer
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         name: "John Doe"
 *         email: "john.doe@example.com"
 *         phoneNumber: "12345678901"
 *         address: "123 Main St"
 *         status: "active"
 *         createdBy:
 *           _id: "507f1f77bcf86cd799439012"
 *           fullName: "Admin User"
 *           email: "admin@example.com"
 *         createdAt: "2025-03-21T10:00:00Z"
 *         updatedAt: "2025-03-21T10:00:00Z"
 */
