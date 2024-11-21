const User = require('../models/user'); // Import model User

// Thêm người dùng
const addUser = async (req, res) => {
  try {
    const { name, gender, email, avatar, password, role } = req.body;

    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Role must be "user" or "admin".' });
    }

    const user = await User.create({
      name,
      gender,
      email,
      password,
      avatar,
      role: role || 'user',
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy người dùng theo ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const getRoleUser = async (req, res) => {
  try {
    // Tìm tất cả người dùng có role là 'user'
    const users = await User.findAll({
      where: {
        role: 'user'
      }
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    res.status(200).json(users);  // Trả về danh sách người dùng
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;  // Lấy ID người dùng từ URL

    // Tìm người dùng cần xóa
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Xóa người dùng
    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;  // Lấy ID người dùng từ URL
    const { name, gender, email, avatar, password, role } = req.body;  // Thông tin mới cần cập nhật

    // Tìm người dùng cần cập nhật
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cập nhật thông tin người dùng
    const updatedUser = await user.update({
      name,
      gender,
      email,
      avatar,
      password,
      role
    });

    res.status(200).json(updatedUser);  // Trả về thông tin người dùng sau khi cập nhật
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


module.exports = { addUser, getUserById, getRoleUser, deleteUser, updateUser};
