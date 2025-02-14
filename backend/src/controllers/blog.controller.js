const Blog = require('../model/blog.model');
const Comment = require('../model/comment.model');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cấu hình Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('coverImg');

// Create post
const createPost = async (req, res) => {
    try {
        let coverImgUrl = null;

        // Kiểm tra định dạng tệp hình ảnh
        const allowedFormats = ['image/png', 'image/jpeg', 'image/webp'];
        if (req.file) {
            if (!allowedFormats.includes(req.file.mimetype)) {
                return res.status(400).send({ message: 'Vui lòng chọn tệp hình ảnh có định dạng png, jpg hoặc web.' });
            }

            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
            coverImgUrl = result.secure_url;
        }

        const { title, content, category, description, topic } = req.body;

        const newPost = new Blog({
            title,
            content: JSON.parse(content),
            category,
            coverImg: coverImgUrl,
            author: req.userId,
            description,
            topic // Thêm trường topic vào đây
        });

        await newPost.save();
        res.status(201).send({ message: 'Đã thêm bài viết', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send({ message: 'Failed to create post' });
    }
};

// Get all posts
const getAllPosts = async (req, res) => {
    try {
        const { search, category, location } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) query.category = category;
        if (location) query.location = location;

        const posts = await Blog.find(query).populate('author', 'email').sort({ createdAt: -1 });
        res.status(200).send(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send({ message: 'Failed to fetch posts' });
    }
};

// Get a single post
const getSinglePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Blog.findById(postId).populate('author', 'email username');

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const comments = await Comment.find({ postId }).populate('user', 'username email');
        res.status(200).send({ post, comments });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send({ message: 'Failed to fetch post' });
    }
};

// Update a post
const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const existingPost = await Blog.findById(postId);

        if (!existingPost) {
            return res.status(404).send({ message: 'Post not found' });
        }

        let coverImg = existingPost.coverImg; // 🔥 Giữ lại ảnh bìa cũ nếu không có ảnh mới
        let updatedContent = existingPost.content; // 🔥 Giữ lại content cũ nếu không có content mới

        if (req.file) {
            try {
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { resource_type: 'image' },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result.secure_url);
                        }
                    ).end(req.file.buffer);
                });
                coverImg = result;
            } catch (error) {
                console.error("Error uploading image:", error);
                return res.status(500).send({ message: "Failed to upload image" });
            }
        }

        // 🔥 Nếu content được gửi từ client, parse lại JSON
        if (req.body.content) {
            try {
                updatedContent = JSON.parse(req.body.content);
            } catch (error) {
                return res.status(400).send({ message: "Invalid content format" });
            }
        }

        const updatedPost = await Blog.findByIdAndUpdate(
            postId,
            { ...req.body, coverImg, content: updatedContent, topic: req.body.topic }, // Thêm trường topic vào đây
            { new: true }
        );

        res.status(200).send({ message: 'Đã cập nhật bài viết thành công', post: updatedPost });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send({ message: 'Failed to update post' });
    }
};

// Delete a post
const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Blog.findByIdAndDelete(postId);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        await Comment.deleteMany({ postId });
        res.status(200).send({ message: 'Đã xóa bài viết và bình luận thành công' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).send({ message: 'Failed to delete post' });
    }
};

// Get related blogs
const getRelatedBlogs = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'Blog ID is required' });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).send({ message: 'Blog post not found' });
        }

        const relatedPosts = await Blog.find({
            _id: { $ne: id },
            category: blog.category
        });

        res.status(200).send(relatedPosts);
    } catch (error) {
        console.error('Error fetching related posts:', error);
        res.status(500).send({ message: 'Failed to fetch related posts' });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost,
    getRelatedBlogs
};
