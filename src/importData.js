
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load biến môi trường (chứa link kết nối MongoDB)
dotenv.config();

// Import các Models
const Book = require('./models/Book');
const Author = require('./models/Author');
const Category = require('./models/Category'); // Thay bằng model Category của bạn nếu có

// Hàm kết nối Database
// Hàm kết nối Database
const connectDB = async () => {
  try {
    // XÓA process.env.MONGO_URI đi và dán trực tiếp chuỗi kết nối vào đây, bọc trong dấu nháy đơn
    await mongoose.connect('mongodb+srv://thanhtb:123@bookdb.udqr497.mongodb.net/bookdb?retryWrites=true&w=majority'); 
    
    console.log('✅ Đã kết nối Database thành công!');
  } catch (error) {
    console.error('❌ Lỗi kết nối DB:', error);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();
  const results = [];

  console.log('⏳ Đang đọc file CSV...');

  // Đọc file CSV
  fs.createReadStream('data/book.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`✅ Đã đọc xong ${results.length} dòng. Bắt đầu xử lý...`);

      try {
        // Dùng vòng lặp for...of để xử lý tuần tự từng dòng (chờ DB tạo xong mới làm tiếp)
        for (let row of results) {
          
          // 1. TÌM HOẶC TẠO THỂ LOẠI (CATEGORY)
          let categoryName = row['Thể loại (EN)'].trim();
          let category = await Category.findOne({ name: categoryName });
          if (!category) {
            category = await Category.create({ name: categoryName });
            console.log(`+ Đã tạo thể loại mới: ${categoryName}`);
          }

          // 2. TÌM HOẶC TẠO TÁC GIẢ (AUTHOR)
          let authorName = row['Tác giả'].trim();
          let author = await Author.findOne({ name: authorName });
          if (!author) {
            author = await Author.create({ name: authorName });
            console.log(`+ Đã tạo tác giả mới: ${authorName}`);
          }

          // 3. TẠO SÁCH MỚI
// ... (Phần 1 và 2 giữ nguyên)

          // 3. XỬ LÝ DỮ LIỆU SỐ TRƯỚC KHI TẠO SÁCH
          // Xử lý Năm xuất bản (Lấy 4 ký tự đầu tiên nếu có, ví dụ "2025-02-26" -> 2025)
          let rawYear = row['Năm XB']?.trim() || '';
          let parsedYear = rawYear ? parseInt(rawYear.substring(0, 4)) : null;

          // Xử lý Đánh giá (Nếu ghi "Chưa có" hoặc bị lỗi thì mặc định là 0)
          let rawRating = row['Đánh giá']?.trim() || '0';
          let parsedRating = parseFloat(rawRating);
          if (isNaN(parsedRating)) parsedRating = 0;

          // Xử lý Số trang (Đề phòng có chữ "Chưa rõ")
          let rawPages = row['Số trang']?.trim() || '0';
          let parsedPages = parseInt(rawPages);
          if (isNaN(parsedPages)) parsedPages = 0;

          // TẠO SÁCH MỚI
          await Book.create({
            title: row['Tiêu đề']?.trim() || 'Đang cập nhật',
            category: category._id, 
            author: author._id,     
            publisher: row['NXB']?.trim() || 'Đang cập nhật',
            publishYear: isNaN(parsedYear) ? null : parsedYear,
            pages: parsedPages,
            rating: parsedRating,
            image: row['Link Ảnh']?.trim() || 'https://via.placeholder.com/150',
            price: 50000, 
            discount: 0, 
            countInStock: 100 
          });
        }

        console.log('🎉 QUÁ TRÌNH IMPORT THÀNH CÔNG RỰC RỠ!');
        process.exit(); 
      } catch (error) {
// ...
        console.error('❌ Lỗi trong quá trình import:', error);
        process.exit(1);
      }
    });
};

importData();