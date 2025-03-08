// paymentMethodRouter.js
const express = require("express");
const router = express.Router();
const paymentMethodController = require("../controllers/paymentMethodController");
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Payment Methods
 *   description: API endpoints for managing payment methods
 */

/**
 * @swagger
 * /api/payment-methods:
 *   post:
 *     summary: Create a new payment method
 *     tags:
 *       - Payment Methods
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Cash"
 *     responses:
 *       '201':
 *         description: Payment method created successfully
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
 *                   example: Payment method created successfully
 *                 paymentMethod:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                   example:
 *                     id: "6458cf6c8b9bff1e4a77a5b7"
 *                     name: "cash"
 *       '400':
 *         description: Validation error
 *       '409':
 *         description: Payment method already exists
 *       '500':
 *         description: Internal server error
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:paymentmethod"),
  paymentMethodController.createPaymentMethod
); // Ensure this line ends with a semicolon

/**
 * @swagger
 * /api/payment-methods:
 *   get:
 *     summary: Get all payment methods
 *     tags:
 *       - Payment Methods
 *     responses:
 *       '200':
 *         description: List of payment methods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                 example:
 *                   id: "6458cf6c8b9bff1e4a77a5b7"
 *                   name: "cash"
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:paymentmethod"),
  paymentMethodController.getAllPaymentMethods
); // Ensure this line ends with a semicolon

/**
 * @swagger
 * /api/payment-methods/{paymentMethodId}:
 *   put:
 *     summary: Update a payment method
 *     tags:
 *       - Payment Methods
 *     parameters:
 *       - in: path
 *         name: paymentMethodId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment method to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Credit Card"
 *     responses:
 *       '200':
 *         description: Payment method updated successfully
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
 *                   example: Payment method updated successfully
 *                 paymentMethod:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                   example:
 *                     id: "6458cf6c8b9bff1e4a77a5b7"
 *                     name: "credit card"
 *       '400':
 *         description: Validation error
 *       '404':
 *         description: Payment method not found
 *       '500':
 *         description: Internal server error
 */
router.put(
  "/:paymentMethodId",
  authenticateUser,
  authorize("update:paymentmethod"),
  paymentMethodController.updatePaymentMethod
);

/**
 * @swagger
 * /api/payment-methods/{paymentMethodId}:
 *   delete:
 *     summary: Delete a payment method
 *     tags:
 *       - Payment Methods
 *     parameters:
 *       - in: path
 *         name: paymentMethodId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment method to delete
 *     responses:
 *       '200':
 *         description: Payment method deleted successfully
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
 *                   example: Payment method deleted successfully
 *                 paymentMethod:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                   example:
 *                     id: "6458cf6c8b9bff1e4a77a5b7"
 *                     name: "cash"
 *       '404':
 *         description: Payment method not found
 *       '500':
 *         description: Internal server error
 */
router.delete(
  "/:paymentMethodId",
  authenticateUser,
  authorize("delete:paymentmethod"),
  paymentMethodController.deletePaymentMethod
);

module.exports = router; // Ensure this line ends with a semicolon
