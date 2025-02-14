const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Đảm bảo ref đến 'User'
    createdAt: { type: Date, default: Date.now },
});


const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [replySchema], // Thêm trường để lưu trữ các phản hồi
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
