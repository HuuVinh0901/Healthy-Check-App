const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const userController = require('../controllers/userController');
const stepController = require('../controllers/stepController');
const sleepController = require('../controllers/sleepController');
const nutritionController = require('../controllers/nutritionController');
const authController = require('../controllers/authController')
const cycleController = require('../controllers/cycleController')
const blogController = require('../controllers/blogController')
const authorize = require('../middlewares/authMiddleware');
const changePassword = require('../controllers/changePassword')
// Routes cho User
router.post('/users', userController.addUser);
router.get('/users/:id', userController.getUserById);
router.get('/users', userController.getRoleUser);
router.delete('/users/:id', userController.deleteUser);
router.put('/users/:id', userController.updateUser);
// Routes cho Step
router.post('/steps', stepController.createStep);
router.get('/steps/:userId/:date', stepController.getStepsByUser);
router.get('/steps/:userId', stepController.getAllStepsByUser);
// Routes cho Sleep
router.post('/sleeps', sleepController.createSleep);
router.get('/sleeps/:userId/', sleepController.getSleep);

// Routes cho Nutrition
router.post('/nutritions', nutritionController.createNutrition);
router.get('/nutritions/:userId/:date', nutritionController.getNutrition);

router.post('/login', authController.login);

router.post('/cycle', cycleController.addCycle)
router.get('/cycle/:userId', cycleController.getCyclesByUser)
router.delete('/cycle/:id', cycleController.deleteCycle);

router.get('/blog', blogController.getAllBlogs)
router.delete('/blog/:id', blogController.deleteBlog)
router.post('/blog', blogController.addBlog)

router.post('/changepass',changePassword.changePassword)

router.get('/admin-dashboard', authorize('admin'), (req, res) => {
    res.json({ message: 'Welcome to Admin Dashboard' });
});

router.get('/user-dashboard', authorize('user'), (req, res) => {
    res.json({ message: `Welcome ${req.user.role} to User Dashboard` });
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadFolder = path.join(__dirname, '../uploads');
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `user_${timestamp}${ext}`); // Tự động lấy đuôi mở rộng của tệp
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'));
        }
    },
});



router.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file); // In ra thông tin tệp đã tải lên
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});
module.exports = router;
