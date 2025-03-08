const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const frontOfficeSaleSchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now, // Automatically sets to current date and time when document is created
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"], // Assuming sales amount can't be negative
    },
    assignedPersonnel: {
      type: String,
      required: false,
    },
    notes: {
      type: String, // New field to store additional notes
      required: false, // Optional field
      maxlength: [500, "Notes cannot exceed 500 characters"], // Limit note length
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Creating the model
module.exports = mongoose.model("FrontOfficeSale", frontOfficeSaleSchema);

//module.exports = FrontOfficeSale;
