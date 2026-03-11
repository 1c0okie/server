const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  
  // 1. LIÊN KẾT BẢNG (Tác giả và Thể loại)
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author', // Trỏ tới bảng Author
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Trỏ tới bảng Category thay vì dùng String
    required: true 
  },

  // 2. THÔNG TIN CHI TIẾT SÁCH (Khớp với file CSV)
  description: { type: String },
  publisher: { type: String, default: 'Đang cập nhật' }, // Nhà xuất bản
  publishYear: { type: Number },                         // Năm xuất bản
  pages: { type: Number },                               // Số trang
  image: { type: String, required: true },               // Link ảnh bìa sách

  // 3. THÔNG TIN BÁN HÀNG (E-commerce)
  price: { type: Number, required: true },               // Giá gốc (Ví dụ: 100000)
  discount: { type: Number, default: 0 },                // Phần trăm giảm giá (Ví dụ: 20%)
  countInStock: { type: Number, default: 0 },            // Tồn kho (Rất quan trọng để biết sách còn hay hết)
  
  // 4. THỐNG KÊ
  rating: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },                    // Số lượng đã bán
}, {
  timestamps: true, // Tự động tạo trường createdAt, updatedAt
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;