const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true }
});

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    content: { type: Object, required: true },
    coverImg: String,
    paraImg: { type: [String], default: [] }, // Thêm trường paraImg để lưu trữ nhiều ảnh
    category: String, 
    topic: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;