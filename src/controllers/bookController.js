const Book = require('../models/Book');
const Category = require('../models/Category'); // Đảm bảo import Model Category
const Inventory = require('../models/Inventory'); // Đảm bảo import Model Inventory

// @desc    Lấy tất cả sách (Gộp cả tên Category và Tồn kho)
// @route   GET /api/books
const getBooks = async (req, res) => {
  try {
    // 1. Lấy toàn bộ sách và dùng .populate() để lấy 'name' từ bảng Category
    const books = await Book.find({}).populate('category', 'name');
    
    // 2. Lấy toàn bộ dữ liệu từ bảng Kho
    const inventories = await Inventory.find({});

    // 3. Gộp số lượng tồn kho vào từng cuốn sách để gửi lên Frontend
    const booksWithDetails = books.map((book) => {
      // Tìm kho có bookid khớp với _id của sách
      const inv = inventories.find(i => i.bookid.toString() === book._id.toString());
      
      return {
        ...book._doc,
        // Nếu sách có category, lấy tên hiển thị, nếu không để trống
        categoryName: book.category ? book.category.name : 'Chưa phân loại',
        // Giữ lại ID category để Frontend dùng khi Edit
        categoryId: book.category ? book.category._id : '',
        // Lấy số lượng từ bảng Inventory, nếu không có mặc định là 0
        stockQuantity: inv ? inv.stockQuantity : 0, 
        status: inv ? inv.status : 'out_of_stock'
      };
    });

    res.json(booksWithDetails);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách sách', error: error.message });
  }
};


// @desc    Cập nhật thông tin sách & Kho
// @route   PUT /api/books/:id
const updateBook = async (req, res) => {
  try {
    // Lưu ý: category ở đây Frontend gửi lên phải là _id của Category
    const { title, price, description, image, author, category, stockQuantity } = req.body;
    
    // 1. CẬP NHẬT BẢNG SÁCH
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });

    book.title = title || book.title;
    book.price = price || book.price;
    book.description = description || book.description;
    book.image = image || book.image;
    book.author = author || book.author;
    if (category) book.category = category; // Gắn ID Category mới

    await book.save();

    // 2. CẬP NHẬT BẢNG KHO (Chú ý dùng 'bookid' theo đúng schema của bạn)
    let inventory = await Inventory.findOne({ bookid: book._id });
    
    if (inventory) {
      if (stockQuantity !== undefined) {
        inventory.stockQuantity = stockQuantity;
        inventory.status = stockQuantity > 0 ? 'in_stock' : 'out_of_stock';
      }
      await inventory.save();
    } else {
      // Nếu chưa có trong kho thì tạo mới
      await Inventory.create({
        bookid: book._id,
        stockQuantity: stockQuantity || 0,
        status: (stockQuantity || 0) > 0 ? 'in_stock' : 'out_of_stock'
      });
    }

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật sách', error: error.message });
  }
};

// module.exports = { getBooks, updateBook, ... };
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