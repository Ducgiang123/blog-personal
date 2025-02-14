const isAdmin = (req, res, next) => {
    if (req.role !== 'quản trị viên' && req.role !== 'cộng tác viên') {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập tài nguyên này.' });
    }
    next();
};

module.exports = isAdmin;