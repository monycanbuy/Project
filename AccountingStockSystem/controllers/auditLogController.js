const AuditLog = require("../models/auditLogModel");

// Get all audit logs
exports.getAuditLogs = async (req, res) => {
  try {
    const auditLogs = await AuditLog.find()
      .populate("userId", "fullName")
      .sort({ timestamp: -1 }); // Sort by timestamp in descending order (-1 = newest first)
    res.status(200).json({ success: true, data: auditLogs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching audit logs",
      error: error.message,
    });
  }
};

// Delete an audit log
exports.deleteAuditLog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLog = await AuditLog.findByIdAndDelete(id);
    if (!deletedLog) {
      return res
        .status(404)
        .json({ success: false, message: "Audit log not found" });
    }
    res.status(200).json({
      success: true,
      message: "Audit log deleted successfully",
      data: deletedLog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting audit log",
      error: error.message,
    });
  }
};
