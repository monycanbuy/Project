const express = require("express");
const router = express.Router();
const {
  getDebtors,
  createDebtor,
  updateDebtor,
  deleteDebtor,
  addInvoice,
  updateInvoice,
  addPayment,
  addInitialPayment,
  getDebtorInvoices,
  recalculateDebtorBalance,
  getPaymentHistory,
} = require("../controllers/debtorsController"); // Adjust path
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/debtors:
 *   get:
 *     summary: Get all debtors
 *     tags:
 *       - Debtors
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
 *                     $ref: '#/components/schemas/Debtor'
 *             example:
 *               success: true
 *               data:
 *                 - _id: "507f1f77bcf86cd799439011"
 *                   customer:
 *                     _id: "507f1f77bcf86cd799439012"
 *                     name: "John Doe"
 *                     email: "john.doe@example.com"
 *                     phoneNumber: "12345678901"
 *                   openingBalance: 0
 *                   totalDebt: 5000
 *                   totalCreditReceived: 0
 *                   totalDeduction: 0
 *                   closingBalance: 5000
 *                   invoices:
 *                     - invoiceNumber: "INV-001"
 *                       amount: 5000
 *                       issuedDate: "2025-03-21T10:00:00Z"
 *                       dueDate: "2025-04-20T10:00:00Z"
 *                       status: "Pending"
 *                   status: "active"
 *                   createdBy:
 *                     _id: "507f1f77bcf86cd799439013"
 *                     fullName: "Admin User"
 *                     email: "admin@example.com"
 *                   createdAt: "2025-03-21T10:00:00Z"
 *                   updatedAt: "2025-03-21T10:00:00Z"
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
 *                   example: "Error fetching debtors"
 */
router.get("/", authenticateUser, authorize("read:debtors"), getDebtors);

/**
 * @swagger
 * /api/debtors/payments:
 *   get:
 *     summary: Get payment history for all debtors (excluding initial payments)
 *     tags:
 *       - Debtors
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
 *                     type: object
 *                     properties:
 *                       debtorId:
 *                         type: string
 *                       customerName:
 *                         type: string
 *                       invoiceNumber:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       method:
 *                         type: string
 *                       paymentId:
 *                         type: string
 *             example:
 *               success: true
 *               data:
 *                 - debtorId: "507f1f77bcf86cd799439011"
 *                   customerName: "Shiloh God"
 *                   invoiceNumber: "INV-001"
 *                   amount: 300
 *                   date: "2025-03-27T09:00:00Z"
 *                   method: "Cash"
 *                   paymentId: "507f1f77bcf86cd799439014"
 *                 - debtorId: "507f1f77bcf86cd799439011"
 *                   customerName: "Shiloh God"
 *                   invoiceNumber: "INV-001"
 *                   amount: 200
 *                   date: "2025-03-28T14:00:00Z"
 *                   method: "Cash"
 *                   paymentId: "507f1f77bcf86cd799439015"
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.get(
  "/payments",
  authenticateUser,
  authorize("read:debtors"),
  getPaymentHistory
);

/**
 * @swagger
 * /api/debtors:
 *   post:
 *     summary: Create a new debtor
 *     tags:
 *       - Debtors
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DebtorInput'
 *           example:
 *             customer: "507f1f77bcf86cd799439012"
 *             openingBalance: 0
 *             totalDebt: 0
 *             totalCreditReceived: 0
 *             totalDeduction: 0
 *             closingBalance: 0
 *             invoices: []
 *     responses:
 *       '201':
 *         description: Debtor created successfully
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
 *                   example: "Debtor created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Debtor'
 *             example:
 *               success: true
 *               message: "Debtor created successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 customer:
 *                   _id: "507f1f77bcf86cd799439012"
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   phoneNumber: "12345678901"
 *                 openingBalance: 0
 *                 totalDebt: 0
 *                 totalCreditReceived: 0
 *                 totalDeduction: 0
 *                 closingBalance: 0
 *                 invoices: []
 *                 status: "active"
 *                 createdBy:
 *                   _id: "507f1f77bcf86cd799439013"
 *                   fullName: "Admin User"
 *                   email: "admin@example.com"
 *                 createdAt: "2025-03-21T10:00:00Z"
 *                 updatedAt: "2025-03-21T10:00:00Z"
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
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Customer ID must be a valid ObjectId"]
 *       '409':
 *         description: Debtor already exists for this customer
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
 *                   example: "Debtor already exists for this customer"
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.post("/", authenticateUser, authorize("write:debtors"), createDebtor);

/**
 * @swagger
 * /api/debtors/{id}/invoices:
 *   get:
 *     summary: Get all invoices for a debtor
 *     tags:
 *       - Debtors
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the debtor
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
 *                     $ref: '#/components/schemas/Invoice'
 *       '400':
 *         description: Invalid ID
 *       '404':
 *         description: Debtor not found
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.get(
  "/:id/invoices",
  authenticateUser,
  authorize("read:debtors"),
  getDebtorInvoices
);

/**
 * @swagger
 * /api/debtors/{id}:
 *   put:
 *     summary: Update an existing debtor
 *     tags:
 *       - Debtors
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the debtor to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DebtorUpdateInput'
 *           example:
 *             totalDebt: 5000
 *             closingBalance: 5000
 *     responses:
 *       '200':
 *         description: Debtor updated successfully
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
 *                   example: "Debtor updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Debtor'
 *             example:
 *               success: true
 *               message: "Debtor updated successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 customer:
 *                   _id: "507f1f77bcf86cd799439012"
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   phoneNumber: "12345678901"
 *                 openingBalance: 0
 *                 totalDebt: 5000
 *                 totalCreditReceived: 0
 *                 totalDeduction: 0
 *                 closingBalance: 5000
 *                 invoices: []
 *                 status: "active"
 *                 createdBy:
 *                   _id: "507f1f77bcf86cd799439013"
 *                   fullName: "Admin User"
 *                   email: "admin@example.com"
 *                 createdAt: "2025-03-21T10:00:00Z"
 *                 updatedAt: "2025-03-21T12:00:00Z"
 *       '400':
 *         description: Bad request - validation error or deleted debtor
 *       '404':
 *         description: Debtor not found
 *       '409':
 *         description: Customer already assigned to another debtor
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.put("/:id", authenticateUser, authorize("write:debtors"), updateDebtor);

/**
 * @swagger
 * /api/debtors/{id}:
 *   delete:
 *     summary: Soft delete a debtor
 *     tags:
 *       - Debtors
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the debtor to delete
 *     responses:
 *       '200':
 *         description: Debtor deleted successfully
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
 *                   example: "Debtor deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Debtor'
 *             example:
 *               success: true
 *               message: "Debtor deleted successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 customer:
 *                   _id: "507f1f77bcf86cd799439012"
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   phoneNumber: "12345678901"
 *                 openingBalance: 0
 *                 totalDebt: 5000
 *                 totalCreditReceived: 0
 *                 totalDeduction: 0
 *                 closingBalance: 5000
 *                 invoices: []
 *                 status: "deleted"
 *                 createdBy:
 *                   _id: "507f1f77bcf86cd799439013"
 *                   fullName: "Admin User"
 *                   email: "admin@example.com"
 *                 createdAt: "2025-03-21T10:00:00Z"
 *                 updatedAt: "2025-03-21T12:00:00Z"
 *       '400':
 *         description: Invalid ID or debtor already deleted
 *       '404':
 *         description: Debtor not found
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
  authorize("write:debtors"),
  deleteDebtor
);

/**
 * @swagger
 * /api/debtors/{id}/invoices:
 *   post:
 *     summary: Add an invoice to a debtor
 *     tags:
 *       - Debtors
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the debtor to add an invoice to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvoiceInput'
 *           example:
 *             invoiceNumber: "INV-001"
 *             amount: 5000
 *             issuedDate: "2025-03-21T10:00:00Z"
 *             dueDate: "2025-04-20T10:00:00Z"
 *             status: "Pending"
 *     responses:
 *       '201':
 *         description: Invoice added successfully
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
 *                   example: "Invoice added successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Debtor'
 *             example:
 *               success: true
 *               message: "Invoice added successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 customer:
 *                   _id: "507f1f77bcf86cd799439012"
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   phoneNumber: "12345678901"
 *                 openingBalance: 0
 *                 totalDebt: 5000
 *                 totalCreditReceived: 0
 *                 totalDeduction: 0
 *                 closingBalance: 5000
 *                 invoices:
 *                   - invoiceNumber: "INV-001"
 *                     amount: 5000
 *                     issuedDate: "2025-03-21T10:00:00Z"
 *                     dueDate: "2025-04-20T10:00:00Z"
 *                     status: "Pending"
 *                 status: "active"
 *                 createdBy:
 *                   _id: "507f1f77bcf86cd799439013"
 *                   fullName: "Admin User"
 *                   email: "admin@example.com"
 *                 createdAt: "2025-03-21T10:00:00Z"
 *                 updatedAt: "2025-03-21T12:00:00Z"
 *       '400':
 *         description: Bad request - validation error or deleted debtor
 *       '404':
 *         description: Debtor not found
 *       '409':
 *         description: Invoice number already exists
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.post(
  "/:id/invoices",
  authenticateUser,
  authorize("write:debtors"),
  addInvoice
);

/**
 * @swagger
 * /api/debtors/{id}/recalculate-balance:
 *   post:
 *     summary: Recalculate debtor balances (totalDebt, totalCreditReceived, totalDeduction, closingBalance)
 *     tags:
 *       - Debtors
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the debtor
 *     responses:
 *       '200':
 *         description: Debtor balance recalculated successfully
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
 *                   $ref: '#/components/schemas/Debtor'
 *             example:
 *               success: true
 *               message: "Debtor balance recalculated successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 customer:
 *                   _id: "507f1f77bcf86cd799439012"
 *                   name: "John Doe"
 *                   email: "john@example.com"
 *                   phoneNumber: "123-456-7890"
 *                 openingBalance: 0
 *                 totalDebt: 1000
 *                 totalCreditReceived: 500
 *                 totalDeduction: 0
 *                 closingBalance: 500
 *                 invoices:
 *                   - invoiceNumber: "INV-001"
 *                     saleId: "507f1f77bcf86cd799439013"
 *                     amount: 1000
 *                     issuedDate: "2025-03-25T10:00:00Z"
 *                     dueDate: "2025-04-24T10:00:00Z"
 *                     initialPayment:
 *                       amount: 500
 *                       method:
 *                         _id: "507f1f77bcf86cd799439014"
 *                         name: "Cash"
 *                       date: "2025-03-26T10:00:00Z"
 *                       whtRate: 0
 *                       whtAmount: 0
 *                       ledgerTransactionId: "507f1f77bcf86cd799439015"
 *                     payments: []
 *                     cashRefund: 0
 *                     badDebtWriteOff: 0
 *                     status: "Partially Paid"
 *                 createdBy:
 *                   _id: "507f1f77bcf86cd799439016"
 *                   fullName: "Admin User"
 *                   email: "admin@example.com"
 *                 status: "active"
 *                 createdAt: "2025-03-25T09:00:00Z"
 *                 updatedAt: "2025-03-26T11:00:00Z"
 *       '400':
 *         description: Invalid Debtor ID
 *       '404':
 *         description: Debtor not found or deleted
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
  authorize("write:debtors"),
  recalculateDebtorBalance
);

/**
 * @swagger
 * /api/debtors/{id}/invoices/{invoiceId}:
 *   put:
 *     summary: Update a specific invoice for a debtor
 *     tags:
 *       - Debtors
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the debtor
 *       - in: path
 *         name: invoiceId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the invoice to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvoiceInput'
 *     responses:
 *       '200':
 *         description: Invoice updated successfully
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
 *                   $ref: '#/components/schemas/Debtor'
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Debtor or invoice not found
 *       '409':
 *         description: Invoice number already exists
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.put(
  "/:id/invoices/:invoiceId",
  authenticateUser,
  authorize("write:debtors"),
  updateInvoice
);

/**
 * @swagger
 * /api/debtors/{id}/payments:
 *   post:
 *     summary: Add a payment to a debtor or specific invoice
 *     tags:
 *       - Debtors
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the debtor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invoiceId:
 *                 type: string
 *                 description: Optional ID of the invoice to apply the payment to
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               whtRate:
 *                 type: number
 *               whtAmount:
 *                 type: number
 *               ledgerTransactionId:
 *                 type: string
 *             required:
 *               - amount
 *               - method
 *               - date
 *               - ledgerTransactionId
 *     responses:
 *       '201':
 *         description: Payment added successfully
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
 *                   $ref: '#/components/schemas/Debtor'
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Debtor or invoice not found
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.post(
  "/:id/payments",
  authenticateUser,
  authorize("write:debtors"),
  addPayment
);

/**
 * @swagger
 * /api/debtors/{id}/invoices/{invoiceId}/initial-payment:
 *   post:
 *     summary: Add or update initial payment for a debtor invoice
 *     tags:
 *       - Debtors
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the debtor
 *       - in: path
 *         name: invoiceId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the invoice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InitialPaymentInput'
 *     responses:
 *       '201':
 *         description: Initial payment added successfully
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
 *                   $ref: '#/components/schemas/Debtor'
 *       '400':
 *         description: Validation error or invalid IDs
 *       '404':
 *         description: Debtor or invoice not found
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.post(
  "/:id/invoices/:invoiceId/initial-payment",
  authenticateUser,
  authorize("write:debtors"),
  addInitialPayment
);

module.exports = router;

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
 *     DebtorInput:
 *       type: object
 *       required:
 *         - customer
 *       properties:
 *         customer:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *           description: The ID of the customer linked to this debtor
 *         openingBalance:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           description: Initial debt balance
 *         totalDebt:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           description: Total debt amount
 *         totalCreditReceived:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           description: Total payments received
 *         totalDeduction:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           description: Total deductions applied
 *         closingBalance:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           description: Current outstanding balance
 *         invoices:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InvoiceInput'
 *           description: List of invoices for the debtor
 *       example:
 *         customer: "507f1f77bcf86cd799439012"
 *         openingBalance: 0
 *         totalDebt: 0
 *         totalCreditReceived: 0
 *         totalDeduction: 0
 *         closingBalance: 0
 *         invoices: []
 *     DebtorUpdateInput:
 *       type: object
 *       properties:
 *         customer:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *           description: The ID of the customer linked to this debtor
 *         openingBalance:
 *           type: number
 *           minimum: 0
 *           description: Initial debt balance
 *         totalDebt:
 *           type: number
 *           minimum: 0
 *           description: Total debt amount
 *         totalCreditReceived:
 *           type: number
 *           minimum: 0
 *           description: Total payments received
 *         totalDeduction:
 *           type: number
 *           minimum: 0
 *           description: Total deductions applied
 *         closingBalance:
 *           type: number
 *           minimum: 0
 *           description: Current outstanding balance
 *         invoices:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InvoiceInput'
 *           description: List of invoices for the debtor
 *       example:
 *         totalDebt: 5000
 *         closingBalance: 5000
 *     InvoiceInput:
 *       type: object
 *       required:
 *         - invoiceNumber
 *         - amount
 *         - issuedDate
 *         - dueDate
 *       properties:
 *         invoiceNumber:
 *           type: string
 *           description: Unique invoice identifier
 *         saleId:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *           description: Optional reference to a Sale
 *         amount:
 *           type: number
 *           minimum: 0
 *           description: Invoice amount
 *         issuedDate:
 *           type: string
 *           format: date-time
 *           description: Date the invoice was issued
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Date the invoice is due
 *         initialPayment:
 *           $ref: '#/components/schemas/PaymentInput'
 *         payments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PaymentInput'
 *         cashRefund:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           description: Amount refunded in cash
 *         badDebtWriteOff:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           description: Amount written off as bad debt
 *         status:
 *           type: string
 *           enum: ["Pending", "Partially Paid", "Paid", "Overdue"]
 *           default: "Pending"
 *           description: Invoice status
 *       example:
 *         invoiceNumber: "INV-001"
 *         amount: 5000
 *         issuedDate: "2025-03-21T10:00:00Z"
 *         dueDate: "2025-04-20T10:00:00Z"
 *         status: "Pending"
 *     PaymentInput:
 *       type: object
 *       required:
 *         - amount
 *         - method
 *         - date
 *         - ledgerTransactionId
 *       properties:
 *         amount:
 *           type: number
 *           minimum: 0
 *           description: Payment amount
 *         method:
 *           type: string
 *           enum: ["Bank", "POS", "Cash"]
 *           description: Payment method
 *         date:
 *           type: string
 *           format: date-time
 *           description: Payment date
 *         whtRate:
 *           type: number
 *           enum: [0, 5, 10]
 *           default: 0
 *           description: Withholding tax rate
 *         whtAmount:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           description: Withholding tax amount
 *         ledgerTransactionId:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *           description: Reference to ledger transaction
 *       example:
 *         amount: 1000
 *         method: "Cash"
 *         date: "2025-03-22T12:00:00Z"
 *         whtRate: 5
 *         whtAmount: 50
 *         ledgerTransactionId: "507f1f77bcf86cd799439014"
 *     Debtor:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB document ID
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         openingBalance:
 *           type: number
 *           description: Initial debt balance
 *         totalDebt:
 *           type: number
 *           description: Total debt amount
 *         totalCreditReceived:
 *           type: number
 *           description: Total payments received
 *         totalDeduction:
 *           type: number
 *           description: Total deductions applied
 *         closingBalance:
 *           type: number
 *           description: Current outstanding balance
 *         invoices:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               invoiceNumber:
 *                 type: string
 *               saleId:
 *                 type: string
 *               amount:
 *                 type: number
 *               issuedDate:
 *                 type: string
 *                 format: date-time
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               initialPayment:
 *                 $ref: '#/components/schemas/PaymentInput'
 *               payments:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/PaymentInput'
 *               cashRefund:
 *                 type: number
 *               badDebtWriteOff:
 *                 type: number
 *               status:
 *                 type: string
 *         status:
 *           type: string
 *           enum: ["active", "deleted"]
 *           description: Debtor status
 *         createdBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *           description: Populated creator details
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         customer:
 *           _id: "507f1f77bcf86cd799439012"
 *           name: "John Doe"
 *           email: "john.doe@example.com"
 *           phoneNumber: "12345678901"
 *         openingBalance: 0
 *         totalDebt: 5000
 *         totalCreditReceived: 0
 *         totalDeduction: 0
 *         closingBalance: 5000
 *         invoices:
 *           - invoiceNumber: "INV-001"
 *             amount: 5000
 *             issuedDate: "2025-03-21T10:00:00Z"
 *             dueDate: "2025-04-20T10:00:00Z"
 *             status: "Pending"
 *         status: "active"
 *         createdBy:
 *           _id: "507f1f77bcf86cd799439013"
 *           fullName: "Admin User"
 *           email: "admin@example.com"
 *         createdAt: "2025-03-21T10:00:00Z"
 *         updatedAt: "2025-03-21T12:00:00Z"
 *     Customer:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB document ID
 *         name:
 *           type: string
 *           description: Customer name
 *         email:
 *           type: string
 *           description: Customer email
 *         phoneNumber:
 *           type: string
 *           description: Customer phone number
 *       example:
 *         _id: "507f1f77bcf86cd799439012"
 *         name: "John Doe"
 *         email: "john.doe@example.com"
 *         phoneNumber: "12345678901"
 */
