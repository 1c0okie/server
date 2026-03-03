const Book = require('../models/Book');

// @desc    Lấy tất cả sách (Có tìm kiếm ?keyword=...)
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    // Xử lý tìm kiếm
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i', // 'i' nghĩa là không phân biệt hoa thường
          },
        }
      : {};

    // Tìm trong DB với điều kiện keyword
    const books = await Book.find({ ...keyword });
    
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server' });
  }
};

// @desc    Lấy 1 sách theo ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sách' });
    }
  } catch (error) {
    // Lỗi khi ID không đúng định dạng MongoDB
    res.status(404).json({ message: 'Không tìm thấy sách' });
  }
};

module.exports = { getBooks, getBookById };