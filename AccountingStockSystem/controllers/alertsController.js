const Alert = require("../models/alertModel");
const {
  createAlertSchema,
  updateAlertSchema,
} = require("../middlewares/validator");

// Get Unread Alerts
// Array to store connected SSE clients

// Array to store connected SSE clients

// Array to store connected SSE clients
const clients = [];
exports.getSSEToken = async (req, res) => {
  try {
    // req.user is populated by your authenticateUser middleware
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Generate a short-lived, single-use token
    const sseToken = jwt.sign(
      { userId: req.user.id }, // Include the user ID
      process.env.JWT_SECRET, // Use the *same* secret as your main JWTs!
      { expiresIn: "1m" } //  Short expiration! (e.g., 1 minute)
    );

    res.status(200).json({ success: true, sseToken });
  } catch (error) {
    console.error("Error generating SSE token:", error);
    res
      .status(500)
      .json({ success: false, message: "Error generating SSE token" });
  }
};

exports.getUnreadAlertsSSE = (req, res) => {
  console.log("SSE endpoint hit!");
  // 1. Get the SSE token from the query parameter
  const sseToken = req.query.token;

  if (!sseToken) {
    console.log("SSE: No token provided");
    return res.status(401).send("Unauthorized: No token"); //  Close connection immediately
  }

  let userId;
  try {
    // 2. Verify the SSE token
    const decoded = jwt.verify(sseToken, process.env.JWT_SECRET);
    userId = decoded.userId; // Extract the user ID
    console.log("SSE: Token verified, user ID:", userId);
  } catch (error) {
    console.error("SSE: Invalid token:", error);
    return res.status(401).send("Unauthorized: Invalid token"); // Close connection
  }

  // --- (Rest of your SSE setup, using userId instead of req.user.id) ---
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // For Nginx
  res.flushHeaders();

  req.setTimeout(0);

  const clientId = Date.now();
  clients.push({ id: clientId, res });
  console.log(
    `Client connected: ${clientId}.  Total clients: ${clients.length}`
  );

  //   const userId = req.user ? req.user.id : null; // NO LONGER NEEDED - use decoded userId
  console.log("User ID for SSE:", userId);

  let query = { read: false };
  if (userId) {
    query.user = userId; // Now we *always* have a userId (from the token)
  }

  Alert.find(query)
    .populate("user", "fullName")
    .then((initialAlerts) => {
      console.log(
        `Sending initial alerts: ${initialAlerts.length}`,
        initialAlerts
      );
      res.write(`data: ${JSON.stringify(initialAlerts)}\n\n`);
    })
    .catch((err) => {
      console.error("Error fetching initial alerts:", err);
      res.write(
        `event: error\ndata: ${JSON.stringify({
          message: "Error fetching initial alerts",
          error: err.message,
        })}\n\n`
      );
    });

  const newAlertListener = (newAlert) => {
    // Use the userId extracted from the token
    if (userId && newAlert.user && newAlert.user.toString() === userId) {
      console.log("Sending new alert:", newAlert);
      clients.forEach((client) => {
        if (client.res.writable) {
          client.res.write(`data: ${JSON.stringify(newAlert)}\n\n`);
        }
      });
    }
    //No need of else, because we are sending to a particular user.
  };

  Alert.on("newAlert", newAlertListener);

  req.on("close", () => {
    console.log(`Client disconnected: ${clientId}`);
    clients.splice(
      clients.findIndex((client) => client.id === clientId),
      1
    );
    Alert.removeListener("newAlert", newAlertListener);
    console.log(`Remaining clients: ${clients.length}`);
  });
};

// Get unread alerts for a user
exports.getUnreadAlerts = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from authentication middleware
    const unreadAlerts = await Alert.find({ user: userId, read: false }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: unreadAlerts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching unread alerts",
      error: error.message,
    });
  }
};

// Mark an alert as read
exports.markAlertAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAlert = await Alert.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!updatedAlert) {
      return res
        .status(404)
        .json({ success: false, message: "Alert not found" });
    }
    res.status(200).json({
      success: true,
      message: "Alert marked as read",
      data: updatedAlert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking alert as read",
      error: error.message,
    });
  }
};

// Get all alerts
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().populate("user", "fullName");
    // You can log here if you need to see the populated alerts
    console.log("Populated alerts:", JSON.stringify(alerts[0], null, 2));
    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching alerts",
      error: error.message,
    });
  }
};

// Create a new alert
// exports.createAlert = async (req, res) => {
//   try {
//     const { error, value } = createAlertSchema.validate(req.body);
//     if (error) {
//       return res
//         .status(400)
//         .json({ success: false, message: error.details[0].message });
//     }

//     // Assuming user ID is available from authentication middleware
//     value.user = req.user.id;

//     const newAlert = await Alert.create(value);
//     res.status(201).json({
//       success: true,
//       message: "Alert created successfully",
//       data: newAlert,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error creating alert",
//       error: error.message,
//     });
//   }
// };

// Create a new alert
exports.createAlert = async (req, res) => {
  try {
    const { error, value } = createAlertSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({ success: false, message: errorMessage });
    }

    value.user = req.user.id; // Assuming user ID from authentication

    const newAlert = new Alert(value);
    const savedAlert = await newAlert.save();

    // *Emit* the 'newAlert' event after saving
    Alert.emit("newAlert", savedAlert);

    res.status(201).json({
      success: true,
      message: "Alert created successfully",
      data: savedAlert,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    console.error("Error creating alert:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while creating alert.",
      error: error.message,
    });
  }
};

// // Update an alert
// exports.updateAlert = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // 1. Validate the ID format (if using MongoDB ObjectIDs)
//     if (!/^[0-9a-fA-F]{24}$/.test(id)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid alert ID format." });
//     }

//     // 2. Validate the request body using Joi (or your chosen validation library)
//     const { error, value } = updateAlertSchema.validate(req.body);
//     if (error) {
//       // Joi error messages are often arrays of objects; extract the relevant message
//       const errorMessage = error.details
//         .map((detail) => detail.message)
//         .join(", "); // Join multiple errors
//       return res.status(400).json({ success: false, message: errorMessage });
//     }

//     // 3. Find and update the alert (use findByIdAndUpdate for atomic updates)
//     const updatedAlert = await Alert.findByIdAndUpdate(
//       id,
//       value,
//       { new: true, runValidators: true } // 'new: true' returns the updated document, runValidators ensures Mongoose schema validation
//     );

//     // 4. Check if the alert was found
//     if (!updatedAlert) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Alert not found." });
//     }

//     // 5. Success response
//     res.status(200).json({
//       success: true,
//       message: "Alert updated successfully",
//       data: updatedAlert,
//     });
//   } catch (error) {
//     // 6. Detailed Error Handling (Catch specific errors)

//     // Handle Mongoose CastError (invalid ID)
//     if (error.name === "CastError") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid alert ID." });
//     }

//     // Handle Mongoose ValidationError (schema validation failed)
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((val) => val.message);
//       return res
//         .status(400)
//         .json({ success: false, message: messages.join(", ") });
//     }

//     // Handle other potential errors (e.g., database connection issues)
//     console.error("Error updating alert:", error); // Log the full error for debugging
//     res.status(500).json({
//       success: false,
//       message: "Internal server error while updating alert.", // More specific message
//       error: error.message, // Still include the original error message
//     });
//   }
// };

// Update an alert
exports.updateAlert = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid alert ID format." });
    }

    const { error, value } = updateAlertSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({ success: false, message: errorMessage });
    }

    const updatedAlert = await Alert.findByIdAndUpdate(id, value, {
      new: true,
      runValidators: true,
    });

    if (!updatedAlert) {
      return res
        .status(404)
        .json({ success: false, message: "Alert not found." });
    }

    // *Emit* the 'newAlert' event after updating
    Alert.emit("newAlert", updatedAlert);

    res.status(200).json({
      success: true,
      message: "Alert updated successfully",
      data: updatedAlert,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid alert ID." });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }

    console.error("Error updating alert:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating alert.",
      error: error.message,
    });
  }
};

// Delete an alert
exports.deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAlert = await Alert.findByIdAndDelete(id);
    if (!deletedAlert) {
      return res
        .status(404)
        .json({ success: false, message: "Alert not found" });
    }

    res.status(200).json({
      success: true,
      message: "Alert deleted successfully",
      data: deletedAlert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting alert",
      error: error.message,
    });
  }
};
