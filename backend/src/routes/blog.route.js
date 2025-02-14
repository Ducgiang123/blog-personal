const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/admin');
const multer = require('multer');
const {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost,
    getRelatedBlogs
} = require('../controllers/blog.controller');

// Cấu hình Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('coverImg');

// Create post (protected route)
router.post('/create-post', verifyToken, isAdmin, upload, createPost);

// Get all posts (public route)
router.get('/', getAllPosts);

// Get a single post (protected route)
router.get('/:id', getSinglePost);

// Update a post (protected route)
router.patch('/update-post/:id', verifyToken, isAdmin, upload, updatePost);


// Delete a post with the related comment
router.delete('/:id', deletePost);

// Get related blogs
router.get('/related/:id', getRelatedBlogs);

module.exports = router;
