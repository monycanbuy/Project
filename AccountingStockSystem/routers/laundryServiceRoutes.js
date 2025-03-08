// routes/laundryServiceRoutes.js
const express = require("express");
const router = express.Router();
const laundryServiceController = require("../controllers/laundryServiceController");
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     LaundryService:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the laundry service
 *         serviceName:
 *           type: string
 *           description: The name of the laundry service
 *         description:
 *           type: string
 *           description: A detailed description of the laundry service
 *         price:
 *           type: number
 *           description: The price of the laundry service
 *           example: 5.0
 */

/**
 * @swagger
 * /api/laundry-services:
 *   get:
 *     summary: Get all laundry services
 *     description: Retrieve a list of all laundry services available.
 *     responses:
 *       200:
 *         description: Successfully retrieved all laundry services.
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
 *                     $ref: '#/components/schemas/LaundryService'
 *       500:
 *         description: Error fetching laundry services.
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
 *                   example: 'Error fetching laundry services'
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:laundryService"),
  laundryServiceController.getAllLaundryServices
);

/**
 * @swagger
 * /api/laundry-services:
 *   post:
 *     summary: Create a new laundry service
 *     description: Create a new laundry service with a name, description, and price.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceType:
 *                 type: string
 *                 example: "Ironing"
 *               price:
 *                 type: number
 *                 example: 5.0
 *     responses:
 *       201:
 *         description: Successfully created the laundry service.
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
 *                   example: "Laundry service created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/LaundryService'
 *       500:
 *         description: Error creating laundry service.
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:laundryService"),
  laundryServiceController.createLaundryService
);

/**
 * @swagger
 * /api/laundry-services/{id}:
 *   put:
 *     summary: Update an existing laundry service
 *     description: Update the name, description, or price of an existing laundry service.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the laundry service to update.
 *         schema:
 *           type: string
 *           example: 60c72b2f9e1d5a36fc8b4f47
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceType:
 *                 type: string
 *                 example: "Ironing"
 *               price:
 *                 type: number
 *                 example: 6.0
 *     responses:
 *       200:
 *         description: Successfully updated the laundry service.
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
 *                   example: "Laundry service updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/LaundryService'
 *       404:
 *         description: Laundry service not found.
 *       500:
 *         description: Error updating laundry service.
 */
router.put(
  "/:id",
  authenticateUser,
  authorize("update:laundryService"),
  laundryServiceController.updateLaundryService
);

/**
 * @swagger
 * /api/laundry-services/{id}:
 *   delete:
 *     summary: Delete a laundry service
 *     description: Delete a specific laundry service by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the laundry service to delete.
 *         schema:
 *           type: string
 *           example: 60c72b2f9e1d5a36fc8b4f47
 *     responses:
 *       200:
 *         description: Successfully deleted the laundry service.
 *       404:
 *         description: Laundry service not found.
 *       500:
 *         description: Error deleting laundry service.
 */
router.delete(
  "/:id",
  authenticateUser,
  authorize("delete:laundryService"),
  laundryServiceController.deleteLaundryService
);

module.exports = router;
