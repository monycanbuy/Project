const jwt = require("jsonwebtoken");

const checkUnverified = (req, res, next) => {
  // Extract token from Authorization header
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    // Check if the user is unverified
    if (!decoded.verified) {
      req.user = decoded; // Store user data in request
      return next();
    }

    // If user is already verified, block the request
    return res
      .status(403)
      .json({ success: false, message: "Already verified" });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { checkUnverified };
