const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");
const {
  getLedgerTransactions,
  createLedgerTransaction,
  updateLedgerTransaction,
  deleteLedgerTransaction,
  getTransactionsByAccount,
  getAccountLedger,
} = require("../controllers/ledgerTransactionsController");

/**
 * @swagger
 * /api/ledger-transactions:
 *   get:
 *     summary: Get all ledger transactions
 *     tags:
 *       - LedgerTransactions
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
 *                     $ref: '#/components/schemas/LedgerTransaction'
 *             example:
 *               success: true
 *               data:
 *                 - _id: "507f1f77bcf86cd799439011"
 *                   date: "2025-03-25T10:00:00Z"
 *                   description: "Credit sale INV-001 to John Doe"
 *                   referenceType: "AccountSale"
 *                   referenceId: "507f1f77bcf86cd799439012"
 *                   entries:
 *                     - account: "507f1f77bcf86cd799439013"
 *                       debit: 1000
 *                       credit: 0
 *                     - account: "507f1f77bcf86cd799439014"
 *                       debit: 0
 *                       credit: 1000
 *                   status: "Pending"
 *                   createdBy:
 *                     _id: "507f1f77bcf86cd799439015"
 *                     fullName: "Admin User"
 *                     email: "admin@example.com"
 *                   createdAt: "2025-03-25T10:00:00Z"
 *                   updatedAt: "2025-03-25T10:00:00Z"
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:ledger-transactions"),
  getLedgerTransactions
);

/**
 * @swagger
 * /api/ledger-transactions/summary:
 *   get:
 *     summary: Get summarized account ledger data
 *     description: Retrieves a summary of ledger transactions aggregated by date and account, showing total debits and credits.
 *     tags:
 *       - LedgerTransactions
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering transactions (e.g., 2025-03-01)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering transactions (e.g., 2025-03-31)
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
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         description: Date of transactions (YYYY-MM-DD)
 *                       account:
 *                         type: string
 *                         description: Account name
 *                       sumOfDebit:
 *                         type: number
 *                         description: Total debit amount for the account on that date
 *                       sumOfCredit:
 *                         type: number
 *                         description: Total credit amount for the account on that date
 *                 totals:
 *                   type: object
 *                   properties:
 *                     totalDebit:
 *                       type: number
 *                       description: Overall sum of debits
 *                     totalCredit:
 *                       type: number
 *                       description: Overall sum of credits
 *             example:
 *               success: true
 *               data:
 *                 - date: "2025-03-31"
 *                   account: "Cash"
 *                   sumOfDebit: 500
 *                   sumOfCredit: 200
 *                 - date: "2025-03-31"
 *                   account: "Petty Cash Equity"
 *                   sumOfDebit: 0
 *                   sumOfCredit: 300
 *                 - date: "2025-03-31"
 *                   account: "Sales Revenue"
 *                   sumOfDebit: 0
 *                   sumOfCredit: 500
 *               totals:
 *                 totalDebit: 500
 *                 totalCredit: 1000
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.get(
  "/summary",
  authenticateUser,
  authorize("read:ledger-transactions"),
  getAccountLedger
);

/**
 * @swagger
 * /api/ledger-transactions/account/{accountId}:
 *   get:
 *     summary: Get transactions for a specific account
 *     tags:
 *       - LedgerTransactions
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the account
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
 *                     $ref: '#/components/schemas/LedgerTransaction'
 *       '400':
 *         description: Invalid ID
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.get(
  "/account/:accountId",
  authenticateUser,
  authorize("read:ledger-transactions"),
  getTransactionsByAccount
);

/**
 * @swagger
 * /api/ledger-transactions:
 *   post:
 *     summary: Create a new ledger transaction
 *     tags:
 *       - LedgerTransactions
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LedgerTransactionInput'
 *           example:
 *             date: "2025-03-25T10:00:00Z"
 *             description: "Credit sale INV-001 to John Doe"
 *             referenceType: "AccountSale"
 *             referenceId: "507f1f77bcf86cd799439012"
 *             entries:
 *               - account: "507f1f77bcf86cd799439013"
 *                 debit: 1000
 *                 credit: 0
 *               - account: "507f1f77bcf86cd799439014"
 *                 debit: 0
 *                 credit: 1000
 *     responses:
 *       '201':
 *         description: Ledger transaction created successfully
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
 *                   $ref: '#/components/schemas/LedgerTransaction'
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
  authorize("write:ledger-transactions"),
  createLedgerTransaction
);

/**
 * @swagger
 * /api/ledger-transactions/{id}:
 *   put:
 *     summary: Update an existing ledger transaction
 *     tags:
 *       - LedgerTransactions
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the ledger transaction to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LedgerTransactionUpdateInput'
 *           example:
 *             status: "Posted"
 *     responses:
 *       '200':
 *         description: Ledger transaction updated successfully
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
 *                   $ref: '#/components/schemas/LedgerTransaction'
 *       '400':
 *         description: Validation error or transaction is posted/voided
 *       '404':
 *         description: Ledger transaction not found
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
  authorize("write:ledger-transactions"),
  updateLedgerTransaction
);

/**
 * @swagger
 * /api/ledger-transactions/{id}:
 *   delete:
 *     summary: Void a ledger transaction
 *     tags:
 *       - LedgerTransactions
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the ledger transaction to void
 *     responses:
 *       '200':
 *         description: Ledger transaction voided successfully
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
 *                   $ref: '#/components/schemas/LedgerTransaction'
 *       '400':
 *         description: Invalid ID or transaction is posted/voided
 *       '404':
 *         description: Ledger transaction not found
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
  authorize("write:ledger-transactions"),
  deleteLedgerTransaction
);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     LedgerEntryInput:
 *       type: object
 *       required:
 *         - account
 *       properties:
 *         account:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *           description: The ID of the account
 *         debit:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           description: Debit amount
 *         credit:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           description: Credit amount
 *       example:
 *         account: "507f1f77bcf86cd799439013"
 *         debit: 1000
 *         credit: 0
 *     LedgerTransactionInput:
 *       type: object
 *       required:
 *         - date
 *         - description
 *         - referenceType
 *         - referenceId
 *         - entries
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *           description: Transaction date
 *         description:
 *           type: string
 *           maxLength: 200
 *           description: Transaction description
 *         referenceType:
 *           type: string
 *           enum: ["AccountSale", "DebtorPayment", "PettyCash", "Other"]
 *           description: Type of entity this transaction references
 *         referenceId:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *           description: ID of the referenced entity
 *         entries:
 *           type: array
 *           minItems: 2
 *           items:
 *             $ref: '#/components/schemas/LedgerEntryInput'
 *           description: List of ledger entries (must balance)
 *         status:
 *           type: string
 *           enum: ["Pending", "Posted", "Voided"]
 *           default: "Pending"
 *           description: Transaction status
 *       example:
 *         date: "2025-03-25T10:00:00Z"
 *         description: "Credit sale INV-001 to John Doe"
 *         referenceType: "AccountSale"
 *         referenceId: "507f1f77bcf86cd799439012"
 *         entries:
 *           - account: "507f1f77bcf86cd799439013"
 *             debit: 1000
 *             credit: 0
 *           - account: "507f1f77bcf86cd799439014"
 *             debit: 0
 *             credit: 1000
 *     LedgerTransactionUpdateInput:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *           maxLength: 200
 *         referenceType:
 *           type: string
 *           enum: ["AccountSale", "DebtorPayment", "PettyCash", "Other"]
 *         referenceId:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         entries:
 *           type: array
 *           minItems: 2
 *           items:
 *             $ref: '#/components/schemas/LedgerEntryInput'
 *         status:
 *           type: string
 *           enum: ["Pending", "Posted", "Voided"]
 *       example:
 *         status: "Posted"
 *     LedgerTransaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB document ID
 *         date:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *         referenceType:
 *           type: string
 *           enum: ["AccountSale", "DebtorPayment", "PettyCash", "Other"]
 *         referenceId:
 *           type: string
 *         entries:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               account:
 *                 type: string
 *               debit:
 *                 type: number
 *               credit:
 *                 type: number
 *         status:
 *           type: string
 *           enum: ["Pending", "Posted", "Voided"]
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
 *         date: "2025-03-25T10:00:00Z"
 *         description: "Credit sale INV-001 to John Doe"
 *         referenceType: "AccountSale"
 *         referenceId: "507f1f77bcf86cd799439012"
 *         entries:
 *           - account: "507f1f77bcf86cd799439013"
 *             debit: 1000
 *             credit: 0
 *           - account: "507f1f77bcf86cd799439014"
 *             debit: 0
 *             credit: 1000
 *         status: "Pending"
 *         createdBy:
 *           _id: "507f1f77bcf86cd799439015"
 *           fullName: "Admin User"
 *           email: "admin@example.com"
 *         createdAt: "2025-03-25T10:00:00Z"
 *         updatedAt: "2025-03-25T10:00:00Z"
 */
