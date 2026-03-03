const Order = require('../models/Order');

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private (Phải đăng nhập mới mua được)
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'Không có sản phẩm nào trong giỏ hàng' });
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id, // Lấy ID user từ middleware auth
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save(); // Lưu xuống DB

    res.status(201).json(createdOrder);
  }
};

// @desc    Lấy đơn hàng theo ID (Xem chi tiết đơn sau khi mua)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  // .populate để lấy luôn tên và email của user mua hàng
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }
};

// @desc    Lấy danh sách đơn hàng của người dùng đang đăng nhập
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};
// @desc    Hủy đơn hàng
// @route   PUT /api/orders/:id/cancel
// @desc    Hủy đơn hàng
// @route   PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.status === 'Pending') {
      order.status = 'Cancelled';
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      // Sửa lại cách trả về lỗi cho giống các hàm bên trên
      res.status(400).json({ message: 'Không thể hủy đơn hàng đã được xác nhận hoặc đang giao.' });
    }
  } else {
    // Sửa lại cách trả về lỗi cho giống các hàm bên trên
    res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
  }
};

// ĐÃ THÊM CANCELORDER VÀO ĐÂY
module.exports = { addOrderItems, getOrderById, getMyOrders, cancelOrder };