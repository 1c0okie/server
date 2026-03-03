// server/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import các Model
const User = require('./src/models/User');
const Author = require('./src/models/Author');
const Category = require('./src/models/Category');
const Book = require('./src/models/Book');
const Inventory = require('./src/models/Inventory');

// Cấu hình dotenv để lấy link DB
dotenv.config();

// Kết nối DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Đã kết nối MongoDB');
  } catch (error) {
    console.error('Lỗi kết nối:', error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // 1. Xóa dữ liệu cũ (để tránh trùng lặp khi chạy lại)
    console.log('🗑️ Đang xóa dữ liệu cũ...');
    await User.deleteMany();
    await Author.deleteMany();
    await Category.deleteMany();
    await Book.deleteMany();
    await Inventory.deleteMany();

    // 2. Tạo User
    console.log('👤 Đang tạo User...');
    const createdUser = await User.create({
        fullName: 'Admin Quản Lý',
        email: 'admin@gmail.com',
        passwordHash: '$2b$10$hashedpassword...', // Mật khẩu giả
        role: 'admin'
    });

    // 3. Tạo Tác giả & Danh mục trước (Vì Sách cần ID của bọn này)
    console.log('✍️ Đang tạo Tác giả & Danh mục...');
    
    const author1 = await Author.create({ name: 'Nguyễn Nhật Ánh', bio: 'Nhà văn tuổi thơ' });
    const author2 = await Author.create({ name: 'J.K. Rowling', bio: 'Mẹ đẻ Harry Potter' });

    const cate1 = await Category.create({ name: 'Văn học thiếu nhi', description: 'Truyện cho trẻ em' });
    const cate2 = await Category.create({ name: 'Viễn tưởng', description: 'Phép thuật, không gian' });

    // 4. Tạo Sách (Tham chiếu ID của Tác giả và Danh mục vừa tạo)
    console.log('📚 Đang tạo Sách...');
    
    const book1 = await Book.create({
        title: 'Kính Vạn Hoa',
        price: 50000,
        description: 'Chuyện về Quý Ròm, Tiểu Long, Hạnh',
        authorIds: [author1._id],    // Reference
        categoryIds: [cate1._id],    // Reference
        coverImage: 'https://link-anh-demo.com/kinhvanhoa.jpg'
    });

    const book2 = await Book.create({
        title: 'Harry Potter và Hòn đá phù thủy',
        price: 150000,
        description: 'Cậu bé phù thủy',
        authorIds: [author2._id],
        categoryIds: [cate1._id, cate2._id], // Thuộc 2 thể loại
        coverImage: 'https://link-anh-demo.com/harrypotter.jpg'
    });

    // 5. Tạo Kho hàng (Inventory) cho sách
    console.log('📦 Đang nhập kho...');
    await Inventory.create([
        { bookid: book1._id, stockQuantity: 100, status: 'in_stock' },
        { bookid: book2._id, stockQuantity: 50, status: 'in_stock' }
    ]);

    console.log('🎉 ĐÃ TẠO DỮ LIỆU THÀNH CÔNG!');
    process.exit();
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo dữ liệu:', error);
    process.exit(1);
  }
};

importData();