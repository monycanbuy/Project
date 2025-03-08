// hallTypesRouter.js
const express = require("express");
const router = express.Router();
const hallTypesController = require("../controllers/hallTypesController");
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Hall Types
 *   description: API to manage hall types
 */

/**
 * @swagger
 * /api/hall-types:
 *   get:
 *     summary: Retrieve all hall types
 *     tags: [Hall Types]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of hall types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 halls:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hall'
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:halltypes"),
  hallTypesController.getAllHallTypes
);

/**
 * @swagger
 * /api/hall-types:
 *   post:
 *     summary: Create a new hall
 *     tags: [Hall Types]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the hall
 *               price:
 *                 type: number
 *                 description: The price for booking the hall
 *     responses:
 *       201:
 *         description: The hall was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 hall:
 *                   $ref: '#/components/schemas/Hall'
 *       400:
 *         description: Bad request - validation error
 *       409:
 *         description: Hall name already exists
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:halltypes"),
  hallTypesController.createHallType
);

/**
 * @swagger
 * /api/hall-types/{hallId}:
 *   put:
 *     summary: Update a hall
 *     tags: [Hall Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hallId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the hall to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the hall (optional for update)
 *               price:
 *                 type: number
 *                 description: The new price of the hall (optional for update)
 *     responses:
 *       200:
 *         description: The hall was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 hall:
 *                   $ref: '#/components/schemas/Hall'
 *       400:
 *         description: Bad request - validation error
 *       404:
 *         description: Hall not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:hallId",
  authenticateUser,
  authorize("update:halltypes"),
  hallTypesController.updateHallType
);

/**
 * @swagger
 * /api/hall-types/{hallId}:
 *   delete:
 *     summary: Delete a hall type
 *     tags: [Hall Types]
 *     parameters:
 *       - in: path
 *         name: hallId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the hall to delete
 *     responses:
 *       200:
 *         description: The hall type was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 hall:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     hallType:
 *                       type: string
 *       404:
 *         description: Hall not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:hallId",
  authenticateUser,
  authorize("delete:halltypes"),
  hallTypesController.deleteHallType
);

module.exports = router;
