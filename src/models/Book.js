const mongoose = require('mongoose');

const Bookchema = mongoose.Schema({
  title: { type: String, required: true },
  // Thay thế chỗ khai báo author cũ bằng đoạn này:
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author', // Trỏ tới bảng Author vừa tạo
    required: true
  },
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