const User = require('../models/user'); // Import model User

const addUser = async (req, res) => {
  try {
    const { name, gender, email, avatar, password } = req.body;

    // Tạo người dùng mới với mật khẩu đã được mã hóa
    const user = await User.create({
      name,
      gender,
      email,
      password,  // Mật khẩu sẽ được mã hóa trong model
      avatar,
    });

    res.status(201).json(user); 
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const getUser = async (req, res) => {
  try {
    
    const userId = req.params.id;

    
    const user = await User.findById(userId);

    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Trả về người dùng nếu tìm thấy
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports = { addUser,getUser };
