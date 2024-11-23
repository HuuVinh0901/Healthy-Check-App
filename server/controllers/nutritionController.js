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
const getAllAllNutri = async (req, res) => {
  // Lấy userId từ params vì nó được truyền qua URL
  const { userId } = req.params;

  try {
    // Dùng findAll nếu muốn lấy tất cả các bước cho người dùng
    const nutrition = await Nutrition.findAll({ where: { userId: userId } });

    // Nếu tìm thấy các bước, trả về thông tin
    if (nutrition.length > 0) {
      // Trả về dữ liệu các bước dưới dạng mảng
      res.json({ nutrition: nutrition });
    } else {
      // Nếu không tìm thấy bước nào cho người dùng, trả về mã 404
      res.status(404).json({ message: 'No nutrition found for this user' });
    }
  } catch (error) {
    // Xử lý lỗi nếu có vấn đề với truy vấn cơ sở dữ liệu
    res.status(500).json({ error: error.message });
  }
};
module.exports = { createNutrition, getNutrition,getAllAllNutri };
