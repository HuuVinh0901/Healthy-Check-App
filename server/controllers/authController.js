const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for:', email);
            return res.status(400).json({ message: 'Incorrect password' });
        }

        console.log('Password match, generating token...');
        const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role, 
                gender:user.gender,
                avatar:user.avatar
            },
        });

    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};

module.exports = { login };
