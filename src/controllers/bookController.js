const Book = require('../models/Book');

// @desc    Lấy tất cả sách
// @route   GET /api/books
const getBooks = async (req, res) => {
  const books = await Book.find({});
  res.json(books);
};

// @desc    Tạo 1 cuốn sách mẫu (Để Admin vào sửa lại sau)
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res) => {
  try {
    const book = new Book({
      title: 'Tên sách mới',
      author: 'Tên tác giả',
      user: req.user._id, // ID của Admin tạo
      image: 'https://via.placeholder.com/300x400?text=Chua+co+anh',
      description: 'Mô tả chi tiết cuốn sách...',
      category: 'Danh mục',
      price: 0,
      countInStock: 0,
      rating: 0,
      numReviews: 0,
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo sách', error: error.message });
  }
};

// @desc    Cập nhật thông tin sách
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res) => {
  try {
    const { title, price, description, image, author, category, countInStock } = req.body;
    const book = await Book.findById(req.params.id);

    if (book) {
      book.title = title;
      book.price = price;
      book.description = description;
      book.image = image;
      book.author = author;
      book.category = category;
      book.countInStock = countInStock;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sách' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật sách', error: error.message });
  }
};

// @desc    Xóa sách
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      await book.deleteOne();
      res.json({ message: 'Đã xóa sách thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy sách' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa sách', error: error.message });
  }
};

module.exports = { getBooks, createBook, updateBook, deleteBook };