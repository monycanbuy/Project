// routes/alertRoutes.js
const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware"); // Import authorize
const alertController = require("../controllers/alertsController");

/**
 * @swagger
 * tags:
 *   name: Alert
 *   description: API endpoints for managing alerts
 */

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Get all alerts
 *     tags: [Alert]
 *     security:
 *       - bearerAuth: []  # Use a consistent security definition name
 *     responses:
 *       200:
 *         description: Successful operation
 *       401:  # Add Unauthorized response
 *         description: Unauthorized
 *       403: # Add Forbidden response
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:alerts"), // Add authorization
  alertController.getAlerts
);

/**
 * @swagger
 * /api/alerts/unread:
 *   get:
 *     summary: Get unread alerts for the authenticated user
 *     tags: [Alert]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation, returns unread alerts
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
  "/unread",
  authenticateUser,
  authorize("read:alerts"), // Use same permission as getAlerts, generally
  alertController.getUnreadAlerts
);

/**
 * @swagger
 * /api/alerts/unread/sse:
 *   get:
 *     summary: Get unread alerts via Server-Sent Events (SSE)
 *     tags: [Alert]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - text/event-stream
 *     responses:
 *       200:
 *         description: Successful SSE connection
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
  "/unread/sse",
  authenticateUser,
  authorize("read:alerts"), // Use same permission, generally
  alertController.getUnreadAlertsSSE
);

/**
 * @swagger
 * /api/alerts/sse-token:
 *   get:
 *     summary: Get an SSE connection token
 *     tags: [Alert]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation, returns an SSE token
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
  "/sse-token",
  authenticateUser,
  authorize("read:alerts"), //Typically, if you can read alerts, you can get an SSE token.
  alertController.getSSEToken
);

/**
 * @swagger
 * /api/alerts:
 *   post:
 *     summary: Create a new alert
 *     tags: [Alert]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alert'
 *     responses:
 *       201:
 *         description: Alert created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authenticateUser,
  authorize("create:alerts"), // Add authorization for creating alerts
  alertController.createAlert
);

/**
 * @swagger
 * /api/alerts/{id}:
 *   patch:
 *     summary: Update an alert
 *     tags: [Alert]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the alert to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alert'
 *     responses:
 *       200:
 *         description: Alert updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Alert not found
 *       500:
 *         description: Internal server error
 */
// Changed from PUT to PATCH for partial updates
router.patch(
  "/:id",
  authenticateUser,
  authorize("update:alerts"), // Add authorization for updating alerts
  alertController.updateAlert
);

/**
 * @swagger
 * /api/alerts/{id}/markAsRead:
 *   patch:
 *     summary: Mark an alert as read
 *     tags: [Alert]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the alert to mark as read
 *     responses:
 *       200:
 *         description: Alert marked as read successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Alert not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:id/markAsRead",
  authenticateUser,
  authorize("update:alerts"), //  Marking as read is an update.
  alertController.markAlertAsRead
);

/**
 * @swagger
 * /api/alerts/{id}:
 *   delete:
 *     summary: Delete an alert
 *     tags: [Alert]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the alert to delete
 *     responses:
 *       200:
 *         description: Alert deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Alert not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authenticateUser,
  authorize("delete:alerts"), // Add authorization for deleting alerts
  alertController.deleteAlert
);

module.exports = router;
