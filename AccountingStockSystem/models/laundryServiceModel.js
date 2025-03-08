const mongoose = require("mongoose");

// Define the schema for LaundryService
const laundryServiceSchema = new mongoose.Schema(
  {
    serviceType: { type: String, required: true }, // e.g., "Dry Cleaning"
    price: { type: Number, required: true }, // e.g., 500
  },
  { timestamps: true }
);

// Export the model
module.exports = mongoose.model("LaundryService", laundryServiceSchema);
//module.exports = LaundryService;
