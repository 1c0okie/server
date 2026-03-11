const Book = require('../models/Book');
const Category = require('../models/Category'); 
const Inventory = require('../models/Inventory'); 

// @desc    Lấy tất cả sách (Gộp cả tên Category và Tồn kho)
// @route   GET /api/books
// @desc    Lấy tất cả sách (Gộp cả tên Category và Tồn kho) - BẢN AN TOÀN
// @route   GET /api/books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({}).populate('category', 'name') // Lấy trường 'name' của Category
      .populate('author', 'name');  // Lấy trường 'name' của Author
    const inventories = await Inventory.find({});

    const booksWithDetails = books.map((book) => {
      // BỌC AN TOÀN: Kiểm tra i.bookid và book._id có tồn tại không trước khi .toString()
      const inv = inventories.find(i => 
        i.bookid && book._id && i.bookid.toString() === book._id.toString()
      );
      
      return {
        ...book._doc,
        // BỌC AN TOÀN: Kiểm tra xem category có bị null không
        categoryName: (book.category && book.category.name) ? book.category.name : 'Chưa phân loại',
        categoryId: (book.category && book.category._id) ? book.category._id : '',
        stockQuantity: inv ? inv.stockQuantity : 0, 
        status: inv ? inv.status : 'out_of_stock'
      };
    });

    res.json(booksWithDetails);
  } catch (error) {
    // In lỗi chi tiết ra màn hình log của Render để dễ dò
    console.error("❌ LỖI TẠI GETBOOKS:", error); 
    res.status(500).json({ message: 'Lỗi lấy danh sách sách', error: error.message });
  }
};

// @desc    Tạo 1 cuốn sách mới (Kèm tạo mới trong Kho)
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res) => {
  try {
    // 1. Tạo sách ảo mặc định
    const book = new Book({
      title: 'Tên sách mới',
      author: 'Tên tác giả',
      user: req.user._id, // Lấy ID của Admin đang thao tác
      image: 'https://via.placeholder.com/300x400?text=Chua+co+anh',
      description: 'Mô tả chi tiết cuốn sách...',
      price: 0
    });

    const createdBook = await book.save();

    // 2. Tạo luôn một bản ghi Kho (Inventory) trống cho cuốn sách này
    await Inventory.create({
      bookid: createdBook._id,
      stockQuantity: 0,
      soldQuantity: 0,
      status: 'out_of_stock'
    });

    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo sách', error: error.message });
  }
};

// @desc    Cập nhật thông tin sách & Kho
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res) => {
  try {
    const { title, price, description, image, author, category, stockQuantity } = req.body;
    
    // 1. CẬP NHẬT BẢNG SÁCH
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });

    book.title = title || book.title;
    book.price = price || book.price;
    book.description = description || book.description;
    book.image = image || book.image;
    book.author = author || book.author;
    if (category) book.category = category; 

    await book.save();

    // 2. CẬP NHẬT BẢNG KHO
    let inventory = await Inventory.findOne({ bookid: book._id });
    
    if (inventory) {
      if (stockQuantity !== undefined) {
        inventory.stockQuantity = stockQuantity;
        inventory.status = stockQuantity > 0 ? 'in_stock' : 'out_of_stock';
      }
      await inventory.save();
    } else {
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

// @desc    Xóa sách (Xóa luôn cả trong Kho)
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      // 1. Xóa sách
      await book.deleteOne();
      
      // 2. Xóa luôn dữ liệu kho của sách này để tránh rác DB
      await Inventory.findOneAndDelete({ bookid: req.params.id });

      res.json({ message: 'Đã xóa sách và dữ liệu kho thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy sách' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa sách', error: error.message });
  }
};

// @desc    Lấy chi tiết 1 cuốn sách (Cho User xem trang chi tiết)
// @route   GET /api/books/:id
const getBookById = async (req, res) => {
  try {
    // Populate để lấy tên category thay vì chỉ hiện ID
    const book = await Book.findById(req.params.id).populate('category', 'name');
    
    if (book) {
      // (Tùy chọn) Bạn có thể gọi thêm Inventory ở đây nếu muốn hiển thị tồn kho ở trang chi tiết
      res.json(book);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sách' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
  }
};

// VÀ SỬA LẠI DÒNG EXPORT CUỐI CÙNG THÀNH THẾ NÀY:
module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };