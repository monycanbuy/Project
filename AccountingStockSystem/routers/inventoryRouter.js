const express = require("express");
const router = express.Router();
const upload = require("../middlewares/fileUpload");
const inventoryController = require("../controllers/inventoryController");
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");
const { startCronJob } = require("../middlewares/cronJobs");

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: API endpoints for managing inventories
 */

/**
 * @swagger
 * /api/inventories:
 *   get:
 *     summary: Get all inventories
 *     tags: [Inventory]
 *     description: Retrieve a list of all inventories, with optional filtering and pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: lowStock
 *         schema:
 *           type: integer
 *         description: Filter by stock quantity less than or equal to this value
 *       - in: query
 *         name: nearExpiry
 *         schema:
 *           type: integer
 *         description: Filter by expiry date within this many days
 *       - in: query
 *         name: perishable
 *         schema:
 *           type: boolean
 *         description: Filter by perishable items (true/false)
 *       - in: query
 *         name: locationName
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by location name(s)
 *     responses:
 *       200:
 *         description: Successful retrieval of inventories
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
 *                     $ref: '#/components/schemas/Inventory' # Reference to your Inventory schema
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 alerts:
 *                   $ref: '#/components/schemas/AlertSummary'
 *       500:
 *         description: Error fetching inventories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:inventory"),
  inventoryController.getInventories
);

/**
 * @swagger
 * /api/inventories:
 *   post:
 *     summary: Create a new inventory
 *     tags: [Inventory]
 *     description: Create a new inventory item.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryInput' # Schema for creating inventory (without _id)
 *     responses:
 *       201:
 *         description: Inventory created successfully
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
 *                   $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Bad request (validation errors)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error creating inventory
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/",
  authenticateUser,
  upload.single("image"),
  authorize("write:inventory"),
  inventoryController.createInventory
);

/**
 * @swagger
 * /api/inventories/{id}:
 *   put:
 *     summary: Update an inventory
 *     tags: [Inventory]
 *     description: Update an existing inventory item.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the inventory to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryUpdateInput' # Schema for updating (optional fields)
 *     responses:
 *       200:
 *         description: Inventory updated successfully
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
 *                   $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Bad request (validation errors)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Inventory not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error updating inventory
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  "/:id",
  authenticateUser,
  upload.single("image"),
  authorize("update:inventory"),
  inventoryController.updateInventory
);

/**
 * @swagger
 * /api/inventories/{id}:
 *   delete:
 *     summary: Delete an inventory
 *     tags: [Inventory]
 *     description: Delete an inventory item.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the inventory to delete
 *     responses:
 *       200:
 *         description: Inventory deleted successfully
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
 *                   $ref: '#/components/schemas/Inventory'
 *       404:
 *         description: Inventory not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error deleting inventory
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  "/:id",
  authenticateUser,
  authorize("delete:inventory"),
  inventoryController.deleteInventory
);

/**
 * @swagger
 * /api/inventories/reports/low-stock:
 *   get:
 *     summary: Get low stock report
 *     tags: [Inventory, Reports]
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */
router.get(
  "/reports/low-stock",
  authenticateUser,
  inventoryController.getLowStockReport
);

/**
 * @swagger
 * /api/inventories/reports/value-by-category:
 *   get:
 *     summary: Get inventory value by category report
 *     tags: [Inventory, Reports]
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */
router.get(
  "/reports/value-by-category",
  authenticateUser,
  inventoryController.getInventoryValueByCategory
);

/**
 * @swagger
 * /api/inventories/reports/near-expiry:
 *   get:
 *     summary: Get near expiry report
 *     tags: [Inventory, Reports]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: Number of days until expiry
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */
router.get(
  "/reports/near-expiry",
  authenticateUser,
  inventoryController.getNearExpiryReport
);

/**
 * @swagger
 * /api/inventories/reports/inventory-by-location:
 *   get:
 *     summary: Get inventory by location
 *     tags: [Inventory, Reports]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: Number of days until expiry
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */
router.get(
  "/reports/inventory-by-location",
  authenticateUser,
  inventoryController.getInventoryByLocation
);

/**
 * @swagger
 * /api/inventories/reports/total-count:
 *   get:
 *     summary: Get total inventory count
 *     tags: [Inventory, Reports]
 *     responses:
 *       200:
 *         description: Successful operation, returns the total count of inventory items.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: The total number of inventory items.
 *       500:
 *         description: Internal server error
 */
router.get(
  "/reports/total-count",
  authenticateUser,
  inventoryController.getTotalInventoryCount
);

/**
 * @swagger
 * /api/inventories/reports/total-value:
 *   get:
 *     summary: Get total inventory value
 *     tags: [Inventory, Reports]
 *     responses:
 *       200:
 *         description: Successful operation, returns the total value of all inventory.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalValue:
 *                       type: number
 *                       format: float
 *                       description: The total value of all inventory items.
 *       500:
 *         description: Internal server error
 */
router.get(
  "/reports/total-value",
  authenticateUser,
  inventoryController.getTotalInventoryValue
);

/**
 * @swagger
 * /api/inventories/reports/daily-sales:
 *   get:
 *     summary: Get daily sales data
 *     tags: [Inventory, Reports]
 *     description: Retrieve daily sales data with optional date range filtering.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering sales (YYYY-MM-DD). Optional.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering sales (YYYY-MM-DD). Defaults to today if omitted.
 *     responses:
 *       200:
 *         description: Successful operation, returns an array of daily sales data.
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
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: The date of the sales (YYYY-MM-DD).
 *                       totalSales:
 *                         type: number
 *                         description: The total sales amount for that day.
 *       400:
 *         description: Bad request (invalid date format or range)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 */
router.get(
  "/reports/daily-sales",
  authenticateUser,
  inventoryController.getDailySales
);

/**
 * @swagger
 * /api/inventories/reports/total-inventory-sales:
 *   get:
 *     summary: Get total inventory value and total daily sales.
 *     tags: [Inventory, Reports]
 *     responses:
 *       200:
 *         description: Successful operation, returns total inventory value and total daily sales.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalValue:
 *                       type: number
 *                       description: The total value of all inventory.
 *                     totalDailySales:
 *                       type: number
 *                       description: The total sales for the current day.
 *       500:
 *         description: Internal server error
 */
router.get(
  "/reports/total-inventory-sales",
  authenticateUser,
  inventoryController.getTotalInventoryAndSales
); // New route

/**
 * @swagger
 * /api/inventories/reports/total-daily-sales:
 *   get:
 *     summary: Get total sales for the current day.
 *     tags: [Inventory, Reports]
 *     responses:
 *       200:
 *         description: Successful operation. Returns the total sales for today.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalDailySales:
 *                       type: number
 *                       format: float
 *                       description: The total sales amount for the current day.
 *       401:
 *         description: Unauthorized (user not authenticated).
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/reports/total-daily-sales",
  authenticateUser,
  inventoryController.getTotalDailySales
); // New route

/**
 * @swagger
 * /api/inventories/reports/total-sales:
 *   get:
 *     summary: Get the all-time total sales amount.
 *     tags: [Inventory, Reports]
 *     responses:
 *       200:
 *         description: Successful operation. Returns the total sales amount.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalSales:
 *                       type: number
 *                       format: float  # Or integer, depending on your data
 *                       description: The all-time total sales amount.
 *       401:
 *         description: Unauthorized (user not authenticated).
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/reports/total-sales",
  authenticateUser,
  inventoryController.getTotalSales
);

/**
 * @swagger
 * /api/inventories/reports/top-selling-items:
 *   get:
 *     summary: Get top selling items
 *     tags: [Inventory, Reports]
 *     description: Retrieve a list of top-selling items based on total sales revenue.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of top items to return (default is 5).
 *     responses:
 *       200:
 *         description: Successful operation, returns an array of top-selling items.
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
 *                       name:
 *                         type: string
 *                         description: The name of the item.
 *                       totalSales:
 *                         type: number
 *                         description: The total sales revenue for the item.
 *                       totalQuantity:
 *                         type: number
 *                         description: The total quantity sold of the item.
 *                 message:
 *                   type: string
 *                   description: Optional message if no data is available.
 *       401:
 *         description: Unauthorized (user not authenticated)
 *       500:
 *         description: Internal server error
 */
router.get(
  "/reports/top-selling-items",
  authenticateUser,
  inventoryController.getTopSellingItems
);

module.exports = router;
