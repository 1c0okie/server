const mongoose = require('mongoose');
const dotenv = require('dotenv');
const books = require('./data/books'); // Import dữ liệu bước 1
const Book = require('./src/models/Book'); // Import Model
const connectDB = require('./src/config/db'); // Import hàm kết nối

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Xóa sạch dữ liệu cũ để tránh trùng lặp
    await Book.deleteMany();

    // 2. Chèn dữ liệu mới
    await Book.insertMany(books);

    console.log('✅ Đã nạp dữ liệu thành công!');
    process.exit();
  } catch (error) {
    console.error(`❌ Lỗi: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Book.deleteMany();
    console.log('🗑️ Đã xóa sạch dữ liệu!');
    process.exit();
  } catch (error) {
    console.error(`❌ Lỗi: ${error.message}`);
    process.exit(1);
  }
};

// Kiểm tra tham số dòng lệnh để quyết định Nhập hay Xóa
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}