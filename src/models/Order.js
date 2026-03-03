const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Liên kết với bảng User
    },
    orderItems: [
      {
        title: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Book', // Liên kết với bảng Book
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true }, // Số điện thoại người nhận
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'COD', // Mặc định là Thanh toán khi nhận hàng
    },
    // Các loại phí và tổng tiền
    itemsPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    
    // Trạng thái đơn hàng
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    status: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Shipping', 'Delivered', 'Cancelled'],
    default: 'Pending' // Chờ xác nhận
  },
  // Thêm lý do hủy đơn nếu cần
  cancelReason: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;