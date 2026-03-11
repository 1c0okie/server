const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Vui lòng nhập tên tác giả'],
      trim: true 
    },
    biography: { 
      type: String, 
      default: 'Chưa có thông tin tiểu sử về tác giả này.' 
    },
    imageUrl: { 
      type: String, 
      default: 'https://via.placeholder.com/150?text=No+Image' // Ảnh mặc định nếu chưa có
    },
    dateOfBirth: { 
      type: Date 
    },
    nationality: { 
      type: String 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Author', authorSchema);