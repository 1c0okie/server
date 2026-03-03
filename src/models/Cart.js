const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [
    {
      bookid: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);