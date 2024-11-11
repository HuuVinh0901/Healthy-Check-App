const Cycle = require('../models/cycle'); // Import model Cycle
const User = require('../models/user'); // Import model User

// Thêm chu kỳ mới cho người dùng
const addCycle = async (req, res) => {
  try {
    const { userId, start_date } = req.body;

    // Kiểm tra xem người dùng có tồn tại hay không
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Tạo chu kỳ mới cho người dùng
    const cycle = await Cycle.create({
      user_id: userId,
      start_date,
    });

    res.status(201).json(cycle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getCyclesByUser = async (req, res) => {
  try {
    const cycles = await Cycle.findAll({
      where: { userId: req.params.userId}
    });
    if (cycles.length === 0) {
      return res.status(404).json({ message: 'No sleep data found' });
    }
    res.status(200).json(cycles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy chu kỳ gần nhất của người dùng để tính toán chu kỳ tiếp theo
const getLatestCycle = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Tìm chu kỳ gần nhất của người dùng
    const latestCycle = await Cycle.findOne({
      where: { user_id: userId },
      order: [['start_date', 'DESC']],
    });

    if (!latestCycle) {
      return res.status(404).json({ message: 'No cycle found for this user' });
    }

    res.status(200).json(latestCycle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { addCycle, getCyclesByUser, getLatestCycle };
