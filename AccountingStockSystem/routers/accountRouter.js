const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");
const {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} = require("../controllers/accountController");

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all active accounts
 *     tags:
 *       - Accounts
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: ["Asset", "Liability", "Equity", "Revenue", "Expense"]
 *         description: Filter accounts by type (optional)
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Account'
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.get("/", authenticateUser, authorize("read:accounts"), getAccounts);

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new account
 *     tags:
 *       - Accounts
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountInput'
 *           example:
 *             accountCode: "1001"
 *             name: "Cash"
 *             type: "Asset"
 *             subType: "Current Asset"
 *             description: "Cash on hand"
 *     responses:
 *       '201':
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Account'
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.post("/", authenticateUser, authorize("write:accounts"), createAccount);

/**
 * @swagger
 * /api/accounts/{id}:
 *   put:
 *     summary: Update an existing account
 *     tags:
 *       - Accounts
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the account to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountUpdateInput'
 *           example:
 *             description: "Updated cash account"
 *             subType: "Liquid Asset"
 *     responses:
 *       '200':
 *         description: Account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Account'
 *       '400':
 *         description: Validation error or invalid ID
 *       '404':
 *         description: Account not found or inactive
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
  authorize("write:accounts"),
  updateAccount
);

/**
 * @swagger
 * /api/accounts/{id}:
 *   delete:
 *     summary: Deactivate an account
 *     tags:
 *       - Accounts
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the account to deactivate
 *     responses:
 *       '200':
 *         description: Account deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Account'
 *       '400':
 *         description: Invalid ID or already inactive
 *       '404':
 *         description: Account not found
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
  authorize("write:accounts"),
  deleteAccount
);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     AccountInput:
 *       type: object
 *       required:
 *         - accountCode
 *         - name
 *         - type
 *       properties:
 *         accountCode:
 *           type: string
 *           pattern: ^[A-Za-z0-9-]+$
 *           description: Unique alphanumeric code with dashes
 *         name:
 *           type: string
 *           maxLength: 50
 *           description: Unique account name
 *         type:
 *           type: string
 *           enum: ["Asset", "Liability", "Equity", "Revenue", "Expense"]
 *           description: Account category
 *         subType:
 *           type: string
 *           maxLength: 50
 *           description: Optional sub-category
 *         description:
 *           type: string
 *           maxLength: 200
 *           description: Optional account description
 *         status:
 *           type: string
 *           enum: ["active", "inactive"]
 *           default: "active"
 *           description: Account status
 *       example:
 *         accountCode: "1001"
 *         name: "Cash"
 *         type: "Asset"
 *         subType: "Current Asset"
 *         description: "Cash on hand"
 *     AccountUpdateInput:
 *       type: object
 *       properties:
 *         accountCode:
 *           type: string
 *           pattern: ^[A-Za-z0-9-]+$
 *         name:
 *           type: string
 *           maxLength: 50
 *         type:
 *           type: string
 *           enum: ["Asset", "Liability", "Equity", "Revenue", "Expense"]
 *         subType:
 *           type: string
 *           maxLength: 50
 *         description:
 *           type: string
 *           maxLength: 200
 *         status:
 *           type: string
 *           enum: ["active", "inactive"]
 *       example:
 *         description: "Updated cash account"
 *         subType: "Liquid Asset"
 *     Account:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB document ID
 *         accountCode:
 *           type: string
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: ["Asset", "Liability", "Equity", "Revenue", "Expense"]
 *         subType:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: ["active", "inactive"]
 *         createdBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         accountCode: "1001"
 *         name: "Cash"
 *         type: "Asset"
 *         subType: "Current Asset"
 *         description: "Cash on hand"
 *         status: "active"
 *         createdBy:
 *           _id: "507f1f77bcf86cd799439015"
 *           fullName: "Admin User"
 *           email: "admin@example.com"
 *         createdAt: "2025-03-25T10:00:00Z"
 *         updatedAt: "2025-03-25T10:00:00Z"
 */
