const express = require('express');
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const userController = require('../controllers/userController');
const stepController = require('../controllers/stepController');
const sleepController = require('../controllers/sleepController');
const nutritionController = require('../controllers/nutritionController');
const authController = require('../controllers/authController')
const cycleController = require('../controllers/cycleController')
const blogController = require('../controllers/blogController')
const authorize = require('../middlewares/authMiddleware');
const changePassword = require('../controllers/changePassword')
const User = require('../models/user');
const noteController=require('../controllers/noteController')
// Routes cho User
router.post('/users', userController.addUser);
router.get('/users/:id', userController.getUserById);
router.get('/users', userController.getRoleUser);
router.delete('/users/:id', userController.deleteUser);
router.put('/users/:id', userController.updateUser);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads'); // Đường dẫn đến thư mục uploads
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir); // Tạo thư mục nếu chưa tồn tại
        }
        cb(null, uploadDir); // Chỉ định thư mục đích
    },
    filename: (req, file, cb) => {
        // Tạo tên file với ngày giờ hiện tại
        const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Thời gian dưới dạng chuỗi không dấu
        const fileName = `avatar_${timestamp}_${file.originalname}`;
        cb(null, fileName); // Tên file
    }
});

// Khởi tạo multer với cấu hình
const upload = multer({ storage: storage });

// API upload ảnh
router.post('/users/upload', upload.single('avatar'), async (req, res) => {
    console.log('Request body:', req.body); // Kiểm tra body của request (chắc chắn là FormData)
    console.log('File uploaded:', req.file);
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const filePath = `/uploads/${req.file.filename}`; // Đường dẫn file

        // Lưu đường dẫn ảnh vào cơ sở dữ liệu
        const userId = req.body.userId; // userId từ body request (hoặc từ session, JWT token)
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cập nhật avatar của người dùng
        await user.update({ avatar: filePath });

        res.status(200).json({ message: 'Avatar uploaded successfully!', filePath });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});


// Routes cho Step
router.post('/steps', stepController.createStep);
router.get('/steps/:userId/:date', stepController.getStepsByUser);
router.get('/steps/:userId', stepController.getAllStepsByUser);
// Routes cho Sleep
router.post('/sleeps', sleepController.createSleep);
router.get('/sleeps/:userId/', sleepController.getSleep);

router.post('/note',noteController.addNote)
router.delete('/note/:id',noteController.deleteNote)
router.get('/note/:userId',noteController.getNotesByUser)
// Routes cho Nutrition
router.post('/nutritions', nutritionController.createNutrition);
router.get('/nutritions/:userId/:date', nutritionController.getNutrition);
router.get('/nutritions/:userId', nutritionController.getAllAllNutri);
router.post('/login', authController.login);

router.post('/cycle', cycleController.addCycle)
router.get('/cycle/:userId', cycleController.getCyclesByUser)
router.delete('/cycle/:id', cycleController.deleteCycle);

router.get('/blog', blogController.getAllBlogs)
router.delete('/blog/:id', blogController.deleteBlog)
router.post('/blog', blogController.addBlog)

router.post('/changepass', changePassword.changePassword)

router.get('/admin-dashboard', authorize('admin'), (req, res) => {
    res.json({ message: 'Welcome to Admin Dashboard' });
});

router.get('/user-dashboard', authorize('user'), (req, res) => {
    res.json({ message: `Welcome ${req.user.role} to User Dashboard` });
});




router.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file); // In ra thông tin tệp đã tải lên
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});
module.exports = router;
