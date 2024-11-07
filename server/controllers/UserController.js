const User = require('../models/User'); // Import model User

const addUser = async (req, res) => {
  try {
    const user = await User.create({
      name: 'Jane Doe',
      gender: 'Female',
      age: 28,
      avatar: 'path_to_avatar_image',
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { addUser };
