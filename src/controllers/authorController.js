const Author = require('../models/Author');

// @desc    Lấy danh sách tất cả tác giả
// @route   GET /api/authors
// @access  Public (Ai cũng xem được)
const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find({});
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách tác giả', error: error.message });
  }
};

// @desc    Lấy chi tiết 1 tác giả theo ID
// @route   GET /api/authors/:id
// @access  Public
const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.json(author);
    } else {
      res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy thông tin tác giả', error: error.message });
  }
};

// @desc    Thêm tác giả mới
// @route   POST /api/authors
// @access  Private/Admin
const createAuthor = async (req, res) => {
  try {
    const { name, biography, imageUrl, dateOfBirth, nationality } = req.body;

    const author = new Author({
      name: name || 'Tên tác giả mới',
      biography: biography || '',
      imageUrl: imageUrl || 'https://via.placeholder.com/150?text=No+Image',
      dateOfBirth,
      nationality: nationality || ''
    });

    const createdAuthor = await author.save();
    res.status(201).json(createdAuthor);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo tác giả', error: error.message });
  }
};

// @desc    Cập nhật thông tin tác giả
// @route   PUT /api/authors/:id
// @access  Private/Admin
const updateAuthor = async (req, res) => {
  try {
    const { name, biography, imageUrl, dateOfBirth, nationality } = req.body;
    const author = await Author.findById(req.params.id);

    if (author) {
      author.name = name || author.name;
      author.biography = biography || author.biography;
      author.imageUrl = imageUrl || author.imageUrl;
      author.dateOfBirth = dateOfBirth || author.dateOfBirth;
      author.nationality = nationality || author.nationality;

      const updatedAuthor = await author.save();
      res.json(updatedAuthor);
    } else {
      res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật tác giả', error: error.message });
  }
};

// @desc    Xóa tác giả
// @route   DELETE /api/authors/:id
// @access  Private/Admin
const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (author) {
      await author.deleteOne();
      res.json({ message: 'Đã xóa tác giả thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa tác giả', error: error.message });
  }
};

module.exports = { getAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };