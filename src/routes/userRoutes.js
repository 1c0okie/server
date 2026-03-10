const express = require('express');
const router = express.Router();

// 1. IMPORT TẤT CẢ CONTROLLER VÀO CÙNG 1 CHỖ
// (Bao gồm cả hàm của User thường và hàm của Admin)
const { 
  authUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile,
  getUsers, 
  updateUserRole, 
  deleteUser 
} = require('../controllers/userController');

// 2. IMPORT MIDDLEWARE 1 LẦN DUY NHẤT ĐỂ KHÔNG BỊ LỖI
const { protect, admin } = require('../middlewares/authMiddleware');

// ==========================================
// NHÓM 1: CÁC ROUTE KHÔNG CẦN ID 
// ==========================================

// Route gốc: /api/users
router.route('/')
  .post(registerUser)                // Public: Mọi người đều có thể đăng ký
  .get(protect, admin, getUsers);    // Private/Admin: Chỉ Admin mới lấy được danh sách

// Route đăng nhập: /api/users/login
router.post('/login', authUser);     // Public: Đăng nhập

// Route cá nhân: /api/users/profile
router.route('/profile')
  .get(protect, getUserProfile)      // Private: User xem thông tin của mình
  .put(protect, updateUserProfile);  // Private: User sửa thông tin của mình


// ==========================================
// NHÓM 2: CÁC ROUTE CÓ CHỨA ID DÀNH CHO ADMIN
// (Luôn phải đặt ở dưới cùng để tránh lỗi kẹt Route)
// ==========================================

// Cấp quyền / Hạ quyền Admin: /api/users/:id/role
router.route('/:id/role')
  .put(protect, admin, updateUserRole);

// Xóa tài khoản người dùng: /api/users/:id
router.route('/:id')
  .delete(protect, admin, deleteUser);


// 3. XUẤT ROUTER ĐỂ APP.JS SỬ DỤNG
module.exports = router;