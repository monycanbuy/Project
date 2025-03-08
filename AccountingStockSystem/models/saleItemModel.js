// models/saleItemModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleItemSchema = new Schema({
    sale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
    dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true }, // Total for this item (quantity * unitPrice)
    discount: { type: Number, default: 0 } // Item-specific discount
});

const SaleItem = mongoose.model('SaleItem', saleItemSchema);
module.exports = SaleItem;