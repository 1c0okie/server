const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String },
  birthDate: { type: Date }, // Dùng Date để dễ query theo năm sinh
  avatarUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);