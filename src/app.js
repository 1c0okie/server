const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes'); // <--- 1. Import mới
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes'); // <--- 1. Import mới

const app = express();

// Middleware
app.use(cors()); // Cho phép Frontend (port 5173) gọi API
app.use(express.json()); // Để server hiểu dữ liệu JSON gửi lên

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes); // <--- 2. Sử dụng route
app.use('/api/orders', orderRoutes); // <--- 2. Sử dụng route

// Test Route cơ bản
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;