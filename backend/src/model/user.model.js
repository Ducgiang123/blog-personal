const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// Định nghĩa schema cho người dùng
const userSchema = new Schema({
    username: {type: String, required: true, unique: true}, // Tên người dùng, bắt buộc và phải duy nhất
    email: { type: String, required: true, unique: true }, // Email, bắt buộc và phải duy nhất
    password: { type: String, required: true }, // Mật khẩu, bắt buộc
    role: { type: String, enum: ['người đọc', 'cộng tác viên', 'quản trị viên'], default: 'người đọc' }, // Vai trò, mặc định là 'người đọc'
});

// Middleware để mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next(); 
    const hashedPassword = await bcrypt.hash(user.password, 10); 
    user.password = hashedPassword; 
});

// Phương thức để so sánh mật khẩu
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password); // So sánh mật khẩu
};

// Tạo mô hình người dùng
const User = new model('User', userSchema);

// Xuất mô hình người dùng
module.exports = User;
