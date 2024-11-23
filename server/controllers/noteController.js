const Note = require('../models/note'); // Import model Note
const User = require('../models/user'); // Import model User

// Thêm note mới
const addNote = async (req, res) => {
  try {
    const { userId, title, date, description } = req.body;

    // Kiểm tra nếu userId không tồn tại
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const note = await Note.create({
      userId,
      title,
      date,
      description,
    });
    res.status(201).json({note
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa note theo ID
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm note theo ID
    const note = await Note.findByPk(id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Xóa note
    await note.destroy();

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả note của một user cụ thể
const getNotesByUser = async (req, res) => {
  try {
    const { userId } = req.params;  // Lấy userId từ params

    // Kiểm tra nếu userId không tồn tại
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Lấy tất cả note của user này
    const notes = await Note.findAll({
      where: { userId },  // Lọc các ghi chú theo userId
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],  // Chỉ lấy các thông tin cần thiết từ User
        },
      ],
    });

    res.status(200).json(notes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { addNote, deleteNote, getNotesByUser };
