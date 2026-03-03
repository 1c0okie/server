const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookid: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

// Đảm bảo 1 User chỉ review 1 Book 1 lần (Compound Index)
reviewSchema.index({ userid: 1, bookid: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
