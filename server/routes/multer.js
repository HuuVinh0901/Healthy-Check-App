const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadFolder = path.join(__dirname, '../uploads');

        // Kiểm tra và tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, { recursive: true });
        }

        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const ext = path.extname(file.originalname);
        cb(null, `user_${timestamp}${ext}`);
    },
});
const upload = multer({ storage });

// Route to upload a file
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

module.exports = router;
