const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");
const {
  getPettyCashes,
  createPettyCash,
  updatePettyCash,
  deletePettyCash,
  addTransaction,
  recalculatePettyCashBalance,
  getAllPettyCashTransactions,
} = require("../controllers/pettyCashController");

/**
 * @swagger
 * /api/petty-cashes:
 *   get:
 *     summary: Get all active petty cash records
 *     tags:
 *       - PettyCash
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved petty cash records
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
 *                     $ref: '#/components/schemas/PettyCash'
 *             example:
 *               success: true
 *               data:
 *                 - _id: "507f1f77bcf86cd799439011"
 *                   balance: 500
 *                   initialAmount: 1000
 *                   transactions: []
 *                   lastReplenished: null
 *                   createdBy:
 *                     _id: "507f1f77bcf86cd799439012"
 *                     fullName: "Admin User"
 *                     email: "admin@example.com"
 *                   status: "active"
 *                   createdAt: "2025-03-25T09:00:00Z"
 *                   updatedAt: "2025-03-25T09:00:00Z"
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.get("/", authenticateUser, authorize("read:pettycash"), getPettyCashes);

/**
 * @swagger
 * /api/petty-cashes/transactions:
 *   get:
 *     summary: Get all petty cash transactions across all active records
 *     tags:
 *       - PettyCash
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved all petty cash transactions
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       pettyCashId:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       details:
 *                         type: string
 *                       voucherNo:
 *                         type: string
 *                       checkNo:
 *                         type: string
 *                       totalPayment:
 *                         type: number
 *                       expenseBreakdowns:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             amount:
 *                               type: number
 *                       ledgerTransactionDescription:
 *                         type: string
 *             example:
 *               success: true
 *               data:
 *                 - id: "507f1f77bcf86cd799439013"
 *                   pettyCashId: "507f1f77bcf86cd799439011"
 *                   date: "2025-03-31T09:00:00Z"
 *                   details: "Office supplies purchase"
 *                   voucherNo: "PC001"
 *                   checkNo: "N/A"
 *                   totalPayment: 200
 *                   expenseBreakdowns:
 *                     - name: "Office Supplies"
 *                       amount: 200
 *                   ledgerTransactionDescription: "Petty cash expense - PC001"
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.get(
  "/transactions",
  authenticateUser,
  authorize("read:pettycash"),
  getAllPettyCashTransactions
);

/**
 * @swagger
 * /api/petty-cashes:
 *   post:
 *     summary: Create a new petty cash record
 *     tags:
 *       - PettyCash
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - balance
 *               - initialAmount
 *             properties:
 *               balance:
 *                 type: number
 *                 description: Initial balance of the petty cash fund
 *               initialAmount:
 *                 type: number
 *                 description: Initial amount allocated to the fund (must equal balance)
 *             example:
 *               balance: 1000
 *               initialAmount: 1000
 *     responses:
 *       '201':
 *         description: Petty cash created successfully
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
 *                   $ref: '#/components/schemas/PettyCash'
 *             example:
 *               success: true
 *               message: "Petty cash created successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 balance: 1000
 *                 initialAmount: 1000
 *                 transactions: []
 *                 createdBy:
 *                   _id: "507f1f77bcf86cd799439012"
 *                   fullName: "Admin User"
 *                   email: "admin@example.com"
 *                 status: "active"
 *                 createdAt: "2025-03-25T09:00:00Z"
 *       '400':
 *         description: Validation error
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
  authorize("write:pettycash"),
  createPettyCash
);

/**
 * @swagger
 * /api/petty-cashes/{id}:
 *   put:
 *     summary: Update an existing petty cash record
 *     tags:
 *       - PettyCash
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the petty cash record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               balance:
 *                 type: number
 *                 description: Updated balance (optional)
 *               initialAmount:
 *                 type: number
 *                 description: Updated initial amount (optional)
 *               lastReplenished:
 *                 type: string
 *                 format: date-time
 *                 description: Date of last replenishment (optional)
 *             example:
 *               balance: 800
 *               lastReplenished: "2025-03-26T10:00:00Z"
 *     responses:
 *       '200':
 *         description: Petty cash updated successfully
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
 *                   $ref: '#/components/schemas/PettyCash'
 *       '400':
 *         description: Invalid ID or validation error
 *       '404':
 *         description: Petty cash not found or inactive
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
  authorize("write:pettycash"),
  updatePettyCash
);

/**
 * @swagger
 * /api/petty-cashes/{id}:
 *   delete:
 *     summary: Deactivate a petty cash record (soft delete)
 *     tags:
 *       - PettyCash
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the petty cash record
 *     responses:
 *       '200':
 *         description: Petty cash deactivated successfully
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
 *                   $ref: '#/components/schemas/PettyCash'
 *             example:
 *               success: true
 *               message: "Petty cash deactivated successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 balance: 500
 *                 initialAmount: 1000
 *                 status: "inactive"
 *       '400':
 *         description: Invalid ID or already inactive
 *       '404':
 *         description: Petty cash not found
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
  authorize("write:pettycash"),
  deletePettyCash
);

/**
 * @swagger
 * /api/petty-cashes/{id}/transactions:
 *   post:
 *     summary: Add a transaction to a petty cash record
 *     tags:
 *       - PettyCash
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the petty cash record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - details
 *               - totalPayment
 *               - expenseBreakdowns
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               details:
 *                 type: string
 *               voucherNo:
 *                 type: string
 *               checkNo:
 *                 type: string
 *               totalPayment:
 *                 type: number
 *               expenseBreakdowns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: string
 *                     amount:
 *                       type: number
 *                   required:
 *                     - category
 *                     - amount
 *             example:
 *               date: "2025-04-01T10:00:00.000Z"
 *               details: "Sadaka donation"
 *               voucherNo: "VC123"
 *               checkNo: null
 *               totalPayment: 50
 *               expenseBreakdowns:
 *                 - category: "67ec25c843260cd4a903f21d"
 *                   amount: 50
 *     responses:
 *       '201':
 *         description: Transaction added successfully
 */
router.post(
  "/:id/transactions",
  authenticateUser,
  authorize("write:pettycash"),
  addTransaction
);

/**
 * @swagger
 * /api/petty-cashes/{id}/recalculate-balance:
 *   post:
 *     summary: Recalculate the balance of a petty cash record
 *     tags:
 *       - PettyCash
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the petty cash record
 *     responses:
 *       '200':
 *         description: Balance recalculated successfully
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
 *                   $ref: '#/components/schemas/PettyCash'
 *             example:
 *               success: true
 *               message: "Petty cash balance recalculated successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 balance: 850
 *                 initialAmount: 1000
 *                 transactions:
 *                   - voucherNo: "PC001"
 *                     totalPayment: 150
 *       '400':
 *         description: Invalid ID
 *       '404':
 *         description: Petty cash not found or inactive
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.post(
  "/:id/recalculate-balance",
  authenticateUser,
  authorize("write:pettycash"),
  recalculatePettyCashBalance
);

module.exports = router;
