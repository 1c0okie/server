const express = require('express');
const router = express.Router();

const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  cancelOrder,
  getAllOrders,       // Import hàm mới
  updateOrderStatus   // Import hàm mới
} = require('../controllers/orderController');

// Import middleware (Giả sử bạn đã có middleware admin)
const { protect, admin } = require('../middlewares/authMiddleware'); 

// ==========================================
// ROUTES DÀNH CHO ADMIN
// ==========================================
// Lấy tất cả đơn hàng (GET /api/orders) - Cần cả protect và admin
router.route('/').get(protect, admin, getAllOrders);

// Cập nhật trạng thái (PUT /api/orders/:id/status)
router.route('/:id/status').put(protect, admin, updateOrderStatus);


// ==========================================
// ROUTES DÀNH CHO USER (Phải đặt ở dưới)
// ==========================================
router.route('/').post(protect, addOrderItems);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id').get(protect, getOrderById);

module.exports = router;