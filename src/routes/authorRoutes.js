const express = require('express');
const router = express.Router();

const {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} = require('../controllers/authorController');

const { protect, admin } = require('../middlewares/authMiddleware');

// Route gốc: /api/authors
router.route('/')
  .get(getAuthors)                       // Public: Lấy danh sách tác giả
  .post(protect, admin, createAuthor);   // Admin: Thêm tác giả mới

// Route ID: /api/authors/:id
router.route('/:id')
  .get(getAuthorById)                    // Public: Lấy thông tin 1 tác giả
  .put(protect, admin, updateAuthor)     // Admin: Sửa thông tin
  .delete(protect, admin, deleteAuthor); // Admin: Xóa tác giả

module.exports = router;