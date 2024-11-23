const Step = require('../models/step');

// Tạo bản ghi bước đi mới
const createStep = async (req, res) => {
  try {
    const { userId, steps, date } = req.body;
    const step = await Step.create({ userId, steps, date });
    res.status(201).json(step);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStepsByUser = async (req, res) => {
  // Lấy userId từ params vì nó được truyền qua URL
  const { userId, date } = req.params;

  try {
    // Truy vấn bảng Step để lấy số bước của người dùng tại một ngày cụ thể
    const steps = await Step.findOne({ where: { userId: userId, date: date } });

    // Nếu tìm thấy bước, trả về thông tin
    if (steps) {
      res.json({ steps: steps.steps, date: steps.date });
    } else {
      // Nếu không tìm thấy bước nào cho người dùng, trả về mã 404
      res.status(404).json({ message: 'No steps found for this user on this date' });
    }
  } catch (error) {
    // Xử lý lỗi nếu có vấn đề với truy vấn cơ sở dữ liệu
    res.status(500).json({ error: error.message });
  }
};
const getAllStepsByUser = async (req, res) => {
  // Lấy userId từ params vì nó được truyền qua URL
  const { userId } = req.params;

  try {
    // Dùng findAll nếu muốn lấy tất cả các bước cho người dùng
    const steps = await Step.findAll({ where: { userId: userId } });

    // Nếu tìm thấy các bước, trả về thông tin
    if (steps.length > 0) {
      // Trả về dữ liệu các bước dưới dạng mảng
      res.json({ steps: steps });
    } else {
      // Nếu không tìm thấy bước nào cho người dùng, trả về mã 404
      res.status(404).json({ message: 'No steps found for this user' });
    }
  } catch (error) {
    // Xử lý lỗi nếu có vấn đề với truy vấn cơ sở dữ liệu
    res.status(500).json({ error: error.message });
  }
};




module.exports = { createStep, getStepsByUser, getAllStepsByUser };
