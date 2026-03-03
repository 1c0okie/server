const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
}, {
  timestamps: true,
});

// Middleware: Tự động mã hóa mật khẩu trước khi Lưu vào DB
userSchema.pre('save', async function () {
  // Nếu mật khẩu không bị thay đổi (chỉ đổi tên, sđt) thì thoát ra luôn
  if (!this.isModified('password')) {
    return; 
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Phương thức: Kiểm tra mật khẩu nhập vào có khớp với mật khẩu mã hóa không
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;