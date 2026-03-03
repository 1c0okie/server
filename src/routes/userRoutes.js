const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware'); // Import bảo vệ

router.post('/', registerUser);
router.post('/login', authUser);

// Gom nhóm route profile (GET để xem, PUT để sửa)
// protect: Phải đăng nhập mới được vào đây
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;