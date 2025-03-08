const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Get all locations
 *     tags:
 *       - Locations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all locations
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:locations"),
  locationController.getLocations
);

/**
 * @swagger
 * /api/locations/{id}:
 *   get:
 *     summary: Get a location by ID
 *     tags:
 *       - Locations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The location ID
 *     responses:
 *       200:
 *         description: Returns the location
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */
router.get(
  "/:id",
  authenticateUser,
  authorize("read:locations"),
  locationController.getLocationById
);

/**
 * @swagger
 * /api/locations:
 *   post:
 *     summary: Create a new location
 *     tags:
 *       - Locations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Location details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: ["Kitchen", "Storeroom", "Shelf", "Other"]
 *               capacity:
 *                 type: number
 *             required:
 *               - name
 *               - type
 *     responses:
 *       201:
 *         description: Location created successfully
 *       400:
 *         description: Bad request, invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:locations"),
  locationController.createLocation
);

/**
 * @swagger
 * /api/locations/{id}:
 *   put:
 *     summary: Update a location by ID
 *     tags:
 *       - Locations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The location ID
 *     requestBody:
 *       description: Location details to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: ["Kitchen", "Storeroom", "Shelf", "Other"]
 *               capacity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       400:
 *         description: Bad request, invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  authenticateUser,
  authorize("update:locations"),
  locationController.updateLocation
);

/**
 * @swagger
 * /api/locations/{id}:
 *   delete:
 *     summary: Delete a location by ID
 *     tags:
 *       - Locations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The location ID
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  authenticateUser,
  authorize("delete:locations"),
  locationController.deleteLocation
);

module.exports = router;
