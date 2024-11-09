const Nutrition = require('../models/nutrition');

// Tạo bản ghi dinh dưỡng mới
const createNutrition = async (req, res) => {
  try {
    const { userId, calories, protein, carbs, fats, date } = req.body;
    const nutrition = await Nutrition.create({ userId, calories, protein, carbs, fats, date });
    res.status(201).json(nutrition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy thông tin dinh dưỡng của người dùng trong một ngày
const getNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findAll({
      where: { userId: req.params.userId, date: req.params.date }
    });
    if (nutrition.length === 0) {
      return res.status(404).json({ message: 'No nutrition data found' });
    }
    res.status(200).json(nutrition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createNutrition, getNutrition };
