const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem header có gửi token dạng "Bearer abcxyz..." không
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Lấy token (bỏ chữ Bearer ở đầu)
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token để lấy ID user
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user trong DB và gắn vào biến req.user (để các hàm sau dùng)
      // .select('-password') nghĩa là lấy user nhưng trừ trường password ra
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Cho phép đi tiếp
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không có quyền truy cập, thiếu Token' });
  }
};
// Nếu chưa có thì thêm vào:
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Không có quyền truy cập, yêu cầu tài khoản Admin' });
  }
};
// nhớ export { protect, admin }

module.exports = { protect, admin };