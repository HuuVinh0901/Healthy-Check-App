const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Đường dẫn thư mục cần tạo
const directoryPath = path.join(__dirname, 'upload','avatar');

// Kiểm tra và tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
    console.log('Directory created:', directoryPath);
} else {
    console.log('Directory already exists:', directoryPath);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Destination Middleware - Saving to:', avatarDir);
        cb(null, avatarDir);
    },
    filename: (req, file, cb) => {
        const userId = req.body.userId;
        console.log('Filename Middleware - Received:', { userId, file });
        if (!userId) {
            console.error('Error: Missing userId');
            return cb(new Error('Missing userId in request body'), null);
        }
        cb(null, `user${userId}.jpeg`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        console.log('File Filter Middleware - Checking file:', file);
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            console.error('Invalid file type:', file.mimetype);
            cb(new Error('Only images are allowed'));
        }
    },
});

module.exports = upload;
