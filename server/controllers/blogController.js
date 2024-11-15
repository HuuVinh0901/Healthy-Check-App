const Blog = require('../models/blog'); // Import model Blog
const User = require('../models/user'); // Import model User

// Thêm blog mới
const addBlog = async (req, res) => {
  try {
    const { type, title, content, img, userId } = req.body;

    // Kiểm tra nếu userId không tồn tại
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Tạo blog mới
    const blog = await Blog.create({
      type,
      title,
      content,
      img,
      userId,
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa blog theo ID
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm blog theo ID
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Xóa blog
    await blog.destroy();

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy danh sách tất cả blog
const getAllBlogs = async (req, res) => {
  try {
    // Lấy tất cả blog cùng thông tin của user liên quan
    const blogs = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'], 
        },
      ],
    });

    res.status(200).json(blogs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { addBlog, deleteBlog, getAllBlogs };
