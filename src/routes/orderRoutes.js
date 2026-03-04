const express = require('express');
const router = express.Router();

const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats // 1. Đảm bảo bạn ĐÃ IMPORT hàm này
} = require('../controllers/orderController');

const { protect, admin } = require('../middlewares/authMiddleware');

// ==========================================
// ROUTES DÀNH CHO ADMIN
// ==========================================

// 2. CHÚ Ý: Đặt route thống kê lên TRÊN CÙNG của nhóm này
router.route('/stats/dashboard').get(protect, admin, getDashboardStats);

// Các route cũ của Admin
router.route('/').get(protect, admin, getAllOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

// ==========================================
// ROUTES DÀNH CHO USER
// ==========================================
router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/cancel').put(protect, cancelOrder);

// 3. CHÚ Ý: Các route có chứa `/:id` LUÔN LUÔN nằm ở dưới cùng
router.route('/:id').get(protect, getOrderById);

module.exports = router;