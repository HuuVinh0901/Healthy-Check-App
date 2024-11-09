const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            // Thông báo lỗi khi người dùng không tồn tại
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Thông báo lỗi khi mật khẩu sai
            return res.status(400).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,  // Thêm các trường khác nếu cần
            },
        });
        
    } catch (err) {
        // Xử lý lỗi hệ thống và trả về thông báo lỗi
        console.error(err);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};

module.exports = { login };
