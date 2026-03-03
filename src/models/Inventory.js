const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  bookid: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, unique: true },
  stockQuantity: { type: Number, default: 0, min: 0 },
  soldQuantity: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['in_stock', 'out_of_stock', 'discontinued'], 
    default: 'in_stock' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);