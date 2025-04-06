const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware"); // Adjust path as needed

const {
  getAllExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
} = require("../controllers/expenseCategoryController"); // Adjust path as needed

/**
 * @swagger
 * /api/expense-categories:
 *   get:
 *     summary: Get all expense categories
 *     tags:
 *       - Expense Categories
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
 *                 message:
 *                   type: string
 *                   example: "Expense categories retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ExpenseCategory'
 *             example:
 *               success: true
 *               message: "Expense categories retrieved successfully"
 *               data:
 *                 - _id: "507f1f77bcf86cd799439011"
 *                   name: "Gasoline"
 *                   code: "fuel"
 *                   active: true
 *                   createdAt: "2025-04-01T10:00:00Z"
 *                   updatedAt: "2025-04-01T10:00:00Z"
 *                 - _id: "507f1f77bcf86cd799439012"
 *                   name: "Miscellaneous"
 *                   code: "misc"
 *                   active: true
 *                   createdAt: "2025-04-01T12:00:00Z"
 *                   updatedAt: "2025-04-01T12:00:00Z"
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
 *                   example: "Server error while retrieving expense categories"
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:expensecategories"),
  getAllExpenseCategories
);

/**
 * @swagger
 * /api/expense-categories:
 *   post:
 *     summary: Create a new expense category
 *     tags:
 *       - Expense Categories
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseCategoryInput'
 *           example:
 *             name: "Gasoline"
 *             code: "fuel"
 *             active: true
 *     responses:
 *       '201':
 *         description: Expense category created successfully
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
 *                   example: "Expense category created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ExpenseCategory'
 *       '400':
 *         description: Bad request - validation error
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
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Name is required"]
 *       '409':
 *         description: Name or code already exists
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
 *                   example: "Expense category with this name already exists"
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
  authorize("write:expensecategories"),
  createExpenseCategory
);

/**
 * @swagger
 * /api/expense-categories/{id}:
 *   put:
 *     summary: Update an existing expense category
 *     tags:
 *       - Expense Categories
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the expense category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseCategoryUpdateInput'
 *           example:
 *             name: "Updated Gasoline"
 *             active: false
 *     responses:
 *       '200':
 *         description: Expense category updated successfully
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
 *                   example: "Expense category updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ExpenseCategory'
 *       '400':
 *         description: Bad request - validation error or invalid ID
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
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Name cannot exceed 50 characters"]
 *       '404':
 *         description: Expense category not found
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
 *                   example: "Expense category not found"
 *       '409':
 *         description: Name or code already exists
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
  authorize("write:expensecategories"),
  updateExpenseCategory
);

/**
 * @swagger
 * /api/expense-categories/{id}:
 *   delete:
 *     summary: Delete an expense category (soft delete)
 *     tags:
 *       - Expense Categories
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the expense category to delete
 *     responses:
 *       '200':
 *         description: Expense category deleted successfully
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
 *                   example: "Expense category deleted successfully"
 *                 data:
 *                   type: null
 *                   example: null
 *       '400':
 *         description: Invalid ID or category already inactive
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
 *                   example: "Invalid category ID"
 *       '404':
 *         description: Expense category not found
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
 *                   example: "Expense category not found"
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
  authorize("write:expensecategories"),
  deleteExpenseCategory
);

module.exports = router;

// Swagger component schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     ExpenseCategoryInput:
 *       type: object
 *       required:
 *         - name
 *         - code
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 50
 *           description: The name of the expense category
 *         code:
 *           type: string
 *           maxLength: 50
 *           description: A unique code for the expense category (lowercase)
 *         active:
 *           type: boolean
 *           default: true
 *           description: Whether the category is active
 *       example:
 *         name: "Gasoline"
 *         code: "fuel"
 *         active: true
 *     ExpenseCategoryUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 50
 *           description: The name of the expense category
 *         code:
 *           type: string
 *           maxLength: 50
 *           description: A unique code for the expense category (lowercase)
 *         active:
 *           type: boolean
 *           description: Whether the category is active
 *       example:
 *         name: "Updated Gasoline"
 *         active: false
 *     ExpenseCategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The MongoDB document ID
 *         name:
 *           type: string
 *           description: The name of the expense category
 *         code:
 *           type: string
 *           description: The unique code for the expense category
 *         active:
 *           type: boolean
 *           description: Whether the category is active
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
 *         name: "Gasoline"
 *         code: "fuel"
 *         active: true
 *         createdAt: "2025-04-01T10:00:00Z"
 *         updatedAt: "2025-04-01T10:00:00Z"
 */
