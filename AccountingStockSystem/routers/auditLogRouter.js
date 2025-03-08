const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");
const auditLogController = require("../controllers/auditLogController");

/**
 * @swagger
 * tags:
 *   name: AuditLog
 *   description: API endpoints for managing audit logs
 */

/**
 * @swagger
 * /api/auditlogs:
 *   get:
 *     summary: Get all audit logs
 *     tags: [AuditLog]
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:auditlogs"),
  auditLogController.getAuditLogs
);

/**
 * @swagger
 * /api/auditlogs/{id}:
 *   delete:
 *     summary: Delete an audit log
 *     tags: [AuditLog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the audit log to delete
 *     responses:
 *       200:
 *         description: Audit log deleted successfully
 *       404:
 *         description: Audit log not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authenticateUser,
  authorize("delete:auditlogs"),
  auditLogController.deleteAuditLog
);

module.exports = router;
