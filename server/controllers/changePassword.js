const bcrypt = require('bcryptjs');
const User = require('../models/user');

const changePassword = async (req, res) => {
    console.log('Received request:', req.body);  
    try {
        const {userId, currentPassword, newPassword } = req.body;
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            console.log('Incorrect current password');
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới vào cơ sở dữ liệu
        await User.update({ password: hashedPassword }, { where: { id: userId } });

        console.log('Password updated successfully');
        res.status(200).json({ message: 'Password updated successfully' });

    } catch (err) {
        console.error('Error during password change:', err);
        res.status(500).json({ error: 'An error occurred during password change' });
    }
};

module.exports = {changePassword};
