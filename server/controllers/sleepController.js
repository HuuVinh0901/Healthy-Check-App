const Sleep = require('../models/sleep');

// Tạo bản ghi giấc ngủ mới
const createSleep = async (req, res) => {
  try {
    const { userId, sleepDuration, quality, date } = req.body;
    const sleep = await Sleep.create({ userId, sleepDuration, quality, date });
    res.status(201).json(sleep);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getSleep = async (req, res) => {
  try {
    const sleep = await Sleep.findAll({
      where: { userId: req.params.userId}
    });
    if (sleep.length === 0) {
      return res.status(404).json({ message: 'No sleep data found' });
    }
    res.status(200).json(sleep);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createSleep, getSleep };
