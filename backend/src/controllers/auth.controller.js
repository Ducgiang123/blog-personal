const User = require('../model/user.model');
const generateToken = require('../middleware/generateToken');

// Improved Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

// Register endpoint
const registerUser = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Check email format
        if (!emailRegex.test(email)) {
            return res.status(400).send({ message: 'Email không hợp lệ, phải có định dạng @gmail.com' });
        }

        // Check for duplicate email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).send({ message: 'Email đã tồn tại' });
        }

        // Check for duplicate username
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).send({ message: 'Tên người dùng đã tồn tại' });
        }

        const user = new User({ email, password, username });
        await user.save();
        res.status(201).send({ message: 'Đăng ký thành công' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ message: 'Registration failed' });
    }
};

// Login endpoint
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'Email không hợp lệ' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Mật khẩu không hợp lệ' });
        }

        const token = await generateToken(user._id);
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });
        
        // Check user role and respond accordingly
        if (user.role === 'quản trị viên' || user.role === 'cộng tác viên') {
            return res.status(200).send({ message: 'Đăng nhập thành công', token, user, redirect: '/dashboard' });
        }

        res.status(200).send({ message: 'Đăng nhập thành công', token, user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send({ message: 'Login failed' });
    }
};

// Logout endpoint (optional)
const logoutUser = (req, res) => {
    res.clearCookie('token'); 
    res.status(200).send({ message: 'Đăng xuất thành công' });
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'id email role username'); // Cập nhật để bao gồm tên người dùng
        res.status(200).send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Failed to fetch users' });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ message: 'Đã xóa người dùng' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Failed to delete user' });
    }
}

// Update a user role and email
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, role, email } = req.body; // Cập nhật để bao gồm email
        const user = await User.findByIdAndUpdate(id, { role, email, username }, { new: true }); // Cập nhật cả vai trò và email
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Tạo thông báo dựa trên các trường đã được cập nhật
        const updatedFields = [];
        if (username) updatedFields.push(`Tên người dùng: ${username}`);
        if (email) updatedFields.push(`Email: ${email}`);
        if (role) updatedFields.push(`Vai trò: ${role}`);

        const message = updatedFields.length > 0 ? `Cập nhật thành công, thông tin sau khi cập nhật:\n${updatedFields.join('\n')}` : 'Không có thông tin nào được cập nhật.';
        res.status(200).send({ message, user });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).send({ message: 'Failed to update user role' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    deleteUser,
    updateUserRole
};
