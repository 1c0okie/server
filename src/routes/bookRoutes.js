const express = require('express');
const router = express.Router();
const { getBooks, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getBooks)
  .post(protect, admin, createBook); // Admin mới được tạo

router.route('/:id')
  .put(protect, admin, updateBook)    // Admin mới được sửa
  .delete(protect, admin, deleteBook); // Admin mới được xóa

module.exports = router;