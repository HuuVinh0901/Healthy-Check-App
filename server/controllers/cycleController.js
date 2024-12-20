const Cycle = require('../models/cycle'); // Import model Cycle
const User = require('../models/user'); // Import model User

const addCycle = async (req, res) => {
  try {
    const { userId, startDate,endDate, cycleLength } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const cycle = await Cycle.create({
      userId,
      startDate,
      endDate,
      cycleLength,
    });

    res.status(201).json(cycle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getCyclesByUser = async (req, res) => {
  try {
    const cycles = await Cycle.findAll({
      where: { userId: req.params.userId }
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
const deleteCycle = async (req, res) => {
  const { id } = req.params;

  try {
      const cycle = await Cycle.findByPk(id);

      if (!cycle) {
          return res.status(404).json({ message: 'Cycle not found' });
      }

      await cycle.destroy();
      res.status(200).json({ message: 'Cycle deleted successfully' });
  } catch (error) {
      console.error('Error deleting cycle:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = { addCycle, getCyclesByUser, getLatestCycle ,deleteCycle};
