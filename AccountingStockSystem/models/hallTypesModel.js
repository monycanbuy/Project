// models/hallModel.js
const mongoose = require("mongoose");
//const Schema = mongoose.Schema;

const hallSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    // Add other relevant fields
  },
  {
    timestamps: true,
    // toJSON: {
    //   virtuals: true,
    // },
    // toObject: {
    //   virtuals: true,
    // },
  }
);

// hallSchema.virtual("totalAmount").get(function () {
//   return this.price;
// });

module.exports = mongoose.model("Hall", hallSchema);
//module.exports = Hall;
