const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
    postComment,
    deleteComment,
    updateComment,
    addReply,
    getReplies,
    getCommentCount,
    getTotalComments
} = require('../controllers/comment.controller');

// Post comment (protected route)
router.post('/post-comment', verifyToken, postComment);

// Delete comment (protected route)
router.delete('/comments/:id', verifyToken, deleteComment);

// Update comment (protected route)
router.put('/comments/:id', verifyToken, updateComment);

// Add reply to a comment (protected route)
router.post('/comments/:id/replies', verifyToken, addReply);

// Get replies for a specific comment
router.get('/comments/:id/replies', getReplies);

// Get comment count for a specific post
router.get('/count/:postId', getCommentCount);

// Get total comments
router.get('/total-comments', getTotalComments);

module.exports = router;
