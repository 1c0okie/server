const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  orderid: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['preparing', 'shipping', 'delivered', 'failed'], default: 'preparing' },
  trackingCode: { type: String }, // Mã vận đơn
  deliveredAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);