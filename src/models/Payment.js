const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderid: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  method: { type: String, enum: ['COD', 'VNPay', 'Momo'], required: true },
  status: { type: String, enum: ['unpaid', 'paid', 'failed', 'refunded'], default: 'unpaid' },
  paidAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);