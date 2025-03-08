// paymentMethodModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentMethodSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
});

module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);
// const PaymentMethod = mongoose.model('PaymentMethod', PaymentMethodSchema);

// module.exports = PaymentMethod;
