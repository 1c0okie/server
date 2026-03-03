const User = require('../models/User'); // Hãy đảm bảo tên file model đúng (userModel.js hoặc User.js)
const generateToken = require('../utils/generateToken');

// @desc    Đăng nhập & Lấy Token
// @route   POST /api/users/login
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,       // Thêm vào để frontend nhận ngay khi login
      address: user.address,   // Thêm vào để frontend nhận ngay khi login
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }
};

// @desc    Đăng ký tài khoản mới
// @route   POST /api/users
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'Email này đã được sử dụng' });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
  }
};

// @desc    Lấy thông tin profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,       // Quan trọng: Trả về để hiển thị khi F5 trang
      address: user.address,   // Quan trọng: Trả về để hiển thị khi F5 trang
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'Không tìm thấy người dùng' });
  }
};

// @desc    Cập nhật profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  console.log("Dữ liệu nhận từ Frontend:", req.body);
  const user = await User.findById(req.user._id);

  if (user) {
    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;     // Gán trực tiếp
    if (req.body.address) user.address = req.body.address; // Gán trực tiếp
    
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      phone: updatedUser.phone,       // Trả về phone mới cập nhật
      address: updatedUser.address,   // Trả về address mới cập nhật
      token: req.headers.authorization.split(' ')[1], 
    });
  } else {
    res.status(404).json({ message: 'Không tìm thấy người dùng' });
  }
};

// Xuất tất cả các hàm ở cuối cùng
module.exports = { authUser, registerUser, getUserProfile, updateUserProfile };