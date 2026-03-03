const mongoose = require('mongoose');

const Bookchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
}, {
  timestamps: true, // Tự động tạo trường createdAt, updatedAt
});

const Book = mongoose.model('Book', Bookchema);
module.exports = Book;