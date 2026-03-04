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

// @desc    Lấy danh sách TẤT CẢ đơn hàng (Dành cho Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    // .populate() để lấy tên và email của khách hàng từ bảng User
    // .sort({ createdAt: -1 }) để đưa đơn hàng mới đặt lên đầu danh sách
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 }); 
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng', error: error.message });
  }
};

// @desc    Cập nhật trạng thái đơn hàng (Admin duyệt/giao đơn)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Cập nhật trạng thái mới gửi từ Frontend lên
      order.status = req.body.status || order.status;

      // Nếu Admin chọn "Đã giao" (Delivered), tự động đánh dấu thời gian giao hàng
      if (req.body.status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái', error: error.message });
  }
};
// ĐÃ THÊM CANCELORDER VÀO ĐÂY
module.exports = { addOrderItems, getOrderById, getMyOrders, cancelOrder , getAllOrders, updateOrderStatus};