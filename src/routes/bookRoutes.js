const express = require('express');
const router = express.Router();

// 1. Import TẤT CẢ các hàm từ Controller
const { 
  getBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook 
} = require('../controllers/bookController');

// 2. Import Middleware để bảo vệ Route Admin
// (Đảm bảo đường dẫn '../middlewares/authMiddleware' là chính xác với dự án của bạn)
const { protect, admin } = require('../middlewares/authMiddleware');

// ==========================================
// 3. ĐỊNH NGHĨA CÁC ROUTES
// ==========================================

// Route gốc: /api/books
router.route('/')
  .get(getBooks)                         // Public: Ai cũng xem được danh sách sách
  .post(protect, admin, createBook);     // Private/Admin: Chỉ Admin mới được TẠO sách

// Route có tham số ID: /api/books/:id
// LUÔN LUÔN để các route có /:id xuống dưới cùng để tránh xung đột
router.route('/:id')
  .get(getBookById)                      // Public: Ai cũng xem được chi tiết 1 cuốn sách
  .put(protect, admin, updateBook)       // Private/Admin: Chỉ Admin mới được SỬA
  .delete(protect, admin, deleteBook);   // Private/Admin: Chỉ Admin mới được XÓA

module.exports = router;