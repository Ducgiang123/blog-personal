const Comment = require('../model/comment.model');

// Post comment
const postComment = async (req, res) => {
    try {
        const { comment, postId } = req.body;
        const newComment = new Comment({
            comment,
            user: req.userId,
            postId
        });
        await newComment.save();
        res.status(201).send({ message: 'Đã đăng bình luận', comment: newComment });
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).send({ message: 'Failed to post comment' });
    }
};

// Delete comment
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedComment = await Comment.findByIdAndDelete(id);
        if (!deletedComment) {
            return res.status(404).send({ message: 'Bình luận không tìm thấy' });
        }
        res.status(200).send({ message: 'Bình luận đã được xóa' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).send({ message: 'Failed to delete comment' });
    }
};

// Update comment
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const updatedComment = await Comment.findByIdAndUpdate(id, { comment }, { new: true });
        if (!updatedComment) {
            return res.status(404).send({ message: 'Bình luận không tìm thấy' });
        }
        res.status(200).send({ message: 'Bình luận đã được cập nhật', comment: updatedComment });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).send({ message: 'Failed to update comment' });
    }
};

// Add reply to a comment
const addReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const reply = {
            comment,
            user: req.userId, // Đảm bảo userId được lưu vào đây
        };
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { $push: { replies: reply } },
            { new: true }
        ).populate('replies.user', 'username'); // Populate user ngay sau khi cập nhật

        if (!updatedComment) {
            return res.status(404).send({ message: 'Bình luận không tìm thấy' });
        }
        res.status(200).send({ message: 'Đã thêm phản hồi', comment: updatedComment });
    } catch (error) {
        console.error('Error adding reply:', error);
        res.status(500).send({ message: 'Failed to add reply' });
    }
};


// Get replies for a specific comment
const getReplies = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id)
            .populate({
                path: 'replies.user', // Populate user trong replies
                select: 'username' // Chỉ lấy username
            });

        if (!comment) {
            return res.status(404).send({ message: 'Bình luận không tìm thấy' });
        }

        console.log("Replies:", comment.replies); // Debug: Kiểm tra replies có user.username không

        res.status(200).send({ replies: comment.replies });
    } catch (error) {
        console.error('Error fetching replies:', error);
        res.status(500).send({ message: 'Failed to fetch replies' });
    }
};




// Get comment count for a specific post
const getCommentCount = async (req, res) => {
    try {
        const { postId } = req.params;
        const count = await Comment.countDocuments({ postId });
        res.status(200).send({ count });
    } catch (error) {
        console.error('Error fetching comment count:', error);
        res.status(500).send({ message: 'Failed to fetch comment count' });
    }
};

// Get total comments
const getTotalComments = async (req, res) => {
    try {
        const totalComments = await Comment.countDocuments({});
        res.status(200).send({ totalComments });
    } catch (error) {
        console.error('Error fetching total comments:', error);
        res.status(500).send({ message: 'Failed to fetch total comments' });
    }
};

module.exports = {
    postComment,
    deleteComment,
    updateComment,
    addReply,
    getReplies,
    getCommentCount,
    getTotalComments
};
