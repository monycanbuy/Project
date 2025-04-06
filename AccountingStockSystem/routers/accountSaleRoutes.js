const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");
const {
  getAccountSales,
  createAccountSale,
  updateAccountSale,
  deleteAccountSale,
} = require("../controllers/accountSalesController");

/**
 * @swagger
 * /api/account-sales:
 *   get:
 *     summary: Get all account sales
 *     tags:
 *       - AccountSales
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AccountSale'
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:account-sales"),
  getAccountSales
);

/**
 * @swagger
 * /api/account-sales:
 *   post:
 *     summary: Create a new account sale
 *     tags:
 *       - AccountSales
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountSaleInput'
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:account-sales"),
  createAccountSale
);

/**
 * @swagger
 * /api/account-sales/{id}:
 *   put:
 *     summary: Update an account sale
 *     tags:
 *       - AccountSales
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountSaleUpdateInput'
 */
router.put(
  "/:id",
  authenticateUser,
  authorize("write:account-sales"),
  updateAccountSale
);

/**
 * @swagger
 * /api/account-sales/{id}:
 *   delete:
 *     summary: Cancel an account sale
 *     tags:
 *       - AccountSales
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 */
router.delete(
  "/:id",
  authenticateUser,
  authorize("write:account-sales"),
  deleteAccountSale
);

module.exports = router;

// Add Swagger components (similar to debtorRoutes.js, omitted for brevity)
